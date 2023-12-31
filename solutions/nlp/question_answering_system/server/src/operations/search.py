import sys
from config import TOP_K, DEFAULT_TABLE
from logs import LOGGER
from milvus_helpers import MilvusHelper
from mysql_helpers import MySQLHelper
from encode import SentenceModel


def do_search(table_name: str, question: str, model: SentenceModel, milvus_client: MilvusHelper, mysql_cli: MySQLHelper):
    try:
        if not table_name:
            table_name = DEFAULT_TABLE
        feat = model.sentence_encode([question])
        results = milvus_client.search_vectors(table_name, feat, TOP_K)
        vids = [str(x.id) for x in results[0]]
        questions = mysql_cli.search_by_milvus_ids(vids, table_name)
        distances = [x.distance for x in results[0]]
        return questions, distances
    except Exception as e:
        LOGGER.error(f" Error with search : {e}")
        sys.exit(1)


def do_get_answer(table_name, question, mysql_cli):
    try:
        if not table_name:
            table_name = DEFAULT_TABLE
        answer = mysql_cli.search_by_question(question, table_name)
        return answer
    except Exception as e:
        LOGGER.error(f" Error with search by question : {e}")
        sys.exit(1)
