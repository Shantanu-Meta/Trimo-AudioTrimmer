import React from 'react';

const FileUpload = ({ onFileUpload }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div
      className="file-upload-container"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '30vh',
        backgroundColor: '#f0f0f0',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <label
        htmlFor="file-upload"
        className="file-upload-label"
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#4CAF50',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 'bold',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
          textAlign: 'center',
          width: '100%',
          maxWidth: '300px',
        }}
      >
        <input
          id="file-upload"
          type="file"
          accept="audio/mp3"
          onChange={handleFileChange}
          style={{
            display: 'none',
          }}
        />
        <span
          className="file-upload-button"
          style={{
            display: 'inline-block',
            width: '100%',
          }}
        >
          Upload MP3
        </span>
      </label>
    </div>
  );
};

export default FileUpload;