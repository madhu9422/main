// ========== ADMIN CREDENTIALS ==========
function getAdminCredentials() {
  // Try to load from localStorage, or use defaults
  try {
    const saved = localStorage.getItem('adminCredentials');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  // Default credentials
  return { username: 'admin', password: 'admin123' };
}

function saveAdminCredentials(username, password) {
  localStorage.setItem('adminCredentials', JSON.stringify({ username, password }));
}

// ========== LOGIN FUNCTIONS ==========
function checkLoginStatus() {
  return sessionStorage.getItem('adminLoggedIn') === 'true';
}

function login(username, password) {
  const creds = getAdminCredentials();
  if (username === creds.username && password === creds.password) {
    sessionStorage.setItem('adminLoggedIn', 'true');
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem('adminLoggedIn');
}

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
      updateAndSave();
      renderAdminSkills();
      showToast('Skill removed');
    });
  });
  
  document.querySelectorAll('.admin-skill-name').forEach(inp => {
    inp.addEventListener('change', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      appData.skills[idx].name = this.value.trim() || 'Skill';
      updateAndSave();
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
      updateAndSave();
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
      updateAndSave();
      renderAdminExp();
      showToast('Experience removed');
    });
  });
  
  document.querySelectorAll('.admin-exp-title').forEach(inp => {
    inp.addEventListener('change', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      appData.experience[idx].title = this.value.trim() || 'Untitled';
      updateAndSave();
    });
  });
  
  document.querySelectorAll('.admin-exp-company').forEach(inp => {
    inp.addEventListener('change', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      appData.experience[idx].company = this.value.trim() || 'Unknown';
      updateAndSave();
    });
  });
  
  document.querySelectorAll('.admin-exp-desc').forEach(inp => {
    inp.addEventListener('change', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      const lines = this.value.split('\n').filter(l => l.trim());
      appData.experience[idx].description = lines.length ? lines : ['No description'];
      updateAndSave();
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
      updateAndSave();
      renderAdminProjects();
      showToast('Project removed');
    });
  });
  
  document.querySelectorAll('.admin-project-title').forEach(inp => {
    inp.addEventListener('change', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      appData.projects[idx].title = this.value.trim() || 'Untitled';
      updateAndSave();
    });
  });
  
  document.querySelectorAll('.admin-project-tech').forEach(inp => {
    inp.addEventListener('change', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      appData.projects[idx].tech = this.value.split(',').map(s => s.trim()).filter(s => s);
      updateAndSave();
    });
  });
  
  document.querySelectorAll('.admin-project-desc').forEach(inp => {
    inp.addEventListener('change', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      appData.projects[idx].description = this.value.trim() || 'No description';
      updateAndSave();
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
      updateAndSave();
      renderAdminCerts();
      showToast('Certification removed');
    });
  });
  
  document.querySelectorAll('.admin-cert-name').forEach(inp => {
    inp.addEventListener('change', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      appData.certifications[idx] = this.value.trim() || 'Unnamed Cert';
      updateAndSave();
    });
  });
}

function renderAdminPanel() {
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

// ========== UPDATE AND SAVE ==========
function updateAndSave() {
  saveDataToLocalStorage(appData);
  const newUrl = saveDataToURL(appData);
  window.history.replaceState({}, '', newUrl);
  showToast('✅ Changes saved! Share the URL to show your updated portfolio.');
}

// ========== SHOW/HIDE ADMIN PANEL ==========
function showAdminPanel() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminPanel').classList.add('active');
  renderAdminPanel();
}

function showLoginScreen() {
  document.getElementById('loginScreen').style.display = 'block';
  document.getElementById('adminPanel').classList.remove('active');
}

// ========== ADMIN EVENT LISTENERS ==========
document.addEventListener('DOMContentLoaded', function() {
  // Check if already logged in
  if (checkLoginStatus()) {
    appData = loadDataFromURL();
    showAdminPanel();
  }

  // ========== LOGIN FORM ==========
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const errorEl = document.getElementById('loginError');
    
    if (login(username, password)) {
      errorEl.style.display = 'none';
      appData = loadDataFromURL();
      showAdminPanel();
      showToast('✅ Login successful!');
    } else {
      errorEl.style.display = 'block';
      setTimeout(() => {
        errorEl.style.display = 'none';
      }, 3000);
    }
  });

  // ========== LOGOUT ==========
  document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      showLoginScreen();
      showToast('Logged out successfully');
    }
  });

  // ========== CHANGE PASSWORD ==========
  document.getElementById('changePasswordSubmitBtn').addEventListener('click', function() {
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    const msgEl = document.getElementById('passwordMessage');
    
    const creds = getAdminCredentials();
    
    if (current !== creds.password) {
      msgEl.style.color = '#d32f2f';
      msgEl.textContent = '❌ Current password is incorrect';
      return;
    }
    
    if (newPass.length < 6) {
      msgEl.style.color = '#d32f2f';
      msgEl.textContent = '❌ New password must be at least 6 characters';
      return;
    }
    
    if (newPass !== confirmPass) {
      msgEl.style.color = '#d32f2f';
      msgEl.textContent = '❌ Passwords do not match';
      return;
    }
    
    // Save new password
    saveAdminCredentials(creds.username, newPass);
    msgEl.style.color = '#6fcf97';
    msgEl.textContent = '✅ Password changed successfully!';
    
    // Clear fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    
    setTimeout(() => {
      msgEl.textContent = '';
    }, 4000);
  });

  // ========== UPDATE PERSONAL INFO ==========
  document.getElementById('updatePersonalBtn').addEventListener('click', function() {
    appData.name = document.getElementById('adminName').value.trim() || 'Madhukumar C.';
    appData.bio = document.getElementById('adminBio').value.trim() || 'Bio here';
    appData.about = document.getElementById('adminAbout').value.trim() || 'About me here';
    updateAndSave();
    renderAdminPanel();
    showToast('Personal info updated');
  });

  // ========== UPDATE RESUME ==========
  document.getElementById('updateResumeBtn').addEventListener('click', function() {
    const url = document.getElementById('resumeLinkInput').value.trim();
    appData.resumeLink = url;
    updateAndSave();
    document.getElementById('currentResumeDisplay').textContent = url || 'default (sample)';
    showToast(url ? 'Resume link updated' : 'Resume reset to default');
  });

  // ========== UPDATE CONTACT ==========
  document.getElementById('updateContactBtn').addEventListener('click', function() {
    appData.email = document.getElementById('adminEmail').value.trim() || 'email@example.com';
    appData.phone = document.getElementById('adminPhone').value.trim() || '+91 0000000000';
    appData.linkedin = document.getElementById('adminLinkedin').value.trim() || 'linkedin.com/in/username';
    appData.github = document.getElementById('adminGithub').value.trim() || 'github.com/username';
    updateAndSave();
    renderAdminPanel();
    showToast('Contact info updated');
  });

  // ========== ADD SKILL ==========
  document.getElementById('addSkillBtn').addEventListener('click', function() {
    const nameInput = document.getElementById('newSkillName');
    const levelInput = document.getElementById('newSkillLevel');
    const name = nameInput.value.trim();
    let level = parseInt(levelInput.value);
    if (!name) { showToast('Please enter skill name'); return; }
    if (isNaN(level) || level < 0) level = 0;
    if (level > 100) level = 100;
    appData.skills.push({ name, level });
    updateAndSave();
    nameInput.value = '';
    levelInput.value = '';
    renderAdminSkills();
    showToast('Skill added');
  });

  // ========== ADD EXPERIENCE ==========
  document.getElementById('addExpBtn').addEventListener('click', function() {
    const title = document.getElementById('newExpTitle').value.trim();
    const company = document.getElementById('newExpCompany').value.trim();
    const descText = document.getElementById('newExpDesc').value;
    if (!title || !company) { showToast('Please fill title and company'); return; }
    const description = descText.split('\n').filter(l => l.trim());
    if (!description.length) description.push('No description provided');
    appData.experience.push({ title, company, description });
    updateAndSave();
    document.getElementById('newExpTitle').value = '';
    document.getElementById('newExpCompany').value = '';
    document.getElementById('newExpDesc').value = '';
    renderAdminExp();
    showToast('Experience added');
  });

  // ========== ADD PROJECT ==========
  document.getElementById('addProjectBtn').addEventListener('click', function() {
    const title = document.getElementById('newProjectTitle').value.trim();
    const techText = document.getElementById('newProjectTech').value;
    const desc = document.getElementById('newProjectDesc').value.trim();
    if (!title) { showToast('Please enter project title'); return; }
    const tech = techText.split(',').map(s => s.trim()).filter(s => s);
    if (!tech.length) tech.push('Tech');
    appData.projects.push({ title, tech, description: desc || 'No description' });
    updateAndSave();
    document.getElementById('newProjectTitle').value = '';
    document.getElementById('newProjectTech').value = '';
    document.getElementById('newProjectDesc').value = '';
    renderAdminProjects();
    showToast('Project added');
  });

  // ========== ADD CERTIFICATION ==========
  document.getElementById('addCertBtn').addEventListener('click', function() {
    const name = document.getElementById('newCertName').value.trim();
    if (!name) { showToast('Please enter certification name'); return; }
    appData.certifications.push(name);
    updateAndSave();
    document.getElementById('newCertName').value = '';
    renderAdminCerts();
    showToast('Certification added');
  });

  // ========== RESET DATA ==========
  document.getElementById('resetDataBtn').addEventListener('click', function() {
    if (confirm('⚠️ Are you sure you want to reset all data to default? This cannot be undone!')) {
      appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
      updateAndSave();
      renderAdminPanel();
      showToast('All data reset to default');
    }
  });

  // ========== EXPORT URL ==========
  document.getElementById('exportDataBtn').addEventListener('click', function() {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('📋 URL with data copied! Share this link.');
      }).catch(() => {
        showToast('📋 Copy this URL: ' + url);
      });
    } else {
      showToast('📋 Copy this URL: ' + url);
    }
  });

  // ========== CHANGE PASSWORD BUTTON (scroll to section) ==========
  document.getElementById('changePasswordBtn').addEventListener('click', function() {
    document.querySelector('.change-password-section').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('currentPassword').focus();
  });

  // ========== KEYBOARD SHORTCUT: Enter to login ==========
  document.getElementById('loginPassword').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }
  });
});
