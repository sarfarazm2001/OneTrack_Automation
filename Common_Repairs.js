(function(){
  const initialDefaults = [
    "Bubbled keypad",
    "Torn up keypad",
    "Cracked back panel hinges",
    "Broken back panel hinges",
    "Cracked door clasp",
    "Broken door clasp",
    "Broken door hinges",
    "Cracks on the top of the cassette bay",
    "Protruded threaded insert",
    "Slightly protruded threaded insert",
    "Will not power on unless connected to a charger",
    "Will not power on even when connected to a charger",
    "Strong smoke smell",
    "Marker stain on the door",
    "Some kind of ink stain on rubber case",
    "Failed Low Down Occlusion",
    "Failed High Down Occlusion",
    "Failed Up Occlusion",
    "Failed Volume Test",
    "BT2 reading:",
    "BT3 reading:",
    "Error Code:",
    "SYSTEM TIMEOUT!",
    "Standby Light failure"
  ];

  // Map phrases that require unit values and custom placeholding
  const initialNumericConfig = {
    "Failed Volume Test": { unit: "mL", placeholder: "e.g. 9.632" },
    "Failed Low Down Occlusion": { unit: "psi", placeholder: "e.g. 10.5" },
    "Failed High Down Occlusion": { unit: "psi", placeholder: "e.g. 18.2" },
    "Failed Up Occlusion": { unit: "psi", placeholder: "e.g. -8.53" },
    "BT2 reading:": { unit: "vdc", placeholder: "e.g. 0.480" },
    "BT3 reading:": { unit: "vdc", placeholder: "e.g. 0.480" },
    "Error Code:": { unit: "", placeholder: "e.g. 102" }
  };

  // Storage Handlers for Presets
  function getStoredPresets() {
    try {
      const stored = localStorage.getItem('cr_preset_list_v1');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    localStorage.setItem('cr_preset_list_v1', JSON.stringify(initialDefaults));
    return initialDefaults;
  }

  function saveStoredPresets(list) {
    localStorage.setItem('cr_preset_list_v1', JSON.stringify(list));
  }

  // Storage Handlers for Numeric Configurations
  function getNumericConfigs() {
    try {
      const stored = localStorage.getItem('cr_numeric_config_v1');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    localStorage.setItem('cr_numeric_config_v1', JSON.stringify(initialNumericConfig));
    return initialNumericConfig;
  }

  function saveNumericConfigs(config) {
    localStorage.setItem('cr_numeric_config_v1', JSON.stringify(config));
  }

  // Format array into grammatically correct sentence
  function formatSelectedPhrases(phrases) {
    if (phrases.length === 0) return "";
    if (phrases.length === 1) return phrases[0] + ".";
    if (phrases.length === 2) return phrases.join(" and ") + ".";
    return phrases.slice(0, -1).join(", ") + ", and " + phrases[phrases.length - 1] + ".";
  }

  // Target Injection & Automatic Clipboard Copy
  function applyTextToDOM(text) {
    if (!text) return;

    // 1. Copy to Clipboard automatically
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(err => {
        console.warn("Clipboard copy failed: ", err);
      });
    }

    // 2. Inject into target input/textarea field
    let targetEl = document.getElementById('Description') ||
                   document.querySelector('textarea[name="Description"]') ||
                   document.getElementById('findingsTextArea') || 
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

  // Remove existing instance if open
  const existing = document.getElementById('cr-preset-modal');
  if (existing) existing.remove();

  // Create Modal Shell
  const modal = document.createElement('div');
  modal.id = 'cr-preset-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999999;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;';

  const box = document.createElement('div');
  box.style.cssText = 'background:#1e2329;padding:20px;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.5);width:480px;max-height:85vh;display:flex;flex-direction:column;color:#f1f3f5;border:1px solid #2d333b;';

  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <h3 style="margin:0;font-size:16px;font-weight:700;color:#fff;">🛠️ Common Repairs / Descriptions</h3>
      <span id="cr_close_x" style="cursor:pointer;font-size:20px;color:#8b949e;line-height:1;">&times;</span>
    </div>

    <!-- Multi-Insert Header Action -->
    <div style="background:#262c36;padding:10px;border-radius:6px;border:1px solid #363d4a;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:12px;color:#8b949e;"><strong id="cr_selected_count" style="color:#58a6ff;">0</strong> items selected</span>
      <button id="cr_insert_selected_btn" style="padding:6px 12px;background:#1f6feb;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">Insert Combined Selected</button>
    </div>

    <!-- Search & Add Bar -->
    <div style="display:flex;gap:6px;margin-bottom:10px;">
      <input type="text" id="cr_search" placeholder="🔍 Search common phrases..." style="flex:1;padding:8px;background:#1e2329;color:#fff;border:1px solid #363d4a;border-radius:4px;font-size:12px;box-sizing:border-box;">
      <button id="cr_add_btn" style="padding:8px 12px;background:#238636;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;white-space:nowrap;">➕ Add Phrase</button>
    </div>

    <!-- Presets List -->
    <div id="cr_presets_list" style="overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:6px;padding-right:4px;"></div>

    <!-- Footer Controls -->
    <div style="display:flex;gap:8px;margin-top:12px;">
      <button id="cr_reset_btn" title="Reset to original list" style="padding:8px 12px;background:#484f58;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">↺ Reset Defaults</button>
      <button id="cr_back_btn" style="flex:1;padding:8px;background:#363d4a;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">← Back</button>
      <button id="cr_cancel_btn" style="flex:1;padding:8px;background:#da3633;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">Cancel</button>
    </div>
  `;

  modal.appendChild(box);
  document.body.appendChild(modal);

  const listContainer = document.getElementById('cr_presets_list');
  const countBadge = document.getElementById('cr_selected_count');
  let selectedMap = new Map();
  let draggedItemIndex = null;

  function updateSelectedCount() {
    countBadge.textContent = selectedMap.size;
  }

  function renderPresets(filter = "") {
    listContainer.innerHTML = "";
    const presets = getStoredPresets();
    const numericConfigs = getNumericConfigs();

    presets.forEach((rawText, index) => {
      const pText = rawText.replace(/\.$/, '').trim();

      if (filter && !pText.toLowerCase().includes(filter.toLowerCase())) return;

      const row = document.createElement('div');
      row.draggable = filter === "";
      row.dataset.index = index;
      row.style.cssText = 'display:flex;align-items:center;gap:6px;background:#232830;border:1px solid #30363d;border-radius:5px;padding:4px 8px;cursor:grab;user-select:none;transition:background 0.2s, border-color 0.2s;';

      const isNumeric = !!numericConfigs[pText];
      const config = numericConfigs[pText] || {};

      // Checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = selectedMap.has(pText);
      checkbox.style.cssText = 'cursor:pointer;margin:0 2px;';

      // Drag Handle
      const dragHandle = document.createElement('span');
      dragHandle.textContent = '⋮⋮';
      dragHandle.title = 'Drag to reorder';
      dragHandle.style.cssText = 'color:#6e7681;font-size:14px;cursor:grab;padding-right:2px;';

      // Text Display
      const textBtn = document.createElement('button');
      textBtn.style.cssText = 'flex:1;text-align:left;background:none;border:none;color:#e6edf3;cursor:pointer;font-size:12px;line-height:1.4;padding:5px 0;';
      textBtn.textContent = pText;

      // Numeric Input field
      let inputEl = null;
      if (isNumeric) {
        inputEl = document.createElement('input');
        inputEl.type = 'text';
        inputEl.placeholder = config.placeholder || "value";
        inputEl.style.cssText = 'width:85px;padding:3px 6px;background:#1e2329;color:#58a6ff;border:1px solid #363d4a;border-radius:4px;font-size:11px;box-sizing:border-box;margin-left:auto;';

        const updateNumericValue = () => {
          const val = inputEl.value.trim();
          let finalPhrase = pText;
          if (val) {
            const unitSuffix = config.unit ? ` ${config.unit}` : '';
            if (pText.endsWith(':')) {
              finalPhrase = `${pText} ${val}${unitSuffix}`;
            } else {
              finalPhrase = `${pText} (${val}${unitSuffix})`;
            }
          }
          selectedMap.set(pText, finalPhrase);
          checkbox.checked = true;
          updateSelectedCount();
        };

        inputEl.oninput = (e) => {
          e.stopPropagation();
          updateNumericValue();
        };

        inputEl.onclick = (e) => e.stopPropagation();
      }

      checkbox.onclick = (e) => {
        e.stopPropagation();
        if (checkbox.checked) {
          if (isNumeric && inputEl && inputEl.value.trim()) {
            const val = inputEl.value.trim();
            const unitSuffix = config.unit ? ` ${config.unit}` : '';
            const formatted = pText.endsWith(':') ? `${pText} ${val}${unitSuffix}` : `${pText} (${val}${unitSuffix})`;
            selectedMap.set(pText, formatted);
          } else {
            selectedMap.set(pText, pText);
          }
        } else {
          selectedMap.delete(pText);
        }
        updateSelectedCount();
      };

      textBtn.onclick = () => {
        let textToUse = pText;
        if (isNumeric && inputEl && inputEl.value.trim()) {
          const val = inputEl.value.trim();
          const unitSuffix = config.unit ? ` ${config.unit}` : '';
          textToUse = pText.endsWith(':') ? `${pText} ${val}${unitSuffix}` : `${pText} (${val}${unitSuffix})`;
        }

        if (selectedMap.size > 0 && !selectedMap.has(pText)) {
          selectedMap.set(pText, textToUse);
        }

        const phrasesToInsert = selectedMap.size > 0 ? Array.from(selectedMap.values()) : [textToUse];
        applyTextToDOM(formatSelectedPhrases(phrasesToInsert));
        modal.remove();
      };

      // Edit Button
      const editBtn = document.createElement('button');
      editBtn.textContent = '✏️';
      editBtn.title = 'Edit phrase';
      editBtn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:12px;padding:4px;opacity:0.8;';
      editBtn.onclick = (e) => {
        e.stopPropagation();
        const updated = prompt("Edit common repair phrase:", pText);
        if (updated !== null && updated.trim() !== "") {
          const list = getStoredPresets();
          const configs = getNumericConfigs();
          
          if (configs[pText]) {
            configs[updated.trim()] = configs[pText];
            delete configs[pText];
            saveNumericConfigs(configs);
          }

          list[index] = updated.trim();
          saveStoredPresets(list);

          if (selectedMap.has(pText)) {
            const val = selectedMap.get(pText);
            selectedMap.delete(pText);
            selectedMap.set(updated.trim(), val.replace(pText, updated.trim()));
          }
          renderPresets(document.getElementById('cr_search').value);
        }
      };

      // Delete Button
      const delBtn = document.createElement('button');
      delBtn.textContent = '🗑️';
      delBtn.title = 'Delete phrase';
      delBtn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:12px;padding:4px;opacity:0.8;';
      delBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm(`Delete this phrase?\n\n"${pText}"`)) {
          const list = getStoredPresets();
          const configs = getNumericConfigs();

          list.splice(index, 1);
          delete configs[pText];
          selectedMap.delete(pText);

          saveStoredPresets(list);
          saveNumericConfigs(configs);
          updateSelectedCount();
          renderPresets(document.getElementById('cr_search').value);
        }
      };

      // Drag and Drop
      row.ondragstart = (e) => {
        draggedItemIndex = index;
        e.dataTransfer.effectAllowed = 'move';
        row.style.opacity = '0.4';
      };

      row.ondragend = () => {
        draggedItemIndex = null;
        row.style.opacity = '1';
        Array.from(listContainer.children).forEach(child => {
          child.style.borderColor = '#30363d';
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
        renderPresets(document.getElementById('cr_search').value);
      };

      row.appendChild(checkbox);
      row.appendChild(dragHandle);
      row.appendChild(textBtn);
      if (inputEl) row.appendChild(inputEl);
      row.appendChild(editBtn);
      row.appendChild(delBtn);
      listContainer.appendChild(row);
    });
  }

  renderPresets();

  // Multi-Insert Action
  document.getElementById('cr_insert_selected_btn').onclick = () => {
    if (selectedMap.size === 0) {
      alert("Please select at least one phrase using the checkboxes.");
      return;
    }
    applyTextToDOM(formatSelectedPhrases(Array.from(selectedMap.values())));
    modal.remove();
  };

  // Search & Add
  document.getElementById('cr_search').addEventListener('input', (e) => {
    renderPresets(e.target.value);
  });

  document.getElementById('cr_add_btn').onclick = () => {
    const newNote = prompt("Enter new common repair phrase:");
    if (newNote && newNote.trim()) {
      const phrase = newNote.trim();
      const list = getStoredPresets();
      list.push(phrase);
      saveStoredPresets(list);

      // Prompt to configure as numeric input field
      const needsNumber = confirm(`Does "${phrase}" require a numeric input field?`);
      if (needsNumber) {
        const unit = prompt("Enter measurement unit (leave empty if none, e.g., psi, mL, vdc):", "") || "";
        const placeholder = prompt("Enter placeholder text:", "e.g. 100") || "value";
        
        const configs = getNumericConfigs();
        configs[phrase] = { unit: unit.trim(), placeholder: placeholder.trim() };
        saveNumericConfigs(configs);
      }

      renderPresets(document.getElementById('cr_search').value);
    }
  };

  document.getElementById('cr_reset_btn').onclick = () => {
    if (confirm("Reset all common repair phrases to original defaults? Custom edits and order will be reset.")) {
      selectedMap.clear();
      updateSelectedCount();
      saveStoredPresets(initialDefaults);
      saveNumericConfigs(initialNumericConfig);
      renderPresets(document.getElementById('cr_search').value);
    }
  };

  const close = () => modal.remove();
  document.getElementById('cr_close_x').onclick = close;
  document.getElementById('cr_cancel_btn').onclick = close;
  modal.onclick = e => { if (e.target === modal) close(); };

  document.getElementById('cr_back_btn').onclick = () => {
    close();
    if (typeof window.reopenMasterLauncher === "function") {
      window.reopenMasterLauncher();
    }
  };
})();
