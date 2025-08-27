async function Reset_semua_Data() {
  const konfirmasi = confirm("Apakah kamu yakin ingin mereset semua data?");
  if (!konfirmasi) return;

  await Promise.all([
    resetData(),
    resetDataInout(),
    resetData_Stok(),
  ]);
}