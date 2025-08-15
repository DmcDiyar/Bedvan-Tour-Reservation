document.addEventListener('DOMContentLoaded', () => {
  // Fade-in ve yukarı kayma animasyonu için Intersection Observer
  const fadeInElements = document.querySelectorAll('.hero__title, .hero__subtitle, .section-about__title, .section-about__text, .section-tours__title, .card, .overview-box__group, .description-box, .picture-box, .reviews__card, .cta');

  const observerOptions = {
    root: null,
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fadeInUp');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeInElements.forEach(element => {
    observer.observe(element);
  });

  // Header için scroll efekti
  const header = document.querySelector('.header--sticky');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScroll && currentScroll > 100) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
  });

  // Kartlar için hover efekti (JS ile daha akıcı kontrol)
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      card.style.transform = 'translateY(-10px)';
      card.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    });
  });
});

// CSS animasyon sınıfı
const style = document.createElement('style');
style.textContent = `
  .animate-fadeInUp {
    animation: fadeInUp 0.8s ease-out forwards;
  }
`;
document.head.appendChild(style);