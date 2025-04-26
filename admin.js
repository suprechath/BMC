function toggleDropdown() {
    const dropdown = document.getElementById('dropdown-menu');
    dropdown.classList.toggle('hidden');
  }
  
  document.addEventListener("click", function (event) {
    const profile = document.querySelector(".profile");
    const dropdown = document.getElementById("dropdown-menu");
    if (!profile.contains(event.target)) {
      dropdown.classList.add("hidden");
    }
  });
  
  function switchTable() {
    const selected = document.getElementById("dataType").value;
    const tableTitle = document.getElementById("tableTitle");
    const patientTable = document.getElementById("patientTable");
    const psychologistTable = document.getElementById("psychologistTable");
  
    if (selected === "patient") {
      tableTitle.innerText = "ข้อมูลผู้ป่วย";
      patientTable.classList.remove("hidden");
      psychologistTable.classList.add("hidden");
    } else {
      tableTitle.innerText = "ข้อมูลนักจิตวิทยา";
      patientTable.classList.add("hidden");
      psychologistTable.classList.remove("hidden");
    }
  }
  