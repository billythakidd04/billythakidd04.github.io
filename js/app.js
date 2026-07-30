/**
 * Main Application Script for Bill Caffery Resume Web App
 */

document.addEventListener('DOMContentLoaded', async () => {
  let resumeData = null;

  try {
    const response = await fetch('resume.yaml');
    if (!response.ok) {
      throw new Error(`Failed to fetch setup/config file: ${response.status} ${response.statusText}`);
    }
    const yamlText = await response.text();
    if (!window.jsyaml) {
      throw new Error("jsyaml library is not available.");
    }
    resumeData = jsyaml.load(yamlText);
    if (!resumeData) {
      throw new Error("Parsed resume data is empty.");
    }
  } catch (err) {
    console.error('Critical Error loading resume.yaml:', err);
    document.body.innerHTML = `
      <div style="display:flex; justify-content:center; align-items:center; height:100vh; flex-direction:column; text-align:center; padding:2rem;">
        <h1 style="color:#ff003c; margin-bottom:1rem;">Error Loading Profile</h1>
        <p style="color:var(--text-secondary); max-width:500px;">
          Could not load or parse the required <code>resume.yaml</code> configuration file. <br/><br/>
          Please ensure the file exists and contains valid YAML formatting.
        </p>
      </div>`;
    return;
  }

  // Render Page Sections
  renderHero(resumeData.personal);
  renderStats(resumeData.stats, resumeData.personal);
  renderSkills(resumeData.skills);
  renderExperience(resumeData.experience);
  renderProjects(resumeData.projects);
  renderEducation(resumeData.education, resumeData.certifications);

  // Setup Event Listeners
  setupNavigation();
  setupProjectFilters(resumeData.projects);
  setupOfferForm(resumeData.personal.email);
});

/* Hero Renderer */
function renderHero(personal) {
  if (!personal) return;
  const nameEl = document.getElementById('hero-name');
  const titleEl = document.getElementById('hero-title');
  const taglineEl = document.getElementById('hero-tagline');
  const bioEl = document.getElementById('hero-bio');
  const avatarEl = document.getElementById('hero-avatar');
  const emailLink = document.getElementById('contact-email-link');

  if (nameEl) nameEl.textContent = personal.name;
  if (titleEl) titleEl.textContent = personal.title;
  if (taglineEl) taglineEl.textContent = personal.tagline;
  if (bioEl) bioEl.textContent = personal.bio;
  if (avatarEl && personal.avatar) avatarEl.src = personal.avatar;
  if (emailLink && personal.email) emailLink.href = `mailto:${personal.email}`;
}

/* Years of Experience / Stats Renderer */
function renderStats(stats) {
  const container = document.getElementById('stats-container');
  const toggleBtn = document.getElementById('toggle-stats-btn');
  const countEl = document.getElementById('stats-total-count');
  if (!container || !stats) return;

  const currentYear = new Date().getFullYear();
  let isExpanded = false;
  const initialLimit = 8;

  if (countEl) countEl.textContent = stats.length;

  function renderList() {
    const listToRender = isExpanded ? stats : stats.slice(0, initialLimit);
    container.innerHTML = listToRender.map(stat => {
      let displayValue = stat.value || '';
      if (stat.start_year) {
        const elapsedYears = Math.max(0, currentYear - stat.start_year);
        displayValue = `${elapsedYears}+`;
      }
      return `
        <div class="stat-card">
          <div class="stat-value">${displayValue}</div>
          <div class="stat-label">${stat.label}</div>
        </div>
      `;
    }).join('');

    if (toggleBtn) {
      toggleBtn.textContent = isExpanded 
        ? `Show Top Traits ↑` 
        : `Show All Traits & Skills (${stats.length}) ↓`;
    }
  }

  if (toggleBtn) {
    if (stats.length <= initialLimit) {
      toggleBtn.style.display = 'none';
    } else {
      toggleBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        renderList();
      });
    }
  }

  renderList();
}

/* Skills Renderer */
function renderSkills(skills) {
  const container = document.getElementById('skills-container');
  if (!container || !skills) return;

  container.innerHTML = skills.map(category => `
    <div class="skill-category-card">
      <h3 class="skill-category-title">
        <span>${category.category}</span>
      </h3>
      <div class="skills-chips-grid">
        ${category.items.map(skill => `
          <div class="skill-chip">
            <span class="chip-name">${skill.name}</span>
            <span class="chip-level-badge ${String(skill.level).toLowerCase()}">${skill.level}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

/* Work Experience Renderer */
function renderExperience(experience) {
  const container = document.getElementById('experience-container');
  if (!container || !experience) return;

  container.innerHTML = experience.map(item => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="timeline-meta">
          <div>
            <h3 class="job-title">${item.title}</h3>
            <div class="company-name">${item.company} • ${item.location || 'Remote'}</div>
          </div>
          <span class="job-period">${item.period}</span>
        </div>
        <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 0.75rem;">${item.summary}</p>
        <ul class="achievements-list">
          ${item.achievements.map(ach => `<li>${ach}</li>`).join('')}
        </ul>
        <div class="tech-tags">
          ${item.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

/* Projects Renderer */
function renderProjects(projects, filter = 'all') {
  const container = document.getElementById('projects-container');
  if (!container || !projects) return;

  const filtered = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category.toLowerCase().includes(filter.toLowerCase()));

  container.innerHTML = filtered.map(project => `
    <div class="project-card">
      <div class="project-img-wrapper">
        <img src="${project.image}" alt="${project.title}" class="project-img" loading="lazy" />
      </div>
      <div class="project-body">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-summary">${project.summary}</p>
        <div class="tech-tags" style="margin-top: auto;">
          ${project.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <div class="project-footer">
          <a href="${project.github}" target="_blank" rel="noopener">GitHub Code ↗</a>
          ${project.demo && project.demo !== '#' ? `<a href="${project.demo}" target="_blank" rel="noopener">Live Demo ↗</a>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

/* Education Renderer */
function renderEducation(education, certifications) {
  const eduContainer = document.getElementById('education-container');
  if (eduContainer && education) {
    eduContainer.innerHTML = education.map(edu => `
      <div class="compact-card">
        <h4 style="font-size: 1rem; color: var(--text-primary);">${edu.degree}</h4>
        <div style="font-size: 0.85rem; color: var(--accent-cyan);">${edu.institution} • ${edu.year}</div>
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.25rem;">${edu.details}</p>
      </div>
    `).join('');
  }

  const certContainer = document.getElementById('certs-container');
  if (certContainer && certifications) {
    certContainer.innerHTML = certifications.map(cert => `
      <div class="compact-card">
        <h4 style="font-size: 0.95rem; color: var(--text-primary);">${cert.name}</h4>
        <div style="font-size: 0.82rem; color: var(--text-muted);">${cert.issuer} (${cert.year})</div>
      </div>
    `).join('');
  }
}

/* Navigation Helpers */
function setupNavigation() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      const navContainer = document.getElementById('nav-container');
      if (navContainer && navContainer.classList.contains('active')) {
        navContainer.classList.remove('active');
      }
    });
  });

  const mobileToggle = document.getElementById('mobile-menu-btn');
  const navContainer = document.getElementById('nav-container');
  if (mobileToggle && navContainer) {
    mobileToggle.addEventListener('click', () => {
      navContainer.classList.toggle('active');
    });
  }
}

/* Project Filter Tabs */
function setupProjectFilters(projects) {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-filter');
      renderProjects(projects, filter);
    });
  });
}

/* Interactive "Send me a job offer" Form Logic */
function setupOfferForm(recipientEmail) {
  const form = document.getElementById('offer-form');
  const dropzone = document.getElementById('offer-dropzone');
  const fileInput = document.getElementById('offer-file-input');
  const filePreview = document.getElementById('file-preview-name');
  let uploadedFileDetails = null;

  if (!form) return;

  // File Dropzone handlers
  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        handleFileSelection(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        handleFileSelection(fileInput.files[0]);
      }
    });
  }

  function handleFileSelection(file) {
    uploadedFileDetails = {
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.type
    };
    if (filePreview) {
      filePreview.textContent = `Attached: ${uploadedFileDetails.name} (${uploadedFileDetails.size})`;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const senderName = document.getElementById('offer-sender-name').value;
    const senderEmail = document.getElementById('offer-sender-email').value;
    const company = document.getElementById('offer-company').value;
    const roleTitle = document.getElementById('offer-role-title').value;
    const salary = document.getElementById('offer-salary').value;
    const workMode = document.getElementById('offer-work-mode').value;
    const introMsg = document.getElementById('offer-intro-msg').value;

    const emailSubject = encodeURIComponent(`Job Offer: ${roleTitle} at ${company}`);
    let emailBodyText = `Hi Bill,\n\n${introMsg}\n\n--- Offer Details ---\n`;
    emailBodyText += `Recruiter/Contact: ${senderName} (${senderEmail})\n`;
    emailBodyText += `Company: ${company}\n`;
    emailBodyText += `Role Title: ${roleTitle}\n`;
    emailBodyText += `Compensation Target: ${salary || 'Negotiable'}\n`;
    emailBodyText += `Work Arrangement: ${workMode}\n`;

    if (uploadedFileDetails) {
      emailBodyText += `\nAttached Document Info: ${uploadedFileDetails.name} (${uploadedFileDetails.size})\n`;
    }

    const mailtoUrl = `mailto:${recipientEmail || 'bill.caffery@example.com'}?subject=${emailSubject}&body=${encodeURIComponent(emailBodyText)}`;

    // Copy to clipboard
    navigator.clipboard.writeText(emailBodyText).then(() => {
      showToast('Offer details copied to clipboard! Opening email app...');
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 1200);
    }).catch(() => {
      window.location.href = mailtoUrl;
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
