document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const WA_NUMBER = '62881036683241'; // NOMOR WHATSAPP PENYELENGGARA

    // Elemen pop-up
    const successPopup = document.getElementById('success-popup');
    const closePopupButton = document.getElementById('close-popup');

    // Elemen loading screen
    const loadingScreen = document.getElementById('loading-screen');
    const progressBarFill = document.querySelector('.progress-bar-fill');
    const progressBarContainer = document.querySelector('.progress-bar-container');

    // Fungsi untuk menyembunyikan loading screen
    const hideLoadingScreen = () => {
        // Atur lebar progress bar menjadi 100%
        progressBarFill.style.width = '100%';
        // Tambahkan kelas 'loaded' untuk animasi bola
        progressBarContainer.classList.add('loaded');

        // Setelah animasi progress bar selesai (sesuai transition CSS)
        setTimeout(() => {
            loadingScreen.classList.add('hidden'); // Memudar dan menyembunyikan
            // Opsional: Hapus elemen dari DOM setelah disembunyikan total
            // setTimeout(() => loadingScreen.remove(), 700);
        }, 2000); // Durasi ini harus >= durasi transition 'width' di CSS progress-bar-fill
    };

    // Panggil fungsi hideLoadingScreen setelah beberapa saat (simulasi pemuatan)
    // Anda bisa menunda ini sampai semua aset (gambar, font) benar-benar dimuat jika perlu
    window.addEventListener('load', () => {
        hideLoadingScreen();
    });


    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Mencegah form reload halaman

        // Ambil nilai dari input
        const namaKetua = document.getElementById('namaKetua').value.trim(); // Trim whitespace
        const noKetua = document.getElementById('noKetua').value.trim();
        const namaTeam = document.getElementById('namaTeam').value.trim();
        const asalRw = document.getElementById('asalRw').value;

        // Validasi
        if (!namaKetua) {
            alert('Nama Ketua Tim tidak boleh kosong!');
            document.getElementById('namaKetua').focus();
            return;
        }
        if (!namaTeam) {
            alert('Nama Tim tidak boleh kosong!');
            document.getElementById('namaTeam').focus();
            return;
        }
        if (asalRw === "") {
            alert('Mohon pilih Asal RW!');
            document.getElementById('asalRw').focus();
            return;
        }
        if (!noKetua) {
            alert('Nomor Ketua/Perwakilan tidak boleh kosong!');
            document.getElementById('noKetua').focus();
            return;
        }
        // Validasi format nomor telepon sederhana (misal harus angka)
        if (!/^\d+$/.test(noKetua)) {
             alert('Nomor Ketua/Perwakilan harus berupa angka!');
             document.getElementById('noKetua').focus();
             return;
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

        // Buat pesan WhatsApp dengan format yang diinginkan (ini yang akan dikirim ke WA)
        const waMessage = `Data Regist Pemain\n` + // \n untuk baris baru
                        `————————————\n` +
                        `Captain   : ${namaKetua}\n` +
                        `No Captain       : ${noKetua}\n` +
                        `Nama Team    : ${namaTeam}\n` +
                        `Asal Rw          : ${asalRw}\n` +
                        `————————————\n` +
                        `Regist Date  : ${registDate}`;

        // Encode pesan agar aman untuk URL
        const encodedMessage = encodeURIComponent(waMessage);

        // Buat link WhatsApp
        const whatsappLink = `https://wa.me/${WA_NUMBER}?text=${encodedMessage}`;

        // Buka link WhatsApp di tab baru
        window.open(whatsappLink, '_blank');

        // Tampilkan pop-up setelah berhasil membuka link WhatsApp
        successPopup.style.display = 'flex'; // Menampilkan pop-up container
        setTimeout(() => successPopup.classList.add('show'), 10); // Menambahkan class 'show' untuk animasi

        // Reset form setelah berhasil kirim
        registrationForm.reset();
        updateSelectLabel(); // Pastikan label select kembali ke posisi awal
    });

    // Menutup pop-up saat tombol 'Tutup' diklik
    closePopupButton.addEventListener('click', () => {
        successPopup.classList.remove('show');
        setTimeout(() => successPopup.style.display = 'none', 400); // Menunggu animasi selesai
    });

    // Menutup pop-up jika mengklik di luar konten pop-up
    successPopup.addEventListener('click', (event) => {
        if (event.target === successPopup) {
            successPopup.classList.remove('show');
            setTimeout(() => successPopup.style.display = 'none', 400); // Menunggu animasi selesai
        }
    });


    // Inisialisasi floating label untuk input teks
    document.querySelectorAll('.input-group input').forEach(input => {
        if (!input.placeholder) {
            input.placeholder = ' ';
        }
    });

    // Logika floating label untuk select (Asal RW)
    const asalRwSelect = document.getElementById('asalRw');
    const asalRwLabel = document.querySelector('label[for="asalRw"]');

    const updateSelectLabel = () => {
        if (asalRwSelect.value !== "") {
            // Memastikan label selalu "aktif" saat ada nilai
            asalRwLabel.classList.add('active');
        } else {
            // Menghapus "active" hanya jika nilai kosong dan tidak sedang fokus
            asalRwLabel.classList.remove('active');
        }
    };

    // Panggil saat halaman dimuat
    updateSelectLabel();
    // Panggil saat nilai select berubah
    asalRwSelect.addEventListener('change', updateSelectLabel);
    // Panggil saat select mendapatkan fokus (untuk mencegah label menutupi saat di-tab)
    asalRwSelect.addEventListener('focus', () => {
        asalRwLabel.classList.add('active');
    });
    // Panggil saat select kehilangan fokus
    asalRwSelect.addEventListener('blur', updateSelectLabel);
});
