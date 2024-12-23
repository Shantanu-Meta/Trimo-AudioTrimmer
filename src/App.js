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
    const objectUrl =  URL.createObjectURL(file);
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
    <div className="App">
      <h1>Audio Trimmer App</h1>

      <FileUpload onFileUpload={handleFileUpload} />
      {audioFile && (
        <>
          <AudioPlayer
            audioData={audioData}
            trimRanges={trimRanges}
            onTrimRangesChange={handleTrimRanges}
            duration={duration}
            setDuration={setDuration}
          />
          <TrimButton
            audioFile={audioFile}
            trimRanges={trimRanges}
            onTrimmedAudio={handleTrimmedAudio}
            duration={duration}
          />
        </>
      )}
      {trimmedAudioUrl && <DownloadButton trimmedAudioUrl={trimmedAudioUrl} />}
    </div>
  );
}

export default App;
