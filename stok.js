

async function resetData_Stok() {
  try {
    const resultContainer = document.getElementById("result");

    if (!navigator.onLine) {
      throw new Error("Tidak ada koneksi internet. Silakan cek jaringan Anda.");
    }


    const url = `${CONFIG.BASE_URL}?sheet=stok&range=A2:f`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gagal fetch: ${response.status} - ${response.statusText}. Detail: ${errorText}`);
    }

    const json = await response.json();
    const data = json.data || json;
    const dataTanpaHeader = data.slice(1);

    localStorage.setItem("hasil_stok", JSON.stringify(dataTanpaHeader));

    resultContainer.innerHTML = "";
    
    console.log("Data stok tersimpan:", dataTanpaHeader);

  } catch (error) {
    document.getElementById("result").innerHTML = `
      <div class="error">
        <p>❌ Gagal update data stok:</p>
        <p><small>${error.message}</small></p>
        <button onclick="resetData_Stok()">Coba Lagi</button>
      </div>`;
    console.error("ResetData Error:", error);
  }
}

function search_stok() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const resultContainer = document.getElementById("result");

  if (!query) {
    resultContainer.innerHTML = "<p class='error'>❌ Masukkan kata kunci pencarian.</p>";
    return;
  }

  const dataString = localStorage.getItem("hasil_stok");
  if (!dataString) {
    resultContainer.innerHTML = "<p class='error'>⚠️ Data kosong. Klik tombol update data terlebih dahulu.</p>";
    return;
  }

  const data = JSON.parse(dataString);
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

  html += `</tbody></table>`;
  resultContainer.innerHTML = html;
}