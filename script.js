const canvas = document.querySelector('.starfield');
const ctx = canvas.getContext('2d');
let stars = [];

function sizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  stars = Array.from({ length: Math.floor((window.innerWidth * window.innerHeight) / 8500) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 1.2 + 0.25,
    alpha: Math.random() * 0.55 + 0.16,
    phase: Math.random() * Math.PI * 2
  }));
  drawStars(0);
}

function drawStars(time) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const star of stars) {
    const shimmer = 0.75 + Math.sin(time / 1100 + star.phase) * 0.25;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220, 218, 255, ${star.alpha * shimmer})`;
    ctx.fill();
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(drawStars);
}

window.addEventListener('resize', sizeCanvas);
sizeCanvas();

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
  nav.classList.toggle('open', !isOpen);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
}));

document.querySelectorAll('[data-expand], .theory-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const content = button.dataset.expand
      ? document.getElementById(button.dataset.expand)
      : button.nextElementSibling;
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    content.hidden = open;
    const label = button.dataset.expand ? 'Descubre cómo los observamos' : 'Leer más';
    button.innerHTML = `${open ? label : 'Cerrar detalle'} <span>${open ? '＋' : '−'}</span>`;
  });
});

const planetFacts = {
  kepler: ['Kepler-186f', 'Descubierto en 2014, Kepler-186f orbita una estrella enana roja a unos 500 años luz. Fue uno de los primeros planetas de tamaño parecido a la Tierra encontrados en la zona habitable de otra estrella. No sabemos si tiene atmósfera ni agua líquida.'],
  proxima: ['Próxima Centauri b', 'Este planeta orbita la estrella más cercana al Sol, a unos 4,2 años luz. Su estrella es una enana roja activa, así que la radiación y la posible atmósfera del planeta son preguntas importantes para evaluar sus condiciones.'],
  trappist: ['TRAPPIST-1e', 'TRAPPIST-1e es uno de siete planetas de tamaño terrestre que orbitan una estrella pequeña y fría. Su posición lo convierte en un candidato interesante para estudiar; futuras observaciones investigan si posee una atmósfera.']
};
const dialog = document.getElementById('fact-dialog');
document.querySelectorAll('[data-fact]').forEach(button => button.addEventListener('click', () => {
  const [title, copy] = planetFacts[button.dataset.fact];
  document.getElementById('dialog-title').textContent = title;
  document.getElementById('dialog-copy').textContent = copy;
  dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});

const slider = document.getElementById('distance-slider');
function updateDistance() {
  const years = Number(slider.value);
  document.getElementById('distance-value').textContent = `${years},${years === 4 ? '2' : '0'} años luz`;
  document.getElementById('distance-result').innerHTML = `La luz tardaría unos <strong>${years} ${years === 1 ? 'año' : 'años'}</strong> en llegar.`;
}
slider.addEventListener('input', updateDistance);

document.getElementById('contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const topic = document.getElementById('topic').value;
  document.getElementById('form-feedback').textContent = `¡Gracias, ${name}! Tu interés por ${topic.toLowerCase()} quedó registrado en esta demostración.`;
  event.currentTarget.reset();
});


