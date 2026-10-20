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
      alert("Textarea not found. Findings copied to clipboard!");
    }
  }

  const existing = document.getElementById("joey-oem-modal");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "joey-oem-modal";
  overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999999;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;";

  const box = document.createElement("div");
  box.style.cssText = "background:#1e2329;padding:20px;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.5);width:480px;max-height:85vh;display:flex;flex-direction:column;color:#f1f3f5;border:1px solid #2d333b;";

  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <h3 style="margin:0;font-size:16px;font-weight:700;color:#fff;">Joey Findings Generator & 2K Scanner</h3>
      <span id="j_close_x" style="cursor:pointer;font-size:20px;color:#8b949e;line-height:1;">&times;</span>
    </div>

    <!-- 2K Scanner Toggle Button -->
    <button id="j_scan_toggle_btn" style="width:100%;padding:9px;margin-bottom:10px;background:#1f6feb;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:700;font-size:12px;">
      📷 Open 2K HD Document Scanner
    </button>

    <!-- Scanner Viewfinder Container -->
    <div id="j_scanner_container" style="display:none;background:#161b22;padding:12px;border-radius:6px;border:1px dashed #30363d;margin-bottom:10px;text-align:center;">
      <div id="j_drop_area" style="cursor:pointer;padding:10px;border:1px dashed #484f58;border-radius:4px;margin-bottom:8px;background:#0d1117;font-size:11px;color:#8b949e;">
        📷 Drag & drop image here, paste (<code style="color:#58a6ff;">Ctrl+V</code>), or click to upload
        <input type="file" id="j_file_input" accept="image/*" style="display:none;">
      </div>
      <video id="j_video_element" autoplay playsinline title="Click video stream to refocus" style="width:100%;max-height:180px;border-radius:4px;background:#000;display:none;margin-bottom:8px;cursor:pointer;border:1px solid #30363d;"></video>
      <div style="display:flex;gap:8px;justify-content:center;">
        <button id="j_start_cam_btn" style="flex:1;padding:7px;background:#238636;color:#fff;border:none;border-radius:5px;cursor:pointer;font-weight:600;font-size:11px;">📷 Start 2K Camera</button>
        <button id="j_capture_btn" style="flex:1;padding:7px;background:#1f6feb;color:#fff;border:none;border-radius:5px;cursor:pointer;font-weight:600;font-size:11px;display:none;">📸 Snap & Process High-Res</button>
      </div>
    </div>

    <!-- Status Toast -->
    <div id="j_toast" style="display:none;padding:6px 10px;background:#17a2b8;color:#fff;border-radius:4px;font-size:11px;font-weight:bold;margin-bottom:10px;text-align:center;"></div>

    <div style="display:flex;gap:6px;margin-bottom:10px;">
      <input type="text" id="j_search" placeholder="🔍 Search parts..." style="flex:1;padding:8px;background:#1e2329;color:#fff;border:1px solid #363d4a;border-radius:4px;font-size:12px;box-sizing:border-box;">
      <button id="j_add_btn" style="padding:8px 12px;background:#238636;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;white-space:nowrap;">➕ Add Part</button>
    </div>

    <div id="j_parts_list" style="overflow-y:auto;max-height:200px;display:flex;flex-direction:column;gap:6px;padding-right:4px;"></div>

    <div style="display:flex;gap:6px;margin-top:10px;padding-top:10px;border-top:1px solid #2d333b;">
      <button id="j_export_btn" style="flex:1;padding:7px;background:#316dca;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:11px;">📤 Export Source (.js)</button>
      <button id="j_import_btn" style="flex:1;padding:7px;background:#6e40c9;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:11px;">📥 Import Parts File</button>
      <input type="file" id="j_import_file_input" accept=".js,.json" style="display:none;">
    </div>

    <div style="display:flex;gap:8px;margin-top:12px;">
      <button id="j_reset_btn" title="Reset to defaults" style="padding:8px 12px;background:#484f58;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">↺ Reset</button>
      <button id="j_back" style="flex:1;padding:8px;background:#363d4a;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">← Back</button>
      <button id="j_copy" style="flex:1.2;padding:8px;background:#238636;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">Apply</button>
      <button id="j_cancel" style="flex:1;padding:8px;background:#da3633;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">Cancel</button>
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  let mediaStream = null;
  const scanToggleBtn = box.querySelector("#j_scan_toggle_btn");
  const scannerContainer = box.querySelector("#j_scanner_container");
  const dropArea = box.querySelector("#j_drop_area");
  const fileInputDrop = box.querySelector("#j_file_input");
  const videoElement = box.querySelector("#j_video_element");
  const startCamBtn = box.querySelector("#j_start_cam_btn");
  const captureBtn = box.querySelector("#j_capture_btn");
  const toast = box.querySelector("#j_toast");

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

  dropArea.onclick = () => fileInputDrop.click();
  fileInputDrop.onchange = (e) => {
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
        let count = window._otAutoSelectJoeyOEM(rawText);
        showToast(`✓ Processed 2K Scan! Auto-selected ${count} part(s).`);
      } else {
        alert("No text detected in image.");
      }
    } catch (err) {
      console.error("Tesseract Error:", err);
      alert("OCR Error: " + err.message);
    }
  }

  const listContainer = document.getElementById("j_parts_list");

  function renderParts(filter = "") {
    listContainer.innerHTML = "";
    const partsList = getStoredParts();
    const freq = getFreq();

    partsList.sort((a, b) => (freq[b.name] || 0) - (freq[a.name] || 0));

    partsList.forEach((p) => {
      if (filter && !p.name.toLowerCase().includes(filter.toLowerCase()) && !p.pn.toLowerCase().includes(filter.toLowerCase())) return;

      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;justify-content:space-between;background:#232830;border:1px solid #30363d;border-radius:5px;padding:6px 8px;";

      const leftGroup = document.createElement("span");
      leftGroup.style.cssText = "display:flex;align-items:center;gap:8px;font-size:12px;color:#e6edf3;";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "j_chk";
      checkbox.dataset.pn = p.pn || "N/A";
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
    let checkedEls = Array.from(box.querySelectorAll(".j_chk:checked"));
    checkedEls.forEach(cb => recordUsage(cb.value));

    let selectedParts = checkedEls.map((cb) => cb.value);
    let partsText = selectedParts.length ? selectedParts.join(", ") : "";
    let text = `Per the OEM, the following parts have been replaced: ${partsText} and passed the related testing. The OEM also certified that the device passed the following: Buzzer Test, LED Test, Battery Test, MISTIC Test, and Audio Test.`;

    applyTextToDOM(text);
    if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
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

  const close = () => {
    if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
    overlay.remove();
  };
  document.getElementById("j_close_x").onclick = close;
  document.getElementById("j_cancel").onclick = close;
  overlay.onclick = (e) => { if (e.target === overlay) close(); };

  document.getElementById("j_back").onclick = () => {
    close();
    if (typeof window.openOneTrackToolkit === "function") {
      window.openOneTrackToolkit();
    }
  };

  // --- AUTOMATED OCR AUTO-SELECT HANDLER FOR JOEY OEM ---
  window._otAutoSelectJoeyOEM = function(ocrText) {
    if (!ocrText) return 0;
    
    let cleaned = ocrText.toUpperCase().replace(/-\s*[\r\n]+\s*/g, '');
    cleaned = cleaned.replace(/\b(QTY|QUANTITY|PARTS?|REPLACED|DESCRIPTION|PART\s*NO|NO)\b/g, ' ').replace(/\b\d+\b/g, ' ');
    const normOCR = cleaned.replace(/[\r\n]+/g, ' ').replace(/[\/\\.,_\-()]+/g, ' ').replace(/\s+/g, ' ').trim();
    const alphaNumOCR = cleaned.replace(/[^A-Z0-9]/g, '');

    let matchedCount = 0;
    const checkboxes = overlay.querySelectorAll('.j_chk');

    checkboxes.forEach(chk => {
      const pnAttr = (chk.dataset.pn || '').toUpperCase().trim();
      const name = (chk.value || '').toUpperCase().trim();
      let matched = false;

      // 1. Part Number Match
      if (pnAttr && pnAttr !== 'N/A') {
        const basePN = pnAttr.replace(/(CS|CX)$/i, '');
        if (basePN.length >= 3) {
          const escBase = basePN.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const escRaw = pnAttr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const pnRegex = new RegExp(`(?:^|[^A-Z0-9])(?:${escBase}|${escRaw})(?:[^A-Z0-9]|$)`, 'i');
          const alphaBase = basePN.replace(/[^A-Z0-9]/g, '');

          if (pnRegex.test(normOCR) || (alphaBase.length >= 4 && alphaNumOCR.includes(alphaBase))) {
            matched = true;
          }
        }
      }

      // 2. Keyword Description Fallback Match
      if (!matched && name) {
        const tokens = name.replace(/[^A-Z0-9\s]/gi, ' ').split(/\s+/).filter(w => w.length >= 3 && !['ASSEMBLY', 'LABEL', 'CASE', 'DOOR', 'PACK'].includes(w));
        if (tokens.length > 0) {
          const hits = tokens.filter(t => normOCR.includes(t));
          if (hits.length === tokens.length) matched = true;
        }
      }

      if (matched) {
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
    id: 'joey_oem',
    autoSelect: window._otAutoSelectJoeyOEM
  };
})();
