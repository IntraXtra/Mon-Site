document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('.site-bg')) {
    const background = document.createElement('div');
    background.className = 'site-bg';
    background.setAttribute('aria-hidden', 'true');
    background.innerHTML = `
      <div class="site-bg-gradient"></div>
      <div class="site-bg-grid"></div>
      <div class="site-bg-scanlines"></div>
      <div class="site-bg-orbs">
        <span class="site-bg-orb orb-a"></span>
        <span class="site-bg-orb orb-b"></span>
        <span class="site-bg-orb orb-c"></span>
        <span class="site-bg-orb orb-d"></span>
      </div>
      <div class="site-bg-beams">
        <span class="site-bg-beam beam-a"></span>
        <span class="site-bg-beam beam-b"></span>
        <span class="site-bg-beam beam-c"></span>
      </div>
      <div class="site-bg-nodes">
        <span class="site-bg-node node-a"></span>
        <span class="site-bg-node node-b"></span>
        <span class="site-bg-node node-c"></span>
        <span class="site-bg-node node-d"></span>
        <span class="site-bg-node node-e"></span>
        <span class="site-bg-node node-f"></span>
      </div>
      <div class="site-bg-vignette"></div>
    `;
    document.body.prepend(background);
  }

  const revealItems = document.querySelectorAll('.reveal');
  const glassCards = document.querySelectorAll('[data-glass-lens]');
  const glitchLayers = document.querySelectorAll('[data-letter-glitch]');
  const logoLoops = document.querySelectorAll('[data-logo-loop]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));

  glassCards.forEach((card) => {
    const updateLensPosition = (clientX, clientY) => {
      const bounds = card.getBoundingClientRect();
      const x = ((clientX - bounds.left) / bounds.width) * 100;
      const y = ((clientY - bounds.top) / bounds.height) * 100;

      card.style.setProperty('--lens-x', `${Math.max(16, Math.min(84, x))}%`);
      card.style.setProperty('--lens-y', `${Math.max(18, Math.min(82, y))}%`);
    };

    card.addEventListener('pointermove', (event) => {
      updateLensPosition(event.clientX, event.clientY);
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--lens-x', '68%');
      card.style.setProperty('--lens-y', '34%');
    });
  });

  glitchLayers.forEach((layer) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    layer.appendChild(canvas);

    const palette = (layer.dataset.glitchColors || '#39d0ff,#f7b538')
      .split(',')
      .map((color) => color.trim())
      .filter(Boolean);
    const glitchSpeed = Number(layer.dataset.glitchSpeed || 50);
    const centerVignette = layer.dataset.centerVignette === 'true';
    const outerVignette = layer.dataset.outerVignette !== 'false';
    const glyphs = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&@+=*';

    let columns = [];
    let fontSize = 16;
    let width = 0;
    let height = 0;
    let frameHandle = 0;
    let lastTick = 0;

    const resizeCanvas = () => {
      const bounds = layer.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = Math.max(1, Math.floor(bounds.width));
      height = Math.max(1, Math.floor(bounds.height));
      fontSize = width < 700 ? 13 : 16;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const columnCount = Math.max(12, Math.floor(width / fontSize));
      columns = Array.from({ length: columnCount }, () => ({
        y: Math.random() * height,
        speed: 0.7 + Math.random() * 1.4,
        char: glyphs[Math.floor(Math.random() * glyphs.length)],
      }));
    };

    const drawVignettes = () => {
      if (outerVignette) {
        const outerGradient = context.createRadialGradient(
          width / 2,
          height / 2,
          Math.min(width, height) * 0.1,
          width / 2,
          height / 2,
          Math.max(width, height) * 0.72
        );
        outerGradient.addColorStop(0, 'rgba(8, 21, 35, 0)');
        outerGradient.addColorStop(1, 'rgba(8, 21, 35, 0.42)');
        context.fillStyle = outerGradient;
        context.fillRect(0, 0, width, height);
      }

      if (centerVignette) {
        const centerGradient = context.createRadialGradient(
          width / 2,
          height / 2,
          0,
          width / 2,
          height / 2,
          Math.min(width, height) * 0.34
        );
        centerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
        centerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        context.fillStyle = centerGradient;
        context.fillRect(0, 0, width, height);
      }
    };

    const drawFrame = (timestamp) => {
      if (!lastTick || timestamp - lastTick >= glitchSpeed) {
        lastTick = timestamp;

        context.fillStyle = 'rgba(8, 21, 35, 0.12)';
        context.fillRect(0, 0, width, height);
        context.font = `700 ${fontSize}px "Space Grotesk", monospace`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        columns.forEach((column, index) => {
          const x = index * fontSize + fontSize / 2;

          if (Math.random() > 0.82) {
            column.char = glyphs[Math.floor(Math.random() * glyphs.length)];
          }

          column.y += fontSize * column.speed;

          if (column.y > height + fontSize) {
            column.y = -fontSize * (1 + Math.random() * 3);
            column.speed = 0.7 + Math.random() * 1.4;
          }

          context.fillStyle = palette[index % palette.length] || '#39d0ff';
          context.globalAlpha = 0.16 + (index % 5) * 0.03;
          context.fillText(column.char, x, column.y);

          context.globalAlpha = 0.09;
          context.fillText(column.char, x, column.y - fontSize * 1.2);
        });

        context.globalAlpha = 1;
        drawVignettes();
      }

      frameHandle = window.requestAnimationFrame(drawFrame);
    };

    resizeCanvas();
    frameHandle = window.requestAnimationFrame(drawFrame);

    const handleResize = () => resizeCanvas();
    window.addEventListener('resize', handleResize);
  });

  logoLoops.forEach((loop) => {
    const track = loop.querySelector('.logo-loop-track');

    if (!track || loop.dataset.logoLoopReady === 'true') {
      return;
    }

    const speed = Math.max(10, Number(loop.dataset.speed || 36));
    const originalContent = track.innerHTML;
    track.innerHTML = `${originalContent}${originalContent}`;
    loop.dataset.logoLoopReady = 'true';

    const updateDuration = () => {
      const distance = track.scrollWidth / 2;
      const duration = distance / speed;
      loop.style.setProperty('--loop-duration', `${duration}s`);
    };

    updateDuration();
    window.addEventListener('resize', updateDuration);
  });

  const siteLogo = document.querySelector('[data-logo]');
  if (siteLogo) {
    siteLogo.addEventListener('pointermove', (event) => {
      const bounds = siteLogo.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      
      const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
      const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
      
      siteLogo.style.transform = `rotateZ(${(angle * 180) / Math.PI * 0.04}deg) scale(${1 + distance * 0.0001})`;
    });

    siteLogo.addEventListener('pointerleave', () => {
      siteLogo.style.transform = '';
    });
  }

  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    const endpoint = contactForm.getAttribute('action');
    const statusNode = contactForm.querySelector('[data-contact-status]');
    const submitButton = contactForm.querySelector('[data-submit-label]');
    const baseButtonLabel = submitButton ? submitButton.textContent : 'Envoyer';
    const inputs = contactForm.querySelectorAll('input, textarea');

    const setStatus = (kind, text) => {
      if (!statusNode) return;
      statusNode.textContent = text;
      statusNode.classList.remove('is-ok', 'is-error');
      if (kind === 'ok') statusNode.classList.add('is-ok');
      if (kind === 'error') statusNode.classList.add('is-error');
    };

    // Clear status on input
    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        if (statusNode.classList.contains('is-error')) {
          statusNode.textContent = '';
          statusNode.classList.remove('is-error');
        }
      });
    });

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
      const honeypot = formData.get('_honey');

      // Spam check
      if (honeypot) {
        setStatus('ok', lang === 'en' ? 'Message sent successfully. I will get back to you soon.' : 'Message envoye avec succes. Je vous repondrai rapidement.');
        contactForm.reset();
        return;
      }

      if (!endpoint) {
        setStatus('error', lang === 'en' ? 'Missing form endpoint.' : 'Endpoint du formulaire manquant.');
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = lang === 'en' ? 'Sending...' : 'Envoi...';
      }

      setStatus('', lang === 'en' ? 'Sending your message...' : 'Envoi de votre message...');

      try {
        const payload = Object.fromEntries(formData);
        delete payload._honey;
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          const message = result.message || (lang === 'en' ? 'Failed to send message.' : 'Impossible d\'envoyer le message.');
          setStatus('error', message);
          return;
        }

        contactForm.reset();
        setStatus('ok', lang === 'en' ? '✨ Message sent successfully. I will get back to you soon.' : '✨ Message envoye avec succes. Je vous repondrai rapidement.');
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          if (statusNode.classList.contains('is-ok')) {
            statusNode.textContent = '';
            statusNode.classList.remove('is-ok');
          }
        }, 5000);
      } catch (error) {
        setStatus('error', lang === 'en' ? 'An error occurred. Please retry or contact me on LinkedIn.' : 'Une erreur est survenue. Reessayez ou contactez-moi via LinkedIn.');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = baseButtonLabel;
        }
      }
    });
  }

  const dynamicCards = document.querySelectorAll('.section-card, .contact-card, .media-box, .stat');
  dynamicCards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const px = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const py = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

      card.style.transform = `translateY(-3px) rotateX(${(-py * 1.3).toFixed(2)}deg) rotateY(${(px * 1.5).toFixed(2)}deg)`;
      card.style.transformStyle = 'preserve-3d';
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
      card.style.transformStyle = '';
    });
  });

  const toggle = document.getElementById('langToggle');
  const i18nNodes = document.querySelectorAll('[data-i18n]');
  let currentLang = localStorage.getItem('siteLang') || 'fr';

  const applyLang = (lang) => {
    i18nNodes.forEach((node) => {
      const key = lang === 'en' ? 'en' : 'fr';
      const text = node.dataset[key];
      if (!text) {
        const placeholderKey = lang === 'en' ? 'placeholderEn' : 'placeholderFr';
        const ariaKey = lang === 'en' ? 'ariaEn' : 'ariaFr';

        if (node.dataset[placeholderKey]) {
          node.setAttribute('placeholder', node.dataset[placeholderKey]);
        }

        if (node.dataset[ariaKey]) {
          node.setAttribute('aria-label', node.dataset[ariaKey]);
        }

        return;
      }

      if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
        node.value = text;
      } else {
        node.textContent = text;
      }

      const placeholderKey = lang === 'en' ? 'placeholderEn' : 'placeholderFr';
      const ariaKey = lang === 'en' ? 'ariaEn' : 'ariaFr';

      if (node.dataset[placeholderKey]) {
        node.setAttribute('placeholder', node.dataset[placeholderKey]);
      }

      if (node.dataset[ariaKey]) {
        node.setAttribute('aria-label', node.dataset[ariaKey]);
      }
    });

    if (toggle) {
      toggle.textContent = lang === 'fr' ? 'EN' : 'FR';
    }

    document.documentElement.lang = lang === 'fr' ? 'fr' : 'en';
    localStorage.setItem('siteLang', lang);
  };

  if (toggle) {
    toggle.addEventListener('click', () => {
      currentLang = currentLang === 'fr' ? 'en' : 'fr';
      applyLang(currentLang);
    });
  }

  applyLang(currentLang);
});
