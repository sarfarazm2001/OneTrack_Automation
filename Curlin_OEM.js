(function runCurlinCalc() {
  const initialParts = [
    { name: "Hub Service Labor Rate (ONLY SELECT WHEN NOTHING ELSE IS REPLACED BY OEM)", pn: "LABOR" },
    { name: "DOOR ASSY, CURLIN 6000", pn: "350-2000" },
    { name: "LATCH ASSY, DOOR, CURLIN", pn: "350-2005" },
    { name: "BATTERY DOOR / COVER, CURLIN", pn: "350-2010" },
    { name: "KEYPAD / MEMBRANE SWITCH, CURLIN 6000", pn: "350-2015" },
    { name: "HOUSING, FRONT, CURLIN", pn: "350-2020" },
    { name: "HOUSING, REAR, CURLIN", pn: "350-2025" },
    { name: "PUMPING MECHANISM / FINGER ASSY", pn: "350-2030" },
    { name: "AIR IN LINE SENSOR, CURLIN", pn: "350-2035" },
    { name: "PRESSURE SENSOR, UPSTREAM / DOWNSTREAM", pn: "350-2040" },
    { name: "MAIN PCBA / CIRCUIT BOARD, CURLIN", pn: "350-2045" },
    { name: "POLE CLAMP ASSY, CURLIN", pn: "350-2050" },
    { name: "DISPLAY LCD SCREEN, CURLIN", pn: "350-2055" },
    { name: "GASKET / SEAL KIT, CURLIN", pn: "350-2060" }
  ];

  function getStoredParts() {
    try {
      const stored = localStorage.getItem("curlin_parts_list_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    localStorage.setItem("curlin_parts_list_v1", JSON.stringify(initialParts));
    return initialParts;
  }

  function saveStoredParts(list) {
    localStorage.setItem("curlin_parts_list_v1", JSON.stringify(list));
  }

  function getFreq() {
    try { return JSON.parse(localStorage.getItem('ot_freq_curlin') || '{}'); }
    catch(e) { return {}; }
  }

  function recordUsage(partName) {
    let freq = getFreq();
    freq[partName] = (freq[partName] || 0) + 1;
    localStorage.setItem('ot_freq_curlin', JSON.stringify(freq));
  }

  let existing = document.getElementById("curlin-calc-modal");
  if (existing) existing.remove();

  let overlay = document.createElement("div");
  overlay.id = "curlin-calc-modal";
  overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:999999;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;";

  let box = document.createElement("div");
  box.style.cssText = "background:#1e232a;padding:20px;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.6);width:520px;text-align:left;color:#f1f3f5;border:1px solid #2d333b;";

  let html = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <h3 style="margin:0;font-size:16px;font-weight:700;color:#fff;">Curlin Billing Calculator</h3>
      <span id="c_close_btn" style="cursor:pointer;font-size:18px;color:#8b949e;">&times;</span>
    </div>
    
    <!-- Controls Bar -->
    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <input type="text" id="c_search_input" placeholder="🔍 Search parts..." style="flex:1;padding:8px 10px;background:#0d1117;color:#fff;border:1px solid #30363d;border-radius:6px;font-size:12px;">
      <button id="c_add_btn" style="padding:8px 14px;background:#238636;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:bold;">+ Add Part</button>
    </div>

    <!-- IO Toolbar -->
    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button id="c_export_btn" style="flex:1;padding:8px;background:#3b5998;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:11px;font-weight:bold;">📤 Export Source (.js)</button>
      <button id="c_import_btn" style="flex:1;padding:8px;background:#6f42c1;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:11px;font-weight:bold;">📥 Import Parts File</button>
      <input type="file" id="c_file_input" accept=".js,.json" style="display:none;">
    </div>

    <!-- Parts List Container -->
    <div id="c_parts_list" style="max-height:260px;overflow-y:auto;margin-bottom:14px;background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:6px;"></div>

    <!-- Action Buttons -->
    <div style="display:flex;gap:8px;">
      <button id="c_reset" style="padding:10px 14px;background:#30363d;color:#e6edf3;border:1px solid #484f58;border-radius:6px;cursor:pointer;font-size:12px;font-weight:bold;">↺ Reset</button>
      <button id="c_back" style="padding:10px 14px;background:#30363d;color:#e6edf3;border:1px solid #484f58;border-radius:6px;cursor:pointer;font-size:12px;font-weight:bold;">← Back</button>
      <button id="c_copy" style="flex:1;padding:10px;background:#238636;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:bold;">Apply Findings</button>
      <button id="c_cancel" style="padding:10px 14px;background:#da3633;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:bold;">Cancel</button>
    </div>
  `;

  box.innerHTML = html;
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const getCurrentPartsFromDOM = () => {
    const rows = Array.from(document.querySelectorAll("#c_parts_list .part_row"));
    return rows.map(r => ({
      name: r.querySelector(".desc_txt").innerText.trim(),
      pn: r.querySelector(".pn_txt").innerText.trim()
    }));
  };

  const attachRowEvents = (row) => {
    row.querySelector(".c_edit_btn").onclick = () => {
      let newDesc = prompt("Edit Part Description:", row.querySelector(".desc_txt").innerText);
      if (newDesc !== null && newDesc.trim() !== "") {
        let newPn = prompt("Edit Part Number:", row.querySelector(".pn_txt").innerText);
        if (newPn !== null && newPn.trim() !== "") {
          row.querySelector(".desc_txt").innerText = newDesc.trim();
          let chk = row.querySelector(".c_chk");
          chk.value = newDesc.trim();
          chk.dataset.pn = newPn.trim();
          row.querySelector(".pn_txt").innerText = newPn.trim();
          saveStoredParts(getCurrentPartsFromDOM());
        }
      }
    };
    row.querySelector(".c_del_btn").onclick = () => { 
      row.remove(); 
      saveStoredParts(getCurrentPartsFromDOM());
    };
  };

  const renderPartsList = (partsData) => {
    let listContainer = document.getElementById("c_parts_list");
    listContainer.innerHTML = "";
    
    let freq = getFreq();
    partsData.sort((a, b) => (freq[b.name] || 0) - (freq[a.name] || 0));

    if (partsData.length === 0) {
      listContainer.innerHTML = `<div style="text-align:center;padding:20px;color:#8b949e;font-size:12px;">No parts found. Click "Reset" to restore defaults.</div>`;
      return;
    }

    partsData.forEach((p) => {
      let row = document.createElement("div");
      row.className = "part_row";
      row.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:6px;font-size:12px;border-bottom:1px solid #21262d;";
      row.innerHTML = `
        <label style="display:flex;align-items:center;cursor:pointer;flex:1;margin-right:10px;color:#f1f3f5;">
          <input type="checkbox" class="c_chk" data-pn="${p.pn}" value="${p.name}" style="margin-right:8px;transform:scale(1.1);flex-shrink:0;">
          <span class="desc_txt">${p.name}</span>
        </label>
        <div style="display:flex;align-items:center;gap:6px;">
          <span class="pn_txt" style="color:#8b949e;font-family:monospace;white-space:nowrap;margin-right:4px;">${p.pn}</span>
          <button class="c_edit_btn" style="padding:2px 6px;font-size:10px;background:#d29922;color:#fff;border:none;border-radius:3px;cursor:pointer;">Edit</button>
          <button class="c_del_btn" style="padding:2px 6px;font-size:10px;background:#da3633;color:#fff;border:none;border-radius:3px;cursor:pointer;">Delete</button>
        </div>
      `;
      listContainer.appendChild(row);
      attachRowEvents(row);
    });
  };

  renderPartsList(getStoredParts());

  // Search Filter
  document.getElementById("c_search_input").oninput = (e) => {
    const q = e.target.value.toLowerCase().trim();
    const rows = document.querySelectorAll("#c_parts_list .part_row");
    rows.forEach(r => {
      const txt = r.innerText.toLowerCase();
      r.style.display = txt.includes(q) ? "flex" : "none";
    });
  };

  // Reset to default initialParts
  document.getElementById("c_reset").onclick = () => {
    if (confirm("Reset Curlin parts list to default?")) {
      saveStoredParts(initialParts);
      renderPartsList(initialParts);
    }
  };

  document.getElementById("c_add_btn").onclick = () => {
    let desc = prompt("Enter Part Description:");
    if (!desc || !desc.trim()) return;
    let pn = prompt("Enter Part Number:");
    if (!pn || !pn.trim()) return;

    let current = getStoredParts();
    current.unshift({ name: desc.trim(), pn: pn.trim() });
    saveStoredParts(current);
    renderPartsList(current);
  };

  document.getElementById("c_export_btn").onclick = () => {
    const currentParts = getCurrentPartsFromDOM();
    const selfCode = runCurlinCalc.toString();
    const partsJson = JSON.stringify(currentParts, null, 4);
    const modifiedCode = `(${selfCode})()`.replace(/const initialParts = \[[\s\S]*?\];/, `const initialParts = ${partsJson};`);

    const blob = new Blob([modifiedCode], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "curlin_findings_generator.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  document.getElementById("c_import_btn").onclick = () => {
    document.getElementById("c_file_input").click();
  };

  document.getElementById("c_file_input").onchange = (e) => {
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
          const match = fileContent.match(/const initialParts = (\[[\s\S]*?\]);/);
          if (match && match[1]) importedParts = JSON.parse(match[1]);
        }
        if (Array.isArray(importedParts) && importedParts.length > 0) {
          saveStoredParts(importedParts);
          renderPartsList(importedParts);
          alert(`Successfully imported ${importedParts.length} parts!`);
        }
      } catch (err) {
        alert("Error importing file: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const closeModal = () => { if (overlay) overlay.remove(); };
  document.getElementById("c_close_btn").onclick = closeModal;
  document.getElementById("c_cancel").onclick = closeModal;
  
  document.getElementById("c_back").onclick = () => {
    closeModal();
    if (typeof window.openOneTrackToolkit === "function") {
      window.openOneTrackToolkit();
    }
  };

  document.getElementById("c_copy").onclick = () => {
    let checkedBoxes = Array.from(box.querySelectorAll(".c_chk:checked"));
    checkedBoxes.forEach(cb => recordUsage(cb.value));

    let physicalParts = checkedBoxes.filter(cb => cb.dataset.pn !== "LABOR").map(cb => cb.value);
    let hasLabor = checkedBoxes.some(cb => cb.dataset.pn === "LABOR");

    let text = "";
    const testBlock = "Visual Inspection, Power Up Test, Keypad Test, Display Inspection, Sensor Checks, and Delivery Verification Testing.";

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

    closeModal();

    let target = document.querySelector("#addActualFindingsModal textarea") || document.getElementById("note") || document.querySelector('textarea[name="Notes"]') || document.querySelector("textarea");
    if (target) {
      target.focus();
      let setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
      if (setter) setter.call(target, text); else target.value = text;
      target.dispatchEvent(new Event("input", { bubbles: true }));
      target.dispatchEvent(new Event("change", { bubbles: true }));
      target.dispatchEvent(new Event("blur", { bubbles: true }));
    } else {
      alert("Findings copied to clipboard!");
    }
  };

  // --- OCR AUTO-SELECT HANDLER FOR CURLIN ---
  window._otAutoSelectCurlin = function(ocrText) {
    if (!ocrText) return 0;
    const cleanOCR = ocrText.toUpperCase().replace(/[^A-Z0-9\s]/g, ' ');

    let matchedCount = 0;
    const checkboxes = box.querySelectorAll('.c_chk');

    checkboxes.forEach(chk => {
      const nameNorm = (chk.value || '').toUpperCase().replace(/[^A-Z0-9\s]/g, ' ');
      const pnAttr = (chk.dataset.pn || '').toUpperCase().trim();

      if (!nameNorm || pnAttr === 'LABOR') return;

      const tokens = nameNorm.split(/\s+/).filter(w => w.length >= 3 && !['CURLIN', 'ASSY', 'PUMP', '6000'].includes(w));
      if (tokens.length === 0) return;

      let hits = 0;
      tokens.forEach(t => { if (cleanOCR.includes(t)) hits++; });

      if (hits / tokens.length >= 0.7) {
        if (!chk.checked) {
          chk.checked = true;
          chk.dispatchEvent(new Event('change', { bubbles: true }));
        }
        matchedCount++;
      }
    });

    return matchedCount;
  };

  window._otCurrentOEMTool = {
    id: 'curlin',
    autoSelect: window._otAutoSelectCurlin
  };
})();
