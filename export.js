function exportToImage() {
    let element = document.getElementById('result');

    if (!element || element.innerHTML.trim() === "") {
        alert("⚠️ Tidak ada hasil untuk dicetak!");
        return;
    }

    // Simpan style asli
    let originalBackground = element.style.backgroundColor;
    let originalColor = element.style.color;

    // Terapkan style khusus untuk export
    element.style.backgroundColor = "#ffffff";
    element.style.color = "#000000";

    html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff"
    }).then(canvas => {
        let now = new Date();
        let timestamp = now.getDate().toString().padStart(2, '0') + 
                        (now.getMonth() + 1).toString().padStart(2, '0') + 
                        now.getFullYear() + "_" + 
                        now.getHours().toString().padStart(2, '0') + 
                        now.getMinutes().toString().padStart(2, '0') + 
                        now.getSeconds().toString().padStart(2, '0');

        let fileName = "hasil_pencarian_" + timestamp + ".jpg";

        let link = document.createElement('a');
        link.href = canvas.toDataURL("image/jpeg", 0.9);
        link.download = fileName;
        link.click();

        // Kembalikan style asli
        element.style.backgroundColor = originalBackground;
        element.style.color = originalColor;
    }).catch(error => {
        console.error("Gagal mengexport gambar:", error);
        alert("❌ Gagal menyimpan gambar!");
    });
}