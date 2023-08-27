class SelectManyElement extends HTMLElement {
  _options = [];
  _display;

  _value = [];

  static _icons = {
    true: '☑',
    false: '☐',
  };

  _setText(value) {
    const checked = this._value.includes(value);
    const option = this._options.find(x => x.value === value);
    option.innerText = `${SelectManyElement._icons[checked]} ${option._display}`;

    this._display.innerText = `Selected: ${this._value.length}`;
  }

  constructor() {
    super();

    const container = document.createElement('div');

    let label = this.getElementsByTagName('label')[0];
    if (label == null) {
      label = document.createElement('label');
      label.innerText = this.getAttribute('label');
    }
    container.appendChild(label);

    const select = document.createElement('select');
    select.addEventListener('change', (e) => {
      const clicked = select.value;
      select.value = '';

      const idx = this._value.indexOf(clicked);
      if (idx !== -1) {
        this._value.splice(idx, 1);
      } else {
        this._value.push(clicked);
      }

      this._setText(clicked);
      this.dispatchEvent(new Event('change'));
    });
    container.appendChild(select);

    this._display = document.createElement('option');
    this._display.value = '';
    this._display.style.display = 'none';
    select.appendChild(this._display);

    Array.from(this.getElementsByTagName('option')).forEach(x => {
      x._display = x.innerText;
      this._options.push(x);
      this._setText(x.value);
      select.appendChild(x);
    })

    const opts = this.getAttributeNames()
      .filter(x => x.startsWith('opt-'))
      .map(x => { return {value: x.substring(4), display: this.getAttribute(x)}; });
    for (const opt of opts) {
      const option = document.createElement('option');
      option.value = opt.value;
      option._display = opt.display;
      this._options.push(option);
      this._setText(opt.value);
      select.appendChild(option);
    }

    const style = document.createElement('style');
    style.textContent = `div { padding: 6px 0; } select { float: right; font-family: monospace; } option { white-space: pre; }`;
    container.appendChild(style);

    this.attachShadow({mode: 'closed'}).appendChild(container);
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;

    for (const opt of this._options) {
      this._setText(opt.value);
    }
  }
}