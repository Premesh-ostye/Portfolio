"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // AOS animations
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: prefersReducedMotion ? 0 : 650,
      offset: 60,
      once: true,
      easing: "ease-out"
    });
  }

  const menuButton = document.getElementById("menuButton");
  const navigation = document.getElementById("mainNavigation");
  const topButton = document.getElementById("topButton");
  const currentYear = document.getElementById("currentYear");

  const photoButtons = document.querySelectorAll(".photo-button");
  const photoLightbox = document.getElementById("photoLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");

  /*
   * Mobile navigation
   */
  function closeNavigation() {
    if (!navigation || !menuButton) {
      return;
    }

    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");

      menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNavigation);
    });

    document.addEventListener("click", (event) => {
      const clickedNavigation = navigation.contains(event.target);
      const clickedMenuButton = menuButton.contains(event.target);

      if (
        navigation.classList.contains("open") &&
        !clickedNavigation &&
        !clickedMenuButton
      ) {
        closeNavigation();
      }
    });
  }

  /*
   * Smooth scrolling
   */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const destination = anchor.getAttribute("href");

      if (!destination || destination === "#") {
        return;
      }

      const target = document.querySelector(destination);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  /*
   * Scroll-to-top button
   */
  function updateTopButton() {
    if (!topButton) {
      return;
    }

    topButton.classList.toggle(
      "visible",
      window.scrollY > 500
    );
  }

  if (topButton) {
    window.addEventListener("scroll", updateTopButton, {
      passive: true
    });

    topButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });

    updateTopButton();
  }

  /*
   * Typewriter animation
   */
  function typeWriterAll() {
    const elements = document.querySelectorAll(
      ".typed, .typed-name"
    );

    elements.forEach((element, elementIndex) => {
      const text =
        element.dataset.text ||
        element.textContent.trim();

      element.textContent = "";

      if (prefersReducedMotion) {
        element.textContent = text;
        return;
      }

      let characterIndex = 0;

      function typeCharacter() {
        if (characterIndex >= text.length) {
          return;
        }

        element.textContent += text.charAt(characterIndex);
        characterIndex += 1;

        window.setTimeout(typeCharacter, 45);
      }

      window.setTimeout(
        typeCharacter,
        250 + elementIndex * 300
      );
    });
  }

  typeWriterAll();

  /*
   * Photography lightbox
   */
  function openLightbox(button) {
    if (
      !photoLightbox ||
      !lightboxImage ||
      !lightboxClose
    ) {
      return;
    }

    const imagePath = button.dataset.fullImage;
    const thumbnail = button.querySelector("img");

    if (!imagePath || !thumbnail) {
      return;
    }

    lightboxImage.src = imagePath;
    lightboxImage.alt = thumbnail.alt;

    photoLightbox.hidden = false;
    document.body.classList.add("lightbox-open");

    lightboxClose.focus();
  }

  function closeLightbox() {
    if (!photoLightbox || !lightboxImage) {
      return;
    }

    photoLightbox.hidden = true;
    lightboxImage.src = "";
    lightboxImage.alt = "";

    document.body.classList.remove("lightbox-open");
  }

  photoButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openLightbox(button);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (photoLightbox) {
    photoLightbox.addEventListener("click", (event) => {
      if (event.target === photoLightbox) {
        closeLightbox();
      }
    });
  }

  /*
   * Keyboard controls
   */
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (photoLightbox && !photoLightbox.hidden) {
      closeLightbox();
      return;
    }

    if (
      navigation &&
      navigation.classList.contains("open")
    ) {
      closeNavigation();

      if (menuButton) {
        menuButton.focus();
      }
    }
  });

  /*
   * Automatically update footer year
   */
  if (currentYear) {
    currentYear.textContent =
      new Date().getFullYear().toString();
  }
});
