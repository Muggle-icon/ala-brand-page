const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const navItems = [...document.querySelectorAll(".nav-item")];
const navTriggers = [...document.querySelectorAll(".nav-trigger")];
const hero = document.querySelector(".hero");
const heroVideo = document.querySelector(".hero-video");

const resizeHeroVideo = () => {
  if (!hero || !heroVideo) return;

  const rect = hero.getBoundingClientRect();
  const videoRatio = heroVideo.videoWidth && heroVideo.videoHeight
    ? heroVideo.videoWidth / heroVideo.videoHeight
    : 16 / 9;
  const heroRatio = rect.width / rect.height;
  const height = heroRatio > videoRatio ? rect.width / videoRatio : rect.height;
  const width = height * videoRatio;

  heroVideo.style.setProperty("--hero-video-width", `${width}px`);
  heroVideo.style.setProperty("--hero-video-height", `${height}px`);
};

heroVideo?.addEventListener("loadedmetadata", resizeHeroVideo);
window.addEventListener("resize", resizeHeroVideo);
resizeHeroVideo();

const closeNav = () => {
  navItems.forEach((item) => item.classList.remove("is-open"));
  navTriggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
};

const openNavItem = (item) => {
  const trigger = item?.querySelector(".nav-trigger");
  if (!item || !trigger) return;

  closeNav();
  item.classList.add("is-open");
  trigger.setAttribute("aria-expanded", "true");
};

menuButton?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  if (!isOpen) closeNav();
});

navTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.closest(".nav-item");
    const willOpen = !item.classList.contains("is-open");
    closeNav();
    item.classList.toggle("is-open", willOpen);
    trigger.setAttribute("aria-expanded", String(willOpen));
  });
});

const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

navItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    if (!finePointer.matches) return;
    openNavItem(item);
  });

  item.addEventListener("mouseleave", () => {
    if (!finePointer.matches) return;
    closeNav();
  });

  item.addEventListener("focusin", () => {
    if (!finePointer.matches) return;
    openNavItem(item);
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-nav")) closeNav();
});

document.querySelectorAll(".site-nav a, .header-actions a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
    closeNav();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNav();
    header.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }
});

const markReveal = (selector, options = {}) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.classList.add("reveal");
    const delay = options.delayStep ? index * options.delayStep : 0;
    element.style.setProperty("--reveal-delay", `${Math.min(delay, options.maxDelay || 160)}ms`);
  });
};

markReveal(".hero-content", { delayStep: 0 });
markReveal(".store-badges", { delayStep: 0 });
markReveal(".logo-strip", { delayStep: 0 });
markReveal(".section-heading, .info-grid, .service-grid, .phone-frame, .official-card, .proof-grid, .faq h2, .faq-list, .footer-top, .footer-legal", {
  delayStep: 70,
  maxDelay: 140,
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { rootMargin: "0px 0px 10% 0px", threshold: 0.08 },
);

const revealElements = [...document.querySelectorAll(".reveal")];

const revealVisibleElements = () => {
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  revealElements.forEach((element) => {
    if (element.classList.contains("is-visible")) return;
    const rect = element.getBoundingClientRect();
    if (rect.top <= viewportHeight * 0.92 && rect.bottom >= -80) {
      element.classList.add("is-visible");
      revealObserver.unobserve(element);
    }
  });
};

revealElements.forEach((element) => revealObserver.observe(element));
revealVisibleElements();

window.addEventListener("scroll", () => {
  revealVisibleElements();
}, { passive: true });
window.addEventListener("resize", () => {
  revealVisibleElements();
});

const sectionLinks = [...document.querySelectorAll(".site-nav a[href^='#'], .header-cta")];
const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    sectionLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  { rootMargin: "-30% 0px -55% 0px", threshold: [0.2, 0.6] },
);

document.querySelectorAll("main section[id], footer[id]").forEach((section) => observer.observe(section));
