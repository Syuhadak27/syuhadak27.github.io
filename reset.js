async function Reset_semua_Data_WORKKK() {
  await Promise.all([
    resetData(),
    resetDataInout(),
    resetData_Stok(),
  ]);

  const now = new Date();
  const timestamp = `Terakhir direset pada: ${now.toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })}`;

  document.getElementById('resetTimestamp').textContent = timestamp;
  localStorage.setItem('lastReset', timestamp);
}



async function Reset_semua_Data() {
  const overlay = document.getElementById("progressOverlay");
  overlay.style.display = "flex";

  try {
    // Jalankan semua reset paralel
    await Promise.all([
      resetData(),
      resetDataInout(),
      resetData_Stok(),
    ]);

    // Update timestamp
    const now = new Date();
    const timestamp = "Terakhir direset pada: " + now.toLocaleString("id-ID", {
      dateStyle: "full",
      timeStyle: "short"
    });

    document.getElementById("resetTimestamp").textContent = timestamp;
    localStorage.setItem("lastReset", timestamp);
    localStorage.setItem("lastResetMs", Date.now().toString()); // penting

    overlay.style.display = "none";

    // Popup sukses (tetap ada sampai user klik OK)
    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "✅ Data berhasil direset!",
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
      background: "#fff",
      color: "#333"
    }).then(() => {
      //location.reload(); // reload setelah user tekan OK
    });

  } catch (error) {
    overlay.style.display = "none";
    Swal.fire({
      icon: "error",
      title: "Gagal!",
      text: "❌ Terjadi kesalahan saat reset data.",
      confirmButtonText: "Tutup"
    });
    console.error("Reset error:", error);
  }
}