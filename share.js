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

    try {
        // 1. Convert Data URL to File
        const response = await fetch(imageData);
        const blob = await response.blob();
        const file = new File([blob], 'Peranan_Raya_Maukerja.png', { type: 'image/png' });

        // 2. Try Web Share API (Best for Mobile)
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'Peranan Raya Saya ✨',
                text: 'Cuba tengok peranan raya saya tahun ini! 🧧 #MaukerjaRaya',
            });
            return; // Success, sharing complete
        }

        // 3. Fallback for Desktop/Unsupported Browsers (Download + Redirect)
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

    } catch (err) {
        console.error('Sharing failed:', err);
        alert('Maaf, ada masalah teknikal semasa perkongsian.');
    }
}
