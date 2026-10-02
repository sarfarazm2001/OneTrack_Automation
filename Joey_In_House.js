(function () {
  const initialHighlightParts = [
    { name: "Back Case Over mold (New)", pn: "F31927" },
    { name: "BATTERY DOOR,JOEY", pn: "F31929" },
    { name: "Battery (Covidien) Li-Ion", pn: "F010506" },
    { name: "COVER-BUZZER(TYVEK)", pn: "F31940" },
    { name: "FLEX CIRCUIT ASSEMBLY", pn: "F31943" },
    { name: "FOAM BATTERY PAD", pn: "F32001" },
    { name: "FRONT CASE", pn: "F31928" },
    { name: "MAIN DOOR", pn: "F32061" },
    { name: "MOUNTING STUD THREADED", pn: "F31992" },
    { name: "Overlay (New)", pn: "1051140" },
    { name: "RICHO HARNESS CLIP", pn: "F080757" },
    { name: "ROTOR ASSEMBLY", pn: "F31934" },
    { name: "ULTRASONIC ASSEMBLY", pn: "F31941" }
  ];

  const initialStandardParts = [
    { name: "3/16 E-STYLE RETAINING CLIP", pn: "F132239" },
    { name: "ALUMINUM SPACER", pn: "F31984" },
    { name: "Back Case Over mold (New)", pn: "F31927" },
    { name: "BATTERY DOOR,JOEY", pn: "F31929" },
    { name: "Battery (Covidien) Li-Ion", pn: "F010506" },
    { name: "Battery (R&D)", pn: "6214" },
    { name: "BATTERY/POWER HARNES,JOEY", pn: "F090716" },
    { name: "BUZZER HARNESS,JOEY", pn: "F090718" },
    { name: "COLLAR,JOEY", pn: "F31993" },
    { name: "COMMUNICATION PORT CONNECTOR", pn: "F132225" },
    { name: "COMMUNICATION PORT HARNESS", pn: "F090717" },
    { name: "COVER-BUZZER(TYVEK)", pn: "F31940" },
    { name: "DISPLAY LCD,JOEY", pn: "F060159" },
    { name: "ELECTRICAL PLUG", pn: "F010376" },
    { name: "FLEX CIRCUIT ASSEMBLY", pn: "F31943" },
    { name: "FOAM BATTERY PAD", pn: "F32001" },
    { name: "FRONT CASE", pn: "F31928" },
    { name: "Fuse", pn: "F010513" },
    { name: "GEARBOX ASSEMBLY, JOEY", pn: "SHF31942" },
    { name: "GEARBOX SPACER,JOEY", pn: "F31984" },
    { name: "HARNESS-COM PORT,JOEY", pn: "F090717" },
    { name: "Joey Power Cord W/Adapter", pn: "383491" },
    { name: "K22X8MM SCREW", pn: "F132193" },
    { name: "K30X8MM SCREW", pn: "F132195" },
    { name: "LENS-PC", pn: "F31939" },
    { name: "MAIN DOOR", pn: "F32061" },
    { name: "MOUNTING STUD THREADED", pn: "F31992" },
    { name: "Overlay (New)", pn: "1051140" },
    { name: "Overlay (Old Part #)", pn: "F132224" },
    { name: "PCB SPACERS", pn: "383493" },
    { name: "Pole Clamp Assembly", pn: "383493" },
    { name: "POLE CLAMP BRACKET", pn: "F31958" },
    { name: "POLE CLAMP COLLAR", pn: "F31993" },
    { name: "POLE CLAMP LEVER,JOEY", pn: "F141931" },
    { name: "Pole Clamp Knob", pn: "F141921" },
    { name: "RICHO HARNESS CLIP", pn: "F080757" },
    { name: "ROTOR ASSEMBLY", pn: "F31934" },
    { name: "ROTOR SHAFT SEAL", pn: "F31938" },
    { name: "SCREW #4, 15/16", pn: "F132236" },
    { name: "SCREW #6, 7/16", pn: "F132227" },
    { name: "SCREW #6,3", pn: "F132226" },
    { name: "SCREW #6,3/4", pn: "F132228" },
    { name: "SEAL-SENSORS,JOEY", pn: "F31938" },
    { name: "SHOULDER BOLT CAP SEAL,JOEY", pn: "F31937" },
    { name: "Shoulder Bolt #4,7/16", pn: "F132223" },
    { name: "ULTRASONIC ASSEMBLY", pn: "F31941" },
    { name: "WASHER SEAL,JOEY", pn: "F31983" }
  ];

  function getStoredData() {
    try {
      const storedH = localStorage.getItem("joey_inhouse_highlights_v1");
      const storedS = localStorage.getItem("joey_inhouse_standards_v1");
      if (storedH && storedS) {
        return { highlightParts: JSON.parse(storedH), standardParts: JSON.parse(storedS) };
      }
    } catch (e) {}
    localStorage.setItem("joey_inhouse_highlights_v1", JSON.stringify(initialHighlightParts));
    localStorage.setItem("joey_inhouse_standards_v1", JSON.stringify(initialStandardParts));
    return { highlightParts: initialHighlightParts, standardParts: initialStandardParts };
  }

  function saveData(hData, sData) {
    localStorage.setItem("joey_inhouse_highlights_v1", JSON.stringify(hData));
    localStorage.setItem("joey_inhouse_standards_v1", JSON.stringify(sData));
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

  const existing = document.getElementById("joey-inhouse-modal");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "joey-inhouse-modal";
  overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999999;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;";

  const box = document.createElement("div");
  box.style.cssText = "background:#1e2329;padding:20px;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.5);width:450px;max-height:85vh;display:flex;flex-direction:column;color:#f1f3f5;border:1px solid #2d333b;";

  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <h3 style="margin:0;font-size:16px;font-weight:700;color:#fff;">Joey IN HOUSE Findings Generator</h3>
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
    const { highlightParts, standardParts } = getStoredData();

    const sortedHighlights = [...highlightParts].sort((a, b) => a.name.localeCompare(b.name));
    const seen = new Set(sortedHighlights.map((p) => p.name));
    const unhighlighted = standardParts.filter((p) => !seen.has(p.name)).sort((a, b) => a.name.localeCompare(b.name));

    const createRow = (p, isHighlight) => {
      if (filter && !p.name.toLowerCase().includes(filter.toLowerCase()) && !p.pn.toLowerCase().includes(filter.toLowerCase())) return null;

      const row = document.createElement("div");
      row.style.cssText = isHighlight
        ? "display:flex;align-items:center;justify-content:space-between;background:#382d12;border:1px solid #845306;border-radius:5px;padding:6px 8px;font-weight:bold;"
        : "display:flex;align-items:center;justify-content:space-between;background:#232830;border:1px solid #30363d;border-radius:5px;padding:6px 8px;";

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
      return row;
    };

    sortedHighlights.forEach((p) => {
      const row = createRow(p, true);
      if (row) listContainer.appendChild(row);
    });

    unhighlighted.forEach((p) => {
      const row = createRow(p, false);
      if (row) listContainer.appendChild(row);
    });
  }

  renderParts();

  document.getElementById("j_search").addEventListener("input", (e) => {
    renderParts(e.target.value);
  });

  document.getElementById("j_copy").onclick = () => {
    let selectedParts = Array.from(box.querySelectorAll(".j_chk:checked")).map((cb) => cb.value);
    let partsText = selectedParts.length ? selectedParts.join(", ") : "None";
    let text = `Parts replaced are as follows:\n${partsText}.`;

    applyTextToDOM(text);
    overlay.remove();
  };

  document.getElementById("j_add_btn").onclick = () => {
    const name = prompt("Enter Part Name:");
    if (!name) return;
    const pn = prompt("Enter Part Number (or N/A):") || "N/A";
    const isHigh = confirm("Should this part be highlighted in yellow?");

    const { highlightParts, standardParts } = getStoredData();
    const newPart = { name: name.trim(), pn: pn.trim() };

    if (isHigh) highlightParts.push(newPart);
    standardParts.push(newPart);

    saveData(highlightParts, standardParts);
    renderParts(document.getElementById("j_search").value);
  };

  document.getElementById("j_reset_btn").onclick = () => {
    if (confirm("Reset all parts back to initial defaults?")) {
      saveData(initialHighlightParts, initialStandardParts);
      renderParts(document.getElementById("j_search").value);
    }
  };

  // 📤 EXPORT HANDLER
  document.getElementById("j_export_btn").onclick = () => {
    const { highlightParts, standardParts } = getStoredData();
    let scriptContent = arguments.callee.toString();
    scriptContent = `(${scriptContent})();`;
    scriptContent = scriptContent.replace(/const initialHighlightParts = \[\s[\s\S]*?\];/, `const initialHighlightParts = ${JSON.stringify(highlightParts, null, 2)};`);
    scriptContent = scriptContent.replace(/const initialStandardParts = \[\s[\s\S]*?\];/, `const initialStandardParts = ${JSON.stringify(standardParts, null, 2)};`);

    const blob = new Blob([scriptContent], { type: "application/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Joey_InHouse_Generator.js";
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
        const hMatch = text.match(/const initialHighlightParts = (\[[\s\S]*?\]);/);
        const sMatch = text.match(/const initialStandardParts = (\[[\s\S]*?\]);/);

        if (hMatch && sMatch) {
          saveData(JSON.parse(hMatch[1]), JSON.parse(sMatch[1]));
          renderParts(document.getElementById("j_search").value);
          alert("Successfully imported parts from JS script!");
        } else {
          const parsed = JSON.parse(text);
          if (parsed.highlightParts && parsed.standardParts) {
            saveData(parsed.highlightParts, parsed.standardParts);
            renderParts(document.getElementById("j_search").value);
            alert("Successfully imported parts!");
          } else throw new Error("Invalid structure");
        }
      } catch (err) {
        alert("Failed to parse file. Upload a valid .js or .json configuration.");
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
