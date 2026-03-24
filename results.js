document.addEventListener('DOMContentLoaded', () => {
    const rolesContainer = document.getElementById('roles-container');
    const envelopesContainer = document.getElementById('envelopes-container');
    const prizeModal = document.getElementById('prize-modal');
    const prizeAmountDisplay = document.getElementById('prize-amount-display');
    const claimForm = document.getElementById('claim-form');
    const prizeRevealView = document.getElementById('prize-reveal-view');
    const claimSuccessView = document.getElementById('claim-success-view');
    const downloadResultBtn = document.getElementById('download-result-btn');
    const exportRolesList = document.getElementById('export-roles-list');
    const screenshotTemplate = document.getElementById('screenshot-template');

    const urlParams = new URLSearchParams(window.location.search);
    const profileUrl = urlParams.get('url') || '';

    // 1. Setup Kad Raya Data
    const greeting = urlParams.get('greeting') || 'Selamat Hari Raya! Maaf Zahir dan Batin.';
    let userName = "Anda";
    if (profileUrl) {
        const parts = profileUrl.split('/');
        const potentialName = parts[parts.length - 1] || parts[parts.length - 2];
        if (potentialName && potentialName !== 'public' && potentialName !== 'profile') {
            userName = potentialName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
    }

    const displayNameEl = document.getElementById('display-name');
    const displayGreetingEl = document.getElementById('display-greeting');
    const exportNameEl = document.getElementById('export-name');
    const exportGreetingEl = document.getElementById('export-greeting');
    
    if (displayNameEl) displayNameEl.textContent = `${userName}`;
    if (displayGreetingEl) displayGreetingEl.textContent = `"${greeting}"`;
    if (exportNameEl) exportNameEl.textContent = `${userName}`;
    if (exportGreetingEl) exportGreetingEl.textContent = `"${greeting}"`;

    // 2. Duit Raya Prize Logic
    const commonPrizes = [0.30, 0.36, 0.41, 0.45, 0.48, 0.53, 0.58, 0.70, 0.69, 0.67, 0.74, 0.81, 0.89, 0.94, 1.23, 1.30, 1.40, 1.50, 1.78, 2.20, 2.50, 2.80, 3.00, 3.33, 3.60];
    const bigPrizes = [4.00, 4.40, 4.80, 5.10, 5.40, 5.60, 6.00, 7.00, 10.00, 12.50];
    let selectedPrize = null;

    function getRandomPrize() {
        const today = new Date().toISOString().split('T')[0];
        const lastBigPrizeDate = localStorage.getItem('lastBigPrizeDate');
        let pool = [...commonPrizes];
        if (lastBigPrizeDate !== today) { pool = pool.concat(bigPrizes); }
        const win = pool[Math.floor(Math.random() * pool.length)];
        if (bigPrizes.includes(win)) { localStorage.setItem('lastBigPrizeDate', today); }
        return win.toFixed(2);
    }

    if (envelopesContainer) {
        const envelopes = document.querySelectorAll('.envelope-item');
        const revealContainer = document.getElementById('prize-reveal-container');
        const blurredDisplay = document.getElementById('blurred-prize-display');

        envelopes.forEach(env => {
            env.addEventListener('click', function () {
                if (this.classList.contains('disabled')) return;
                envelopes.forEach(e => e.classList.add('disabled'));

                this.classList.add('shaking');

                setTimeout(() => {
                    this.classList.remove('shaking');
                    this.classList.add('opening');

                    setTimeout(() => {
                        selectedPrize = getRandomPrize();
                        blurredDisplay.textContent = `RM${selectedPrize}`;
                        revealContainer.classList.remove('hidden');

                        // Scroll to reveal section
                        revealContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 600);
                }, 1000);
            });
        });
    }

    // 3. Screenshot/Share & Unlock Logic
    const unlockBtn = document.getElementById('unlock-btn');
    if (unlockBtn) {
        unlockBtn.addEventListener('click', async () => {
            const originalText = unlockBtn.innerHTML;
            unlockBtn.disabled = true;
            unlockBtn.innerHTML = '🕒 Generating...';

            try {
                // 1. Generate Image
                // Kad Raya data is already populated on DOMContentLoaded

                screenshotTemplate.style.display = 'flex';
                screenshotTemplate.style.visibility = 'visible';
                const canvas = await html2canvas(screenshotTemplate, { useCORS: true, scale: 2 });
                screenshotTemplate.style.display = 'none';
                screenshotTemplate.style.visibility = 'hidden';

                const dataUrl = canvas.toDataURL('image/png');
                const blob = await (await fetch(dataUrl)).blob();
                const file = new File([blob], 'Peranan_Raya_Maukerja.png', { type: 'image/png' });

                // 2. Store Screenshot Data & Redirect to Share Screen
                localStorage.setItem('raya_result_screenshot', dataUrl);
                window.location.href = 'share.html';

                return; // Stop execution here as we are redirecting

                let shareSuccess = true;

                // 3. Reveal Prize
                if (shareSuccess) {
                    const blurredDisplay = document.getElementById('blurred-prize-display');
                    const unlockHint = document.getElementById('unlock-hint');

                    blurredDisplay.classList.add('prize-amount-revealed');
                    unlockBtn.innerHTML = '💰 Claim Duit Raya Sekarang!';
                    unlockBtn.classList.add('btn-whatsapp');
                    unlockHint.innerHTML = `💰 Tahniah! Anda dapat <strong>RM${selectedPrize}</strong> Duit Raya!`;

                    unlockBtn.onclick = () => {
                        prizeAmountDisplay.textContent = `RM${selectedPrize}`;
                        prizeModal.classList.remove('hidden');
                    };
                }

            } catch (err) {
                console.error('Action failed:', err);
                alert('Maaf, ada masalah teknikal. Sila cuba lagi!');
            } finally {
                unlockBtn.disabled = false;
                if (!unlockBtn.classList.contains('btn-whatsapp')) {
                    unlockBtn.innerHTML = originalText;
                }
            }
        });
    }


    function triggerDownload(dataUrl) {
        const link = document.createElement('a');
        link.download = 'Peranan_Raya_Maukerja.png';
        link.href = dataUrl;
        link.click();
    }

    // 4. Form Handling
    if (claimForm) {
        claimForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulation of submission
            const submitBtn = claimForm.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Menghantar...';

            setTimeout(() => {
                prizeRevealView.classList.add('hidden');
                claimSuccessView.classList.remove('hidden');
            }, 1500);
        });
    }

    // Festive Sparkles
    function createSparkles() {
        for (let i = 0; i < 20; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 1500);
        }
    }
    createSparkles();
});
