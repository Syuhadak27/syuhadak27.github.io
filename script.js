

function insertToSearch(value) {
  const input = document.getElementById("searchInput");
  input.value = value;
  input.focus();
}




function clearSearch() {
  const searchInput = document.getElementById("searchInput");
  searchInput.value = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("warningText").style.display = "none";
  
  // Fokuskan kembali ke input field untuk mempertahankan keyboard
  searchInput.focus();
}


function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, 2000);
}



document.getElementById("searchInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    cari();
  }
});


function updateClock() {
  const now = new Date();
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  

  let dayName = days[now.getDay()];
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('digitalClock').innerText = dayName + "," + hours + ":" + minutes + ":" + seconds;
}

// Update jam setiap detik
setInterval(updateClock, 1000);

// Jalankan fungsi saat halaman dimuat
updateClock();


  // ====== Konstanta & util ======
  const LAST_RESET_KEY = "lastResetISO";
  const APP_KEYS_TO_CLEAR = [
    "inout_results",
    "stok_results",
    "cache_version",
    // tambahkan key lain yang mau kamu hapus
  ];

  function formatID(tsISO) {
    try {
      return new Date(tsISO).toLocaleString("id-ID", {
        dateStyle: "full",
        timeStyle: "short"
      });
    } catch {
      return "-";
    }
  }

  function renderLastReset() {
    const iso = localStorage.getItem(LAST_RESET_KEY);
    const text = iso ? `Terakhir direset pada: ${formatID(iso)}` : "Terakhir direset pada: -";
    const el = document.getElementById("resetTimestamp");
    if (el) el.textContent = text;
  }

  function setLastResetNow() {
    localStorage.setItem(LAST_RESET_KEY, new Date().toISOString());
    renderLastReset();
  }

  // Sync bila reset di tab lain
  window.addEventListener("storage", (e) => {
    if (e.key === LAST_RESET_KEY) renderLastReset();
  });

  // Render saat load
  window.addEventListener("load", renderLastReset);

  // ====== Reset dengan spinner, aman dari override ======
  window.APP = window.APP || {};
  window.APP.resetAllWithTimestamp = async function () {
    const overlay = document.getElementById("progressOverlay");
    if (overlay) overlay.style.display = "flex";

    try {
      // 1) Hapus hanya key yang diperlukan
      APP_KEYS_TO_CLEAR.forEach((k) => localStorage.removeItem(k));

      // 2) (Opsional) bersihkan Cache Storage yang terkait
      if ("caches" in window) {
        const keys = await caches.keys();
        // batasi ke nama cache yang kamu pakai
        await Promise.all(
          keys
            .filter((k) => /inout|stok|cache/i.test(k))
            .map((k) => caches.delete(k))
        );
      }

      // 3) Set timestamp baru & render
      setLastResetNow();

      alert("✅ Data berhasil direset!");
    } catch (err) {
      console.error("Reset error:", err);
      alert("❌ Gagal reset: " + err.message);
    } finally {
      if (overlay) overlay.style.display = "none";
    }
  };