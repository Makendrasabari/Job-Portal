const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Ensure directories exist
const dirs = ['assets', 'css', 'js', 'images', 'fonts'];
dirs.forEach(dir => {
  const p = path.join(__dirname, '..', dir);
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
});

// Logo Icon SVGs
const logoIconSVG = `
<g>
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0ea5e9" />
      <stop offset="100%" stop-color="#38bdf8" />
    </linearGradient>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#0ea5e9" />
    </linearGradient>
  </defs>
  <!-- Top-left swoosh -->
  <path d="M 45,15 C 30,15 15,28 15,48 C 15,62 25,70 34,70 C 42,70 47,62 44,52 C 41,42 30,38 30,30 C 30,22 38,20 45,22 C 48,23 50,15 48,15 Z" fill="url(#skyGrad)" />
  <!-- Bottom-right swoosh -->
  <path d="M 55,85 C 70,85 85,72 85,52 C 85,38 75,30 66,30 C 58,30 53,38 56,48 C 59,58 70,62 70,70 C 70,78 62,80 55,78 C 52,77 50,85 52,85 Z" fill="url(#blueGrad)" />
</g>
`;

const logoIconWhiteSVG = `
<g>
  <defs>
    <linearGradient id="whiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#e0f2fe" />
    </linearGradient>
  </defs>
  <!-- Top-left swoosh -->
  <path d="M 45,15 C 30,15 15,28 15,48 C 15,62 25,70 34,70 C 42,70 47,62 44,52 C 41,42 30,38 30,30 C 30,22 38,20 45,22 C 48,23 50,15 48,15 Z" fill="url(#whiteGrad)" />
  <!-- Bottom-right swoosh -->
  <path d="M 55,85 C 70,85 85,72 85,52 C 85,38 75,30 66,30 C 58,30 53,38 56,48 C 59,58 70,62 70,70 C 70,78 62,80 55,78 C 52,77 50,85 52,85 Z" fill="url(#whiteGrad)" opacity="0.8" />
</g>
`;

// Primary Logo (Dark text for light navbar)
const primaryLogoSVG = `
<svg width="300" height="80" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(5, -10)">
    ${logoIconSVG}
  </g>
  <text x="105" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="34" font-weight="800" fill="#0f172a" letter-spacing="1">STACKLY</text>
</svg>
`;

// White Logo (White text for footer / dark background)
const whiteLogoSVG = `
<svg width="300" height="80" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(5, -10)">
    ${logoIconWhiteSVG}
  </g>
  <text x="105" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="34" font-weight="800" fill="#ffffff" letter-spacing="1">STACKLY</text>
</svg>
`;

// Favicon Logo (Only the Icon)
const faviconSVG = `
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  ${logoIconSVG}
</svg>
`;

// Hero Illustration
const heroIllustrationSVG = `
<svg width="600" height="500" viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#2563eb" stop-opacity="0.2" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f8fafc" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0ea5e9" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>
    <linearGradient id="tagGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7c3aed" />
      <stop offset="100%" stop-color="#4c1d95" />
    </linearGradient>
    <linearGradient id="tagGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
  </defs>
  
  <circle cx="300" cy="250" r="220" fill="url(#heroGrad)" filter="blur(20px)" />
  <circle cx="300" cy="250" r="160" fill="none" stroke="#e2e8f0" stroke-width="2" stroke-dasharray="10 5" opacity="0.6" />
  
  <rect x="100" y="80" width="400" height="340" rx="16" fill="url(#cardGrad)" stroke="#e2e8f0" stroke-width="2" filter="drop-shadow(0 20px 25px rgba(15, 23, 42, 0.08))" />
  
  <rect x="100" y="80" width="400" height="40" rx="16" fill="#f1f5f9" />
  <circle cx="125" cy="100" r="5" fill="#ef4444" />
  <circle cx="140" cy="100" r="5" fill="#eab308" />
  <circle cx="155" cy="100" r="5" fill="#22c55e" />
  <rect x="180" y="90" width="240" height="20" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" />
  <text x="300" y="104" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">stackly.io/talent/matching</text>
  
  <g transform="translate(130, 150)">
    <rect width="340" height="90" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
    <circle cx="45" cy="45" r="25" fill="#e0f2fe" />
    <text x="45" y="52" font-family="sans-serif" font-size="20" fill="#0ea5e9" text-anchor="middle" font-weight="bold">SC</text>
    <rect x="90" y="22" width="120" height="10" rx="3" fill="#0f172a" />
    <rect x="90" y="40" width="80" height="7" rx="3" fill="#64748b" />
    <rect x="90" y="55" width="100" height="7" rx="3" fill="#94a3b8" />
    <rect x="250" y="20" width="70" height="24" rx="12" fill="#dcfce7" />
    <text x="285" y="36" font-family="sans-serif" font-size="11" font-weight="bold" fill="#15803d" text-anchor="middle">98% Match</text>
    <circle cx="238" cy="32" r="4" fill="#22c55e" />
  </g>

  <g transform="translate(130, 260)">
    <rect width="340" height="90" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
    <circle cx="45" cy="45" r="25" fill="#f5f3ff" />
    <text x="45" y="52" font-family="sans-serif" font-size="20" fill="#7c3aed" text-anchor="middle" font-weight="bold">EM</text>
    <rect x="90" y="22" width="130" height="10" rx="3" fill="#0f172a" />
    <rect x="90" y="40" width="90" height="7" rx="3" fill="#64748b" />
    <rect x="90" y="55" width="70" height="7" rx="3" fill="#94a3b8" />
    <rect x="250" y="20" width="70" height="24" rx="12" fill="#dcfce7" />
    <text x="285" y="36" font-family="sans-serif" font-size="11" font-weight="bold" fill="#15803d" text-anchor="middle">95% Match</text>
    <circle cx="238" cy="32" r="4" fill="#22c55e" />
  </g>

  <g transform="translate(80, 220)" opacity="0.95">
    <rect width="70" height="26" rx="13" fill="url(#tagGrad1)" />
    <text x="35" y="17" font-family="sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">React JS</text>
  </g>
  <g transform="translate(440, 200)" opacity="0.95">
    <rect width="75" height="26" rx="13" fill="url(#tagGrad2)" />
    <text x="37" y="17" font-family="sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">Node.js</text>
  </g>
  
  <g transform="translate(230, 370)">
    <rect width="140" height="30" rx="15" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
    <circle cx="25" cy="15" r="5" fill="none" stroke="#2563eb" stroke-width="2" />
    <line x1="28" y1="18" x2="34" y2="24" stroke="#2563eb" stroke-width="2" stroke-linecap="round" />
    <text x="88" y="19" font-family="sans-serif" font-size="11" font-weight="bold" fill="#64748b" text-anchor="middle">Matching...</text>
  </g>
</svg>
`;

// About/Features Illustration
const featuresIllustrationSVG = `
<svg width="500" height="500" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="featGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#2563eb" stop-opacity="0.15" />
    </linearGradient>
  </defs>
  <circle cx="250" cy="250" r="200" fill="url(#featGrad)" filter="blur(15px)" />
  <g transform="translate(70, 70)">
    <rect x="0" y="0" width="360" height="80" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
    <circle cx="40" cy="40" r="20" fill="#0ea5e9" opacity="0.1" />
    <text x="35" y="45" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0ea5e9">1</text>
    <text x="80" y="35" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">Create Profile</text>
  </g>
  <line x1="250" y1="150" x2="250" y2="190" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4 4" />
  <g transform="translate(70, 190)">
    <rect x="0" y="0" width="360" height="80" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
    <circle cx="40" cy="40" r="20" fill="#2563eb" opacity="0.1" />
    <text x="35" y="45" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">2</text>
    <text x="80" y="35" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">Match Algorithms</text>
  </g>
  <line x1="250" y1="270" x2="250" y2="310" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4 4" />
  <g transform="translate(70, 310)">
    <rect x="0" y="0" width="360" height="80" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
    <circle cx="40" cy="40" r="20" fill="#10b981" opacity="0.1" />
    <text x="35" y="45" font-family="sans-serif" font-size="16" font-weight="bold" fill="#10b981">3</text>
    <text x="80" y="35" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">Get Placed &amp; Hired</text>
  </g>
</svg>
`;

// 404 Illustration
const errorIllustrationSVG = `
<svg width="500" height="400" viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="errorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0.1" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="500" height="400" rx="20" fill="url(#errorGrad)" />
  <text x="250" y="180" font-family="sans-serif" font-size="120" font-weight="900" fill="#0f172a" text-anchor="middle" letter-spacing="-5" opacity="0.8">404</text>
  <text x="250" y="240" font-family="sans-serif" font-size="22" font-weight="bold" fill="#334155" text-anchor="middle">CONNECTION LOST IN SPACE</text>
</svg>
`;

// --- NEW ENRICHED PREMIUM IMAGES FOR ALL EMPTY SLOTS ---

// 1. Team Avatar SVGs
const createTeamAvatar = (initials, bgGradient) => `
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="avatarGrad-${initials}" x1="0%" y1="0%" x2="100%" y2="100%">
      ${bgGradient}
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="90" fill="url(#avatarGrad-${initials})" />
  <text x="100" y="115" font-family="sans-serif" font-size="64" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="1">${initials}</text>
</svg>
`;

// 2. Blog Covers SVGs
const createBlogCover = (title, tag, gradient) => `
<svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="blogGrad-${tag}" x1="0%" y1="0%" x2="100%" y2="100%">
      ${gradient}
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#blogGrad-${tag})" />
  <!-- Grid pattern overlay -->
  <path d="M 0,50 L 600,50 M 0,100 L 600,100 M 0,150 L 600,150 M 0,200 L 600,200 M 0,250 L 600,250 M 0,300 L 600,300 M 0,355 L 600,355" stroke="rgba(255,255,255,0.06)" stroke-width="2" />
  <path d="M 100,0 L 100,400 M 200,0 L 200,400 M 300,0 L 300,400 M 400,0 L 400,400 M 500,0 L 500,400" stroke="rgba(255,255,255,0.06)" stroke-width="2" />
  
  <rect x="50" y="50" width="130" height="30" rx="15" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
  <text x="115" y="70" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">${tag.toUpperCase()}</text>
  
  <text x="50" y="180" font-family="sans-serif" font-size="34" font-weight="900" fill="#ffffff">${title.split(' ').slice(0,3).join(' ')}</text>
  <text x="50" y="225" font-family="sans-serif" font-size="34" font-weight="900" fill="#ffffff">${title.split(' ').slice(3).join(' ')}</text>
</svg>
`;

// 3. Corporate Company Logos SVGs
const createCompanyLogo = (name, initial, gradient) => `
<svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="compGrad-${initial}" x1="0%" y1="0%" x2="100%" y2="100%">
      ${gradient}
    </linearGradient>
  </defs>
  <rect width="150" height="150" fill="#ffffff" rx="16" stroke="#e2e8f0" stroke-width="2" />
  <circle cx="75" cy="75" r="50" fill="url(#compGrad-${initial})" />
  <text x="75" y="90" font-family="sans-serif" font-size="44" font-weight="800" fill="#ffffff" text-anchor="middle">${initial}</text>
</svg>
`;

// Conversion Function
async function generateWebP(svgString, outputPath, width, height) {
  try {
    const buffer = Buffer.from(svgString);
    await sharp(buffer)
      .resize(width, height)
      .webp({ quality: 90 })
      .toFile(outputPath);
    console.log(`Generated: ${outputPath}`);
  } catch (error) {
    console.error(`Error generating ${outputPath}:`, error);
  }
}

async function run() {
  const root = path.join(__dirname, '..');
  
  // Base Logos & Illustrations
  await generateWebP(primaryLogoSVG, path.join(root, 'assets', 'logo-primary.webp'), 300, 80);
  await generateWebP(whiteLogoSVG, path.join(root, 'assets', 'logo-white.webp'), 300, 80);
  await generateWebP(faviconSVG, path.join(root, 'assets', 'logo-favicon.webp'), 64, 64);
  await generateWebP(heroIllustrationSVG, path.join(root, 'images', 'hero-illustration.webp'), 600, 500);
  await generateWebP(featuresIllustrationSVG, path.join(root, 'images', 'features-illustration.webp'), 500, 500);
  await generateWebP(errorIllustrationSVG, path.join(root, 'images', '404-illustration.webp'), 500, 400);
  
  // Enriched Team Profiles
  await generateWebP(createTeamAvatar('DM', '<stop offset="0%" stop-color="#0ea5e9" /><stop offset="100%" stop-color="#2563eb" />'), path.join(root, 'images', 'david-miller.webp'), 200, 200);
  await generateWebP(createTeamAvatar('SP', '<stop offset="0%" stop-color="#38bdf8" /><stop offset="100%" stop-color="#0ea5e9" />'), path.join(root, 'images', 'sophia-patel.webp'), 200, 200);
  await generateWebP(createTeamAvatar('MB', '<stop offset="0%" stop-color="#a855f7" /><stop offset="100%" stop-color="#7e22ce" />'), path.join(root, 'images', 'marcus-brooks.webp'), 200, 200);
  await generateWebP(createTeamAvatar('AR', '<stop offset="0%" stop-color="#f43f5e" /><stop offset="100%" stop-color="#be123c" />'), path.join(root, 'images', 'aria-ross.webp'), 200, 200);
  
  // Enriched Blog cover previews
  await generateWebP(createBlogCover('System Design Interviews', 'systems', '<stop offset="0%" stop-color="#0ea5e9" /><stop offset="100%" stop-color="#2563eb" />'), path.join(root, 'images', 'blog-system-design.webp'), 600, 400);
  await generateWebP(createBlogCover('Remote Salary Negotiations', 'salary', '<stop offset="0%" stop-color="#2563eb" /><stop offset="100%" stop-color="#a855f7" />'), path.join(root, 'images', 'blog-remote-salaries.webp'), 600, 400);
  await generateWebP(createBlogCover('Technical Portfolio Audits', 'portfolio', '<stop offset="0%" stop-color="#a855f7" /><stop offset="100%" stop-color="#0ea5e9" />'), path.join(root, 'images', 'blog-github-audit.webp'), 600, 400);
  
  // Enriched Corporate Logos
  await generateWebP(createCompanyLogo('Vortex Tech', 'VT', '<stop offset="0%" stop-color="#0ea5e9" /><stop offset="100%" stop-color="#2563eb" />'), path.join(root, 'images', 'logo-vortex.webp'), 100, 100);
  await generateWebP(createCompanyLogo('SaaSify Systems', 'SS', '<stop offset="0%" stop-color="#22c55e" /><stop offset="100%" stop-color="#166534" />'), path.join(root, 'images', 'logo-saasify.webp'), 100, 100);
  await generateWebP(createCompanyLogo('Apex Creative', 'AC', '<stop offset="0%" stop-color="#f59e0b" /><stop offset="100%" stop-color="#d97706" />'), path.join(root, 'images', 'logo-apex.webp'), 100, 100);
  await generateWebP(createCompanyLogo('CloudCore', 'CC', '<stop offset="0%" stop-color="#a855f7" /><stop offset="100%" stop-color="#7e22ce" />'), path.join(root, 'images', 'logo-cloudcore.webp'), 100, 100);
  await generateWebP(createCompanyLogo('ScaleLabs', 'SL', '<stop offset="0%" stop-color="#ff7a59" /><stop offset="100%" stop-color="#ff4f27" />'), path.join(root, 'images', 'logo-scalelabs.webp'), 100, 100);
  await generateWebP(createCompanyLogo('Helpdesk Inc', 'HI', '<stop offset="0%" stop-color="#0052cc" /><stop offset="100%" stop-color="#002d72" />'), path.join(root, 'images', 'logo-helpdesk.webp'), 100, 100);
  
  console.log("Assets generation complete!");
}

run();
