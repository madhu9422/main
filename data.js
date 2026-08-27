// ========== DATA MANAGEMENT ==========
function loadDataFromURL() {
  const params = new URLSearchParams(window.location.search);
  const dataParam = params.get('data');
  if (dataParam) {
    try {
      const decoded = decodeURIComponent(atob(dataParam));
      const parsed = JSON.parse(decoded);
      return { ...DEFAULT_DATA, ...parsed };
    } catch (e) {
      console.warn('Failed to parse URL data, using defaults');
    }
  }
  return loadDataFromLocalStorage();
}

function loadDataFromLocalStorage() {
  try {
    const saved = localStorage.getItem('portfolioData');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Handle both old and new certification formats
      return { ...DEFAULT_DATA, ...parsed };
    }
  } catch (e) {
    console.warn('Error loading data from localStorage, using defaults');
  }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveDataToLocalStorage(data) {
  localStorage.setItem('portfolioData', JSON.stringify(data));
}

function saveDataToURL(data) {
  try {
    // Filter out file data from URL (keep only metadata)
    const cleanData = JSON.parse(JSON.stringify(data));
    if (cleanData.certifications) {
      cleanData.certifications = cleanData.certifications.map(cert => {
        if (typeof cert === 'object' && cert.file) {
          // Keep only name and ID, remove file data for URL
          return { name: cert.name, id: cert.id, hasFile: true };
        }
        return cert;
      });
    }
    const json = JSON.stringify(cleanData);
    const encoded = btoa(encodeURIComponent(json));
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('data', encoded);
    return url.toString();
  } catch (e) {
    console.warn('Failed to encode data to URL:', e);
    return window.location.href;
  }
}

// Global data object
let appData = loadDataFromURL();

// ========== TOAST NOTIFICATION ==========
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ========== TYPING ANIMATION ==========
function startTyping() {
  const roles = ["Network Administrator", "SOC Analyst", "Cybersecurity Enthusiast", "Linux Admin", "TechOps Engineer"];
  let roleIndex = 0, charIndex = 0, isDeleting = false;
  const typedSpan = document.getElementById('typed');
  if (!typedSpan) return;
  
  function typeEffect() {
    const current = roles[roleIndex];
    if (isDeleting) { 
      typedSpan.textContent = current.substring(0, charIndex-1); 
      charIndex--; 
    } else { 
      typedSpan.textContent = current.substring(0, charIndex+1); 
      charIndex++; 
    }
    if (!isDeleting && charIndex === current.length) { 
      isDeleting = true; 
      setTimeout(typeEffect, 2000); 
      return; 
    }
    if (isDeleting && charIndex === 0) { 
      isDeleting = false; 
      roleIndex = (roleIndex+1) % roles.length; 
      setTimeout(typeEffect, 200); 
      return; 
    }
    setTimeout(typeEffect, isDeleting ? 60 : 120);
  }
  typeEffect();
}

// ========== SMOOTH SCROLL ==========
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) { 
        e.preventDefault(); 
        target.scrollIntoView({ behavior: 'smooth' }); 
      }
    });
  });
});
