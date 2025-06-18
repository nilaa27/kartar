document.addEventListener('DOMContentLoaded', () => {
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

    const loadingStatuses = [
        "Sedang memuat...",
        "Memuat...",
        "Selesai!"
    ];
    let currentStatusIndex = 0;
    let loadingInterval;


    // --- Fungsi Bantuan ---
    const updateSelectLabel = () => {
        const asalRwSelect = document.getElementById('asalRw');
        const asalRwLabel = document.querySelector('label[for="asalRw"]');
        if (asalRwSelect && asalRwLabel) {
            if (asalRwSelect.value !== "") {
                asalRwLabel.classList.add('active');
            } else {
                asalRwLabel.classList.remove('active');
            }
        }
    };

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
        if (!/^\d+$/.test(noKetua)) {
            alert('Nomor WhatsApp harus berupa angka!');
            document.getElementById('noKetua').focus();
            return false;
        }
        return true;
    };

    const showSuccessPopup = () => {
        successPopup.classList.add('show');
    };

    const hideSuccessPopup = () => {
        successPopup.classList.remove('show');
        setTimeout(() => successPopup.style.display = 'none', 400);
    };

    const buildWhatsAppMessage = (data) => {
        const { namaKetua, noKetua, namaTeam, asalRw, registDate } = data;

        let message = `*🌟 PENDAFTARAN TIM BARU 🌟*\n\n`;
        message += `\`\`\`📝 Detail Pendaftaran:\`\`\`\n`;
        message += `\`\`\`├─ Nama Captain      : ${namaKetua}\`\`\`\n`;
        message += `\`\`\`├─ No. WhatsApp      : ${noKetua}\`\`\`\n`; // Ini akan berisi nomor yang sudah diformat
        message += `\`\`\`├─ Nama Tim          : ${namaTeam}\`\`\`\n`;
        message += `\`\`\`└─ Domisili          : ${asalRw}\`\`\`\n\n`;
        message += `\`\`\`📅 Waktu Pendaftaran:\`\`\`\n`;
        message += `\`\`\`└─ ${registDate}\`\`\`\n\n`;
        message += `_Terima kasih atas pendaftaran tim Anda! Kami akan segera menghubungi Anda untuk langkah selanjutnya._\n`;
        message += `_Mohon menunggu konfirmasi dari Admin Kartar Dr. Soetomo._`;

        return encodeURIComponent(message);
    };

    const updateLoadingText = (isFinalStatus = false) => {
        loadingTextElement.classList.add('is-hidden');
        setTimeout(() => {
            if (isFinalStatus) {
                loadingTextElement.textContent = loadingStatuses[loadingStatuses.length - 1];
                currentStatusIndex = loadingStatuses.length - 1;
            } else {
                currentStatusIndex++;
                if (currentStatusIndex >= loadingStatuses.length) {
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
                }, 800);
            }, 500);
        }, totalProgressBarDuration);
    });

    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Mengambil nilai dari form
        const namaKetua = document.getElementById('namaKetua').value.trim();
        const noKetuaRaw = document.getElementById('noKetua').value.trim(); // Ambil nomor mentah
        const namaTeam = document.getElementById('namaTeam').value.trim();
        const asalRw = document.getElementById('asalRw').value;

        // [BARU] Ambil nilai kode negara dari dropdown
        const countryCode = document.getElementById('countryCode').value;

        // Validasi form dengan nomor mentah
        if (!validateForm(namaKetua, noKetuaRaw, namaTeam, asalRw)) {
            return;
        }
        
        // [BARU] Format nomor WhatsApp
        // 1. Hapus angka 0 di depan jika ada (misal: 0812... -> 812...)
        let formattedNumber = noKetuaRaw;
        if (formattedNumber.startsWith('0')) {
            formattedNumber = formattedNumber.substring(1);
        }

        // 2. Gabungkan kode negara dengan nomor yang sudah diformat
        const fullWhatsAppNumber = `${countryCode}${formattedNumber}`;


        // Atur tanggal pendaftaran
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

        // Buat objek data dengan nomor yang sudah lengkap
        const registrationData = {
            namaKetua,
            // [MODIFIKASI] Gunakan nomor yang sudah diformat
            noKetua: fullWhatsAppNumber,
            namaTeam,
            asalRw,
            registDate
        };

        const encodedMessage = buildWhatsAppMessage(registrationData);
        const whatsappLink = `https://wa.me/${WA_NUMBER}?text=${encodedMessage}`;

        window.open(whatsappLink, '_blank');

        showSuccessPopup();

        registrationForm.reset();

        // Reset semua label setelah submit
        document.querySelectorAll('.input-group label').forEach(label => {
            label.classList.remove('active');
        });
        updateSelectLabel(); // Pastikan label select juga di-reset
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
    if (asalRwSelect) {
        asalRwSelect.addEventListener('change', updateSelectLabel);
        asalRwSelect.addEventListener('focus', () => {
            const label = document.querySelector('label[for="asalRw"]');
            if(label) label.classList.add('active');
        });
        asalRwSelect.addEventListener('blur', updateSelectLabel);
        updateSelectLabel();
    }
});
