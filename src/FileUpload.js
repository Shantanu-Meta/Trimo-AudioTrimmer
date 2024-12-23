import React from 'react';

const FileUpload = ({ onFileUpload }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="flex justify-center items-center h-30vh  p-5 box-border">
      <label
        htmlFor="file-upload"
        className="inline-block py-3 px-6 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 shadow-orange-500/80 shadow-lg transform hover:scale-110 transition-all duration-300 text-center w-full max-w-xs"
      >
        <input
          id="file-upload"
          type="file"
          accept="audio/mp3"
          onChange={handleFileChange}
          className="hidden"
        />
        <span className="inline-block w-full">
          Upload MP3
        </span>
      </label>
    </div>
  );
};

export default FileUpload;