from flask import Flask, request, jsonify
import rag_gpt4_api, json
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return 'Welcome to the ScholarSearch backend'

@app.route('/api/uploadDocument', methods=['POST','OPTIONS'])
def upload_document():
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['mode'] = 'no-cors'
        return response
    else:
        incoming_data = request.json
        print("Received data:", incoming_data)
        rag_gpt4_api.upload_document(incoming_data['file-name'])
    return jsonify({"success": True})

@app.after_request
def add_CORS_headers(response):
    # response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.status_code = 200

    return response

@app.route('/api/querySearch', methods=['POST'])
def query_search():
    incoming_data = request.json
    summary = rag_gpt4_api.query_search(incoming_data["query"])
    return json.dumps(summary)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
