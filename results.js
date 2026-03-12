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

    // 1. Generate Enriched Roles
    let roles = [];
    if (profileUrl.toLowerCase().includes('engineer') || profileUrl.toLowerCase().includes('it')) {
        roles = [
            { title: "Betulkan Wifi Rumah", desc: "Anda jadi hero tech keluarga bila internet 'selow' pagi Raya ni! 📶", icon: "⚡" },
            { title: "Set-up TV Pintar Tokwan", desc: "Tolong Tokwan buka YouTube cari lagu Raya lama-lama. 📺", icon: "👴" },
            { title: "Mangsa Soalan 'Kenapa Phone Mak Lambat?'", desc: "Sabar jelah delete cache beribu gambar WhatsApp mak. 📱", icon: "🫠" }
        ];
    } else {
        roles = [
            { title: "Bakar Lemang Tengah Malam", desc: "Anda jadi hero dapur raya yang gigih jaga api malam ni! 🔥", icon: "🪵" },
            { title: "Tukang Beli Ais Batu", desc: "Bila air balang tak sejuk, anda lah yang kena rempit ke kedai. 🧊", icon: "🏍️" },
            { title: "Jaga Kucing Time Orang Beraya", desc: "Tugas paling mencabar: pastikan Oyen tak lari keluar rumah. 🐈", icon: "🐾" }
        ];
    }

    if (rolesContainer) {
        rolesContainer.innerHTML = '';
        roles.forEach((role, index) => {
            const card = document.createElement('div');
            card.className = 'role-card-festive';
            card.style.animationDelay = `${index * 0.3}s`;
            card.innerHTML = `
                <div class="role-body">
                    <h3 class="role-title-new">${role.title} ${role.icon}</h3>
                    <p class="role-desc-new">${role.desc}</p>
                </div>
            `;
            rolesContainer.appendChild(card);
        });
    }

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
            env.addEventListener('click', function() {
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
                if (exportRolesList) {
                    const medals = ["🥇", "🥈", "🥉"];
                    exportRolesList.innerHTML = roles.map((role, index) => `
                        <div class="export-role-card">
                            <div class="export-rank">${medals[index] || "✨"}</div>
                            <div class="export-role-content">
                                <h3 class="export-role-title">${role.title}</h3>
                                <p class="export-role-desc">${role.desc}</p>
                            </div>
                        </div>
                    `).join('');
                }

                screenshotTemplate.style.display = 'flex';
                screenshotTemplate.style.visibility = 'visible';
                const canvas = await html2canvas(screenshotTemplate, { useCORS: true, scale: 2 });
                screenshotTemplate.style.display = 'none';
                screenshotTemplate.style.visibility = 'hidden';

                const dataUrl = canvas.toDataURL('image/png');
                const blob = await (await fetch(dataUrl)).blob();
                const file = new File([blob], 'Peranan_Raya_Maukerja.png', { type: 'image/png' });

                // 2. Trigger Download & Redirect to Instagram
                triggerDownload(dataUrl);
                
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile) {
                    window.location.href = 'instagram://camera';
                } else {
                    window.open('https://www.instagram.com/', '_blank');
                }
                
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
