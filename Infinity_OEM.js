(function runInfinityCalc() {
  const initialParts = [
    { name: "INF Eval", pn: "INFEVAL", isEval: true },
    { name: "Backlight Difuser", pn: "25771-001" },
    { name: "LCD Display", pn: "25795-001" },
    { name: "Battery Assembly", pn: "26503-001" },
    { name: "Infinity II Pump Cover", pn: "26542-001/80786-001" },
    { name: "Infinity Bottom Housing", pn: "27696-001" },
    { name: "Infinity Motor (Orange)", pn: "28270-001" },
    { name: "Rotor Assembly", pn: "28483-001", customName: "Rotor Housing" },
    { name: "Canon Motor", pn: "42611", customName: "Canon Motor" },
    { name: "Infinity II PCB Assembly", pn: "43763-101" },
    { name: "Top Housing", pn: "56717-001/80782-001" }
  ];

  const selectedParts = new Set();

  function getStoredParts() {
    try {
      const stored = localStorage.getItem("infinity_parts_list_v2");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    localStorage.setItem("infinity_parts_list_v2", JSON.stringify(initialParts));
    return initialParts;
  }

  function saveStoredParts(list) {
    localStorage.setItem("infinity_parts_list_v2", JSON.stringify(list));
  }

  function getFreq() {
    try { return JSON.parse(localStorage.getItem('ot_freq_infinity') || '{}'); }
    catch(e) { return {}; }
  }

  function recordUsage(partName) {
    let freq = getFreq();
    freq[partName] = (freq[partName] || 0) + 1;
    localStorage.setItem('ot_freq_infinity', JSON.stringify(freq));
  }

  function applyTextToDOM(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(err => console.warn("Clipboard copy failed:", err));
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

  const existing = document.getElementById('inf-calc-modal');
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = 'inf-calc-modal';
  overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999999;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;";

  const box = document.createElement("div");
  box.style.cssText = "background:#1e2329;padding:20px;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.5);width:520px;max-height:85vh;display:flex;flex-direction:column;color:#f1f3f5;border:1px solid #2d333b;";

  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <h3 style="margin:0;font-size:16px;font-weight:700;color:#fff;">Infinity Replaced Parts Generator</h3>
        <span id="inf_badge_count" style="display:none;background:#1f6feb;color:#fff;font-size:11px;padding:2px 8px;border-radius:12px;font-weight:600;">0 selected</span>
      </div>
      <span id="inf_close_x" style="cursor:pointer;font-size:20px;color:#8b949e;line-height:1;">&times;</span>
    </div>

    <!-- Pinned Always-Visible Selected Items Panel -->
    <div id="inf_selected_panel" style="display:none;background:#161b22;border:1px solid #30363d;border-radius:6px;padding:8px;margin-bottom:10px;max-height:100px;overflow-y:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span style="font-size:11px;font-weight:700;color:#8b949e;text-transform:uppercase;letter-spacing:0.5px;">Selected Parts (<span id="inf_selected_num">0</span>):</span>
        <button id="inf_clear_selected" style="background:none;border:none;color:#f85149;font-size:11px;cursor:pointer;padding:0;font-weight:600;">Clear All</button>
      </div>
      <div id="inf_chips_container" style="display:flex;flex-wrap:wrap;gap:6px;"></div>
    </div>

    <!-- Search & Add Controls -->
    <div style="display:flex;gap:6px;margin-bottom:10px;">
      <input type="text" id="inf_search" placeholder="🔍 Search parts or P/N..." style="flex:1;padding:8px;background:#161b22;color:#fff;border:1px solid #363d4a;border-radius:4px;font-size:12px;box-sizing:border-box;">
      <button id="inf_add_btn" style="padding:8px 12px;background:#238636;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;white-space:nowrap;">➕ Add Part</button>
    </div>

    <!-- Parts List Container -->
    <div id="inf_parts_list" style="overflow-y:auto;max-height:240px;display:flex;flex-direction:column;gap:6px;padding-right:4px;background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:8px;"></div>

    <!-- Import / Export Controls -->
    <div style="display:flex;gap:6px;margin-top:10px;padding-top:10px;border-top:1px solid #2d333b;">
      <button id="inf_export_btn" style="flex:1;padding:7px;background:#316dca;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:11px;">📤 Export Source (.js)</button>
      <button id="inf_import_btn" style="flex:1;padding:7px;background:#6e40c9;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:11px;">📥 Import Parts File</button>
      <input type="file" id="inf_import_file_input" accept=".js,.json" style="display:none;">
    </div>

    <!-- Action Buttons -->
    <div style="display:flex;gap:8px;margin-top:12px;">
      <button id="inf_reset_btn" title="Reset to defaults" style="padding:8px 12px;background:#484f58;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">↺ Reset</button>
      <button id="inf_back_btn" style="flex:1;padding:8px;background:#363d4a;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">← Back</button>
      <button id="inf_copy" style="flex:1.2;padding:8px;background:#238636;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">Apply Findings</button>
      <button id="inf_cancel" style="flex:1;padding:8px;background:#da3633;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">Cancel</button>
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const listContainer = document.getElementById("inf_parts_list");
  const chipsContainer = document.getElementById("inf_chips_container");
  const selectedPanel = document.getElementById("inf_selected_panel");
  const badgeCount = document.getElementById("inf_badge_count");
  const selectedNum = document.getElementById("inf_selected_num");

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

  document.getElementById("inf_clear_selected").onclick = () => {
    selectedParts.clear();
    updateSelectionPanel();
    listContainer.querySelectorAll(".inf_part").forEach(cb => cb.checked = false);
  };

  function renderParts(filter = "") {
    listContainer.innerHTML = "";
    const partsList = getStoredParts();
    const freq = getFreq();

    partsList.sort((a, b) => (freq[b.customName || b.name] || 0) - (freq[a.customName || a.name] || 0));

    partsList.forEach((part) => {
      const partDisplayName = part.name;
      const partValueName = part.customName || part.name;
      const q = filter.toLowerCase();

      if (filter && !partDisplayName.toLowerCase().includes(q) && !part.pn.toLowerCase().includes(q)) return;

      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;justify-content:space-between;background:#161b22;border:1px solid #30363d;border-radius:5px;padding:6px 8px;";

      const labelGroup = document.createElement("label");
      labelGroup.style.cssText = "display:flex;align-items:center;gap:8px;font-size:12px;color:#e6edf3;cursor:pointer;flex:1;";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "inf_part";
      checkbox.value = partValueName;
      checkbox.dataset.pn = part.pn || "N/A";
      checkbox.dataset.eval = part.isEval ? "1" : "0";
      checkbox.checked = selectedParts.has(partValueName);
      checkbox.style.cssText = "transform:scale(1.1);cursor:pointer;";

      checkbox.onchange = (e) => {
        if (e.target.checked) selectedParts.add(partValueName);
        else selectedParts.delete(partValueName);
        updateSelectionPanel();
      };

      const labelText = document.createElement("span");
      labelText.textContent = partDisplayName;

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
              if (selectedParts.has(partValueName)) {
                selectedParts.delete(partValueName);
                selectedParts.add(newDesc.trim());
              }
              list[idx] = { ...part, name: newDesc.trim(), pn: newPn.trim() };
              saveStoredParts(list);
              updateSelectionPanel();
              renderParts(document.getElementById("inf_search").value);
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
        selectedParts.delete(partValueName);
        updateSelectionPanel();
        const current = getStoredParts().filter(p => p.name !== part.name);
        saveStoredParts(current);
        renderParts(document.getElementById("inf_search").value);
      };

      rightGroup.appendChild(pnSpan);
      rightGroup.appendChild(editBtn);
      rightGroup.appendChild(delBtn);
      row.appendChild(rightGroup);

      listContainer.appendChild(row);
    });
  }

  renderParts();

  document.getElementById("inf_search").addEventListener("input", (e) => {
    renderParts(e.target.value);
  });

  document.getElementById("inf_add_btn").onclick = () => {
    const name = prompt("Enter Part Name:");
    if (!name || !name.trim()) return;
    const pn = prompt("Enter Part Number (or N/A):") || "N/A";

    const list = getStoredParts();
    list.unshift({ name: name.trim(), pn: pn.trim() });
    saveStoredParts(list);
    renderParts(document.getElementById("inf_search").value);
  };

  document.getElementById("inf_reset_btn").onclick = () => {
    if (confirm("Reset Infinity parts list back to initial defaults?")) {
      selectedParts.clear();
      updateSelectionPanel();
      saveStoredParts(initialParts);
      renderParts(document.getElementById("inf_search").value);
    }
  };

  document.getElementById("inf_export_btn").onclick = () => {
    const currentParts = getStoredParts();
    let scriptContent = runInfinityCalc.toString();
    scriptContent = `(${scriptContent})();`;
    scriptContent = scriptContent.replace(/const initialParts = \[\s[\s\S]*?\];/, `const initialParts = ${JSON.stringify(currentParts, null, 2)};`);

    const blob = new Blob([scriptContent], { type: "application/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Infinity_Calculator.js";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const fileInput = document.getElementById("inf_import_file_input");
  document.getElementById("inf_import_btn").onclick = () => fileInput.click();

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
          renderParts(document.getElementById("inf_search").value);
          alert(`Successfully imported ${imported.length} parts!`);
        } else throw new Error("Invalid format");
      } catch (err) {
        alert("Failed to parse imported file. Upload a valid .js or .json file.");
      }
    };
    reader.readAsText(file);
    fileInput.value = "";
  };

  document.getElementById("inf_copy").onclick = () => {
    const selectedArr = Array.from(selectedParts);
    const storedParts = getStoredParts();

    let physicalParts = selectedArr.filter(name => {
      const item = storedParts.find(p => (p.customName || p.name) === name || p.name === name);
      return !item || !item.isEval;
    });

    physicalParts.forEach(p => recordUsage(p));

    let partsText = physicalParts.length ? physicalParts.join(", ") : "";
    let text = "";
    if (physicalParts.length > 0) {
      text = `Per Moog Medical the following has been replaced: ${partsText}, and has met the release criteria associated with the inline inspection, testing and final release elements.`;
    } else {
      text = `Per Moog Medical the device has met the release criteria associated with the inline inspection, testing and final release elements.`;
    }

    applyTextToDOM(text);
    overlay.remove();
  };

  const close = () => overlay.remove();
  document.getElementById("inf_close_x").onclick = close;
  document.getElementById("inf_cancel").onclick = close;
  overlay.onclick = (e) => { if (e.target === overlay) close(); };

  document.getElementById("inf_back_btn").onclick = () => {
    close();
    if (typeof window.openOneTrackToolkit === "function") {
      window.openOneTrackToolkit();
    }
  };
})();
