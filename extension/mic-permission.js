/* Fragt einmalig die Mikrofon-Berechtigung für die Erweiterung ab.
   Auf der Neuer-Tab-Seite selbst zeigt Chromium diese Abfrage nicht an. */

const title = document.getElementById('title');
const text = document.getElementById('text');
const allowButton = document.getElementById('allow');
const settingsButton = document.getElementById('settings');

// Zurück zum neuen Tab (bzw. direkt zur Startseite, falls es keinen Verlauf gibt)
function goBack() {
  if (history.length > 1) history.back();
  else location.replace('newtab.html');
}

function showDenied() {
  title.textContent = 'Mikrofon ist blockiert';
  text.textContent = 'Helium hat den Zugriff abgelehnt. Erlaube das Mikrofon in den ' +
    'Berechtigungen dieser Erweiterung und versuche es dann erneut.';
  allowButton.textContent = 'Erneut versuchen';
  settingsButton.hidden = false;
}

allowButton.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());   // nur Erlaubnis holen
    title.textContent = 'Erlaubt ✓';
    text.textContent = 'Die Spracheingabe ist jetzt eingerichtet.';
    allowButton.hidden = true;
    setTimeout(goBack, 900);
  } catch {
    showDenied();
  }
});

settingsButton.addEventListener('click', () => {
  const site = encodeURIComponent(location.origin);
  chrome.tabs.update({ url: 'chrome://settings/content/siteDetails?site=' + site });
});

document.getElementById('back').addEventListener('click', goBack);

// Wurde schon früher abgelehnt? Dann gleich den Hinweis zeigen.
navigator.permissions?.query({ name: 'microphone' })
  .then((status) => { if (status.state === 'denied') showDenied(); })
  .catch(() => {});
