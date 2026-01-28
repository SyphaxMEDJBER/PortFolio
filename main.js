const links = document.querySelectorAll('nav a');
links.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || !targetId.startsWith('#')) {
      return;
    }
    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const nav = document.querySelector('nav');
const navToggle = document.querySelector('.nav-toggle');
if (nav && navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const modal = document.querySelector('#video-modal');
const modalVideo = document.querySelector('#demo-video');
const demoButtons = document.querySelectorAll('.demo-btn');
const closeModal = () => {
  if (!modal || !modalVideo) {
    return;
  }
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  modalVideo.pause();
  modalVideo.removeAttribute('src');
  modalVideo.load();
};

if (modal && modalVideo) {
  demoButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-video');
      if (!src) {
        return;
      }
      modalVideo.setAttribute('src', src);
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      modalVideo.play();
    });
  });

  modal.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.getAttribute('data-close') === 'true') {
      closeModal();
    }
  });

  const closeBtn = modal.querySelector('.video-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const toTop = document.querySelector('.to-top');
const onScroll = () => {
  if (!toTop) {
    return;
  }
  if (window.scrollY > 300) {
    toTop.classList.add('show');
  } else {
    toTop.classList.remove('show');
  }
};

window.addEventListener('scroll', onScroll);

if (toTop) {
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
