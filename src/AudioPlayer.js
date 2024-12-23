import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const AudioPlayer = ({ audioData, trimRanges, onTrimRangesChange, duration, setDuration }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (audioData) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: getRainbowColors(),
        progressColor: "#d6c5c5c9",
        height: 120,
        barWidth: 2,
        cursorColor: "orange",
        responsive: true,
      });

      // Load audio data
      wavesurfer.current.load(audioData);

      // Set duration and handle progress
      wavesurfer.current.on("ready", () => {
        setDuration(wavesurfer.current.getDuration());
      });

      wavesurfer.current.on("audioprocess", () => {
        setCurrentTime(wavesurfer.current.getCurrentTime());
      });

      wavesurfer.current.on("finish", () => {
        setIsPlaying(false);
      });

      // Cleanup function
      return () => {
        if (wavesurfer.current) {
          wavesurfer.current.destroy();
        }
      };
    }
  }, [audioData, setDuration]);

  // Handle Play/Pause
  const togglePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(wavesurfer.current.isPlaying());
    }
  };

  const addTimeLine = () => {
    onTrimRangesChange([...trimRanges, { start: 0, end: 0 }]);
  };

  const removeTimeLine = (index) => {
    const newranges = trimRanges.filter((_, idx) => idx !== index);
    onTrimRangesChange(newranges);
  };

  const updateTimeLine = (index, type, value, part) => {
    const newranges = [...trimRanges];
    let newTimeValue = newranges[index][type];

    if (value === "" || isNaN(value)) {
      newTimeValue = 0;
    } else {
      if (part === "min") {
        newTimeValue = parseFloat(value) * 60 + (newTimeValue % 60);
      } else if (part === "sec") {
        newTimeValue = Math.floor(newTimeValue / 60) * 60 + parseFloat(value);
      } else if (part === "ms") {
        newTimeValue = Math.floor(newTimeValue);
        newTimeValue += parseInt(value) / 1000;
      }
    }

    newranges[index][type] = newTimeValue;
    onTrimRangesChange(newranges);
  };

  // Generate rainbow colors for the waveform
  const getRainbowColors = () => {
    const colors = [
      "#FF0000", // Red
      "#FF7F00", // Orange
      "#FFFF00", // Yellow
      "#00FF00", // Green
      "#0000FF", // Blue
      "#4B0082", // Indigo
      "#8B00FF", // Violet
    ];
    return colors;
  };

  return (
    <div className="audio-player-container font-sans md:w-[80vw] w-[100vw] mx-auto">
      <div
        ref={waveformRef}
        className="waveform border border-gray-300 rounded-lg mb-5"
      />
      <div className="controls flex items-center mb-2 flex-wrap justify-between">
        <button
          onClick={togglePlayPause}
          className={`play-pause-button py-2 px-4 mr-5 text-white border-none rounded-lg cursor-pointer w-[3rem] md:w-[5rem] text-center  max-w-xs font-semibold ${
            isPlaying ? "bg-orange-500" : "bg-green-500"
          }`}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <div className="current-time text-lg text-center">
          Current Time: {currentTime.toFixed(2)}s / {duration.toFixed(2)}s
        </div>
      </div>

      <div className="timeline-container mt-5">
        {trimRanges.map((timeLine, index) => (
          <div
            key={index}
            className="timeline flex items-center gap-2 mb-2 flex-wrap justify-center"
          >
            <input
              type="text"
              value={Math.floor(timeLine.start / 60)
                .toString()
                .padStart(2, "0")}
              onChange={(e) =>
                updateTimeLine(index, "start", e.target.value, "min")
              }
              placeholder="Min"
              className="timeline-input border border-gray-300 rounded-lg p-1 w-16 text-center text-black"
            />
            <input
              type="text"
              value={Math.floor(timeLine.start % 60)
                .toString()
                .padStart(2, "0")}
              onChange={(e) =>
                updateTimeLine(index, "start", e.target.value, "sec")
              }
              placeholder="Sec"
              className="timeline-input border border-gray-300 rounded-lg p-1 w-16 text-center text-black"
            />
            <input
              type="text"
              value={Math.floor((timeLine.start % 1) * 1000)
                .toString()
                .padStart(3, "0")}
              onChange={(e) =>
                updateTimeLine(index, "start", e.target.value, "ms")
              }
              placeholder="MS"
              className="timeline-input border border-gray-300 rounded-lg p-1 w-16 text-center text-black"
            />
            <span>to</span>
            <input
              type="text"
              value={Math.floor(timeLine.end / 60)
                .toString()
                .padStart(2, "0")}
              onChange={(e) =>
                updateTimeLine(index, "end", e.target.value, "min")
              }
              placeholder="Min"
              className="timeline-input border border-gray-300 rounded-lg p-1 w-16 text-center text-black"
            />
            <input
              type="text"
              value={Math.floor(timeLine.end % 60)
                .toString()
                .padStart(2, "0")}
              onChange={(e) =>
                updateTimeLine(index, "end", e.target.value, "sec")
              }
              placeholder="Sec"
              className="timeline-input border border-gray-300 rounded-lg p-1 w-16 text-center text-black"
            />
            <input
              type="text"
              value={Math.floor((timeLine.end % 1) * 1000)
                .toString()
                .padStart(3, "0")}
              onChange={(e) =>
                updateTimeLine(index, "end", e.target.value, "ms")
              }
              placeholder="MS"
              className="timeline-input border border-gray-300 rounded-lg p-1 w-16 text-center text-black"
            />
            <button
              onClick={addTimeLine}
              className="add-timeline-button w-[2rem] md:w-[5rem] bg-orange-500 text-white p-1 rounded-lg cursor-pointer border-none"
            >
              +
            </button>
            {trimRanges.length > 1 && (
              <button
                onClick={() => removeTimeLine(index)}
                className="remove-timeline-button bg-red-500 text-white p-1 rounded-lg cursor-pointer border-none"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioPlayer;