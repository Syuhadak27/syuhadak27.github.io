function simpanKeLocalStorage_STOK(data) {
  localStorage.setItem("search_results_STOK", JSON.stringify(data));
}

function ambilDariLocalStorage_STOK() {
  const data = localStorage.getItem("search_results_STOK");
  return data ? JSON.parse(data) : [];
}

async function resetData_Stok() {
  try {
    // 1. Pastikan ada koneksi internet
    if (!navigator.onLine) {
      throw new Error("Tidak ada koneksi internet. Silakan cek jaringan Anda.");
    }

    // 2. Verifikasi konfigurasi
    if (!CONFIG || !CONFIG.SHEET_ID || !CONFIG.API_KEY) {
      throw new Error("Konfigurasi API tidak lengkap. Pastikan SHEET_ID dan API_KEY sudah diatur.");
    }

    // 3. Hapus data lama dari localStorage (khusus stok)
    localStorage.removeItem("search_results_STOK"); // Hanya hapus stok, bukan semua

    // 4. Tampilkan pesan loading
    document.getElementById("result").innerHTML = "<p style='text-align:center;'>🔄 Data sedang diperbarui...</p>";

    // 5. Buat URL dan fetch data
    const range = "stok!A2:F"; // Range spesifik untuk stok
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
    simpanKeLocalStorage_STOK(json.values);
    console.log("Data tersimpan:", json.values); // Debugging

    // 9. Verifikasi penyimpanan
    const storedData = localStorage.getItem("search_results_STOK");
    if (!storedData) {
      throw new Error("Gagal menyimpan data ke localStorage.");
    }

    // 10. Update UI
    document.getElementById("result").innerHTML = "";
    showToast("✅ Data STOK berhasil diupdate!");

    // 11. Force refresh (opsional)
    window.location.reload();

  } catch (error) {
    document.getElementById("result").innerHTML = `
      <div class="error">
        <p>❌ STOK Gagal update data:</p>
        <p><small>${error.message}</small></p>
        <button onclick="resetData_Stok()">Coba Lagi</button>
      </div>
    `;
    console.error("ResetData_Stok Error:", error);
  }
}

function search_stok() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const resultContainer = document.getElementById("result");

  if (!query) {
    resultContainer.innerHTML = "<p class='error'>❌ Masukkan kata kunci pencarian.</p>";
    return;
  }

  const data = ambilDariLocalStorage_STOK();

  // Jika data kosong, tampilkan opsi untuk memuat ulang
  if (!data || data.length === 0) {
    resultContainer.innerHTML = `
      <div class="error">
        <p>❌ Data STOK belum tersedia.</p>
        <button onclick="resetData_Stok()">Muat Data</button>
      </div>
    `;
    console.log("Data STOK kosong, meminta reset.");
    return;
  }

  const keywords = query.split(" ");
  const hasil = data.filter(row =>
    keywords.every(keyword =>
      row.some(cell => String(cell).toLowerCase().includes(keyword))
    )
  );

  if (hasil.length === 0) {
    resultContainer.innerHTML = "<p class='error'>❌ Tidak ada hasil ditemukan. STOK</p>";
    return;
  }

  // Tampilkan tabel
  let html = `
    <div class="card">
      <table class="result-table">
        <thead>
          <tr>
            <th>Nama Barang</th>
            <th>Sp</th>
            <th>Qty</th>
            <th>Kode</th>
            <th>Harga</th>
          </tr>
        </thead>
        <tbody>`;

  hasil.forEach(row => {
    html += `
      <tr>
        <td>${row[1]}</td>
        <td>${row[0]}</td>
        <td>${row[2]}</td>
        <td>${row[3]}</td>
        <td>${row[4]}</td>
      </tr>`;
  });

  html += `
        </tbody>
      </table>
    </div>`;

  resultContainer.innerHTML = html;
}
