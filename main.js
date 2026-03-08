document.addEventListener('DOMContentLoaded', () => {
  const revealItems = document.querySelectorAll('.reveal');

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
