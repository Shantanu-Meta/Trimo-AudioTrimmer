import { AudioLines, MoveRight, Pause, PlayIcon, Scissors, Trash } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const AudioPlayer = ({
  audioData,
  trimRanges,
  onTrimRangesChange,
  duration,
  setDuration,
}) => {
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
      <div className="controls flex items-center mb-2 flex-wrap justify-between p-[1rem] md:p-0">
        <button
          onClick={togglePlayPause}
          className={`play-pause-button py-2 px-4 mr-5 text-white border-none rounded-lg cursor-pointer w-[5rem] md:w-[7rem] grid place-content-center  max-w-xs font-semibold ${
            isPlaying ? "bg-orange-500" : "bg-green-500"
          }`}
        >
          {isPlaying ? <Pause/> : <PlayIcon/>}
        </button>
        <div className="current-time text-lg text-center">
          <AudioLines className="inline-block mr-1"/> : {currentTime.toFixed(2)}s / {duration.toFixed(2)}s
        </div>
      </div>

      <div className="timeline-container mt-6">
            <p className="mb-5 text-[1rem]">Add multiple ranges to trim </p>
        {trimRanges.map((timeLine, index) => (
          <div
            key={index}
            className="timeline flex flex-wrap items-center justify-center gap-5 mb-4"
          >
            <div className="flex py-2 bg-[#49414194] rounded-lg shadow-md text-white">
              <input
                type="text"
                value={Math.floor(timeLine.start / 60)
                  .toString()
                  .padStart(2, "0")}
                onChange={(e) =>
                  updateTimeLine(index, "start", e.target.value, "min")
                }
                placeholder="Min"
                className="w-[1.5rem] md:w-16 text-center bg-transparent outline-none focus:ring-0"
              />
              :
              <input
                type="text"
                value={Math.floor(timeLine.start % 60)
                  .toString()
                  .padStart(2, "0")}
                onChange={(e) =>
                  updateTimeLine(index, "start", e.target.value, "sec")
                }
                placeholder="Sec"
                className="w-[1.5rem] md:w-16 text-center bg-transparent outline-none focus:ring-0"
              />
              :
              <input
                type="text"
                value={Math.floor((timeLine.start % 1) * 1000)
                  .toString()
                  .padStart(3, "0")}
                onChange={(e) =>
                  updateTimeLine(index, "start", e.target.value, "ms")
                }
                placeholder="MS"
                className="w-[2.5rem] md:w-16 text-center bg-transparent outline-none focus:ring-0"
              />
            </div>
            <span><MoveRight className="inline-block w-4 h-4"/></span>
            <div className="flex py-2 bg-[#49414194] rounded-lg shadow-md text-white">
              <input
                type="text"
                value={Math.floor(timeLine.end / 60)
                  .toString()
                  .padStart(2, "0")}
                onChange={(e) =>
                  updateTimeLine(index, "end", e.target.value, "min")
                }
                placeholder="Min"
                className="w-[1.5rem] md:w-16 text-center bg-transparent outline-none focus:ring-0"
              />
              :
              <input
                type="text"
                value={Math.floor(timeLine.end % 60)
                  .toString()
                  .padStart(2, "0")}
                onChange={(e) =>
                  updateTimeLine(index, "end", e.target.value, "sec")
                }
                placeholder="Sec"
                className="w-[1.5rem] md:w-16 text-center bg-transparent outline-none focus:ring-0"
              />
              :
              <input
                type="text"
                value={Math.floor((timeLine.end % 1) * 1000)
                  .toString()
                  .padStart(3, "0")}
                onChange={(e) =>
                  updateTimeLine(index, "end", e.target.value, "ms")
                }
                placeholder="MS"
                className="w-[2.5rem] md:w-16 text-center bg-transparent outline-none focus:ring-0"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={addTimeLine}
                className="w-8 h-8 sm:w-16 sm:h-auto bg-orange-500 text-white rounded-full md:rounded-lg p-2 flex items-center justify-center"
              >
                <Scissors className="h-4 w-4"/>
              </button>
              {trimRanges.length > 1 && (
                <button
                  onClick={() => removeTimeLine(index)}
                  className="w-8 h-8 sm:w-16 sm:h-auto bg-red-500 text-white rounded-full md:rounded-lg p-2 flex items-center justify-center"
                  title="Remove"
                >
                  <Trash className="h-4 w-4"/>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioPlayer;
