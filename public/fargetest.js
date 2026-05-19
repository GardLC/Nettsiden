const palette = {
  sage:   '#B6B798',
  sand:   '#EDDFCD',
  oker:   '#E8C08D',
  mose:   '#ABB087',
  oliven: '#514D34',
};

const seksjoner = {
  hero:          '.hero',
  bro:           '.innledning',
  monster:       '.monster',
  tilnaerming:   '.tilnaerming',
  slikJobberJeg: '.slik-jobber-vi',
  kontakt:       '.cta',
};

// UI
const panel = document.createElement('div');
panel.style.cssText = 'position:fixed;top:1rem;right:1rem;background:#fff;padding:1rem;z-index:9999;font-family:monospace;font-size:13px;border:1px solid #ccc;display:flex;flex-direction:column;gap:0.5rem;';

Object.entries(seksjoner).forEach(([navn, selector]) => {
  const row = document.createElement('div');
  row.style.display = 'flex';
  row.style.gap = '0.5rem';
  row.style.alignItems = 'center';

  const label = document.createElement('span');
  label.textContent = navn;
  label.style.width = '120px';

  const select = document.createElement('select');
  Object.entries(palette).forEach(([key, val]) => {
    const opt = document.createElement('option');
    opt.value = val;
    opt.textContent = key;
    select.appendChild(opt);
  });

  select.addEventListener('change', () => {
    document.querySelector(selector).style.backgroundColor = select.value;
  });

  row.appendChild(label);
  row.appendChild(select);
  panel.appendChild(row);
});

document.body.appendChild(panel);
