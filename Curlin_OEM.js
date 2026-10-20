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
  box.style.cssText = "background:#1e232a;padding:20px;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.6);width:540px;text-align:left;color:#f1f3f5;border:1px solid #2d333b;";

  let html = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <h3 style="margin:0;font-size:16px;font-weight:700;color:#fff;">Curlin Billing Calculator & 2K Scanner</h3>
      <span id="c_close_btn" style="cursor:pointer;font-size:18px;color:#8b949e;">&times;</span>
    </div>
    
    <!-- 2K Scanner Toggle Button -->
    <button id="c_scan_toggle_btn" style="width:100%;padding:9px;margin-bottom:10px;background:#1f6feb;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:700;font-size:12px;">
      📷 Open 2K HD Document Scanner
    </button>

    <!-- Scanner Viewfinder Container -->
    <div id="c_scanner_container" style="display:none;background:#161b22;padding:12px;border-radius:6px;border:1px dashed #30363d;margin-bottom:10px;text-align:center;">
      <div id="c_drop_area" style="cursor:pointer;padding:10px;border:1px dashed #484f58;border-radius:4px;margin-bottom:8px;background:#0d1117;font-size:11px;color:#8b949e;">
        📷 Drag & drop image here, paste (<code style="color:#58a6ff;">Ctrl+V</code>), or click to upload
        <input type="file" id="c_file_input" accept="image/*" style="display:none;">
      </div>
      <video id="c_video_element" autoplay playsinline title="Click video stream to refocus" style="width:100%;max-height:200px;border-radius:4px;background:#000;display:none;margin-bottom:8px;cursor:pointer;border:1px solid #30363d;"></video>
      <div style="display:flex;gap:8px;justify-content:center;">
        <button id="c_start_cam_btn" style="flex:1;padding:7px;background:#238636;color:#fff;border:none;border-radius:5px;cursor:pointer;font-weight:600;font-size:11px;">📷 Start 2K Camera</button>
        <button id="c_capture_btn" style="flex:1;padding:7px;background:#1f6feb;color:#fff;border:none;border-radius:5px;cursor:pointer;font-weight:600;font-size:11px;display:none;">📸 Snap & Process High-Res</button>
      </div>
    </div>

    <!-- Status Toast -->
    <div id="c_toast" style="display:none;padding:6px 10px;background:#17a2b8;color:#fff;border-radius:4px;font-size:11px;font-weight:bold;margin-bottom:10px;text-align:center;"></div>

    <!-- Controls Bar -->
    <div style="display:flex;gap:8px;margin-bottom:10px;">
      <input type="text" id="c_search_input" placeholder="🔍 Search parts..." style="flex:1;padding:8px 10px;background:#0d1117;color:#fff;border:1px solid #30363d;border-radius:6px;font-size:12px;">
      <button id="c_add_btn" style="padding:8px 14px;background:#238636;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:bold;">+ Add Part</button>
    </div>

    <!-- IO Toolbar -->
    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button id="c_export_btn" style="flex:1;padding:8px;background:#3b5998;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:11px;font-weight:bold;">📤 Export Source (.js)</button>
      <button id="c_import_btn" style="flex:1;padding:8px;background:#6f42c1;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:11px;font-weight:bold;">📥 Import Parts File</button>
      <input type="file" id="c_file_input_script" accept=".js,.json" style="display:none;">
    </div>

    <!-- Parts List Container -->
    <div id="c_parts_list" style="max-height:220px;overflow-y:auto;margin-bottom:14px;background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:6px;"></div>

    <!-- Action Buttons -->
    <div style="display:flex;gap:8px;">
      <button id="c_reset" style="padding:10px 12px;background:#30363d;color:#e6edf3;border:1px solid #484f58;border-radius:6px;cursor:pointer;font-size:12px;font-weight:bold;">↺ Reset</button>
      <button id="c_back" style="padding:10px 12px;background:#30363d;color:#e6edf3;border:1px solid #484f58;border-radius:6px;cursor:pointer;font-size:12px;font-weight:bold;">← Back</button>
      <button id="c_copy" style="flex:1;padding:10px;background:#238636;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:bold;">Apply Findings</button>
      <button id="c_cancel" style="padding:10px 12px;background:#da3633;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:bold;">Cancel</button>
    </div>
  `;

  box.innerHTML = html;
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  let mediaStream = null;
  const scanToggleBtn = box.querySelector("#c_scan_toggle_btn");
  const scannerContainer = box.querySelector("#c_scanner_container");
  const dropArea = box.querySelector("#c_drop_area");
  const fileInput = box.querySelector("#c_file_input");
  const videoElement = box.querySelector("#c_video_element");
  const startCamBtn = box.querySelector("#c_start_cam_btn");
  const captureBtn = box.querySelector("#c_capture_btn");
  const toast = box.querySelector("#c_toast");

  function showToast(msg) {
    toast.innerText = msg;
    toast.style.display = "block";
  }

  scanToggleBtn.onclick = () => {
    if (scannerContainer.style.display === "none") {
      scannerContainer.style.display = "block";
      scanToggleBtn.innerText = "❌ Close Scanner Viewfinder";
    } else {
      if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
      videoElement.style.display = "none";
      captureBtn.style.display = "none";
      scannerContainer.style.display = "none";
      scanToggleBtn.innerText = "📷 Open 2K HD Document Scanner";
    }
  };

  videoElement.onclick = async () => {
    if (!mediaStream) return;
    const track = mediaStream.getVideoTracks()[0];
    if (track && track.getCapabilities) {
      const caps = track.getCapabilities();
      if (caps.focusMode) {
        try {
          showToast("🎯 Triggering refocus...");
          await track.applyConstraints({ advanced: [{ focusMode: 'single-shot' }] });
          setTimeout(() => {
            track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] });
            showToast("Camera active. Frame document and click Snap & Process.");
          }, 400);
        } catch (e) {}
      }
    }
  };

  startCamBtn.onclick = async () => {
    try {
      showToast("Initializing 2K camera stream...");
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 2560, min: 1920 },
          height: { ideal: 1440, min: 1080 },
          facingMode: { ideal: "environment" }
        }
      });
      videoElement.srcObject = mediaStream;
      videoElement.style.display = "block";
      captureBtn.style.display = "inline-block";

      const track = mediaStream.getVideoTracks()[0];
      if (track && track.getCapabilities) {
        const caps = track.getCapabilities();
        const advanced = [];
        if (caps.focusMode && caps.focusMode.includes('continuous')) advanced.push({ focusMode: 'continuous' });
        if (caps.exposureMode && caps.exposureMode.includes('continuous')) advanced.push({ exposureMode: 'continuous' });
        if (advanced.length > 0) await track.applyConstraints({ advanced }).catch(() => {});
      }

      showToast("2K Camera Active! Click preview to refocus or click Snap & Process.");
    } catch (err) {
      alert("Camera Access Error: " + err.message);
    }
  };

  dropArea.onclick = () => fileInput.click();
  fileInput.onchange = (e) => {
    if (e.target.files.length > 0) processImageFile(e.target.files[0]);
  };

  overlay.addEventListener("paste", (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData)?.items;
    if (items) {
      for (let item of items) {
        if (item.type.indexOf("image") !== -1) {
          processImageFile(item.getAsFile());
          break;
        }
      }
    }
  });

  function processImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      let img = new Image();
      img.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        runPreprocessedTesseract(canvas);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  captureBtn.onclick = () => {
    let canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth || 2560;
    canvas.height = videoElement.videoHeight || 1440;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
    videoElement.style.display = "none";
    captureBtn.style.display = "none";

    runPreprocessedTesseract(canvas);
  };

  function preprocessCanvasForOCR(canvas) {
    let ctx = canvas.getContext("2d");
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let d = imgData.data;

    for (let i = 0; i < d.length; i += 4) {
      let v = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      v = (v - 128) * 1.5 + 128;
      v = v < 0 ? 0 : (v > 255 ? 255 : v);
      d[i] = d[i + 1] = d[i + 2] = v;
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL("image/png");
  }

  async function runPreprocessedTesseract(canvas) {
    showToast("⚡ Preprocessing 2K image & running Tesseract...");
    const preprocessedDataUri = preprocessCanvasForOCR(canvas);

    try {
      if (typeof Tesseract === "undefined") {
        await new Promise((resolve, reject) => {
          let script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      let result = await Tesseract.recognize(preprocessedDataUri, "eng");
      let rawText = result.data.text ? result.data.text.trim() : "";

      if (rawText) {
        let count = window._otAutoSelectCurlin(rawText);
        showToast(`✓ Processed 2K Scan! Auto-selected ${count} part(s).`);
      } else {
        alert("No text detected in image.");
      }
    } catch (err) {
      console.error("Tesseract Error:", err);
      alert("OCR Error: " + err.message);
    }
  }

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

  document.getElementById("c_search_input").oninput = (e) => {
    const q = e.target.value.toLowerCase().trim();
    const rows = document.querySelectorAll("#c_parts_list .part_row");
    rows.forEach(r => {
      const txt = r.innerText.toLowerCase();
      r.style.display = txt.includes(q) ? "flex" : "none";
    });
  };

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
    document.getElementById("c_file_input_script").click();
  };

  document.getElementById("c_file_input_script").onchange = (e) => {
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

  const closeModal = () => {
    if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
    if (overlay) overlay.remove();
  };

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
