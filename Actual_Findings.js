(function(){
  // Default contact list
  const defaultContacts = [
    { name: "Shana Brown", company: "CORAM" },
    { name: "Amy Kwong", company: "CORAM" },
    { name: "Brian Fitzpatrick", company: "OPTION CARE" },
    { name: "Carl Kerekes", company: "Walgreens" },
    { name: "William Maturo", company: "CVS" },
    { name: "Janey Mechler", company: "OPTUM" },
    { name: "Heather LeClair", company: "OPTUM" },
    { name: "David Rolph", company: "AmeriMed" },
    { name: "Alexsis Gauthier", company: "NELC" },
    { name: "Sheryl Guyer", company: "NELC" },
    { name: "Lauren Lynch", company: "NELC" },
    { name: "Michael O'Connor", company: "NELC" },
    { name: "Joshua Kronick", company: "NELC" }
  ];

  // Base Presets List
  const defaultPresets = [
    "TE: 8TR, 77TR, 148TR, 134TR, 6J",
    "Outdated battery and it needs to be changed. (JOEY)",
    "Battery replaced on {DATE}. (JOEY)",
    "This device is under warranty.",
    "Pressure strains calibrated. (CURLIN)",
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

  // LocalStorage Helpers for Custom Contacts & Presets
  function getCustomContacts() {
    try {
      return JSON.parse(localStorage.getItem('af_custom_contacts') || '[]');
    } catch(e) { return []; }
  }

  function saveCustomContact(name, company) {
    const customs = getCustomContacts();
    customs.push({ name, company });
    localStorage.setItem('af_custom_contacts', JSON.stringify(customs));
  }

  function getAllContacts() {
    return [...defaultContacts, ...getCustomContacts()];
  }

  function getCustomPresets() {
    try {
      return JSON.parse(localStorage.getItem('af_custom_presets') || '[]');
    } catch(e) { return []; }
  }

  function saveCustomPresets(list) {
    localStorage.setItem('af_custom_presets', JSON.stringify(list));
  }

  // Target Finder for Actual Findings field ONLY
  function applyTextToDOM(text) {
    const textareas = Array.from(document.querySelectorAll('textarea, input[type="text"]'));
    
    let targetEl = textareas.find(el => {
      const nameOrId = (el.name || el.id || "").toLowerCase();
      return nameOrId.includes("actualfinding") || nameOrId.includes("actual_finding") || nameOrId.includes("findings");
    });

    if (!targetEl) {
      const labels = Array.from(document.querySelectorAll('label, td, th, span, div'));
      const afLabel = labels.find(el => el.children.length === 0 && el.textContent.trim().toLowerCase().includes("actual findings"));
      if (afLabel) {
        if (afLabel.nextElementSibling && afLabel.nextElementSibling.querySelector('textarea')) {
          targetEl = afLabel.nextElementSibling.querySelector('textarea');
        } else if (afLabel.parentElement) {
          targetEl = afLabel.parentElement.querySelector('textarea');
        }
      }
    }

    if (!targetEl) {
      targetEl = textareas.find(el => {
        const nameOrId = (el.name || el.id || "").toLowerCase();
        return !nameOrId.includes("customerinstruction") && !nameOrId.includes("instruction");
      });
    }

    if (targetEl) {
      targetEl.value = text;
      targetEl.dispatchEvent(new Event('input', { bubbles: true }));
      targetEl.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard: " + text);
    }
  }

  // Remove existing modal if present
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
      
      <div style="display:grid;grid-template-columns:1fr 1.2fr auto;gap:6px;margin-bottom:8px;">
        <!-- Reference Company Filter -->
        <select id="af_company_filter" style="padding:7px;background:#1e2329;color:#8b949e;border:1px solid #444;border-radius:4px;font-size:12px;">
          <option value="">Filter Company...</option>
        </select>

        <!-- Authorized Rep Input -->
        <input type="text" id="af_person_input" list="af_contacts_list" placeholder="Authorized Person..." style="padding:7px;background:#1e2329;color:#fff;border:1px solid #444;border-radius:4px;font-size:12px;">
        <datalist id="af_contacts_list"></datalist>

        <!-- Add Contact Button -->
        <button id="af_add_rep_btn" title="Add new rep & company" style="padding:7px 10px;background:#238636;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">➕ Rep</button>
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

    <!-- Footer Controls -->
    <div style="display:flex;gap:8px;margin-top:12px;">
      <button id="af_back_btn" style="flex:1;padding:8px;background:#363d4a;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">← Back</button>
      <button id="af_cancel_btn" style="flex:1;padding:8px;background:#da3633;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">Cancel</button>
    </div>
  `;

  modal.appendChild(box);
  document.body.appendChild(modal);

  const companyFilter = document.getElementById('af_company_filter');
  const contactsList = document.getElementById('af_contacts_list');

  // Populates Companies and Rep Datalist
  function refreshContactUI() {
    const allContacts = getAllContacts();
    const companies = Array.from(new Set(allContacts.map(c => c.company))).sort();

    const currentSelectedCompany = companyFilter.value;
    companyFilter.innerHTML = `<option value="">Filter Company...</option>` + 
      companies.map(comp => `<option value="${comp}" ${comp === currentSelectedCompany ? 'selected' : ''}>${comp}</option>`).join('');

    contactsList.innerHTML = "";
    const filtered = currentSelectedCompany 
      ? allContacts.filter(c => c.company === currentSelectedCompany) 
      : allContacts;

    filtered.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name;
      opt.label = `${c.name} (${c.company})`;
      contactsList.appendChild(opt);
    });
  }

  refreshContactUI();

  companyFilter.addEventListener('change', () => {
    refreshContactUI();
    document.getElementById('af_person_input').value = "";
  });

  // Add New Rep & Company Dynamic Flow
  document.getElementById('af_add_rep_btn').onclick = () => {
    const repName = prompt("Enter Authorized Person Name (e.g., John Smith):");
    if (!repName || !repName.trim()) return;

    const companyName = prompt("Enter Company/Client Name (e.g., CORAM):");
    if (!companyName || !companyName.trim()) return;

    saveCustomContact(repName.trim(), companyName.trim().toUpperCase());
    refreshContactUI();
    document.getElementById('af_person_input').value = repName.trim();
    alert(`Added ${repName.trim()} (${companyName.trim().toUpperCase()}) to contacts list!`);
  };

  // Render Presets
  const listContainer = document.getElementById('af_presets_list');
  function renderPresets(filter = "") {
    listContainer.innerHTML = "";
    const today = getTodayFormatted();
    const allPresets = [...defaultPresets, ...getCustomPresets()];

    allPresets.forEach(pText => {
      const formattedText = pText.replace('{DATE}', today);
      if (filter && !formattedText.toLowerCase().includes(filter.toLowerCase())) return;

      const btn = document.createElement('button');
      btn.className = 'af_preset_btn';
      btn.style.cssText = 'text-align:left;padding:9px;background:#232830;color:#e6edf3;border:1px solid #30363d;border-radius:5px;cursor:pointer;font-size:12px;line-height:1.4;';
      btn.textContent = formattedText;
      btn.onclick = () => {
        applyTextToDOM(formattedText);
        modal.remove();
      };
      listContainer.appendChild(btn);
    });
  }
  renderPresets();

  // Search Filter
  document.getElementById('af_search').addEventListener('input', (e) => {
    renderPresets(e.target.value);
  });

  // Add Custom Preset Note
  document.getElementById('af_add_btn').onclick = () => {
    const newNote = prompt("Enter new preset note:");
    if (newNote && newNote.trim()) {
      const customs = getCustomPresets();
      customs.push(newNote.trim());
      saveCustomPresets(customs);
      renderPresets(document.getElementById('af_search').value);
    }
  };

  // Dynamic Builder Action
  document.getElementById('af_build_btn').onclick = () => {
    const action = document.getElementById('af_action_select').value;
    const person = document.getElementById('af_person_input').value.trim();

    if (!person) {
      alert("Please select or enter the name of the authorized person.");
      return;
    }

    let resultNote = "";
    if (action === "dispose") {
      resultNote = `Repairs declined and asked to be disposed of by ${person}.`;
    } else if (action === "return") {
      resultNote = `Repairs declined and asked to be returned by ${person}.`;
    } else if (action === "approve") {
      resultNote = `Repairs approved by ${person}.`;
    } else if (action === "storage") {
      resultNote = `To be placed in the storage until further notice by ${person}.`;
    }

    applyTextToDOM(resultNote);
    modal.remove();
  };

  // Close & Back Events
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
