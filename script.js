Document.addEventListener('DOMContentLoaded', () => {
    // --- Konfigurasi & Elemen DOM ---
    const WA_NUMBER = '62881036683241';
    const registrationForm = document.getElementById('registrationForm');
    const successPopup = document.getElementById('success-popup');
    const closePopupButton = document.getElementById('close-popup');
    const loadingScreen = document.getElementById('loading-screen');
    const progressBarFill = document.querySelector('.progress-bar-fill');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const loadingTextElement = document.querySelector('.loading-text');
    const bodyElement = document.body;

    // Daftar status loading
    const loadingStatuses = [
        "Sedang memuat...",
        "Memuat...",
        "Selesai!"
    ];
    let currentStatusIndex = 0;
    let loadingInterval;


    // --- Fungsi Bantuan ---

    /**
     * Mengatur ulang posisi label pada elemen <select> 'Domisili'.
     */
    const updateSelectLabel = () => {
        const domisiliSelect = document.getElementById('domisili'); // Mengacu ke ID 'domisili'
        const domisiliLabel = document.querySelector('label[for="domisili"]'); // Mengacu ke 'for="domisili"'

        // Logika floating label untuk select
        if (domisiliSelect.value !== "") {
            domisiliLabel.classList.add('active');
        } else {
            domisiliLabel.classList.remove('active');
        }
    };

    /**
     * Memvalidasi input formulir.
     * @returns {boolean} True jika validasi berhasil, false jika tidak.
     */
    const validateForm = (namaKetua, noKetua, namaTeam, domisili) => { // Parameter diganti
        if (!namaKetua) {
            alert('Nama Captain tidak boleh kosong!');
            document.getElementById('namaKetua').focus();
            return false;
        }
        if (!namaTeam) {
            alert('Nama Tim tidak boleh kosong!');
            document.getElementById('namaTeam').focus();
            return false;
        }
        if (domisili === "") { // Diganti
            alert('Mohon pilih Domisili!'); // Teks alert diganti
            document.getElementById('domisili').focus(); // Diganti
            return false;
        }
        if (!noKetua) {
            alert('Nomor WhatsApp Captain tidak boleh kosong!');
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
        setTimeout(() => successPopup.classList.add('show'), 10);
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
        const { namaKetua, noKetua, namaTeam, domisili, registDate } = data; // Diganti

        let message = `*🌟 PENDAFTARAN TIM BARU 🌟*\n\n`;

        message += `\`\`\`📝 Detail Pendaftaran:\`\`\`\n`;
        message += `\`\`\`├─ Nama Captain      : ${namaKetua}\`\`\`\n`;
        message += `\`\`\`├─ No. WhatsApp      : ${noKetua}\`\`\`\n`;
        message += `\`\`\`├─ Nama Tim          : ${namaTeam}\`\`\`\n`;
        message += `\`\`\`└─ Domisili          : ${domisili}\`\`\`\n\n`; // Diganti

        message += `\`\`\`📅 Waktu Pendaftaran:\`\`\`\n`;
        message += `\`\`\`└─ ${registDate}\`\`\`\n\n`;

        message += `_Terima kasih atas pendaftaran tim Anda! Kami akan segera menghubungi Anda untuk langkah selanjutnya._\n`;
        message += `_Mohon menunggu konfirmasi dari Admin Kartar Dr. Soetomo._`;

        return encodeURIComponent(message);
    };

    /**
     * Mengganti teks loading dengan animasi fade-out dan fade-in.
     */
    const updateLoadingText = (isFinalStatus = false) => {
        loadingTextElement.classList.add('is-hidden');

        setTimeout(() => {
            if (isFinalStatus) {
                loadingTextElement.textContent = loadingStatuses[loadingStatuses.length - 1];
            } else {
                currentStatusIndex = (currentStatusIndex + 1) % (loadingStatuses.length - 1);
                loadingTextElement.textContent = loadingStatuses[currentStatusIndex];
            }
            loadingTextElement.classList.remove('is-hidden');
        }, 300);
    };


    // --- Inisialisasi dan Event Listeners ---

    // Sembunyikan loading screen setelah halaman dan semua aset dimuat
    window.addEventListener('load', () => {
        loadingTextElement.textContent = loadingStatuses[0];
        loadingTextElement.classList.add('is-visible');

        progressBarFill.style.width = '100%';
        progressBarContainer.classList.add('loaded');

        const totalProgressBarDuration = 4000;
        const statusChangeTiming = totalProgressBarDuration / (loadingStatuses.length - 1);

        let statusUpdateCount = 0;
        loadingInterval = setInterval(() => {
            if (statusUpdateCount < loadingStatuses.length - 1) {
                updateLoadingText();
                statusUpdateCount++;
            } else {
                clearInterval(loadingInterval);
            }
        }, statusChangeTiming);

        setTimeout(() => {
            clearInterval(loadingInterval);
            updateLoadingText(true);

            setTimeout(() => {
                loadingScreen.classList.add('hidden');

                setTimeout(() => {
                    bodyElement.classList.add('content-loaded');
                }, 800);
            }, 500);
        }, totalProgressBarDuration);
    });

    // Event listener untuk submit formulir
    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const namaKetua = document.getElementById('namaKetua').value.trim();
        const noKetua = document.getElementById('noKetua').value.trim();
        const namaTeam = document.getElementById('namaTeam').value.trim();
        const domisili = document.getElementById('domisili').value; // Diganti

        if (!validateForm(namaKetua, noKetua, namaTeam, domisili)) { // Diganti
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
            domisili, // Diganti
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
        if (input.value.trim() !== '') {
            input.nextElementSibling.classList.add('active');
        }
    });

    // Event listeners untuk select Domisili
    const domisiliSelect = document.getElementById('domisili'); // Diganti
    domisiliSelect.addEventListener('change', updateSelectLabel);
    domisiliSelect.addEventListener('focus', () => {
        document.querySelector('label[for="domisili"]').classList.add('active'); // Diganti
    });
    domisiliSelect.addEventListener('blur', updateSelectLabel);
    updateSelectLabel();
});
