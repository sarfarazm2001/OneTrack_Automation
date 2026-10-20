(function runOmniCalc() {
  const initialParts = [
    { name: "BLANK LABEL, UNREPAIRED, 1.4 X 0.625 INCHES", pn: "PT00031722" },
    { name: "KANGAROO OMNI BACK CASE ASSEMBLY", pn: "PT00080641" },
    { name: "KANGAROO OMNI REAR LABEL, WIRELESS CONNECT, CLEAR LENS", pn: "PT00100425" },
    { name: "KANGAROO OMNI SPEAKER ASSEMBLY", pn: "PT00096890" },
    { name: "KANGAROO PUMP COMBO SENSOR", pn: "PT00102970" },
    { name: "KANGAROO PUMP LCD/PCBA SUB-ASSEMBLY", pn: "PT00095863" },
    { name: "KANGAROO PUMP LATCH PLATE", pn: "PT00080643" },
    { name: "KANGAROO PUMP OVERLAY", pn: "PT00031552" },
    { name: "KANGAROO PUMP SPEAKER COVER", pn: "PT00106015" },
    { name: "KANGAROO PUMP VALVE GEARBOX", pn: "PT00093436" },
    { name: "KANGAROO PUMP 6-ROLLER ROTOR ASSY", pn: "PT00093668" }
  ];

  function getStoredParts() {
    try {
      const stored = localStorage.getItem("omni_parts_list_v1");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    localStorage.setItem("omni_parts_list_v1", JSON.stringify(initialParts));
    return initialParts;
  }

  function saveStoredParts(list) {
    localStorage.setItem("omni_parts_list_v1", JSON.stringify(list));
  }

  function getFreq() {
    try { return JSON.parse(localStorage.getItem('ot_freq_omni') || '{}'); }
    catch(e) { return {}; }
  }

  function recordUsage(partName) {
    let freq = getFreq();
    freq[partName] = (freq[partName] || 0) + 1;
    localStorage.setItem('ot_freq_omni', JSON.stringify(freq));
  }

  const existing = document.getElementById("omni-calc-modal");
  if (existing) existing.remove();

  let overlay = document.createElement("div");
  overlay.id = "omni-calc-modal";
  overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;";

  let box = document.createElement("div");
  box.style.cssText = "background:#12161a;padding:20px;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.6);width:540px;text-align:left;color:#f1f3f5;border:1px solid #2d333b;";

  let html = `
    <h3 style="margin-top:0;margin-bottom:12px;font-size:16px;text-align:center;color:#fff;">Omni Findings Generator & 2K Scanner</h3>
    
    <!-- 2K Scanner Toggle Button -->
    <button id="o_scan_toggle_btn" style="width:100%;padding:9px;margin-bottom:10px;background:#1f6feb;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:700;font-size:12px;">
      📷 Open 2K HD Document Scanner
    </button>

    <!-- Scanner Viewfinder Container -->
    <div id="o_scanner_container" style="display:none;background:#161b22;padding:12px;border-radius:6px;border:1px dashed #30363d;margin-bottom:10px;text-align:center;">
      <div id="o_drop_area" style="cursor:pointer;padding:10px;border:1px dashed #484f58;border-radius:4px;margin-bottom:8px;background:#0d1117;font-size:11px;color:#8b949e;">
        📷 Drag & drop image here, paste (<code style="color:#58a6ff;">Ctrl+V</code>), or click to upload
        <input type="file" id="o_file_input" accept="image/*" style="display:none;">
      </div>
      <video id="o_video_element" autoplay playsinline title="Click video stream to refocus" style="width:100%;max-height:180px;border-radius:4px;background:#000;display:none;margin-bottom:8px;cursor:pointer;border:1px solid #30363d;"></video>
      <div style="display:flex;gap:8px;justify-content:center;">
        <button id="o_start_cam_btn" style="flex:1;padding:7px;background:#238636;color:#fff;border:none;border-radius:5px;cursor:pointer;font-weight:600;font-size:11px;">📷 Start 2K Camera</button>
        <button id="o_capture_btn" style="flex:1;padding:7px;background:#1f6feb;color:#fff;border:none;border-radius:5px;cursor:pointer;font-weight:600;font-size:11px;display:none;">📸 Snap & Process High-Res</button>
      </div>
    </div>

    <!-- Status Toast -->
    <div id="o_toast" style="display:none;padding:6px 10px;background:#17a2b8;color:#fff;border-radius:4px;font-size:11px;font-weight:bold;margin-bottom:10px;text-align:center;"></div>

    <!-- Add Custom Part Inputs -->
    <div style="display:flex;gap:6px;margin-bottom:10px;">
      <input type="text" id="o_custom_desc" placeholder="Part Description" style="flex:2;padding:6px 8px;background:#0d1117;color:#fff;border:1px solid #30363d;border-radius:4px;font-size:12px;">
      <input type="text" id="o_custom_pn" placeholder="Part #" style="flex:1;padding:6px 8px;background:#0d1117;color:#fff;border:1px solid #30363d;border-radius:4px;font-size:12px;">
      <button id="o_add_btn" style="padding:6px 12px;background:#238636;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;">+ Add</button>
    </div>

    <!-- Import / Export Controls -->
    <div style="display:flex;gap:6px;margin-bottom:10px;">
      <input type="file" id="o_import_file" accept=".js,.json" style="display:none;">
      <button id="o_import_btn" style="flex:1;padding:6px;background:#316dca;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:11px;font-weight:bold;">📥 Import Parts File</button>
      <button id="o_export_btn" style="flex:1;padding:6px;background:#6e40c9;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:11px;font-weight:bold;">📤 Export Source (.js)</button>
    </div>

    <!-- Parts List Container -->
    <div id="o_parts_list" style="max-height:200px;overflow-y:auto;margin-bottom:12px;background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:6px;"></div>

    <!-- Pre-set Sentence Option -->
    <div style="margin-bottom:12px;text-align:center;">
      <button id="o_oem_only" style="width:100%;padding:8px;background:#30363d;color:#e6edf3;border:1px solid #484f58;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;">Set to "Returned from OEM after required repairs"</button>
    </div>

    <!-- Action Buttons -->
    <div style="display:flex;gap:8px;">
      <button id="o_back" style="flex:1;padding:10px;background:#30363d;color:#e6edf3;border:1px solid #484f58;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;">← Back</button>
      <button id="o_copy" style="flex:1.2;padding:10px;background:#238636;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;">Apply</button>
      <button id="o_cancel" style="flex:1;padding:10px;background:#da3633;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;">Cancel</button>
    </div>
  `;

  box.innerHTML = html;
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  let mediaStream = null;
  const scanToggleBtn = box.querySelector("#o_scan_toggle_btn");
  const scannerContainer = box.querySelector("#o_scanner_container");
  const dropArea = box.querySelector("#o_drop_area");
  const fileInputDrop = box.querySelector("#o_file_input");
  const videoElement = box.querySelector("#o_video_element");
  const startCamBtn = box.querySelector("#o_start_cam_btn");
  const captureBtn = box.querySelector("#o_capture_btn");
  const toast = box.querySelector("#o_toast");

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
        let count = window._otAutoSelectOmni(rawText);
        showToast(`✓ Processed 2K Scan! Auto-selected ${count} part(s).`);
      } else {
        alert("No text detected in image.");
      }
    } catch (err) {
      console.error("Tesseract Error:", err);
      alert("OCR Error: " + err.message);
    }
  }

  const getCurrentParts = () => {
    let rows = Array.from(document.querySelectorAll("#o_parts_list .part_row"));
    return rows.map((row) => ({
      name: row.querySelector(".desc_txt").innerText.trim(),
      pn: row.querySelector(".pn_txt").innerText.trim(),
    }));
  };

  const attachRowEvents = (row) => {
    row.querySelector(".o_edit_btn").onclick = () => {
      let newDesc = prompt("Edit Part Description:", row.querySelector(".desc_txt").innerText);
      if (newDesc !== null && newDesc.trim() !== "") {
        let newPn = prompt("Edit Part Number:", row.querySelector(".pn_txt").innerText);
        if (newPn !== null && newPn.trim() != "") {
          row.querySelector(".desc_txt").innerText = newDesc.trim();
          row.querySelector(".o_chk").value = newDesc.trim();
          row.querySelector(".pn_txt").innerText = newPn.trim();
          row.querySelector(".o_chk").dataset.pn = newPn.trim();
          saveStoredParts(getCurrentParts());
        } else {
          alert("Part Number cannot be blank.");
        }
      }
    };
    row.querySelector(".o_del_btn").onclick = () => { 
      row.remove(); 
      saveStoredParts(getCurrentParts());
    };
  };

  const renderParts = (partsArray) => {
    let list = document.getElementById("o_parts_list");
    list.innerHTML = "";
    
    let freq = getFreq();
    partsArray.sort((a, b) => (freq[b.name] || 0) - (freq[a.name] || 0));

    partsArray.forEach((p) => {
      let row = document.createElement("div");
      row.className = "part_row";
      row.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:5px 0;font-size:12px;border-bottom:1px solid #21262d;";
      row.innerHTML = `<label style="display:flex;align-items:center;cursor:pointer;flex:1;margin-right:10px;color:#c9d1d9;"><input type="checkbox" class="o_chk" data-pn="${p.pn}" value="${p.name}" style="margin-right:8px;transform:scale(1.1);flex-shrink:0;"><span class="desc_txt">${p.name}</span></label><div style="display:flex;align-items:center;gap:6px;"><span class="pn_txt" style="color:#8b949e;font-family:monospace;white-space:nowrap;margin-right:4px;">${p.pn}</span><button class="o_edit_btn" style="padding:2px 6px;font-size:10px;background:#d29922;color:#fff;border:none;border-radius:3px;cursor:pointer;">Edit</button><button class="o_del_btn" style="padding:2px 6px;font-size:10px;background:#da3633;color:#fff;border:none;border-radius:3px;cursor:pointer;">Delete</button></div>`;
      list.appendChild(row);
      attachRowEvents(row);
    });
  };

  renderParts(getStoredParts());

  const applyText = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch((err) => console.warn("Clipboard copy failed:", err));
    }

    if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
    document.body.removeChild(overlay);
    let target = document.querySelector("#addActualFindingsModal textarea") || document.getElementById("note") || document.querySelector('textarea[name="Notes"]') || document.querySelector("textarea");
    if (target) {
      target.focus();
      let setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
      if (setter) setter.call(target, text); else target.value = text;
      target.dispatchEvent(new Event("input", { bubbles: true }));
      target.dispatchEvent(new Event("change", { bubbles: true }));
      target.dispatchEvent(new Event("blur", { bubbles: true }));
    } else {
      alert("Textarea not found. Findings copied to clipboard!");
    }
  };

  document.getElementById("o_add_btn").onclick = () => {
    let desc = document.getElementById("o_custom_desc").value.trim();
    let pn = document.getElementById("o_custom_pn").value.trim();
    if (!desc || !pn) { alert("Both Part Description and Part # are required."); return; }
    
    let current = getStoredParts();
    current.unshift({ name: desc, pn: pn });
    saveStoredParts(current);
    renderParts(current);

    document.getElementById("o_custom_desc").value = "";
    document.getElementById("o_custom_pn").value = "";
  };

  document.getElementById("o_import_btn").onclick = () => {
    document.getElementById("o_import_file").click();
  };

  document.getElementById("o_import_file").onchange = (e) => {
    let file = e.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = (evt) => {
      let content = evt.target.result;
      try {
        let importedParts = [];
        if (content.trim().startsWith("[")) {
          importedParts = JSON.parse(content);
        } else {
          let match = content.match(/const initialParts =\s*(\[\s*[\s\S]*?\n\s*\]);/);
          if (match) {
            importedParts = JSON.parse(match[1]);
          } else {
            throw new Error("Unable to parse parts array from file.");
          }
        }
        if (Array.isArray(importedParts) && importedParts.length > 0) {
          saveStoredParts(importedParts);
          renderParts(importedParts);
          alert("Parts successfully imported!");
        } else {
          alert("Import failed: File contains no valid parts.");
        }
      } catch (err) {
        alert("Error reading file: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  document.getElementById("o_export_btn").onclick = () => {
    let currentParts = getCurrentParts();
    let currentScript = runOmniCalc.toString();
    let updatedPartsJson = JSON.stringify(currentParts, null, 2);
    let newScript = currentScript.replace(
      /const initialParts = \[\s*[\s\S]*?\n\s*\];/,
      `const initialParts = ${updatedPartsJson};`
    );

    let fullSource = `javascript:(${newScript})();`;
    let blob = new Blob([fullSource], { type: "application/javascript" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "Omni_Findings_Generator_Updated.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  document.getElementById("o_oem_only").onclick = () => applyText("Returned from OEM after required repairs.");
  document.getElementById("o_cancel").onclick = () => {
    if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
    document.body.removeChild(overlay);
  };
  
  document.getElementById("o_back").onclick = () => {
    if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
    document.body.removeChild(overlay);
    if (typeof window.openOneTrackToolkit === "function") {
      window.openOneTrackToolkit();
    }
  };

  document.getElementById("o_copy").onclick = () => {
    let checkedEls = Array.from(box.querySelectorAll(".o_chk:checked"));
    checkedEls.forEach(cb => recordUsage(cb.value));

    let selectedParts = checkedEls.map((cb) => cb.value);
    let text = selectedParts.length ? `Per the OEM, the following parts have been replaced: ${selectedParts.join(", ")} and passed the related testing.` : "Returned from OEM after required repairs.";
    applyText(text);
  };

  // --- AUTOMATED OCR AUTO-SELECT HANDLER FOR OMNI ---
  window._otAutoSelectOmni = function(ocrText) {
    if (!ocrText) return 0;

    let cleaned = ocrText.toUpperCase().replace(/-\s*[\r\n]+\s*/g, '');
    cleaned = cleaned.replace(/\b(QTY|QUANTITY|PARTS?|REPLACED|DESCRIPTION|PART\s*NO|NO)\b/g, ' ').replace(/\b\d+\b/g, ' ');
    const normOCR = cleaned.replace(/[\r\n]+/g, ' ').replace(/[\/\\.,_\-()]+/g, ' ').replace(/\s+/g, ' ').trim();
    const alphaNumOCR = cleaned.replace(/[^A-Z0-9]/g, '');

    let matchedCount = 0;
    const checkboxes = box.querySelectorAll('.o_chk');
    const availablePNs = [];

    checkboxes.forEach(chk => {
      const pn = (chk.dataset.pn || '').toUpperCase().trim();
      const name = (chk.value || '').toUpperCase().trim();
      if (pn && pn !== 'N/A') {
        availablePNs.push({
          checkbox: chk,
          rawPN: pn,
          cleanPN: pn.replace(/[^A-Z0-9]/g, ''),
          name: name
        });
      }
    });

    // 1. Part Number Matching
    availablePNs.forEach(item => {
      const escPN = item.rawPN.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const pnRegex = new RegExp(`(?:^|[^A-Z0-9])${escPN}(?:[^A-Z0-9]|$)`, 'i');

      if (pnRegex.test(normOCR) || (item.cleanPN.length >= 5 && alphaNumOCR.includes(item.cleanPN))) {
        if (!item.checkbox.checked) {
          item.checkbox.checked = true;
          item.checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
        matchedCount++;
      }
    });

    // 2. Unmatched Part Number Detection Notice
    const candidateTokens = normOCR.match(/\bPT[0-9]{5,10}\b|\b[A-Z0-9]{6,12}\b/gi) || [];
    const uniqueCandidates = [...new Set(candidateTokens.map(t => t.toUpperCase()))]
      .filter(t => !['KANGAROO', 'ASSEMBLY', 'REPAIRS', 'RETURNED', 'REQUIRED', 'PUMP', 'SPEAKER', 'OVERLAY'].includes(t));

    const unmatchedPNs = [];
    uniqueCandidates.forEach(cand => {
      const cleanCand = cand.replace(/[^A-Z0-9]/g, '');
      if (/^PT\d+/i.test(cand) || (/\d/.test(cand) && cand.length >= 7)) {
        let isKnown = availablePNs.some(item => item.rawPN.includes(cand) || cand.includes(item.rawPN) || item.cleanPN === cleanCand);
        if (!isKnown) {
          unmatchedPNs.push(cand);
        }
      }
    });

    if (unmatchedPNs.length > 0) {
      alert(`⚠️ Auto-Selection Notice:\n\nSelected ${matchedCount} matching part(s).\n\nThe following part number(s) were found on the sheet but NOT listed in Omni Calculator:\n• ${unmatchedPNs.join('\n• ')}`);
    }

    return matchedCount;
  };

  window._otCurrentOEMTool = {
    id: 'omni',
    autoSelect: window._otAutoSelectOmni
  };
})();
