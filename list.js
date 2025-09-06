function list() {
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
        <td>${row[3]}</td>
        <td>${row[4]}</td>
      </tr>`;
  });

  html += `
      </tbody>
    </table>`;

  resultContainer.innerHTML = html;
}