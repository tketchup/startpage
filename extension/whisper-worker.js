/* ============================================================
   Spracherkennung (Whisper) in einem Web Worker.
   Läuft komplett lokal: Modell und WASM-Laufzeit liegen in der
   Erweiterung, es werden keine Dateien aus dem Netz geladen.

   Nachrichten von der Seite:
     { type: 'load' }                       Modell vorab laden
     { type: 'transcribe', audio }          Float32Array, 16 kHz, mono
   Antworten:
     { type: 'ready' } | { type: 'result', text } | { type: 'error', message }
   ============================================================ */
import { pipeline, env } from './vendor/transformers.min.js';

// Nur lokale Dateien verwenden, niemals Hugging Face oder ein CDN
env.allowRemoteModels = false;
env.allowLocalModels = true;
env.localModelPath = new URL('models/', import.meta.url).href;
env.useBrowserCache = false;
env.backends.onnx.wasm.wasmPaths = new URL('vendor/', import.meta.url).href;
env.backends.onnx.wasm.numThreads = 1;

const MODEL = 'Xenova/whisper-base';

let transcriber = null;

// Modell nur einmal laden; weitere Aufrufe warten auf dasselbe Promise
function load() {
  transcriber ??= pipeline('automatic-speech-recognition', MODEL, {
    dtype: 'q8',      // *_quantized.onnx
    device: 'wasm',
  });
  return transcriber;
}

self.onmessage = async ({ data }) => {
  try {
    if (data.type === 'load') {
      await load();
      self.postMessage({ type: 'ready' });
    } else if (data.type === 'transcribe') {
      const asr = await load();
      const output = await asr(data.audio, { language: 'german', task: 'transcribe' });
      self.postMessage({ type: 'result', text: output.text });
    }
  } catch (error) {
    transcriber = null;   // beim nächsten Versuch neu laden
    self.postMessage({ type: 'error', message: String(error?.message || error) });
  }
};
