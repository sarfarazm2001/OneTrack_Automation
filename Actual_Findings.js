(function runActualFindings(){
  // Correct Company-to-Rep Mapping
  const companyContacts = {
    "AmeriMed": ["David Rolph"],
    "CORAM": ["Shana Brown", "Amy Kwong"],
    "CVS": ["William Maturo"],
    "NELC": ["Alexsis Gauthier", "Sheryl Guyer", "Lauren Lynch", "Michael O'Connor", "Joshua Kronick"],
    "OPTION CARE": ["Brian Fitzpatrick"],
    "OPTUM": ["Janey Mechler", "Heather LeClair"],
    "Walgreens": ["Carl Kerekes"]
  };

  const initialDefaults = [
  "TE: 8TR, 77TR, 148TR, 134TR, 6J",
  "Outdated battery and it needs to be changed. (JOEY)",
  "Battery replaced on {DATE}. (JOEY)",
  "This device is under warranty.",
  "Volume Calibrated. (CURLIN)",
  "Pressure strains calibrated. (CURLIN)",
  "Baseline Calibrated. (CURLIN)",
  "No issue found. PM was successful.",
  "No response from client. Returning unrepaired.",
  "Software needs to be updated to 97-0625-010600-01. (SOLIS)",
  "Software updated to 97-0625-010600-01 at McKesson. (SOLIS)",
  "Software needs to be updated to 97-0625-010600-01(M). (SOLIS)",
  "Software updated to 97-0625-010600-01(M) at McKesson. (SOLIS)",
  "Completed 10 day charge cycle per OEM recommendation. Passed all functional tests without error and passed PM per manufacturer specifications."
];

  function getTodayFormatted() {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  // Manage presets in localStorage
  function getStoredPresets() {
    try {
      const stored = localStorage.getItem('af_preset_list_v2');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    localStorage.setItem('af_preset_list_v2', JSON.stringify(initialDefaults));
    return initialDefaults;
  }

  function saveStoredPresets(list) {
    localStorage.setItem('af_preset_list_v2', JSON.stringify(list));
  }

  function getCustomContacts() {
    try { return JSON.parse(localStorage.getItem('af_custom_contacts') || '[]'); } catch(e) { return []; }
  }

  function saveCustomContact(name) {
    const customs = getCustomContacts();
    customs.push(name);
    localStorage.setItem('af_custom_contacts', JSON.stringify(customs));
  }

  // Strip brackets/parentheses content before inserting text
  function cleanBracketContent(text) {
    return text.replace(/\s*\([^)]*\)/g, '').trim();
  }

  // DOM Injection & Clipboard Copy
  function applyTextToDOM(rawText) {
    const text = cleanBracketContent(rawText);

    // Auto-copy to Clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(err => console.warn("Clipboard copy failed:", err));
    }

    let targetEl = document.getElementById('findingsTextArea') || 
                   document.querySelector('textarea[name="Finding"]') || 
                   document.querySelector('#actualFindingsAddForm textarea');

    if (!targetEl) {
      if (document.activeElement && (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT')) {
        targetEl = document.activeElement;
      } else {
        targetEl = document.querySelector('textarea');
      }
    }

    if (targetEl) {
      targetEl.value = text;
      targetEl.dispatchEvent(new Event('input', { bubbles: true }));
      targetEl.dispatchEvent(new Event('change', { bubbles: true }));
      targetEl.focus();
    }
  }

  const existing = document.getElementById('af-preset-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'af-preset-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999999;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;';

  const box = document.createElement('div');
  box.style.cssText = 'background:#1e2329;padding:20px;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.5);width:450px;max-height:85vh;display:flex;flex-direction:column;color:#f1f3f5;border:1px solid #2d333b;';

  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <h3 style="margin:0;font-size:16px;font-weight:700;color:#fff;">Actual Findings Presets</h3>
      <span id="af_close_x" style="cursor:pointer;font-size:20px;color:#8b949e;line-height:1;">&times;</span>
    </div>

    <!-- Dynamic Builder Section -->
    <div style="background:#262c36;padding:12px;border-radius:6px;border:1px solid #363d4a;margin-bottom:12px;">
      <div style="font-size:11px;font-weight:700;color:#58a6ff;text-transform:uppercase;margin-bottom:8px;">⚡ Dynamic Authorization Builder</div>
      
      <select id="af_action_select" style="width:100%;padding:7px;background:#1e2329;color:#fff;border:1px solid #444;border-radius:4px;font-size:12px;margin-bottom:8px;">
        <option value="dispose">Repairs declined & asked to be disposed of by</option>
        <option value="return">Repairs declined & asked to be returned by</option>
        <option value="approve">Repairs approved by</option>
        <option value="storage">To be placed in storage until further notice by</option>
      </select>
      
      <div style="display:flex;gap:6px;margin-bottom:8px;">
        <select id="af_person_select" style="flex:1;padding:7px;background:#1e2329;color:#fff;border:1px solid #444;border-radius:4px;font-size:12px;">
          <option value="">Authorized Person...</option>
        </select>

        <button id="af_add_rep_btn" title="Add new rep name" style="padding:7px 12px;background:#238636;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;white-space:nowrap;">➕ Rep</button>
      </div>

      <button id="af_build_btn" style="width:100%;padding:8px;background:#1f6feb;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">Insert Authorization Note</button>
    </div>

    <!-- Search & Add Preset Bar -->
    <div style="display:flex;gap:6px;margin-bottom:10px;">
      <input type="text" id="af_search" placeholder="🔍 Search presets..." style="flex:1;padding:8px;background:#1e2329;color:#fff;border:1px solid #363d4a;border-radius:4px;font-size:12px;box-sizing:border-box;">
      <button id="af_add_btn" style="padding:8px 12px;background:#238636;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;white-space:nowrap;">➕ Add Preset</button>
    </div>

    <!-- Presets List -->
    <div id="af_presets_list" style="overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:6px;padding-right:4px;"></div>

    <!-- File Import/Export Bar -->
    <div style="display:flex;gap:6px;margin-top:10px;padding-top:10px;border-top:1px solid #2d333b;">
      <button id="af_export_btn" style="flex:1;padding:7px;background:#316dca;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:11px;">📤 Export Source (.js)</button>
      <button id="af_import_btn" style="flex:1;padding:7px;background:#6e40c9;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:11px;">📥 Import Preset File</button>
      <input type="file" id="af_import_file_input" accept=".js,.json" style="display:none;">
    </div>

    <!-- Footer Controls -->
    <div style="display:flex;gap:8px;margin-top:10px;">
      <button id="af_reset_btn" title="Reset presets to default list" style="padding:8px 12px;background:#484f58;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">↺ Reset Defaults</button>
      <button id="af_back_btn" style="flex:1;padding:8px;background:#363d4a;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">← Back</button>
      <button id="af_cancel_btn" style="flex:1;padding:8px;background:#da3633;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">Cancel</button>
    </div>
  `;

  modal.appendChild(box);
  document.body.appendChild(modal);

  const personSelect = document.getElementById('af_person_select');

  function renderGroupedContacts() {
    personSelect.innerHTML = '<option value="">Authorized Person...</option>';

    Object.keys(companyContacts).sort().forEach(company => {
      const group = document.createElement('optgroup');
      group.label = company;

      companyContacts[company].sort().forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        group.appendChild(opt);
      });

      personSelect.appendChild(group);
    });

    const customs = getCustomContacts();
    if (customs.length > 0) {
      const customGroup = document.createElement('optgroup');
      customGroup.label = "CUSTOM CONTACTS";

      customs.sort().forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        customGroup.appendChild(opt);
      });

      personSelect.appendChild(customGroup);
    }
  }

  renderGroupedContacts();

  document.getElementById('af_add_rep_btn').onclick = () => {
    const repName = prompt("Enter Authorized Person Name (e.g., John Smith):");
    if (!repName || !repName.trim()) return;

    saveCustomContact(repName.trim());
    renderGroupedContacts();
    personSelect.value = repName.trim();
  };

  const listContainer = document.getElementById('af_presets_list');
  let draggedItemIndex = null;

  function renderPresets(filter = "") {
    listContainer.innerHTML = "";
    const today = getTodayFormatted();
    const presets = getStoredPresets();

    presets.forEach((pText, index) => {
      const displayFormatted = pText.replace('{DATE}', today);
      if (filter && !displayFormatted.toLowerCase().includes(filter.toLowerCase())) return;

      const row = document.createElement('div');
      row.draggable = filter === "";
      row.dataset.index = index;
      row.style.cssText = 'display:flex;align-items:center;gap:6px;background:#232830;border:1px solid #30363d;border-radius:5px;padding:4px 8px;cursor:grab;user-select:none;transition:background 0.2s, border-color 0.2s;';

      const dragHandle = document.createElement('span');
      dragHandle.textContent = '⋮⋮';
      dragHandle.title = 'Drag to reorder';
      dragHandle.style.cssText = 'color:#6e7681;font-size:14px;cursor:grab;padding-right:2px;';

      const textBtn = document.createElement('button');
      textBtn.style.cssText = 'flex:1;text-align:left;background:none;border:none;color:#e6edf3;cursor:pointer;font-size:12px;line-height:1.4;padding:5px 0;';
      textBtn.textContent = displayFormatted;
      textBtn.onclick = () => {
        applyTextToDOM(displayFormatted);
        modal.remove();
      };

      const editBtn = document.createElement('button');
      editBtn.textContent = '✏️';
      editBtn.title = 'Edit item';
      editBtn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:12px;padding:4px;opacity:0.8;';
      editBtn.onclick = (e) => {
        e.stopPropagation();
        const updated = prompt("Edit preset:", pText);
        if (updated !== null && updated.trim() !== "") {
          const list = getStoredPresets();
          list[index] = updated.trim();
          saveStoredPresets(list);
          renderPresets(document.getElementById('af_search').value);
        }
      };

      const delBtn = document.createElement('button');
      delBtn.textContent = '🗑️';
      delBtn.title = 'Delete item';
      delBtn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:12px;padding:4px;opacity:0.8;';
      delBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm(`Delete this preset?\n\n"${pText}"`)) {
          const list = getStoredPresets();
          list.splice(index, 1);
          saveStoredPresets(list);
          renderPresets(document.getElementById('af_search').value);
        }
      };

      row.ondragstart = (e) => {
        draggedItemIndex = index;
        e.dataTransfer.effectAllowed = 'move';
        row.style.opacity = '0.4';
      };

      row.ondragend = () => {
        draggedItemIndex = null;
        row.style.opacity = '1';
        Array.from(listContainer.children).forEach(child => {
          child.style.borderTop = '';
          child.style.borderBottom = '';
        });
      };

      row.ondragover = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      };

      row.ondragenter = () => {
        if (draggedItemIndex === null || draggedItemIndex === index) return;
        row.style.borderColor = '#58a6ff';
      };

      row.ondragleave = () => {
        row.style.borderColor = '#30363d';
      };

      row.ondrop = (e) => {
        e.preventDefault();
        row.style.borderColor = '#30363d';
        if (draggedItemIndex === null || draggedItemIndex === index) return;

        const list = getStoredPresets();
        const draggedItem = list.splice(draggedItemIndex, 1)[0];
        list.splice(index, 0, draggedItem);

        saveStoredPresets(list);
        renderPresets(document.getElementById('af_search').value);
      };

      row.appendChild(dragHandle);
      row.appendChild(textBtn);
      row.appendChild(editBtn);
      row.appendChild(delBtn);
      listContainer.appendChild(row);
    });
  }

  renderPresets();

  document.getElementById('af_search').addEventListener('input', (e) => {
    renderPresets(e.target.value);
  });

  document.getElementById('af_add_btn').onclick = () => {
    const newNote = prompt("Enter new preset note:");
    if (newNote && newNote.trim()) {
      const list = getStoredPresets();
      list.push(newNote.trim());
      saveStoredPresets(list);
      renderPresets(document.getElementById('af_search').value);
    }
  };

  document.getElementById('af_reset_btn').onclick = () => {
    if (confirm("Reset all presets back to original defaults? Any customized edits, reordering, or deletions will be reset.")) {
      saveStoredPresets(initialDefaults);
      renderPresets(document.getElementById('af_search').value);
    }
  };

  document.getElementById('af_build_btn').onclick = () => {
    const action = document.getElementById('af_action_select').value;
    const person = personSelect.value.trim();

    if (!person) {
      alert("Please select or enter the name of the authorized person.");
      return;
    }

    let resultNote = "";
    if (action === "dispose") resultNote = `Repairs declined and asked to be disposed of by ${person}.`;
    else if (action === "return") resultNote = `Repairs declined and asked to be returned by ${person}.`;
    else if (action === "approve") resultNote = `Repairs approved by ${person}.`;
    else if (action === "storage") resultNote = `To be placed in the storage until further notice by ${person}.`;

    applyTextToDOM(resultNote);
    modal.remove();
  };

  // 📤 EXPORT HANDLER (Fixed to reference outer function by name)
  document.getElementById('af_export_btn').onclick = () => {
    const currentList = getStoredPresets();
    const formattedDefaults = JSON.stringify(currentList, null, 2);
    
    let scriptContent = runActualFindings.toString();
    scriptContent = `(${scriptContent})();`;
    scriptContent = scriptContent.replace(/const initialDefaults = \[[^]*?\];/, `const initialDefaults = ${formattedDefaults};`);

    const blob = new Blob([scriptContent], { type: "application/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Actual_Findings.js";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 📥 IMPORT HANDLER
  const fileInput = document.getElementById('af_import_file_input');
  document.getElementById('af_import_btn').onclick = () => fileInput.click();

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        let importedDefaults = [];

        const arrayMatch = text.match(/const initialDefaults = (\[[\s\S]*?\]);/);
        importedDefaults = arrayMatch ? JSON.parse(arrayMatch[1]) : JSON.parse(text);

        if (Array.isArray(importedDefaults) && importedDefaults.length > 0) {
          saveStoredPresets(importedDefaults);
          renderPresets(document.getElementById('af_search').value);
          alert(`Successfully imported ${importedDefaults.length} presets!`);
        } else {
          throw new Error("Invalid format");
        }
      } catch (err) {
        alert("Failed to parse imported file. Please upload a valid .js or .json preset file.");
      }
    };
    reader.readAsText(file);
    fileInput.value = "";
  };

  const close = () => modal.remove();
  document.getElementById('af_close_x').onclick = close;
  document.getElementById('af_cancel_btn').onclick = close;
  modal.onclick = e => { if (e.target === modal) close(); };

  document.getElementById('af_back_btn').onclick = () => {
    close();
    if (typeof window.reopenMasterLauncher === "function") {
      window.reopenMasterLauncher();
    }
  };
})();
