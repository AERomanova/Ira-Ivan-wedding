(() => {
  const hero = document.querySelector("[data-celebration-hero]");
  const lightsButton = document.querySelector("[data-lights-toggle]");
  const lightsLabel = document.querySelector("[data-lights-label]");
  const copyButton = document.querySelector("[data-copy-celebration-address]");
  const copyStatus = document.querySelector("[data-celebration-copy-status]");

  if (hero && lightsButton && lightsLabel) {
    lightsButton.addEventListener("click", () => {
      const enabled = lightsButton.getAttribute("aria-pressed") !== "true";
      lightsButton.setAttribute("aria-pressed", String(enabled));
      hero.classList.toggle("lights-on", enabled);
      lightsLabel.textContent = enabled ? "Гирлянды зажжены" : "Зажечь гирлянды";
    });
  }

  if (copyButton && copyStatus) {
    const address = "Садовое товарищество «Алмазово-2», Сергиево-Посадский городской округ, Московская область, участок 132";

    const showStatus = (message) => {
      copyStatus.textContent = message;
      window.setTimeout(() => {
        copyStatus.textContent = "";
      }, 3200);
    };

    copyButton.addEventListener("click", async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(address);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = address;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          textarea.remove();
        }

        showStatus("Адрес скопирован");
      } catch (error) {
        showStatus("Не удалось скопировать. Выделите адрес вручную.");
      }
    });
  }
})();
