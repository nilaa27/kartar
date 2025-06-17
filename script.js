document.addEventListener('DOMContentLoaded', () => {
    // --- Konfigurasi & Elemen DOM ---
    const WA_NUMBER = '62881036683241';
    const registrationForm = document.getElementById('registrationForm');
    const successPopup = document.getElementById('success-popup');
    const closePopupButton = document.getElementById('close-popup');
    const loadingScreen = document.getElementById('loading-screen');
    const progressBarFill = document.querySelector('.progress-bar-fill');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const loadingTextElement = document.querySelector('.loading-text'); // Ambil elemen teks loading
    const bodyElement = document.body; // Ambil elemen body

    // Daftar status loading
    const loadingStatuses = [
        "Sedang memuat...",
        "Memuat...",
        "Selesai!"
    ];
    let currentStatusIndex = 0;
    let loadingInterval; // Untuk menyimpan ID interval


    // --- Fungsi Bantuan ---

    /**
     * Mengatur ulang posisi label pada elemen <select> 'Asal RW'.
     */
    const updateSelectLabel = () => {
        const asalRwSelect = document.getElementById('asalRw');
        const asalRwLabel = document.querySelector('label[for="asalRw"]');
        if (asalRwSelect.value !== "") {
            asalRwLabel.classList.add('active');
        } else {
            asalRwLabel.classList.remove('active');
        }
    };

    /**
     * Memvalidasi input formulir.
     * @returns {boolean} True jika validasi berhasil, false jika tidak.
     */
    const validateForm = (namaKetua, noKetua, namaTeam, asalRw) => {
        if (!namaKetua) {
            alert('Nama Ketua Tim tidak boleh kosong!');
            document.getElementById('namaKetua').focus();
            return false;
        }
        if (!namaTeam) {
            alert('Nama Tim tidak boleh kosong!');
            document.getElementById('namaTeam').focus();
            return false;
        }
        if (asalRw === "") {
            alert('Mohon pilih Asal RW!');
            document.getElementById('asalRw').focus();
            return false;
        }
        if (!noKetua) {
            alert('Nomor WhatsApp Ketua tidak boleh kosong!');
            document.getElementById('noKetua').focus();
            return false;
        }
        // Validasi format nomor telepon sederhana (hanya angka)
        if (!/^\d+$/.test(noKetua)) {
            alert('Nomor WhatsApp harus berupa angka!');
            document.getElementById('noKetua').focus();
            return false;
        }
        return true;
    };

    /**
     * Menampilkan pop-up keberhasilan pendaftaran.
     */
    const showSuccessPopup = () => {
        successPopup.classList.add('show');
    };

    /**
     * Menyembunyikan pop-up keberhasilan pendaftaran.
     */
    const hideSuccessPopup = () => {
        successPopup.classList.remove('show');
        setTimeout(() => successPopup.style.display = 'none', 400);
    };

    /**
     * Membangun pesan WhatsApp yang diformat dengan rapi.
     * @param {object} data - Objek berisi data pendaftaran.
     * @returns {string} Pesan WhatsApp yang sudah diformat.
     */
    const buildWhatsAppMessage = (data) => {
        const { namaKetua, noKetua, namaTeam, asalRw, registDate } = data;

        let message = `*🌟 PENDAFTARAN TIM BARU 🌟*\n\n`;
        message += `*📝 Detail Pendaftaran:*\n`;
        message += `├─ Nama Captain      : *${namaKetua}*\n`;
        message += `├─ No. WhatsApp      : *${noKetua}*\n`;
        message += `├─ Nama Tim          : *${namaTeam}*\n`;
        message += `└─ Domisili          : *${asalRw}*\n\n`;
        message += `*📅 Waktu Pendaftaran:*\n`;
        message += `└─ _${registDate}_\n\n`;
        message += `_Terima kasih atas pendaftaran tim Anda! Kami akan segera menghubungi Anda untuk langkah selanjutnya._\n`;
        message += `_Mohon menunggu konfirmasi dari Admin Kartar Dr. Soetomo._`;

        return encodeURIComponent(message);
    };

    /**
     * Mengganti teks loading dengan animasi fade-out dan fade-in.
     */
    const updateLoadingText = (isFinalStatus = false) => {
        // Sembunyikan teks saat ini
        loadingTextElement.classList.add('is-hidden'); // CSS opacity akan transisi

        setTimeout(() => {
            if (isFinalStatus) {
                loadingTextElement.textContent = loadingStatuses[loadingStatuses.length - 1]; // Set ke status terakhir
                currentStatusIndex = loadingStatuses.length - 1; // Pastikan index juga di-set
            } else {
                currentStatusIndex++;
                if (currentStatusIndex >= loadingStatuses.length) {
                    currentStatusIndex = 0; // Reset ke awal jika loop dibutuhkan
                }
                loadingTextElement.textContent = loadingStatuses[currentStatusIndex];
            }

            // Tampilkan teks baru
            loadingTextElement.classList.remove('is-hidden'); // Ini akan memicu fade-in

            // Hentikan interval jika sudah mencapai status terakhir dan dipanggil sebagai final
            if (isFinalStatus) {
                clearInterval(loadingInterval);
            }

        }, 300); // Durasi transisi opacity di CSS (0.3s)
    };


    // --- Inisialisasi dan Event Listeners ---

    // Sembunyikan loading screen setelah halaman dan semua aset dimuat
    window.addEventListener('load', () => {
        // Inisialisasi teks loading pertama
        loadingTextElement.textContent = loadingStatuses[0];
        loadingTextElement.classList.add('is-visible'); // Tampilkan teks awal dengan transisi

        // Mulai animasi progress bar
        progressBarFill.style.width = '100%';
        progressBarContainer.classList.add('loaded');

        // Total durasi progress bar adalah 4 detik
        const totalProgressBarDuration = 4000;
        // Waktu untuk setiap status teks (misal 2 detik per status untuk 3 status)
        // (total 3 status: 0, 1, 2. Butuh 2 kali pergantian)
        const statusChangeTiming = totalProgressBarDuration / (loadingStatuses.length - 1); // 4000ms / 2 = 2000ms (2 detik)

        // Perbarui teks loading secara berkala untuk 2 status pertama
        let statusUpdateCount = 0;
        loadingInterval = setInterval(() => {
            if (statusUpdateCount < loadingStatuses.length - 1) { // Hanya update untuk status 0 dan 1
                updateLoadingText();
                statusUpdateCount++;
            }
        }, statusChangeTiming);

        // Setelah progress bar selesai, pastikan teks menjadi "Selesai!" dan loading screen menghilang
        setTimeout(() => {
            clearInterval(loadingInterval); // Pastikan interval berhenti
            updateLoadingText(true); // Panggil sekali lagi untuk status final "Selesai!"

            // Tunggu sedikit setelah teks "Selesai!" muncul dan progress bar penuh, baru sembunyikan loading screen
            setTimeout(() => {
                loadingScreen.classList.add('hidden'); // Mulai animasi fadeOutBlurScale

                // Setelah loading screen benar-benar hilang, tambahkan kelas ke body
                // Durasi animasi fadeOutBlurScale adalah 0.8s
                setTimeout(() => {
                    bodyElement.classList.add('content-loaded'); // Tampilkan konten utama dengan animasi
                }, 800); // Tunggu sampai fadeOutBlurScale selesai

            }, 500); // Tambahan delay 500ms setelah "Selesai!" muncul dan progress bar penuh

        }, totalProgressBarDuration); // Total durasi progress bar (4 detik)
    });

    // Event listener untuk submit formulir
    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const namaKetua = document.getElementById('namaKetua').value.trim();
        const noKetua = document.getElementById('noKetua').value.trim();
        const namaTeam = document.getElementById('namaTeam').value.trim();
        const asalRw = document.getElementById('asalRw').value;

        if (!validateForm(namaKetua, noKetua, namaTeam, asalRw)) {
            return;
        }

        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
            timeZone: 'Asia/Jakarta'
        };
        const registDate = now.toLocaleDateString('id-ID', options);

        const registrationData = {
            namaKetua,
            noKetua,
            namaTeam,
            asalRw,
            registDate
        };

        const encodedMessage = buildWhatsAppMessage(registrationData);
        const whatsappLink = `https://wa.me/${WA_NUMBER}?text=${encodedMessage}`;

        window.open(whatsappLink, '_blank');

        showSuccessPopup();

        registrationForm.reset();
        updateSelectLabel();
    });

    closePopupButton.addEventListener('click', hideSuccessPopup);

    successPopup.addEventListener('click', (event) => {
        if (event.target === successPopup) {
            hideSuccessPopup();
        }
    });

    document.querySelectorAll('.input-group input').forEach(input => {
        if (!input.placeholder) {
            input.placeholder = ' ';
        }
    });

    const asalRwSelect = document.getElementById('asalRw');
    asalRwSelect.addEventListener('change', updateSelectLabel);
    asalRwSelect.addEventListener('focus', () => {
        document.querySelector('label[for="asalRw"]').classList.add('active');
    });
    asalRwSelect.addEventListener('blur', updateSelectLabel);
    updateSelectLabel();
});
