const callList = document.getElementById('call-list');
const unitList = document.getElementById('unit-list');
const addUnitBtn = document.getElementById('add-unit-btn');
const panicBtn = document.getElementById('panic-btn');
const addCallForm = document.getElementById('add-call-form');
const callTypeSelect = document.getElementById('call-type');

// Add unit manually
addUnitBtn.addEventListener('click', () => {
  const callsign = prompt("Enter unit's callsign:");
  if (!callsign) return;

  const name = prompt("Enter officer's name:");
  if (!name) return;

  const li = document.createElement('li');
  li.textContent = `${callsign} - ${name} `;

  const removeBtn = document.createElement('button');
  removeBtn.textContent = "Remove";
  removeBtn.style.marginLeft = "10px";
  removeBtn.addEventListener('click', () => {
    unitList.removeChild(li);
    updateCallUnitDropdowns();
  });

  li.appendChild(removeBtn);
  unitList.appendChild(li);

  // Update all call unit dropdowns
  updateCallUnitDropdowns();
});

// Add new call
addCallForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const callType = callTypeSelect.value;
  if (!callType) return;

  const li = document.createElement('li');
  li.innerHTML = `<strong>${callType}</strong> <br>Assigned Units: <span class="assigned-units">None</span> `;

  // Create unit dropdown
  const assignSelect = document.createElement('select');
  const defaultOption = document.createElement('option');
  defaultOption.text = "Assign Unit";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  assignSelect.add(defaultOption);

  li.appendChild(assignSelect);

  // When a unit is selected
  assignSelect.addEventListener('change', () => {
    const selectedUnit = assignSelect.value;
    const assignedSpan = li.querySelector(".assigned-units");
    if (assignedSpan.textContent === "None") {
      assignedSpan.textContent = selectedUnit;
    } else {
      assignedSpan.textContent += `, ${selectedUnit}`;
    }
    assignSelect.value = ""; // Reset dropdown
  });

  callList.appendChild(li);
  updateCallUnitDropdowns();
});

// Update all call dropdowns with current active units
function updateCallUnitDropdowns() {
  const activeUnits = Array.from(unitList.children).map(li => li.textContent.replace("Remove", "").trim());
  const allDropdowns = callList.querySelectorAll("select");

  allDropdowns.forEach(dropdown => {
    // Clear existing options except first
    while (dropdown.options.length > 1) {
      dropdown.remove(1);
    }

    activeUnits.forEach(unit => {
      const option = document.createElement('option');
      option.value = unit;
      option.text = unit;
      dropdown.add(option);
    });
  });
}

// Panic button
panicBtn.addEventListener('click', () => {
  alert('🚨 Panic triggered!');
});
