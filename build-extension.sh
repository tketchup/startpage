#!/usr/bin/env bash
# Erzeugt aus startpage.html die Dateien für die Neuer-Tab-Erweiterung.
# Erweiterungsseiten verbieten Inline-JavaScript, daher wird der <script>-Block
# in extension/newtab.js ausgelagert. Nach jeder Änderung an startpage.html
# erneut ausführen und die Erweiterung unter chrome://extensions neu laden.
set -euo pipefail
cd "$(dirname "$0")"

awk '/^<script>$/{f=1; next} /^<\/script>$/{f=0; next} f' startpage.html > extension/newtab.js
awk '/^<script>$/{print "<script src=\"newtab.js\"></script>"; f=1; next}
     /^<\/script>$/{f=0; next} !f' startpage.html > extension/newtab.html

echo "Erweiterung aktualisiert: $(pwd)/extension"
