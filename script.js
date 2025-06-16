document.addEventListener('DOMContentLoaded', () => {
    // --- Konfigurasi & Elemen DOM ---
    const WA_NUMBER = '62881036683241'; // Nomor WhatsApp penyelenggara
    const registrationForm = document.getElementById('registrationForm');
    const successPopup = document.getElementById('success-popup');
    const closePopupButton = document.getElementById('close-popup');
    const loadingScreen = document.getElementById('loading-screen');
    const progressBarFill = document.querySelector('.progress-bar-fill');
    const progressBarContainer = document.querySelector('.progress-bar-container');

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
        successPopup.style.display = 'flex';
        // Memberi sedikit penundaan untuk memastikan display:flex diterapkan sebelum transisi
        setTimeout(() => successPopup.classList.add('show'), 10);
    };

    /**
     * Menyembunyikan pop-up keberhasilan pendaftaran.
     */
    const hideSuccessPopup = () => {
        successPopup.classList.remove('show');
        // Menunggu transisi opacity selesai sebelum menyembunyikan sepenuhnya
        setTimeout(() => successPopup.style.display = 'none', 400);
    };

    /**
     * Membangun pesan WhatsApp yang diformat dengan rapi.
     * @param {object} data - Objek berisi data pendaftaran.
     * @returns {string} Pesan WhatsApp yang sudah diformat.
     */
    const buildWhatsAppMessage = (data) => {
        const { namaKetua, noKetua, namaTeam, asalRw, registDate } = data;

        // Gunakan karakter khusus untuk membuat teks tebal dan spasi di WhatsApp
        // *teks* untuk tebal, spasi non-breaking (&nbsp;) atau indentasi manual
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

        return encodeURIComponent(message); // Pastikan pesan di-encode untuk URL
    };

    // --- Inisialisasi dan Event Listeners ---

    // Sembunyikan loading screen setelah halaman dan semua aset dimuat
    window.addEventListener('load', () => {
        // Atur lebar progress bar menjadi 100%
        progressBarFill.style.width = '100%';
        // Tambahkan kelas 'loaded' untuk animasi bola muncul
        progressBarContainer.classList.add('loaded');

        // Setelah animasi progress bar selesai (sesuai transition CSS: 2 detik)
        setTimeout(() => {
            loadingScreen.classList.add('hidden'); // Memudar dan menyembunyikan
            // Opsional: Hapus elemen dari DOM setelah disembunyikan total
            // setTimeout(() => loadingScreen.remove(), 700);
        }, 2000); // Durasi ini harus >= durasi transition 'width' di CSS progress-bar-fill (2s)
    });

    // Event listener untuk submit formulir
    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Ambil nilai dari input
        const namaKetua = document.getElementById('namaKetua').value.trim();
        const noKetua = document.getElementById('noKetua').value.trim();
        const namaTeam = document.getElementById('namaTeam').value.trim();
        const asalRw = document.getElementById('asalRw').value;

        // Lakukan validasi
        if (!validateForm(namaKetua, noKetua, namaTeam, asalRw)) {
            return; // Hentikan proses jika validasi gagal
        }

        // Dapatkan tanggal dan jam saat ini
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
            timeZone: 'Asia/Jakarta' // Pastikan zona waktu WIB
        };
        const registDate = now.toLocaleDateString('id-ID', options);

        // Siapkan data untuk pesan WhatsApp
        const registrationData = {
            namaKetua,
            noKetua,
            namaTeam,
            asalRw,
            registDate
        };

        const encodedMessage = buildWhatsAppMessage(registrationData);
        const whatsappLink = `https://wa.me/${WA_NUMBER}?text=${encodedMessage}`;

        // Buka link WhatsApp di tab baru
        window.open(whatsappLink, '_blank');

        // Tampilkan pop-up keberhasilan
        showSuccessPopup();

        // Reset form setelah berhasil kirim
        registrationForm.reset();
        updateSelectLabel(); // Pastikan label select kembali ke posisi awal
    });

    // Event listener untuk tombol tutup pop-up
    closePopupButton.addEventListener('click', hideSuccessPopup);

    // Event listener untuk menutup pop-up saat klik di luar kontennya
    successPopup.addEventListener('click', (event) => {
        if (event.target === successPopup) {
            hideSuccessPopup();
        }
    });

    // --- Inisialisasi Floating Label (untuk input teks) ---
    document.querySelectorAll('.input-group input').forEach(input => {
        if (!input.placeholder) {
            input.placeholder = ' ';
        }
    });

    // --- Inisialisasi dan Event Listeners untuk Floating Label (untuk select) ---
    const asalRwSelect = document.getElementById('asalRw');
    asalRwSelect.addEventListener('change', updateSelectLabel);
    asalRwSelect.addEventListener('focus', () => {
        document.querySelector('label[for="asalRw"]').classList.add('active');
    });
    asalRwSelect.addEventListener('blur', updateSelectLabel);
    updateSelectLabel(); // Panggil saat DOMContentLoaded untuk inisialisasi awal
});
