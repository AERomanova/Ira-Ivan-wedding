(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  root.classList.add("motion-ready");
  const mediaReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const storageKey = "ira-vanya-motion-preference";
  const hero = document.querySelector(
    ".home-hero, .wedding-hero, .celebration-hero, .family-hero, .rsvp-hero"
  );
  const finalArt = hero?.querySelector(".final-art");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  let lastScrollY = window.scrollY;
  let ticking = false;
  let motionEnabled = true;

  const safelyGetPreference = () => {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  };

  const safelySetPreference = (value) => {
    try {
      localStorage.setItem(storageKey, value);
    } catch {
      // The visual preference remains active for the current page.
    }
  };

  const preference = safelyGetPreference();
  motionEnabled = !mediaReduced.matches && preference !== "off";
  root.dataset.motion = motionEnabled ? "on" : "off";

  const buildPageTransition = () => {
    const transition = document.createElement("div");
    transition.className = "page-transition";
    transition.setAttribute("aria-hidden", "true");
    transition.innerHTML = `
      <span class="page-transition__rabbit"><i></i><b></b></span>
      <span class="page-transition__caption">Переходим в следующую главу…</span>
    `;
    body.appendChild(transition);
  };

  const buildProgress = () => {
    const progress = document.createElement("div");
    progress.className = "site-progress";
    progress.setAttribute("aria-hidden", "true");
    progress.innerHTML = `
      <span class="site-progress__line"></span>
      <span class="site-progress__rabbit"></span>
    `;
    body.appendChild(progress);
  };

  const buildMotionToggle = () => {
    if (mediaReduced.matches) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "motion-toggle";
    button.setAttribute("aria-pressed", String(motionEnabled));
    button.setAttribute(
      "aria-label",
      motionEnabled ? "Отключить декоративное движение" : "Включить декоративное движение"
    );
    button.innerHTML = `
      <span class="motion-toggle__icon" aria-hidden="true"></span>
      <span class="motion-toggle__label">${motionEnabled ? "Движение включено" : "Движение выключено"}</span>
    `;

    button.addEventListener("click", () => {
      motionEnabled = !motionEnabled;
      root.dataset.motion = motionEnabled ? "on" : "off";
      button.setAttribute("aria-pressed", String(motionEnabled));
      button.setAttribute(
        "aria-label",
        motionEnabled ? "Отключить декоративное движение" : "Включить декоративное движение"
      );
      const label = button.querySelector(".motion-toggle__label");
      if (label) {
        label.textContent = motionEnabled ? "Движение включено" : "Движение выключено";
      }
      safelySetPreference(motionEnabled ? "on" : "off");

      if (!motionEnabled && hero) {
        hero.style.setProperty("--motion-x", "0");
        hero.style.setProperty("--motion-y", "0");
      }
    });

    body.appendChild(button);
  };

  const buildAmbientMotes = () => {
    if (!hero) return;
    const motes = document.createElement("div");
    motes.className = "ambient-motes";
    motes.setAttribute("aria-hidden", "true");
    motes.innerHTML = "<span></span>".repeat(9);
    hero.appendChild(motes);
  };

  const assignRevealDirections = () => {
    const reveals = [...document.querySelectorAll(".reveal")];
    reveals.forEach((item, index) => {
      if (item.dataset.revealDirection) return;

      const parent = item.parentElement;
      const siblings = parent ? [...parent.children].filter((child) => child.classList.contains("reveal")) : [];
      const localIndex = siblings.indexOf(item);

      if (item.matches(".section-heading, .home-intro__title, .family-gratitude__inner > *")) {
        item.dataset.revealDirection = "scale";
      } else if (localIndex >= 0 && localIndex % 2 === 0) {
        item.dataset.revealDirection = "left";
      } else if (localIndex >= 0) {
        item.dataset.revealDirection = "right";
      } else {
        item.dataset.revealDirection = index % 3 === 0 ? "scale" : "left";
      }
    });
  };

  const setupPageLinks = () => {
    document.addEventListener("click", (event) => {
      if (!motionEnabled || event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = event.target.closest("a[href]");
      if (!link) return;
      if (link.hasAttribute("download") || link.target === "_blank") return;

      const rawHref = link.getAttribute("href");
      if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) {
        return;
      }

      let destination;
      try {
        destination = new URL(link.href, window.location.href);
      } catch {
        return;
      }

      const current = new URL(window.location.href);
      const isSameDocument =
        destination.pathname === current.pathname &&
        destination.search === current.search &&
        destination.hash;

      if (isSameDocument) return;
      if (!destination.pathname.endsWith(".html") && !destination.pathname.endsWith("/")) return;

      event.preventDefault();
      root.classList.add("is-page-leaving");

      window.setTimeout(() => {
        window.location.href = destination.href;
      }, 430);
    });

    document.querySelectorAll('a[href$=".html"], a[href*=".html#"]').forEach((link) => {
      link.addEventListener(
        "pointerenter",
        () => {
          const href = link.getAttribute("href");
          if (!href) return;
          const cleanHref = href.split("#")[0];
          const absoluteHref = new URL(cleanHref, window.location.href).href;
          const alreadyPrefetched = [...document.querySelectorAll('link[rel="prefetch"]')]
            .some((item) => item.href === absoluteHref);
          if (alreadyPrefetched) return;
          const prefetch = document.createElement("link");
          prefetch.rel = "prefetch";
          prefetch.href = cleanHref;
          document.head.appendChild(prefetch);
        },
        { once: true }
      );
    });
  };

  const setupHeroParallax = () => {
    if (!hero || !finePointer.matches) return;

    hero.addEventListener("pointermove", (event) => {
      if (!motionEnabled) return;
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      hero.style.setProperty("--motion-x", x.toFixed(3));
      hero.style.setProperty("--motion-y", y.toFixed(3));
    });

    hero.addEventListener("pointerleave", () => {
      hero.style.setProperty("--motion-x", "0");
      hero.style.setProperty("--motion-y", "0");
    });
  };

  const setupTilt = () => {
    if (!finePointer.matches) return;

    const selectors = [
      ".event-card",
      ".comfort-card",
      ".detail-card",
      ".mood-tile",
      ".pet-gallery__item",
      ".rabbit-story-card",
      ".bring-rabbit-card",
      ".welcome-detail",
      ".nature-dress-card"
    ];

    document.querySelectorAll(selectors.join(",")).forEach((card) => {
      card.classList.add("motion-tilt");

      card.addEventListener("pointermove", (event) => {
        if (!motionEnabled) return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        card.style.setProperty("--tilt-y", `${((x - 0.5) * 5).toFixed(2)}deg`);
        card.style.setProperty("--tilt-x", `${((0.5 - y) * 4).toFixed(2)}deg`);
      });

      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  };

  const setupMagneticButtons = () => {
    if (!finePointer.matches) return;

    document.querySelectorAll(".button, .lights-button").forEach((button) => {
      button.classList.add("motion-magnetic");

      button.addEventListener("pointermove", (event) => {
        if (!motionEnabled) return;
        const rect = button.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        button.style.setProperty("--magnetic-x", `${(x * 0.08).toFixed(1)}px`);
        button.style.setProperty("--magnetic-y", `${(y * 0.10).toFixed(1)}px`);
      });

      button.addEventListener("pointerleave", () => {
        button.style.setProperty("--magnetic-x", "0px");
        button.style.setProperty("--magnetic-y", "0px");
      });
    });
  };

  const setupActiveNavigation = () => {
    if (!("IntersectionObserver" in window)) return;

    const links = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
    if (!links.length) return;

    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        links.forEach((link) => {
          const active = link.getAttribute("href") === `#${visible.target.id}`;
          link.classList.toggle("is-current", active);
          if (active) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      {
        rootMargin: "-25% 0px -62% 0px",
        threshold: [0.05, 0.2, 0.4]
      }
    );

    sections.forEach((section) => observer.observe(section));
  };

  const setupTimeline = () => {
    const timeline = document.querySelector(".wedding-timeline");
    if (!timeline) return;

    const progress = document.createElement("span");
    progress.className = "wedding-timeline__progress";
    progress.setAttribute("aria-hidden", "true");
    timeline.prepend(progress);

    const items = [...timeline.querySelectorAll(".wedding-timeline__item")];

    const update = () => {
      const rect = timeline.getBoundingClientRect();
      const viewportAnchor = window.innerHeight * 0.54;
      const total = Math.max(rect.height, 1);
      const passed = Math.min(Math.max(viewportAnchor - rect.top, 0), total);
      const ratio = passed / total;
      timeline.style.setProperty("--timeline-progress", ratio.toFixed(3));

      items.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        item.classList.toggle("is-timeline-active", itemRect.top < viewportAnchor && itemRect.bottom > 0);
      });
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  };

  const setupRabbitShelf = () => {
    const items = [...document.querySelectorAll(".shelf-item")];
    if (!items.length) return;

    items.forEach((item, index) => {
      item.style.setProperty("--rabbit-index", String(index));

      item.addEventListener("click", () => {
        if (!motionEnabled) return;

        for (let sparkIndex = 0; sparkIndex < 8; sparkIndex += 1) {
          const spark = document.createElement("span");
          const angle = (Math.PI * 2 * sparkIndex) / 8;
          const distance = 25 + Math.random() * 20;
          spark.className = "rabbit-spark";
          spark.style.left = "50%";
          spark.style.top = "45%";
          spark.style.setProperty("--spark-x", `${Math.cos(angle) * distance}px`);
          spark.style.setProperty("--spark-y", `${Math.sin(angle) * distance}px`);
          item.appendChild(spark);
          window.setTimeout(() => spark.remove(), 820);
        }
      });
    });
  };

  const updateScrollEffects = () => {
    ticking = false;

    const documentHeight = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
    const ratio = Math.min(Math.max(window.scrollY / documentHeight, 0), 1);
    root.style.setProperty("--page-progress", ratio.toFixed(4));

    if (hero) {
      const heroHeight = Math.max(hero.offsetHeight, 1);
      const heroRatio = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);
      hero.style.setProperty("--hero-scroll", heroRatio.toFixed(3));
    }

    const header = document.querySelector("[data-header]");
    const currentScrollY = window.scrollY;

    if (header && currentScrollY > 160) {
      const scrollingDown = currentScrollY > lastScrollY + 4;
      const scrollingUp = currentScrollY < lastScrollY - 4;
      if (scrollingDown) header.classList.add("is-hidden");
      if (scrollingUp) header.classList.remove("is-hidden");
    } else {
      header?.classList.remove("is-hidden");
    }

    lastScrollY = currentScrollY;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateScrollEffects);
  };

  buildPageTransition();
  buildProgress();
  buildMotionToggle();
  buildAmbientMotes();
  assignRevealDirections();
  setupPageLinks();
  setupHeroParallax();
  setupTilt();
  setupMagneticButtons();
  setupActiveNavigation();
  setupTimeline();
  setupRabbitShelf();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  window.addEventListener("pageshow", () => {
    root.classList.remove("is-page-leaving");
  });

  requestAnimationFrame(() => {
    root.classList.add("page-entered");
    updateScrollEffects();
  });

  mediaReduced.addEventListener?.("change", (event) => {
    if (event.matches) {
      motionEnabled = false;
      root.dataset.motion = "off";
    }
  });
})();
