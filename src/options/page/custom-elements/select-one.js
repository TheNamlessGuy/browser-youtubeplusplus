class SelectOneElement extends HTMLElement {
  _select;
  _type;

  constructor() {
    super();

    this._type = this.getAttribute('type') ?? 'nullable-string';

    const container = document.createElement('div');

    const label = document.createElement('label');
    label.innerText = this.innerText;
    container.appendChild(label);

    this._select = document.createElement('select');
    this._select.addEventListener('change', () => this.dispatchEvent(new Event('change')));
    container.appendChild(this._select);

    Array.from(this.getElementsByTagName('option')).forEach(x => this._select.appendChild(x));

    const opts = this.getAttributeNames()
      .filter(x => x.startsWith('opt-'))
      .map(x => { return {value: x.substring(4), display: this.getAttribute(x)}; });
    for (const opt of opts) {
      const option = document.createElement('option');
      option.value = opt.value;
      option.innerText = opt.display;
      this._select.appendChild(option);
    }

    const style = document.createElement('style');
    style.textContent = `div { padding: 6px 0; } select { float: right; }`;
    container.appendChild(style);

    this.attachShadow({mode: 'closed'}).appendChild(container);
  }

  get value() {
    if (this._type === 'nullable-string') {
      return this._select.value === '' ? null : this._select.value;
    } else if (this._type === 'nullable-boolean') {
      return this._select.value === '' ? null : (this._select.value === 'true');
    } else {
      throw new Error(`What? :: ${this._type}`);
    }
  }

  set value(value) {
    if (this._type === 'nullable-string') {
      this._select.value = value === null ? '' : value;
    } else if (this._type === 'nullable-boolean') {
      this._select.value = value == null ? '' : (value ? 'true' : 'false');
    } else {
      throw new Error(`What? :: ${this._type}`);
    }
  }
}