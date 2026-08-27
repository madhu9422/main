// ========== ADMIN CREDENTIALS ==========
function getAdminCredentials() {
  try {
    const saved = localStorage.getItem('adminCredentials');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.username && parsed.password) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error loading credentials, using defaults');
  }
  // Default credentials
  return { username: 'admin', password: 'admin123' };
}

function saveAdminCredentials(username, password) {
  localStorage.setItem('adminCredentials', JSON.stringify({ username, password }));
  console.log('✅ Credentials saved:', username);
}

// ========== FILE STORAGE ==========
function getFileStorage() {
  try {
    const saved = localStorage.getItem('fileStorage');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  return { resume: null, certificates: {} };
}

function saveFileStorage(storage) {
  localStorage.setItem('fileStorage', JSON.stringify(storage));
}

// ========== FILE UPLOAD HELPERS ==========
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase();
}

function getFileIcon(filename) {
  const ext = getFileExtension(filename);
  if (ext === 'pdf') return 'fa-file-pdf';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'fa-file-image';
  return 'fa-file';
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// ========== LOGIN FUNCTIONS ==========
function checkLoginStatus() {
  return sessionStorage.getItem('adminLoggedIn') === 'true';
}

function login(username, password) {
  const creds = getAdminCredentials();
  console.log('🔑 Login - Input:', username, password);
  console.log('🔑 Login - Stored:', creds.username, creds.password);
  
  if (username === creds.username && password === creds.password) {
    sessionStorage.setItem('adminLoggedIn', 'true');
    sessionStorage.setItem('loginTime', Date.now().toString());
    console.log('✅ Login successful!');
    return true;
  }
  console.log('❌ Login failed!');
  return false;
}

function logout() {
  sessionStorage.removeItem('adminLoggedIn');
  sessionStorage.removeItem('loginTime');
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
    const isFile = typeof cert === 'object';
    const certName = isFile ? cert.name : cert;
    const certFile = isFile && cert.file ? cert.file : null;
    
    const div = document.createElement('div');
    div.className = 'cert-item';
    div.innerHTML = `
      <div class="cert-info" style="flex:1;">
        <input type="text" value="${certName}" data-idx="${index}" class="admin-cert-name" placeholder="Certification name" style="margin-bottom:0;">
      </div>
      <div class="cert-actions">
        ${certFile ? `<button data-idx="${index}" class="view-cert-btn success" style="background:#2e7d32;"><i class="fas fa-eye"></i> View</button>` : ''}
        <button data-idx="${index}" class="upload-cert-btn" style="background:#1e88e5;"><i class="fas fa-upload"></i> ${certFile ? 'Replace' : 'Upload'}</button>
        <button data-idx="${index}" class="danger remove-cert-btn"><i class="fas fa-trash"></i></button>
      </div>
      <input type="file" accept=".pdf,.jpg,.jpeg,.png" data-idx="${index}" class="cert-file-input" style="display:none;">
      ${certFile ? `<div class="file-preview" style="width:100%;margin-top:8px;">
        <i class="fas ${getFileIcon(certFile.filename)}"></i>
        <span class="file-name">${certFile.filename}</span>
        <span class="file-size">${formatFileSize(certFile.size)}</span>
      </div>` : ''}
    `;
    list.appendChild(div);
  });
  
  document.querySelectorAll('.admin-cert-name').forEach(inp => {
    inp.addEventListener('change', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      const newName = this.value.trim();
      if (!newName) return;
      
      const current = appData.certifications[idx];
      if (typeof current === 'object') {
        current.name = newName;
      } else {
        appData.certifications[idx] = newName;
      }
      updateAndSave();
    });
  });
  
  document.querySelectorAll('.upload-cert-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      const fileInput = document.querySelector(`.cert-file-input[data-idx="${idx}"]`);
      if (fileInput) {
        fileInput.click();
      }
    });
  });
  
  document.querySelectorAll('.cert-file-input').forEach(input => {
    input.addEventListener('change', async function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      const file = this.files[0];
      if (!file) return;
      
      try {
        const base64 = await fileToBase64(file);
        const certData = {
          name: typeof appData.certifications[idx] === 'object' ? appData.certifications[idx].name : appData.certifications[idx],
          file: {
            filename: file.name,
            size: file.size,
            type: file.type,
            data: base64
          },
          id: 'cert_' + Date.now() + '_' + idx
        };
        appData.certifications[idx] = certData;
        updateAndSave();
        renderAdminCerts();
        showToast('✅ Certificate file uploaded: ' + file.name);
      } catch (error) {
        showToast('❌ Error uploading file: ' + error.message);
      }
    });
  });
  
  document.querySelectorAll('.view-cert-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      const cert = appData.certifications[idx];
      if (typeof cert === 'object' && cert.file && cert.file.data) {
        window.open(cert.file.data, '_blank');
      } else {
        showToast('❌ No file attached to this certificate');
      }
    });
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
}

function renderAdminPanel() {
  document.getElementById('adminName').value = appData.name;
  document.getElementById('adminBio').value = appData.bio;
  document.getElementById('adminAbout').value = appData.about;
  document.getElementById('adminEmail').value = appData.email;
  document.getElementById('adminPhone').value = appData.phone;
  document.getElementById('adminLinkedin').value = appData.linkedin;
  document.getElementById('adminGithub').value = appData.github;
  
  const fileStorage = getFileStorage();
  if (fileStorage.resume) {
    document.getElementById('resumePreview').style.display = 'flex';
    document.getElementById('resumeFileName').textContent = fileStorage.resume.filename;
    document.getElementById('resumeFileSize').textContent = formatFileSize(fileStorage.resume.size);
    document.getElementById('currentResumeDisplay').textContent = fileStorage.resume.filename;
  } else {
    document.getElementById('resumePreview').style.display = 'none';
    document.getElementById('currentResumeDisplay').textContent = 'No resume uploaded';
  }
  
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
  showToast('✅ Changes saved!');
}

// ========== SHOW/HIDE ADMIN PANEL ==========
function showAdminPanel() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminPanel').classList.add('active');
  renderAdminPanel();
  showToast('✅ Welcome to Admin Panel!');
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
    
    console.log('🔑 Login attempt:', username);
    
    if (login(username, password)) {
      errorEl.style.display = 'none';
      appData = loadDataFromURL();
      showAdminPanel();
    } else {
      errorEl.style.display = 'block';
      setTimeout(() => {
        errorEl.style.display = 'none';
      }, 4000);
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
    
    saveAdminCredentials(creds.username, newPass);
    msgEl.style.color = '#6fcf97';
    msgEl.textContent = '✅ Password changed successfully!';
    
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

  // ========== UPLOAD RESUME ==========
  document.getElementById('uploadResumeBtn').addEventListener('click', async function() {
    const fileInput = document.getElementById('resumeFileInput');
    const file = fileInput.files[0];
    if (!file) {
      showToast('⚠️ Please select a file first');
      return;
    }
    
    const progress = document.getElementById('resumeUploadProgress');
    progress.classList.add('active');
    progress.textContent = '⏳ Uploading...';
    
    try {
      const base64 = await fileToBase64(file);
      const fileStorage = getFileStorage();
      fileStorage.resume = {
        filename: file.name,
        size: file.size,
        type: file.type,
        data: base64
      };
      saveFileStorage(fileStorage);
      
      progress.textContent = '✅ Upload complete!';
      setTimeout(() => progress.classList.remove('active'), 2000);
      
      document.getElementById('resumePreview').style.display = 'flex';
      document.getElementById('resumeFileName').textContent = file.name;
      document.getElementById('resumeFileSize').textContent = formatFileSize(file.size);
      document.getElementById('currentResumeDisplay').textContent = file.name;
      fileInput.value = '';
      
      showToast('✅ Resume uploaded successfully!');
    } catch (error) {
      progress.textContent = '❌ Error: ' + error.message;
      setTimeout(() => progress.classList.remove('active'), 3000);
      showToast('❌ Error uploading file');
    }
  });
  
  document.getElementById('resumeFileInput').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      document.getElementById('resumePreview').style.display = 'flex';
      document.getElementById('resumeFileName').textContent = file.name;
      document.getElementById('resumeFileSize').textContent = formatFileSize(file.size);
    }
  });
  
  document.getElementById('removeResumeBtn').addEventListener('click', function() {
    if (confirm('Remove uploaded resume?')) {
      const fileStorage = getFileStorage();
      fileStorage.resume = null;
      saveFileStorage(fileStorage);
      document.getElementById('resumePreview').style.display = 'none';
      document.getElementById('currentResumeDisplay').textContent = 'No resume uploaded';
      document.getElementById('resumeFileInput').value = '';
      showToast('Resume removed');
    }
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
  document.getElementById('addCertBtn').addEventListener('click', async function() {
    const name = document.getElementById('newCertName').value.trim();
    const fileInput = document.getElementById('newCertFile');
    const file = fileInput.files[0];
    
    if (!name) { showToast('Please enter certification name'); return; }
    
    let certData = { name };
    
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        certData.file = {
          filename: file.name,
          size: file.size,
          type: file.type,
          data: base64
        };
        certData.id = 'cert_' + Date.now();
      } catch (error) {
        showToast('❌ Error processing file: ' + error.message);
        return;
      }
    }
    
    appData.certifications.push(certData);
    updateAndSave();
    document.getElementById('newCertName').value = '';
    document.getElementById('newCertFile').value = '';
    document.getElementById('newCertPreview').style.display = 'none';
    renderAdminCerts();
    showToast(file ? '✅ Certification with file added' : 'Certification added');
  });
  
  document.getElementById('newCertFile').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      document.getElementById('newCertPreview').style.display = 'flex';
      document.getElementById('newCertFileName').textContent = file.name;
      document.getElementById('newCertFileSize').textContent = formatFileSize(file.size);
    }
  });

  // ========== RESET DATA ==========
  document.getElementById('resetDataBtn').addEventListener('click', function() {
    if (confirm('⚠️ Are you sure you want to reset all data to default? This cannot be undone!')) {
      appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
      localStorage.removeItem('fileStorage');
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

  // ========== CHANGE PASSWORD BUTTON ==========
  document.getElementById('changePasswordBtn').addEventListener('click', function() {
    document.querySelector('.change-password-section').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('currentPassword').focus();
  });

  // ========== KEYBOARD SHORTCUTS ==========
  document.getElementById('loginPassword').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }
  });
  
  document.getElementById('loginUsername').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }
  });
});
