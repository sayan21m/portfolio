# Sayan Garai — Personal Portfolio

A modern, responsive personal portfolio built with vanilla HTML, CSS, and JavaScript. Designed for internship applications in Machine Learning, Software Engineering, Backend Engineering, and Data Engineering roles.

**Live Demo:** _Deploy to GitHub Pages and add your URL here._

---

## Overview

This portfolio showcases skills, projects, and learning journey as an IT Engineering student. The design is minimal, professional, and premium — optimized for recruiters reviewing internship applications.

Two flagship projects are featured: **Temperature Predictor** (ML & full-stack web) and **MessWise** (Android mess management). All content is truthful with no invented experience.

---

## Folder Structure

```
portfolio/
│
├── docs/
│   ├── index.html                  # Main portfolio page (GitHub Pages entry)
├── 404.html                        # Custom 404 error page
├── css/
│   ├── style.css                   # Main stylesheet
│   └── case-study.css              # Case study page styles
├── js/
│   └── script.js                   # All interactions & animations
├── pages/
│   ├── temperature-predictor.html  # ML weather prediction case study
│   └── messwise.html               # Android mess management case study
├── assets/
│   ├── images/                     # Project screenshots
│   ├── icons/
│   │   └── favicon.svg
│   └── resume.pdf
└── README.md
```

---

## Features

### Hero Section
- Animated gradient background with particle system
- Mouse-following glow effect
- Typing animation for role titles
- Floating hero elements
- Scroll-down indicator with mouse animation
- Enhanced button hover and ripple effects

### Featured Metrics
- Animated counter cards (viewport-triggered)
- Glassmorphism design below About section

### Skills
- Category cards with glassmorphism
- Tooltips on hover/focus
- "Used in Temperature Predictor" labels
- Improved icons and spacing

### Projects
- Two featured project cards: Temperature Predictor and MessWise
- Image carousels with placeholder or screenshot slides
- Status badges (Completed, Platform)
- Feature badges and technology tags
- GitHub, Live Demo, Case Study, and APK download links
- Premium hover animations

### Case Study Pages
- **Temperature Predictor** — `pages/temperature-predictor.html`
- **MessWise** — `pages/messwise.html`
- Problem, solution, workflow, architecture diagram
- Security features, challenges, lessons, future improvements
- Project screenshot gallery

### Learning Sections
- **Currently Learning** — roadmap cards (learning goals only)
- **Learning Journey** — animated vertical timeline through Python, ML, Android, and flagship projects

### Navigation
- Sticky navbar with blur on scroll
- Scroll progress indicator at top
- Active section highlighting
- Improved mobile menu with overlay

### Contact
- Polished form with validation
- Copy-to-clipboard for email
- Enhanced input focus states

### Other
- Back-to-top button with scroll progress ring
- Intersection Observer scroll animations
- Lazy-loaded images
- Custom 404 page
- Accessibility: ARIA labels, keyboard navigation, semantic HTML
- `prefers-reduced-motion` support

---

## Technologies

- **HTML5** — Semantic markup, accessibility, SEO
- **CSS3** — Custom properties, Grid, Flexbox, animations, glassmorphism
- **JavaScript (ES6+)** — Intersection Observer, Canvas API, modular functions
- **Google Fonts** — Inter, JetBrains Mono

No frameworks or build tools required.

---

## Getting Started

```bash
# Clone or download the repository
cd portfolio

# Serve locally
python3 -m http.server 8000
# Visit http://localhost:8000
```

---

## Customization Guide

### Personal Information
Update contact details, social links, and meta tags in `docs/index.html`.

### Resume
Replace `assets/resume.pdf` with your actual resume.

### Project Links
Update GitHub and Live Demo URLs in the Projects section and case study page.

### Adding Future Projects

1. **Project card** — Duplicate the featured project `<article>` in `docs/index.html` inside `.projects__grid`
2. **Screenshots** — Add images to `assets/images/`
3. **Case study** — Copy `pages/temperature-predictor.html` as a template
4. **Skills** — Add skill cards only for technologies used in the new project
5. **Metrics** — Update the Projects Completed counter in the metrics section

### Metrics Counter
```html
<span class="metric-card__value" data-counter="2" data-counter-suffix="">0</span>
```

### Colors & Theme
Edit CSS custom properties in `:root` at the top of `css/style.css`.

---

## Deployment — GitHub Pages

### Standard Deployment

1. Push code to a GitHub repository
2. Go to **Settings → Pages**
3. Source: **Deploy from branch** → `main` → `/docs`
4. Site live at `https://YOUR_USERNAME.github.io/REPO_NAME/`

### Custom 404 Page

GitHub Pages automatically serves `404.html` for missing routes when deployed from root.

### Case Study URLs

Case study pages are accessible at:
- `https://YOUR_USERNAME.github.io/REPO_NAME/pages/temperature-predictor.html`
- `https://YOUR_USERNAME.github.io/REPO_NAME/pages/messwise.html`

For GitHub Pages deployed from `/docs`, use `docs/pages/` paths instead.

---

## Performance Notes

- Images lazy-load via `loading="lazy"` and Intersection Observer
- Particle count reduced on mobile
- Scroll handlers use `requestAnimationFrame` throttling
- Animations respect reduced motion preferences

---

## Author

**Sayan Garai**  
IT Engineering Student | Machine Learning & Backend Developer  
West Bengal, India

- GitHub: [github.com/sayan21m](https://github.com/sayan21m)
- LinkedIn: [linkedin.com/in/sayan-garai-8b6246370](https://www.linkedin.com/in/sayan-garai-8b6246370)
- Email: rebagarai83@gmail.com
