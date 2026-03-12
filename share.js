document.addEventListener('DOMContentLoaded', () => {
    const imageData = localStorage.getItem('raya_result_screenshot');
    const images = document.querySelectorAll('.shared-image');
    
    if (imageData) {
        images.forEach(img => {
            img.src = imageData;
        });
    } else {
        // Fallback or redirect back if no image
        console.warn('No image data found in localStorage');
    }

    // Try to get username if available, or stay with default
    // For now we use "anda" as placeholder
});

async function shareTo(platform) {
    const imageData = localStorage.getItem('raya_result_screenshot');
    if (!imageData) {
        alert('Maaf, imej tidak dijumpai. Sila post semula dari halaman keputusan.');
        return;
    }

    const btn = event.target.closest('.btn-post');
    const originalText = btn.innerText;
    btn.innerText = 'Copying...';
    btn.disabled = true;

    try {
        // 1. Convert Data URL to Blob
        const response = await fetch(imageData);
        const blob = await response.blob();

        // 2. Copy to Clipboard (The "Magic" Step)
        if (navigator.clipboard && navigator.clipboard.write) {
            const data = [new ClipboardItem({ [blob.type]: blob })];
            await navigator.clipboard.write(data);
            
            // Show Feedback
            showToast('Imej disalin! Sekarang pilih Instagram & "Paste" ✨');
        } else {
            // Fallback for browsers without clipboard support
            const link = document.createElement('a');
            link.download = 'Peranan_Raya_Maukerja.png';
            link.href = imageData;
            link.click();
        }

        // 3. Immediate Redirect to Instagram
        setTimeout(() => {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                if (platform === 'story') {
                    window.location.href = 'instagram://story-camera';
                } else {
                    window.location.href = 'instagram://camera';
                }
            } else {
                window.open('https://www.instagram.com/', '_blank');
            }
        }, 1500);

    } catch (err) {
        console.error('Sharing failed:', err);
        showToast('Gagal menyalin imej. Sila cuba lagi.');
    } finally {
        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
        }, 2000);
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}
