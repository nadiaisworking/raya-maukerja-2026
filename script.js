document.addEventListener('DOMContentLoaded', () => {
    const scanBtn = document.getElementById('scan-btn');
    const landingState = document.getElementById('landing-state');
    const loadingState = document.getElementById('loading-state');
    const profileUrlInput = document.getElementById('profile-url');

    if (scanBtn) {
        scanBtn.addEventListener('click', async () => {
            const url = profileUrlInput.value.trim();
            
            if (!url) {
                alert('Sila masukkan pautan profil Maukerja anda terlebih dahulu!');
                profileUrlInput.focus();
                return;
            }

            // 1. Hide Landing Content
            if (landingState) landingState.classList.add('hidden');
            
            // 2. Show Loading State
            if (loadingState) loadingState.classList.remove('hidden');

            // 3. Fake AI Scan Delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // 4. Redirect to Results Page
            window.location.href = `results.html?url=${encodeURIComponent(url)}`;
        });
    }

    // Festive Sparkles Effect
    function createSparkles() {
        for (let i = 0; i < 30; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const tx = (Math.random() - 0.5) * 200;
            const ty = (Math.random() - 0.5) * 200;
            
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            sparkle.style.setProperty('--tx', tx + 'px');
            sparkle.style.setProperty('--ty', ty + 'px');
            
            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 1500);
        }
    }

    createSparkles();

    // Duit Raya Notification Logic
    const malayNames = [
        "Ahmad", "Siti", "Nurul", "Faiz", "Zul", "Nadia", "Irfan", "Farah", 
        "Haziq", "Amira", "Syakir", "Aina", "Khairul", "Balqis", "Hafiz",
        "Zulaikha", "Firdaus", "Anis", "Ridwan", "Batrisyia"
    ];

    function showRayaNotification() {
        const container = document.querySelector('.hero-sparkle-wrapper');
        if (!container) return; // Only show on landing page

        const name = malayNames[Math.floor(Math.random() * malayNames.length)];
        const amount = (Math.random() * (15 - 0.3) + 0.3).toFixed(2);
        
        const notification = document.createElement('div');
        notification.className = 'raya-notification';
        notification.innerHTML = `💰 <span>${name}</span> dapat Duit Raya <strong>RM${amount}</strong>!`;
        
        container.appendChild(notification);

        // Slide in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Slide out and remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 600); // Wait for transition to finish
        }, 8000); // Visible for 8 seconds

        // Schedule next notification
        const nextDelay = Math.floor(Math.random() * (8000 - 5000) + 5000);
        setTimeout(showRayaNotification, nextDelay);
    }

    // Start the notification loop immediately
    setTimeout(showRayaNotification, 100);

    // Background Music Logic
    const bgMusic = document.getElementById('bg-music');
    const muteToggle = document.getElementById('mute-toggle');
    const muteIcon = muteToggle ? muteToggle.querySelector('.mute-icon') : null;

    if (bgMusic && muteToggle) {
        // Load initial mute state
        const isMuted = localStorage.getItem('raya-music-muted') === 'true';
        bgMusic.muted = isMuted;
        if (muteIcon) muteIcon.textContent = isMuted ? '' : '🔊';

        // Attempt to play music immediately
        const startMusic = () => {
            bgMusic.play().then(() => {
                // Success! remove the interaction listeners
                document.removeEventListener('click', startMusic);
                document.removeEventListener('touchstart', startMusic);
            }).catch(error => {
                console.log("Autoplay prevented. Waiting for user interaction.");
            });
        };

        // Browser autoplay bypass: try playing on first click/touch
        document.addEventListener('click', startMusic);
        document.addEventListener('touchstart', startMusic);
        
        // Initial attempt
        startMusic();

        muteToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent startMusic from firing if it's the first click
            const newMutedState = !bgMusic.muted;
            bgMusic.muted = newMutedState;
            localStorage.setItem('raya-music-muted', newMutedState);
            if (muteIcon) muteIcon.textContent = newMutedState ? '🔇' : '🔊';
            
            // If we're unmuting and it's not playing, try to play
            if (!newMutedState && bgMusic.paused) {
                bgMusic.play();
            }
        });
    }
});
