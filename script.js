const callList = document.getElementById('call-list');
const unitList = document.getElementById('unit-list');
const addUnitBtn = document.getElementById('add-unit-btn');
const panicBtn = document.getElementById('panic-btn');
const addCallForm = document.getElementById('add-call-form');
const callTypeSelect = document.getElementById('call-type');
const callLocationInput = document.getElementById('call-location');

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
  "Missing Person",
  "Unavailable"
];

// Add unit manually
addUnitBtn.addEventListener('click', () => {
  const callsign = prompt("Enter unit's callsign:");
  if (!callsign) return;

  const name = prompt("Enter officer's name:");
  if (!name) return;

  const li = document.createElement('li');
  li.textContent = `${callsign} - ${name} `;
  li.dataset.available = "true";
  li.style.color = "green"; // available by default

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
  const location = callLocationInput.value.trim();
  if (!callType || !location) {
    return alert("Please enter both a call type and a location.");
  }

  const li = document.createElement('li');

  // Call type dropdown
  const callTypeDropdown = document.createElement('select');
  callTypes.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.text = type;
    if (type === callType) option.selected = true;
    callTypeDropdown.add(option);
  });
  li.appendChild(callTypeDropdown);

  // Editable location input
  const locationInputField = document.createElement('input');
  locationInputField.type = "text";
  locationInputField.value = location;
  locationInputField.style.display = "block";
  locationInputField.style.fontStyle = "italic";
  locationInputField.style.marginTop = "5px";
  li.appendChild(locationInputField);

  locationInputField.addEventListener('change', () => {
    const newLocation = locationInputField.value.trim();
    if (!newLocation) alert("Location cleared. You can type a new location.");
  });

  // Assigned units
  const assignedSpan = document.createElement('span');
  assignedSpan.className = "assigned-units";
  assignedSpan.textContent = "None";
  li.appendChild(document.createElement('br'));
  li.appendChild(document.createTextNode("Assigned Units: "));
  li.appendChild(assignedSpan);

  // Unit assignment dropdown
  const assignSelect = document.createElement('select');
  const defaultOption = document.createElement('option');
  defaultOption.text = "Assign Unit";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  assignSelect.add(defaultOption);
  li.appendChild(assignSelect);

  const removeUnitBtns = document.createElement('div');
  li.appendChild(removeUnitBtns);

  // Assign unit
  assignSelect.addEventListener('change', () => {
    const selectedUnitText = assignSelect.value;
    const unitLi = Array.from(unitList.children).find(u => u.textContent.replace("Remove", "").trim() === selectedUnitText);
    if (!unitLi || unitLi.dataset.available === "false") {
      alert("Unit unavailable.");
      assignSelect.value = "";
      return;
    }

    unitLi.dataset.available = "false";
    unitLi.style.opacity = "0.5";
    unitLi.style.color = "red"; // mark as on call

    if (assignedSpan.textContent === "None") {
      assignedSpan.textContent = selectedUnitText;
    } else {
      assignedSpan.textContent += `, ${selectedUnitText}`;
    }

    const removeBtn = document.createElement('button');
    removeBtn.textContent = `Remove ${selectedUnitText}`;
    removeBtn.style.marginLeft = "5px";
    removeBtn.addEventListener('click', () => {
      const currentUnits = assignedSpan.textContent.split(", ").filter(u => u !== selectedUnitText);
      assignedSpan.textContent = currentUnits.length ? currentUnits.join(", ") : "None";

      unitLi.dataset.available = "true";
      unitLi.style.opacity = "1";
      unitLi.style.color = "green"; // mark as available
      removeUnitBtns.removeChild(removeBtn);
      updateCallUnitDropdowns();
    });

    removeUnitBtns.appendChild(removeBtn);
    assignSelect.value = "";
    updateCallUnitDropdowns();
  });

  // Delete call
  const deleteCallBtn = document.createElement('button');
  deleteCallBtn.textContent = "Delete Call";
  deleteCallBtn.style.marginLeft = "10px";
  deleteCallBtn.addEventListener('click', () => {
    if (assignedSpan.textContent !== "None") {
      const units = assignedSpan.textContent.split(", ");
      units.forEach(uText => {
        const unitLi = Array.from(unitList.children).find(li => li.textContent.replace("Remove", "").trim() === uText);
        if (unitLi) {
          unitLi.dataset.available = "true";
          unitLi.style.opacity = "1";
          unitLi.style.color = "green";
        }
      });
    }
    callList.removeChild(li);
    updateCallUnitDropdowns();
  });

  li.appendChild(deleteCallBtn);

  callList.appendChild(li);
  updateCallUnitDropdowns();

  addCallForm.reset();
});

// Update dropdowns
function updateCallUnitDropdowns() {
  const activeUnits = Array.from(unitList.children)
    .filter(li => li.dataset.available === "true")
    .map(li => li.textContent.replace("Remove", "").trim());

  const allDropdowns = callList.querySelectorAll("select");

  allDropdowns.forEach(dropdown => {
    if (Array.from(dropdown.options).some(o => callTypes.includes(o.value))) return;
    while (dropdown.options.length > 1) dropdown.remove(1);

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
