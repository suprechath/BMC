// Toggle Slidebar (Left Icon)
function toggleSlidebar() {
  const slidebar = document.getElementById('slidebar');
  const currentLeft = slidebar.style.left;
  
  if (currentLeft === '0px') {
    slidebar.style.left = '-250px'; // Close the slidebar
  } else {
    slidebar.style.left = '0px'; // Open the slidebar
  }
}

// Toggle Dropdown (Right Icon)
function toggleDropdown() {
  const dropdown = document.getElementById('dropdown-menu');
  dropdown.classList.toggle('hidden');
}

// Close Dropdown if click outside
document.addEventListener("click", function (event) {
  const profile = document.querySelector(".profile");
  const dropdown = document.getElementById("dropdown-menu");
  
  if (!profile.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.classList.add('hidden');
  }
});

// Switch Table based on dropdown selection
function showTable(tableName) {
  const patientTable = document.getElementById("patientTable");
  const psychologistTable = document.getElementById("psychologistTable");
  
  if (tableName === "patient") {
    patientTable.classList.remove("hidden");
    psychologistTable.classList.add("hidden");
  } else {
    patientTable.classList.add("hidden");
    psychologistTable.classList.remove("hidden");
  }
}
