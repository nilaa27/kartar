document.addEventListener('DOMContentLoaded', () => {
    const progressFill = document.getElementById('progressFill');
    const progressIcon = document.getElementById('progressIcon');
    const loadingText = document.getElementById('loadingText');
    const loadingContainer = document.querySelector('.loading-container');
    const mainContent = document.querySelector('.main-content');

    let progress = 0;
    const totalSteps = 100; // Jumlah langkah simulasi loading

    const simulateLoading = () => {
        const interval = setInterval(() => {
            if (progress < totalSteps) {
                progress += Math.floor(Math.random() * 5) + 1; // Menambah progress secara acak
                if (progress > totalSteps) progress = totalSteps;

                const progressBarWidth = (progress / totalSteps) * 100;
                progressFill.style.width = `${progressBarWidth}%`;
                loadingText.textContent = `${progress}%`;

                // Posisikan ikon bola di ujung progress bar
                // Asumsi lebar ikon 40px, kontainer 500px, dan padding/margin lainnya
                const iconRightPosition = (progressBarWidth / 100) * (progressFill.parentElement.offsetWidth - 20) - 20; // Sesuaikan offset jika perlu
                progressIcon.style.right = `${progressIcon.parentElement.offsetWidth - progressIcon.parentElement.clientWidth}px`; // Mengikuti akhir progressFill

            } else {
                clearInterval(interval);
                // Loading selesai, sembunyikan loading screen dan tampilkan konten utama
                setTimeout(() => {
                    loadingContainer.classList.add('fade-out');
                    setTimeout(() => {
                        loadingContainer.style.display = 'none';
                        mainContent.style.display = 'block'; // Tampilkan konten utama
                    }, 1000); // Tunggu sampai animasi fade-out selesai
                }, 500); // Jeda sebentar sebelum fade out
            }
        }, 100); // Update progress setiap 100ms
    };

    simulateLoading();
});
