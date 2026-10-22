(function runJoeyOEM() {
  const initialParts = [
    { name: "Back Case Overmold", pn: "F319275CS" },
    { name: "Battery Assembly Li. Ion", pn: "F0105065CS" },
    { name: "Battery Door", pn: "F319295CS" },
    { name: "Battery Door Label", pn: "PT000319625CS" },
    { name: "Blank Label, Unprinted", pn: "PT000317225CS" },
    { name: "Buzzer Harness Assembly", pn: "F0907185CS" },
    { name: "Cover-Buzzer (Tyvek)", pn: "F319405CS" },
    { name: "Display LCD", pn: "F0601595CS" },
    { name: "Flex Circuit Assembly", pn: "F319435CS" },
    { name: "Foam Battery Pad", pn: "F320015CS" },
    { name: "Front Case", pn: "F319285CS" },
    { name: "Gasket-Shoulder Bolt", pn: "F319375CS" },
    { name: "Gearbox Assembly", pn: "F319425CS" },
    { name: "Harness-Com Port", pn: "F0907175CS" },
    { name: "H-Bridge PCB Assembly", pn: "PT000528665CS" },
    { name: "Lens-PC", pn: "F319395CS" },
    { name: "Mounting Stud Threaded", pn: "F319925CS" },
    { name: "Overlay", pn: "10511405CS" },
    { name: "Phase 3 Joey PCBA", pn: "P1001109385CS" },
    { name: "Phil Pan Head Machine", pn: "F1322265CS" },
    { name: "PIP PCB Assembly", pn: "10336895CS" },
    { name: "Precision Socket", pn: "N/A" },
    { name: "Printed Main Door", pn: "F320615CS" },
    { name: "Richo Harness Clip", pn: "F0807575CS" },
    { name: "Richo Spacers", pn: "F1322245CS" },
    { name: "Rotor Assembly", pn: "F319345CS" },
    { name: "Seal-Sensor Housing", pn: "F319385CX" },
    { name: "Symbol Label", pn: "PT000347255CS" },
    { name: "Ties, Cable Self Lock 3 7/8", pn: "F1500225CS" },
    { name: "Ultrasonic Assembly", pn: "F319415CS" },
    { name: "Washer Seal", pn: "F319835CX" }
  ];

  const selectedParts = new Set();

  function getStoredParts() {
    try {
      const stored = localStorage.getItem("joey_oem_parts_list_v2");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    localStorage.setItem("joey_oem_parts_list_v2", JSON.stringify(initialParts));
    return initialParts;
  }

  function saveStoredParts(list) {
    localStorage.setItem("joey_oem_parts_list_v2", JSON.stringify(list));
  }

  function getFreq() {
    try { return JSON.parse(localStorage.getItem('ot_freq_joey_oem') || '{}'); }
    catch(e) { return {}; }
  }

  function recordUsage(partName) {
    let freq = getFreq();
    freq[partName] = (freq[partName] || 0) + 1;
    localStorage.setItem('ot_freq_joey_oem', JSON.stringify(freq));
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
      alert("Findings copied to clipboard!");
    }
  }

  const existing = document.getElementById("joey-oem-modal");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "joey-oem-modal";
  overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999999;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;";

  const box = document.createElement("div");
  box.style.cssText = "background:#1e2329;padding:20px;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.5);width:520px;max-height:85vh;display:flex;flex-direction:column;color:#f1f3f5;border:1px solid #2d333b;";

  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <h3 style="margin:0;font-size:16px;font-weight:700;color:#fff;">Joey OEM Findings Generator</h3>
        <span id="j_badge_count" style="display:none;background:#1f6feb;color:#fff;font-size:11px;padding:2px 8px;border-radius:12px;font-weight:600;">0 selected</span>
      </div>
      <span id="j_close_x" style="cursor:pointer;font-size:20px;color:#8b949e;line-height:1;">&times;</span>
    </div>

    <!-- Pinned Always-Visible Selected Items Panel -->
    <div id="j_selected_panel" style="display:none;background:#161b22;border:1px solid #30363d;border-radius:6px;padding:8px;margin-bottom:10px;max-height:100px;overflow-y:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span style="font-size:11px;font-weight:700;color:#8b949e;text-transform:uppercase;letter-spacing:0.5px;">Selected Parts (<span id="j_selected_num">0</span>):</span>
        <button id="j_clear_selected" style="background:none;border:none;color:#f85149;font-size:11px;cursor:pointer;padding:0;font-weight:600;">Clear All</button>
      </div>
      <div id="j_chips_container" style="display:flex;flex-wrap:wrap;gap:6px;"></div>
    </div>

    <!-- Search & Add Controls -->
    <div style="display:flex;gap:6px;margin-bottom:10px;">
      <input type="text" id="j_search" placeholder="🔍 Search parts or P/N..." style="flex:1;padding:8px;background:#161b22;color:#fff;border:1px solid #363d4a;border-radius:4px;font-size:12px;box-sizing:border-box;">
      <button id="j_add_btn" style="padding:8px 12px;background:#238636;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;white-space:nowrap;">➕ Add Part</button>
    </div>

    <!-- Parts List Container -->
    <div id="j_parts_list" style="overflow-y:auto;max-height:240px;display:flex;flex-direction:column;gap:6px;padding-right:4px;background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:8px;"></div>

    <!-- Import / Export Controls -->
    <div style="display:flex;gap:6px;margin-top:10px;padding-top:10px;border-top:1px solid #2d333b;">
      <button id="j_export_btn" style="flex:1;padding:7px;background:#316dca;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:11px;">📤 Export Source (.js)</button>
      <button id="j_import_btn" style="flex:1;padding:7px;background:#6e40c9;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:11px;">📥 Import Parts File</button>
      <input type="file" id="j_import_file_input" accept=".js,.json" style="display:none;">
    </div>

    <!-- Action Buttons -->
    <div style="display:flex;gap:8px;margin-top:12px;">
      <button id="j_reset_btn" title="Reset to defaults" style="padding:8px 12px;background:#484f58;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">↺ Reset</button>
      <button id="j_back" style="flex:1;padding:8px;background:#363d4a;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">← Back</button>
      <button id="j_copy" style="flex:1.2;padding:8px;background:#238636;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">Apply Findings</button>
      <button id="j_cancel" style="flex:1;padding:8px;background:#da3633;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">Cancel</button>
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const listContainer = document.getElementById("j_parts_list");
  const chipsContainer = document.getElementById("j_chips_container");
  const selectedPanel = document.getElementById("j_selected_panel");
  const badgeCount = document.getElementById("j_badge_count");
  const selectedNum = document.getElementById("j_selected_num");

  function updateSelectionPanel() {
    const count = selectedParts.size;
    if (count > 0) {
      badgeCount.textContent = `${count} selected`;
      badgeCount.style.display = "inline-block";
      selectedNum.textContent = count;
      selectedPanel.style.display = "block";
    } else {
      badgeCount.style.display = "none";
      selectedPanel.style.display = "none";
    }

    chipsContainer.innerHTML = "";
    selectedParts.forEach((partName) => {
      const chip = document.createElement("span");
      chip.style.cssText = "background:#1f6feb;color:#fff;font-size:11px;padding:3px 8px;border-radius:12px;display:inline-flex;align-items:center;gap:6px;font-weight:500;";
      chip.innerHTML = `<span>${partName}</span><span style="cursor:pointer;font-weight:bold;opacity:0.8;">&times;</span>`;

      chip.querySelector("span:last-child").onclick = () => {
        selectedParts.delete(partName);
        updateSelectionPanel();
        const cb = listContainer.querySelector(`input[value="${CSS.escape(partName)}"]`);
        if (cb) cb.checked = false;
      };

      chipsContainer.appendChild(chip);
    });
  }

  document.getElementById("j_clear_selected").onclick = () => {
    selectedParts.clear();
    updateSelectionPanel();
    listContainer.querySelectorAll(".j_chk").forEach(cb => cb.checked = false);
  };

  function renderParts(filter = "") {
    listContainer.innerHTML = "";
    const partsList = getStoredParts();
    const freq = getFreq();

    partsList.sort((a, b) => (freq[b.name] || 0) - (freq[a.name] || 0));

    partsList.forEach((part) => {
      const q = filter.toLowerCase();
      if (filter && !part.name.toLowerCase().includes(q) && !part.pn.toLowerCase().includes(q)) return;

      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;justify-content:space-between;background:#161b22;border:1px solid #30363d;border-radius:5px;padding:6px 8px;";

      const labelGroup = document.createElement("label");
      labelGroup.style.cssText = "display:flex;align-items:center;gap:8px;font-size:12px;color:#e6edf3;cursor:pointer;flex:1;";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "j_chk";
      checkbox.value = part.name;
      checkbox.dataset.pn = part.pn || "N/A";
      checkbox.checked = selectedParts.has(part.name);
      checkbox.style.cssText = "transform:scale(1.1);cursor:pointer;";

      checkbox.onchange = (e) => {
        if (e.target.checked) selectedParts.add(part.name);
        else selectedParts.delete(part.name);
        updateSelectionPanel();
      };

      const labelText = document.createElement("span");
      labelText.textContent = part.name;

      labelGroup.appendChild(checkbox);
      labelGroup.appendChild(labelText);
      row.appendChild(labelGroup);

      const rightGroup = document.createElement("div");
      rightGroup.style.cssText = "display:flex;align-items:center;gap:6px;";

      const pnSpan = document.createElement("span");
      pnSpan.textContent = part.pn;
      pnSpan.style.cssText = "color:#8b949e;font-family:monospace;font-size:11px;margin-right:4px;";

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.title = "Edit Part";
      editBtn.style.cssText = "background:transparent;border:none;cursor:pointer;font-size:12px;padding:2px 4px;";
      editBtn.onclick = (e) => {
        e.stopPropagation();
        let newDesc = prompt("Edit Part Description:", part.name);
        if (newDesc !== null && newDesc.trim() !== "") {
          let newPn = prompt("Edit Part Number:", part.pn);
          if (newPn !== null && newPn.trim() !== "") {
            const list = getStoredParts();
            const idx = list.findIndex(p => p.name === part.name);
            if (idx !== -1) {
              if (selectedParts.has(part.name)) {
                selectedParts.delete(part.name);
                selectedParts.add(newDesc.trim());
              }
              list[idx] = { name: newDesc.trim(), pn: newPn.trim() };
              saveStoredParts(list);
              updateSelectionPanel();
              renderParts(document.getElementById("j_search").value);
            }
          }
        }
      };

      const delBtn = document.createElement("button");
      delBtn.textContent = "✕";
      delBtn.title = "Delete Part";
      delBtn.style.cssText = "background:transparent;color:#da3633;border:none;cursor:pointer;font-weight:bold;font-size:12px;padding:2px 4px;";
      delBtn.onclick = (e) => {
        e.stopPropagation();
        selectedParts.delete(part.name);
        updateSelectionPanel();
        const current = getStoredParts().filter(p => p.name !== part.name);
        saveStoredParts(current);
        renderParts(document.getElementById("j_search").value);
      };

      rightGroup.appendChild(pnSpan);
      rightGroup.appendChild(editBtn);
      rightGroup.appendChild(delBtn);
      row.appendChild(rightGroup);

      listContainer.appendChild(row);
    });
  }

  renderParts();

  document.getElementById("j_search").addEventListener("input", (e) => {
    renderParts(e.target.value);
  });

  document.getElementById("j_add_btn").onclick = () => {
    const name = prompt("Enter Part Name:");
    if (!name || !name.trim()) return;
    const pn = prompt("Enter Part Number (or N/A):") || "N/A";

    const list = getStoredParts();
    list.unshift({ name: name.trim(), pn: pn.trim() });
    saveStoredParts(list);
    renderParts(document.getElementById("j_search").value);
  };

  document.getElementById("j_reset_btn").onclick = () => {
    if (confirm("Reset Joey OEM parts list back to initial defaults?")) {
      selectedParts.clear();
      updateSelectionPanel();
      saveStoredParts(initialParts);
      renderParts(document.getElementById("j_search").value);
    }
  };

  document.getElementById("j_export_btn").onclick = () => {
    const currentParts = getStoredParts();
    let scriptContent = runJoeyOEM.toString();
    scriptContent = `(${scriptContent})();`;
    scriptContent = scriptContent.replace(/const initialParts = \[\s[\s\S]*?\];/, `const initialParts = ${JSON.stringify(currentParts, null, 2)};`);

    const blob = new Blob([scriptContent], { type: "application/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Joey_OEM_Generator.js";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const fileInput = document.getElementById("j_import_file_input");
  document.getElementById("j_import_btn").onclick = () => fileInput.click();

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
          selectedParts.clear();
          updateSelectionPanel();
          saveStoredParts(imported);
          renderParts(document.getElementById("j_search").value);
          alert(`Successfully imported ${imported.length} parts!`);
        } else throw new Error("Invalid format");
      } catch (err) {
        alert("Failed to parse imported file. Upload a valid .js or .json file.");
      }
    };
    reader.readAsText(file);
    fileInput.value = "";
  };

  document.getElementById("j_copy").onclick = () => {
    const selectedArr = Array.from(selectedParts);
    selectedArr.forEach(p => recordUsage(p));

    const testBlock = "Buzzer Test, LED Test, Battery Test, MISTIC Test, and Audio Test.";
    let text = "";

    if (selectedArr.length > 0) {
      text = `Per the OEM, the following parts have been replaced: ${selectedArr.join(", ")} and passed the related testing. The OEM also certified that the device passed the following: ${testBlock}`;
    } else {
      text = `Per the OEM, the device passed the following testing: ${testBlock}`;
    }

    applyTextToDOM(text);
    overlay.remove();
  };

  const close = () => overlay.remove();
  document.getElementById("j_close_x").onclick = close;
  document.getElementById("j_cancel").onclick = close;
  overlay.onclick = (e) => { if (e.target === overlay) close(); };

  document.getElementById("j_back").onclick = () => {
    close();
    if (typeof window.openOneTrackToolkit === "function") {
      window.openOneTrackToolkit();
    }
  };
})();
