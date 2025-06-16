document.addEventListener('DOMContentLoaded', () => {
    const progressFill = document.getElementById('progressFill');
    const progressIcon = document.getElementById('progressIcon');
    const loadingText = document.getElementById('loadingText');
    const loadingContainer = document.querySelector('.loading-container');
    const mainContent = document.querySelector('.main-content'); // Konten utama Anda

    let progress = 0;
    const totalSteps = 100;
    const simulationDuration = 2500; // Total durasi simulasi loading dalam milidetik (misal: 2.5 detik)
    const intervalTime = 50; // Update progress setiap 50ms

    const simulateLoading = () => {
        const interval = setInterval(() => {
            if (progress < totalSteps) {
                progress += (intervalTime / simulationDuration) * totalSteps;
                if (progress > totalSteps) progress = totalSteps;

                const progressBarWidth = (progress / totalSteps) * 100;
                progressFill.style.width = `${progressBarWidth}%`;
                loadingText.textContent = `${Math.round(progress)}%`;

                // Atur posisi ikon bola di ujung progress bar
                const iconOffset = 22.5; // Setengah dari lebar ikon (45px/2)
                const containerWidth = progressFill.parentElement.offsetWidth; // Lebar total progress bar container
                const fillWidthPixels = (progressBarWidth / 100) * containerWidth; // Lebar fill saat ini dalam piksel

                // Hitung posisi 'right' agar ikon berada di tengah ujung fill
                // Ikon harus bergerak dari kanan ke kiri seiring fill bertambah
                // Posisi 'right' harus negatif saat fill mencapai 100% (ikon di luar kanan)
                // dan positif saat fill kecil (ikon di dalam kiri)
                const iconRightPosition = containerWidth - fillWidthPixels - iconOffset; // Perhitungan dasar
                progressIcon.style.right = `${iconRightPosition}px`; // Menggunakan ini saja sudah cukup

                // Aktifkan atau nonaktifkan animasi putar bola
                if (progressBarWidth > 0 && progressBarWidth < 100) { // Hanya berputar saat bergerak
                    progressIcon.style.animationPlayState = 'running';
                } else {
                    progressIcon.style.animationPlayState = 'paused';
                }

            } else {
                clearInterval(interval);
                // Loading selesai
                setTimeout(() => {
                    loadingContainer.classList.add('fade-out'); // Mulai fade-out loading screen
                    setTimeout(() => {
                        loadingContainer.style.display = 'none'; // Sembunyikan setelah fade-out
                        mainContent.style.display = 'flex'; // Tampilkan konten utama (menggunakan flexbox)
                        mainContent.classList.add('show'); // Aktifkan transisi opacity konten utama
                        document.body.style.overflow = 'auto'; // Izinkan scroll di body setelah loading
                    }, 1000); // Tunggu sampai animasi fade-out loading selesai (sesuai transisi CSS)
                }, 500); // Jeda sebentar sebelum fade out loading
            }
        }, intervalTime);
    };

    simulateLoading(); // Panggil fungsi simulasi loading saat DOM siap

    // --- LOGIKA UNTUK FORM REGISTRASI ANDA ---
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Mencegah reload halaman
            const namaKetua = document.getElementById('namaKetua').value;
            const namaTeam = document.getElementById('namaTeam').value;
            const asalRw = document.getElementById('asalRw').value;
            const noKetua = document.getElementById('noKetua').value;

            // Validasi sederhana (Anda bisa menambahkan lebih banyak)
            if (!namaKetua || !namaTeam || !asalRw || !noKetua) {
                alert('Semua field harus diisi!');
                return;
            }

            // Contoh: Kirim data ke console atau ke API
            console.log('Data Registrasi Tim:');
            console.log('Nama Ketua:', namaKetua);
            console.log('Nama Tim:', namaTeam);
            console.log('Asal RW:', asalRw);
            console.log('No WhatsApp:', noKetua);

            // Di sini Anda bisa menambahkan logika untuk mengirim data ke server
            // Misalnya menggunakan fetch API:
            /*
            fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ namaKetua, namaTeam, asalRw, noKetua }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Registrasi berhasil!');
                    registrationForm.reset(); // Reset form
                } else {
                    alert('Registrasi gagal: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Terjadi kesalahan saat registrasi.');
            });
            */

            alert('Registrasi Tim berhasil!\n\nNama Ketua: ' + namaKetua + '\nNama Tim: ' + namaTeam + '\nAsal RW: ' + asalRw + '\nNo WhatsApp: ' + noKetua);
            registrationForm.reset(); // Reset form setelah berhasil
        });

        // Floating label adjustment for select
        const selectElement = document.getElementById('asalRw');
        if (selectElement) {
            selectElement.addEventListener('change', function() {
                const label = this.nextElementSibling; // Assuming label is the next sibling
                if (this.value !== "") {
                    label.classList.add('active'); // Add a class to move label up
                } else {
                    label.classList.remove('active'); // Remove class to move label back
                }
            });
            // Initial check for select if it already has a value (e.g., from browser autofill)
            if (selectElement.value !== "") {
                selectElement.nextElementSibling.classList.add('active');
            }
        }
    }
});
