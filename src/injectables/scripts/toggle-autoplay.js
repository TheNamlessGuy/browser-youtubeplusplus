(async function() {
  const shouldBeChecked = new URL(document.currentScript.src).searchParams.get('value') === 'true';

  await window['yt++'].waitForOptional(() => document.getElementsByClassName('ytp-autonav-toggle-button-container')[0] != null);
  await window['yt++'].timeout(2000);

  const container = document.getElementsByClassName('ytp-autonav-toggle-button-container')[0];
  if (container == null) { return; }

  const checked = container.getElementsByClassName('ytp-autonav-toggle-button')[0].getAttribute('aria-checked') === 'true';
  if (checked !== shouldBeChecked) {
    container.parentElement.click();
  }
}());