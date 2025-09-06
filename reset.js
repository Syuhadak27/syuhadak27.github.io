async function Reset_semua_Data() {
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