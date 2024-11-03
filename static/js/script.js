// Loader display logic
function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

// Drag-and-drop and file input handling
let uploader = document.getElementById('uploader');
let fileInput = document.getElementById('fileInput');

// Handle click on uploader to trigger file selection
uploader.addEventListener('click', function() {
    fileInput.click();
});

// Handle file selection
fileInput.addEventListener('change', function() {
    let file = this.files[0];
    uploadFile(file);
});

// Handle drag over
uploader.addEventListener('dragover', function(event) {
    event.preventDefault();
    uploader.classList.add('dragging');
    document.getElementById('uploadText').innerText = 'Drop the image!';
});

// Handle drag leave
uploader.addEventListener('dragleave', function(event) {
    uploader.classList.remove('dragging');
    document.getElementById('uploadText').innerText = 'Drag & drop an image here or click to select';
});

// Handle drop
uploader.addEventListener('drop', function(event) {
    event.preventDefault();
    uploader.classList.remove('dragging');
    document.getElementById('uploadText').innerText = 'Drag & drop an image here or click to select';
    
    let file = event.dataTransfer.files[0];
    uploadFile(file);
});

// Upload file
function uploadFile(file) {
    showLoader(); // Show loader while uploading

    let formData = new FormData();
    formData.append('file', file);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        hideLoader(); // Hide loader when done
        if (data.url) {
            document.getElementById('uploader').style.display = 'none';
            document.getElementById('uploadedImage').innerHTML = `<img src="${data.url}" alt="Uploaded Image" />`;
            document.getElementById('processingActions').style.display = 'flex';
            window.publicId = data.public_id;  // Store public_id for processing later
        }
    });
}

// Process image (remove background or resize)
function processImage(action) {
    fetch('/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            public_id: window.publicId,
            action: action
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.processed_url) {
            document.getElementById('processedImage').innerHTML = `<h3>Processed Image</h3><img src="${data.processed_url}" alt="Processed Image" />`;
        }
    });
}