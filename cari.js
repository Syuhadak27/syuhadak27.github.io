function simpanKeLocalStorage(data) {
  localStorage.setItem("search_results", JSON.stringify(data));
}

function ambilDariLocalStorage() {
  const data = localStorage.getItem("search_results");
  return data ? JSON.parse(data) : [];
}

function cari() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const resultContainer = document.getElementById("result");

  if (!query) {
    resultContainer.innerHTML = "<p class='error'>❌ Masukkan kata kunci pencarian.</p>";
    return;
  }

  const keywords = query.split(" ");
  const data = ambilDariLocalStorage();
  const hasil = data.filter(row =>
    keywords.every(keyword =>
      row.some(cell => String(cell).toLowerCase().includes(keyword))
    )
  );

  if (hasil.length === 0) {
    resultContainer.innerHTML = "<p class='error'>❌ Tidak ada hasil ditemukan.</p>";
    return;
  }

  // Tampilkan tabel tanpa container tambahan
  let html = `
    <table class="result-table">
      <thead>
        <tr>
          <th>Nama Barang</th>
          <th>Spl</th>
          <th>Qty</th>
          <th>Kode</th>
          <th>Harga</th>
        </tr>
      </thead>
      <tbody>`;

  hasil.forEach(row => {
    html += `
      <tr ondblclick="insertToSearch('${row[1]}')">
        <td><b>${row[1]}</b></td>
        <td>${row[0]}</td>
        <td>${row[2]}</td>
        <td>${row[3]}</td>
        <td>${row[4]}</td>
      </tr>`;
  });

  html += `
      </tbody>
    </table>`;

  resultContainer.innerHTML = html;
}

async function resetData() {
  try {
    // 1. Pastikan ada koneksi internet
    if (!navigator.onLine) {
      throw new Error("Tidak ada koneksi internet. Silakan cek jaringan Anda.");
    }

    // 2. Verifikasi konfigurasi
    if (!CONFIG || !CONFIG.SHEET_ID || !CONFIG.RANGE || !CONFIG.API_KEY) {
      throw new Error("Konfigurasi API tidak lengkap. Pastikan SHEET_ID, RANGE, dan API_KEY sudah diatur.");
    }

    // 3. Hapus localStorage
    localStorage.clear();

    // 4. Buat URL dan fetch data
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${CONFIG.RANGE}?key=${CONFIG.API_KEY}`;
    console.log("Fetching dari URL:", url); // Debugging

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    // 5. Cek status respon
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gagal fetch: ${response.status} - ${response.statusText}. Detail: ${errorText}`);
    }

    // 6. Parse JSON
    const json = await response.json();
    if (!json.values || !Array.isArray(json.values)) {
      throw new Error("Format data dari Google Sheets tidak valid.");
    }

    // 7. Simpan ke localStorage
    localStorage.setItem("search_results", JSON.stringify(json.values));
    console.log("Data tersimpan:", json.values); // Debugging

    // 8. Update UI
    document.getElementById("result").innerHTML = "";
    showToast("✅ Data berhasil diupdate!");

    // 9. Force refresh (opsional)
    window.location.reload();

  } catch (error) {
    // 10. Tampilkan error secara spesifik
    document.getElementById("result").innerHTML = `
      <div class="error">
        <p>❌ SEARCH Gagal update data:</p>
        <p><small>${error.message}</small></p>
        <button onclick="resetData()">Coba Lagi</button>
      </div>
    `;
    console.error("ResetData Error:", error);
  }
}