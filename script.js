document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const WA_NUMBER = '62881036683241'; // NOMOR WHATSAPP PENYELENGGARA

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
                        `Nama Ketua   : ${namaKetua}\n` +
                        `No Ketua       : ${noKetua}\n` +
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

        // Reset form setelah berhasil kirim
        registrationForm.reset();
        updateSelectLabel(); // Pastikan label select kembali ke posisi awal

        // Tampilkan alert yang lebih informatif dan rapi
        alert('Pendaftaran berhasil! Anda akan diarahkan ke WhatsApp untuk konfirmasi. Pesan yang akan dikirim:\n\n' + waMessage);
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
            asalRwLabel.classList.add('active');
        } else {
            asalRwLabel.classList.remove('active');
        }
    };

    updateSelectLabel();
    asalRwSelect.addEventListener('change', updateSelectLabel);
    asalRwSelect.addEventListener('focus', updateSelectLabel);
    asalRwSelect.addEventListener('blur', updateSelectLabel);
});
