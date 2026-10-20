(function runSolisCalc() {
  const initialParts = [
    "Hub Service Labor Rate (ONLY SELECT WHEN NOTHING ELSE IS REPLACED BY OEM)",
    "ADHESIVE, PSA, PIEZO RING, CADD-SOLIS 1/EA",
    "AIR DETECTOR, SOLIS",
    "AY, 27MM PIEZO SOUNDER, FRONT",
    "AY, 27MM PIEZO SOUNDER, REAR",
    "AY, USO, CADD-SOLIS 1/EA",
    "BEARING, CAMSHAFT",
    "BEARING, CAMSHAFT, .375\" OD X 0.187\" ID, CADD-SOLIS 1/EA",
    "BEZEL, CASSETTE DETECTION",
    "BEZEL, DSO, CADD-SOLIS",
    "BRACKET, OPTICAL SWITCH, CADD-SOLIS",
    "CAMSHAFT, 3 LOBE, DUAL ACTIVATION",
    "CONNECTOR, LEMO HALF MOON INSERT (NUT FIXING) FIXED RECEPTACLE, CADD-SOLIS",
    "CONTACT, BATTERY COMPARTMENT FLOOR",
    "CONTACT, BATTERY, SPRING PIN, CADD-SOLIS",
    "DISK, OPTICAL, DUAL FLAG, CADD-SOLIS",
    "DISPLAY, LCD, TRULY/HIMAX, 320 X 320 W/BACKLIGHT, CADD-SOLIS",
    "DOOR AY, BATTERY, PUMP",
    "DOOR AY, BATTERY, PUMP (Do Not Use)",
    "EXPULSOR, MACHINED, .344\"",
    "FLEX AY, CAM SENSOR",
    "FLEX AY, LED, CADD-SOLIS",
    "FLEX CIRCUIT, SENSOR, L/L",
    "FOAM, ISOLATION, LCD",
    "FOAM, POSITIONING, LCD",
    "GASKET, CONDUCTIVE, BAT COMP",
    "GASKET, CONDUCTIVE, CHASSIS",
    "GASKET, CONDUCTIVE, COPPER, RIGHT",
    "GASKET, CONDUCTIVE, LCD, TOP",
    "GASKET, CONDUCTIVE, LCD/FRAMING",
    "GASKET, ENVIRONMENTAL, BATTERY COMPARTMENT",
    "GASKET, ENVIRONMENTAL, CHASSIS",
    "GASKET, ENVIRONMENTAL, POWER BOARD",
    "GASKET, PERIMETER, EMC",
    "GASKET, PSA, LENS, CADD SOLIS",
    "GASKET, TUBING, SILICON HOUSING",
    "GEAR, FLAT",
    "GEAR, HUB (FASTENS TO MOTOR)",
    "GEARMOTOR, PLANETARY, 12V, 16MM",
    "GUARD, PIEZO ALARM",
    "HANDLE, LATCH LEVER, CADD-SOLIS",
    "HARNESS, WIRE, ON/OFF SWITCH",
    "HSG, BATTERY COMPARTMENT",
    "HSG, PUMP, FRONT, SHLD",
    "HSG, PUMP, REAR SHLD",
    "INSULATOR, KAPTON, CADD SOLIS",
    "INSULATOR, PWA/HOUSING",
    "INSULATOR, USB",
    "KEYPAD, MEMBRANE SW, W/O CONN, CADD-SOLIS",
    "LABEL, PUMP, REAR, CADD SOLIS VIP",
    "LATCH/LOCK",
    "LBL, DEVICE, PUMP, CADD-SOLIS, MODEL 2120, VIP, 3RD EDITION w cUL, BLUE, RX ONLY",
    "LBL, DEVICE, PUMP, CADD-SOLIS, MODEL 2120, VIP, 3RD EDITION w cUL, BLUE, RX ONLY, COSTA RICA",
    "LBL, DEVICE, PUMP, CADD-SOLIS, MODEL 2120, VIP, 3RD EDITION w cUL, DRK GREY, RX ONLY",
    "LBL, DEVICE, PUMP, CADD-SOLIS, VIP 1.2",
    "LBL, DEVICE, PUMP, CADD-SOLIS, VIP, BLACK",
    "LBL, DEVICE, PUMP, CADD-SOLIS, VIP, BLUE",
    "LBL, SET, DEVICE, CADD-SOLIS",
    "LENS, PAD PRINTED, CADD SOLIS",
    "NLT - HEADER, IDC, 5 POS",
    "OVERLAY, MEMBRANE SWITCH (KEYPAD), CADD-SOLIS, 21-2101-08",
    "OVERLAY, MEMBRANE SWITCH, CE ENGLISH",
    "PAD, GND, L/L SENSOR",
    "PCBA, CADD-SOLIS, FUSED",
    "PCBA, CADD-SOLIS, TRULY/HIMAX LCD, FLASH MEMORY UPGRADE",
    "PIN, CASSETTE DETECTOR",
    "PLATE, AY, GROUNDING",
    "SEAL, DIAPHRAGM, CASSETTE SENSOR",
    "SEAL, DSO, NEOPRENE",
    "SEAL, FOAM, CADD-SOLIS",
    "SEAL, UPSTREAM OCCLUSION",
    "SENSOR, DSO, CADD-SOLIS",
    "SOLIS, CHASSIS, MACHINED 1/EA",
    "STABILIZER, BATTERY, SST",
    "STRIP, ADHESIVE, UPPER",
    "SWITCH, POWER",
    "TAB, LCD INSTALLATION",
    "TAPE, ADHESIVE, PIEZO GUARD",
    "TAPE, LCD HOLD DOWN",
    "TAPE, POGO CONTACT",
    "VALVE, DUAL ACTIVATION, CADD-SOLIS"
  ];

  function getStoredParts() {
    try {
      const stored = localStorage.getItem("solis_parts_list_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(p => typeof p === 'string' ? p : (p.name || p));
        }
      }
    } catch (e) {}
    localStorage.setItem("solis_parts_list_v1", JSON.stringify(initialParts));
    return initialParts;
  }

  function saveStoredParts(list) {
    localStorage.setItem("solis_parts_list_v1", JSON.stringify(list));
  }

  function getFreq() {
    try { return JSON.parse(localStorage.getItem('ot_freq_solis') || '{}'); }
    catch(e) { return {}; }
  }

  function recordUsage(partName) {
    let freq = getFreq();
    freq[partName] = (freq[partName] || 0) + 1;
    localStorage.setItem('ot_freq_solis', JSON.stringify(freq));
  }

  function applyTextToDOM(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch((err) => console.warn("Clipboard copy failed:", err));
    }

    let target = document.querySelector("#addActualFindingsModal textarea") ||
                 document.getElementById("note") ||
                 document.querySelector('textarea[name="Notes"]') ||
                 document.querySelector('textarea[name="Finding"]') ||
                 document.querySelector("textarea");

    if (target) {
      target.focus();
      let setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
      if (setter) setter.call(target, text); else target.value = text;
      target.dispatchEvent(new Event("input", { bubbles: true }));
      target.dispatchEvent(new Event("change", { bubbles: true }));
      target.dispatchEvent(new Event("blur", { bubbles: true }));
    } else {
      alert("Textarea not found. Findings copied to clipboard!");
    }
  }

  const existing = document.getElementById("solis-oem-modal");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "solis-oem-modal";
  overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999999;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;";

  const box = document.createElement("div");
  box.style.cssText = "background:#1e2329;padding:20px;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.5);width:480px;max-height:85vh;display:flex;flex-direction:column;color:#f1f3f5;border:1px solid #2d333b;";

  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <h3 style="margin:0;font-size:16px;font-weight:700;color:#fff;">Solis Replaced Parts Generator</h3>
      <span id="s_close_x" style="cursor:pointer;font-size:20px;color:#8b949e;line-height:1;">&times;</span>
    </div>

    <!-- Search & Add Part Controls -->
    <div style="display:flex;gap:6px;margin-bottom:10px;">
      <input type="text" id="s_search" placeholder="🔍 Search parts..." style="flex:1;padding:8px;background:#161b22;color:#fff;border:1px solid #363d4a;border-radius:4px;font-size:12px;box-sizing:border-box;">
      <button id="s_add_btn" style="padding:8px 12px;background:#238636;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;white-space:nowrap;">➕ Add Part</button>
    </div>

    <!-- Parts List Box -->
    <div id="s_parts_list" style="overflow-y:auto;max-height:280px;display:flex;flex-direction:column;gap:6px;padding-right:4px;background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:8px;"></div>

    <!-- Import / Export Controls -->
    <div style="display:flex;gap:6px;margin-top:10px;padding-top:10px;border-top:1px solid #2d333b;">
      <button id="s_export_btn" style="flex:1;padding:7px;background:#316dca;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:11px;">📤 Export Source (.js)</button>
      <button id="s_import_btn" style="flex:1;padding:7px;background:#6e40c9;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:11px;">📥 Import Parts File</button>
      <input type="file" id="s_import_file_input" accept=".js,.json" style="display:none;">
    </div>

    <!-- Bottom Action Buttons -->
    <div style="display:flex;gap:8px;margin-top:12px;">
      <button id="s_reset_btn" title="Reset to defaults" style="padding:8px 12px;background:#484f58;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">↺ Reset</button>
      <button id="s_back" style="flex:1;padding:8px;background:#363d4a;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">← Back</button>
      <button id="s_copy" style="flex:1.2;padding:8px;background:#238636;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">Apply</button>
      <button id="s_cancel" style="flex:1;padding:8px;background:#da3633;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">Cancel</button>
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const listContainer = document.getElementById("s_parts_list");

  function renderParts(filter = "") {
    listContainer.innerHTML = "";
    const partsList = getStoredParts();
    const freq = getFreq();

    // Dynamic sorting based on frequency of use
    partsList.sort((a, b) => (freq[b] || 0) - (freq[a] || 0));

    partsList.forEach((partName) => {
      if (filter && !partName.toLowerCase().includes(filter.toLowerCase())) return;

      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;justify-content:space-between;background:#161b22;border:1px solid #30363d;border-radius:5px;padding:6px 8px;";

      const labelGroup = document.createElement("label");
      labelGroup.style.cssText = "display:flex;align-items:center;gap:8px;font-size:12px;color:#e6edf3;cursor:pointer;flex:1;";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "s_chk";
      checkbox.value = partName;
      checkbox.style.cssText = "transform:scale(1.1);cursor:pointer;";

      const labelText = document.createElement("span");
      labelText.textContent = partName;

      labelGroup.appendChild(checkbox);
      labelGroup.appendChild(labelText);
      row.appendChild(labelGroup);

      // Edit / Delete buttons
      const btnGroup = document.createElement("div");
      btnGroup.style.cssText = "display:flex;gap:4px;margin-left:8px;";

      const delBtn = document.createElement("button");
      delBtn.textContent = "✕";
      delBtn.title = "Delete Part";
      delBtn.style.cssText = "background:transparent;color:#da3633;border:none;cursor:pointer;font-weight:bold;font-size:12px;padding:2px 6px;";
      delBtn.onclick = (e) => {
        e.stopPropagation();
        const current = getStoredParts().filter(p => p !== partName);
        saveStoredParts(current);
        renderParts(document.getElementById("s_search").value);
      };

      btnGroup.appendChild(delBtn);
      row.appendChild(btnGroup);

      listContainer.appendChild(row);
    });
  }

  renderParts();

  // Real-time Search Listener
  document.getElementById("s_search").addEventListener("input", (e) => {
    renderParts(e.target.value);
  });

  // Add Custom Part Listener
  document.getElementById("s_add_btn").onclick = () => {
    const name = prompt("Enter New Part Description:");
    if (!name || !name.trim()) return;

    const list = getStoredParts();
    list.unshift(name.trim());
    saveStoredParts(list);
    renderParts(document.getElementById("s_search").value);
  };

  // Reset to Defaults
  document.getElementById("s_reset_btn").onclick = () => {
    if (confirm("Reset all parts back to initial defaults?")) {
      saveStoredParts(initialParts);
      renderParts(document.getElementById("s_search").value);
    }
  };

  // Export Script
  document.getElementById("s_export_btn").onclick = () => {
    const currentParts = getStoredParts();
    let scriptContent = runSolisCalc.toString();
    scriptContent = `(${scriptContent})();`;
    scriptContent = scriptContent.replace(/const initialParts = \[\s[\s\S]*?\];/, `const initialParts = ${JSON.stringify(currentParts, null, 2)};`);

    const blob = new Blob([scriptContent], { type: "application/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Solis_OEM_Generator.js";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import Script / Parts List
  const fileInput = document.getElementById("s_import_file_input");
  document.getElementById("s_import_btn").onclick = () => fileInput.click();

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const arrayMatch = text.match(/const initialParts = (\[[\s\S]*?\]);/);
        const imported = arrayMatch ? JSON.parse(arrayMatch[1]) : JSON.parse(text);

        if (Array.isArray(imported) && imported.length > 0) {
          const cleaned = imported.map(p => typeof p === 'string' ? p : (p.name || p));
          saveStoredParts(cleaned);
          renderParts(document.getElementById("s_search").value);
          alert(`Successfully imported ${cleaned.length} parts!`);
        } else throw new Error("Invalid format");
      } catch (err) {
        alert("Failed to parse imported file. Upload a valid .js or .json file.");
      }
    };
    reader.readAsText(file);
    fileInput.value = "";
  };

  // Apply Action
  document.getElementById("s_copy").onclick = () => {
    let checkedBoxes = Array.from(box.querySelectorAll(".s_chk:checked"));
    checkedBoxes.forEach(cb => recordUsage(cb.value));

    const laborPartName = "Hub Service Labor Rate (ONLY SELECT WHEN NOTHING ELSE IS REPLACED BY OEM)";
    let physicalParts = checkedBoxes.map(cb => cb.value).filter(name => name !== laborPartName);
    let hasLabor = checkedBoxes.some(cb => cb.value === laborPartName);

    const testBlock = "Visual Inspection, Pump Power Up Test, Motor Test, Remote Dose Test, Keypad Test, Latch Lock Test, Disposable Test, Air Detector Test, Verify Air Detector Height, LCD Screen Inspection, Amber Green and LED Functional Test, Adjust LCD POT Screen, Downstream Occlusion Test, Upstream Occlusion Sensor Test, Battery Fallout Test, 50ml Cassette Test, Go_No_Go Test, and Delivery Accuracy Test 20mL.";

    let text = "";
    if (hasLabor && physicalParts.length === 0) {
      text = `The OEM certifies that the device passes the following: ${testBlock}`;
    } else if (physicalParts.length > 0) {
      text = `Per the OEM, the following parts have been replaced: ${physicalParts.join(", ")} and passed the related testing. The OEM also certifies that the device passes the following: ${testBlock}`;
    } else {
      text = `The OEM certifies that the device passes the following: ${testBlock}`;
    }

    applyTextToDOM(text);
    overlay.remove();
  };

  const close = () => overlay.remove();
  document.getElementById("s_close_x").onclick = close;
  document.getElementById("s_cancel").onclick = close;
  overlay.onclick = (e) => { if (e.target === overlay) close(); };

  document.getElementById("s_back").onclick = () => {
    close();
    if (typeof window.openOneTrackToolkit === "function") {
      window.openOneTrackToolkit();
    }
  };
})();
