import React from 'react';

const DownloadButton = ({ trimmedAudioUrl }) => {
  const buttonStyle = {
    display: 'inline-block',
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    textDecoration: 'none',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px 0',};

  return (
    <div style={containerStyle}>
      <a href={trimmedAudioUrl} download="trimmed_audio.mp3" style={buttonStyle}>
        Download Trimmed Audio
      </a>
    </div>
  );
};

export default DownloadButton;