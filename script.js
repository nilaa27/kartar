document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const WA_NUMBER = '+62881036684241'; // NOMOR WHATSAPP PENYELENGGARA

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
            timeZone: 'Asia/Jakarta' // Pastikan zona waktu WIB (Surabaya)
        };
        const registDate = now.toLocaleDateString('id-ID', options);

        // Buat pesan WhatsApp dengan format yang diinginkan
        const message = `Data Regist Pemain%0A` +
                        `————————————%0A` +
                        `Nama Ketua   : ${namaKetua}%0A` +
                        `No Ketua       : ${noKetua}%0A` +
                        `Nama Team    : ${namaTeam}%0A` +
                        `Asal Rw          : ${asalRw}%0A` +
                        `————————————%0A` +
                        `Regist Date  : ${registDate}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappLink = `https://wa.me/${WA_NUMBER}?text=${encodedMessage}`;

        // Buka link WhatsApp di tab baru
        window.open(whatsappLink, '_blank');

        // Reset form setelah berhasil kirim
        registrationForm.reset();
        // Pastikan label untuk select kembali ke posisi awal jika di-reset ke "Pilih RW"
        updateSelectLabel();

        alert('Pendaftaran berhasil! Anda akan diarahkan ke WhatsApp untuk konfirmasi.');
    });

    // Inisialisasi floating label untuk input teks
    document.querySelectorAll('.input-group input').forEach(input => {
        // Panggil saat halaman dimuat untuk menangani autocomplete browser
        // Event 'input' dan 'focus' tidak lagi perlu manipulasi kelas 'has-value' karena CSS sudah pakai :not(:placeholder-shown)
        // Cukup pastikan placeholder ada untuk memicu CSS
        if (!input.placeholder) {
            input.placeholder = ' '; // Pastikan ada placeholder, penting untuk :not(:placeholder-shown)
        }
    });

    // Logika floating label untuk select (Asal RW)
    const asalRwSelect = document.getElementById('asalRw');
    const asalRwLabel = document.querySelector('label[for="asalRw"]');

    const updateSelectLabel = () => {
        if (asalRwSelect.value !== "") {
            asalRwLabel.classList.add('active'); // CSS akan membuat label naik
        } else {
            asalRwLabel.classList.remove('active'); // CSS akan membuat label turun
        }
    };

    // Set kondisi awal label saat halaman dimuat
    updateSelectLabel();

    // Perbarui label saat nilai select berubah
    asalRwSelect.addEventListener('change', updateSelectLabel);
    asalRwSelect.addEventListener('focus', updateSelectLabel);
    asalRwSelect.addEventListener('blur', updateSelectLabel);
});
