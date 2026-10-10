# Startpage

Eine minimalistische, persönliche Startseite für Chromium-Browser (Helium, Chrome, Brave, Edge …), die jeden **neuen Tab** ersetzt. Alles läuft lokal: kein Server, kein Hintergrundprogramm, keine Tracker, keine externen Schriftarten oder Bibliotheken zur Laufzeit.

> 🤖 **Komplett mit KI erstellt.** Der gesamte Code (HTML, CSS, JavaScript, Skripte) und diese Beschreibung wurden mit [Claude Code](https://claude.com/claude-code) (Claude Opus) im Gespräch geschrieben; von mir kamen nur die Wünsche und das Feedback.

*English: A minimal, local-only new-tab page for Chromium browsers with clock skins, weather, quick links, Twitch shortcuts, bookmarks bar, Google apps menu, offline voice search (Whisper) and a Material You theme. UI is in German. Built entirely with AI (Claude Code).*

## Funktionen

- **Uhr & Datum** auf Deutsch, mit 9 Skins: Digital, Analog, Keks, Welle, Ziffern, Datum, Kissen, Pille hoch, Pille breit. Klick auf die Uhr blendet die Sekunden ein/aus.
- **Google-Suche** mit Autofokus und **Spracheingabe per Mikrofon**: Die Transkription läuft mit Whisper komplett lokal im Browser. Es verlässt kein Ton den Rechner.
- **Wetter** über [Open-Meteo](https://open-meteo.com) (ohne API-Key): Temperatur, Höchst-/Tiefstwert, Klick zeigt gefühlte Temperatur, Luftfeuchtigkeit, Wind und Regenrisiko. Ort frei wählbar (Standard: Berlin).
- **Schnellzugriffe** mit Symbolen: hinzufügen, bearbeiten, löschen; eigenes Bild per URL, Datei oder Drag & Drop.
- **Twitch-Kanäle** mit Profilbild: per „+“ hinzufügen, per „×“ entfernen.
- **Lesezeichenleiste** wie im Browser (Chromium zeigt seine eigene auf Erweiterungs-Seiten nicht an).
- **Apps-Menü** oben rechts mit Google-Diensten (Drive, Fotos, Übersetzer, Kalender, Maps, Gemini …).
- **Themes:** Standard (dunkel, Akzent Mint) und **Material You** mit Farben aus einer frei wählbaren Grundfarbe, Wetter-Widget und runden Formen.
- **Hintergrundbild** per URL oder Datei, mit einstellbarer Sichtbarkeit.
- **Einstellungen:** Schnellmenü am Zahnrad unten rechts, alles Weitere im Einstellungsfenster. Jeder Bereich lässt sich ein- und ausschalten.

## Installation (als Neuer-Tab-Seite)

Voraussetzungen: `bash` und `curl` (Linux, macOS oder WSL).

```bash
git clone https://github.com/tketchup/startpage.git
cd startpage
./setup.sh
```

`setup.sh` lädt einmalig herunter, was nicht im Repository liegt (rund 100 MB):

| Was | Woher | Wofür |
| --- | --- | --- |
| Transformers.js + ONNX Runtime | jsDelivr (npm) | Laufzeit der Spracherkennung |
| Whisper base (quantisiert) | Hugging Face (`Xenova/whisper-base`) | Spracherkennungs-Modell |
| Google-Produktsymbole | gstatic.com | Apps-Menü |

Danach baut es die Erweiterung. Dann im Browser:

1. `chrome://extensions` öffnen.
2. **Entwicklermodus** einschalten.
3. **Entpackte Erweiterung laden** und den Ordner `extension/` wählen.
4. Neuen Tab öffnen und die Frage nach der geänderten Neuer-Tab-Seite mit **Beibehalten** beantworten.

Ohne `setup.sh` funktioniert die Seite auch, nur ohne Spracheingabe und mit Anfangsbuchstaben statt App-Symbolen.

### Nur als Datei

`startpage.html` funktioniert auch direkt als `file://`-Seite (z. B. als Startseite). Dort fehlen Lesezeichenleiste, Mikrofon und die Knöpfe für Browser-Einstellungen, weil eine normale Datei darauf keinen Zugriff hat.

## Anpassen

`startpage.html` ist die einzige Quelldatei. Ganz oben im `<script>` stehen die Startwerte:

- `DEFAULT_LINKS`: Schnellzugriffe beim ersten Start
- `TWITCH_CHANNELS`: Twitch-Kanäle beim ersten Start
- `APPS`: Einträge im Apps-Menü
- `DEFAULT_PLACE`: Wetter-Ort
- `THEME_COLORS`: Standardfarben

Startwerte gelten nur beim allerersten Laden; danach zählt, was du auf der Seite einstellst (gespeichert im Browser).

Nach jeder Änderung an `startpage.html`:

```bash
./build-extension.sh
```

…und die Erweiterung unter `chrome://extensions` neu laden. (Erweiterungs-Seiten dürfen kein Inline-JavaScript ausführen, daher lagert das Skript den `<script>`-Block in `extension/newtab.js` aus.)

## Datenschutz & Netzwerk

Zur Laufzeit gehen nur diese Anfragen raus:

- **Open-Meteo**: Wetter und Ortssuche
- **unavatar.io**: Twitch-Profilbilder und Website-Symbole der Schnellzugriffe
- **Bild-URLs, die du selbst einträgst** (Hintergrund, eigene Symbole)

Alle Einstellungen bleiben im Browser (`localStorage` bzw. IndexedDB für Hintergrundbilder). Die Spracherkennung läuft vollständig offline. Hinweis: unavatar.io begrenzt anonyme Anfragen pro Tag; einmal geladene Bilder speichert der Browser zwischen.

## Projektstruktur

```
startpage.html          Quelldatei: komplette Seite (HTML, CSS, JS)
build-extension.sh      baut extension/newtab.html + newtab.js daraus
setup.sh                lädt Modell, Laufzeit und Symbole, ruft den Build auf
extension/
  manifest.json         Manifest V3, ersetzt den neuen Tab
  whisper-worker.js     Spracherkennung im Web Worker
  mic-permission.*      Seite zum einmaligen Erlauben des Mikrofons
```

## Lizenz

Der Code steht unter der [MIT-Lizenz](LICENSE).

Von `setup.sh` heruntergeladene Fremdinhalte gehören nicht zu diesem Repository und unterliegen ihren eigenen Bedingungen: Transformers.js (Apache-2.0), ONNX Runtime (MIT), Whisper (MIT). Google-Produktsymbole und -namen sind Marken von Google LLC; das Projekt steht in keiner Verbindung zu Google oder Twitch.
