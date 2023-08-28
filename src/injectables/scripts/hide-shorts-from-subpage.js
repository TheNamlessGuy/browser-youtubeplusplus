(async function() {
  function getShortsSection() {
    return Array.from(document.getElementsByTagName('ytd-rich-section-renderer')).filter(x => x.querySelector('#title-container').innerText === 'Shorts')[0];
  }

  await window['yt++'].waitForOptional(() => getShortsSection() != null);

  const section = getShortsSection();
  if (section == null) { return; }

  section.style.display = 'none';
}());