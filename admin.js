// ========== ADMIN RENDER FUNCTIONS ==========
function renderAdminSkills() {
  const list = document.getElementById('adminSkillList');
  if (!list) return;
  list.innerHTML = '';
  appData.skills.forEach((skill, index) => {
    const row = document.createElement('div');
    row.className = 'skill-row';
    row.innerHTML = `
      <input type="text" value="${skill.name}" data-idx="${index}" class="admin-skill-name" style="flex:2;">
      <input type="number" value="${skill.level}" data-idx="${index}" class="admin-skill-level" style="width:80px;" min="0" max="100">
      <button data-idx="${index}" class="danger remove-skill-btn"><i class="fas fa-trash"></i></button>
    `;
    list.appendChild(row);
  });
  
  document.querySelectorAll('.remove-skill-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      appData.skills.splice(idx, 1);
      saveData(appData);
      renderAdminSkills();
      showToast('Skill removed');
    });
  });
  
  document.querySelectorAll('.admin-skill-name').forEach(inp => {
    inp.addEventListener('change', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      appData.skills[idx].name = this.value.trim() || 'Skill';
      saveData(appData);
    });
  });
  
  document.querySelectorAll('.admin-skill-level').forEach(inp => {
    inp.addEventListener('change', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      let val = parseInt(this.value);
      if (isNaN(val) || val < 0) val = 0;
      if (val > 100) val = 100;
      appData.skills[idx].level = val;
      this.value = val;
      saveData(appData);
    });
  });
}

function renderAdminExp() {
  const list = document.getElementById('adminExpList');
  if (!list) return;
  list.innerHTML = '';
  appData.experience.forEach((exp, index) => {
    const div = document.createElement('div');
    div.className = 'exp-item';
    div.innerHTML = `
      <input type="text" value="${exp.title}" data-idx="${index}" class="admin-exp-title" placeholder="Title">
      <input type="text" value="${exp.company}" data-idx="${index}" class="admin-exp-company" placeholder="Company & Date">
      <textarea rows="3" data-idx="${index}" class="admin-exp-desc" placeholder="Description (one per line)">${exp.description.join('\n')}</textarea>
      <button data-idx="${index}" class="danger remove-exp-btn"><i class="fas fa-trash"></i> Remove</button>
    `;
    list.appendChild(div);
  });
  
  document.querySelectorAll('.remove-exp-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      appData.experience.splice(idx, 1);
      saveData(appData);
      renderAdminExp();
      showToast('Experience removed');
    });
  });
  
  document.querySelectorAll('.admin-exp-title').forEach(inp => {
    inp.addEventListener('change', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      appData.experience[idx].title = this.value.trim() || 'Untitled';
      saveData(appData);
    });
  });
  
  document.querySelectorAll('.admin-exp-company').forEach(inp => {
    inp.addEventListener('change', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      appData.experience[idx].company = this.value.trim() || 'Unknown';
      saveData(appData);
    });
  });
  
  document.querySelectorAll('.admin-exp-desc').forEach(inp => {
    inp.addEventListener('change', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      const lines = this.value.split('\n').filter(l => l.trim());
      appData.experience[idx].description = lines.length ? lines : ['No description'];
      saveData(appData);
    });
  });
}

function renderAdminProjects() {
  const list = document.getElementById('adminProjectList');
  if (!list) return;
  list.innerHTML = '';
  appData.projects.forEach((proj, index) => {
    const div = document.createElement('div');
    div.className = 'project-item';
    div.innerHTML = `
      <input type="text" value="${proj.title}" data-idx="${index}" class="admin-project-title" placeholder="Title">
      <input type="text" value="${proj.tech.join(', ')}" data-idx="${index}" class="admin-project-tech" placeholder="Technologies (comma separated)">
      <textarea rows="2" data-idx="${index}" class="admin-project-desc" placeholder="Description">${proj.description}</textarea>
      <button data-idx="${index}" class="danger remove-project-btn"><i class="fas fa-trash"></i> Remove</button>
    `;
    list.appendChild(div);
  });
  
  document.querySelectorAll('.remove-project-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      appData.projects.splice(idx, 1);
      saveData(appData);
      renderAdminProjects();
      showToast('Project removed');
    });
  });
  
  document.querySelectorAll('.admin-project-title').forEach(inp => {
    inp.addEventListener('change', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      appData.projects[idx].title = this.value.trim() || 'Untitled';
      saveData(appData);
    });
  });
  
  document.querySelectorAll('.admin-project-tech').forEach(inp => {
    inp.addEventListener('change', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      appData.projects[idx].tech = this.value.split(',').map(s => s.trim()).filter(s => s);
      saveData(appData);
    });
  });
  
  document.querySelectorAll('.admin-project-desc').forEach(inp => {
    inp.addEventListener('change', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      appData.projects[idx].description = this.value.trim() || 'No description';
      saveData(appData);
    });
  });
}

function renderAdminCerts() {
  const list = document.getElementById('adminCertList');
  if (!list) return;
  list.innerHTML = '';
  appData.certifications.forEach((cert, index) => {
    const row = document.createElement('div');
    row.className = 'cert-row';
    row.innerHTML = `
      <input type="text" value="${cert}" data-idx="${index}" class="admin-cert-name" style="flex:1;">
      <button data-idx="${index}" class="danger remove-cert-btn"><i class="fas fa-trash"></i></button>
    `;
    list.appendChild(row);
  });
  
  document.querySelectorAll('.remove-cert-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      appData.certifications.splice(idx, 1);
      saveData(appData);
      renderAdminCerts();
      showToast('Certification removed');
    });
  });
  
  document.querySelectorAll('.admin-cert-name').forEach(inp => {
    inp.addEventListener('change', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      appData.certifications[idx] = this.value.trim() || 'Unnamed Cert';
      saveData(appData);
    });
  });
}

function renderAdminPanel() {
  // Populate form fields
  document.getElementById('adminName').value = appData.name;
  document.getElementById('adminBio').value = appData.bio;
  document.getElementById('adminAbout').value = appData.about;
  document.getElementById('adminEmail').value = appData.email;
  document.getElementById('adminPhone').value = appData.phone;
  document.getElementById('adminLinkedin').value = appData.linkedin;
  document.getElementById('adminGithub').value = appData.github;
  document.getElementById('resumeLinkInput').value = appData.resumeLink || '';
  document.getElementById('currentResumeDisplay').textContent = appData.resumeLink || 'default (sample)';
  
  renderAdminSkills();
  renderAdminExp();
  renderAdminProjects();
  renderAdminCerts();
}

// ========== ADMIN EVENT LISTENERS ==========
document.addEventListener('DOMContentLoaded', function() {
  // Load latest data
  appData = loadData();
  renderAdminPanel();

  // Update Personal Info
  document.getElementById('updatePersonalBtn').addEventListener('click', function() {
    appData.name = document.getElementById('adminName').value.trim() || 'Madhukumar C.';
    appData.bio = document.getElementById('adminBio').value.trim() || 'Bio here';
    appData.about = document.getElementById('adminAbout').value.trim() || 'About me here';
    saveData(appData);
    renderAdminPanel();
    showToast('Personal info updated');
  });

  // Update Resume
  document.getElementById('updateResumeBtn').addEventListener('click', function() {
    const url = document.getElementById('resumeLinkInput').value.trim();
    appData.resumeLink = url;
    saveData(appData);
    document.getElementById('currentResumeDisplay').textContent = url || 'default (sample)';
    showToast(url ? 'Resume link updated' : 'Resume reset to default');
  });

  // Update Contact Info
  document.getElementById('updateContactBtn').addEventListener('click', function() {
    appData.email = document.getElementById('adminEmail').value.trim() || 'email@example.com';
    appData.phone = document.getElementById('adminPhone').value.trim() || '+91 0000000000';
    appData.linkedin = document.getElementById('adminLinkedin').value.trim() || 'linkedin.com/in/username';
    appData.github = document.getElementById('adminGithub').value.trim() || 'github.com/username';
    saveData(appData);
    renderAdminPanel();
    showToast('Contact info updated');
  });

  // Add Skill
  document.getElementById('addSkillBtn').addEventListener('click', function() {
    const nameInput = document.getElementById('newSkillName');
    const levelInput = document.getElementById('newSkillLevel');
    const name = nameInput.value.trim();
    let level = parseInt(levelInput.value);
    if (!name) { showToast('Please enter skill name'); return; }
    if (isNaN(level) || level < 0) level = 0;
    if (level > 100) level = 100;
    appData.skills.push({ name, level });
    saveData(appData);
    nameInput.value = '';
    levelInput.value = '';
    renderAdminSkills();
    showToast('Skill added');
  });

  // Add Experience
  document.getElementById('addExpBtn').addEventListener('click', function() {
    const title = document.getElementById('newExpTitle').value.trim();
    const company = document.getElementById('newExpCompany').value.trim();
    const descText = document.getElementById('newExpDesc').value;
    if (!title || !company) { showToast('Please fill title and company'); return; }
    const description = descText.split('\n').filter(l => l.trim());
    if (!description.length) description.push('No description provided');
    appData.experience.push({ title, company, description });
    saveData(appData);
    document.getElementById('newExpTitle').value = '';
    document.getElementById('newExpCompany').value = '';
    document.getElementById('newExpDesc').value = '';
    renderAdminExp();
    showToast('Experience added');
  });

  // Add Project
  document.getElementById('addProjectBtn').addEventListener('click', function() {
    const title = document.getElementById('newProjectTitle').value.trim();
    const techText = document.getElementById('newProjectTech').value;
    const desc = document.getElementById('newProjectDesc').value.trim();
    if (!title) { showToast('Please enter project title'); return; }
    const tech = techText.split(',').map(s => s.trim()).filter(s => s);
    if (!tech.length) tech.push('Tech');
    appData.projects.push({ title, tech, description: desc || 'No description' });
    saveData(appData);
    document.getElementById('newProjectTitle').value = '';
    document.getElementById('newProjectTech').value = '';
    document.getElementById('newProjectDesc').value = '';
    renderAdminProjects();
    showToast('Project added');
  });

  // Add Certification
  document.getElementById('addCertBtn').addEventListener('click', function() {
    const name = document.getElementById('newCertName').value.trim();
    if (!name) { showToast('Please enter certification name'); return; }
    appData.certifications.push(name);
    saveData(appData);
    document.getElementById('newCertName').value = '';
    renderAdminCerts();
    showToast('Certification added');
  });

  // Reset Data
  document.getElementById('resetDataBtn').addEventListener('click', function() {
    if (confirm('⚠️ Are you sure you want to reset all data to default? This cannot be undone!')) {
      appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
      saveData(appData);
      renderAdminPanel();
      showToast('All data reset to default');
    }
  });
});
