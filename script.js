document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const WA_NUMBER = '62881036684241'; // NOMOR WHATSAPP PENYELENGGARA

    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Mencegah form reload halaman

        // Ambil nilai dari input
        const namaKetua = document.getElementById('namaKetua').value;
        const noKetua = document.getElementById('noKetua').value;
        const namaTeam = document.getElementById('namaTeam').value;
        const asalRw = document.getElementById('asalRw').value;

        // Validasi sederhana (bisa dikembangkan)
        if (!namaKetua || !noKetua || !namaTeam || !asalRw) {
            alert('Mohon lengkapi semua kolom pendaftaran!');
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
            // Pastikan format waktu sesuai WIB, jika tidak, hilangkan timezoneName
            // Atau gunakan library seperti moment.js untuk handling timezone yang lebih robust
            timeZoneName: 'short'
        };
        const registDate = now.toLocaleDateString('id-ID', options);

        // Buat pesan WhatsApp dengan format yang diinginkan
        // %0A untuk baris baru
        const message = `Data Regist Pemain%0A` +
                        `————————————%0A` +
                        `Nama Ketua   : ${namaKetua}%0A` +
                        `No Ketua       : ${noKetua}%0A` +
                        `Nama Team    : ${namaTeam}%0A` +
                        `Asal Rw          : ${asalRw}%0A` +
                        `————————————%0A` +
                        `Regist Date  : ${registDate}`;

        // Encode pesan agar aman untuk URL
        const encodedMessage = encodeURIComponent(message);

        // Buat link WhatsApp
        const whatsappLink = `https://wa.me/${WA_NUMBER}?text=${encodedMessage}`;

        // Buka link WhatsApp di tab baru
        window.open(whatsappLink, '_blank');

        // Opsional: Reset form setelah berhasil kirim
        registrationForm.reset();
        alert('Pendaftaran berhasil! Anda akan diarahkan ke WhatsApp untuk konfirmasi.');
    });

    // Efek floating label untuk input
    document.querySelectorAll('.input-group input').forEach(input => {
        // Cek jika input sudah ada isinya saat load (misal dari autocomplete browser)
        if (input.value) {
            input.classList.add('has-value');
        }

        input.addEventListener('focus', () => {
            input.classList.add('has-value');
        });
        input.addEventListener('blur', () => {
            if (input.value === '') {
                input.classList.remove('has-value');
            }
        });
    });
});
