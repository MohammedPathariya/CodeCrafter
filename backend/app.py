from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import subprocess
import uuid

app = Flask(__name__)
CORS(app)

OUTPUT_DIR = './output'
OUTPUT_FILE = 'visualization.png'  # Single output file name for now


# Serve output image statically
@app.route('/output/<filename>')
def serve_output(filename):
    return send_from_directory(OUTPUT_DIR, filename)


@app.route('/execute', methods=['POST'])
def execute_code():
    data = request.json
    code = data.get('code')
    language = data.get('language')

    if not code or language not in ['python', 'r']:
        return jsonify({'error': 'Invalid input'}), 400

    # Decide file names based on language
    code_file = 'visualization_code.py' if language == 'python' else 'visualization_code.R'
    runner_image = 'python-runner' if language == 'python' else 'r-runner'
    run_command = ["python", f"/app/output/{code_file}"] if language == 'python' else ["Rscript", f"/app/output/{code_file}"]

    code_path = os.path.join(OUTPUT_DIR, code_file)
    output_path = os.path.join(OUTPUT_DIR, OUTPUT_FILE)

    # Optional Clean Up old image if exists
    if os.path.exists(output_path):
        os.remove(output_path)

    # Write incoming code to file
    with open(code_path, 'w') as f:
        f.write(code)

    # Execute in Docker
    result = subprocess.run([
        "docker", "run", "--rm",
        "-v", f"{os.path.abspath(OUTPUT_DIR)}:/app/output",
        runner_image,
        *run_command
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)

    if result.returncode != 0:
        return jsonify({'error': 'Docker execution failed', 'details': result.stderr}), 500

    if not os.path.exists(output_path):
        return jsonify({'error': 'No output generated'}), 500

    # Success Response with dynamic timestamp to avoid cache issues
    return jsonify({
        'message': 'Success',
        'image': f'/output/{OUTPUT_FILE}?t={int(os.stat(output_path).st_mtime)}'
    })


if __name__ == '__main__':
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    app.run(debug=True, use_reloader=False)
