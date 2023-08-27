(async function() {
  await window['yt++'].waitForOptional(() => document.getElementsByClassName('ytp-chrome-bottom')[0] != null);

  const bottom = document.getElementsByClassName('ytp-chrome-bottom')[0];
  if (bottom == null) { return; }
  const bottomHeight = bottom.getBoundingClientRect().height;

  const container = bottom.getElementsByClassName('ytp-progress-bar-container')[0];
  if (container == null) { return; }
  const containerHeight = container.getBoundingClientRect().height;

  const style = document.createElement('style');
  style.textContent = `
.ytp-autohide .ytp-chrome-bottom {
  opacity: 1 !important;
  bottom: -${bottomHeight - containerHeight}px;
}
`;
  document.head.appendChild(style);
}());