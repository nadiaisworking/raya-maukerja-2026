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
        const shareModal = document.getElementById('share-modal');
        const modalCancelBtn = document.getElementById('modal-cancel-btn');
        const modalShareBtn = document.getElementById('modal-share-btn');

        envelopes.forEach(env => {
            env.addEventListener('click', function () {
                if (this.classList.contains('disabled')) return;
                
                // Show the required step modal instead of abruptly revealing
                shareModal.classList.remove('hidden');
            });
        });

        if (modalCancelBtn) {
            modalCancelBtn.addEventListener('click', () => {
                shareModal.classList.add('hidden');
            });
        }

        if (modalShareBtn) {
            modalShareBtn.addEventListener('click', async () => {
                const originalText = modalShareBtn.innerHTML;
                modalShareBtn.disabled = true;
                modalShareBtn.innerHTML = '🕒 Generating...';

                try {
                    // Generate Image using html2canvas
                    screenshotTemplate.style.display = 'flex';
                    screenshotTemplate.style.visibility = 'visible';
                    await new Promise(resolve => setTimeout(resolve, 300));
                    const canvas = await html2canvas(screenshotTemplate, { useCORS: true, scale: 1.5 });
                    screenshotTemplate.style.display = 'none';
                    screenshotTemplate.style.visibility = 'hidden';

                    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                    
                    // Store Screenshot Data & Redirect to Share Screen
                    localStorage.setItem('raya_result_screenshot', dataUrl);
                    window.location.href = 'share.html';
                } catch (err) {
                    console.error('Action failed:', err);
                    alert('Maaf, ada masalah teknikal. Sila cuba lagi!');
                } finally {
                    modalShareBtn.disabled = false;
                    modalShareBtn.innerHTML = originalText;
                }
            });
        }
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
