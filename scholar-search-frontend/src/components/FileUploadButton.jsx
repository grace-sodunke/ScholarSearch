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
        for (let i = 0; i < files.length; i++) {
            formData.append('pdfFiles', files[i]); // Use 'pdfFiles' as the field name for multiple files
          }

        // Make an HTTP POST request to your API endpoint
        const response = await fetch('/api/uploadDocuments', {
            method: 'POST',
            body: formData,
          });

        if (response.ok) {
            const data = await response.json();
            console.log('Upload successful!');
            // setSelectedFiles(files);
        } else {
            console.error('Upload failed:', response.error);
        }
        // You can also update your UI or state based on the response if needed
        // setSelectedFile(file);
      } catch (error) {
        // Handle any errors (e.g., show an error message)
        console.error('Upload failed:', error);
      }
    } else {
      alert('Please select one or more valid PDF files.');
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
        multiple
      />
      <Button onClick={handleUploadButtonClick} variant="outline-primary">Upload PDF</Button>
      {/* {selectedFile && <p>Selected PDF: {selectedFile.name}</p>} */}
    </div>
  );
}

export default FileUploadComponent;
