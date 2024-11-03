from flask import Flask, render_template, jsonify, request
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url 
from config import cloud_name, api_key, api_secret
from cloudinary import CloudinaryImage

app = Flask(__name__)

# Configuration       
cloudinary.config( 
   cloud_name=cloud_name,
    api_key=api_key,
    api_secret=api_secret,
    secure=True
)


@app.route("/")
def index():
    return render_template("index.html")

@app.route('/playground')
def playground():
    return render_template('playground.html')

# Upload route
@app.route('/upload', methods=['POST'])
def upload_image():
    file_to_upload = request.files['file']
    if file_to_upload:
        upload_result = cloudinary.uploader.upload(file_to_upload)
        return jsonify({
            'url': upload_result['secure_url'],
            'public_id': upload_result['public_id']
        })
    return jsonify({'error': 'No file uploaded'})

# Process image route (testing by showing the same image)
@app.route('/process', methods=['POST'])
def process_image():
    data = request.get_json()
    public_id = data.get('public_id')
    action = data.get('action')
     
    if(action == "remove_bg"):
        img_tag = CloudinaryImage(public_id).image(effect="gen_background_replace:prompt the object stand on times square new york ")
        # Find the position of the 'src' attribute
        start_pos = img_tag.find('src="') + len('src="')

        # Find the position of the closing double quote after the URL
        end_pos = img_tag.find('"', start_pos)

        # Extract the URL
        img_url = img_tag[start_pos:end_pos]
        return jsonify({
            'processed_url': img_url
        })

    elif (action == "resize"):
        img_tag = CloudinaryImage(public_id).image(gravity="auto", height=940, width=880, crop="auto")
        # Find the position of the 'src' attribute
        start_pos = img_tag.find('src="') + len('src="')

        # Find the position of the closing double quote after the URL
        end_pos = img_tag.find('"', start_pos)

        # Extract the URL
        img_url = img_tag[start_pos:end_pos]
        return jsonify({
            'processed_url': img_url
        })
        

app.run(debug=True)