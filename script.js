document.documentElement.classList.add('js');

const PASSWORD_HASH = 'ee061983';
const accessForm = document.getElementById('accessForm');
const passwordInput = document.getElementById('passwordInput');
const accessError = document.getElementById('accessError');

function hashPassword(value) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function unlockPortfolio() {
  document.body.classList.remove('locked');
  sessionStorage.setItem('portfolio-unlocked', '1');
}

if (sessionStorage.getItem('portfolio-unlocked') === '1') {
  unlockPortfolio();
}

accessForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = passwordInput.value;
  if (hashPassword(value) === PASSWORD_HASH) {
    accessError.textContent = '';
    passwordInput.value = '';
    unlockPortfolio();
  } else {
    accessError.textContent = '密码不正确';
    passwordInput.value = '';
    passwordInput.focus();
  }
});

const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

navToggle.addEventListener('click', () => {
  const open = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

siteNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach((el) => revealObserver.observe(el));

const imageGalleries = document.querySelectorAll('.gallery-grid:not(.ip-grid), .gallery-track');

function initCarousel(carousel) {
  const viewport = carousel.querySelector('.carousel-viewport');
  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const prevBtn = carousel.querySelector('[data-carousel-prev]');
  const nextBtn = carousel.querySelector('[data-carousel-next]');
  const progress = carousel.querySelector('.carousel-progress span');
  const gap = 14;
  let index = 0;
  let perView = 1;

  function update() {
    const minSlide = parseFloat(getComputedStyle(carousel).getPropertyValue('--slide-min')) || 260;
    perView = Math.max(1, Math.min(slides.length, Math.floor((carousel.clientWidth + gap) / (minSlide + gap))));
    const slideWidth = (carousel.clientWidth - gap * (perView - 1)) / perView;
    slides.forEach((slide) => {
      slide.style.flex = `0 0 ${slideWidth}px`;
    });
    const maxIndex = Math.max(0, slides.length - perView);
    index = Math.min(index, maxIndex);
    track.style.transform = `translateX(${-index * (slideWidth + gap)}px)`;
    progress.style.width = `${((index + 1) / (maxIndex + 1)) * 100}%`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= maxIndex;
  }

  prevBtn.addEventListener('click', () => {
    index = Math.max(0, index - 1);
    update();
  });

  nextBtn.addEventListener('click', () => {
    index = Math.min(slides.length - perView, index + 1);
    update();
  });

  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') prevBtn.click();
    if (event.key === 'ArrowRight') nextBtn.click();
  });

  const resizeObserver = new ResizeObserver(() => update());
  resizeObserver.observe(carousel);
  update();
}

imageGalleries.forEach((grid) => {
  const type = grid.classList.contains('xhs-track')
    ? 'xhs'
    : grid.classList.contains('ip-grid')
      ? 'ip'
      : grid.classList.contains('ad-grid')
        ? 'ads'
        : grid.classList.contains('design-grid')
          ? 'design'
          : 'kv';

  const carousel = document.createElement('div');
  carousel.className = `carousel carousel--${type}`;
  carousel.setAttribute('tabindex', '0');
  carousel.setAttribute('aria-label', '作品轮播');

  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';
  const track = document.createElement('div');
  track.className = 'carousel-track';

  Array.from(grid.children).forEach((slide) => {
    slide.classList.add('carousel-slide');
    slide.querySelector('figcaption')?.remove();
    track.appendChild(slide);
  });

  viewport.appendChild(track);
  carousel.appendChild(viewport);

  const controls = document.createElement('div');
  controls.className = 'carousel-controls';
  controls.innerHTML = `
    <button class="carousel-btn" type="button" data-carousel-prev aria-label="上一张">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <div class="carousel-progress"><span></span></div>
    <button class="carousel-btn" type="button" data-carousel-next aria-label="下一张">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
    </button>
  `;
  carousel.appendChild(controls);

  grid.replaceWith(carousel);
  initCarousel(carousel);
});

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lightboxImg.removeAttribute('src');
}

document.querySelectorAll('.work-card[data-full]').forEach((card) => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('click', () => openLightbox(card.dataset.full));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLightbox(card.dataset.full);
    }
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const videoClose = document.getElementById('videoClose');

function openVideo(src) {
  modalVideo.src = src;
  videoModal.classList.add('is-open');
  videoModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalVideo.play().catch(() => {});
}

function closeVideo() {
  videoModal.classList.remove('is-open');
  videoModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  modalVideo.pause();
  modalVideo.removeAttribute('src');
  modalVideo.load();
}

document.querySelectorAll('.video-card[data-video]').forEach((card) => {
  card.addEventListener('click', () => openVideo(card.dataset.video));
});

videoClose.addEventListener('click', closeVideo);
videoModal.addEventListener('click', (event) => {
  if (event.target === videoModal) closeVideo();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeLightbox();
    closeVideo();
  }
});
