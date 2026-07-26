(() => {
  const shelfItems = document.querySelectorAll('[data-rabbit-item]');
  const storyTitle = document.querySelector('[data-rabbit-story-title]');
  const storyText = document.querySelector('[data-rabbit-story-text]');

  if (!shelfItems.length) return;

  shelfItems.forEach((item) => {
    item.addEventListener('click', () => {
      shelfItems.forEach((other) => other.classList.remove('is-selected'));
      item.classList.add('is-selected');
      if (storyTitle) storyTitle.textContent = item.dataset.rabbitTitle || '';
      if (storyText) storyText.textContent = item.dataset.rabbitStory || '';
    });
  });
})();
