#!/usr/bin/env bash
# Richtet die Neuer-Tab-Erweiterung ein:
#   1. lädt die Laufzeit für die Spracherkennung (Transformers.js + ONNX Runtime)
#   2. lädt das Whisper-Modell (~77 MB) für die lokale Spracheingabe
#   3. lädt die Symbole für das Apps-Menü (offizielle Google-Produktsymbole)
#   4. baut extension/newtab.html und extension/newtab.js aus startpage.html
# Bereits vorhandene Dateien werden nicht erneut geladen.
set -euo pipefail
cd "$(dirname "$0")"

EXT=extension
TRANSFORMERS_VERSION=3.8.1
MODEL=Xenova/whisper-base

# Datei nur laden, wenn sie noch fehlt: download <ziel> <url>
download() {
  if [[ -s "$1" ]]; then return; fi
  mkdir -p "$(dirname "$1")"
  echo "  ↓ $1"
  curl -fL --progress-bar -o "$1.part" "$2"
  mv "$1.part" "$1"
}

echo "Laufzeit für die Spracherkennung …"
CDN="https://cdn.jsdelivr.net/npm/@huggingface/transformers@$TRANSFORMERS_VERSION/dist"
for file in transformers.min.js ort-wasm-simd-threaded.jsep.mjs ort-wasm-simd-threaded.jsep.wasm; do
  download "$EXT/vendor/$file" "$CDN/$file"
done

echo "Whisper-Modell ($MODEL) …"
HF="https://huggingface.co/$MODEL/resolve/main"
for file in config.json generation_config.json preprocessor_config.json tokenizer.json \
            tokenizer_config.json onnx/encoder_model_quantized.onnx onnx/decoder_model_merged_quantized.onnx; do
  download "$EXT/models/$MODEL/$file" "$HF/$file"
done

echo "Symbole für das Apps-Menü …"
ICONS="https://www.gstatic.com/images/branding/product/2x"
while read -r name file; do
  download "$EXT/icons/apps/$name.png" "$ICONS/$file"
done <<'LIST'
google googleg_48dp.png
gmail gmail_2020q4_48dp.png
drive drive_2020q4_48dp.png
photos photos_48dp.png
calendar calendar_2020q4_48dp.png
translate translate_48dp.png
maps maps_48dp.png
docs docs_2020q4_48dp.png
sheets sheets_2020q4_48dp.png
slides slides_2020q4_48dp.png
keep keep_2020q4_48dp.png
meet meet_2020q4_48dp.png
youtube youtube_96in128dp.png
news news_48dp.png
contacts contacts_48dp.png
gemini gemini_48dp.png
LIST

./build-extension.sh
echo
echo "Fertig. Jetzt in Helium/Chrome unter chrome://extensions den Entwicklermodus"
echo "einschalten und den Ordner »$(pwd)/$EXT« als entpackte Erweiterung laden."
