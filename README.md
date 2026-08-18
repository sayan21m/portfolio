# Sayan Garai — Personal Portfolio

A modern, responsive personal portfolio built with Express, EJS, CSS, and JavaScript. Designed for internship applications in Machine Learning, Software Engineering, Backend Engineering, and Data Engineering roles.

**Live Demo:** _Deploy the Node server (Render, Railway, or a VPS) and add your URL here._

---

## Overview

This portfolio showcases skills, projects, and learning journey as an IT Engineering student. The design is minimal, professional, and premium — optimized for recruiters reviewing internship applications.

Pages are rendered on the server with EJS. CSS, JS, and images are still sent to the browser (required to display the site). Keep the GitHub repository private if you do not want the templates cloned.

Two flagship projects are featured: **Temperature Predictor** (ML & full-stack web) and **MessWise** (Android mess management). All content is truthful with no invented experience.

---

## Folder Structure

```
portfolio/
│
├── backend/
│   ├── server.js                   # Express app, routes, 404
│   ├── views/
│   │   ├── layouts/main.ejs        # Shared HTML shell
│   │   ├── partials/               # Head, nav, footer, scripts
│   │   ├── home.ejs
│   │   ├── resume.ejs
│   │   ├── tech-stack.ejs
│   │   ├── messwise.ejs
│   │   ├── temperature-predictor.ejs
│   │   └── 404.ejs
│   └── public/
│       ├── css/
│       ├── js/
│       └── assets/                 # Images, favicon, resume
├── package.json
└── README.md
```

---

## Routes

| URL | Page |
| --- | --- |
| `/` | Home |
| `/resume` | Resume |
| `/tech-stack` | Tech stack |
| `/projects/temperature-predictor` | Temperature Predictor case study |
| `/projects/messwise` | MessWise case study |

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
- Status badges (Completed, Platform)
- Feature badges and technology tags
- GitHub, Live Demo, Case Study, and APK download links
- Premium hover animations

### Case Study Pages
- **Temperature Predictor** — `/projects/temperature-predictor`
- **MessWise** — `/projects/messwise`
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

- **Node.js + Express** — Server-rendered pages
- **EJS** — Templates and shared layout/partials
- **HTML5** — Semantic markup, accessibility, SEO
- **CSS3** — Custom properties, Grid, Flexbox, animations, glassmorphism
- **JavaScript (ES6+)** — Intersection Observer, Canvas API, modular functions
- **Google Fonts** — Inter, JetBrains Mono

---

## Getting Started

Requires Node.js 18 or later.

```bash
cd portfolio
npm install
npm start
# Visit http://localhost:3000
```

For auto-reload during edits:

```bash
npm run dev
```

---

## Customization Guide

### Personal Information
Update contact details, social links, and meta tags in `backend/views/home.ejs` and `backend/views/partials/`.

### Resume
Replace `backend/public/assets/resume.pdf` with your actual resume.

### Project Links
Update GitHub and Live Demo URLs in the Projects section and case study templates.

### Adding Future Projects

1. **Project card** — Duplicate the featured project `<article>` in `backend/views/home.ejs`
2. **Screenshots** — Add images to `backend/public/assets/images/`
3. **Case study** — Copy a case-study EJS template and add a route in `backend/server.js`
4. **Skills** — Add skill cards only for technologies used in the new project
5. **Metrics** — Update the Projects Completed counter in the metrics section

### Metrics Counter
```html
<span class="metric-card__value" data-counter="2" data-counter-suffix="">0</span>
```

### Colors & Theme
Edit CSS custom properties in `:root` at the top of `backend/public/css/style.css`.

---

## Deployment

GitHub Pages cannot run this app. Host the Node server on Render, Railway, Fly.io, or a VPS.

1. Set the start command to `npm start`
2. Use `PORT` from the host (the server already reads `process.env.PORT`)
3. Site live at your host URL

Make the GitHub repository **private** if you do not want the EJS templates cloned.

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
