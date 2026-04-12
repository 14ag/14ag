Build a personal portfolio website with the following requirements.

Purpose
This is a professional developer portfolio meant to showcase projects, skills, and contact information. The design should feel modern, minimal, and performance-focused. No templates. No UI libraries unless explicitly stated.

Tech Stack

* Plain HTML5
* Vanilla CSS (no frameworks)
* Vanilla JavaScript
* Fully responsive
* No external dependencies except Google Fonts

Structure

1. Navbar

* Fixed top navigation bar
* Links: Home, Projects, Skills, About, Contact
* Smooth scroll to sections
* Mobile hamburger menu
* Active section highlighting while scrolling

2. Hero Section

* Full viewport height
* Name (large heading)
* Short tagline
* Short 2–3 line description
* Call-to-action buttons: “View Projects” and “Contact Me”
* Subtle animated background (CSS-based, no libraries)

3. Projects Section

* Grid layout
* Minimum 6 project cards
* Each card contains:

  * Project title
  * Short description
  * Tech stack tags
  * GitHub link
  * Live demo link
* Hover animation
* Filter buttons (e.g., All, Web, Scripts, Tools) using JavaScript

4. Skills Section

* Categorized skills:

  * Frontend
  * Backend
  * Tools
* Each skill displayed as a badge or progress-style visual
* Clean grid layout

5. About Section

* Professional bio paragraph
* Optional profile image placeholder
* Download CV button

6. Contact Section

* Contact form with:

  * Name
  * Email
  * Message
* Client-side validation
* No backend required (just simulate submission)
* Social media icons (GitHub, LinkedIn, Email)

7. Footer

* Minimal
* Copyright line
* Back-to-top button

Design Constraints

* Dark theme default
* Add light/dark toggle (store preference in localStorage)
* Smooth transitions
* Subtle micro-interactions
* Clean typography
* Use CSS variables for theme colors
* Avoid clutter

Performance & Quality

* Semantic HTML
* Accessible (aria labels where necessary)
* Lighthouse score target above 90
* Clean folder structure:
  /index.html
  /css/styles.css
  /js/main.js
  /assets/

Extra Features

* Scroll reveal animations (CSS + JS only)
* Intersection Observer for animations
* Typing effect in hero section
* Sticky navbar shadow on scroll

Output Requirements

* Provide complete working code
* Separate files clearly
* Comment non-obvious logic
* Do not include explanations outside the code
s