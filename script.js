// ==========================================
// Core DOM Elements
// ==========================================
const dateBtn = document.getElementById('dateBtn');
const timeBtn = document.getElementById('timeBtn');
const quoteBtn = document.getElementById('quoteBtn');
const copyQuoteBtn = document.getElementById('copyQuoteBtn');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const dateOutput = document.getElementById('dateOutput');
const timeOutput = document.getElementById('timeOutput');
const quoteOutput = document.getElementById('quoteOutput');
const quoteAuthor = document.getElementById('quoteAuthor');
const liveClockToggle = document.getElementById('liveClockToggle');
const utcOutput = document.getElementById('utcOutput');
const scrollProgress = document.getElementById('scrollProgress');
const backToTopBtn = document.getElementById('backToTop');
const toastContainer = document.getElementById('toastContainer');
const mobileNavToggle = document.getElementById('mobileNavToggle');
const siteNav = document.getElementById('siteNav');
const currentYearSpan = document.getElementById('currentYear');

// ==========================================
// Toast Notification Utility
// ==========================================
function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// ==========================================
// Theme Management (Light / Dark Mode)
// ==========================================
function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark', isDark);
    if (themeIcon) {
        themeIcon.textContent = isDark ? '☀️' : '🌙';
    }
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const isCurrentDark = document.body.classList.contains('dark');
    const nextTheme = isCurrentDark ? 'light' : 'dark';
    applyTheme(nextTheme);
    showToast(`Theme switched to ${nextTheme} mode`);
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }
}

// ==========================================
// Date, Time & Live UTC Cloud Clock
// ==========================================
let isLiveClockRunning = true;

function showDate() {
    const today = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-GB', options);
    if (dateOutput) {
        dateOutput.textContent = `📅 ${formattedDate}`;
    }
}

function showTime() {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (timeOutput) {
        timeOutput.textContent = `⏰ ${formattedTime}`;
    }
}

function updateLiveClock() {
    if (!isLiveClockRunning) return;
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (timeOutput) {
        timeOutput.textContent = `⏰ ${formattedTime}`;
    }
    if (utcOutput) {
        const utcHours = String(now.getUTCHours()).padStart(2, '0');
        const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
        const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');
        utcOutput.textContent = `UTC Cloud Time: ${utcHours}:${utcMinutes}:${utcSeconds}`;
    }
}

function toggleLiveClock() {
    isLiveClockRunning = !isLiveClockRunning;
    if (liveClockToggle) {
        liveClockToggle.textContent = isLiveClockRunning ? '⏱️ Auto Clock: ON' : '⏱️ Auto Clock: OFF';
    }
    showToast(isLiveClockRunning ? 'Live clock resumed' : 'Live clock paused');
}

// ==========================================
// Quotes Collection & Randomizer
// ==========================================
const quotes = [
    { text: '“The best way to predict the future is to build it.”', author: '- Peter Drucker' },
    { text: '“Success is the sum of small efforts, repeated day in and day out.”', author: '- Robert Collier' },
    { text: '“Learning is the first step to creating something meaningful.”', author: '- Unknown' },
    { text: '“Cloud skills open doors to ideas that scale beyond your imagination.”', author: '- Cloud Architecture Principle' },
    { text: '“Simplicity is prerequisite for reliability.”', author: '- Edsger W. Dijkstra' },
    { text: '“Any sufficiently advanced technology is indistinguishable from magic.”', author: '- Arthur C. Clarke' },
    { text: '“Automation applied to an efficient operation will magnify the efficiency.”', author: '- Bill Gates' }
];

let quoteIndex = 0;

function changeQuote() {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    const quote = quotes[quoteIndex];
    if (quoteOutput) quoteOutput.textContent = quote.text;
    if (quoteAuthor) quoteAuthor.textContent = quote.author;
}

function copyCurrentQuote() {
    const currentText = quoteOutput ? quoteOutput.textContent : '';
    const currentAuthor = quoteAuthor ? quoteAuthor.textContent : '';
    const fullText = `${currentText} ${currentAuthor}`;
    navigator.clipboard.writeText(fullText).then(() => {
        showToast('Quote copied to clipboard!');
    }).catch(() => {
        showToast('Unable to copy quote to clipboard.');
    });
}

// ==========================================
// Telemetry & Azure Region Latency Simulator
// ==========================================
function initTelemetry() {
    // Visitor Count Simulator (persisted in localStorage)
    const visitorCountEl = document.getElementById('visitorCount');
    if (visitorCountEl) {
        let visits = parseInt(localStorage.getItem('pasindu_portfolio_visits') || '142', 10);
        visits += 1;
        localStorage.setItem('pasindu_portfolio_visits', visits.toString());
        visitorCountEl.textContent = `${visits.toLocaleString()} Visits`;
    }

    // Client Render Time
    const pageLoadSpeedEl = document.getElementById('pageLoadSpeed');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (pageLoadSpeedEl) {
                const perfData = window.performance && window.performance.timing;
                const loadTime = perfData ? (perfData.domContentLoadedEventEnd - perfData.navigationStart) : Math.floor(Math.random() * 80 + 120);
                const safeTime = (loadTime > 0 && loadTime < 10000) ? loadTime : 148;
                pageLoadSpeedEl.textContent = `${safeTime} ms`;
            }
        }, 50);
    });

    // Latency Ping test button
    const pingTestBtn = document.getElementById('pingTestBtn');
    if (pingTestBtn) {
        pingTestBtn.addEventListener('click', runLatencyTests);
    }
    runLatencyTests();
}

function runLatencyTests() {
    const regions = [
        { id: 'eastus', base: 45, variance: 25 },
        { id: 'westeurope', base: 85, variance: 30 },
        { id: 'southeastasia', base: 28, variance: 15 },
        { id: 'centralindia', base: 35, variance: 20 }
    ];

    showToast('Running Azure region latency test...');

    regions.forEach(region => {
        const badge = document.getElementById(`ping-${region.id}`);
        const bar = document.getElementById(`bar-${region.id}`);
        if (badge) badge.textContent = 'Pinging...';

        const delay = Math.floor(Math.random() * 400 + 200);
        setTimeout(() => {
            const latency = Math.floor(region.base + Math.random() * region.variance);
            if (badge) {
                badge.textContent = `${latency} ms`;
                if (latency < 40) {
                    badge.style.color = 'var(--success-color)';
                } else if (latency < 80) {
                    badge.style.color = 'var(--warning-color)';
                } else {
                    badge.style.color = '#38bdf8';
                }
            }
            if (bar) {
                const percentage = Math.min(100, Math.max(15, latency));
                bar.style.width = `${percentage}%`;
            }
        }, delay);
    });
}

// ==========================================
// Skills Filter
// ==========================================
function initSkillsFilter() {
    const filterButtons = document.querySelectorAll('.skills-filter-row .filter-btn');
    const skillCards = document.querySelectorAll('.skills-grid .skill-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ==========================================
// Projects Filter & Modal Dialog
// ==========================================
const projectData = {
    p1: {
        title: 'Azure Static Portfolio Webapp',
        category: 'Cloud Architecture & Web',
        badge: 'Live Production',
        description: 'A modern, performant, and secure personal portfolio built specifically for Microsoft Azure Static Web Apps. Designed with zero heavy runtime dependencies to ensure fast global edge delivery.',
        architecture: [
            'Global Content Delivery Network (Azure Edge CDN) caching HTML/CSS/JS assets at PoPs closest to users.',
            'Automated GitHub Actions CI/CD pipeline triggered upon every git push to the main branch.',
            'Managed custom domains with free automatic SSL/TLS certificate renewal.',
            'Optimized client-side state machine for latency diagnostics and terminal simulation.'
        ],
        technologies: ['Azure Static Web Apps', 'GitHub Actions', 'HTML5 Semantic', 'Modern CSS Glassmorphism', 'Vanilla JS ES6+'],
        keyMetric: '100% Google Lighthouse score on Performance, Accessibility, and Best Practices.'
    },
    p2: {
        title: 'Automated CI/CD Deployment Pipeline',
        category: 'DevOps & Cloud Automation',
        badge: 'Diploma Lab Project',
        description: 'Designed an enterprise-grade automated deployment workflow using GitHub Actions and the Azure Static Web Apps GitHub action to eliminate manual deployment errors and ensure zero-downtime releases.',
        architecture: [
            'Push / Pull Request trigger targeting staging and production branches.',
            'Automated linting and static analysis to enforce coding standards.',
            'Secure credential injection via GitHub Repository Secrets (AZURE_STATIC_WEB_APPS_API_TOKEN).',
            'Automated deployment preview environments generated for every open pull request.'
        ],
        technologies: ['GitHub Actions Workflows', 'Azure Resource Management', 'YAML Pipelines', 'Git Branch Protection'],
        keyMetric: 'Deployment time reduced from 15 minutes manual build to under 45 seconds automated pipeline.'
    },
    p3: {
        title: 'Azure Secure Blob Asset Store',
        category: 'Cloud Storage & Security',
        badge: 'Cloud Lab Architecture',
        description: 'Architected a highly resilient, scalable object storage solution using Azure Blob Storage Hot/Cool tiers, coupled with Azure CDN and time-limited Shared Access Signatures (SAS) for secure content distribution.',
        architecture: [
            'Hierarchical namespace container structure isolating public media from restricted project documents.',
            'Automated lifecycle management policies migrating blobs from Hot to Cool tier after 30 days to optimize cost.',
            'Fine-grained Shared Access Signature (SAS) token generation enforcing expiration and IP filtering.',
            'Azure CDN endpoint integration minimizing egress latency for global downloads.'
        ],
        technologies: ['Azure Blob Storage', 'Shared Access Signatures (SAS)', 'Azure CDN', 'Storage Lifecycle Rules', 'RBAC Security'],
        keyMetric: '99.999999999% (11 nines) of data durability achieved via Locally Redundant Storage (LRS).'
    },
    p4: {
        title: 'Serverless Cloud Latency & Shell Simulator',
        category: 'Web Applications & Tools',
        badge: 'Interactive Tool',
        description: 'Created an in-browser cloud diagnostics and terminal suite allowing users to test network latency to Azure global datacenters, simulate Azure CLI command execution, and estimate monthly cloud resource costs.',
        architecture: [
            'Asynchronous JavaScript event-driven terminal emulation with history navigation and parsing.',
            'Simulated TCP/HTTP round-trip time measurement across East US, West Europe, SE Asia, and India.',
            'Real-time cloud pricing model recalculating compute, storage, and egress estimations.',
            'Responsive glassmorphism UI styled with CSS custom properties and hardware-accelerated animations.'
        ],
        technologies: ['JavaScript ES6+', 'Asynchronous Fetch / Timing', 'Modern CSS Grid/Flexbox', 'Local Storage Telemetry'],
        keyMetric: 'Zero external bundle weight; runs at a smooth 60fps across desktop and mobile devices.'
    }
};

function initProjects() {
    // Project filter buttons
    const pfilterBtns = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.projects-grid .project-card');

    pfilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            pfilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-pfilter');
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || (category && category.includes(filter))) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Project modal triggers
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalBody = document.getElementById('modalBody');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalDismissBtn = document.getElementById('modalDismissBtn');

    function openProjectModal(projectId) {
        const data = projectData[projectId];
        if (!data || !modal) return;

        modalTitle.textContent = data.title;
        modalCategory.textContent = data.badge;

        let techChips = data.technologies.map(t => `<span class="social-chip">${t}</span>`).join(' ');
        let archPoints = data.architecture.map(item => `<li>${item}</li>`).join('');

        modalBody.innerHTML = `
            <p style="margin-bottom: 1rem;">${data.description}</p>
            <h4 style="color: var(--text-color); margin-bottom: 0.5rem;">Key Architecture &amp; Implementation:</h4>
            <ul style="color: var(--muted-color); line-height: 1.6; margin-left: 1.25rem;">
                ${archPoints}
            </ul>
            <div style="margin: 1.25rem 0;">
                <h4 style="color: var(--text-color); margin-bottom: 0.4rem;">Technologies Used:</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">${techChips}</div>
            </div>
            <div style="background: rgba(56, 189, 248, 0.1); border-left: 3px solid #38bdf8; padding: 0.75rem; border-radius: 6px; font-size: 0.88rem;">
                <strong>Impact &amp; Key Metric:</strong> ${data.keyMetric}
            </div>
        `;

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeProjectModal() {
        if (!modal) return;
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.view-project-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            openProjectModal(id);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
    if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeProjectModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeProjectModal();
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeProjectModal();
        }
    });
}

// ==========================================
// Cloud Resource & Cost Calculator Lab
// ==========================================
function initCloudCalculator() {
    const tierSelect = document.getElementById('cloudTierSelect');
    const storageSlider = document.getElementById('storageSlider');
    const bandwidthSlider = document.getElementById('bandwidthSlider');
    const trafficSlider = document.getElementById('trafficSlider');

    const storageValue = document.getElementById('storageValue');
    const bandwidthValue = document.getElementById('bandwidthValue');
    const trafficValue = document.getElementById('trafficValue');
    const tierDescription = document.getElementById('tierDescription');

    const totalCostEl = document.getElementById('totalMonthlyCost');
    const costComputeEl = document.getElementById('costCompute');
    const costStorageEl = document.getElementById('costStorage');
    const costBandwidthEl = document.getElementById('costBandwidth');

    const tierDescriptions = {
        free: 'Azure Static Web Apps Free: 100 GB egress/mo, custom domains with free managed SSL, global edge distribution.',
        standard: 'Azure Static Web Apps Standard: Enterprise SLA (99.95%), custom authentication, private endpoints, 500 GB bandwidth.',
        'appservice-b1': 'Azure App Service B1: Dedicated 1 vCPU, 1.75 GB RAM, manual/auto scale up to 3 instances.',
        'appservice-s1': 'Azure App Service S1: Production tier with staging slots, daily automated backup, auto-scaling up to 10 instances.'
    };

    function updateCalculation() {
        if (!tierSelect) return;
        const selectedTier = tierSelect.value;
        const baseComputeCost = parseFloat(tierSelect.options[tierSelect.selectedIndex].getAttribute('data-base') || '0');
        const storageGB = parseInt(storageSlider.value, 10);
        const bandwidthGB = parseInt(bandwidthSlider.value, 10);
        const requests = parseInt(trafficSlider.value, 10);

        // Update labels
        if (storageValue) storageValue.textContent = `${storageGB} GB`;
        if (bandwidthValue) bandwidthValue.textContent = `${bandwidthGB} GB`;
        if (trafficValue) trafficValue.textContent = `${requests.toLocaleString()} requests`;
        if (tierDescription && tierDescriptions[selectedTier]) {
            tierDescription.textContent = tierDescriptions[selectedTier];
        }

        // Storage cost: ~$0.02 per GB
        const storageCost = storageGB * 0.02;

        // Bandwidth cost: First 100GB free on SWA; then $0.08 per GB
        let billableBandwidth = Math.max(0, bandwidthGB - (selectedTier === 'free' ? 100 : 50));
        const bandwidthCost = billableBandwidth * 0.08;

        const totalCost = baseComputeCost + storageCost + bandwidthCost;

        if (costComputeEl) costComputeEl.textContent = `$${baseComputeCost.toFixed(2)}`;
        if (costStorageEl) costStorageEl.textContent = `$${storageCost.toFixed(2)}`;
        if (costBandwidthEl) costBandwidthEl.textContent = `$${bandwidthCost.toFixed(2)}`;
        if (totalCostEl) totalCostEl.textContent = totalCost.toFixed(2);
    }

    if (tierSelect) tierSelect.addEventListener('change', updateCalculation);
    if (storageSlider) storageSlider.addEventListener('input', updateCalculation);
    if (bandwidthSlider) bandwidthSlider.addEventListener('input', updateCalculation);
    if (trafficSlider) trafficSlider.addEventListener('input', updateCalculation);

    updateCalculation();
}

// ==========================================
// Interactive Cloud Shell / Terminal Simulator
// ==========================================
function initTerminal() {
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');
    const clearTerminalBtn = document.getElementById('clearTerminalBtn');
    const termPillButtons = document.querySelectorAll('.term-pill-btn');

    let commandHistory = [];
    let historyIndex = -1;

    function appendLine(text, className = '') {
        if (!terminalOutput) return;
        const line = document.createElement('div');
        line.className = `term-line ${className}`;
        line.innerHTML = text;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function processCommand(rawInput) {
        const cmd = rawInput.trim();
        if (!cmd) return;

        commandHistory.push(cmd);
        historyIndex = commandHistory.length;

        appendLine(`<span class="prompt-symbol">pasindu@azure:~$</span> ${cmd}`);

        const lower = cmd.toLowerCase();

        if (lower === 'help') {
            appendLine('Available Azure Cloud Shell commands:');
            appendLine('  <span class="term-cmd">help</span>              - Display this list of commands');
            appendLine('  <span class="term-cmd">az webapp list</span>    - List active Azure Static Web Apps');
            appendLine('  <span class="term-cmd">az status</span>         - Check datacenter service health & SLA');
            appendLine('  <span class="term-cmd">skills</span>            - Inspect technical competencies');
            appendLine('  <span class="term-cmd">projects</span>          - Display portfolio and lab projects');
            appendLine('  <span class="term-cmd">uptime</span>            - Show system uptime & telemetry');
            appendLine('  <span class="term-cmd">whoami</span>            - Display student profile & diploma details');
            appendLine('  <span class="term-cmd">theme toggle</span>      - Toggle light/dark appearance');
            appendLine('  <span class="term-cmd">quote</span>             - Generate a new inspirational quote');
            appendLine('  <span class="term-cmd">contact</span>           - View contact details');
            appendLine('  <span class="term-cmd">clear</span>             - Clear the terminal screen');
        } else if (lower === 'az webapp list' || lower === 'az webapp show') {
            appendLine('<span class="term-success">[</span>');
            appendLine('  {');
            appendLine('    "name": "pasindu-static-webapp",');
            appendLine('    "resourceGroup": "rg-diploma-cloud",');
            appendLine('    "location": "East US 2 (Azure Edge CDN)",');
            appendLine('    "sku": "Free_F1",');
            appendLine('    "state": "Running",');
            appendLine('    "customDomains": ["pasinduperera.dev"],');
            appendLine('    "sslStatus": "ManagedCertificate_Enabled"');
            appendLine('  }');
            appendLine('<span class="term-success">]</span>');
        } else if (lower === 'az status' || lower === 'az --version') {
            appendLine('Azure CLI Version: 2.50.0 (Core Engine)');
            appendLine('Cloud Environment: AzureCloud (Public)');
            appendLine('Status: <span class="term-success">All services operational • 99.99% Availability</span>');
        } else if (lower === 'skills') {
            appendLine('<span class="term-cmd">Primary Skills & Tools:</span>');
            appendLine('  • Cloud: Azure Static Web Apps, Blob Storage, CDN, VMs, VNet');
            appendLine('  • DevOps: GitHub Actions CI/CD, Git, Linux CLI, Bash Scripting');
            appendLine('  • Web: HTML5 Semantics, Modern Responsive CSS, JavaScript ES6+');
        } else if (lower === 'projects') {
            appendLine('<span class="term-cmd">Active Portfolio Projects:</span>');
            appendLine('  1. Azure Static Portfolio Webapp (Live on Azure SWA)');
            appendLine('  2. Automated CI/CD Deployment Pipeline (GitHub Actions)');
            appendLine('  3. Azure Secure Blob Asset Store (Storage & SAS Tokens)');
            appendLine('  4. Serverless Cloud Latency & Shell Simulator (Web Tool)');
        } else if (lower === 'uptime') {
            const now = new Date();
            appendLine(`System Uptime: 99.99% SLA • Server Timestamp: ${now.toISOString()}`);
            appendLine(`Session Health: OK (HTTP 200) • Global CDN Latency: Active`);
        } else if (lower === 'whoami') {
            appendLine('User: Pasindu Perera');
            appendLine('Role: Cloud Computing Diploma Student & Developer');
            appendLine('Interests: Cloud Architecture, Azure, CI/CD Automation, Front-End UI');
        } else if (lower.startsWith('theme')) {
            toggleTheme();
            appendLine(`<span class="term-success">Theme updated successfully to ${document.body.classList.contains('dark') ? 'Dark' : 'Light'} Mode.</span>`);
        } else if (lower === 'quote') {
            changeQuote();
            appendLine(`<span class="term-warn">${quoteOutput.textContent}</span> ${quoteAuthor.textContent}`);
        } else if (lower === 'contact') {
            appendLine('Email: <span class="term-cmd">pasindu@example.com</span>');
            appendLine('Location: Colombo, Sri Lanka');
            appendLine('GitHub: https://github.com • LinkedIn: https://linkedin.com');
        } else if (lower === 'clear') {
            terminalOutput.innerHTML = '';
        } else {
            appendLine(`<span class="term-error">Command not recognized: '${cmd}'.</span> Type <span class="term-cmd">help</span> for valid commands.`);
        }

        appendLine('<br>');
    }

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                processCommand(terminalInput.value);
                terminalInput.value = '';
            } else if (e.key === 'ArrowUp') {
                if (commandHistory.length > 0 && historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = commandHistory[historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    terminalInput.value = '';
                }
            }
        });
    }

    if (clearTerminalBtn) {
        clearTerminalBtn.addEventListener('click', () => {
            if (terminalOutput) terminalOutput.innerHTML = '';
        });
    }

    termPillButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const cmd = btn.getAttribute('data-cmd');
            if (cmd) {
                if (cmd === 'clear') {
                    if (terminalOutput) terminalOutput.innerHTML = '';
                } else {
                    processCommand(cmd);
                }
            }
        });
    });
}

// ==========================================
// Cloud Knowledge Quiz
// ==========================================
const quizQuestions = [
    {
        question: 'Which cloud service model provides maximum control over the operating system, storage, and networking?',
        options: [
            'Software as a Service (SaaS)',
            'Infrastructure as a Service (IaaS)',
            'Platform as a Service (PaaS)',
            'Function as a Service (FaaS)'
        ],
        correct: 1,
        explanation: 'IaaS (such as Azure Virtual Machines) gives developers direct control over OS configurations, networking, and storage.'
    },
    {
        question: 'What is a primary architectural advantage of hosting on Azure Static Web Apps?',
        options: [
            'Requires manual server operating system updates',
            'Global edge distribution via CDNs with automated GitHub CI/CD workflows',
            'Requires high monthly subscription fees for personal portfolios',
            'Does not support custom domains or SSL certificates'
        ],
        correct: 1,
        explanation: 'Azure Static Web Apps automatically builds and deploys from GitHub, serving static assets from global CDN points of presence.'
    },
    {
        question: 'What is the purpose of a Shared Access Signature (SAS) in Azure Blob Storage?',
        options: [
            'To completely delete the storage account',
            'To provide delegated, time-limited, and fine-grained access without exposing account keys',
            'To convert blobs into virtual machines',
            'To compile JavaScript code into WebAssembly'
        ],
        correct: 1,
        explanation: 'SAS tokens provide secure, restricted, and expiring URI query access to specific storage resources without leaking master storage keys.'
    },
    {
        question: 'In continuous integration and continuous deployment (CI/CD), what role does GitHub Actions perform?',
        options: [
            'Automates linting, testing, building, and deploying code triggered by repository events',
            'Acts as a physical domain name registrar',
            'Generates electricity for cloud servers',
            'Replaces modern CSS and HTML entirely'
        ],
        correct: 0,
        explanation: 'GitHub Actions allows defining YAML workflow automation pipelines directly within the code repository.'
    },
    {
        question: 'Which Azure storage tier is optimal for frequently accessed media files and web assets?',
        options: [
            'Archive Tier',
            'Cool Tier',
            'Hot Tier',
            'Offline Magnetic Tape'
        ],
        correct: 2,
        explanation: 'The Hot Tier is optimized for data that is actively accessed and queried frequently, providing the lowest access latency.'
    }
];

function initQuiz() {
    let currentQ = 0;
    let score = 0;

    const countEl = document.getElementById('quizQuestionCount');
    const scoreEl = document.getElementById('quizScore');
    const progressFill = document.getElementById('quizProgressBarFill');
    const questionText = document.getElementById('quizQuestionText');
    const optionsContainer = document.getElementById('quizOptions');
    const feedbackEl = document.getElementById('quizFeedback');
    const nextBtn = document.getElementById('nextQuestionBtn');
    const restartBtn = document.getElementById('restartQuizBtn');

    function renderQuestion() {
        if (!questionText || !optionsContainer) return;
        const q = quizQuestions[currentQ];

        countEl.textContent = `Question ${currentQ + 1} of ${quizQuestions.length}`;
        scoreEl.textContent = `Score: ${score}`;
        progressFill.style.width = `${((currentQ + 1) / quizQuestions.length) * 100}%`;

        questionText.textContent = q.question;
        optionsContainer.innerHTML = '';
        feedbackEl.className = 'quiz-feedback hidden';
        feedbackEl.innerHTML = '';
        nextBtn.style.display = 'none';
        restartBtn.style.display = 'none';

        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-opt-btn';
            btn.textContent = `${String.fromCharCode(65 + idx)}. ${opt}`;
            btn.addEventListener('click', () => selectAnswer(idx));
            optionsContainer.appendChild(btn);
        });
    }

    function selectAnswer(selectedIdx) {
        const q = quizQuestions[currentQ];
        const buttons = optionsContainer.querySelectorAll('.quiz-opt-btn');

        buttons.forEach((btn, idx) => {
            btn.disabled = true;
            if (idx === q.correct) {
                btn.classList.add('correct');
            } else if (idx === selectedIdx) {
                btn.classList.add('wrong');
            }
        });

        const isCorrect = selectedIdx === q.correct;
        if (isCorrect) {
            score++;
            scoreEl.textContent = `Score: ${score}`;
            feedbackEl.className = 'quiz-feedback correct-feedback';
            feedbackEl.innerHTML = `<strong>Correct! 🎉</strong> ${q.explanation}`;
        } else {
            feedbackEl.className = 'quiz-feedback wrong-feedback';
            feedbackEl.innerHTML = `<strong>Not quite.</strong> ${q.explanation}`;
        }

        if (currentQ < quizQuestions.length - 1) {
            nextBtn.style.display = 'inline-flex';
        } else {
            // End of quiz
            setTimeout(showQuizResults, 1200);
        }
    }

    function showQuizResults() {
        questionText.textContent = `Quiz Complete! You scored ${score} out of ${quizQuestions.length}.`;
        const percentage = Math.round((score / quizQuestions.length) * 100);
        optionsContainer.innerHTML = `
            <div style="text-align: center; padding: 1.5rem 0;">
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">${percentage >= 80 ? '🏆' : percentage >= 60 ? '✨' : '📚'}</div>
                <h4 style="font-size: 1.3rem; margin-bottom: 0.5rem;">${percentage >= 80 ? 'Outstanding Cloud Architect!' : percentage >= 60 ? 'Solid Cloud Foundation!' : 'Keep Learning & Exploring!'}</h4>
                <p style="color: var(--muted-color); font-size: 0.95rem;">You achieved a score of ${percentage}%. Great step on your cloud journey!</p>
            </div>
        `;
        feedbackEl.className = 'quiz-feedback hidden';
        nextBtn.style.display = 'none';
        restartBtn.style.display = 'inline-flex';
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentQ < quizQuestions.length - 1) {
                currentQ++;
                renderQuestion();
            }
        });
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            currentQ = 0;
            score = 0;
            renderQuestion();
        });
    }

    renderQuestion();
}

// ==========================================
// Contact Form & Copy Handler
// ==========================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const subjectSelect = document.getElementById('contactSubject');
    const messageInput = document.getElementById('contactMessage');
    const charCount = document.getElementById('charCount');
    const copyBtn = document.getElementById('copyMessageBtn');
    const formStatus = document.getElementById('formStatus');

    if (messageInput && charCount) {
        messageInput.addEventListener('input', () => {
            charCount.textContent = `${messageInput.value.length} / 500`;
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const name = nameInput.value.trim() || 'Anonymous';
            const email = emailInput.value.trim() || 'Not provided';
            const subject = subjectSelect ? subjectSelect.value : 'Inquiry';
            const message = messageInput.value.trim() || 'No message entered';

            const formatted = `To: Pasindu Perera\nFrom: ${name} (${email})\nSubject: ${subject}\n\nMessage:\n${message}`;

            navigator.clipboard.writeText(formatted).then(() => {
                showToast('Message formatted & copied to clipboard!');
            }).catch(() => {
                showToast('Unable to copy message text.');
            });
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();
            const subject = subjectSelect ? subjectSelect.value : 'Portfolio Contact';

            if (!name || !email || !message) {
                if (formStatus) {
                    formStatus.className = 'form-status error';
                    formStatus.textContent = 'Please fill out all required fields (Name, Email, and Message).';
                }
                return;
            }

            if (!email.includes('@') || !email.includes('.')) {
                if (formStatus) {
                    formStatus.className = 'form-status error';
                    formStatus.textContent = 'Please provide a valid email address.';
                }
                return;
            }

            // Construct mailto link
            const mailtoUri = `mailto:pasindu@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Pasindu,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

            if (formStatus) {
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Opening your email client... Thank you for reaching out!';
            }
            showToast('Launching email client...');

            setTimeout(() => {
                window.location.href = mailtoUri;
            }, 600);
        });
    }
}

// ==========================================
// Scroll Progress, Back To Top & Mobile Nav
// ==========================================
function initScrollFeatures() {
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        if (scrollProgress) {
            scrollProgress.style.width = `${scrolled}%`;
        }

        if (backToTopBtn) {
            if (scrollTop > 320) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (mobileNavToggle && siteNav) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpen = siteNav.classList.toggle('nav-open');
            mobileNavToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        siteNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                siteNav.classList.remove('nav-open');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
}

// ==========================================
// Initialization & Event Listeners
// ==========================================
if (dateBtn) dateBtn.addEventListener('click', showDate);
if (timeBtn) timeBtn.addEventListener('click', showTime);
if (quoteBtn) quoteBtn.addEventListener('click', changeQuote);
if (copyQuoteBtn) copyQuoteBtn.addEventListener('click', copyCurrentQuote);
if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (liveClockToggle) liveClockToggle.addEventListener('click', toggleLiveClock);

// Run initial setups
initializeTheme();
showDate();
showTime();
changeQuote();
setInterval(updateLiveClock, 1000);
updateLiveClock();

initTelemetry();
initSkillsFilter();
initProjects();
initCloudCalculator();
initTerminal();
initQuiz();
initContactForm();
initScrollFeatures();
