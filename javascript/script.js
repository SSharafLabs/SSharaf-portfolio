/* ==========================================================================
   PORTFOLIO SITE SCRIPT
   Small, focused pieces of behavior: nothing here depends on a framework.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  openCurtains();
  setupMobileMenu();
  setupHeaderScrollState();
  setupScrollProgressBar();
  setupScrollReveal();
  setupBackToTopButton();
  setupSmoothAnchorLinks();
  setupContactForm();
  setCurrentYear();
});

/* ==========================================================================
   HERO CURTAIN REVEAL
   Slides the two cinema bars open shortly after the page loads.
   ========================================================================== */
function openCurtains() {
  const topCurtain = document.getElementById("curtainTop");
  const bottomCurtain = document.getElementById("curtainBottom");

  if (!topCurtain || !bottomCurtain) return;

  window.requestAnimationFrame(function () {
    setTimeout(function () {
      topCurtain.classList.add("is-open");
      bottomCurtain.classList.add("is-open");
    }, 250);
  });
}

/* ==========================================================================
   MOBILE MENU TOGGLE
   Opens and closes the slide-in navigation on small screens.
   ========================================================================== */
function setupMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (!menuToggle || !mainNav) return;

  menuToggle.addEventListener("click", function () {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the menu whenever a nav link is clicked
  const navLinks = mainNav.querySelectorAll("a");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("is-open");
      menuToggle.classList.remove("is-active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ==========================================================================
   HEADER BACKGROUND ON SCROLL
   Adds a solid, blurred background to the header once the page scrolls
   past the hero area.
   ========================================================================== */
function setupHeaderScrollState() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  function updateHeaderState() {
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

/* ==========================================================================
   SCROLL PROGRESS BAR
   Fills the thin bar at the top of the page based on how far the
   visitor has scrolled through the document.
   ========================================================================== */
function setupScrollProgressBar() {
  const progressBar = document.getElementById("scrollProgress");
  if (!progressBar) return;

  function updateProgressBar() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + "%";
  }

  updateProgressBar();
  window.addEventListener("scroll", updateProgressBar, { passive: true });
  window.addEventListener("resize", updateProgressBar);
}

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS
   Fades and lifts each ".reveal-up" element into place the first time
   it enters the viewport, using IntersectionObserver for performance.
   ========================================================================== */
function setupScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal-up");
  if (!revealElements.length) return;

  // If the browser doesn't support IntersectionObserver, just show everything
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealElements.forEach(function (el, index) {
    // Small staggered delay so grouped elements don't all pop in at once
    el.style.transitionDelay = (index % 4) * 0.08 + "s";
    observer.observe(el);
  });
}

/* ==========================================================================
   BACK TO TOP BUTTON
   Shows the button once the visitor has scrolled down a bit, and
   scrolls smoothly back to the top of the page on click.
   ========================================================================== */
function setupBackToTopButton() {
  const backToTopButton = document.getElementById("backToTop");
  if (!backToTopButton) return;

  function toggleVisibility() {
    backToTopButton.classList.toggle("is-visible", window.scrollY > 500);
  }

  toggleVisibility();
  window.addEventListener("scroll", toggleVisibility, { passive: true });

  backToTopButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ==========================================================================
   SMOOTH ANCHOR LINKS
   Ensures in-page links (like the header nav) scroll smoothly and
   account for the fixed header height.
   ========================================================================== */
function setupSmoothAnchorLinks() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      event.preventDefault();

      const headerOffset = 80;
      const elementPosition =
        targetElement.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: "smooth",
      });
    });
  });
}

/* ==========================================================================
   CONTACT FORM VALIDATION & SUBMIT
   Simple client-side validation with friendly inline error messages.
   Replace the "sendMessage" function with a real request to your own
   backend, form service (e.g. Formspree), or email API.
   ========================================================================== */
function setupContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const messageField = document.getElementById("message");
  const formStatus = document.getElementById("formStatus");

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const isNameValid = validateField(nameField, "nameError", function (value) {
      return value.trim().length > 1 ? "" : "Please enter your name.";
    });

    const isEmailValid = validateField(
      emailField,
      "emailError",
      function (value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value.trim())
          ? ""
          : "Please enter a valid email address.";
      },
    );

    const isMessageValid = validateField(
      messageField,
      "messageError",
      function (value) {
        return value.trim().length > 9
          ? ""
          : "Tell me a little more about the project.";
      },
    );

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      formStatus.textContent = "Please fix the highlighted fields above.";
      return;
    }

    sendMessage({
      name: nameField.value.trim(),
      email: emailField.value.trim(),
      message: messageField.value.trim(),
    });
  });

  function validateField(field, errorElementId, validatorFn) {
    const errorElement = document.getElementById(errorElementId);
    const errorMessage = validatorFn(field.value);

    field
      .closest(".form-field")
      .classList.toggle("has-error", Boolean(errorMessage));
    errorElement.textContent = errorMessage;

    return errorMessage === "";
  }

  function sendMessage(formData) {
    // Placeholder behavior: confirm receipt in the UI and reset the form.
    // Swap this out for a fetch() call to your backend or form service.
    formStatus.textContent =
      "Thanks, " +
      formData.name.split(" ")[0] +
      " — your message is on its way. I'll be in touch soon.";
    contactForm.reset();
  }
}

/* ==========================================================================
   FOOTER YEAR
   Keeps the copyright year in the footer accurate without manual edits.
   ========================================================================== */
function setCurrentYear() {
  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
