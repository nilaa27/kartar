document.addEventListener('DOMContentLoaded', () => {
    // --- Bagian Loading Screen ---
    const progressFill = document.getElementById('progressFill');
    const progressIcon = document.getElementById('progressIcon');
    const loadingText = document.getElementById('loadingText');
    const loadingContainer = document.querySelector('.loading-container');
    const mainContent = document.querySelector('.main-content'); // Konten utama Anda

    let progress = 0;
    const totalSteps = 100;
    const simulationDuration = 2500; // Total durasi simulasi loading dalam milidetik (2.5 detik)
    const intervalTime = 50; // Update progress setiap 50ms

    const simulateLoading = () => {
        const interval = setInterval(() => {
            if (progress < totalSteps) {
                progress += (intervalTime / simulationDuration) * totalSteps;
                if (progress > totalSteps) progress = totalSteps;

                const progressBarWidth = (progress / totalSteps) * 100;
                progressFill.style.width = `${progressBarWidth}%`;
                loadingText.textContent = `${Math.round(progress)}%`;

                // Atur posisi ikon bola di ujung progress bar
                const iconOffset = 22.5; // Setengah dari lebar ikon (45px/2)
                const containerWidth = progressFill.parentElement.offsetWidth; // Lebar total progress bar container
                const fillWidthPixels = (progressBarWidth / 100) * containerWidth; // Lebar fill saat ini dalam piksel

                // Hitung posisi 'right' agar ikon berada di tengah ujung fill
                const iconRightPosition = containerWidth - fillWidthPixels - iconOffset;
                progressIcon.style.right = `${iconRightPosition}px`;

                // Aktifkan atau nonaktifkan animasi putar bola
                if (progressBarWidth > 0 && progressBarWidth < 100) {
                    progressIcon.style.animationPlayState = 'running';
                } else {
                    progressIcon.style.animationPlayState = 'paused';
                }

            } else {
                clearInterval(interval);
                // Loading selesai
                setTimeout(() => {
                    loadingContainer.classList.add('fade-out'); // Mulai fade-out loading screen
                    setTimeout(() => {
                        loadingContainer.style.display = 'none'; // Sembunyikan setelah fade-out
                        mainContent.style.display = 'flex'; // Tampilkan konten utama (menggunakan flexbox)
                        mainContent.classList.add('show'); // Aktifkan transisi opacity konten utama
                        document.body.style.overflow = 'auto'; // Izinkan scroll di body setelah loading
                    }, 1000); // Tunggu sampai animasi fade-out loading selesai (sesuai transisi CSS)
                }, 500); // Jeda sebentar sebelum fade out loading
            }
        }, intervalTime);
    };

    simulateLoading(); // Panggil fungsi simulasi loading saat DOM siap

    // --- Bagian Form Registrasi & Pengiriman WhatsApp ---
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Mencegah reload halaman

            const namaKetua = document.getElementById('namaKetua').value.trim();
            const namaTeam = document.getElementById('namaTeam').value.trim();
            const asalRw = document.getElementById('asalRw').value; // Value dari select tidak perlu trim
            const noKetua = document.getElementById('noKetua').value.trim();

            // Validasi Input
            if (!namaKetua || !namaTeam || !asalRw || !noKetua) {
                alert('Mohon lengkapi semua data pendaftaran!');
                return;
            }

            if (asalRw === "") { // Pastikan pengguna memilih RW
                alert('Mohon pilih Asal RW Anda.');
                return;
            }

            // Validasi format nomor WhatsApp (sederhana: hanya angka dan dimulai 62)
            // Anda bisa menggunakan regex yang lebih kompleks jika diperlukan
            if (!/^(62)[0-9]{8,15}$/.test(noKetua)) {
                alert('Format No WhatsApp tidak valid. Pastikan diawali 62 dan hanya angka (contoh: 6281234567890).');
                return;
            }

            // 1. Buat Pesan untuk WhatsApp
            const message = `Halo Admin Kartar Dr. Soetomo, saya ingin mendaftarkan tim saya:\n\n` +
                            `*Nama Ketua Tim:* ${namaKetua}\n` +
                            `*Nama Tim:* ${namaTeam}\n` +
                            `*Asal RW:* ${asalRw}\n` +
                            `*No WhatsApp Ketua:* ${noKetua}\n\n` +
                            `Mohon informasinya lebih lanjut mengenai pendaftaran. Terima kasih!`;

            // 2. Encode Pesan untuk URL
            const encodedMessage = encodeURIComponent(message);

            // 3. Tentukan Nomor WhatsApp Tujuan (Nomor Admin)
            // GANTI DENGAN NOMOR WHATSAPP ADMIN ANDA!
            // Pastikan formatnya: kode negara tanpa '+' atau '00' (misal 62 untuk Indonesia).
            const adminWhatsAppNumber = '62881036683241'; // <-- GANTI DENGAN NOMOR WA ADMIN YANG AKAN MENERIMA

            // 4. Buat URL WhatsApp
            const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodedMessage}`;

            // 5. Buka Link WhatsApp di tab/jendela baru
            window.open(whatsappUrl, '_blank');

            // 6. Beri tahu pengguna dan reset formulir
            alert('Pendaftaran berhasil! Anda akan diarahkan ke WhatsApp untuk mengirimkan detail pendaftaran ke admin.');
            registrationForm.reset(); // Reset form setelah berhasil dikirim
        });
    }

    // --- Floating label adjustment for select ---
    const selectElement = document.getElementById('asalRw');
    if (selectElement) {
        // Fungsi untuk mengupdate kelas label
        const updateSelectLabel = () => {
            const label = selectElement.nextElementSibling; // Asumsi label adalah sibling berikutnya
            if (selectElement.value !== "") {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        };

        selectElement.addEventListener('change', updateSelectLabel);
        // Panggil saat DOMContentLoaded untuk kasus autofill browser
        updateSelectLabel();
    }
});
