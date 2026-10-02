(function () {
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

  function getStoredParts() {
    try {
      const stored = localStorage.getItem('infinity_parts_list_v1');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    localStorage.setItem('infinity_parts_list_v1', JSON.stringify(initialParts));
    return initialParts;
  }

  function saveStoredParts(list) {
    localStorage.setItem('infinity_parts_list_v1', JSON.stringify(list));
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
      alert("Textarea not found. Findings copied to clipboard!");
    }
  }

  const existing = document.getElementById('inf-calc-modal');
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = 'inf-calc-modal';
  modal.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999999;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;";

  const box = document.createElement("div");
  box.style.cssText = "background:#1e2329;padding:20px;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.5);width:450px;max-height:85vh;display:flex;flex-direction:column;color:#f1f3f5;border:1px solid #2d333b;";

  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <h3 style="margin:0;font-size:16px;font-weight:700;color:#fff;">Infinity Billing Calculator</h3>
      <span id="inf_close_x" style="cursor:pointer;font-size:20px;color:#8b949e;line-height:1;">&times;</span>
    </div>

    <!-- Search & Add Bar -->
    <div style="display:flex;gap:6px;margin-bottom:10px;">
      <input type="text" id="inf_search" placeholder="🔍 Search parts..." style="flex:1;padding:8px;background:#1e2329;color:#fff;border:1px solid #363d4a;border-radius:4px;font-size:12px;box-sizing:border-box;">
      <button id="inf_add_btn" style="padding:8px 12px;background:#238636;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;white-space:nowrap;">➕ Add Part</button>
    </div>

    <!-- Parts List -->
    <div id="inf_parts_list" style="overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:6px;padding-right:4px;"></div>

    <!-- File Import/Export Bar -->
    <div style="display:flex;gap:6px;margin-top:10px;padding-top:10px;border-top:1px solid #2d333b;">
      <button id="inf_export_btn" style="flex:1;padding:7px;background:#316dca;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:11px;">📤 Export Source (.js)</button>
      <button id="inf_import_btn" style="flex:1;padding:7px;background:#6e40c9;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:11px;">📥 Import Parts File</button>
      <input type="file" id="inf_import_file_input" accept=".js,.json" style="display:none;">
    </div>

    <!-- Footer Controls -->
    <div style="display:flex;gap:8px;margin-top:12px;">
      <button id="inf_reset_btn" title="Reset to defaults" style="padding:8px 12px;background:#484f58;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">↺ Reset</button>
      <button id="inf_back_btn" style="flex:1;padding:8px;background:#363d4a;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">← Back</button>
      <button id="inf_copy" style="flex:1.2;padding:8px;background:#238636;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">Apply</button>
      <button id="inf_cancel" style="flex:1;padding:8px;background:#da3633;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">Cancel</button>
    </div>
  `;

  modal.appendChild(box);
  document.body.appendChild(modal);

  const listContainer = document.getElementById('inf_parts_list');

  function renderParts(filter = "") {
    listContainer.innerHTML = "";
    const partsList = getStoredParts();

    partsList.forEach((p) => {
      if (filter && !p.name.toLowerCase().includes(filter.toLowerCase()) && !p.pn.toLowerCase().includes(filter.toLowerCase())) return;

      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;background:#232830;border:1px solid #30363d;border-radius:5px;padding:6px 8px;';

      const leftGroup = document.createElement('span');
      leftGroup.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:12px;color:#e6edf3;';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'inf_part';
      checkbox.dataset.eval = p.isEval ? '1' : '0';
      checkbox.value = p.customName || p.name;
      checkbox.style.cssText = 'transform:scale(1.1);cursor:pointer;';
      
      // Auto check INF Eval on load
      if (p.isEval) checkbox.checked = true;

      const labelText = document.createElement('span');
      labelText.textContent = p.name;

      leftGroup.appendChild(checkbox);
      leftGroup.appendChild(labelText);

      const rightGroup = document.createElement('span');
      rightGroup.style.cssText = 'color:#8b949e;font-family:monospace;font-size:11px;';
      rightGroup.textContent = p.pn;

      row.appendChild(leftGroup);
      row.appendChild(rightGroup);
      listContainer.appendChild(row);
    });
  }

  renderParts();

  document.getElementById('inf_search').addEventListener('input', (e) => {
    renderParts(e.target.value);
  });

  document.getElementById("inf_copy").onclick = () => {
    let selected = Array.from(box.querySelectorAll(".inf_part:checked")).filter((cb) => cb.getAttribute("data-eval") !== "1").map((cb) => cb.value);
    let partsText = selected.length ? selected.join(", ") : "";
    let text = `Per Moog Medical the following has been replaced: ${partsText}, and has met the release criteria associated with the inline inspection, testing and final release elements.`;

    applyTextToDOM(text);
    modal.remove();
  };

  document.getElementById('inf_add_btn').onclick = () => {
    const name = prompt("Enter Part Name:");
    if (!name) return;
    const pn = prompt("Enter Part Number (or N/A):") || "N/A";
    
    const list = getStoredParts();
    list.push({ name: name.trim(), pn: pn.trim() });
    saveStoredParts(list);
    renderParts(document.getElementById('inf_search').value);
  };

  document.getElementById('inf_reset_btn').onclick = () => {
    if (confirm("Reset all parts back to initial defaults?")) {
      saveStoredParts(initialParts);
      renderParts(document.getElementById('inf_search').value);
    }
  };

  // 📤 EXPORT HANDLER
  document.getElementById('inf_export_btn').onclick = () => {
    const currentParts = getStoredParts();
    let scriptContent = arguments.callee.toString();
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

  // 📥 IMPORT HANDLER
  const fileInput = document.getElementById('inf_import_file_input');
  document.getElementById('inf_import_btn').onclick = () => fileInput.click();

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
          saveStoredParts(imported);
          renderParts(document.getElementById('inf_search').value);
          alert(`Successfully imported ${imported.length} parts!`);
        } else throw new Error("Invalid format");
      } catch (err) {
        alert("Failed to parse imported file. Upload a valid .js or .json file.");
      }
    };
    reader.readAsText(file);
    fileInput.value = "";
  };

  const close = () => modal.remove();
  document.getElementById('inf_close_x').onclick = close;
  document.getElementById('inf_cancel').onclick = close;
  modal.onclick = e => { if (e.target === modal) close(); };

  document.getElementById('inf_back_btn').onclick = () => {
    close();
    if (typeof window.reopenOEMLauncher === "function") window.reopenOEMLauncher();
  };
})();
