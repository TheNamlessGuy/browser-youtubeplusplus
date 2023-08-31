(async function() {
  const shouldBeChecked = new URL(document.currentScript.src).searchParams.get('value') === 'true';

  await window['yt++'].waitForOptional(() => document.getElementsByClassName('ytp-autonav-toggle-button-container')[0] != null);

  const container = document.getElementsByClassName('ytp-autonav-toggle-button-container')[0];
  if (container == null) { return; }

  while (true) {
    const checked = container.getElementsByClassName('ytp-autonav-toggle-button')[0].getAttribute('aria-checked') === 'true';
    if (checked === shouldBeChecked) {
      break;
    } else {
      container.parentElement.click();
      await window['yt++'].timeout();
    }
  }
}());