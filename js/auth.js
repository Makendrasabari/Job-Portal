/* Authentication and Router Protection - Stackly Job Portal */

// Standard session keys in LocalStorage
const USERS_KEY = 'stackly_users';
const SESSION_KEY = 'stackly_session';
const JOBS_KEY = 'stackly_jobs';

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
  }
];

// Initialize default mock users and jobs if not present
(function initMockDatabase() {
  let users = JSON.parse(localStorage.getItem(USERS_KEY));
  if (!users) {
    users = [
      {
        fullName: "Sarah Connor",
        email: "sarah@jobseeker.com",
        username: "seeker",
        password: "password123",
        role: "job_seeker"
      },
      {
        fullName: "Marcus Aurelius",
        email: "marcus@recruiter.com",
        username: "recruiter",
        password: "password123",
        role: "recruiter"
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  
  let jobs = JSON.parse(localStorage.getItem(JOBS_KEY));
  if (!jobs) {
    localStorage.setItem(JOBS_KEY, JSON.stringify(DEFAULT_JOBS));
  }
})();

// Register a new user
function registerUser(fullName, email, username, password, role) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  
  // Clean inputs
  fullName = fullName.trim();
  email = email.trim().toLowerCase();
  username = username.trim().toLowerCase();
  
  // Validations - only require fields to be non-empty (any password accepted)
  if (!fullName || !email || !username || !password || !role) {
    return { success: false, message: "All input fields are required." };
  }
  
  // Save user
  const newUser = { fullName, email, username, password, role };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  return { success: true };
}

// Log in user — no password validation, only checks fields are non-empty
function loginUser(usernameOrEmail, password, role) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  const identifier = usernameOrEmail.trim().toLowerCase();

  // Only validation: fields must not be empty
  if (!identifier) {
    return { success: false, message: "Please enter your email or username." };
  }
  if (!password) {
    return { success: false, message: "Please enter your password." };
  }

  // Try to find an existing user by identifier (no password check)
  const matchedUser = users.find(u =>
    u.username === identifier || u.email === identifier
  );

  // Build session — use matched user data if found, otherwise use typed values
  const session = {
    fullName: matchedUser ? matchedUser.fullName : identifier,
    email: matchedUser ? matchedUser.email : identifier,
    username: matchedUser ? matchedUser.username : identifier,
    role: role || (matchedUser ? matchedUser.role : 'job_seeker')
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return { success: true, role: session.role };
}

// Log out user
function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = 'login.html';
}

// Get current session
function getActiveSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY));
}

// Client Side Security Guards
function enforceRouteGuard(requiredRole) {
  const session = getActiveSession();
  
  if (!session) {
    // Not logged in -> Go to login page
    window.location.href = 'login.html';
    return;
  }
  
  if (session.role !== requiredRole) {
    // Logged in but has wrong role -> Redirect to 404 (representing unauthorized resource)
    window.location.href = '404.html';
    return;
  }
}

// Update primary website navbars based on auth state
document.addEventListener('DOMContentLoaded', () => {
  const session = getActiveSession();
  const navActions = document.querySelector('.nav-actions');
  const mobileNavActions = document.querySelector('.mobile-nav-actions');
  
  const getAuthNavHTML = (isMobile) => {
    if (session) {
      const dbUrl = session.role === 'job_seeker' ? 'job-seeker-dashboard.html' : 'recruiter-dashboard.html';
      const ctaClass = isMobile ? 'btn btn-primary' : 'btn btn-primary';
      const logoutClass = isMobile ? 'btn btn-outline' : 'btn btn-outline';
      
      return `
        <a href="${dbUrl}" class="${ctaClass}"><i class="fas fa-chart-line"></i> Dashboard</a>
        <button onclick="logoutUser()" class="${logoutClass}"><i class="fas fa-sign-out-alt"></i> Sign Out</button>
      `;
    } else {
      const loginClass = isMobile ? 'btn btn-outline' : 'btn btn-outline';
      const signupClass = isMobile ? 'btn btn-primary' : 'btn btn-primary';
      
      return `
        <a href="login.html" class="${loginClass}">Sign In</a>
        <a href="signup.html" class="${signupClass}">Register</a>
      `;
    }
  };
  
  if (navActions) {
    navActions.innerHTML = getAuthNavHTML(false);
  }
  if (mobileNavActions) {
    mobileNavActions.innerHTML = getAuthNavHTML(true);
  }
});
