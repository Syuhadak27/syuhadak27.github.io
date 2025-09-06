function simpanKeLocalStorage_INOUT(data) {
  localStorage.setItem("inout_results", JSON.stringify(data));
}

function ambilDariLocalStorage_INOUT() {
  const data = localStorage.getItem("inout_results");
  return data ? JSON.parse(data) : [];
}

async function resetDataInout() {
  try {
    // 1. Pastikan ada koneksi internet
    if (!navigator.onLine) {
      throw new Error("Tidak ada koneksi internet. Silakan cek jaringan Anda.");
    }

    // 2. Verifikasi konfigurasi
    if (!CONFIG || !CONFIG.SHEET_ID || !CONFIG.API_KEY) {
      throw new Error("Konfigurasi API tidak lengkap. Pastikan SHEET_ID dan API_KEY sudah diatur.");
    }

    // 3. Hapus localStorage (khusus untuk inout_results)
    localStorage.removeItem("inout_results");

    // 4. Tampilkan pesan loading
    document.getElementById("result").innerHTML = "<p style='text-align:center;'>🔄 Data sedang diperbarui...</p>";

    // 5. Buat URL dan fetch data
    const range = "inout!A2:F";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${range}?key=${CONFIG.API_KEY}`;
    console.log("Fetching dari URL:", url); // Debugging

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    // 6. Cek status respon
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gagal fetch: ${response.status} - ${response.statusText}. Detail: ${errorText}`);
    }

    // 7. Parse JSON
    const json = await response.json();
    if (!json.values || !Array.isArray(json.values)) {
      throw new Error("Format data dari Google Sheets tidak valid.");
    }

    // 8. Simpan ke localStorage
    localStorage.setItem("inout_results", JSON.stringify(json.values));
    console.log("Data tersimpan:", json.values); // Debugging

    // 9. Verifikasi penyimpanan
    const storedData = localStorage.getItem("inout_results");
    if (!storedData) {
      throw new Error("Gagal menyimpan data ke localStorage.");
    }

    // 10. Update UI
    document.getElementById("result").innerHTML = "";
    showToast("✅ Data INOUT berhasil diupdate!");

    // 11. Force refresh untuk memastikan UI sinkron
    window.location.reload();

  } catch (error) {
    document.getElementById("result").innerHTML = `
      <div class="error">
        <p>❌ INOUT Gagal update data:</p>
        <p><small>${error.message}</small></p>
        <button onclick="resetDataInout()">Coba Lagi</button>
      </div>
    `;
    console.error("ResetDataInout Error:", error);
  }
}

function search_inout() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const resultContainer = document.getElementById("result");

  if (!query) {
    resultContainer.innerHTML = "<p class='error'>❌ Masukkan kata kunci pencarian.</p>";
    return;
  }

  const data = ambilDariLocalStorage_INOUT();

  // Jika data kosong, coba reset dulu
  if (!data || data.length === 0) {
    resultContainer.innerHTML = `
      <div class="error">
        <p>❌ Data INOUT belum tersedia.</p>
        <button onclick="resetDataInout()">Muat Data</button>
      </div>
    `;
    console.log("Data INOUT kosong, meminta reset.");
    return;
  }

  const keywords = query.split(" ");
  const hasil = data.filter(row =>
    keywords.every(keyword =>
      row.some(cell => String(cell).toLowerCase().includes(keyword))
    )
  );

  if (hasil.length === 0) {
    resultContainer.innerHTML = "<p class='error'>❌ Tidak ada hasil ditemukan.</p>";
    return;
  }

  let totalMasuk = 0;
  let totalKeluar = 0;
  let sumByName = {};

  hasil.forEach(row => {
    let masuk = parseInt(row[3]?.replace(/\D/g, ""), 10) || 0;
    let keluar = parseInt(row[4]?.replace(/\D/g, ""), 10) || 0;
    let name = row[5]?.trim() || "Tanpa Nama";

    totalMasuk += masuk;
    totalKeluar += keluar;
    sumByName[name] = (sumByName[name] || 0) + keluar;
  });

  const totalTersisa = totalMasuk - totalKeluar;


  
  
  let html = `
    <div style="margin-bottom: 15px;">
      <strong>🟢 Masuk:</strong> ${totalMasuk} pcs • 
      <strong>🔴 Keluar:</strong> ${totalKeluar} pcs • 
      <strong>🟡 Tersisa:</strong> ${totalTersisa} pcs
    </div>
    <div style="overflow-x:auto;">
      <table class="result-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Nama Barang</th>
            <th>Sp</th>
            <th>in</th>
            <th>out</th>
            <th>user</th>
          </tr>
        </thead>
        <tbody>`;

  hasil.forEach(row => {
    html += `<tr>
      <td>${row[0]}</td>
      <td>${row[1]}</td>
      <td>${row[2]}</td>
      <td>${row[3]}</td>
      <td>${row[4]}</td>
      <td>${row[5]}</td>
    </tr>`;
  });

  html += `</tbody></table></div>`;
  resultContainer.innerHTML = html;
}

// Inisialisasi data saat aplikasi dimulai
window.onload = function() {
  const data = ambilDariLocalStorage_INOUT();
  if (!data || data.length === 0) {
    resetDataInout();
  }
};