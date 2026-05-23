/* =============================================
   ময়শা পাড় উন্নয়ন কমিটি — main.js
   ============================================= */

// ===== EXACT VILLAGE COORDINATES =====
const VILLAGE_LAT = 23.319730;
const VILLAGE_LON = 87.424488;

// ===== MEMBERS DATA =====
const MEMBERS = [
  { name: "মহিবুল মিদ্যা",     photo: "poltu mama",    role: "সভাপতি",     badge: "সভাপতি",     badgeClass: "leader",    emoji: "👑" },
  { name: "চাঁদ মোহাম্মদ মল্লিক",      photo: "chand kaka",    role: "সহ-সভাপতি",  badge: "সহ-সভাপতি",  badgeClass: "secretary", emoji: "⭐" },
  { name: "রমজান মোল্লা",          photo: "ramjan",        role: "ক্যাশিয়ার", badge: "কোষাধ্যক্ষ", badgeClass: "treasurer", emoji: "💰" },
  { name: "জমিরুদ্দিন মোল্লা",      photo: "mukul bhai",    role: "সদস্য",      badge: "সদস্য",      badgeClass: "",          emoji: "🌿" },
  { name: "আব্দুল তরফদার",    photo: "abdul kaka",    role: "সদস্য",      badge: "সদস্য",      badgeClass: "",          emoji: "🌿" },
  { name: "বাপি মণ্ডল",           photo: "bapi",          role: "সদস্য",      badge: "সদস্য",      badgeClass: "",          emoji: "🌿" },
  { name: "বাপ্পা মণ্ডল",         photo: "bappa",         role: "সদস্য",      badge: "সদস্য",      badgeClass: "",          emoji: "🌿" },
  { name: "ফিরোজ মল্লিক",          photo: "firoj",         role: "সদস্য",      badge: "সদস্য",      badgeClass: "",          emoji: "🌿" },
  { name: "মিলন মণ্ডল",           photo: "milon",         role: "সদস্য",      badge: "সদস্য",      badgeClass: "",          emoji: "🌿" },
  { name: "মুস্তাকিন মিদ্যা ",      photo: "mustakin",      role: "সদস্য",      badge: "সদস্য",      badgeClass: "",          emoji: "🌿" },
  { name: "রাহুল মল্লিক",   photo: "rahul mallick", role: "সদস্য",      badge: "সদস্য",      badgeClass: "",          emoji: "🌿" },
  { name: "রাজিব  তরফদার ",          photo: "rajib",         role: "সদস্য",      badge: "সদস্য",      badgeClass: "",          emoji: "🌿" },
  { name: "রাজিবুল মিদ্যা",        photo: "rajibul",       role: "সদস্য",      badge: "সদস্য",      badgeClass: "",          emoji: "🌿" },
  { name: "রূপচাঁদ মল্লিক ",        photo: "rupchand",      role: "সদস্য",      badge: "সদস্য",      badgeClass: "",          emoji: "🌿" },
  { name: "সুমন মণ্ডল",           photo: "suman",         role: "সদস্য",      badge: "সদস্য",      badgeClass: "",          emoji: "🌿" },
  { name: "কাজল মোল্লা",           photo: "kajol",         role: "সদস্য",      badge: "সদস্য",      badgeClass: "",          emoji: "🌿" },
  { name: "ধবল মণ্ডল",           photo: "dhobol",         role: "সদস্য",      badge: "সদস্য",      badgeClass: "",          emoji: "🌿" },
];

// ===== RENDER MEMBERS =====
function renderMembers() {
  // Officers go into their own centered row
  let officersRow = document.getElementById("officersRow");
  if (!officersRow) {
    officersRow = document.createElement("div");
    officersRow.id = "officersRow";
    officersRow.className = "officers-row";
    const grid = document.getElementById("membersGrid");
    grid.parentNode.insertBefore(officersRow, grid);
  }
  officersRow.innerHTML = "";

  const grid = document.getElementById("membersGrid");
  grid.innerHTML = "";

  MEMBERS.forEach((m, i) => {
    const isOfficer = i < 3;
    const card = document.createElement("div");
    card.className = "member-card" + (isOfficer ? " member-officer" : "");
    card.style.animationDelay = `${i * 0.05}s`;
    card.innerHTML = `
      <div class="member-photo-ring${isOfficer ? " officer-ring" : ""}">
        <img src="photos/${m.photo}.jpg" alt="${m.name}"
          onload="this.style.opacity='1'"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
        <span class="fallback-emoji">${m.emoji}</span>
      </div>
      ${isOfficer ? `<div class="officer-crown">${i===0?"👑":i===1?"⭐":"💰"}</div>` : ""}
      <div class="member-name">${m.name}</div>
      <div class="member-role">${m.role}</div>
      <span class="member-badge ${m.badgeClass}">${m.badge}</span>
    `;
    if (isOfficer) { officersRow.appendChild(card); }
    else           { grid.appendChild(card); }
  });
}

// ===== PRAYER TIMES =====
// Method 1 = Karachi — standard for West Bengal / Bangladesh
const PRAYER_NAMES_BN = {
  Fajr: "ফজর", Sunrise: "সূর্যোদয়", Dhuhr: "যোহর",
  Asr: "আসর", Maghrib: "মাগরিব", Isha: "এশা"
};

let prayerTimes = {};
let countdownInterval = null;

async function fetchPrayerTimesExact() {
  document.getElementById("locationText").textContent = "⏳ সময় লোড হচ্ছে...";
  const today = new Date();
  const d = today.getDate();
  const m = today.getMonth() + 1;
  const y = today.getFullYear();
  const url = `https://api.aladhan.com/v1/timings/${d}-${m}-${y}?latitude=${VILLAGE_LAT}&longitude=${VILLAGE_LON}&method=1`;
  try {
    const res  = await fetch(url);
    const data = await res.json();
    if (data.code === 200) {
      prayerTimes = data.data.timings;
      updatePrayerDisplay(prayerTimes);
      document.getElementById("locationText").textContent = "📍 মহেশপুর, সোনামুখি, বাঁকুড়া";
    } else {
      setFallbackTimes();
    }
  } catch (e) {
    console.error("Prayer time API error:", e);
    setFallbackTimes();
  }
}

// Fallback times for Maheshpur (approx — used when API is unreachable)
function setFallbackTimes() {
  const t = {
    Fajr: "04:10", Sunrise: "05:21", Dhuhr: "11:51",
    Asr: "15:18", Maghrib: "18:20", Isha: "19:38"
  };
  prayerTimes = t;
  updatePrayerDisplay(t);
  document.getElementById("locationText").textContent = "📍 মহেশপুর (আনুমানিক সময়)";
}

function formatTime12(t24) {
  if (!t24 || t24 === "--:--") return "--:--";
  const [hStr, mStr] = t24.split(":");
  let h = parseInt(hStr);
  const mn = parseInt(mStr);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${String(mn).padStart(2, "0")} ${ampm}`;
}

function timeToMinutes(t24) {
  if (!t24) return 0;
  const [h, m] = t24.split(":").map(Number);
  return h * 60 + m;
}

function updatePrayerDisplay(t) {
  document.getElementById("fajrTime").textContent    = formatTime12(t.Fajr);
  document.getElementById("sunriseTime").textContent = formatTime12(t.Sunrise);
  document.getElementById("dhuhrTime").textContent   = formatTime12(t.Dhuhr);
  document.getElementById("asrTime").textContent     = formatTime12(t.Asr);
  document.getElementById("maghribTime").textContent = formatTime12(t.Maghrib);
  document.getElementById("ishaTime").textContent    = formatTime12(t.Isha);
  updateNextPrayer(t);
}

function updateNextPrayer(times) {
  const now    = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  let nextPrayer  = null;
  let nextMinutes = null;

  for (const p of prayers) {
    if (!times[p]) continue;
    const pMin = timeToMinutes(times[p]);
    if (pMin > nowMin) { nextPrayer = p; nextMinutes = pMin; break; }
  }

  // If all prayers have passed, next is Fajr tomorrow
  if (!nextPrayer) {
    nextPrayer  = "Fajr";
    nextMinutes = timeToMinutes(times["Fajr"]) + 1440;
  }

  document.getElementById("nextPrayerName").textContent = PRAYER_NAMES_BN[nextPrayer] || nextPrayer;
  document.getElementById("nextPrayerTime").textContent = formatTime12(times[nextPrayer]);

  // Highlight active card
  document.querySelectorAll(".namaz-card").forEach(c => c.classList.remove("active"));
  const ac = document.querySelector(`.namaz-card[data-prayer="${nextPrayer}"]`);
  if (ac) ac.classList.add("active");

  // Live countdown
  if (countdownInterval) clearInterval(countdownInterval);

  function tick() {
    const n      = new Date();
    const nowSec = n.getHours() * 3600 + n.getMinutes() * 60 + n.getSeconds();
    let diff     = nextMinutes * 60 - nowSec;
    if (diff < 0) diff += 86400;

    if (diff <= 0) {
      document.getElementById("countdown").textContent = "নামাজের সময় হয়েছে! 🕌";
      clearInterval(countdownInterval);
      setTimeout(fetchPrayerTimesExact, 2000);
      return;
    }

    const hr = Math.floor(diff / 3600);
    const mn = Math.floor((diff % 3600) / 60);
    const sc = diff % 60;
    document.getElementById("countdown").textContent =
      `${hr > 0 ? toBn(hr) + "ঘঃ " : ""}${toBn(mn)}মিঃ ${toBn(sc)}সেঃ বাকি`;
  }

  tick();
  countdownInterval = setInterval(tick, 1000);
}

// ===== HIJRI DATE =====
async function fetchHijriDate() {
  try {
    const today = new Date();
    const url   = `https://api.aladhan.com/v1/gToH/${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    const res   = await fetch(url);
    const data  = await res.json();
    if (data.code === 200) {
      const h        = data.data.hijri;
      const monthsBN = ["মুহাররম","সফর","রবিউল আউয়াল","রবিউস সানি","জুমাদাল উলা","জুমাদাস সানি","রজব","শাবান","রমজান","শাওয়াল","জিলকাদ","জিলহজ"];
      const daysBN   = { Sun:"রবিবার", Mon:"সোমবার", Tue:"মঙ্গলবার", Wed:"বুধবার", Thu:"বৃহস্পতিবার", Fri:"শুক্রবার", Sat:"শনিবার" };
      const mi = parseInt(h.month.number) - 1;
      const dn = h.weekday.en.substring(0, 3);
      document.getElementById("hijriDate").textContent =
        `${daysBN[dn] || dn}, ${toBn(h.day)} ${monthsBN[mi] || h.month.en} ${toBn(h.year)} হিজরি`;
    }
  } catch (e) {
    document.getElementById("hijriDate").textContent = "হিজরি তারিখ";
  }
}

// ===== BENGALI DATE =====
function getBengaliDate() {
  const t      = new Date();
  const months = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
  const days   = ["রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার","শনিবার"];
  document.getElementById("bengaliDate").textContent =
    `${days[t.getDay()]}, ${toBn(t.getDate())} ${months[t.getMonth()]} ${toBn(t.getFullYear())}`;
}

// ===== BENGALI NUMERALS =====
function toBn(n) {
  return String(n).replace(/[0-9]/g, d => "০১২৩৪৫৬৭৮৯"[d]);
}

// ===== TICKER =====
const TICKER_FACTS = [
  "সুবহানাল্লাহ — আল্লাহ পবিত্র | আলহামদুলিল্লাহ — সকল প্রশংসা আল্লাহর | আল্লাহু আকবার — আল্লাহ সর্বশ্রেষ্ঠ",
  "রাসুল (সাঃ) বলেছেন: তোমরা একে অপরের সাথে ভালো ব্যবহার করো। — সহিহ মুসলিম",
  "ফজরের নামাজ পড়া সারা রাত নফল নামাজ পড়ার সমান সওয়াব দেয়।",
  "জুমার নামাজ মুসলিমদের সাপ্তাহিক ঈদ — এই দিনে বেশি বেশি দুরুদ পড়ুন।",
  "ইসলাম শান্তির ধর্ম — ভারতের মুসলিমরা এই দেশের অবিচ্ছেদ্য অংশ 🇮🇳",
  "হিন্দু-মুসলিম ভাই ভাই — আমরা একই মাটির সন্তান। মহেশপুর আমাদের গ্রাম 🏡",
  "সদকা দান করলে সম্পদ কমে না বরং আরও বাড়ে — হাদিস শরিফ",
  "আল্লাহর রাসুল (সাঃ) বলেছেন: প্রতিবেশীকে কষ্ট দেবে না।",
];
let tickerIdx = 0;
function rotateTicker() {
  document.getElementById("islamicTicker").textContent = TICKER_FACTS[tickerIdx];
  tickerIdx = (tickerIdx + 1) % TICKER_FACTS.length;
}

// ===== AYAH ROTATION =====
const AYAHS = [
  { arabic: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ", bengali: "নামাজ কায়েম করো এবং যাকাত দাও।",                  ref: "সূরা বাকারা ২:৪৩"   },
  { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",           bengali: "নিশ্চয়ই আল্লাহ ধৈর্যশীলদের সাথে আছেন।",          ref: "সূরা বাকারা ২:১৫৩"  },
  { arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",            bengali: "নিশ্চয়ই কষ্টের সাথেই আছে সহজ।",                  ref: "সূরা ইনশিরাহ ৯৪:৫"  },
  { arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ",        bengali: "তোমরা যেখানেই থাকো, তিনি তোমাদের সাথে আছেন।",    ref: "সূরা হাদিদ ৫৭:৪"    },
  { arabic: "إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ",            bengali: "নিশ্চয়ই আল্লাহ ক্ষমাশীল, পরম দয়ালু।",           ref: "সূরা বাকারা ২:১৭৩"  },
];
function rotateAyah() {
  const idx = Math.floor(Date.now() / (1000 * 60 * 60 * 6)) % AYAHS.length;
  const a   = AYAHS[idx];
  document.getElementById("ayahArabic").textContent   = a.arabic;
  document.getElementById("ayahBengali").textContent  = a.bengali;
  document.querySelector(".ayah-ref").textContent     = "— " + a.ref;
}

// ===== NAVBAR =====
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});
document.querySelectorAll(".nav-links a").forEach(a => {
  a.addEventListener("click", () => document.getElementById("navLinks").classList.remove("open"));
});
window.addEventListener("scroll", () => {
  document.getElementById("scrollTop").classList.toggle("visible", window.scrollY > 400);
});

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  renderMembers();
  getBengaliDate();
  fetchHijriDate();
  rotateAyah();
  rotateTicker();
  setInterval(rotateTicker, 8000);
  fetchPrayerTimesExact();

  // Auto-refresh prayer times at midnight
  const now      = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 1, 0, 0);
  setTimeout(() => {
    fetchPrayerTimesExact();
    setInterval(fetchPrayerTimesExact, 86400000);
  }, midnight - now);
});