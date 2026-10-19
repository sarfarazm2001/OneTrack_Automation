(function runSolisCalc() {
  const initialParts = [
    { name: "Hub Service Labor Rate (ONLY SELECT WHEN NOTHING ELSE IS REPLACED BY OEM)", pn: "LABOR" },
    { name: "ADHESIVE, PSA, PIEZO RING, CADD-SOLIS 1/EA", pn: "30-3285" },
    { name: "AIR DETECTOR, SOLIS", pn: "70-0446" },
    { name: "AY, 27MM PIEZO SOUNDER, FRONT", pn: "70-0354" },
    { name: "AY, 27MM PIEZO SOUNDER, REAR", pn: "70-0447" },
    { name: "AY, USO, CADD-SOLIS 1/EA", pn: "67-2341" },
    { name: "BEARING, CAMSHAFT", pn: "60013" },
    { name: "BEARING, CAMSHAFT, .375\" OD X 0.187\" ID, CADD-SOLIS 1/EA", pn: "30-3028" },
    { name: "BEZEL, CASSETTE DETECTION", pn: "30-3052" },
    { name: "BEZEL, DSO, CADD-SOLIS", pn: "30-3028" },
    { name: "BRACKET, OPTICAL SWITCH, CADD-SOLIS", pn: "30-3052" },
    { name: "CAMSHAFT, 3 LOBE, DUAL ACTIVATION", pn: "31-0485" },
    { name: "CONNECTOR, LEMO HALF MOON INSERT (NUT FIXING) FIXED RECEPTACLE, CADD-SOLIS", pn: "10018270-001" },
    { name: "CONTACT, BATTERY COMPARTMENT FLOOR", pn: "70-0227" },
    { name: "CONTACT, BATTERY, SPRING PIN, CADD-SOLIS", pn: "70-0178" },
    { name: "DISK, OPTICAL, DUAL FLAG, CADD-SOLIS", pn: "30-3053" },
    { name: "DISPLAY, LCD, TRULY/HIMAX, 320 X 320 W/BACKLIGHT, CADD-SOLIS", pn: "70-0508" },
    { name: "DOOR AY, BATTERY, PUMP", pn: "30-3245" },
    { name: "DOOR AY, BATTERY, PUMP (Do Not Use)", pn: "10022677-001" },
    { name: "EXPULSOR, MACHINED, .344\"", pn: "30-3086-001" },
    { name: "FLEX AY, CAM SENSOR", pn: "70-0243" },
    { name: "FLEX AY, LED, CADD-SOLIS", pn: "70-0301" },
    { name: "FLEX CIRCUIT, SENSOR, L/L", pn: "70-0335" },
    { name: "FOAM, ISOLATION, LCD", pn: "30-3181" },
    { name: "FOAM, POSITIONING, LCD", pn: "30-3173" },
    { name: "GASKET, CONDUCTIVE, BAT COMP", pn: "30-3174" },
    { name: "GASKET, CONDUCTIVE, CHASSIS", pn: "30-3173" },
    { name: "GASKET, CONDUCTIVE, COPPER, RIGHT", pn: "N/A" },
    { name: "GASKET, CONDUCTIVE, LCD, TOP", pn: "N/A" },
    { name: "GASKET, CONDUCTIVE, LCD/FRAMING", pn: "N/A" },
    { name: "GASKET, ENVIRONMENTAL, BATTERY COMPARTMENT", pn: "30-3289" },
    { name: "GASKET, ENVIRONMENTAL, CHASSIS", pn: "30-3171" },
    { name: "GASKET, ENVIRONMENTAL, POWER BOARD", pn: "30-3171" },
    { name: "GASKET, PERIMETER, EMC", pn: "30-3167" },
    { name: "GASKET, PSA, LENS, CADD SOLIS", pn: "30-3288" },
    { name: "GASKET, TUBING, SILICON HOUSING", pn: "60002" },
    { name: "GEAR, FLAT", pn: "60003" },
    { name: "GEAR, HUB (FASTENS TO MOTOR)", pn: "60002" },
    { name: "GEARMOTOR, PLANETARY, 12V, 16MM", pn: "10009592" },
    { name: "GUARD, PIEZO ALARM", pn: "30-3299" },
    { name: "HANDLE, LATCH LEVER, CADD-SOLIS", pn: "30-4106" },
    { name: "HARNESS, WIRE, ON/OFF SWITCH", pn: "70-0216" },
    { name: "HSG, BATTERY COMPARTMENT", pn: "30-3248" },
    { name: "HSG, PUMP, FRONT, SHLD", pn: "30-4065" },
    { name: "HSG, PUMP, REAR SHLD", pn: "70-0229" },
    { name: "INSULATOR, KAPTON, CADD SOLIS", pn: "30-3106" },
    { name: "INSULATOR, PWA/HOUSING", pn: "30-3322" },
    { name: "INSULATOR, USB", pn: "30-4065" },
    { name: "KEYPAD, MEMBRANE SW, W/O CONN, CADD-SOLIS", pn: "70-0229" },
    { name: "LABEL, PUMP, REAR, CADD SOLIS VIP", pn: "10011174-001" },
    { name: "LATCH/LOCK", pn: "67-2482" },
    { name: "LBL, DEVICE, PUMP, CADD-SOLIS, MODEL 2120, VIP, 3RD EDITION w cUL, BLUE, RX ONLY", pn: "10017410-001" },
    { name: "LBL, DEVICE, PUMP, CADD-SOLIS, MODEL 2120, VIP, 3RD EDITION w cUL, BLUE, RX ONLY, COSTA RICA", pn: "10017410-001" },
    { name: "LBL, DEVICE, PUMP, CADD-SOLIS, MODEL 2120, VIP, 3RD EDITION w cUL, DRK GREY, RX ONLY", pn: "10017409-001" },
    { name: "LBL, DEVICE, PUMP, CADD-SOLIS, VIP 1.2", pn: "10006271-002" },
    { name: "LBL, DEVICE, PUMP, CADD-SOLIS, VIP, BLACK", pn: "10012921-001" },
    { name: "LBL, DEVICE, PUMP, CADD-SOLIS, VIP, BLUE", pn: "10013249-001" },
    { name: "LBL, SET, DEVICE, CADD-SOLIS", pn: "40-6288-24A" },
    { name: "LENS, PAD PRINTED, CADD SOLIS", pn: "40-5733-51A" },
    { name: "NLT - HEADER, IDC, 5 POS", pn: "40-6288-24A" },
    { name: "OVERLAY, MEMBRANE SWITCH (KEYPAD), CADD-SOLIS, 21-2101-08", pn: "21-2101-08" },
    { name: "OVERLAY, MEMBRANE SWITCH, CE ENGLISH", pn: "31-0993" },
    { name: "PAD, GND, L/L SENSOR", pn: "70-0171" },
    { name: "PCBA, CADD-SOLIS, FUSED", pn: "N/A" },
    { name: "PCBA, CADD-SOLIS, TRULY/HIMAX LCD, FLASH MEMORY UPGRADE", pn: "30-4712" },
    { name: "PIN, CASSETTE DETECTOR", pn: "10015258-001" },
    { name: "PLATE, AY, GROUNDING", pn: "30-3163" },
    { name: "SEAL, DIAPHRAGM, CASSETTE SENSOR", pn: "30-4086" },
    { name: "SEAL, DSO, NEOPRENE", pn: "30-4085" },
    { name: "SEAL, FOAM, CADD-SOLIS", pn: "30-3381" },
    { name: "SEAL, UPSTREAM OCCLUSION", pn: "31-0993" },
    { name: "SENSOR, DSO, CADD-SOLIS", pn: "30-4712" },
    { name: "SOLIS, CHASSIS, MACHINED 1/EA", pn: "30-4712" },
    { name: "STABILIZER, BATTERY, SST", pn: "30-3294" },
    { name: "STRIP, ADHESIVE, UPPER", pn: "30-3294" },
    { name: "SWITCH, POWER", pn: "30-3163" },
    { name: "TAB, LCD INSTALLATION", pn: "N/A" },
    { name: "TAPE, ADHESIVE, PIEZO GUARD", pn: "N/A" },
    { name: "TAPE, LCD HOLD DOWN", pn: "30-3306" },
    { name: "TAPE, POGO CONTACT", pn: "30-4085" },
    { name: "VALVE, DUAL ACTIVATION, CADD-SOLIS", pn: "30-3063" }
  ];

  function getStoredParts() {
    try {
      const stored = localStorage.getItem("solis_parts_list_v1");
      if (stored) return JSON.parse(stored);
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

  let overlay = document.createElement("div");
  overlay.id = "solis-calc-modal";
  overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;";

  let box = document.createElement("div");
  box.style.cssText = "background:#fff;padding:20px;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.3);width:580px;text-align:left;color:#333;";

  let html = `
    <h3 style="margin-top:0;margin-bottom:12px;font-size:16px;text-align:center;color:#222;">Solis Findings Generator</h3>
    
    <!-- IO Toolbar -->
    <div style="display:flex;gap:8px;margin-bottom:12px;background:#f8f9fa;padding:8px;border-radius:6px;border:1px solid #e9ecef;">
      <button id="s_export_btn" style="flex:1;padding:6px 10px;background:#17a2b8;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:11px;font-weight:bold;">📤 Export Source (.js)</button>
      <button id="s_import_btn" style="flex:1;padding:6px 10px;background:#6f42c1;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:11px;font-weight:bold;">📥 Import Parts File</button>
      <input type="file" id="s_file_input" accept=".js,.json" style="display:none;">
    </div>

    <!-- Manual Entry Controls -->
    <div style="display:flex;gap:6px;margin-bottom:10px;">
      <input type="text" id="s_custom_desc" placeholder="Part Description" style="flex:2;padding:6px 8px;border:1px solid #ccc;border-radius:4px;font-size:12px;">
      <input type="text" id="s_custom_pn" placeholder="Part #" style="flex:1;padding:6px 8px;border:1px solid #ccc;border-radius:4px;font-size:12px;">
      <button id="s_add_btn" style="padding:6px 12px;background:#007bff;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;">+ Add</button>
    </div>

    <!-- Parts List Container -->
    <div id="s_parts_list" style="max-height:240px;overflow-y:auto;margin-bottom:12px;"></div>

    <!-- Action Buttons -->
    <div style="display:flex;gap:8px;">
      <button id="s_back" style="flex:1;padding:10px;background:#6c757d;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;">← Back</button>
      <button id="s_copy" style="flex:1.2;padding:10px;background:#28a745;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;">Apply</button>
      <button id="s_cancel" style="flex:1;padding:10px;background:#dc3545;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;">Cancel</button>
    </div>
  `;

  box.innerHTML = html;
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const getCurrentPartsFromDOM = () => {
    const rows = Array.from(document.querySelectorAll("#s_parts_list .part_row"));
    return rows.map(r => ({
      name: r.querySelector(".desc_txt").innerText.trim(),
      pn: r.querySelector(".pn_txt").innerText.trim()
    }));
  };

  const attachRowEvents = (row) => {
    row.querySelector(".s_edit_btn").onclick = () => {
      let newDesc = prompt("Edit Part Description:", row.querySelector(".desc_txt").innerText);
      if (newDesc !== null && newDesc.trim() !== "") {
        let newPn = prompt("Edit Part Number:", row.querySelector(".pn_txt").innerText);
        if (newPn !== null && newPn.trim() !== "") {
          row.querySelector(".desc_txt").innerText = newDesc.trim();
          let chk = row.querySelector(".s_chk");
          chk.value = newDesc.trim();
          chk.dataset.pn = newPn.trim();
          row.querySelector(".pn_txt").innerText = newPn.trim();
          saveStoredParts(getCurrentPartsFromDOM());
        } else {
          alert("Part Number cannot be blank.");
        }
      }
    };
    row.querySelector(".s_del_btn").onclick = () => { 
      row.remove(); 
      saveStoredParts(getCurrentPartsFromDOM());
    };
  };

  const renderPartsList = (partsData) => {
    let listContainer = document.getElementById("s_parts_list");
    listContainer.innerHTML = "";
    
    let freq = getFreq();
    partsData.sort((a, b) => (freq[b.name] || 0) - (freq[a.name] || 0));

    partsData.forEach((p) => {
      let row = document.createElement("div");
      row.className = "part_row";
      row.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:4px 0;font-size:12px;border-bottom:1px solid #f0f0f0;";
      row.innerHTML = `
        <label style="display:flex;align-items:center;cursor:pointer;flex:1;margin-right:10px;">
          <input type="checkbox" class="s_chk" data-pn="${p.pn}" value="${p.name}" style="margin-right:8px;transform:scale(1.1);flex-shrink:0;">
          <span class="desc_txt">${p.name}</span>
        </label>
        <div style="display:flex;align-items:center;gap:6px;">
          <span class="pn_txt" style="color:#666;font-family:monospace;white-space:nowrap;margin-right:4px;">${p.pn}</span>
          <button class="s_edit_btn" style="padding:2px 6px;font-size:10px;background:#ffc107;color:#000;border:none;border-radius:3px;cursor:pointer;">Edit</button>
          <button class="s_del_btn" style="padding:2px 6px;font-size:10px;background:#dc3545;color:#fff;border:none;border-radius:3px;cursor:pointer;">Delete</button>
        </div>
      `;
      listContainer.appendChild(row);
      attachRowEvents(row);
    });
  };

  renderPartsList(getStoredParts());

  document.getElementById("s_export_btn").onclick = () => {
    const currentParts = getCurrentPartsFromDOM();
    const selfCode = runSolisCalc.toString();
    const partsJson = JSON.stringify(currentParts, null, 4);
    
    const modifiedCode = `(${selfCode})()`.replace(
      /const initialParts = \[[\s\S]*?\];/,
      `const initialParts = ${partsJson};`
    );

    const blob = new Blob([modifiedCode], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "solis_findings_generator.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  document.getElementById("s_import_btn").onclick = () => {
    document.getElementById("s_file_input").click();
  };

  document.getElementById("s_file_input").onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const fileContent = event.target.result;
        let importedParts = [];

        if (file.name.endsWith(".json")) {
          importedParts = JSON.parse(fileContent);
        } else if (file.name.endsWith(".js")) {
          const match = fileContent.match(/const initialParts = (\[[\s\S]*?\]);/) || fileContent.match(/let parts = (\[[\s\S]*?\]);/);
          if (match && match[1]) {
            importedParts = JSON.parse(match[1]);
          } else {
            throw new Error("Could not parse parts array from the JS file.");
          }
        }

        if (Array.isArray(importedParts) && importedParts.length > 0) {
          saveStoredParts(importedParts);
          renderPartsList(importedParts);
          alert(`Successfully imported ${importedParts.length} parts!`);
        } else {
          alert("Import failed: No valid parts list found.");
        }
      } catch (err) {
        alert("Error reading file: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  document.getElementById("s_add_btn").onclick = () => {
    let desc = document.getElementById("s_custom_desc").value.trim();
    let pn = document.getElementById("s_custom_pn").value.trim();
    if (!desc || !pn) { alert("Both Part Description and Part # are required."); return; }
    
    let current = getStoredParts();
    current.unshift({ name: desc, pn: pn });
    saveStoredParts(current);
    renderPartsList(current);

    document.getElementById("s_custom_desc").value = "";
    document.getElementById("s_custom_pn").value = "";
  };

  document.getElementById("s_cancel").onclick = () => document.body.removeChild(overlay);
  
  document.getElementById("s_back").onclick = () => {
    document.body.removeChild(overlay);
    if (typeof window.openOneTrackToolkit === "function") {
      window.openOneTrackToolkit();
    }
  };

  document.getElementById("s_copy").onclick = () => {
    let checkedBoxes = Array.from(box.querySelectorAll(".s_chk:checked"));
    checkedBoxes.forEach(cb => recordUsage(cb.value));

    let physicalParts = checkedBoxes.filter(cb => cb.dataset.pn !== "LABOR").map(cb => cb.value);
    let hasLabor = checkedBoxes.some(cb => cb.dataset.pn === "LABOR");

    let text = "";
    const testBlock = "Visual Inspection, Pump Power Up Test, Motor Test, Remote Dose Test, Keypad Test, Latch Lock Test, Disposable Test, Air Detector Test, Verify Air Detector Height, LCD Screen Inspection, Amber Green and LED Functional Test, Adjust LCD POT Screen, Downstream Occlusion Test, Upstream Occlusion Sensor Test, Battery Fallout Test, 50ml Cassette Test, Go_No_Go Test, and Delivery Accuracy Test 20mL.";

    if (hasLabor && physicalParts.length === 0) {
      text = `The OEM certifies that the device passes the following: ${testBlock}`;
    } else if (physicalParts.length > 0) {
      text = `Per the OEM, the following parts have been replaced: ${physicalParts.join(", ")} and passed the related testing. The OEM also certifies that the device passes the following: ${testBlock}`;
    } else {
      text = `The OEM certifies that the device passes the following: ${testBlock}`;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch((err) => console.warn("Clipboard copy failed:", err));
    }

    document.body.removeChild(overlay);

    let target = document.querySelector("#addActualFindingsModal textarea") || document.getElementById("note") || document.querySelector('textarea[name="Notes"]') || document.querySelector("textarea");
    if (target) {
      target.focus();
      let setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
      if (setter) setter.call(target, text); else target.value = text;
      target.dispatchEvent(new Event("input", { bubbles: true }));
      target.dispatchEvent(new Event("change", { bubbles: true }));
      target.dispatchEvent(new Event("blur", { bubbles: true }));
    } else {
      alert("Textarea not found. Findings copied to clipboard!");
    }
  };

  // --- DIAGNOSTIC OCR AUTO-SELECT ENGINE FOR SOLIS ---
  window._otAutoSelectSolis = function(ocrText) {
    console.log("%c[Solis OCR Auto-Select] Started analyzing scan text...", "color: #007bff; font-weight: bold;");

    if (!ocrText || typeof ocrText !== "string") {
      console.error("[Solis OCR Auto-Select] ERROR: Received empty or invalid OCR input text:", ocrText);
      return 0;
    }

    console.log("[Solis OCR Auto-Select] RAW OCR TEXT INPUT:\n", ocrText);

    const checkboxes = box.querySelectorAll('.s_chk');
    if (!checkboxes || checkboxes.length === 0) {
      console.error("[Solis OCR Auto-Select] ERROR: Could not find any part checkboxes (.s_chk) inside Solis modal!");
      return 0;
    }

    // Normalize OCR Text (Fix zero/O confusion, double spaces, and newline splits)
    const rawText = ocrText.toUpperCase().trim();
    const normText = rawText
      .replace(/[\r\n]+/g, ' ')
      .replace(/0/g, 'O')
      .replace(/5/g, 'S')
      .replace(/[\s,\-\/]+/g, ' ');

    console.log("[Solis OCR Auto-Select] NORMALIZED SCAN TEXT:\n", normText);

    let matchedCount = 0;
    const matchedDetails = [];

    checkboxes.forEach((chk) => {
      const partName = (chk.value || '').toUpperCase().trim();

      if (!partName || partName.includes("ONLY SELECT WHEN NOTHING") || partName.includes("DO NOT USE")) return;

      let isMatched = false;
      let matchReason = "";

      // 1. HSG, BATTERY COMPARTMENT
      if (partName === 'HSG, BATTERY COMPARTMENT' && (normText.includes("BATTERY") && (normText.includes("COMPARTMENT") || normText.includes("HSG") || normText.includes("HOUSING")))) {
        isMatched = true;
        matchReason = "Rule: Battery Compartment Housing";
      }

      // 2. DOOR AY, BATTERY, PUMP
      else if (partName === 'DOOR AY, BATTERY, PUMP' && (normText.includes("DOOR") && (normText.includes("BATTERY") || normText.includes("PUMP")))) {
        isMatched = true;
        matchReason = "Rule: Battery Pump Door";
      }

      // 3. SEAL, DSO, NEOPRENE
      else if (partName === 'SEAL, DSO, NEOPRENE' && (normText.includes("NEOPRENE") || (normText.includes("SEAL") && (normText.includes("DSO") || normText.includes("DS0"))))) {
        isMatched = true;
        matchReason = "Rule: DSO Neoprene Seal";
      }

      // 4. OVERLAY, MEMBRANE SWITCH 21-2101-08
      else if (partName.includes('21-2101-08') && (normText.includes("21-21O1") || normText.includes("2121O1") || normText.includes("21-2101") || (normText.includes("OVERLAY") && normText.includes("KEYPAD")))) {
        isMatched = true;
        matchReason = "Rule: Keypad Overlay 21-2101";
      }

      // 5. OVERLAY, CE ENGLISH
      else if (partName === 'OVERLAY, MEMBRANE SWITCH, CE ENGLISH' && normText.includes("OVERLAY") && (normText.includes("ENGLISH") || normText.includes("CE")) && !normText.includes("KEYPAD")) {
        isMatched = true;
        matchReason = "Rule: CE English Overlay";
      }

      // 6. KEYPAD, MEMBRANE SW
      else if (partName === 'KEYPAD, MEMBRANE SW, W/O CONN, CADD-SOLIS' && (normText.includes("KEYPAD") && (normText.includes("MEMBRANE") || normText.includes("CONN") || normText.includes("SW")))) {
        isMatched = true;
        matchReason = "Rule: Keypad Membrane Switch";
      }

      // 7. LBL SET DEVICE
      else if (partName.includes('LBL, SET, DEVICE') && (normText.includes("LBL") || normText.includes("LABEL")) && normText.includes("SET")) {
        isMatched = true;
        matchReason = "Rule: Device Label Set";
      }

      // 8. LENS PAD PRINTED
      else if (partName.includes('LENS, PAD PRINTED') && normText.includes("LENS") && (normText.includes("PAD") || normText.includes("PRINTED"))) {
        isMatched = true;
        matchReason = "Rule: Pad Printed Lens";
      }

      // 9. MODEL 2120 LABELS
      else if (partName.includes("MODEL 2120")) {
        if (normText.includes("2120") || normText.includes("MODEL")) {
          if (partName.includes("COSTA RICA") && (normText.includes("COSTA") || normText.includes("RICA"))) {
            isMatched = true;
            matchReason = "Rule: Model 2120 Costa Rica Label";
          } else if (partName.includes("DRK GREY") && (normText.includes("DRK") || normText.includes("GREY") || normText.includes("GRAY"))) {
            isMatched = true;
            matchReason = "Rule: Model 2120 Dark Grey Label";
          } else if (partName.includes("BLUE, RX ONLY") && !partName.includes("COSTA RICA") && normText.includes("BLUE") && !normText.includes("COSTA") && !normText.includes("GREY") && !normText.includes("GRAY")) {
            isMatched = true;
            matchReason = "Rule: Model 2120 Blue Label";
          }
        }
      }

      // 10. FUZZY TOKEN FALLBACK FOR UNMATCHED PARTS
      else {
        const stopWords = ['CADD', 'SOLIS', 'PUMP', 'DEVICE', 'MODEL', 'WITH', 'FROM', 'CONN', '1/EA', 'ONLY', 'AY', 'SW', 'REPLACED', 'PARTS'];
        const tokens = partName
          .replace(/[^A-Z0-9\s]/g, ' ')
          .split(/\s+/)
          .filter(w => w.length >= 3 && !stopWords.includes(w));

        if (tokens.length > 0) {
          let hits = tokens.filter(tok => normText.includes(tok));
          if (hits.length >= 2 || (tokens.length === 1 && hits.length === 1 && tokens[0].length >= 5)) {
            isMatched = true;
            matchReason = `Token Match (${hits.length}/${tokens.length}): [${hits.join(', ')}]`;
          }
        }
      }

      if (isMatched) {
        if (!chk.checked) {
          chk.checked = true;
          chk.dispatchEvent(new Event('change', { bubbles: true }));
        }
        matchedCount++;
        matchedDetails.push({ part: partName, reason: matchReason });
      }
    });

    if (matchedCount > 0) {
      console.log(`%c[Solis OCR Auto-Select] SUCCESS: Matched and selected ${matchedCount} part(s):`, "color: #28a745; font-weight: bold;", matchedDetails);
    } else {
      console.error("[Solis OCR Auto-Select] WARNING: 0 parts were matched. Inspect the RAW and NORMALIZED OCR text above to verify why tokens didn't hit.");
    }

    return matchedCount;
  };

  window._otCurrentOEMTool = {
    id: 'solis',
    autoSelect: window._otAutoSelectSolis
  };
})();
