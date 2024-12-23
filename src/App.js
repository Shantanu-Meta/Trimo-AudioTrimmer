import React, { useEffect, useState } from 'react';
import './App.css';
import FileUpload from './FileUpload';
import AudioPlayer from './AudioPlayer';
import TrimButton from './TrimButton';
import DownloadButton from './DownloadButton';

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const [trimRanges, setTrimRanges] = useState([{ start: 0, end: 0 }]);
  const [trimmedAudioUrl, setTrimmedAudioUrl] = useState(null);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setTrimRanges([{ start: 0, end: 0 }]);
    setTrimmedAudioUrl(null);
  }, [audioFile]);

  // Handle file upload
  const handleFileUpload = (file) => {
    setAudioFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAudioData(objectUrl);
  };

  // Handle trim ranges update
  const handleTrimRanges = (ranges) => {
    setTrimRanges(ranges);
  };

  // Handle trimmed audio URL
  const handleTrimmedAudio = (url) => {
    setTrimmedAudioUrl(url);
  };

  return (
    <div className="App relative min-h-screen  bg-black overflow-hidden">
      {/* Neon Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-800 opacity-50 blur-3xl"></div>
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-60 blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-gradient-to-tl from-purple-500 to-indigo-600 rounded-full opacity-50 blur-3xl top-40 right-10"></div>
        <div className="absolute w-96 h-96 bg-gradient-to-bl from-teal-400 to-cyan-500 rounded-full opacity-40 blur-[100px] -bottom-10 left-20"></div>
      </div>

      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-white text-center p-5">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-wide">
          Trimo
        </h1>
        
        <div className="mt-8 w-full max-w-md">
          <FileUpload onFileUpload={handleFileUpload} />
        </div>
        {!audioFile && (
          <p className="text-xl md:text-2xl leading-relaxed mt-[2rem] ">
            Welcome! Upload your audio and start trimming with ease.
          </p>
        )}
        {audioFile && (
          <>
            <div className="mt-8">
              <AudioPlayer
                audioData={audioData}
                trimRanges={trimRanges}
                onTrimRangesChange={handleTrimRanges}
                duration={duration}
                setDuration={setDuration}
              />
            </div>
            <div className="mt-6">
              <TrimButton
                audioFile={audioFile}
                trimRanges={trimRanges}
                onTrimmedAudio={handleTrimmedAudio}
                duration={duration}
              />
            </div>
          </>
        )}

        {trimmedAudioUrl && (
          <div className="mt-6">
            <DownloadButton trimmedAudioUrl={trimmedAudioUrl} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={`${audioFile ? "relative": "absolute"} bottom-0 z-10 bg-black bg-opacity-80 text-white py-4 mt-8 w-full`}>
        <div className="text-center text-sm md:text-base">
          Crafted with <span className="text-red-500">&hearts;</span> by 
          <a 
            href="https://shantanu-meta.github.io/Shantanu-portfolio/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-orange-400 hover:underline ml-1">
            Shantanu
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
