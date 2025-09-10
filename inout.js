// ===== Simpan & ambil data dari localStorage =====
function simpanKeLocal_INOUT(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function ambilDariLocal_INOUT(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// ===== Refresh data dari API & simpan ke localStorage =====
async function resetDataInout() {
  try {
    if (!navigator.onLine) {
      throw new Error("Tidak ada koneksi internet. Silakan cek jaringan Anda.");
    }

    document.getElementById("result").innerHTML =
      "<p style='text-align:center;'>🔄 Data sedang diperbarui...</p>";

    const url = `${CONFIG.BASE_URL}?sheet=inout&range=A2:F`;
    console.log("Fetching dari URL:", url);

    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gagal fetch: ${response.status} - ${errorText}`);
    }

    const json = await response.json();
    if (!Array.isArray(json)) {
      throw new Error("Format data dari API tidak valid.");
    }

    // Simpan ke localStorage
    simpanKeLocal_INOUT("inout-data", json);
    console.log("Data tersimpan di localStorage:", json.length);

    
    document.getElementById("result").innerHTML = "";
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

// ===== Cari data di localStorage sesuai keyword =====
async function search_inout() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const resultContainer = document.getElementById("result");

  if (!query) {
    resultContainer.innerHTML = "<p class='error'>❌ Masukkan kata kunci pencarian.</p>";
    return;
  }

  const data = ambilDariLocal_INOUT("inout-data");

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

  hasil.forEach(row => {
    let masuk = parseInt(row[3]?.replace(/\D/g, ""), 10) || 0;
    let keluar = parseInt(row[4]?.replace(/\D/g, ""), 10) || 0;

    totalMasuk += masuk;
    totalKeluar += keluar;
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
    let rawDate = row[0];
    let formattedDate = rawDate;

    if (rawDate) {
      let d = new Date(rawDate);
      if (!isNaN(d)) {
        let day = String(d.getDate()).padStart(2, "0");
        let month = String(d.getMonth() + 1).padStart(2, "0");
        let year = d.getFullYear();
        formattedDate = `${day}-${month}-${year}`;
      }
    }

    html += `<tr>
      <td>${formattedDate}</td>
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

// ===== Inisialisasi data saat aplikasi dimulai =====
window.onload = function() {
  const data = ambilDariLocal_INOUT("inout-data");
  if (!data || data.length === 0) {
    console.log("Belum ada data INOUT di localStorage, silakan klik reset.");
  }
};