import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';

function FileUploadComponent() {
//   const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null); // Create the file input ref

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      try {
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('pdfFile', file); // 'pdfFile' is the name of the field in your API

        // Make an HTTP POST request to your API endpoint
        const response = await fetch('/api/uploadDocument', {
            method: 'POST',
            body: formData, // Set the FormData object as the HTTP request body
        });

        // Handle the response from your API (e.g., show a success message)
        console.log(response);

        // You can also update your UI or state based on the response if needed
        // setSelectedFile(file);
      } catch (error) {
        // Handle any errors (e.g., show an error message)
        console.error('Upload failed:', error);
      }
    } else {
      alert('Please select a valid PDF file.');
    //   setSelectedFile(null);
    }
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        ref={fileInputRef}
      />
      <Button onClick={handleUploadButtonClick} variant="outline-primary">Upload PDF</Button>
      {/* {selectedFile && <p>Selected PDF: {selectedFile.name}</p>} */}
    </div>
  );
}

export default FileUploadComponent;
