(function() {
  async function popup() {
    await window['yt++'].waitForOptional(() => document.getElementsByTagName('ytd-consent-bump-v2-lightbox')[0] != null);

    const popup = document.getElementsByTagName('ytd-consent-bump-v2-lightbox')[0];
    if (popup == null) { return; }

    const rejectBtn = Array.from(popup.getElementsByTagName('yt-button-shape')).find(btn => btn.innerText === 'Reject all');
    if (rejectBtn == null) { return; }

    rejectBtn.getElementsByTagName('button')[0].click();
  }

  async function consentPage() {
    const button = Array.from(document.getElementsByTagName('button')).find(btn => btn.innerText === 'REJECT ALL');
    if (button == null) { return; }

    button.click();
  }

  const url = new URL(window.location.href);
  if (url.hostname.startsWith('consent.youtube')) {
    consentPage();
  } else {
    popup();
  }
}());