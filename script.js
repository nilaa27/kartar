document.addEventListener('DOMContentLoaded', () => {
    // --- Konfigurasi & Elemen DOM ---
    const WA_NUMBER = '62881036683241'; // Nomor WhatsApp tujuan
    const registrationForm = document.getElementById('registrationForm');
    const successPopup = document.getElementById('success-popup');
    const closePopupButton = document.getElementById('close-popup');
    const loadingScreen = document.getElementById('loading-screen');
    const progressBarFill = document.querySelector('.progress-bar-fill');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const loadingTextElement = document.querySelector('.loading-text');
    const bodyElement = document.body;
    const logoMiniSoccer = document.querySelector('.logo-mini-soccer'); // Ambil elemen logo mini soccer

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
     * Mengatur ulang posisi label pada elemen <select>.
     * Fungsi ini sekarang lebih umum untuk semua elemen select (RW dan RT).
     */
    const updateSelectLabel = () => {
        const selects = document.querySelectorAll('.input-group select');
        selects.forEach(select => {
            const label = document.querySelector(`label[for="${select.id}"]`);
            if (label) {
                if (select.value !== "") {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            }
        });
    };

    /**
     * Memvalidasi input formulir, sekarang termasuk Asal RT.
     * @param {string} namaKetua - Nama Captain.
     * @param {string} noKetua - Nomor WhatsApp Captain.
     * @param {string} namaTeam - Nama Tim.
     * @param {string} asalRw - Pilihan Asal RW.
     * @param {string} asalRt - Pilihan Asal RT.
     * @returns {boolean} True jika validasi berhasil, false jika tidak.
     */
    const validateForm = (namaKetua, noKetua, namaTeam, asalRw, asalRt) => {
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
        if (asalRt === "") {
            alert('Mohon pilih Asal RT!');
            document.getElementById('asalRt').focus();
            return false;
        }
        if (asalRw === "") {
            alert('Mohon pilih Asal RW!');
            document.getElementById('asalRw').focus();
            return false;
        }
        if (!noKetua) {
            alert('Nomor WhatsApp Captain tidak boleh kosong!');
            document.getElementById('noKetua').focus();
            return false;
        }
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
     * @param {object} data - Objek berisi data pendaftaran, sekarang dengan domisiliFormatted.
     * @returns {string} Pesan WhatsApp yang sudah diformat.
     */
    const buildWhatsAppMessage = (data) => {
        const { namaKetua, noKetua, namaTeam, domisiliFormatted, registDate } = data;
        const formattedRegistDate = registDate.replace('pukul', 'Pk.'); // Mengganti 'pukul' jadi 'Pk.' untuk lebih ringkas

        let message = `*🎉 Pendaftaran Tim Berhasil 🎉*\n\n`;

        message += `Halo *${namaKetua}*,\n`;
        message += `Tim Anda, *${namaTeam}* (${domisiliFormatted}), telah terdaftar!\n\n`;
        message += `========================\n`;
        message += `      ⚽️ *Detail Datamu* ⚽️\n`;
        message += `========================\n`;
        message += `\`\`\`\n`; // Pembuka blok teks
        message += `✨ Captain  : ${namaKetua}\n`;
        message += `📞 WA       : ${noKetua}\n`; // Diperbaiki dari noKetetu
        message += `📍 Domisili : ${domisiliFormatted}\n`;
        message += `🗓️ Waktu    : ${formattedRegistDate}\n`; // Menggunakan formattedRegistDate
        message += `========================\n`;
        message += `\`\`\`\n\n`; // Penutup blok teks
        message += `Admin akan segera menghubungi Anda untuk info turnamen.\n`;
        message += `Siapkan tim terbaikmu! 🚀\n\n`;

        message += `*Kartar Dr. Sutomo*`;

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
                currentStatusIndex = loadingStatuses.length - 1;
            } else {
                currentStatusIndex++;
                if (currentStatusIndex >= loadingStatuses.length - 1) {
                    currentStatusIndex = 0;
                }
                loadingTextElement.textContent = loadingStatuses[currentStatusIndex];
            }
            loadingTextElement.classList.remove('is-hidden');

            if (isFinalStatus) {
                clearInterval(loadingInterval);
            }
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
            }
        }, statusChangeTiming);

        setTimeout(() => {
            clearInterval(loadingInterval);
            updateLoadingText(true);

            setTimeout(() => {
                loadingScreen.classList.add('hidden');

                setTimeout(() => {
                    bodyElement.classList.add('content-loaded');
                    logoMiniSoccer.classList.add('animate-logo'); 
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
        const asalRw = document.getElementById('asalRw').value;
        const asalRt = document.getElementById('asalRt').value;

        if (!validateForm(namaKetua, noKetua, namaTeam, asalRw, asalRt)) {
            return;
        }

        const domisiliFormatted = `${asalRt.replace('RT ', 'rt ')}/${asalRw.replace('RW ', 'rw')}`;


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
            domisiliFormatted,
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

    // Inisialisasi placeholder untuk input text
    document.querySelectorAll('.input-group input').forEach(input => {
        if (!input.placeholder) {
            input.placeholder = ' ';
        }
    });

    // Event listeners untuk setiap elemen select (RW dan RT)
    document.querySelectorAll('.input-group select').forEach(select => {
        select.addEventListener('change', updateSelectLabel);
        select.addEventListener('focus', () => {
            const label = document.querySelector(`label[for="${select.id}"]`);
            if (label) label.classList.add('active');
        });
        select.addEventListener('blur', updateSelectLabel);
    });

    // Panggil sekali saat DOM dimuat untuk mengatur status label awal
    updateSelectLabel();
});
