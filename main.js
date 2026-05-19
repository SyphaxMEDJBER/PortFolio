document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.01 }
  );

  revealElements.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 70}ms`);
    revealObserver.observe(element);
  });

  window.setTimeout(() => {
    if (!window.matchMedia('(max-width: 820px)').matches) {
      return;
    }

    document.querySelectorAll('.Projects.reveal, .Projects .reveal').forEach((element) => {
      if (!element.classList.contains('is-visible')) {
        element.classList.add('is-visible');
        revealObserver.unobserve(element);
      }
    });
  }, 1400);
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const projectCategories = document.querySelectorAll('.project-category');

const updateProjectCategory = (category) => {
  const grid = category.querySelector('.proj');
  const cards = Array.from(category.querySelectorAll('.Project-card'));

  if (!grid || cards.length === 0) {
    return;
  }

  cards.forEach((card) => card.classList.remove('is-hidden-by-toggle'));

  let toggle = category.querySelector('.project-toggle');
  const firstTop = cards[0].offsetTop;
  const firstRowCount = cards.filter((card) => Math.abs(card.offsetTop - firstTop) < 4).length;

  if (cards.length <= firstRowCount) {
    if (toggle) {
      toggle.remove();
    }
    category.dataset.expanded = 'true';
    return;
  }

  if (!toggle) {
    toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'project-toggle';
    grid.insertAdjacentElement('afterend', toggle);

    toggle.addEventListener('click', () => {
      const isExpanded = category.dataset.expanded === 'true';
      category.dataset.expanded = String(!isExpanded);
      updateProjectCategory(category);
    });
  }

  if (category.dataset.expanded === 'true') {
    cards.forEach((card) => card.classList.add('is-visible'));
    toggle.textContent = 'Voir moins';
    toggle.setAttribute('aria-expanded', 'true');
    return;
  }

  category.dataset.expanded = 'false';
  cards.slice(firstRowCount).forEach((card) => card.classList.add('is-hidden-by-toggle'));
  toggle.textContent = 'Voir plus';
  toggle.setAttribute('aria-expanded', 'false');
};

const updateProjectCategories = () => {
  projectCategories.forEach(updateProjectCategory);
};

if (projectCategories.length > 0) {
  updateProjectCategories();
  window.addEventListener('resize', updateProjectCategories);
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
      modalVideo.play().catch(() => {});
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

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (toTop) {
  toTop.addEventListener('click', (event) => {
    event.preventDefault();

    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch (error) {
      window.scrollTo(0, 0);
    }

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  });
}

const typingTitle = document.querySelector('.typing-title');

if (typingTitle instanceof HTMLElement && !prefersReducedMotion) {
  const text = typingTitle.dataset.text || typingTitle.textContent || '';
  let index = 0;
  typingTitle.textContent = '';
  typingTitle.classList.add('is-typing');

  const typeNextCharacter = () => {
    typingTitle.textContent = text.slice(0, index);
    index += 1;

    if (index <= text.length) {
      window.setTimeout(typeNextCharacter, index < 12 ? 58 : 42);
    } else {
      window.setTimeout(() => typingTitle.classList.remove('is-typing'), 900);
    }
  };

  window.setTimeout(typeNextCharacter, 350);
}

const neuralCanvas = document.querySelector('#neural-bg');

if (neuralCanvas instanceof HTMLCanvasElement && !prefersReducedMotion) {
  const context = neuralCanvas.getContext('2d');

  if (context) {
    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes = [];
    let animationId = 0;

    const buildNodes = () => {
      const count = Math.min(90, Math.max(42, Math.floor((width * height) / 24000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.34,
        vy: (Math.random() - 0.5) * 0.34,
        r: Math.random() * 1.6 + 1,
      }));
    };

    const resizeNeuralCanvas = () => {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      neuralCanvas.width = Math.floor(width * dpr);
      neuralCanvas.height = Math.floor(height * dpr);
      neuralCanvas.style.width = `${width}px`;
      neuralCanvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    };

    const drawNeuralBackground = () => {
      context.clearRect(0, 0, width, height);

      nodes.forEach((node, indexNode) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;

        for (let indexOther = indexNode + 1; indexOther < nodes.length; indexOther += 1) {
          const other = nodes[indexOther];
          const distance = Math.hypot(node.x - other.x, node.y - other.y);

          if (distance < 145) {
            const alpha = 0.18 * (1 - distance / 145);
            context.strokeStyle = `rgba(143, 255, 225, ${alpha})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(node.x, node.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }

        const pulse = 0.45 + Math.sin(Date.now() / 700 + indexNode) * 0.18;
        context.fillStyle = `rgba(143, 255, 225, ${pulse})`;
        context.beginPath();
        context.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        context.fill();
      });

      animationId = window.requestAnimationFrame(drawNeuralBackground);
    };

    resizeNeuralCanvas();
    drawNeuralBackground();

    window.addEventListener('resize', resizeNeuralCanvas);
    window.addEventListener('beforeunload', () => window.cancelAnimationFrame(animationId));
  }
}
