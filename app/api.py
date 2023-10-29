from flask import Flask, request, jsonify
import app.rag_gpt4_backend as rag_gpt4_backend
import json
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
    return 'Welcome to the ScholarSearch backend'


@app.route('/api/uploadDocument', methods=['POST', 'OPTIONS'])
def upload_document():
    try:
        file_paths = []
        file_names = []
        uploaded_files = request.files.getlist('pdfFiles')
        if not uploaded_files:
            return Flask.jsonify({'error': 'No files uploaded'})

        for file in uploaded_files:
            if file and file.filename != '':
                file_path = os.path.join(
                    app.config['UPLOAD_FOLDER'], file.filename)
                file.save(file_path)
                file_paths.append(file_path)
                file_names.append(file.filename)

        rag_gpt4_backend.upload_document(file_names, file_paths)
        return jsonify({'message': f'{len(uploaded_files)} file(s) uploaded successfully'})

    except Exception as e:
        print(str(e))
        return jsonify({'error': 'File upload failed'})


@app.after_request
def add_CORS_headers(response):
    # response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.status_code = 200

    return response


@app.route('/api/querySearch', methods=['POST'])
def query_search():
    incoming_data = request.json
    summary = rag_gpt4_backend.query_search(incoming_data["query"])
    return json.dumps(summary)


if __name__ == '__main__':
    app.run(host='0.0.0.0')
