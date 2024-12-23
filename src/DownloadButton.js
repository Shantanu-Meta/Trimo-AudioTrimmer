import React from 'react';

const DownloadButton = ({ trimmedAudioUrl }) => {
  return (
    <div className="flex justify-center items-center my-5">
      <a
        href={trimmedAudioUrl}
        download="trimmed_audio.mp3"
        className="inline-block py-2 px-4 text-lg text-white bg-blue-500 rounded-lg text-center cursor-pointer transition duration-300 ease-in-out hover:bg-blue-700"
      >
        Download Trimmed Audio
      </a>
    </div>
  );
};

export default DownloadButton;