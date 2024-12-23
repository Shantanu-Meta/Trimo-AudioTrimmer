import React, { useState } from "react";
import Worker from "./worker.worker.js";

const TrimButton = ({ audioFile, trimRanges, onTrimmedAudio, duration }) => {
  const [isTrimming, setIsTrimming] = useState(false);

  const handleTrim = () => {
    setIsTrimming(true);

    // Set Trim Ranges
    const validRanges = trimRanges
      .filter(
        (range) =>
          range.end <= duration &&
          range.start <= duration &&
          range.start < range.end
      )
      .sort((a, b) => a.start - b.start);

    const mergedRanges = [];
    validRanges.forEach((range) => {
      if (mergedRanges.length === 0) {
        mergedRanges.push(range);
      } else {
        const lastRange = mergedRanges[mergedRanges.length - 1];
        if (range.start <= lastRange.end) {
          lastRange.end = Math.max(lastRange.end, range.end);
        } else {
          mergedRanges.push(range);
        }
      }
    });

    const reader = new FileReader();
    reader.onload = function (e) {
      const audioData = e.target.result;

      // Decode the audio file into an audio buffer
      let audioContext;
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      } catch (error) {
        console.error("Error creating AudioContext:", error);
        setIsTrimming(false);
        return;
      }

      audioContext
        .decodeAudioData(audioData)
        .then((audioBuffer) => {
          // Process trimming logic
          const trimmedAudioBuffer = trimAudio(
            audioBuffer,
            mergedRanges,
            audioContext
          );

          // Convert AudioBuffer to Float32Array
          const trimmedAudioArray = trimmedAudioBuffer.getChannelData(0);

          // Create a new worker for encoding the trimmed audio
          const worker = new Worker();
          worker.onmessage = (event) => {
            const mp3Data = new Uint8Array(event.data);

            // Convert MP3 data to a Blob and create a URL for it
            const mp3Blob = new Blob([mp3Data], { type: "audio/mp3" });
            const mp3Url = URL.createObjectURL(mp3Blob);
            onTrimmedAudio(mp3Url);
            setIsTrimming(false);
          };

          // Send trimmed audio array and sample rate to the worker for encoding
          worker.postMessage(
            {
              audioArray: trimmedAudioArray,
              sampleRate: trimmedAudioBuffer.sampleRate,
            },
            [trimmedAudioArray.buffer]
          );
        })
        .catch((error) => {
          console.error("Error decoding audio file:", error);
          setIsTrimming(false);
        });
    };

    reader.readAsArrayBuffer(audioFile);
  };

  // Trim the audio buffer based on the provided ranges
  function trimAudio(audioBuffer, mergedRanges, audioContext) {
    const sampleRate = audioBuffer.sampleRate;
    const totalSamples = audioBuffer.length;
    let trimmedBuffers = [];

    let currentSample = 0;

    mergedRanges.forEach((range) => {
      const startSample = Math.floor(range.start * sampleRate);
      const endSample = Math.floor(range.end * sampleRate);

      if (
        startSample < 0 ||
        endSample > totalSamples ||
        startSample >= endSample
      ) {
        console.warn(`Invalid range: ${range.start} to ${range.end}`);
        return; // Skip invalid ranges
      }

      // Extract the part of the audioBuffer before the range
      if (currentSample < startSample) {
        const trimmedBuffer = audioBuffer
          .getChannelData(0)
          .slice(currentSample, startSample);
        trimmedBuffers.push(trimmedBuffer);
      }

      // Move the current sample pointer to the end of the range
      currentSample = endSample;
    });

    // Extract the part of the audioBuffer after the last range
    if (currentSample < totalSamples) {
      const trimmedBuffer = audioBuffer
        .getChannelData(0)
        .slice(currentSample, totalSamples);
      trimmedBuffers.push(trimmedBuffer);
    }

    // Merge trimmed buffers into a new audio buffer
    const totalLength = trimmedBuffers.reduce(
      (acc, buffer) => acc + buffer.length,
      0
    );
    const mergedBuffer = audioContext.createBuffer(
      1,
      totalLength,
      audioBuffer.sampleRate
    );
    let offset = 0;
    trimmedBuffers.forEach((buffer) => {
      mergedBuffer.copyToChannel(buffer, 0, offset);
      offset += buffer.length;
    });

    return mergedBuffer;
  }

  return (
    <div style={styles.container}>
      <button onClick={handleTrim} disabled={isTrimming} style={styles.button}>
        {isTrimming ? "Trimming..." : "Trim Audio"}
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "5px",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.3s ease",
    textAlign: "center",
    width: "100%",
    maxWidth: "300px",
  },
};

export default TrimButton;
