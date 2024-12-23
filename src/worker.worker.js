/* eslint-disable no-restricted-globals */
import { Mp3Encoder } from '@breezystack/lamejs';

self.onmessage = function (event) {
  const { audioArray, sampleRate } = event.data;

  if (!audioArray || !sampleRate) {
    console.error('Invalid audioArray or sampleRate:', audioArray, sampleRate);
    return;
  }

  console.log('Received audioArray:', audioArray);
  console.log('Received sampleRate:', sampleRate);

  // Encode trimmed audio to MP3 using LAME.js
  const mp3Data = encodeToMP3(audioArray, sampleRate);

  // Send the encoded MP3 data back to the main thread
  self.postMessage(mp3Data.buffer, [mp3Data.buffer]);
};

// Encode audio buffer to MP3 using LAME.js
function encodeToMP3(audioArray, sampleRate) {
  const encoder = new Mp3Encoder(1, sampleRate, 128); // mono, 44.1kHz, 128kbps
  const mp3Data = [];

  const samples = new Int16Array(audioArray.length);
  floatTo16BitPCM(audioArray, samples);

  const maxSamples = 1152;
  let remaining = samples.length;
  for (let i = 0; remaining > 0; i += maxSamples) {
    const mono = samples.subarray(i, i + maxSamples);
    const mp3buf = encoder.encodeBuffer(mono);
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }
    remaining -= maxSamples;
  }

  const mp3End = encoder.flush();
  if (mp3End.length > 0) {
    mp3Data.push(mp3End);
  }

  // Combine all MP3 data chunks into a single Uint8Array
  const mp3Array = new Uint8Array(mp3Data.reduce((acc, val) => acc + val.length, 0));
  let offset = 0;
  mp3Data.forEach(chunk => {
    mp3Array.set(chunk, offset);
    offset += chunk.length;
  });

  return mp3Array;
}

// Convert Float32Array to Int16Array
function floatTo16BitPCM(input, output) {
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
}