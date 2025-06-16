document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const WA_NUMBER = '62881036684241'; // NOMOR WHATSAPP PENYELENGGARA

    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Mencegah form reload halaman

        // Ambil nilai dari input
        const namaKetua = document.getElementById('namaKetua').value;
        const noKetua = document.getElementById('noKetua').value;
        const namaTeam = document.getElementById('namaTeam').value;
        const asalRw = document.getElementById('asalRw').value; // Mengambil nilai dari select

        // Validasi sederhana (bisa dikembangkan)
        if (!namaKetua || !noKetua || !namaTeam || !asalRw) {
            alert('Mohon lengkapi semua kolom pendaftaran!');
            return;
        }

        // Validasi khusus untuk select Asal RW
        if (asalRw === "") { // Jika opsi 'Pilih RW' masih terpilih
            alert('Mohon pilih Asal RW!');
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
            timeZoneName: 'short'
        };
        // Format tanggal dan waktu untuk locale Indonesia (Surabaya, WIB)
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
        // Setelah reset, pastikan label kembali ke posisi awal jika input kosong
        document.querySelectorAll('.input-group input').forEach(input => {
            input.classList.remove('has-value');
        });
        document.getElementById('asalRw').value = ""; // Reset select ke opsi default

        alert('Pendaftaran berhasil! Anda akan diarahkan ke WhatsApp untuk konfirmasi.');
    });

    // Efek floating label untuk input (teks dan tel)
    document.querySelectorAll('.input-group input').forEach(input => {
        // Fungsi untuk memeriksa nilai input dan menambahkan/menghapus kelas 'has-value'
        const checkValue = () => {
            if (input.value !== '') {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        };

        // Panggil saat DOMContentLoaded (saat halaman pertama kali dimuat)
        // Ini menangani kasus auto-fill browser
        checkValue();

        // Panggil saat event 'input' (saat mengetik atau menghapus teks)
        input.addEventListener('input', checkValue);

        // Panggil saat fokus
        input.addEventListener('focus', () => {
            input.classList.add('has-value'); // Pastikan label naik saat fokus
        });

        // Panggil saat blur (keluar dari input)
        input.addEventListener('blur', checkValue);
    });

    // Untuk elemen select (Asal RW), label harus selalu aktif jika tidak di "Pilih RW"
    const asalRwSelect = document.getElementById('asalRw');
    const asalRwLabel = document.querySelector('label[for="asalRw"]');

    const updateSelectLabel = () => {
        if (asalRwSelect.value !== "") {
            asalRwLabel.classList.add('active'); // Tambahkan kelas 'active' untuk label
        } else {
            asalRwLabel.classList.remove('active'); // Hapus kelas 'active'
        }
    };

    // Set kondisi awal label saat halaman dimuat
    updateSelectLabel();

    // Perbarui label saat nilai select berubah
    asalRwSelect.addEventListener('change', updateSelectLabel);

    // Perbarui label saat select mendapatkan fokus (opsional, tapi bagus untuk konsistensi)
    asalRwSelect.addEventListener('focus', () => {
        asalRwLabel.classList.add('active');
    });

    // Jika select kehilangan fokus dan kembali ke default "Pilih RW"
    asalRwSelect.addEventListener('blur', updateSelectLabel);
});
