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
    const updateSelectLabel = (selectId) => {
        const selectElement = document.getElementById(selectId);
        const selectLabel = document.querySelector(`label[for="${selectId}"]`);
        if (selectElement && selectLabel) {
            if (selectElement.value !== "") {
                selectLabel.classList.add('active');
            } else {
                selectLabel.classList.remove('active');
            }
        }
    };

    // [MODIFIKASI] Menambahkan validasi untuk asalRt
    const validateForm = (namaKetua, noKetua, namaTeam, asalRt, asalRw) => {
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

    // [MODIFIKASI TOTAL] Mengganti format pesan WhatsApp sesuai template baru
    const buildWhatsAppMessage = (data) => {
        const { namaKetua, noKetua, namaTeam, asalRt, asalRw, registDate } = data;

        // Hilangkan bagian 'WIB' atau zona waktu lain dari tanggal untuk kebersihan
        const cleanDate = registDate.split(',').slice(0, 2).join(',');

        let message = `*🎉 Pendaftaran Tim Berhasil 🎉*\n\n`;
        message += `Halo *${namaKetua}*,\n`;
        message += `Tim Anda, *${namaTeam}* (${asalRt}/${asalRw}), telah terdaftar!\n\n`;
        message += `========================\n`;
        message += `      ⚽️ *Detail Datamu* ⚽️\n`;
        message += `========================\n`;
        message += "```\n"; // Tanda kutip pembuka untuk blok kode
        message += `✨ Captain  : ${namaKetua}\n`;
        message += `📞 WA       : ${noKetua}\n`;
        message += `📍 Domisili : ${asalRt}/${asalRw}\n`;
        message += `🗓️ Waktu    : ${cleanDate}\n`;
        message += "```\n"; // Tanda kutip penutup untuk blok kode
        message += `========================\n\n`;
        message += `Admin akan segera menghubungi Anda untuk info turnamen.\n`;
        message += `Siapkan tim terbaikmu! 🚀\n\n`;
        message += `*Kartar Dr. Sutomo*`;

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

        const namaKetua = document.getElementById('namaKetua').value.trim();
        const noKetuaRaw = document.getElementById('noKetua').value.trim();
        const namaTeam = document.getElementById('namaTeam').value.trim();
        // [BARU] Mengambil data RT dan RW
        const asalRt = document.getElementById('asalRt').value;
        const asalRw = document.getElementById('asalRw').value;
        const countryCode = document.getElementById('countryCode').value;

        // [MODIFIKASI] Memasukkan asalRt ke dalam validasi
        if (!validateForm(namaKetua, noKetuaRaw, namaTeam, asalRt, asalRw)) {
            return;
        }
        
        let formattedNumber = noKetuaRaw;
        if (formattedNumber.startsWith('0')) {
            formattedNumber = formattedNumber.substring(1);
        }
        const fullWhatsAppNumber = `${countryCode}${formattedNumber}`;

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
        const registDate = now.toLocaleString('id-ID', options);

        const registrationData = {
            namaKetua,
            noKetua: fullWhatsAppNumber,
            namaTeam,
            // [BARU] Menambahkan asalRt dan asalRw ke data
            asalRt,
            asalRw,
            registDate
        };

        const encodedMessage = buildWhatsAppMessage(registrationData);
        const whatsappLink = `https://wa.me/${WA_NUMBER}?text=${encodedMessage}`;

        window.open(whatsappLink, '_blank');
        showSuccessPopup();
        registrationForm.reset();

        document.querySelectorAll('.input-group label').forEach(label => {
            label.classList.remove('active');
        });
        updateSelectLabel('asalRt');
        updateSelectLabel('asalRw');
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

    // Menangani update label untuk select RT dan RW
    ['asalRt', 'asalRw'].forEach(id => {
        const selectElement = document.getElementById(id);
        if (selectElement) {
            selectElement.addEventListener('change', () => updateSelectLabel(id));
            selectElement.addEventListener('focus', () => {
                const label = document.querySelector(`label[for="${id}"]`);
                if(label) label.classList.add('active');
            });
            selectElement.addEventListener('blur', () => updateSelectLabel(id));
            updateSelectLabel(id); // Panggil saat awal load
        }
    });
});
