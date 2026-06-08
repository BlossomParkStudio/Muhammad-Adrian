document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  const mobileMenuBtn = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Translations implementation
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const currentLang = localStorage.getItem('lang') || 'id';
      const newLang = currentLang === 'id' ? 'en' : 'id';
      localStorage.setItem('lang', newLang);
      applyTranslations(newLang);
    });
  }

  // Load Translations
  fetch('assets/data/translations.json')
    .then(res => res.json())
    .then(data => {
      window.translationsData = data;
      const initialLang = localStorage.getItem('lang') || 'id';
      applyTranslations(initialLang);
    })
    .catch(err => {
      console.error('Error loading translations:', err);
      // Fallback typing effect if translation load fails
      typeEffect(document.getElementById('dev-title'), "Data Processor", 70, 0);
    });
});

window.typeTimer = null;

function typeEffect(element, text, speed = 100, delay = 0) {
  if (!element) return;
  setTimeout(() => {
    element.textContent = "";
    let i = 0;
    if (window.typeTimer) clearInterval(window.typeTimer);
    window.typeTimer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(window.typeTimer);
        window.typeTimer = null;
      }
    }, speed);
  }, delay);
}

function applyTranslations(lang) {
  if (!window.translationsData) return;
  const translations = window.translationsData[lang];
  if (!translations) return;

  // 1. Text translations
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    if (translations[key]) {
      el.innerHTML = translations[key];
    }
  });

  // 2. Placeholders
  document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
    const key = el.getAttribute('data-translate-placeholder');
    if (translations[key]) {
      el.setAttribute('placeholder', translations[key]);
    }
  });

  // 3. Certificate details data-attributes
  document.querySelectorAll('[data-translate-title]').forEach(el => {
    const key = el.getAttribute('data-translate-title');
    if (translations[key]) el.setAttribute('data-title', translations[key]);
  });
  document.querySelectorAll('[data-translate-badge]').forEach(el => {
    const key = el.getAttribute('data-translate-badge');
    if (translations[key]) el.setAttribute('data-badge', translations[key]);
  });
  document.querySelectorAll('[data-translate-desc]').forEach(el => {
    const key = el.getAttribute('data-translate-desc');
    if (translations[key]) el.setAttribute('data-desc', translations[key]);
  });

  // 4. Update toggle button text
  const langText = document.querySelector('#lang-toggle .lang-text');
  if (langText) {
    langText.textContent = lang === 'id' ? 'EN' : 'ID';
  }

  // 5. Re-run typing effect
  const devTitle = document.getElementById('dev-title');
  if (devTitle && translations['hero-title']) {
    typeEffect(devTitle, translations['hero-title'], 70, 0);
  }
}


let currentCarouselIndex = 0;

window.moveCarousel = function (direction) {
  const carousel = document.getElementById('projectCarousel');
  if (!carousel) return;
  const items = carousel.querySelectorAll('.carousel-item');
  if (!items.length) return;

  const isMobile = window.innerWidth <= 768;
  const itemsVisible = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, items.length - itemsVisible);

  currentCarouselIndex += direction;

  if (currentCarouselIndex < 0) {
    currentCarouselIndex = maxIndex;
  } else if (currentCarouselIndex > maxIndex) {
    currentCarouselIndex = 0;
  }

  const itemPercentage = isMobile ? 100 : 33.333;
  carousel.style.transform = `translateX(-${currentCarouselIndex * itemPercentage}%)`;
};

window.addEventListener('resize', () => {
  const carousel = document.getElementById('projectCarousel');
  if (carousel) {
    currentCarouselIndex = 0;
    carousel.style.transform = `translateX(0%)`;
  }
});

window.openCertModal = function (btn) {
  const title = btn.getAttribute('data-title') || 'Detail Sertifikat';
  const badge = btn.getAttribute('data-badge') || '';
  const desc = btn.getAttribute('data-desc') || '';

  document.getElementById('certModalTitle').innerText = title;

  const badgeEl = document.getElementById('certModalBadge');
  if (badge) {
    badgeEl.innerText = badge;
    badgeEl.style.display = 'inline-block';
    badgeEl.className = 'inline-block border-2 border-blue-600 text-blue-600 px-2 py-1 font-bold text-xs mb-4';
  } else {
    badgeEl.style.display = 'none';
  }

  document.getElementById('certModalDesc').innerText = desc;

  const modal = document.getElementById('certModal');
  const modalContent = document.getElementById('certModalContent');
  modal.classList.remove('hidden');

  // Trigger reflow
  void modal.offsetWidth;

  modal.classList.remove('opacity-0');
  modalContent.classList.remove('scale-95');
};

window.closeCertModal = function () {
  const modal = document.getElementById('certModal');
  const modalContent = document.getElementById('certModalContent');

  modal.classList.add('opacity-0');
  modalContent.classList.add('scale-95');

  setTimeout(() => {
    modal.classList.add('hidden');
  }, 300);
};

// Menutup modal jika area luar diklik
document.addEventListener('DOMContentLoaded', () => {
  const certModal = document.getElementById('certModal');
  if (certModal) {
    certModal.addEventListener('click', function (e) {
      if (e.target === this) {
        closeCertModal();
      }
    });
  }
});
