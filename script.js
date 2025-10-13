const callList = document.getElementById('call-list');
const unitList = document.getElementById('unit-list');
const addUnitBtn = document.getElementById('add-unit-btn');
const panicBtn = document.getElementById('panic-btn');
const addCallForm = document.getElementById('add-call-form');
const callTypeSelect = document.getElementById('call-type');

// Predefined call types
const callTypes = [
  "Shots Fired",
  "Drug Sales",
  "Store Robbery",
  "House Robbery",
  "Bank Robbery",
  "Armored Truck Robbery",
  "Traffic Stop",
  "Pursuit",
  "Disturbance",
  "Suspicious Activity",
  "Medical Emergency",
  "Assault",
  "Domestic Dispute",
  "Fire",
  "Vandalism",
  "Theft",
  "Public Intoxication",
  "Gang Activity",
  "Missing Person"
];

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

  updateCallUnitDropdowns();
});

// Add new call
addCallForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const callType = callTypeSelect.value;
  if (!callType) return;

  const li = document.createElement('li');

  // Create call type dropdown for this call
  const callTypeDropdown = document.createElement('select');
  callTypes.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.text = type;
    if (type === callType) option.selected = true;
    callTypeDropdown.add(option);
  });

  li.appendChild(callTypeDropdown);

  // Assigned units span
  const assignedSpan = document.createElement('span');
  assignedSpan.className = "assigned-units";
  assignedSpan.textContent = "None";
  li.appendChild(document.createElement('br'));
  li.appendChild(document.createTextNode("Assigned Units: "));
  li.appendChild(assignedSpan);

  // Unit dropdown
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
    // Only update unit dropdowns (skip call type dropdowns)
    if (dropdown === callTypeSelect) return; // skip form dropdown
    if (Array.from(dropdown.options).some(o => callTypes.includes(o.value))) return; // skip call type dropdowns

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
