// reset.js
async function Reset_semua_Data() {
  const konfirmasi = confirm("Apakah kamu yakin ingin mereset semua data?");
  if (!konfirmasi) return;

  const overlay = document.getElementById("progressOverlay");
  overlay.style.display = "flex"; // tampilkan spinner

  try {
    await Promise.all([
      resetData(),
      resetDataInout(),
      resetData_Stok(),
    ]);

    // format tanggal dd-mm-yyyy hh:mm
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const timestamp = `Terakhir direset pada: ${day}-${month}-${year} ${hours}:${minutes}`;

    localStorage.setItem("lastReset", timestamp);
    document.getElementById("resetTimestamp").textContent = timestamp;

    alert("✅ Data berhasil direset!");
  } catch (err) {
    console.error("Reset gagal:", err);
    alert("❌ Reset gagal: " + err.message);
  } finally {
    overlay.style.display = "none"; // sembunyikan spinner
  }
}