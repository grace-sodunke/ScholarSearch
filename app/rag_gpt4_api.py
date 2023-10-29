from transformers import AutoModelForQuestionAnswering, AutoTokenizer, pipeline
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Milvus
from langchain.embeddings import HuggingFaceEmbeddings
from pymilvus import (
    connections, utility
)
from milvus import default_server
from huggingface_hub import login
import time
import os
import subprocess
import pandas as pd
import numpy as np
import torch
from torch.nn import functional as F
from sentence_transformers import SentenceTransformer

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())


MILVUS_PORT = 19530
MILVUS_HOST = "127.0.0.1"


def setup_server():
    # Cleanup previous data and stop server in case it is still running.
    default_server.stop()
    default_server.cleanup()

    # Start a new milvus-lite local server.
    start_time = time.time()
    default_server.start()

    end_time = time.time()
    print(f"Milvus server startup time: {end_time - start_time} sec")
    # startup time: 5.6739208698272705

    # Add wait to avoid error message from trying to connect.
    time.sleep(15)

    # Now you could connect with localhost and the given port.
    # Port is defined by default_server.listen_port.
    connections.connect(host='127.0.0.1',
                        port=default_server.listen_port,
                        show_startup_banner=True)

    # Check if the server is ready.
    print(utility.get_server_version())


docs = []


def embed_and_insert_document(file_names, file_paths):
    MAX_SEQ_LENGTH, HF_EOS_TOKEN_LENGTH, EMBEDDING_LENGTH = 0, 0, 0
    DEVICE = None

    def setup_torch():
        torch.backends.cudnn.deterministic = True
        RANDOM_SEED = 413
        torch.manual_seed(RANDOM_SEED)
        DEVICE = torch.device('cuda:3' if torch.cuda.is_available() else 'cpu')
        print(f"device: {DEVICE}")

    def load_huggingface():
        hub_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")
        login(token=hub_token)
        model_name = "BAAI/bge-base-en-v1.5"
        retriever = SentenceTransformer(model_name, device=DEVICE)
        max_seq_length = retriever.get_max_seq_length()
        eos_token_len = 1
        embed_len = retriever.get_sentence_embedding_dimension()
        return max_seq_length, eos_token_len, embed_len, model_name

    def convert_huggingface_to_langchain(model_name):
        model_kwargs = {"device": DEVICE}
        encode_kwargs = {'normalize_embeddings': True}
        lc_encoder = HuggingFaceEmbeddings(
            model_name=model_name,
            model_kwargs=model_kwargs,
            encode_kwargs=encode_kwargs
        )
        return lc_encoder

    def chunking(docs):
        chunk_size = MAX_SEQ_LENGTH - HF_EOS_TOKEN_LENGTH
        chunk_overlap = np.round(chunk_size * 0.10, 0)
        start_time = time.time()
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
        )

        chunks = []
        for i in range(len(docs)):
            for page in docs[i]:
                chunks.append(text_splitter.create_documents(
                    page.page_content,
                    metadatas=[{"source": file_names[i]}]))

        return chunks

        # chunks = text_splitter.create_documents(
        #     [p.page_content for p in pages],
        #     metadatas=[{"name": pdf_path} for p in pages])
        end_time = time.time()
        print(f"chunking time: {end_time - start_time}")
        print(
            f"type: {type(chunks)}, len: {len(chunks)}, type: {type(chunks[0])}")
        print(f"type: list of {type(chunks[0])}, len: {len(chunks)}")
        print()
        print("Looking at a sample chunk...")
        print(chunks[0].metadata)
        print(chunks[0].page_content)

    def insert_data_into_milvus():
        print("Start inserting entities")
        start_time = time.time()
        vector_store = Milvus.from_documents(
            chunks,
            embedding=lc_encoder,
            connection_args={"host": MILVUS_HOST,
                             "port": MILVUS_PORT},
        )
        end_time = time.time()
        print(
            f"LlamaIndex Milvus insert time for {len(chunks)} vectors: {end_time - start_time} seconds")
        print(f"type: {type(vector_store)}")

    setup_torch()
    MAX_SEQ_LENGTH, HF_EOS_TOKEN_LENGTH, EMBEDDING_LENGTH, model_name = load_huggingface()
    lc_encoder = convert_huggingface_to_langchain(model_name)

    for i in range(len(file_paths)):
        pages = PyPDFLoader(file_paths[i]).load()
        docs.append(pages)

    chunks = chunking(docs)
    insert_data_into_milvus()


question = 'What is the default AUTOINDEX in Milvus Client?'
query = [question]
QUERY_LENGTH = len(query[0])
print(f"query length: {QUERY_LENGTH}")
METADATA_URL = "https://pymilvus.readthedocs.io/en/latest/_modules/milvus/client/stub.html"
SEARCH_PARAMS = dict({
    "expr": "text = METADATA_URL",
})
start_time = time.time()
docs = vector_store.similarity_search(
    question,
    k=100,
    param=SEARCH_PARAMS,
    verbose=True,
)
end_time = time.time()
print(f"Milvus query time: {end_time - start_time}")
for d in docs:
    print(d.metadata)
    print(d.page_content[:100])
print(f"Count raw retrievals: {len(docs)}")

unique_sources = []
unique_texts = []
for doc in docs:
    if doc.metadata['source'] == METADATA_URL:
        if doc.page_content not in unique_texts:
            unique_texts.append(doc.page_content)
            unique_sources.append(doc.metadata['source'])
print(f"Count unique texts: {len(unique_texts)}")
[print(text) for text in unique_texts]
formatted_context = list(zip(unique_sources, unique_texts))
context = ""
for source, text in formatted_context:
    context += f"{text} "
print(len(context))

llm = "deepset/tinyroberta-squad2"
tokenizer = AutoTokenizer.from_pretrained(llm)
QA_input = {
    'question': question,
    'context': 'The quick brown fox jumped over the lazy dog'
}
nlp = pipeline('question-answering',
               model=llm,
               tokenizer=tokenizer)
result = nlp(QA_input)
print(f"Question: {question}")
print(f"Answer: {result['answer']}")

QA_input = {
    'question': question,
    'context': context,
}
nlp = pipeline('question-answering',
               model=llm,
               tokenizer=tokenizer)
result = nlp(QA_input)
print(f"Question: {question}")
print(f"Answer: {result['answer']}")


def query_search(query):
    return
