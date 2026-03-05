/* ============================================
   Philip Muriuki - Portfolio JS
   ============================================ */

const API_BASE_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Theme Toggle ---------- */
  const themeCheckbox = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  if (themeCheckbox) {
    themeCheckbox.checked = savedTheme === "light";
    themeCheckbox.addEventListener("change", () => {
      const next = themeCheckbox.checked ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  /* ---------- Mobile Menu ---------- */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("open");
      });
    });
  }

  /* ---------- Sticky Navbar Shadow ---------- */
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener(
      "scroll",
      () => {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
      },
      { passive: true },
    );
  }

  /* ---------- Active Section Highlighting ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");

  if (sections.length > 0 && navAnchors.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navAnchors.forEach((a) => a.classList.remove("active"));
            const target = document.querySelector(
              `.nav-links a[href="#${entry.target.id}"]`,
            );
            if (target) {
              target.classList.add("active");
            }
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((sec) => sectionObserver.observe(sec));
  }

  /* ---------- Typing Effect ---------- */
  const typingEl = document.getElementById("typing-text");
  const phrases = [
    "ICT Management Professional",
    "Technical Support Specialist",
    "Systems Administration",
    "Problem Solver",
  ];

  if (typingEl) {
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;

    function type() {
      const current = phrases[phraseIdx];
      if (!deleting) {
        typingEl.textContent = current.substring(0, charIdx + 1);
        charIdx += 1;
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
        setTimeout(type, 70);
      } else {
        typingEl.textContent = current.substring(0, charIdx - 1);
        charIdx -= 1;
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
        setTimeout(type, 40);
      }
    }

    type();
  }

  /* ---------- Scroll Reveal ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Projects ---------- */
  const projectGrid = document.querySelector(".projects-grid");
  const filterBar = document.querySelector(".filter-bar");

  function normalizeProjects(raw) {
    if (Array.isArray(raw)) {
      return raw;
    }
    if (raw && Array.isArray(raw.projects)) {
      return raw.projects;
    }
    if (raw && typeof raw === "object") {
      return Object.values(raw);
    }
    return [];
  }

  function createProjectCard(project) {
    const category = String(project.category || "other").toLowerCase();
    const techs = Array.isArray(project.techs) ? project.techs : [];
    const title = project.title || "Untitled project";
    const description = project.description || "No description available.";
    const codeUrl = project._url || "#";
    const liveUrl = project.live_url || project.demo_url || "";

    const article = document.createElement("article");
    article.className = "project-card reveal";
    article.dataset.category = category;

    article.innerHTML = `
      <div class="card-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      </div>
      <h3></h3>
      <p></p>
      <div class="project-tags"></div>
      <div class="project-links"></div>
    `;

    article.querySelector("h3").textContent = title;
    article.querySelector("p").textContent = description;

    const tagsContainer = article.querySelector(".project-tags");
    techs.forEach((tech) => {
      const span = document.createElement("span");
      span.textContent = String(tech);
      tagsContainer.appendChild(span);
    });

    const linksContainer = article.querySelector(".project-links");

    const codeAnchor = document.createElement("a");
    codeAnchor.href = codeUrl;
    codeAnchor.target = "_blank";
    codeAnchor.rel = "noopener";
    codeAnchor.setAttribute("aria-label", "GitHub repo");
    codeAnchor.textContent = "</> Code";
    linksContainer.appendChild(codeAnchor);

    if (liveUrl) {
      const liveAnchor = document.createElement("a");
      liveAnchor.href = liveUrl;
      liveAnchor.target = "_blank";
      liveAnchor.rel = "noopener";
      liveAnchor.setAttribute("aria-label", "Live demo");
      liveAnchor.textContent = "Live Demo";
      linksContainer.appendChild(liveAnchor);
    }

    return article;
  }

  function applyFilter(category) {
    document.querySelectorAll(".project-card").forEach((card) => {
      const shouldShow = category === "all" || card.dataset.category === category;
      if (shouldShow) {
        card.style.display = "flex";
        requestAnimationFrame(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        });
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });
  }

  function renderFilterButtons(projects) {
    if (!filterBar) {
      return;
    }

    const categories = Array.from(
      new Set(projects.map((project) => String(project.category || "other").toLowerCase())),
    );

    filterBar.innerHTML = "";

    const allButton = document.createElement("button");
    allButton.className = "filter-btn active";
    allButton.dataset.filter = "all";
    allButton.textContent = "All";
    filterBar.appendChild(allButton);

    categories.forEach((category) => {
      const button = document.createElement("button");
      button.className = "filter-btn";
      button.dataset.filter = category;
      button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      filterBar.appendChild(button);
    });
  }

  if (filterBar) {
    filterBar.addEventListener("click", (event) => {
      const target = event.target.closest(".filter-btn");
      if (!target) {
        return;
      }

      filterBar.querySelectorAll(".filter-btn").forEach((button) => {
        button.classList.remove("active");
      });
      target.classList.add("active");
      applyFilter(target.dataset.filter || "all");
    });
  }

  async function loadProjects() {
    if (!projectGrid) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      if (!response.ok) {
        throw new Error(`Projects request failed: ${response.status}`);
      }

      const payload = await response.json();
      const projects = normalizeProjects(payload);

      projectGrid.innerHTML = "";

      if (projects.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "Projects will appear here soon.";
        empty.style.color = "var(--text-secondary)";
        projectGrid.appendChild(empty);
        renderFilterButtons([]);
        return;
      }

      projects.forEach((project) => {
        const card = createProjectCard(project);
        projectGrid.appendChild(card);
        revealObserver.observe(card);
      });

      renderFilterButtons(projects);
      applyFilter("all");
    } catch (error) {
      console.error(error);
      projectGrid.innerHTML = "";

      const errorText = document.createElement("p");
      errorText.textContent = "Could not load projects right now.";
      errorText.style.color = "var(--text-secondary)";
      projectGrid.appendChild(errorText);
    }
  }

  void loadProjects();

  /* ---------- Back-to-Top ---------- */
  const bttBtn = document.getElementById("back-to-top");
  if (bttBtn) {
    window.addEventListener(
      "scroll",
      () => {
        bttBtn.classList.toggle("visible", window.scrollY > window.innerHeight);
      },
      { passive: true },
    );

    bttBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Contact Form ---------- */
  const form = document.getElementById("contact-form");

  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) {
      return;
    }

    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3500);
  }

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      let valid = true;

      form.querySelectorAll(".form-group").forEach((group) => {
        group.classList.remove("error");
      });

      const name = form.querySelector("#form-name");
      const email = form.querySelector("#form-email");
      const message = form.querySelector("#form-message");

      if (!name.value.trim()) {
        name.closest(".form-group").classList.add("error");
        valid = false;
      }

      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.closest(".form-group").classList.add("error");
        valid = false;
      }

      if (!message.value.trim()) {
        message.closest(".form-group").classList.add("error");
        valid = false;
      }

      if (!valid) {
        return;
      }

      const payload = {
        name: name.value.trim(),
        email: email.value.trim(),
        message_body: message.value.trim(),
      };

      try {
        const response = await fetch(`${API_BASE_URL}/message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Message request failed: ${response.status}`);
        }

        await response.json();
        form.reset();
        showToast("Your message has been sent.");
      } catch (error) {
        console.error(error);
        showToast("Could not send your message right now.");
      }
    });
  }
});
