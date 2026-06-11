/* Job Seeker Dashboard Logic - Stackly Job Portal */

// Protect page
enforceRouteGuard('job_seeker');

// Keys
const JOBS_KEY = 'stackly_jobs';
const APPLICATIONS_KEY = 'stackly_applications';
const SAVED_JOBS_KEY = 'stackly_saved_jobs';

// Default Jobs list if empty
const DEFAULT_JOBS = [
  {
    id: "job-1",
    title: "Senior Frontend Engineer",
    company: "Vortex Technologies",
    logoText: "VT",
    location: "San Francisco, CA (Hybrid)",
    salary: "$130,000 - $160,000",
    type: "Full-time",
    tags: ["React", "CSS3", "JavaScript", "UI/UX"],
    description: "Looking for a seasoned UI engineer to lead development of our analytics dashboard. Experience in high performance charts and responsive web standards is required.",
    datePosted: "2026-06-05",
    postedBy: "recruiter"
  },
  {
    id: "job-2",
    title: "Full Stack Developer",
    company: "SaaSify Systems",
    logoText: "SS",
    location: "Remote (US/Canada)",
    salary: "$110,000 - $140,000",
    type: "Full-time",
    tags: ["Node.js", "Express", "PostgreSQL", "Vanilla JS"],
    description: "Join our core platform team building cloud automation systems. You will optimize database schemas and build clean browser admin control interfaces.",
    datePosted: "2026-06-08",
    postedBy: "recruiter"
  },
  {
    id: "job-3",
    title: "Product Designer",
    company: "Apex Creative",
    logoText: "AC",
    location: "New York, NY (On-site)",
    salary: "$95,000 - $125,000",
    type: "Full-time",
    tags: ["Figma", "Design Systems", "Prototyping"],
    description: "Seeking a designer with a passion for user-centric interfaces, interactive patterns, and clean SaaS style guides. You will cooperate closely with the frontend engineering team.",
    datePosted: "2026-06-09",
    postedBy: "recruiter"
  },
  {
    id: "job-4",
    title: "DevOps Engineer",
    company: "CloudCore",
    logoText: "CC",
    location: "London, UK (Remote)",
    salary: "£80,000 - £100,000",
    type: "Contract",
    tags: ["AWS", "Docker", "CI/CD", "Terraform"],
    description: "Manage deployment pipelines, Docker environments, and multi-region AWS architectures. Focus on automated recovery and performance scalability.",
    datePosted: "2026-06-07",
    postedBy: "system"
  },
  {
    id: "job-5",
    title: "Marketing Growth Analyst",
    company: "ScaleLabs Ltd",
    logoText: "SL",
    location: "Chicago, IL (Hybrid)",
    salary: "$85,000 - $105,000",
    type: "Full-time",
    tags: ["Google Analytics", "SEO", "A/B Testing"],
    description: "Optimize user acquisition channels, run cohort analyses, and manage performance advertising budgets. Experience with visual dashboards is highly valued.",
    datePosted: "2026-06-03",
    postedBy: "system"
  },
  {
    id: "job-6",
    title: "Support Operations Specialist",
    company: "Helpdesk Inc",
    logoText: "HI",
    location: "Austin, TX (Remote)",
    salary: "$55,000 - $70,000",
    type: "Full-time",
    tags: ["Zendesk", "Customer Service", "Technical Support"],
    description: "Deliver high quality support experiences to our enterprise customers. Help configure integrations and triage client platform questions.",
    datePosted: "2026-06-04",
    postedBy: "system"
  },
  {
    id: "job-7",
    title: "Senior QA Automation Lead",
    company: "Vortex Technologies",
    logoText: "VT",
    location: "San Francisco, CA (Hybrid)",
    salary: "$125,000 - $150,000",
    type: "Full-time",
    tags: ["Selenium", "Playwright", "Python", "CI/CD"],
    description: "Lead testing infrastructure development and configure automated integration run logs across our core web analytics products.",
    datePosted: "2026-06-10",
    postedBy: "recruiter"
  },
  {
    id: "job-8",
    title: "Lead Salesforce Architect",
    company: "CloudCore",
    logoText: "CC",
    location: "Remote (US)",
    salary: "$170,000 - $200,000",
    type: "Contract",
    tags: ["Salesforce", "Apex", "LWC", "Integrations"],
    description: "Design custom customer lifecycle tracking integrations and orchestrate API mappings between internal pipelines and CRM clusters.",
    datePosted: "2026-06-11",
    postedBy: "system"
  }
];

// Initialize local database records
(function initDashboardDB() {
  if (!localStorage.getItem(JOBS_KEY)) {
    localStorage.setItem(JOBS_KEY, JSON.stringify(DEFAULT_JOBS));
  }
  if (!localStorage.getItem(APPLICATIONS_KEY)) {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify([
      {
        id: "app-mock-1",
        jobId: "job-4",
        username: "seeker",
        status: "interview",
        appliedDate: "2026-06-07"
      },
      {
        id: "app-mock-2",
        jobId: "job-5",
        username: "seeker",
        status: "screening",
        appliedDate: "2026-06-05"
      }
    ]));
  }
  if (!localStorage.getItem(SAVED_JOBS_KEY)) {
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(["job-2"]));
  }
})();

// Active charts references
let appStatusChart = null;
let profileViewsChart = null;

function init() {
  setupSidebarNavigation();
  setupMobileSidebar();
  renderDashboardStats();
  renderCharts();
  renderFindJobs();
  renderAppliedJobs();
  renderSavedJobs();
  setupResumeBuilder();
  setupProfileEditor();
  
  // Set initial hash panel
  handleHashChange();
  window.addEventListener('hashchange', handleHashChange);
  
  // Display current user name
  const session = getActiveSession();
  if (session) {
    const userNameElements = document.querySelectorAll('.session-user-name');
    userNameElements.forEach(el => el.textContent = session.fullName);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Panel Switching — direct click-driven with hash sync
function switchPanel(hash) {
  if (!hash || !hash.startsWith('#')) hash = '#dashboard';

  document.querySelectorAll('.db-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.db-menu-item').forEach(item => item.classList.remove('active'));

  const targetPanel = document.getElementById(hash.substring(1) + '-panel');
  if (targetPanel) {
    targetPanel.classList.add('active');
  } else {
    const defaultPanel = document.getElementById('dashboard-panel');
    if (defaultPanel) defaultPanel.classList.add('active');
    hash = '#dashboard';
  }

  document.querySelectorAll('.db-menu-item a').forEach(link => {
    if (link.getAttribute('href') === hash) {
      link.closest('.db-menu-item').classList.add('active');
    }
  });

  history.replaceState(null, '', hash);

  // Always scroll content to the top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const contentArea = document.querySelector('.db-content-area');
  if (contentArea) {
    contentArea.scrollTop = 0;
  }

  if (hash === '#dashboard') {
    renderDashboardStats();
    updateChartsData();
  } else if (hash === '#find-jobs') {
    renderFindJobs();
  } else if (hash === '#applied-jobs') {
    renderAppliedJobs();
  } else if (hash === '#saved-jobs') {
    renderSavedJobs();
  }
}

function handleHashChange() {
  switchPanel(window.location.hash || '#dashboard');
}

function setupSidebarNavigation() {
  document.addEventListener('click', (e) => {
    const menuItem = e.target.closest('.db-menu-item');
    if (menuItem) {
      const link = menuItem.querySelector('a');
      if (link) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#') && href !== '#') {
          e.preventDefault();
          const sidebar = document.querySelector('.db-sidebar');
          const overlay = document.querySelector('.db-sidebar-overlay');
          if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
          }
          switchPanel(href);
        }
      }
    }
  });
}

function setupMobileSidebar() {
  const menuBtn = document.querySelector('.db-menu-toggle');
  const sidebar = document.querySelector('.db-sidebar');
  const closeBtn = document.querySelector('#db-sidebar-close');
  const contentArea = document.querySelector('.db-content-area');
  const desktopToggleBtn = document.querySelector('#db-sidebar-desktop-toggle');
  
  // Find or create overlay
  let overlay = document.querySelector('.db-sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'db-sidebar-overlay';
    const dbWrapper = document.querySelector('.db-wrapper');
    if (dbWrapper) {
      dbWrapper.appendChild(overlay);
    }
  }
  
  if (menuBtn && sidebar && overlay) {
    menuBtn.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
      } else {
        sidebar.classList.toggle('collapsed');
        if (contentArea) contentArea.classList.toggle('expanded');
      }
    });
    
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('open');
          overlay.classList.remove('active');
        } else {
          sidebar.classList.add('collapsed');
          if (contentArea) contentArea.classList.add('expanded');
        }
      });
    }
    
    if (desktopToggleBtn) {
      desktopToggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        if (contentArea) contentArea.classList.toggle('expanded');
      });
    }
  }
}

// 1. Dashboard Panel Updates
function renderDashboardStats() {
  const session = getActiveSession();
  const applications = JSON.parse(localStorage.getItem(APPLICATIONS_KEY)) || [];
  const savedList = JSON.parse(localStorage.getItem(SAVED_JOBS_KEY)) || [];
  
  const userApps = applications.filter(a => a.username === session.username);
  const totalApps = userApps.length;
  const savedCount = savedList.length;
  
  const interviewCount = userApps.filter(a => a.status === 'interview').length;
  
  // Profile views simulated strength
  const strengthPercentage = document.getElementById('profile-strength-pct');
  const progressBar = document.getElementById('profile-strength-bar');
  
  // Update UI Elements
  document.getElementById('stat-total-apps').textContent = totalApps;
  document.getElementById('stat-saved').textContent = savedCount;
  document.getElementById('stat-interviews').textContent = interviewCount;
  
  // Render applications list summary
  const recentAppsList = document.getElementById('recent-apps-list');
  if (recentAppsList) {
    recentAppsList.innerHTML = '';
    const jobs = JSON.parse(localStorage.getItem(JOBS_KEY)) || [];
    
    // Sort apps by date desc
    const sortedApps = [...userApps].reverse().slice(0, 3);
    
    if (sortedApps.length === 0) {
      recentAppsList.innerHTML = `<p style="padding:1rem; text-align:center; color:var(--slate-400);">No applications found yet. Search and apply for jobs.</p>`;
    } else {
      sortedApps.forEach(app => {
        const job = jobs.find(j => j.id === app.jobId);
        if (job) {
          const item = document.createElement('div');
          item.className = 'db-list-item';
          item.innerHTML = `
            <div class="db-list-info">
              <h4>${job.title}</h4>
              <p>${job.company} &bull; Applied: ${app.appliedDate}</p>
            </div>
            <span class="db-badge ${app.status}">${app.status}</span>
          `;
          recentAppsList.appendChild(item);
        }
      });
    }
  }
}

// 2. Charts rendering
function renderCharts() {
  const ctxStatus = document.getElementById('appStatusChart');
  const ctxViews = document.getElementById('profileViewsChart');
  
  if (ctxStatus) {
    appStatusChart = new Chart(ctxStatus, {
      type: 'doughnut',
      data: {
        labels: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'],
        datasets: [{
          data: [0, 0, 0, 0, 0],
          backgroundColor: ['#0ea5e9', '#d97706', '#a855f7', '#22c55e', '#166534'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: 'Outfit' } } }
        }
      }
    });
  }
  
  if (ctxViews) {
    profileViewsChart = new Chart(ctxViews, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Views',
          data: [12, 19, 3, 25, 42, 54],
          borderColor: '#0ea5e9',
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { grid: { color: '#f1f5f9' }, ticks: { font: { family: 'Outfit' } } },
          x: { grid: { display: false }, ticks: { font: { family: 'Outfit' } } }
        }
      }
    });
  }
  
  updateChartsData();
}

function updateChartsData() {
  if (!appStatusChart) return;
  
  const session = getActiveSession();
  const applications = JSON.parse(localStorage.getItem(APPLICATIONS_KEY)) || [];
  const userApps = applications.filter(a => a.username === session.username);
  
  const counts = { applied: 0, screening: 0, interview: 0, offer: 0, hired: 0 };
  userApps.forEach(a => {
    if (counts[a.status] !== undefined) counts[a.status]++;
  });
  
  appStatusChart.data.datasets[0].data = [
    counts.applied,
    counts.screening,
    counts.interview,
    counts.offer,
    counts.hired
  ];
  appStatusChart.update();
}

// 3. Find Jobs
function renderFindJobs() {
  const jobsListEl = document.getElementById('db-jobs-list');
  if (!jobsListEl) return;
  
  const keywordInput = document.getElementById('search-job-keyword');
  const locationInput = document.getElementById('search-job-location');
  const typeFilter = document.getElementById('filter-job-type');
  
  const keyword = keywordInput ? keywordInput.value.toLowerCase() : '';
  const loc = locationInput ? locationInput.value.toLowerCase() : '';
  const type = typeFilter ? typeFilter.value : '';
  
  const jobs = JSON.parse(localStorage.getItem(JOBS_KEY)) || [];
  const session = getActiveSession();
  const applications = JSON.parse(localStorage.getItem(APPLICATIONS_KEY)) || [];
  const savedList = JSON.parse(localStorage.getItem(SAVED_JOBS_KEY)) || [];
  
  const userApps = applications.filter(a => a.username === session.username);
  
  // Filter
  const filteredJobs = jobs.filter(job => {
    const matchesKeyword = !keyword || job.title.toLowerCase().includes(keyword) || job.company.toLowerCase().includes(keyword) || job.description.toLowerCase().includes(keyword);
    const matchesLocation = !loc || job.location.toLowerCase().includes(loc);
    const matchesType = !type || job.type === type;
    return matchesKeyword && matchesLocation && matchesType;
  });
  
  jobsListEl.innerHTML = '';
  
  if (filteredJobs.length === 0) {
    jobsListEl.innerHTML = `<p style="grid-column: span 2; padding:3rem 0; text-align:center; color:var(--slate-400);">No jobs matching criteria were found.</p>`;
    return;
  }
  
  filteredJobs.forEach(job => {
    const isApplied = userApps.some(a => a.jobId === job.id);
    const isSaved = savedList.includes(job.id);
    
    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
      <div class="job-card-header">
        <div class="job-comp-logo">${job.logoText || job.company.substring(0,2).toUpperCase()}</div>
        <div class="job-title-wrapper">
          <h3>${job.title}</h3>
          <span class="job-comp-name">${job.company}</span>
        </div>
      </div>
      <p style="font-size:0.9rem; color:var(--slate-600); margin-bottom:1rem; line-height:1.5;">${job.description}</p>
      <div class="job-tag-list">
        <span class="job-tag type">${job.type}</span>
        ${job.tags.map(t => `<span class="job-tag">${t}</span>`).join('')}
      </div>
      <div class="job-card-footer">
        <div class="job-salary-loc">
          <span class="job-salary">${job.salary}</span>
          <span class="job-loc">${job.location}</span>
        </div>
        <div class="job-actions">
          <button class="job-btn-save ${isSaved ? 'saved' : ''}" onclick="toggleSaveJob('${job.id}')" aria-label="Bookmark job">
            <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
          </button>
          <button class="btn btn-primary job-btn-apply" ${isApplied ? 'disabled' : ''} onclick="applyForJob('${job.id}')">
            ${isApplied ? 'Applied' : 'Apply Now'}
          </button>
        </div>
      </div>
    `;
    jobsListEl.appendChild(card);
  });
}

// Bind search events
const btnSearch = document.getElementById('btn-db-job-search');
if (btnSearch) {
  btnSearch.addEventListener('click', renderFindJobs);
}

window.applyForJob = function(jobId) {
  const session = getActiveSession();
  const applications = JSON.parse(localStorage.getItem(APPLICATIONS_KEY)) || [];
  
  // Check duplicate
  const duplicate = applications.find(a => a.jobId === jobId && a.username === session.username);
  if (duplicate) return;
  
  const today = new Date().toISOString().split('T')[0];
  const newApp = {
    id: 'app-' + Date.now(),
    jobId: jobId,
    username: session.username,
    status: 'applied',
    appliedDate: today
  };
  
  applications.push(newApp);
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
  
  renderFindJobs();
  renderDashboardStats();
  updateChartsData();
};

window.toggleSaveJob = function(jobId) {
  let savedList = JSON.parse(localStorage.getItem(SAVED_JOBS_KEY)) || [];
  
  if (savedList.includes(jobId)) {
    savedList = savedList.filter(id => id !== jobId);
  } else {
    savedList.push(jobId);
  }
  
  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedList));
  renderFindJobs();
  renderSavedJobs();
  renderDashboardStats();
};

// 4. Applied Jobs Panel
function renderAppliedJobs() {
  const listEl = document.getElementById('applied-jobs-list');
  if (!listEl) return;
  
  const session = getActiveSession();
  const applications = JSON.parse(localStorage.getItem(APPLICATIONS_KEY)) || [];
  const jobs = JSON.parse(localStorage.getItem(JOBS_KEY)) || [];
  
  const userApps = applications.filter(a => a.username === session.username);
  
  listEl.innerHTML = '';
  
  if (userApps.length === 0) {
    listEl.innerHTML = `<p style="padding:3rem 0; text-align:center; color:var(--slate-400);">No applications found yet. Browse the find jobs portal.</p>`;
    return;
  }
  
  userApps.forEach(app => {
    const job = jobs.find(j => j.id === app.jobId);
    if (job) {
      const stepIndex = ['applied', 'screening', 'interview', 'offer', 'hired'].indexOf(app.status);
      
      const item = document.createElement('div');
      item.className = 'db-card';
      item.style.marginBottom = '1.5rem';
      
      item.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
          <div>
            <h3 style="font-size:1.2rem; margin-bottom:0.25rem;">${job.title}</h3>
            <p style="font-size:0.9rem; color:var(--slate-500);">${job.company} &bull; ${job.location}</p>
          </div>
          <span class="db-badge ${app.status}">${app.status}</span>
        </div>
        
        <!-- Pipeline progress tracker graphics -->
        <div style="display:flex; justify-content:space-between; position:relative; margin-top:2rem; padding: 0 1rem;">
          <div style="position:absolute; top:8px; left:5%; width:90%; height:4px; background-color:var(--slate-200); z-index:1;">
            <div style="width:${(stepIndex / 4) * 100}%; height:100%; background:var(--primary-gradient); transition:width 0.4s ease;"></div>
          </div>
          
          ${['Applied', 'Screening', 'Interview', 'Offer', 'Hired'].map((step, idx) => {
            const isCompleted = idx <= stepIndex;
            return `
              <div style="display:flex; flex-direction:column; align-items:center; position:relative; z-index:2;">
                <div style="width:20px; height:20px; border-radius:50%; background-color:${isCompleted ? 'var(--primary)' : 'var(--slate-200)'}; border:4px solid var(--white); box-shadow:var(--shadow-sm);"></div>
                <span style="font-size:0.75rem; font-weight:600; margin-top:0.5rem; color:${isCompleted ? 'var(--slate-800)' : 'var(--slate-400)'}">${step}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;
      listEl.appendChild(item);
    }
  });
}

// 5. Saved Jobs Panel
function renderSavedJobs() {
  const listEl = document.getElementById('saved-jobs-list');
  if (!listEl) return;
  
  const savedList = JSON.parse(localStorage.getItem(SAVED_JOBS_KEY)) || [];
  const jobs = JSON.parse(localStorage.getItem(JOBS_KEY)) || [];
  
  listEl.innerHTML = '';
  
  if (savedList.length === 0) {
    listEl.innerHTML = `<p style="padding:3rem 0; text-align:center; color:var(--slate-400);">No bookmarked jobs found.</p>`;
    return;
  }
  
  savedList.forEach(id => {
    const job = jobs.find(j => j.id === id);
    if (job) {
      const card = document.createElement('div');
      card.className = 'job-card';
      card.innerHTML = `
        <div class="job-card-header">
          <div class="job-comp-logo">${job.logoText || job.company.substring(0,2).toUpperCase()}</div>
          <div class="job-title-wrapper">
            <h3>${job.title}</h3>
            <span class="job-comp-name">${job.company}</span>
          </div>
        </div>
        <p style="font-size:0.9rem; color:var(--slate-600); margin-bottom:1rem;">${job.description}</p>
        <div class="job-card-footer">
          <span style="font-size:0.9rem; font-weight:bold; color:var(--slate-900);">${job.salary}</span>
          <div class="job-actions">
            <button class="job-btn-save saved" onclick="toggleSaveJob('${job.id}')" aria-label="Remove bookmark">
              <i class="fas fa-bookmark"></i>
            </button>
            <button class="btn btn-primary job-btn-apply" onclick="applyForJob('${job.id}')">Apply Now</button>
          </div>
        </div>
      `;
      listEl.appendChild(card);
    }
  });
}

// 6. Resume Builder Panel
function setupResumeBuilder() {
  const form = document.getElementById('resume-builder-form');
  const preview = document.getElementById('resume-preview-box');
  
  if (form && preview) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const fullname = document.getElementById('resume-fullname').value;
      const jobtitle = document.getElementById('resume-title').value;
      const summary = document.getElementById('resume-summary').value;
      const experience = document.getElementById('resume-experience').value;
      const education = document.getElementById('resume-education').value;
      const skills = document.getElementById('resume-skills').value;
      
      preview.innerHTML = `
        <div style="border: 2px solid var(--slate-200); padding: 2.5rem; border-radius: var(--radius-md); background: #fff; box-shadow: var(--shadow-md); max-width: 800px; margin: 0 auto; color:#0f172a;">
          <div style="border-bottom: 2px solid var(--primary); padding-bottom: 1rem; margin-bottom: 1.5rem; text-align: center;">
            <h2 style="font-size: 2rem; font-weight: 800; color: var(--slate-900); margin-bottom: 0.25rem;">${fullname}</h2>
            <p style="font-size: 1.1rem; color: var(--primary); font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">${jobtitle}</p>
          </div>
          
          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 1.1rem; color: var(--slate-900); border-bottom: 1px solid var(--slate-200); padding-bottom: 0.25rem; margin-bottom: 0.5rem;">Professional Summary</h4>
            <p style="font-size: 0.95rem; line-height: 1.6; color: var(--slate-600);">${summary}</p>
          </div>
          
          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 1.1rem; color: var(--slate-900); border-bottom: 1px solid var(--slate-200); padding-bottom: 0.25rem; margin-bottom: 0.5rem;">Work History</h4>
            <p style="font-size: 0.95rem; line-height: 1.6; color: var(--slate-600); white-space: pre-line;">${experience}</p>
          </div>
          
          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 1.1rem; color: var(--slate-900); border-bottom: 1px solid var(--slate-200); padding-bottom: 0.25rem; margin-bottom: 0.5rem;">Education &amp; Credentials</h4>
            <p style="font-size: 0.95rem; line-height: 1.6; color: var(--slate-600); white-space: pre-line;">${education}</p>
          </div>
          
          <div>
            <h4 style="font-size: 1.1rem; color: var(--slate-900); border-bottom: 1px solid var(--slate-200); padding-bottom: 0.25rem; margin-bottom: 0.5rem;">Core Competencies</h4>
            <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:0.5rem;">
              ${skills.split(',').map(s => `<span style="background-color: var(--slate-100); color: var(--slate-700); padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-weight: 500;">${s.trim()}</span>`).join('')}
            </div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 1.5rem;">
          <button class="btn btn-primary" onclick="window.print()"><i class="fas fa-download"></i> Export Portfolio</button>
        </div>
      `;
    });
  }
}

// 7. Profile Editor Setup
function setupProfileEditor() {
  const form = document.getElementById('profile-edit-form');
  if (form) {
    const session = getActiveSession();
    
    // Autofill fields
    document.getElementById('profile-name').value = session.fullName;
    document.getElementById('profile-email').value = session.email;
    document.getElementById('profile-username').value = session.username;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const newName = document.getElementById('profile-name').value.trim();
      const newEmail = document.getElementById('profile-email').value.trim();
      
      if (!newName || !newEmail) {
        alert("Name and email are required fields.");
        return;
      }
      
      // Update session storage
      session.fullName = newName;
      session.email = newEmail;
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      
      // Update user in users array database
      const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
      const userIdx = users.findIndex(u => u.username === session.username);
      if (userIdx !== -1) {
        users[userIdx].fullName = newName;
        users[userIdx].email = newEmail;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
      
      // Update UI names
      const userNameElements = document.querySelectorAll('.session-user-name');
      userNameElements.forEach(el => el.textContent = newName);
      
      alert("Profile updated successfully!");
    });
  }
}
