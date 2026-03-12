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

function shareTo(platform) {
    const imageData = localStorage.getItem('raya_result_screenshot');
    if (!imageData) {
        alert('Maaf, imej tidak dijumpai. Sila post semula dari halaman keputusan.');
        return;
    }

    // Standard behavior: Download image and open Instagram
    const link = document.createElement('a');
    link.download = 'Peranan_Raya_Maukerja.png';
    link.href = imageData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Give a small delay before redirecting to Instagram
    setTimeout(() => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            // Instagram deep links
            if (platform === 'story') {
                window.location.href = 'instagram://story-camera';
            } else {
                window.location.href = 'instagram://camera';
            }
        } else {
            window.open('https://www.instagram.com/', '_blank');
        }
    }, 1000);
}
