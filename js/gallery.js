(() => {
  const dialog = document.querySelector('[data-pet-dialog]');
  const closeButton = document.querySelector('[data-pet-dialog-close]');
  const name = document.querySelector('[data-pet-dialog-name]');
  const caption = document.querySelector('[data-pet-dialog-caption]');
  const visual = document.querySelector('[data-pet-dialog-visual]');
  const items = document.querySelectorAll('[data-gallery-item]');
  if (!dialog || !items.length) return;

  const closeDialog = () => {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  };

  const ensureImage = () => {
    if (!visual) return null;
    let image = visual.querySelector('img');
    if (!image) {
      image = document.createElement('img');
      image.loading = 'lazy';
      image.decoding = 'async';
      visual.appendChild(image);
    }
    return image;
  };

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const petName = item.dataset.galleryName || 'Наш питомец';
      const petKey = item.dataset.galleryKey || '';
      const petImage = item.dataset.galleryImage || '';
      if (name) name.textContent = petName;
      if (caption) caption.textContent = item.dataset.galleryCaption || '';
      if (visual) {
        visual.className = `pet-dialog__visual pet-dialog__visual--${petKey}`;
        const image = ensureImage();
        if (image && petImage) {
          image.src = petImage;
          image.alt = `${petName} — увеличенный портрет`;
        }
      }
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    });
  });

  if (closeButton) closeButton.addEventListener('click', closeDialog);
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) closeDialog();
  });
})();