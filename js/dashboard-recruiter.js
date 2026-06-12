/* Recruiter Dashboard Logic - Stackly Job Portal */

// Protect page
enforceRouteGuard('recruiter');

// Keys
const JOBS_KEY = 'stackly_jobs';
const APPLICATIONS_KEY = 'stackly_applications';
const USERS_KEY = 'stackly_users';

// Active charts references
let applicantRateChart = null;
let pipelineStageChart = null;
let recruiterFunnelChartInstance = null;

function init() {
  setupSidebarNavigation();
  setupMobileSidebar();
  renderDashboardStats();
  renderCharts();
  setupJobPoster();
  renderManageJobs();
  renderPipelineBoard();
  setupCompanyProfile();
  
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

  // Normalize older or alternate hashes
  if (hash === '#post-job') hash = '#post-jobs';
  if (hash === '#applications') hash = '#applicants';

  // Hide all panels
  document.querySelectorAll('.db-panel').forEach(p => p.classList.remove('active'));

  // Remove active state from all menu items
  document.querySelectorAll('.db-menu-item').forEach(item => item.classList.remove('active'));

  // Show the target panel
  const targetPanel = document.getElementById(hash.substring(1) + '-panel');
  if (targetPanel) {
    targetPanel.classList.add('active');
  } else {
    const defaultPanel = document.getElementById('dashboard-panel');
    if (defaultPanel) defaultPanel.classList.add('active');
    hash = '#dashboard';
  }

  // Highlight active menu link
  document.querySelectorAll('.db-menu-item a').forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === hash || 
        (hash === '#post-jobs' && linkHref === '#post-job') ||
        (hash === '#applicants' && linkHref === '#applications')) {
      link.closest('.db-menu-item').classList.add('active');
    }
  });

  // Update URL hash silently
  history.replaceState(null, '', hash);

  // Always scroll content to the top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const contentArea = document.querySelector('.db-content-area');
  if (contentArea) {
    contentArea.scrollTop = 0;
  }

  // Trigger data refreshes
  if (hash === '#dashboard') {
    renderDashboardStats();
    updateChartsData();
  } else if (hash === '#manage-jobs') {
    renderManageJobs();
  } else if (hash === '#applicants' || hash === '#applications') {
    renderPipelineBoard();
  } else if (hash === '#reports') {
    renderReportsPanel();
  } else if (hash === '#subscription-billing') {
    renderSubscriptionBillingPanel();
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
  
  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
  }
  
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  }
  
  if (menuBtn && sidebar && overlay) {
    menuBtn.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
    
    overlay.addEventListener('click', closeSidebar);
    
    if (closeBtn) {
      closeBtn.addEventListener('click', closeSidebar);
    }
    
    if (desktopToggleBtn) {
      desktopToggleBtn.addEventListener('click', () => {
        if (sidebar.classList.contains('open')) {
          closeSidebar();
        } else {
          openSidebar();
        }
      });
    }
  }
}

// 1. Dashboard Stats
function renderDashboardStats() {
  const session = getActiveSession();
  const jobs = JSON.parse(localStorage.getItem(JOBS_KEY)) || [];
  const applications = JSON.parse(localStorage.getItem(APPLICATIONS_KEY)) || [];
  
  // Filter jobs posted by this recruiter
  const recruiterJobs = jobs.filter(j => j.postedBy === session.username);
  const activeJobsCount = recruiterJobs.length;
  
  // Filter applications for recruiter's jobs
  const jobIds = recruiterJobs.map(j => j.id);
  const recruiterApps = applications.filter(a => jobIds.includes(a.jobId));
  const totalAppsCount = recruiterApps.length;
  
  const shortlistedCount = recruiterApps.filter(a => ['screening', 'interview', 'offer'].includes(a.status)).length;
  const hiredCount = recruiterApps.filter(a => a.status === 'hired').length;
  
  // Update UI stats
  const activeJobsEl = document.getElementById('stat-active-jobs');
  if (activeJobsEl) activeJobsEl.textContent = activeJobsCount;
  const recruiterAppsEl = document.getElementById('stat-recruiter-apps');
  if (recruiterAppsEl) recruiterAppsEl.textContent = totalAppsCount;
  const shortlistedEl = document.getElementById('stat-shortlisted');
  if (shortlistedEl) shortlistedEl.textContent = shortlistedCount;
  const hiredEl = document.getElementById('stat-hired');
  if (hiredEl) hiredEl.textContent = hiredCount;
  
  // Recent candidate list summary
  const recentCandidatesList = document.getElementById('recent-candidates-list');
  if (recentCandidatesList) {
    recentCandidatesList.innerHTML = '';
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    
    // Sort applications by date desc
    const sortedApps = [...recruiterApps].reverse().slice(0, 3);
    
    if (sortedApps.length === 0) {
      recentCandidatesList.innerHTML = `<p style="padding:1rem; text-align:center; color:var(--slate-400);">No applications received yet.</p>`;
    } else {
      sortedApps.forEach(app => {
        const job = jobs.find(j => j.id === app.jobId);
        const candidateUser = users.find(u => u.username === app.username);
        const candidateName = candidateUser ? candidateUser.fullName : app.username;
        
        const item = document.createElement('div');
        item.className = 'db-list-item';
        item.innerHTML = `
          <div class="db-list-info">
            <h4>${candidateName}</h4>
            <p>Applied for: ${job ? job.title : 'Deleted Job'} &bull; Date: ${app.appliedDate}</p>
          </div>
          <span class="db-badge ${app.status}">${app.status}</span>
        `;
        recentCandidatesList.appendChild(item);
      });
    }
  }
}

// 2. Recruiter Charts
function renderCharts() {
  const ctxRate = document.getElementById('applicantRateChart');
  const ctxStage = document.getElementById('pipelineStageChart');
  
  if (ctxRate) {
    applicantRateChart = new Chart(ctxRate, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Applications',
          data: [15, 26, 12, 38, 54, 75],
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
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
          y: { 
            beginAtZero: true,
            grid: { color: '#f1f5f9' }, 
            ticks: { font: { family: 'Outfit' } } 
          },
          x: { grid: { display: false }, ticks: { font: { family: 'Outfit' } } }
        }
      }
    });
  }
  
  if (ctxStage) {
    pipelineStageChart = new Chart(ctxStage, {
      type: 'bar',
      data: {
        labels: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'],
        datasets: [{
          data: [0, 0, 0, 0, 0],
          backgroundColor: ['#0ea5e9', '#d97706', '#a855f7', '#22c55e', '#166534'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { 
            beginAtZero: true,
            grid: { color: '#f1f5f9' }, 
            ticks: { font: { family: 'Outfit' } } 
          },
          x: { grid: { display: false }, ticks: { font: { family: 'Outfit' } } }
        }
      }
    });
  }
  
  updateChartsData();
}

function updateChartsData() {
  if (!pipelineStageChart) return;
  
  const session = getActiveSession();
  const jobs = JSON.parse(localStorage.getItem(JOBS_KEY)) || [];
  const applications = JSON.parse(localStorage.getItem(APPLICATIONS_KEY)) || [];
  
  // Filter recruiter's active jobs
  const recruiterJobIds = jobs.filter(j => j.postedBy === session.username).map(j => j.id);
  const recruiterApps = applications.filter(a => recruiterJobIds.includes(a.jobId));
  
  const counts = { applied: 0, screening: 0, interview: 0, offer: 0, hired: 0 };
  recruiterApps.forEach(a => {
    if (counts[a.status] !== undefined) counts[a.status]++;
  });
  
  pipelineStageChart.data.datasets[0].data = [
    counts.applied,
    counts.screening,
    counts.interview,
    counts.offer,
    counts.hired
  ];
  pipelineStageChart.update();
}

// 3. Post Job Form
function setupJobPoster() {
  const form = document.getElementById('post-job-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const session = getActiveSession();
      const title = document.getElementById('post-job-title').value.trim();
      const company = document.getElementById('post-job-company').value.trim();
      const location = document.getElementById('post-job-location').value.trim();
      const salary = document.getElementById('post-job-salary').value.trim();
      const type = document.getElementById('post-job-type').value;
      const tagsString = document.getElementById('post-job-tags').value.trim();
      const description = document.getElementById('post-job-desc').value.trim();
      
      if (!title || !company || !location || !salary || !description) {
        return;
      }
      
      const tags = tagsString ? tagsString.split(',').map(t => t.trim()) : ["Software"];
      const jobs = JSON.parse(localStorage.getItem(JOBS_KEY)) || [];
      
      const newJob = {
        id: 'job-' + Date.now(),
        title,
        company,
        logoText: company.substring(0,2).toUpperCase(),
        location,
        salary,
        type,
        tags,
        description,
        datePosted: new Date().toISOString().split('T')[0],
        postedBy: session.username
      };
      
      jobs.push(newJob);
      localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
      
      form.reset();
      
      // Navigate to manage jobs
      window.location.hash = '#manage-jobs';
    });
  }
}

// 4. Manage Jobs List
function renderManageJobs() {
  const listEl = document.getElementById('recruiter-jobs-list');
  if (!listEl) return;
  
  const session = getActiveSession();
  const jobs = JSON.parse(localStorage.getItem(JOBS_KEY)) || [];
  const applications = JSON.parse(localStorage.getItem(APPLICATIONS_KEY)) || [];
  
  const recruiterJobs = jobs.filter(j => j.postedBy === session.username);
  
  listEl.innerHTML = '';
  
  if (recruiterJobs.length === 0) {
    listEl.innerHTML = `<p style="padding:2rem 0; text-align:center; color:var(--slate-400);">You have not posted any jobs yet. Head over to the Post Job section.</p>`;
    return;
  }
  
  recruiterJobs.forEach(job => {
    const appCount = applications.filter(a => a.jobId === job.id).length;
    
    const row = document.createElement('div');
    row.className = 'db-list-item';
    row.innerHTML = `
      <div class="db-list-info">
        <h4>${job.title}</h4>
        <p>${job.location} &bull; ${job.type} &bull; Posted: ${job.datePosted}</p>
      </div>
      <div style="display:flex; align-items:center; gap:1.5rem;">
        <span style="font-size:0.85rem; font-weight:600; color:var(--slate-600);">${appCount} Applicants</span>
        <button class="pipeline-btn" onclick="deleteJobListing('${job.id}')" style="color:#ef4444; border-color:#fee2e2; background-color:#fef2f2;">Delete</button>
      </div>
    `;
    listEl.appendChild(row);
  });
}

window.deleteJobListing = function(jobId) {
  if (confirm("Are you sure you want to delete this job post? This will also remove associated applications.")) {
    let jobs = JSON.parse(localStorage.getItem(JOBS_KEY)) || [];
    let apps = JSON.parse(localStorage.getItem(APPLICATIONS_KEY)) || [];
    
    jobs = jobs.filter(j => j.id !== jobId);
    apps = apps.filter(a => a.jobId !== jobId);
    
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
    
    renderManageJobs();
    renderDashboardStats();
    updateChartsData();
  }
};

// 5. Candidate Pipeline Kanban Board
function renderPipelineBoard() {
  const lanes = {
    applied: document.getElementById('lane-applied'),
    screening: document.getElementById('lane-screening'),
    interview: document.getElementById('lane-interview'),
    offer: document.getElementById('lane-offer'),
    hired: document.getElementById('lane-hired')
  };
  
  if (!lanes.applied) return;
  
  const session = getActiveSession();
  const jobs = JSON.parse(localStorage.getItem(JOBS_KEY)) || [];
  const applications = JSON.parse(localStorage.getItem(APPLICATIONS_KEY)) || [];
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  
  // Recruiter job keys
  const recruiterJobIds = jobs.filter(j => j.postedBy === session.username).map(j => j.id);
  const recruiterApps = applications.filter(a => recruiterJobIds.includes(a.jobId));
  
  // Clear lanes
  Object.keys(lanes).forEach(k => {
    lanes[k].innerHTML = '';
  });
  
  // Count cards for header badge
  const counts = { applied: 0, screening: 0, interview: 0, offer: 0, hired: 0 };
  
  recruiterApps.forEach(app => {
    const job = jobs.find(j => j.id === app.jobId);
    const candidateUser = users.find(u => u.username === app.username);
    const candidateName = candidateUser ? candidateUser.fullName : app.username;
    
    if (lanes[app.status]) {
      counts[app.status]++;
      
      const card = document.createElement('div');
      card.className = 'pipeline-card';
      
      // Determine actions based on stage
      let actionsHTML = '';
      if (app.status === 'applied') {
        actionsHTML = `<button class="pipeline-btn" onclick="shiftPipelineStage('${app.id}', 'screening')">Screen</button>`;
      } else if (app.status === 'screening') {
        actionsHTML = `<button class="pipeline-btn" onclick="shiftPipelineStage('${app.id}', 'interview')">Invite Interview</button>`;
      } else if (app.status === 'interview') {
        actionsHTML = `<button class="pipeline-btn" onclick="shiftPipelineStage('${app.id}', 'offer')">Extend Offer</button>`;
      } else if (app.status === 'offer') {
        actionsHTML = `<button class="pipeline-btn" onclick="shiftPipelineStage('${app.id}', 'hired')">Mark Hired</button>`;
      }
      
      // Reject action
      if (app.status !== 'hired' && app.status !== 'rejected') {
        actionsHTML += `<button class="pipeline-btn" onclick="shiftPipelineStage('${app.id}', 'rejected')" style="color:#ef4444; border-color:#fee2e2;">Reject</button>`;
      }
      
      card.innerHTML = `
        <h4>${candidateName}</h4>
        <p>${job ? job.title : 'Deleted Job'}</p>
        <div style="font-size:0.75rem; color:var(--slate-400); margin-top:0.25rem;">Date: ${app.appliedDate}</div>
        ${actionsHTML ? `<div class="pipeline-actions">${actionsHTML}</div>` : ''}
      `;
      lanes[app.status].appendChild(card);
    }
  });
  
  // Update lane column counters
  Object.keys(counts).forEach(k => {
    const counterBadge = document.getElementById(`count-${k}`);
    if (counterBadge) counterBadge.textContent = counts[k];
  });
}

window.shiftPipelineStage = function(appId, nextStage) {
  const apps = JSON.parse(localStorage.getItem(APPLICATIONS_KEY)) || [];
  const appIdx = apps.findIndex(a => a.id === appId);
  
  if (appIdx !== -1) {
    apps[appIdx].status = nextStage;
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
    
    renderPipelineBoard();
    renderDashboardStats();
    updateChartsData();
  }
};

// 6. Recruiter Corporate Profile settings
function setupCompanyProfile() {
  const form = document.getElementById('company-profile-form');
  if (form) {
    const session = getActiveSession();
    const companyKey = `stackly_company_${session.username}`;
    
    // Default mock data for company
    let companyData = JSON.parse(localStorage.getItem(companyKey)) || {
      name: "Nebula Systems Ltd",
      size: "50-100 employees",
      location: "San Francisco, CA",
      website: "https://nebulasystems.io",
      desc: "Nebula Systems delivers secure container orchestrations and serverless development environments to companies globally."
    };
    
    // Autofill
    document.getElementById('comp-name').value = companyData.name;
    document.getElementById('comp-size').value = companyData.size;
    document.getElementById('comp-location').value = companyData.location;
    document.getElementById('comp-website').value = companyData.website;
    document.getElementById('comp-desc').value = companyData.desc;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      companyData.name = document.getElementById('comp-name').value.trim();
      companyData.size = document.getElementById('comp-size').value.trim();
      companyData.location = document.getElementById('comp-location').value.trim();
      companyData.website = document.getElementById('comp-website').value.trim();
      companyData.desc = document.getElementById('comp-desc').value.trim();
      
      localStorage.setItem(companyKey, JSON.stringify(companyData));
    });
  }
}

// 7. Render Reports Panel Metrics & Funnel Chart
function renderReportsPanel() {
  const ctxFunnel = document.getElementById('recruiterFunnelChart');
  if (!ctxFunnel) return;

  if (recruiterFunnelChartInstance) {
    recruiterFunnelChartInstance.destroy();
  }

  recruiterFunnelChartInstance = new Chart(ctxFunnel, {
    type: 'bar',
    data: {
      labels: ['Views', 'Applications', 'Screened', 'Interviewed', 'Offered', 'Hired'],
      datasets: [{
        label: 'Candidates count',
        data: [1420, 248, 85, 32, 12, 8],
        backgroundColor: [
          '#475569', // Views
          '#f59e0b', // Applications
          '#d97706', // Screened
          '#a855f7', // Interviewed
          '#0ea5e9', // Offered
          '#22c55e'  // Hired
        ],
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { 
          beginAtZero: true,
          grid: { color: '#21262d' }, 
          ticks: { color: '#8b949e', font: { family: 'Outfit' } } 
        },
        x: { 
          grid: { display: false }, 
          ticks: { color: '#8b949e', font: { family: 'Outfit' } } 
        }
      }
    }
  });
}

// 8. Render Subscription & Billing Panel Usage Status
function renderSubscriptionBillingPanel() {
  const session = getActiveSession();
  const jobs = JSON.parse(localStorage.getItem(JOBS_KEY)) || [];
  const recruiterJobs = jobs.filter(j => j.postedBy === session.username);
  
  const creditsUsed = recruiterJobs.length;
  const creditsElement = document.getElementById('billing-credits-used');
  const creditsBar = document.getElementById('billing-credits-bar');
  
  if (creditsElement) {
    creditsElement.textContent = creditsUsed;
  }
  if (creditsBar) {
    const percent = Math.min((creditsUsed / 5) * 100, 100);
    creditsBar.style.width = `${percent}%`;
  }
}
