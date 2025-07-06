/* ==================== MODULE: screens/login-demo.js ==================== */
/* Login screen demo controls and functionality */

const loginDemoControls = {
    showNormalState() {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const errorMessage = document.getElementById('errorMessage');
        const stateIndicator = document.getElementById('stateIndicator');
        
        if (!usernameInput || !passwordInput || !errorMessage || !stateIndicator) return;
        
        errorMessage.classList.remove('show');
        usernameInput.classList.remove('error');
        passwordInput.classList.remove('error');
        stateIndicator.textContent = 'Normal State';
        stateIndicator.className = 'state-indicator';
        usernameInput.value = '';
        passwordInput.value = '';
    },

    showErrorState() {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const errorMessage = document.getElementById('errorMessage');
        const stateIndicator = document.getElementById('stateIndicator');
        
        if (!usernameInput || !passwordInput || !errorMessage || !stateIndicator) return;
        
        errorMessage.classList.add('show');
        usernameInput.classList.add('error');
        passwordInput.classList.add('error');
        stateIndicator.textContent = 'Error State';
        stateIndicator.className = 'state-indicator error-state';
        usernameInput.value = 'wronguser';
        passwordInput.value = 'wrongpass';
    },

    simulateLogin() {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const stateIndicator = document.getElementById('stateIndicator');
        
        if (!usernameInput || !passwordInput || !stateIndicator) {
            console.log('Login elements not found');
            return;
        }
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }
        
        stateIndicator.textContent = 'Checking Database...';
        stateIndicator.className = 'state-indicator checking-state';
        
        setTimeout(() => {
            if (username === 'lisa.monroe' && password === 'stockflow123') {
                this.simulateSuccessAndNavigate();
            } else {
                this.showErrorState();
            }
        }, 1500);
    },

    simulateSuccessAndNavigate() {
        const stateIndicator = document.getElementById('stateIndicator');
        if (!stateIndicator) return;
        
        stateIndicator.textContent = 'Login Successful!';
        stateIndicator.className = 'state-indicator';
        
        setTimeout(() => {
            showScreen('dashboard');
            
            // Update navigation button
            document.querySelectorAll('.nav-button').forEach(button => {
                button.classList.remove('active');
            });
            const dashboardButton = document.querySelector('[onclick*="dashboard"]');
            if (dashboardButton) {
                dashboardButton.classList.add('active');
            }
            
            this.showNormalState();
        }, 1000);
    }
};