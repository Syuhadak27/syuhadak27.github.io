    const TEST_MODE = false; // ubah ke false saat live

    document.addEventListener("DOMContentLoaded", () => {
      // Tambahkan info domain di footer
      const domain = window.location.hostname;
      document.getElementById("domainInfo").textContent = "Akses via web browser : " + domain;

      // Tampilkan username login
      document.getElementById("greeting").textContent = "Login sebagai: 👤" + user;

      // Ambil data reset terakhir
      let lastReset = localStorage.getItem("lastReset");
      let lastResetMs = localStorage.getItem("lastResetMs");

      // Kalau belum ada, inisialisasi sekarang
      if (!lastReset || !lastResetMs) {
        const now = new Date();
        lastReset = "Terakhir direset pada: " + now.toLocaleString("id-ID", {
          dateStyle: "full",
          timeStyle: "short"
        });
        lastResetMs = Date.now().toString();

        localStorage.setItem("lastReset", lastReset);
        localStorage.setItem("lastResetMs", lastResetMs);
      }

      // Tampilkan timestamp
      document.getElementById("resetTimestamp").textContent = lastReset;

      // Hitung selisih waktu
      const now = Date.now();
      let diff = now - parseInt(lastResetMs, 10);

      if (TEST_MODE) {
        diff = 25 * 60 * 60 * 1000; // paksa seolah-olah sudah 25 jam
      }

      console.log("DEBUG lastResetMs:", lastResetMs);
      console.log("DEBUG diff (ms):", diff);

      // Jika lebih dari 24 jam → tampilkan warning
      if (diff > 24 * 60 * 60 * 1000) {
        document.getElementById("resetWarning").style.display = "block";
        Swal.fire({
  icon: 'warning',
  title: 'Data Kadaluarsa',
  text: '⚠️Tekan Tombol Reset untuk update database ',
  confirmButtonText: 'Okay',
  confirmButtonColor: '#3085d6',
  background: '#fff',
  color: '#333'
});
      }
    });

    // Tombol logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    });


    // Fungsi pencarian dasar
    function handleEnter(event) {
      if (event.key === "Enter") cari();
    }

    let debounceTimeout;
    document.getElementById("searchInput").addEventListener("input", function () {
      clearTimeout(debounceTimeout);
      const query = this.value.trim();
      const warningText = document.getElementById("warningText");
      const resultContainer = document.getElementById("result");

      if (query === "") {
        warningText.style.display = "none";
        resultContainer.innerHTML = "";
        return;
      }

      if (query.length < 3) {
        warningText.style.display = "block";
        resultContainer.innerHTML = "";
        return;
      }

      warningText.style.display = "none";
      debounceTimeout = setTimeout(() => {
        cari();
      }, 300);
    });
    
    function confirmReset() {
      Swal.fire({
        title: 'Yakin mau reset data?',
        text: "Semua data lokal akan dihapus dan diperbarui!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, reset!',
        cancelButtonText: 'Batal',
        background: '#fff',
        color: '#333'
      }).then((result) => {
        if (result.isConfirmed) {
          // panggil fungsi reset yang ada di reset.js
          Reset_semua_Data();
        }
      });
    }

    // Placeholder fungsi
    function cari() { console.log("Mencari..."); }
    function clearSearch() { document.getElementById('searchInput').value = ''; }
    function search_inout() { console.log("Inout..."); }
    function search_stok() { console.log("Stok..."); }
    function list() { console.log("List..."); }