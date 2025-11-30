// Global variables
let currentTheme = 'green';
let consoleHistory = [];
let historyIndex = -1;
let isTyping = false;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeMatrix();
    initializeNavigation();
    initializeThemeSwitcher();
    initializeConsole();
    initializeAuth();
    initializeMouseTrail();
    startMatrixAnimation();
    checkAuthStatus();
});

// Matrix background animation
function initializeMatrix() {
    const matrixBg = document.getElementById('matrix-bg');
    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
    
    function createColumn() {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        
        const x = Math.random() * window.innerWidth;
        const fontSize = Math.random() * 8 + 8;
        const speed = Math.random() * 3 + 2;
        const length = Math.random() * 15 + 10;
        
        column.style.cssText = `
            left: ${x}px;
            font-size: ${fontSize}px;
            animation: matrix-fall ${speed}s linear;
            opacity: ${Math.random() * 0.7 + 0.3};
        `;
        
        let text = '';
        for (let i = 0; i < length; i++) {
            text += chars[Math.floor(Math.random() * chars.length)] + '<br>';
        }
        column.innerHTML = text;
        
        matrixBg.appendChild(column);
        
        column.addEventListener('animationend', () => {
            column.remove();
        });
    }
    
    // Create initial columns
    for (let i = 0; i < 30; i++) {
        setTimeout(createColumn, i * 100);
    }
    
    // Continuously create new columns
    setInterval(createColumn, 200);
}

function startMatrixAnimation() {
    setInterval(() => {
        const columns = document.querySelectorAll('.matrix-column');
        columns.forEach(column => {
            if (Math.random() < 0.1) {
                column.style.opacity = Math.random() * 0.5 + 0.1;
            }
        });
    }, 100);
}

// Mouse trail effect
function initializeMouseTrail() {
    const trail = document.getElementById('mouse-trail');
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        trail.style.opacity = '0.8';
    });
    
    document.addEventListener('mouseleave', () => {
        trail.style.opacity = '0';
    });
    
    function animateTrail() {
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        trail.style.left = trailX - 10 + 'px';
        trail.style.top = trailY - 10 + 'px';
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Add entrance animation
        targetSection.style.opacity = '0';
        targetSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            targetSection.style.transition = 'all 0.5s ease';
            targetSection.style.opacity = '1';
            targetSection.style.transform = 'translateY(0)';
        }, 50);
    }
}

// Theme switcher functionality
function initializeThemeSwitcher() {
    const themeBtn = document.getElementById('theme-btn');
    const themeOptions = document.getElementById('theme-options');
    const themeOptionElements = document.querySelectorAll('.theme-option');
    
    themeBtn.addEventListener('click', function() {
        themeOptions.classList.toggle('show');
    });
    
    themeOptionElements.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            changeTheme(theme);
            themeOptions.classList.remove('show');
        });
    });
    
    // Close theme options when clicking outside
    document.addEventListener('click', function(e) {
        if (!themeBtn.contains(e.target) && !themeOptions.contains(e.target)) {
            themeOptions.classList.remove('show');
        }
    });
}

function changeTheme(theme) {
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    
    // Update matrix columns color
    const columns = document.querySelectorAll('.matrix-column');
    columns.forEach(column => {
        column.style.color = `var(--primary-color)`;
    });
    
    // Add theme change effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

// Console functionality
function initializeConsole() {
    const consoleInput = document.getElementById('console-input');
    const consoleOutput = document.getElementById('console-output');
    
    consoleInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = this.value.trim();
            if (command) {
                executeCommand(command);
                consoleHistory.push(command);
                historyIndex = consoleHistory.length;
                this.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                this.value = consoleHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < consoleHistory.length - 1) {
                historyIndex++;
                this.value = consoleHistory[historyIndex];
            } else {
                historyIndex = consoleHistory.length;
                this.value = '';
            }
        }
    });
    
    // Auto-focus console input when console section is active
    const consoleSection = document.getElementById('console');
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.classList.contains('active')) {
                setTimeout(() => consoleInput.focus(), 100);
            }
        });
    });
    observer.observe(consoleSection, { attributes: true, attributeFilter: ['class'] });
}

function executeCommand(command) {
    const consoleOutput = document.getElementById('console-output');
    
    // Add command to output
    addConsoleOutput(`msf6 > ${command}`, 'command');
    
    // Process command
    const cmd = command.toLowerCase().split(' ')[0];
    const args = command.split(' ').slice(1);
    
    switch (cmd) {
        case 'help':
            showHelp();
            break;
        case 'clear':
            clearConsole();
            break;
        case 'ls':
        case 'dir':
            listDirectory();
            break;
        case 'whoami':
            addConsoleOutput('ShadowHall@MetaSploit');
            break;
        case 'pwd':
            addConsoleOutput('/opt/metasploit-framework');
            break;
        case 'uname':
            addConsoleOutput('Linux MetaSploit 5.15.0-kali3-amd64 #1 SMP Debian 5.15.15-2kali1 x86_64 GNU/Linux');
            break;
        case 'ps':
            showProcesses();
            break;
        case 'netstat':
            showNetstat();
            break;
        case 'nmap':
            if (args.length > 0) {
                runNmap(args.join(' '));
            } else {
                addConsoleOutput('Usage: nmap [target]');
            }
            break;
        case 'exploit':
            addConsoleOutput('Starting exploit framework...');
            setTimeout(() => addConsoleOutput('Exploit framework loaded. Use "show exploits" to list available exploits.'), 1000);
            break;
        case 'show':
            if (args[0] === 'exploits') {
                showExploits();
            } else if (args[0] === 'payloads') {
                showPayloads();
            } else {
                addConsoleOutput('Usage: show [exploits|payloads]');
            }
            break;
        case 'use':
            if (args.length > 0) {
                addConsoleOutput(`Using exploit: ${args.join(' ')}`);
                addConsoleOutput('Exploit loaded. Use "show options" to configure.');
            } else {
                addConsoleOutput('Usage: use [exploit_path]');
            }
            break;
        case 'search':
            if (args.length > 0) {
                searchExploits(args.join(' '));
            } else {
                addConsoleOutput('Usage: search [term]');
            }
            break;
        case 'version':
            addConsoleOutput('MetaSploit Framework Console v6.3.47-dev');
            addConsoleOutput('Developed by ShadowHall, Malstrike & Team');
            break;
        case 'exit':
        case 'quit':
            addConsoleOutput('Goodbye!');
            break;
        default:
            addConsoleOutput(`Command not found: ${command}`);
            addConsoleOutput('Type "help" for available commands.');
            break;
    }
}

function addConsoleOutput(text, type = 'output') {
    const consoleOutput = document.getElementById('console-output');
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.textContent = text;
    consoleOutput.appendChild(line);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function showHelp() {
    const helpCommands = [
        'Available Commands:',
        '  help          - Show this help message',
        '  clear         - Clear console output',
        '  ls/dir        - List directory contents',
        '  whoami        - Show current user',
        '  pwd           - Show current directory',
        '  uname         - Show system information',
        '  ps            - Show running processes',
        '  netstat       - Show network connections',
        '  nmap [target] - Network scan',
        '  exploit       - Load exploit framework',
        '  show [type]   - Show exploits/payloads',
        '  use [exploit] - Select exploit',
        '  search [term] - Search exploits',
        '  version       - Show version info',
        '  exit/quit     - Exit console',
        ''
    ];
    
    helpCommands.forEach(cmd => addConsoleOutput(cmd));
}

function clearConsole() {
    const consoleOutput = document.getElementById('console-output');
    consoleOutput.innerHTML = `
        <div class="console-line">MetaSploit Framework Console v6.3.47-dev</div>
        <div class="console-line">+ -- --=[ 2847 exploits - 1234 auxiliary - 567 post ]</div>
        <div class="console-line">+ -- --=[ 1234 payloads - 45 encoders - 11 nops ]</div>
        <div class="console-line">+ -- --=[ 9 evasion ]</div>
        <div class="console-line"></div>
        <div class="console-line">Type 'help' for available commands</div>
        <div class="console-line"></div>
    `;
}

function listDirectory() {
    const files = [
        'drwxr-xr-x  2 root root  4096 Nov 30 12:00 exploits',
        'drwxr-xr-x  2 root root  4096 Nov 30 12:00 payloads',
        'drwxr-xr-x  2 root root  4096 Nov 30 12:00 auxiliary',
        'drwxr-xr-x  2 root root  4096 Nov 30 12:00 encoders',
        'drwxr-xr-x  2 root root  4096 Nov 30 12:00 nops',
        '-rw-r--r--  1 root root  1024 Nov 30 12:00 msfconsole',
        '-rw-r--r--  1 root root  2048 Nov 30 12:00 msfvenom',
        '-rw-r--r--  1 root root   512 Nov 30 12:00 README.md'
    ];
    
    files.forEach(file => addConsoleOutput(file));
}

function showProcesses() {
    const processes = [
        'PID    COMMAND',
        '1      systemd',
        '2      kthreadd',
        '1337   msfconsole',
        '1338   postgresql',
        '1339   apache2',
        '1340   ssh',
        '1341   metasploit'
    ];
    
    processes.forEach(proc => addConsoleOutput(proc));
}

function showNetstat() {
    const connections = [
        'Active Internet connections:',
        'Proto Recv-Q Send-Q Local Address           Foreign Address         State',
        'tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN',
        'tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN',
        'tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN',
        'tcp        0      0 127.0.0.1:5432          0.0.0.0:*               LISTEN'
    ];
    
    connections.forEach(conn => addConsoleOutput(conn));
}

function runNmap(target) {
    addConsoleOutput(`Starting Nmap scan on ${target}...`);
    
    setTimeout(() => {
        const results = [
            `Nmap scan report for ${target}`,
            'Host is up (0.0012s latency).',
            'PORT     STATE SERVICE',
            '22/tcp   open  ssh',
            '80/tcp   open  http',
            '443/tcp  open  https',
            '3389/tcp open  ms-wbt-server',
            '',
            'Nmap done: 1 IP address (1 host up) scanned in 2.34 seconds'
        ];
        
        results.forEach(result => addConsoleOutput(result));
    }, 2000);
}

function showExploits() {
    const exploits = [
        'Available Exploits:',
        '  windows/smb/ms17_010_eternalblue',
        '  linux/http/apache_mod_cgi_bash_env_exec',
        '  windows/http/iis_webdav_scstoragepathfromurl',
        '  multi/handler',
        '  windows/local/ms16_032_secondary_logon_handle_privesc',
        '  linux/local/dirty_cow',
        '  windows/browser/ms13_009_ie_slayoutrun_uaf',
        '  android/adb/adb_server_exec'
    ];
    
    exploits.forEach(exploit => addConsoleOutput(exploit));
}

function showPayloads() {
    const payloads = [
        'Available Payloads:',
        '  windows/meterpreter/reverse_tcp',
        '  linux/x86/meterpreter/reverse_tcp',
        '  windows/shell/reverse_tcp',
        '  linux/x86/shell/reverse_tcp',
        '  windows/meterpreter/bind_tcp',
        '  android/meterpreter/reverse_tcp',
        '  java/meterpreter/reverse_tcp',
        '  php/meterpreter/reverse_tcp'
    ];
    
    payloads.forEach(payload => addConsoleOutput(payload));
}

function searchExploits(term) {
    addConsoleOutput(`Searching for exploits containing '${term}'...`);
    
    setTimeout(() => {
        const results = [
            `Search results for '${term}':`,
            '  exploit/windows/smb/ms17_010_eternalblue',
            '  exploit/multi/handler',
            '  auxiliary/scanner/smb/smb_version',
            '  post/windows/gather/enum_shares'
        ];
        
        results.forEach(result => addConsoleOutput(result));
    }, 1000);
}

function toggleFullscreen() {
    const consoleContainer = document.querySelector('.console-container');
    consoleContainer.classList.toggle('fullscreen');
    
    // Add fullscreen styles if not already added
    if (!document.getElementById('fullscreen-styles')) {
        const style = document.createElement('style');
        style.id = 'fullscreen-styles';
        style.textContent = `
            .console-container.fullscreen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 9999;
                border-radius: 0;
            }
            .console-container.fullscreen .console-output {
                height: calc(100vh - 120px);
            }
        `;
        document.head.appendChild(style);
    }
}

// Add some visual effects
function addGlitchEffect(element) {
    element.classList.add('glitch');
    setTimeout(() => {
        element.classList.remove('glitch');
    }, 2000);
}

function addScanEffect(element) {
    element.classList.add('scan-line');
    setTimeout(() => {
        element.classList.remove('scan-line');
    }, 3000);
}

// Add random glitch effects
setInterval(() => {
    const elements = document.querySelectorAll('.nav-link, .stat-number, .logo-text');
    const randomElement = elements[Math.floor(Math.random() * elements.length)];
    if (Math.random() < 0.1) {
        addGlitchEffect(randomElement);
    }
}, 5000);

// Authentication system
function initializeAuth() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const users = JSON.parse(localStorage.getItem('metasploit_users') || '{}');
        
        if (users[username] && users[username].password === password) {
            localStorage.setItem('metasploit_auth', JSON.stringify({
                username: username,
                loginTime: Date.now()
            }));
            closeModal();
            showSection('console');
            addConsoleOutput(`Welcome back, ${username}!`);
        } else {
            alert('Invalid credentials!');
        }
    });
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        
        const users = JSON.parse(localStorage.getItem('metasploit_users') || '{}');
        
        if (users[username]) {
            alert('Username already exists!');
            return;
        }
        
        users[username] = {
            email: email,
            password: password,
            registerTime: Date.now()
        };
        
        localStorage.setItem('metasploit_users', JSON.stringify(users));
        alert('Registration successful! You can now login.');
        showLogin();
    });
}

function showLoginModal() {
    document.getElementById('login-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('login-modal').style.display = 'none';
}

function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

function checkAuthStatus() {
    const auth = JSON.parse(localStorage.getItem('metasploit_auth') || 'null');
    if (auth && (Date.now() - auth.loginTime) < 24 * 60 * 60 * 1000) {
        // User is still logged in (24 hour session)
        return true;
    }
    return false;
}

// Add scan effects to download links
document.addEventListener('mouseover', function(e) {
    if (e.target.classList.contains('download-link')) {
        addScanEffect(e.target);
    }
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('login-modal');
    if (e.target === modal) {
        closeModal();
    }
});