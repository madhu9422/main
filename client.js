// ========== RENDER FUNCTIONS ==========
function renderSkills() {
  const grid = document.getElementById('skillsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  appData.skills.forEach(skill => {
    const div = document.createElement('div');
    div.className = 'skill-item';
    div.innerHTML = `
      <div class="skill-name"><span>${skill.name}</span><span>${skill.level}%</span></div>
      <div class="progress-bar"><div class="progress-fill" data-level="${skill.level}" style="width:0%;"></div></div>
    `;
    grid.appendChild(div);
  });
  setTimeout(() => {
    document.querySelectorAll('.progress-fill').forEach(bar => {
      const level = bar.getAttribute('data-level');
      if (level) bar.style.width = level + '%';
    });
  }, 200);
}

function renderExperience() {
  const container = document.getElementById('experienceContainer');
  if (!container) return;
  container.innerHTML = '';
  appData.experience.forEach(exp => {
    const div = document.createElement('div');
    div.className = 'exp-card';
    div.innerHTML = `
      <div class="exp-title">${exp.title}</div>
      <div class="exp-company">${exp.company}</div>
      <ul style="margin-left:1.2rem; color:#cbd5e6; display:flex; flex-direction:column; gap:8px;">
        ${exp.description.map(d => `<li>${d}</li>`).join('')}
      </ul>
    `;
    container.appendChild(div);
  });
}

function renderProjects() {
  const container = document.getElementById('projectsContainer');
  if (!container) return;
  container.innerHTML = '';
  appData.projects.forEach(proj => {
    const div = document.createElement('div');
    div.className = 'project-card';
    div.innerHTML = `
      <h3 style="font-size:1.4rem;">${proj.title}</h3>
      <div class="project-tech">${proj.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}</div>
      <p>${proj.description}</p>
    `;
    container.appendChild(div);
  });
}

function renderCertifications() {
  const list = document.getElementById('certList');
  if (!list) return;
  list.innerHTML = '';
  appData.certifications.forEach(cert => {
    const span = document.createElement('span');
    span.className = 'cert-badge';
    span.innerHTML = `<i class="fas fa-certificate"></i> ${cert}`;
    list.appendChild(span);
  });
}

function renderPersonalInfo() {
  const nameEl = document.getElementById('userName');
  const bioEl = document.getElementById('userBio');
  const aboutEl = document.getElementById('aboutText');
  if (nameEl) nameEl.textContent = `Hi, I'm ${appData.name}`;
  if (bioEl) bioEl.textContent = appData.bio;
  if (aboutEl) aboutEl.textContent = appData.about;
}

function renderContactInfo() {
  const emailEl = document.getElementById('contactEmail');
  const phoneEl = document.getElementById('contactPhone');
  const linkedinEl = document.getElementById('contactLinkedin');
  const githubEl = document.getElementById('contactGithub');
  if (emailEl) emailEl.textContent = appData.email;
  if (phoneEl) phoneEl.textContent = appData.phone;
  if (linkedinEl) linkedinEl.textContent = appData.linkedin;
  if (githubEl) githubEl.textContent = appData.github;
  
  // Social links
  const linkedinLink = document.getElementById('linkedinLink');
  const githubLink = document.getElementById('githubLink');
  const emailLink = document.getElementById('emailLink');
  if (linkedinLink) linkedinLink.href = `https://${appData.linkedin}`;
  if (githubLink) githubLink.href = `https://${appData.github}`;
  if (emailLink) emailLink.href = `mailto:${appData.email}`;
}

function renderAll() {
  renderSkills();
  renderExperience();
  renderProjects();
  renderCertifications();
  renderPersonalInfo();
  renderContactInfo();
}

// ========== RESUME DOWNLOAD ==========
document.addEventListener('DOMContentLoaded', function() {
  const downloadBtn = document.getElementById('downloadResumeBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (appData.resumeLink) {
        window.open(appData.resumeLink, '_blank');
        showToast('Opening resume link...');
      } else {
        const content = `${appData.name} - Technical Operations & Cybersecurity\n\n${appData.about}\n\nSkills: ${appData.skills.map(s => s.name).join(', ')}`;
        const blob = new Blob([content], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${appData.name.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('✓ Resume downloaded (sample)');
      }
    });
  }

  // ========== CONTACT FORM ==========
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const msg = document.getElementById('formMsg').value.trim();
      const fb = document.getElementById('formFeedback');
      if (name && email && msg) {
        fb.innerHTML = '✨ Thanks! I\'ll get back to you soon.';
        fb.style.color = '#6fcf97';
        this.reset();
        setTimeout(() => fb.innerHTML = '', 4000);
      } else {
        fb.innerHTML = '⚠️ Please fill all fields.';
        fb.style.color = '#ffa26b';
        setTimeout(() => { if (fb.innerHTML === '⚠️ Please fill all fields.') fb.innerHTML = ''; }, 2500);
      }
    });
  }

  // ========== INIT ==========
  renderAll();
  startTyping();
});

// Listen for storage changes (when admin updates data)
window.addEventListener('storage', function(e) {
  if (e.key === 'portfolioData') {
    appData = loadData();
    renderAll();
    showToast('Data updated from admin panel');
  }
});
