<!-- ===== NAVBAR ===== -->
  <header class="navbar">
    <div class="container">
      <a href="#home" class="nav-logo" aria-label="Home">P<span>.</span>Muriuki</a>
      <nav id="nav-links" class="nav-links" aria-label="Main navigation">
        <a href="#home">Home</a>
        <a href="#projects">Projects</a>
        <a href="#skills">Skills</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
      <div class="nav-controls">
        <label class="theme-switch" aria-label="Toggle theme">
          <input type="checkbox" checked={theme === 'light'} onchange={toggleTheme} />
          <span class="switch-track">
            <!-- Sun icon (left / light side) -->
            <!-- <svg class="switch-icon sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg> -->
            <!-- Knob -->
            <span class="switch-knob"></span>
            <!-- Moon icon (right / dark side) -->
            <!-- <svg class="switch-icon moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg> -->
          </span>
        </label>
        <button id="hamburger" class="hamburger" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>

  <!-- ===== HERO ===== -->
  <section id="home" class="hero">
    <div class="hero-bg" aria-hidden="true">
      <div class="shape"></div>
      <div class="shape"></div>
      <div class="shape"></div>
    </div>
    <div class="container hero-content">
      <p class="hero-greeting"> H e l l o , I ' m</p>
      <h1>Philip Ndei Muriuki</h1>
      <p class="hero-tagline"><span id="typing-text"></span><span class="cursor" aria-hidden="true"></span></p>
      <p class="hero-description">
        ICT Management professional with hands-on experience in technical support,
        systems administration, and IT service delivery. I combine technical logic
        with user-centred support to deliver reliable IT solutions.
      </p>
      <div class="hero-buttons">
        <a href="#projects" class="btn btn-primary">View Projects</a>
        <a href="#contact" class="btn btn-secondary">Contact Me</a>
      </div>
    </div>
  </section>


  



  <!-- ===== FOOTER ===== -->
  <footer class="footer">
    <div class="container footer-inner">
      <p>&copy; 2026 Philip Muriuki. All rights reserved.</p>
      <a href="https://github.com/14ag" target="_blank" rel="noopener" class="footer-github"
        aria-label="GitHub profile">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"
          aria-hidden="true">
          <path
            d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
        GitHub
      </a>
    </div>
  </footer>

  <!-- Back to Top -->
  <button id="back-to-top" class="back-to-top" aria-label="Back to top">^</button>

  <!-- Toast -->
  <div id="toast" class="toast" aria-live="polite"></div>