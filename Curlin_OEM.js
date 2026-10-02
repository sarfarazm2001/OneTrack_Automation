(function runCurlinCalc(){
  const initialParts = [
    { name: "Under Warranty", pn: "N/A", isWarranty: true },
    { name: "IV Labor", pn: "N/A", isEval: true, price: 23.75 },
    { name: "IV PM", pn: "N/A", isEval: true, price: 75.00 },
    { name: "Mech Seal", pn: "340-0049", price: 26.50 },
    { name: "Pump Mechanism Assembly", pn: "340-0055", price: 655.00 },
    { name: "Sub-Assembly w/o Motor", pn: "340-0057", price: 480.00 },
    { name: "Bezel with Overmold", pn: "340-0070", price: 13.00 },
    { name: "Rear Case Assy.", pn: "340-1003", price: 90.00 },
    { name: "Keypad w/o overlay", pn: "350-2011", price: 32.00 },
    { name: "LCD lens", pn: "360-0016", price: 12.50 },
    { name: "Battery Ejector", pn: "360-0022", price: 4.00 },
    { name: "Battery Door", pn: "360-1004/360-0091", price: 27.00 },
    { name: "PCB Assembly", pn: "360-2004-00", price: 655.00 },
    { name: "Keypad overlay", pn: "360-2009", price: 14.00 },
    { name: "Motor & Worm Gear Assy.", pn: "59933", price: 330.00 },
    { name: "Front Case Sub Assembly", pn: "66419", price: 90.00 },
    { name: "BT2", pn: "C12-02001", price: 19.00 },
    { name: "BT3", pn: "C12-04002", price: 16.00 },
    { name: "LCD Module", pn: "C14-05003/58553", price: 58.00 },
    { name: "Misc. Charges and Credits", pn: "N/A", isEval: true, price: 1.00 }
  ];

  function getStoredParts() {
    try {
      const stored = localStorage.getItem('curlin_parts_list_v1');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    localStorage.setItem('curlin_parts_list_v1', JSON.stringify(initialParts));
    return initialParts;
  }

  function saveStoredParts(list) {
    localStorage.setItem('curlin_parts_list_v1', JSON.stringify(list));
  }

  function applyTextToDOM(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(err => console.warn("Clipboard copy failed:", err));
    }

    let target = document.querySelector('#addActualFindingsModal textarea') || 
                 document.getElementById('note') || 
                 document.querySelector('textarea[name="Notes"]') || 
                 document.querySelector('textarea[name="Finding"]') || 
                 document.querySelector('textarea');

    if (target) {
      target.focus();
      let setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
      if (setter) setter.call(target, text); else target.value = text;
      target.dispatchEvent(new Event('input', { bubbles: true }));
      target.dispatchEvent(new Event('change', { bubbles: true }));
      target.dispatchEvent(new Event('blur', { bubbles: true }));
    }
  }

  const existing = document.getElementById('curlin-calc-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'curlin-calc-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999999;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;';

  const box = document.createElement('div');
  box.style.cssText = 'background:#1e2329;padding:20px;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.5);width:450px;max-height:85vh;display:flex;flex-direction:column;color:#f1f3f5;border:1px solid #2d333b;';

  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <h3 style="margin:0;font-size:16px;font-weight:700;color:#fff;">Curlin Billing Calculator</h3>
      <span id="curlin_close_x" style="cursor:pointer;font-size:20px;color:#8b949e;line-height:1;">&times;</span>
    </div>

    <!-- Search & Add Bar -->
    <div style="display:flex;gap:6px;margin-bottom:10px;">
      <input type="text" id="curlin_search" placeholder="🔍 Search parts..." style="flex:1;padding:8px;background:#1e2329;color:#fff;border:1px solid #363d4a;border-radius:4px;font-size:12px;box-sizing:border-box;">
      <button id="curlin_add_btn" style="padding:8px 12px;background:#238636;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;white-space:nowrap;">➕ Add Part</button>
    </div>

    <!-- Parts List -->
    <div id="curlin_parts_list" style="overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:6px;padding-right:4px;"></div>

    <!-- File Import/Export Bar -->
    <div style="display:flex;gap:6px;margin-top:10px;padding-top:10px;border-top:1px solid #2d333b;">
      <button id="curlin_export_btn" style="flex:1;padding:7px;background:#316dca;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:11px;">📤 Export Source (.js)</button>
      <button id="curlin_import_btn" style="flex:1;padding:7px;background:#6e40c9;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:11px;">📥 Import Parts File</button>
      <input type="file" id="curlin_import_file_input" accept=".js,.json" style="display:none;">
    </div>

    <!-- Footer Controls -->
    <div style="display:flex;gap:8px;margin-top:12px;">
      <button id="curlin_reset_btn" title="Reset parts list to defaults" style="padding:8px 12px;background:#484f58;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">↺ Reset</button>
      <button id="curlin_back_btn" style="flex:1;padding:8px;background:#363d4a;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">← Back</button>
      <button id="curlin_apply_btn" style="flex:1.4;padding:8px;background:#238636;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">Apply Findings</button>
      <button id="curlin_cancel_btn" style="flex:1;padding:8px;background:#da3633;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">Cancel</button>
    </div>
  `;

  modal.appendChild(box);
  document.body.appendChild(modal);

  const listContainer = document.getElementById('curlin_parts_list');

  function renderParts(filter = "") {
    listContainer.innerHTML = "";
    const partsList = getStoredParts();

    partsList.forEach((p, index) => {
      if (filter && !p.name.toLowerCase().includes(filter.toLowerCase()) && !p.pn.toLowerCase().includes(filter.toLowerCase())) return;

      const row = document.createElement('div');
      let isW = p.isWarranty;
      row.style.cssText = isW 
        ? 'display:flex;align-items:center;justify-content:space-between;background:#382d12;border:1px solid #845306;border-radius:5px;padding:6px 8px;font-weight:bold;'
        : 'display:flex;align-items:center;justify-content:space-between;background:#232830;border:1px solid #30363d;border-radius:5px;padding:6px 8px;';

      const leftGroup = document.createElement('span');
      leftGroup.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:12px;color:#e6edf3;';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'c_chk';
      checkbox.dataset.warranty = isW ? '1' : '0';
      checkbox.dataset.eval = p.isEval ? '1' : '0';
      checkbox.dataset.price = p.price || 0;
      checkbox.value = p.name;
      checkbox.style.cssText = 'transform:scale(1.1);cursor:pointer;';

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

  document.getElementById('curlin_search').addEventListener('input', (e) => {
    renderParts(e.target.value);
  });

  document.getElementById('curlin_apply_btn').onclick = () => {
    let checkedEls = Array.from(box.querySelectorAll('.c_chk:checked'));
    let warrantyBox = box.querySelector('.c_chk[data-warranty="1"]');
    let isWarranty = warrantyBox ? warrantyBox.checked : false;
    let selectedParts = checkedEls.filter(cb => cb.getAttribute('data-eval') !== '1' && cb.getAttribute('data-warranty') !== '1').map(cb => cb.value);
    
    let partsText = selectedParts.length ? selectedParts.join(', ') + ', ' : '';
    let totalCost = checkedEls.reduce((sum, cb) => sum + parseFloat(cb.getAttribute('data-price') || 0), 0);
    let costText = isWarranty ? 'Parts and Labor covered under warranty' : `Parts and Labor total of $${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    let text = `Manufacturer findings, per Moog Medical the following will need replaced: ${partsText}${costText}`;

    applyTextToDOM(text);
    modal.remove();
  };

  document.getElementById('curlin_add_btn').onclick = () => {
    const name = prompt("Enter Part Name:");
    if (!name) return;
    const pn = prompt("Enter Part Number (or N/A):") || "N/A";
    const priceStr = prompt("Enter Price (e.g. 25.00):") || "0";
    
    const list = getStoredParts();
    list.push({ name: name.trim(), pn: pn.trim(), price: parseFloat(priceStr) || 0 });
    saveStoredParts(list);
    renderParts(document.getElementById('curlin_search').value);
  };

  document.getElementById('curlin_reset_btn').onclick = () => {
    if (confirm("Reset all parts back to initial defaults?")) {
      saveStoredParts(initialParts);
      renderParts(document.getElementById('curlin_search').value);
    }
  };

  // 📤 EXPORT HANDLER (Fixed to reference outer function by name)
  document.getElementById('curlin_export_btn').onclick = () => {
    const currentParts = getStoredParts();
    let scriptContent = runCurlinCalc.toString();
    scriptContent = `(${scriptContent})();`;
    scriptContent = scriptContent.replace(/const initialParts = \[[^]*?\];/, `const initialParts = ${JSON.stringify(currentParts, null, 2)};`);

    const blob = new Blob([scriptContent], { type: "application/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Curlin_Calculator.js";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 📥 IMPORT HANDLER
  const fileInput = document.getElementById('curlin_import_file_input');
  document.getElementById('curlin_import_btn').onclick = () => fileInput.click();

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
          renderParts(document.getElementById('curlin_search').value);
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
  document.getElementById('curlin_close_x').onclick = close;
  document.getElementById('curlin_cancel_btn').onclick = close;
  modal.onclick = e => { if (e.target === modal) close(); };

  document.getElementById('curlin_back_btn').onclick = () => {
    close();
    if (typeof window.reopenMasterLauncher === "function") window.reopenMasterLauncher();
  };
})();
