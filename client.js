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
  }, 300);
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
      <ul>
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
      <h3>${proj.title}</h3>
      <div class="project-tech">${proj.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}</div>
      <p>${proj.description}</p>
    `;
    container.appendChild(div);
  });
}

async function renderCertifications() {
  const list = document.getElementById('certList');
  if (!list) return;
  list.innerHTML = '';
  
  for (const cert of appData.certifications) {
    const isFile = typeof cert === 'object';
    const certName = isFile ? cert.name : cert;
    const hasFile = isFile && cert.fileId;
    
    const span = document.createElement('span');
    span.className = 'cert-badge';
    span.innerHTML = `
      <i class="fas fa-certificate"></i> ${certName}
      ${hasFile ? `<button class="view-cert-btn-client" title="View certificate"><i class="fas fa-eye"></i></button>` : ''}
    `;
    list.appendChild(span);
    
    if (hasFile) {
      const viewBtn = span.querySelector('.view-cert-btn-client');
      viewBtn.addEventListener('click', async function(e) {
        e.stopPropagation();
        try {
          const fileData = await getFileData(cert.fileId);
          if (fileData && fileData.data) {
            window.open(fileData.data, '_blank');
          } else {
            showToast('❌ File not found', 'error');
          }
        } catch (error) {
          showToast('❌ Error loading file', 'error');
        }
      });
    }
  }
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
  
  const linkedinLink = document.getElementById('linkedinLink');
  const githubLink = document.getElementById('githubLink');
  const emailLink = document.getElementById('emailLink');
  const footerLinkedin = document.getElementById('footerLinkedin');
  const footerGithub = document.getElementById('footerGithub');
  const footerEmail = document.getElementById('footerEmail');
  
  const linkedinUrl = `https://${appData.linkedin}`;
  const githubUrl = `https://${appData.github}`;
  const emailUrl = `mailto:${appData.email}`;
  
  if (linkedinLink) linkedinLink.href = linkedinUrl;
  if (githubLink) githubLink.href = githubUrl;
  if (emailLink) emailLink.href = emailUrl;
  if (footerLinkedin) footerLinkedin.href = linkedinUrl;
  if (footerGithub) footerGithub.href = githubUrl;
  if (footerEmail) footerEmail.href = emailUrl;
}

function renderAll() {
  renderPersonalInfo();
  renderSkills();
  renderExperience();
  renderProjects();
  renderCertifications();
  renderContactInfo();
}

// ========== RESUME DOWNLOAD ==========
document.addEventListener('DOMContentLoaded', function() {
  const downloadBtn = document.getElementById('downloadResumeBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      
      try {
        if (appData.resumeFileId) {
          const fileData = await getFileData(appData.resumeFileId);
          if (fileData && fileData.data) {
            const link = document.createElement('a');
            link.href = fileData.data;
            link.download = fileData.filename || 'resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('📄 Downloading resume...', 'success');
            return;
          }
        }
        
        if (appData.resumeLink) {
          window.open(appData.resumeLink, '_blank');
          showToast('Opening resume link...');
          return;
        }
        
        // Generate default resume
        const content = `${appData.name}\n\n${appData.about}\n\nSkills: ${appData.skills.map(s => s.name).join(', ')}\n\nExperience:\n${appData.experience.map(e => `${e.title} - ${e.company}`).join('\n')}`;
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
      } catch (error) {
        showToast('❌ Error downloading resume', 'error');
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

// Listen for storage changes
window.addEventListener('storage', function(e) {
  if (e.key === 'portfolioData') {
    appData = loadDataFromLocalStorage();
    renderAll();
    showToast('Data updated from admin panel');
  }
});
