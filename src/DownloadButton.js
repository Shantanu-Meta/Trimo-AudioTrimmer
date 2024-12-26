import { Download } from 'lucide-react';
import React from 'react';

const DownloadButton = ({ trimmedAudioUrl }) => {
  return (
    <div className="flex justify-center items-center my-5">
      <a
        href={trimmedAudioUrl}
        download="trimmed_audio.mp3"
        className="inline-block py-2 px-4 text-lg text-white bg-green-500 rounded-lg text-center cursor-pointer transition duration-300 ease-in-out hover:bg-green-700 w-[50vw] md:w-[30vw]"
      >
        <Download size={24} className="inline-block mr-2" /> Audio
      </a>
    </div>
  );
};

export default DownloadButton;