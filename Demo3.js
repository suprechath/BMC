// ลบข้อมูลการจองทั้งหมดใน sessionStorage เมื่อโหลดหน้าเว็บใหม่
Object.keys(sessionStorage).forEach(key => {
  if (key.startsWith('booking_')) {
    sessionStorage.removeItem(key);
  }
});

const psychologists = [
  {
    id: "suphawadee",
    name: "ดร. สุภาวดี จิตวิทยา",
    img: "man.png",
    availableDates: [2, 5, 8, 12, 20]
  },
  {
    id: "wuttichai",
    name: "คุณวุฒิชัย นักจิตบำบัด",
    img: "boy.png",
    availableDates: [3, 6, 10, 18, 25]
  },
  {
    id: "thanaporn",
    name: "คุณธนพร ผู้เชี่ยวชาญสุขภาพจิต",
    img: "woman.png",
    availableDates: [1, 4, 15, 22, 28]
  }
];

const overlay = document.getElementById("overlay");
const calendarPopup = document.getElementById("calendarPopup");
const calendarGrid = document.getElementById("calendarGrid");
const calendarTitle = document.getElementById("calendarTitle");
const confirmPopup = document.getElementById("confirmPopup");
const confirmText = document.getElementById("confirmText");

let selectedPsychologist = null;
let selectedDay = null;
let selectedMonth = new Date().getMonth();
let selectedYear = new Date().getFullYear();

const thaiMonths = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

function goBackToAssessment() {
  window.location.href = "Demo2.html";
}

function renderPsychologists() {
  const container = document.getElementById("psychologistList");
  psychologists.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <button onclick="showCalendar(${index})">ดูปฏิทิน</button>
    `;
    container.appendChild(card);
  });
}

function showCalendar(index) {
  selectedPsychologist = psychologists[index];
  selectedDay = null;

  renderCalendar();
}

function renderCalendar() {
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const monthName = thaiMonths[selectedMonth];
  const buddhistYear = selectedYear + 543;

  calendarTitle.innerHTML = `
    <button onclick="prevMonth()">←</button>
    ปฏิทินของ ${selectedPsychologist.name} - ${monthName} ${buddhistYear}
    <button onclick="nextMonth()">→</button>
  `;
  calendarGrid.innerHTML = "";

  const booked = getBookings(selectedPsychologist.id);

  for (let day = 1; day <= daysInMonth; day++) {
    const div = document.createElement("div");
    div.innerText = day;

    // เฉพาะเดือนปัจจุบันเท่านั้นที่สามารถจองได้
    const isCurrentMonth = selectedMonth === new Date().getMonth() && selectedYear === new Date().getFullYear();
    const isAvailable = selectedPsychologist.availableDates.includes(day);
    const isBooked = booked.includes(day);

    if (isCurrentMonth && isAvailable && !isBooked) {
      div.className = "available";
      div.onclick = () => handleBookingClick(day);
    } else {
      div.className = "full";
    }

    calendarGrid.appendChild(div);
  }

  calendarPopup.style.display = "block";
  overlay.style.display = "block";
}

function prevMonth() {
  selectedMonth--;
  if (selectedMonth < 0) {
    selectedMonth = 11;
    selectedYear--;
  }
  renderCalendar();
}

function nextMonth() {
  selectedMonth++;
  if (selectedMonth > 11) {
    selectedMonth = 0;
    selectedYear++;
  }
  renderCalendar();
}

function closePopup() {
  calendarPopup.style.display = "none";
  overlay.style.display = "none";
  confirmPopup.style.display = "none";
}

function handleBookingClick(day) {
  selectedDay = day;
  confirmText.innerText = `คุณต้องการจองวันที่ ${day} กับ ${selectedPsychologist.name} ใช่หรือไม่?`;
  confirmPopup.style.display = "block";
}

function confirmBooking() {
  if (selectedDay && selectedPsychologist) {
    const key = "booking_" + selectedPsychologist.id;
    let bookings = JSON.parse(sessionStorage.getItem(key)) || [];
    if (!bookings.includes(selectedDay)) {
      bookings.push(selectedDay);
      sessionStorage.setItem(key, JSON.stringify(bookings));
      alert("จองสำเร็จ!");
      closePopup();
      showCalendar(psychologists.findIndex(p => p.id === selectedPsychologist.id)); // reload
    } else {
      alert("วันดังกล่าวมีการจองแล้ว");
    }
  }
}

function cancelBooking() {
  confirmPopup.style.display = "none";
}

function getBookings(psychologistId) {
  return JSON.parse(sessionStorage.getItem("booking_" + psychologistId)) || [];
}

renderPsychologists();
