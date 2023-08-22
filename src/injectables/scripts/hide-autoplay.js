(async function() {
  await window['yt++'].waitForOptional(() => document.getElementsByClassName('ytp-autonav-toggle-button-container')[0] != null);

  const container = document.getElementsByClassName('ytp-autonav-toggle-button-container')[0];
  if (container == null) { return; }

  container.style.display = 'none';
}());