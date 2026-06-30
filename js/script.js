(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const galleryImages = [
    { src: "img/galeria-01.jpg", title: "Finca Toledo 01" },
    { src: "img/galeria-02.jpg", title: "Finca Toledo 02" },
    { src: "img/galeria-03.jpg", title: "Finca Toledo 03" },
    { src: "img/galeria-04.jpg", title: "Finca Toledo 04" },
    { src: "img/galeria-05.jpg", title: "Finca Toledo 05" },
    { src: "img/galeria-06.jpg", title: "Finca Toledo 06" },
    { src: "img/galeria-07.jpg", title: "Finca Toledo 07" },
    { src: "img/galeria-08.jpg", title: "Finca Toledo 08" },
    { src: "img/galeria-09.jpg", title: "Finca Toledo 09" },
    { src: "img/galeria-10.jpg", title: "Finca Toledo 10" },
    { src: "img/galeria-11.jpg", title: "Finca Toledo 11" },
    { src: "img/galeria-12.jpg", title: "Finca Toledo 12" },
    { src: "img/galeria-13.jpg", title: "Finca Toledo 13" },
    { src: "img/galeria-14.jpg", title: "Finca Toledo 14" },
    { src: "img/galeria-15.jpg", title: "Finca Toledo 15" },
    { src: "img/galeria-16.jpg", title: "Finca Toledo 16" },
    { src: "img/galeria-17.jpg", title: "Finca Toledo 17" },
    { src: "img/galeria-18.jpg", title: "Finca Toledo 18" },
    { src: "img/galeria-19.jpg", title: "Finca Toledo 19" },
    { src: "img/galeria-20.jpg", title: "Finca Toledo 20" },
    { src: "img/galeria-21.jpg", title: "Finca Toledo 21" },
    { src: "img/galeria-22.jpg", title: "Finca Toledo 22" },
    { src: "img/galeria-23.jpg", title: "Finca Toledo 23" },
    { src: "img/galeria-24.jpg", title: "Finca Toledo 24" },
    { src: "img/galeria-25.jpg", title: "Finca Toledo 25" },
    { src: "img/galeria-26.jpg", title: "Finca Toledo 26" },
    { src: "img/galeria-28.jpg", title: "Finca Toledo 28" },
    { src: "img/galeria-29.jpg", title: "Finca Toledo 29" },
    { src: "img/galeria-30.jpg", title: "Finca Toledo 30" },
    { src: "img/galeria-31.jpg", title: "Finca Toledo 31" },
    { src: "img/galeria-32.jpg", title: "Finca Toledo 32" }
  ];

  const body = document.body;
  const header = $(".site-header");
  const menuToggle = $("#menuToggle");
  const mobileMenu = $("#mobileMenu");
  const backToTop = $("#backToTop");
  const preloader = $("#preloader");
  const year = $("#year");
  const galleryGrid = $("#galleryGrid");
  const lightbox = $("#lightbox");
  const lightboxImage = lightbox ? $("img", lightbox) : null;
  const lightboxClose = lightbox ? $(".lightbox-close", lightbox) : null;
  const lightboxPrev = lightbox ? $(".lightbox-prev", lightbox) : null;
  const lightboxNext = lightbox ? $(".lightbox-next", lightbox) : null;
  let activeGallery = galleryImages.slice();
  let activeIndex = 0;

  const setHeaderState = () => header?.classList.toggle("is-scrolled", window.scrollY > 20);
  const setBackToTopState = () => backToTop?.classList.toggle("is-visible", window.scrollY > 600);

  const closeMobileMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.classList.remove("is-active");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("is-open");
    body.classList.remove("menu-open");
  };

  const toggleMobileMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    const isOpen = mobileMenu.classList.toggle("is-open");
    menuToggle.classList.toggle("is-active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    body.classList.toggle("menu-open", isOpen);
  };

  const renderGallery = () => {
    if (!galleryGrid) return;
    activeGallery = galleryImages.slice();
    galleryGrid.innerHTML = activeGallery.map((item, index) => `
      <figure class="reveal is-visible" data-index="${index}">
        <img src="${item.src}" alt="${item.title}" loading="lazy" decoding="async">
        <figcaption>${item.title}</figcaption>
      </figure>`).join("");
  };

  const openLightbox = (index) => {
    if (!lightbox || !lightboxImage || !activeGallery[index]) return;
    activeIndex = index;
    const item = activeGallery[activeIndex];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.title || "Finca Toledo";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    body.classList.add("menu-open");
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.removeAttribute("src");
    body.classList.remove("menu-open");
  };

  const moveLightbox = (direction) => {
    if (!activeGallery.length) return;
    activeIndex = (activeIndex + direction + activeGallery.length) % activeGallery.length;
    openLightbox(activeIndex);
  };

  const initMenu = () => {
    menuToggle?.addEventListener("click", toggleMobileMenu);
    $$("a[href^='#']").forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        const target = targetId ? $(targetId) : null;
        if (!target) return;
        event.preventDefault();
        closeMobileMenu();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") { closeMobileMenu(); closeLightbox(); }
      if (lightbox?.classList.contains("is-open") && event.key === "ArrowLeft") moveLightbox(-1);
      if (lightbox?.classList.contains("is-open") && event.key === "ArrowRight") moveLightbox(1);
    });
  };

  const initActiveNavigation = () => {
    const sections = $$("main section[id]");
    const navLinks = $$(".desktop-nav a, .mobile-menu a");
    if (!sections.length || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 });
    sections.forEach((section) => observer.observe(section));
  };

  const initRevealAnimations = () => {
    const items = $$(".reveal:not(.is-visible)");
    if (!items.length || !("IntersectionObserver" in window)) { items.forEach((item) => item.classList.add("is-visible")); return; }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
  };

  const initGallery = () => {
    renderGallery();
    galleryGrid?.addEventListener("click", (event) => {
      const figure = event.target.closest("figure");
      if (!figure) return;
      openLightbox(Number(figure.dataset.index || 0));
    });
    lightbox?.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });
    lightboxClose?.addEventListener("click", closeLightbox);
    lightboxPrev?.addEventListener("click", () => moveLightbox(-1));
    lightboxNext?.addEventListener("click", () => moveLightbox(1));
  };

  const initControls = () => {
    if (year) year.textContent = new Date().getFullYear();
    backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    window.addEventListener("scroll", () => { setHeaderState(); setBackToTopState(); }, { passive: true });
    setHeaderState(); setBackToTopState();
  };

  const hidePreloader = () => {
    if (!preloader) return;
    preloader.classList.add("is-hidden");
    window.setTimeout(() => preloader.remove(), 450);
  };

  document.addEventListener("DOMContentLoaded", () => { initMenu(); initActiveNavigation(); initGallery(); initRevealAnimations(); initControls(); window.setTimeout(hidePreloader, 700); });
  window.addEventListener("load", hidePreloader);
})();
