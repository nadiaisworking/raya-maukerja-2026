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
    btn.innerText = 'Sharing...';
    btn.disabled = true;

    try {
        // 1. Convert Data URL to Blob
        const response = await fetch(imageData);
        const blob = await response.blob();
        const file = new File([blob], 'Peranan_Raya_Maukerja.png', { type: 'image/png' });

        // 2. Direct Share (Best for Mobile)
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'Peranan Raya Saya ✨'
            });
            // On successful share, user is already in the share sheet or redirected
        } else {
            // Fallback for Desktop/Unsupported (Download + Link)
            const link = document.createElement('a');
            link.download = 'Peranan_Raya_Maukerja.png';
            link.href = imageData;
            link.click();
            
            setTimeout(() => {
                window.open('https://www.instagram.com/', '_blank');
            }, 1000);
        }

    } catch (err) {
        console.error('Sharing failed:', err);
        // User might have cancelled the share sheet, which is fine
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
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
