const audioPlayer = document.getElementById("audioPlayer");
const progressBar = document.getElementById("progressBar");
const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");
const selectionDropdown = document.getElementById("selection");
const modeDropdown = document.getElementById("mode");
const qariJuzContainer = document.getElementById("qariJuzContainer");
const qariSurahContainer = document.getElementById("qariSurahContainer");
const qariJuzSelect = document.getElementById("qariJuz");
const qariSurahSelect = document.getElementById("qariSurah");

// Daftar Surah (untuk tampilan di dropdown)
const surahList = [
    "Al-Fatihah", "Al-Baqarah", "Ali 'Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", 
    "Al-Anfal", "At-Taubah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl",
    "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha", "Al-Anbiya", "Al-Hajj", "Al-Mu’minun", "An-Nur",
    "Al-Furqan", "Asy-Syu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum", "Luqman",
    "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", 
    "Ghafir", "Fussilat", "Asy-Syura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jasiyah", "Al-Ahqaf", 
    "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adz-Dzariyat", "At-Tur", "An-Najm", "Al-Qamar", 
    "Ar-Rahman", "Al-Waqiah", "Al-Hadid", "Al-Mujadilah", "Al-Hasyr", "Al-Mumtahanah", 
    "As-Saff", "Al-Jumuah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", 
    "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Maarij", "Nuh", "Al-Jinn", "Al-Muzzammil", 
    "Al-Muddassir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Naziat", "Abasa",
    "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Insyiqaq", "Al-Buruj", "At-Tariq", "Al-Ala",
    "Al-Gasyiyah", "Al-Fajr", "Al-Balad", "Asy-Syams", "Al-Lail", "Ad-Duha", "Asy-Syarh",
    "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat", "Al-Qariah",
    "At-Takatsur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraisy", "Al-Maun", "Al-Kautsar",
    "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

function updateSelection() {
    selectionDropdown.innerHTML = "";
    const mode = modeDropdown.value;

    if (mode === "juz") {
        qariJuzContainer.style.display = "block";
        qariSurahContainer.style.display = "none";

        for (let i = 1; i <= 30; i++) {
            let option = document.createElement("option");
            option.value = i;
            option.textContent = `Juz ${i}`;
            selectionDropdown.appendChild(option);
        }
    } else {
        qariJuzContainer.style.display = "none";
        qariSurahContainer.style.display = "block";

        surahList.forEach((surah, index) => {
            let option = document.createElement("option");
            option.value = index + 1; // Nilai tetap nomor Surah
            option.textContent = `${index + 1}. ${surah}`; // Tampilan nama Surah
            selectionDropdown.appendChild(option);
        });
    }
}

function formatJuzNumber(number) {
    return number.toString().padStart(2, '0'); // Juz selalu 2 digit (01-30)
}

function formatSurahNumber(number) {
    return number < 10 ? number.toString().padStart(2, '0') : number.toString().padStart(3, '0');
}

function playAudio() {
    const mode = modeDropdown.value;
    let qari, selectedValue, audioUrl = "";

    if (mode === "juz") {
        qari = qariJuzSelect.value;
        selectedValue = formatJuzNumber(selectionDropdown.value); // Format Juz ke 2 digit

        if (qari === "mishary") {
            audioUrl = `https://ia801804.us.archive.org/11/items/MisharyRasyidPerJuz/Mishary/${selectedValue}.mp3`;
        } else if (qari === "sudais") {
            audioUrl = `https://ia800803.us.archive.org/26/items/AbdurrahmanSudaisPerJuz/${selectedValue}.mp3`;
        } else if (qari === "dosari") {
            audioUrl = `https://ia903203.us.archive.org/26/items/YasserAlDosariPerJuz/${selectedValue}.mp3`;
        } else if (qari === "Shuraim") {
            audioUrl = `https://ia803208.us.archive.org/20/items/SaudAlShuraimPerJuz/${selectedValue}.mp3`;
        } else if (qari === "SaadAl-Ghamidi") {
            audioUrl = `https://ia803200.us.archive.org/20/items/SaadAl-GhamidiPerJuz/${selectedValue}.mp3`;
        } else if (qari === "HanyAr-Rifai") {
            audioUrl = `https://ia800500.us.archive.org/17/items/HanyAr-RifaiPerJuz/${selectedValue}.mp3`;
        }
    } else {
        qari = qariSurahSelect.value;
        selectedValue = formatSurahNumber(selectionDropdown.value); // Format Surah ke 2 atau 3 digit

        if (qari === "sudais") {
            audioUrl = `https://dn720304.ca.archive.org/0/items/as-sudais_202105/${selectedValue}.mp3`;
        }
    }

    audioPlayer.src = audioUrl;
    audioPlayer.play();

    // Auto play setelah selesai
    audioPlayer.onended = () => {
        playNext();
    };
}

function playNext() {
    const mode = modeDropdown.value;
    let nextValue = parseInt(selectionDropdown.value) + 1; // Ambil nomor berikutnya

    if (mode === "juz" && nextValue <= 30) {
        selectionDropdown.value = nextValue;
        playAudio();
    } else if (mode === "surah" && nextValue <= 114) {
        selectionDropdown.value = nextValue;
        playAudio();
    }
}

// Inisialisasi pertama
updateSelection();

