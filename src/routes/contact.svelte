<script>
  import { env } from '$env/dynamic/public';

  const contactEmail = env.PUBLIC_CONTACT_EMAIL;
</script>

  <!-- ===== CONTACT ===== -->
  <section id="contact" class="contact">
    <div class="container">
      <div class="section-header reveal">
        <h2>Get In Touch</h2>
        <p>Have a question or want to work together? Drop me a message.</p>
      </div>

      <div class="contact-wrapper reveal">
        <div class="contact-info">
          <h3>Let's Connect</h3>
          <p>
            I'm always open to new opportunities, collaborations, and interesting conversations
            about technology. Feel free to reach out through the form or any channel below.
          </p>

          <div class="contact-details">
            <a href={`mailto:${contactEmail}`} class="contact-item">
              <div class="icon-circle">
                <!-- <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg> -->
              </div>
              <span>{contactEmail}</span>
            </a>
            <a href="tel:+254725091032" class="contact-item">
              <div class="icon-circle">
                <!-- <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg> -->
              </div>
              <span>+254 725 091 032</span>
            </a>
            <div class="contact-item">
              <div class="icon-circle">
                <!-- <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg> -->
              </div>
              <span>Nairobi, Kenya</span>
            </div>
            <a href="https://github.com/14ag" target="_blank" rel="noopener" class="contact-item">
              <div class="icon-circle">
                <!-- <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                </svg> -->
              </div>
              <span>GitHub</span>
            </a>
            <a href="https://linkedin.com/in/14ag" target="_blank" rel="noopener" class="contact-item">
              <div class="icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        <form id="contact-form" class="contact-form" novalidate>
          <div class="form-group">
            <input type="text" id="form-name" placeholder=" " required>
            <label for="form-name">Your Name</label>
            <span class="form-error">Please enter your name.</span>
          </div>
          <div class="form-group">
            <input type="email" id="form-email" placeholder=" " required>
            <label for="form-email">Your Email</label>
            <span class="form-error">Please enter a valid email.</span>
          </div>
          <div class="form-group">
            <textarea id="form-message" placeholder=" " required></textarea>
            <label for="form-message">Your Message</label>
            <span class="form-error">Please enter a message.</span>
          </div>
          <button type="submit" class="btn btn-primary">Send Message <svg xmlns="http://www.w3.org/2000/svg" width="18"
              height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg></button>
        </form>
      </div>
    </div>
  </section>
