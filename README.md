# Bill Caffery - Personal Resume Website

A modern, high-performance personal online resume website designed for **Bill Caffery** and hosted on **GitHub Pages**.

## 🚀 Features

- **Dark Mode Aesthetics**: Premium glassmorphic design system with dark slate backdrop (`#0B0F19`), glowing cyan/violet accents, and fluid layouts.
- **Human-Editable YAML Data**: Powered by `resume.yaml` so you can update skills, work experience, projects, stats, and personal bio without editing HTML/JS.
- **Interactive "Send me a job offer" Builder**: Allows recruiters and hiring managers to submit role details, compensation, work mode, and attach/upload job description documents (PDF/DOCX/TXT) or paste text directly.
- **Filterable Projects Showcase**: Categorized portfolio grid with interactive filter tabs and high quality preview graphics.
- **Career Timeline**: Interactive vertical experience timeline with tech tags and key achievements.
- **Compact Education & Certifications**: Sleek, non-intrusive section.
- **CI/CD Workflow**: GitHub Actions workflow (`.github/workflows/ci-cd.yml`) that runs syntax linters (YAML, JS, HTML) and deploys directly to GitHub Pages.

---

## 🛠️ How to Customize Your Resume Content

All resume details are stored in `resume.yaml`. Open `resume.yaml` and update the sections:

- **`personal`**: Name, title, tagline, bio, contact email, social links, avatar image path.
- **`stats`**: Key metrics (Years experience, projects completed, uptime, etc.).
- **`skills`**: Skill categories, names, and proficiency percentages.
- **`experience`**: Companies, dates, roles, summaries, bullet points, and tech tags.
- **`projects`**: Project titles, categories, summaries, images, tags, and links.
- **`education` & `certifications`**: Degrees and certifications.

---

## 🧪 Local Development & Verification

To run and preview the site locally:

1. Launch a local static server:
   ```bash
   npx -y serve .
   # or
   python3 -m http.server 8000
   ```
2. Open `http://localhost:8000` in your web browser.

### Run Automated Linters & Syntax Validation
```bash
# Validate YAML syntax
npx -y yaml-lint resume.yaml

# Validate JavaScript syntax
node -c js/app.js

# Lint HTML
npx -y htmlhint index.html
```

---

## 🌐 Deploying to GitHub Pages

1. Push your branch to GitHub:
   ```bash
   git add .
   git commit -m "Build modern dark resume site with YAML data and CI/CD"
   git push origin feat/online-resume
   ```
2. Merge `feat/online-resume` into `master` (or `main`).
3. In GitHub Repository Settings -> **Pages**:
   - Source: **GitHub Actions**
4. Your website will automatically build and publish to `https://billythakidd04.github.io`!