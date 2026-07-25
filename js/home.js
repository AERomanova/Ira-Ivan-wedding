(() => {
  const hero = document.querySelector('[data-home-hero]');
  const enterButton = document.querySelector('[data-enter-home]');
  const invitation = document.querySelector('#invitation');
  const actionLayer = hero?.querySelector('[data-home-action-layer]');
  const petals = actionLayer?.querySelectorAll('.home-hero__petals span') ?? [];

  if (!hero || !enterButton || !invitation || !actionLayer || !petals.length) return;

  let entered = false;
  let activeAnimations = [];

  const stopAnimations = () => {
    activeAnimations.forEach((animation) => {
      try { animation.cancel(); } catch (error) {}
    });
    activeAnimations = [];
    petals.forEach((petal) => {
      petal.style.opacity = '0';
      petal.style.transform = '';
    });
  };

  const burstPetals = () => {
    stopAnimations();
    const heroWidth = actionLayer.clientWidth || window.innerWidth;
    const heroHeight = actionLayer.clientHeight || window.innerHeight;

    petals.forEach((petal, index) => {
      const startX = 0.06 * heroWidth + index * (heroWidth * 0.075);
      const driftX = startX + heroWidth * (0.05 + (index % 4) * 0.03);
      const fallY = heroHeight * (0.72 + (index % 3) * 0.08);
      const animation = petal.animate(
        [
          {
            opacity: 0,
            transform: `translate3d(${startX}px, -40px, 0) rotate(0deg) scale(0.65)`,
          },
          {
            offset: 0.14,
            opacity: 0.95,
            transform: `translate3d(${startX + 8}px, ${heroHeight * 0.1}px, 0) rotate(24deg) scale(0.84)`,
          },
          {
            offset: 0.62,
            opacity: 0.82,
            transform: `translate3d(${driftX}px, ${heroHeight * 0.44}px, 0) rotate(178deg) scale(0.98)`,
          },
          {
            opacity: 0,
            transform: `translate3d(${driftX - 70}px, ${fallY}px, 0) rotate(314deg) scale(1.08)`,
          },
        ],
        {
          duration: 2200,
          delay: index * 45,
          easing: 'cubic-bezier(0.18, 0.72, 0.24, 1)',
          fill: 'forwards',
        }
      );
      activeAnimations.push(animation);
    });
  };

  const openHome = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    hero.classList.add('is-entered');
    hero.classList.remove('is-petal-burst');
    void hero.offsetWidth;
    hero.classList.add('is-petal-burst');

    if (typeof Element.prototype.animate === 'function') {
      burstPetals();
    }

    if (!entered) {
      entered = true;
      enterButton.setAttribute('aria-label', 'Приглашение открыто. Перейти к следующему разделу.');
      const label = enterButton.querySelector('span:first-child');
      if (label) label.textContent = 'Приглашение открыто';
    }

    const delay = reducedMotion ? 120 : 1700;
    window.setTimeout(() => {
      invitation.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }, delay);
  };

  enterButton.addEventListener('click', openHome);
})();
