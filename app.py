from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

API_USER = '1065314442'
API_SECRET = '4FKq7xTzNDoh88aPxwp3gwCBA7vtUGHb'

@app.route('/check_image', methods=['GET'])
def check_image():
    image_url = request.args.get('url')
    if not image_url:
        return jsonify({'error': 'No image URL provided'}), 400

    # Prepare parameters for SightEngine API
    params = {
        'models': 'genai',
        'api_user': API_USER,
        'api_secret': API_SECRET,
        'url': image_url
    }

    # Call SightEngine API
    try:
        response = requests.get('https://api.sightengine.com/1.0/check.json', params=params)
        data = response.json()

        if data.get('status') == 'success':
            return jsonify({
                'ai_generated_score': data['type']['ai_generated']
            }), 200
        else:
            return jsonify({'error': data.get('error', {}).get('message', 'Unknown error')}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
