(async function() {
  // Stop hotkey
  document.addEventListener('keydown', (e) => {
    if (e.key === 'N') {
      e.stopPropagation();
    }
  }, true);

  await window['yt++'].waitForOptional(() => document.getElementsByClassName('ytp-next-button')[0] != null);

  const btn = document.getElementsByClassName('ytp-next-button')[0];
  if (btn == null) { return; }

  btn.style.display = 'none';
}());