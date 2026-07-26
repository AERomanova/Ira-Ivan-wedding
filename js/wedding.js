(() => {
  const copyButton = document.querySelector("[data-copy-address]");
  const status = document.querySelector("[data-copy-status]");

  if (!copyButton || !status) return;

  const address = "г. Москва, Лазоревый проезд, 15, строение 3, Церковь Троицы Живоначальной";

  const showStatus = (message) => {
    status.textContent = message;
    window.setTimeout(() => {
      status.textContent = "";
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
})();
