

function insertToSearch(value) {
  const input = document.getElementById("searchInput");
  input.value = value;
  input.focus();
}




function clearSearch() {
  const searchInput = document.getElementById("searchInput");
  searchInput.value = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("warningText").style.display = "none";
  
  // Fokuskan kembali ke input field untuk mempertahankan keyboard
  searchInput.focus();
}


function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, 2000);
}



document.getElementById("searchInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    cari();
  }
});


function updateClock() {
  const now = new Date();
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  

  let dayName = days[now.getDay()];
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('digitalClock').innerText = dayName + "," + hours + ":" + minutes + ":" + seconds;
}

// Update jam setiap detik
setInterval(updateClock, 1000);

// Jalankan fungsi saat halaman dimuat
updateClock();