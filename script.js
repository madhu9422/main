// ========== DEFAULT DATA ==========
const DEFAULT_DATA = {
  name: "Madhukumar C.",
  bio: "I specialize in Technical Support, Linux Administration, Networking, Server Monitoring, and Security Operations.",
  about: "I am a Computer Science graduate with hands-on experience at Eduquity Career Technologies, supporting large-scale CBT infrastructure, server monitoring, incident management, and network troubleshooting. I am passionate about networking, Linux, cybersecurity, and automation using Python.",
  email: "madhukumarc009@gmail.com",
  phone: "+91 8688050394",
  linkedin: "linkedin.com/in/madhukumarc",
  github: "github.com/madhukumarc",
  resumeLink: "",
  skills: [
    { name: "Windows Server", level: 85 },
    { name: "Linux (Ubuntu, Kali)", level: 88 },
    { name: "TCP/IP & DNS", level: 90 },
    { name: "DHCP & Wireshark", level: 82 },
    { name: "Python Automation", level: 80 },
    { name: "SQL & Power BI", level: 78 },
    { name: "Git & GitHub", level: 85 },
    { name: "Server Monitoring", level: 86 },
    { name: "Incident Management", level: 84 }
  ],
  experience: [
    {
      title: "Technical Operations & Server Support Executive",
      company: "Eduquity Career Technologies | May 2025 – Present",
      description: [
        "✅ Supported 1000+ concurrent CBT candidates with 99.9% uptime.",
        "✅ Server monitoring & troubleshooting (Linux/Windows), incident response.",
        "✅ Network troubleshooting (TCP/IP, DNS, DHCP) and technical support for exam centers.",
        "✅ Automated log analysis scripts reducing resolution time by 20%."
      ]
    }
  ],
  projects: [
    {
      title: "Network Monitoring & Log Analysis",
      tech: ["Python", "ELK Stack", "Log Monitoring"],
      description: "Built a centralized log analysis pipeline using Python and ELK to monitor network anomalies, real-time dashboards, and automated alerting for suspicious activities."
    },
    {
      title: "Security Operations Dashboard",
      tech: ["Power BI", "SQL", "Python"],
      description: "Designed interactive dashboard for SOC metrics, visualizing incident trends, firewall logs, and threat patterns, enabling data-driven security decisions."
    },
    {
      title: "Networking Lab (DNS/DHCP)",
      tech: ["Ubuntu", "Cisco Packet Tracer", "DNS/DHCP"],
      description: "Configured enterprise-grade DNS & DHCP servers on Ubuntu, simulated multi-VLAN network in Packet Tracer, and implemented firewall rules."
    }
  ],
  certifications: [
    "CompTIA Network+",
    "Cisco Networking Basics",
    "Linux Administration Fundamentals",
    "Python for Network Automation",
    "ITIL 4 Foundation (In Progress)"
  ]
};

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
    const cleanData = JSON.parse(JSON.stringify(data));
    if (cleanData.certifications) {
      cleanData.certifications = cleanData.certifications.map(cert => {
        if (typeof cert === 'object' && cert.file) {
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
  // Smooth scroll for navigation links
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

  // Navbar scroll effect
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }
});
