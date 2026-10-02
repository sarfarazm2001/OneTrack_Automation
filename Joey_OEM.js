(function () {
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

  function getStoredParts() {
    try {
      const stored = localStorage.getItem("joey_oem_parts_list_v1");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    localStorage.setItem("joey_oem_parts_list_v1", JSON.stringify(initialParts));
    return initialParts;
  }

  function saveStoredParts(list) {
    localStorage.setItem("joey_oem_parts_list_v1", JSON.stringify(list));
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

  const existing = document.getElementById("joey-oem-modal");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "joey-oem-modal";
  overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999999;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;";

  const box = document.createElement("div");
  box.style.cssText = "background:#1e2329;padding:20px;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.5);width:450px;max-height:85vh;display:flex;flex-direction:column;color:#f1f3f5;border:1px solid #2d333b;";

  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <h3 style="margin:0;font-size:16px;font-weight:700;color:#fff;">Joey Findings Generator</h3>
      <span id="j_close_x" style="cursor:pointer;font-size:20px;color:#8b949e;line-height:1;">&times;</span>
    </div>

    <!-- Search & Add Bar -->
    <div style="display:flex;gap:6px;margin-bottom:10px;">
      <input type="text" id="j_search" placeholder="🔍 Search parts..." style="flex:1;padding:8px;background:#1e2329;color:#fff;border:1px solid #363d4a;border-radius:4px;font-size:12px;box-sizing:border-box;">
      <button id="j_add_btn" style="padding:8px 12px;background:#238636;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;white-space:nowrap;">➕ Add Part</button>
    </div>

    <!-- Parts List -->
    <div id="j_parts_list" style="overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:6px;padding-right:4px;"></div>

    <!-- File Import/Export Bar -->
    <div style="display:flex;gap:6px;margin-top:10px;padding-top:10px;border-top:1px solid #2d333b;">
      <button id="j_export_btn" style="flex:1;padding:7px;background:#316dca;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:11px;">📤 Export Source (.js)</button>
      <button id="j_import_btn" style="flex:1;padding:7px;background:#6e40c9;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:11px;">📥 Import Parts File</button>
      <input type="file" id="j_import_file_input" accept=".js,.json" style="display:none;">
    </div>

    <!-- Footer Controls -->
    <div style="display:flex;gap:8px;margin-top:12px;">
      <button id="j_reset_btn" title="Reset to defaults" style="padding:8px 12px;background:#484f58;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">↺ Reset</button>
      <button id="j_back" style="flex:1;padding:8px;background:#363d4a;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">← Back</button>
      <button id="j_copy" style="flex:1.2;padding:8px;background:#238636;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">Apply</button>
      <button id="j_cancel" style="flex:1;padding:8px;background:#da3633;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">Cancel</button>
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const listContainer = document.getElementById("j_parts_list");

  function renderParts(filter = "") {
    listContainer.innerHTML = "";
    const partsList = getStoredParts();

    partsList.forEach((p) => {
      if (filter && !p.name.toLowerCase().includes(filter.toLowerCase()) && !p.pn.toLowerCase().includes(filter.toLowerCase())) return;

      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;justify-content:space-between;background:#232830;border:1px solid #30363d;border-radius:5px;padding:6px 8px;";

      const leftGroup = document.createElement("span");
      leftGroup.style.cssText = "display:flex;align-items:center;gap:8px;font-size:12px;color:#e6edf3;";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "j_chk";
      checkbox.value = p.name;
      checkbox.style.cssText = "transform:scale(1.1);cursor:pointer;";

      const labelText = document.createElement("span");
      labelText.textContent = p.name;

      leftGroup.appendChild(checkbox);
      leftGroup.appendChild(labelText);

      const rightGroup = document.createElement("span");
      rightGroup.style.cssText = "color:#8b949e;font-family:monospace;font-size:11px;";
      rightGroup.textContent = p.pn;

      row.appendChild(leftGroup);
      row.appendChild(rightGroup);
      listContainer.appendChild(row);
    });
  }

  renderParts();

  document.getElementById("j_search").addEventListener("input", (e) => {
    renderParts(e.target.value);
  });

  document.getElementById("j_copy").onclick = () => {
    let selectedParts = Array.from(box.querySelectorAll(".j_chk:checked")).map((cb) => cb.value);
    let partsText = selectedParts.length ? selectedParts.join(", ") : "";
    let text = `Per the OEM, the following parts have been replaced: ${partsText} and passed the related testing. The OEM also certified that the device passed the following: Buzzer Test, LED Test, Battery Test, MISTIC Test, and Audio Test.`;

    applyTextToDOM(text);
    overlay.remove();
  };

  document.getElementById("j_add_btn").onclick = () => {
    const name = prompt("Enter Part Name:");
    if (!name) return;
    const pn = prompt("Enter Part Number (or N/A):") || "N/A";

    const list = getStoredParts();
    list.push({ name: name.trim(), pn: pn.trim() });
    saveStoredParts(list);
    renderParts(document.getElementById("j_search").value);
  };

  document.getElementById("j_reset_btn").onclick = () => {
    if (confirm("Reset all parts back to initial defaults?")) {
      saveStoredParts(initialParts);
      renderParts(document.getElementById("j_search").value);
    }
  };

  // 📤 EXPORT HANDLER
  document.getElementById("j_export_btn").onclick = () => {
    const currentParts = getStoredParts();
    let scriptContent = arguments.callee.toString();
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

  // 📥 IMPORT HANDLER
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

  const close = () => overlay.remove();
  document.getElementById("j_close_x").onclick = close;
  document.getElementById("j_cancel").onclick = close;
  overlay.onclick = (e) => { if (e.target === overlay) close(); };

  document.getElementById("j_back").onclick = () => {
    close();
    if (typeof window.reopenOEMLauncher === "function") window.reopenOEMLauncher();
  };
})();
