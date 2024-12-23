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
        progressColor: "#211f1fc4",
        height: 120,
        barWidth: 2,
        cursorColor: "#FF0000",
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
    <div
      className="audio-player-container"
      style={{
        fontFamily: "Arial, sans-serif",
        margin: "20px",
        maxWidth: "80vw",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <div
        ref={waveformRef}
        className="waveform"
        style={{
          border: "1px solid #ccc",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      />
      <div
        className="controls"
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={togglePlayPause}
          className="play-pause-button"
          style={{
            padding: "10px 20px",
            marginRight: "20px",
            backgroundColor: isPlaying ? "#FF4B4B" : "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            flex: "1 1 auto",
            textAlign: "center",
            maxWidth: "200px",
          }}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <div
          className="current-time"
          style={{
            fontSize: "16px",
            textAlign: "center",
          }}
        >
          Current Time: {currentTime.toFixed(2)}s / {duration.toFixed(2)}s
        </div>
      </div>

      <div className="timeline-container" style={{ marginTop: "20px" }}>
        {trimRanges.map((timeLine, index) => (
          <div
            key={index}
            className="timeline"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
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
              className="timeline-input"
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "5px",
                width: "60px",
                textAlign: "center",
              }}
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
              className="timeline-input"
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "5px",
                width: "60px",
                textAlign: "center",
              }}
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
              className="timeline-input"
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "5px",
                width: "60px",
                textAlign: "center",
              }}
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
              className="timeline-input"
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "5px",
                width: "60px",
                textAlign: "center",
              }}
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
              className="timeline-input"
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "5px",
                width: "60px",
                textAlign: "center",
              }}
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
              className="timeline-input"
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "5px",
                width: "60px",
                textAlign: "center",
              }}
            />
            <button
              onClick={addTimeLine}
              className="add-timeline-button"
              style={{
                backgroundColor: "#4CAF50",
                color: "#fff",
                padding: "5px 10px",
                borderRadius: "5px",
                cursor: "pointer",
                border: "none",
              }}
            >
              +
            </button>
            {trimRanges.length > 1 && (
              <button
                onClick={() => removeTimeLine(index)}
                className="remove-timeline-button"
                style={{
                  backgroundColor: "#FF4B4B",
                  color: "#fff",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  border: "none",
                }}
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