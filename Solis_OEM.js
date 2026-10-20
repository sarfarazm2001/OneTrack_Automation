(function runSolisCalc() {
  const initialParts = [
    "Hub Service Labor Rate (ONLY SELECT WHEN NOTHING ELSE IS REPLACED BY OEM)",
    "ADHESIVE, PSA, PIEZO RING, CADD-SOLIS 1/EA",
    "AIR DETECTOR, SOLIS",
    "AY, 27MM PIEZO SOUNDER, FRONT",
    "AY, 27MM PIEZO SOUNDER, REAR",
    "AY, USO, CADD-SOLIS 1/EA",
    "BEARING, CAMSHAFT",
    "BEARING, CAMSHAFT, .375\" OD X 0.187\" ID, CADD-SOLIS 1/EA",
    "BEZEL, CASSETTE DETECTION",
    "BEZEL, DSO, CADD-SOLIS",
    "BRACKET, OPTICAL SWITCH, CADD-SOLIS",
    "CAMSHAFT, 3 LOBE, DUAL ACTIVATION",
    "CONNECTOR, LEMO HALF MOON INSERT (NUT FIXING) FIXED RECEPTACLE, CADD-SOLIS",
    "CONTACT, BATTERY COMPARTMENT FLOOR",
    "CONTACT, BATTERY, SPRING PIN, CADD-SOLIS",
    "DISK, OPTICAL, DUAL FLAG, CADD-SOLIS",
    "DISPLAY, LCD, TRULY/HIMAX, 320 X 320 W/BACKLIGHT, CADD-SOLIS",
    "DOOR AY, BATTERY, PUMP",
    "DOOR AY, BATTERY, PUMP (Do Not Use)",
    "EXPULSOR, MACHINED, .344\"",
    "FLEX AY, CAM SENSOR",
    "FLEX AY, LED, CADD-SOLIS",
    "FLEX CIRCUIT, SENSOR, L/L",
    "FOAM, ISOLATION, LCD",
    "FOAM, POSITIONING, LCD",
    "GASKET, CONDUCTIVE, BAT COMP",
    "GASKET, CONDUCTIVE, CHASSIS",
    "GASKET, CONDUCTIVE, COPPER, RIGHT",
    "GASKET, CONDUCTIVE, LCD, TOP",
    "GASKET, CONDUCTIVE, LCD/FRAMING",
    "GASKET, ENVIRONMENTAL, BATTERY COMPARTMENT",
    "GASKET, ENVIRONMENTAL, CHASSIS",
    "GASKET, ENVIRONMENTAL, POWER BOARD",
    "GASKET, PERIMETER, EMC",
    "GASKET, PSA, LENS, CADD SOLIS",
    "GASKET, TUBING, SILICON HOUSING",
    "GEAR, FLAT",
    "GEAR, HUB (FASTENS TO MOTOR)",
    "GEARMOTOR, PLANETARY, 12V, 16MM",
    "GUARD, PIEZO ALARM",
    "HANDLE, LATCH LEVER, CADD-SOLIS",
    "HARNESS, WIRE, ON/OFF SWITCH",
    "HSG, BATTERY COMPARTMENT",
    "HSG, PUMP, FRONT, SHLD",
    "HSG, PUMP, REAR SHLD",
    "INSULATOR, KAPTON, CADD SOLIS",
    "INSULATOR, PWA/HOUSING",
    "INSULATOR, USB",
    "KEYPAD, MEMBRANE SW, W/O CONN, CADD-SOLIS",
    "LABEL, PUMP, REAR, CADD SOLIS VIP",
    "LATCH/LOCK",
    "LBL, DEVICE, PUMP, CADD-SOLIS, MODEL 2120, VIP, 3RD EDITION w cUL, BLUE, RX ONLY",
    "LBL, DEVICE, PUMP, CADD-SOLIS, MODEL 2120, VIP, 3RD EDITION w cUL, BLUE, RX ONLY, COSTA RICA",
    "LBL, DEVICE, PUMP, CADD-SOLIS, MODEL 2120, VIP, 3RD EDITION w cUL, DRK GREY, RX ONLY",
    "LBL, DEVICE, PUMP, CADD-SOLIS, VIP 1.2",
    "LBL, DEVICE, PUMP, CADD-SOLIS, VIP, BLACK",
    "LBL, DEVICE, PUMP, CADD-SOLIS, VIP, BLUE",
    "LBL, SET, DEVICE, CADD-SOLIS",
    "LENS, PAD PRINTED, CADD SOLIS",
    "NLT - HEADER, IDC, 5 POS",
    "OVERLAY, MEMBRANE SWITCH (KEYPAD), CADD-SOLIS, 21-2101-08",
    "OVERLAY, MEMBRANE SWITCH, CE ENGLISH",
    "PAD, GND, L/L SENSOR",
    "PCBA, CADD-SOLIS, FUSED",
    "PCBA, CADD-SOLIS, TRULY/HIMAX LCD, FLASH MEMORY UPGRADE",
    "PIN, CASSETTE DETECTOR",
    "PLATE, AY, GROUNDING",
    "SEAL, DIAPHRAGM, CASSETTE SENSOR",
    "SEAL, DSO, NEOPRENE",
    "SEAL, FOAM, CADD-SOLIS",
    "SEAL, UPSTREAM OCCLUSION",
    "SENSOR, DSO, CADD-SOLIS",
    "SOLIS, CHASSIS, MACHINED 1/EA",
    "STABILIZER, BATTERY, SST",
    "STRIP, ADHESIVE, UPPER",
    "SWITCH, POWER",
    "TAB, LCD INSTALLATION",
    "TAPE, ADHESIVE, PIEZO GUARD",
    "TAPE, LCD HOLD DOWN",
    "TAPE, POGO CONTACT",
    "VALVE, DUAL ACTIVATION, CADD-SOLIS"
  ];

  function getStoredParts() {
    try {
      const stored = localStorage.getItem("solis_parts_list_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(p => typeof p === 'string' ? p : (p.name || p));
        }
      }
    } catch (e) {}
    localStorage.setItem("solis_parts_list_v1", JSON.stringify(initialParts));
    return initialParts;
  }

  function getFreq() {
    try { return JSON.parse(localStorage.getItem('ot_freq_solis') || '{}'); }
    catch(e) { return {}; }
  }

  function recordUsage(partName) {
    let freq = getFreq();
    freq[partName] = (freq[partName] || 0) + 1;
    localStorage.setItem('ot_freq_solis', JSON.stringify(freq));
  }

  let existing = document.getElementById("solis-calc-modal");
  if (existing) existing.remove();

  let overlay = document.createElement("div");
  overlay.id = "solis-calc-modal";
  overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;";

  let box = document.createElement("div");
  box.style.cssText = "background:#12161a;padding:20px;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.6);width:540px;text-align:left;color:#f1f3f5;border:1px solid #2d333b;";

  let html = `
    <h3 style="margin-top:0;margin-bottom:12px;font-size:15px;text-align:center;color:#fff;">Select Solis OEM Replaced Parts & Scanner</h3>
    
    <button id="s_scan_toggle_btn" style="width:100%;padding:9px;margin-bottom:10px;background:#1f6feb;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:700;font-size:12px;">
      📷 Open 2K HD Document Scanner
    </button>

    <div id="s_scanner_container" style="display:none;background:#161b22;padding:12px;border-radius:6px;border:1px dashed #30363d;margin-bottom:10px;text-align:center;">
      <div id="s_drop_area" style="cursor:pointer;padding:10px;border:1px dashed #484f58;border-radius:4px;margin-bottom:8px;background:#0d1117;font-size:11px;color:#8b949e;">
        📷 Drag & drop image here, paste (<code style="color:#58a6ff;">Ctrl+V</code>), or click to upload
        <input type="file" id="s_file_input" accept="image/*" style="display:none;">
      </div>
      <video id="s_video_element" autoplay playsinline title="Click video stream to trigger refocus" style="width:100%;max-height:220px;border-radius:4px;background:#000;display:none;margin-bottom:8px;cursor:pointer;border:1px solid #30363d;"></video>
      <div style="display:flex;gap:8px;justify-content:center;">
        <button id="s_start_cam_btn" style="flex:1;padding:7px;background:#238636;color:#fff;border:none;border-radius:5px;cursor:pointer;font-weight:600;font-size:11px;">📷 Start 2K Camera</button>
        <button id="s_capture_btn" style="flex:1;padding:7px;background:#1f6feb;color:#fff;border:none;border-radius:5px;cursor:pointer;font-weight:600;font-size:11px;display:none;">📸 Snap & Process High-Res</button>
      </div>
    </div>

    <div id="s_toast" style="display:none;padding:6px 10px;background:#17a2b8;color:#fff;border-radius:4px;font-size:11px;font-weight:bold;margin-bottom:10px;text-align:center;"></div>

    <div id="s_parts_list" style="max-height:240px;overflow-y:auto;margin-bottom:12px;background:#0d1117;padding:6px;border-radius:6px;border:1px solid #30363d;"></div>

    <div style="display:flex;gap:8px;">
      <button id="s_copy" style="flex:1.5;padding:10px;background:#238636;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:bold;">Confirm Selection</button>
      <button id="s_cancel" style="flex:1;padding:10px;background:#30363d;color:#e6edf3;border:1px solid #484f58;border-radius:6px;cursor:pointer;font-size:12px;font-weight:bold;">Cancel</button>
    </div>
  `;

  box.innerHTML = html;
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  let mediaStream = null;
  const scanToggleBtn = box.querySelector("#s_scan_toggle_btn");
  const scannerContainer = box.querySelector("#s_scanner_container");
  const dropArea = box.querySelector("#s_drop_area");
  const fileInput = box.querySelector("#s_file_input");
  const videoElement = box.querySelector("#s_video_element");
  const startCamBtn = box.querySelector("#s_start_cam_btn");
  const captureBtn = box.querySelector("#s_capture_btn");
  const toast = box.querySelector("#s_toast");

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
        let count = window._otAutoSelectSolis(rawText);
        showToast(`✓ Processed 2K Scan! Auto-selected ${count} part(s).`);
      } else {
        alert("No text detected in image.");
      }
    } catch (err) {
      console.error("Tesseract Error:", err);
      alert("OCR Error: " + err.message);
    }
  }

  // --- STRICT 100% TOKEN MATCHING ENGINE FOR SOLIS ---
  window._otAutoSelectSolis = function(ocrText) {
    if (!ocrText || typeof ocrText !== "string") return 0;

    const checkboxes = box.querySelectorAll(".s_chk");
    if (!checkboxes || checkboxes.length === 0) return 0;

    // Clean OCR text and standardize common abbreviations
    let cleanOCR = ocrText.toUpperCase()
      .replace(/-\s*[\r\n]+\s*/g, ' ')
      .replace(/[\r\n]+/g, ' ')
      .replace(/\bHSG\b/g, 'HOUSING')
      .replace(/\bAY\b/g, 'ASSEMBLY')
      .replace(/\bASSY\b/g, 'ASSEMBLY')
      .replace(/\bSW\b/g, 'SWITCH')
      .replace(/\bCOMP\b/g, 'COMPARTMENT')
      .replace(/\bLBL\b/g, 'LABEL')
      .replace(/\bSHLD\b/g, 'SHIELD')
      .replace(/\bGND\b/g, 'GROUND')
      .replace(/\bBAT\b/g, 'BATTERY')
      .replace(/\bCONN\b/g, 'CONNECTOR');

    const alphaNumOCR = cleanOCR.replace(/[^A-Z0-9\s]/g, ' ');

    let matchedCount = 0;

    checkboxes.forEach((chk) => {
      const name = (chk.value || '').trim().toUpperCase();
      if (!name || name.includes("ONLY SELECT WHEN NOTHING") || name.includes("DO NOT USE")) return;

      // Standardize abbreviations in part description
      let normName = name
        .replace(/\bHSG\b/g, 'HOUSING')
        .replace(/\bAY\b/g, 'ASSEMBLY')
        .replace(/\bASSY\b/g, 'ASSEMBLY')
        .replace(/\bSW\b/g, 'SWITCH')
        .replace(/\bCOMP\b/g, 'COMPARTMENT')
        .replace(/\bLBL\b/g, 'LABEL')
        .replace(/\bSHLD\b/g, 'SHIELD')
        .replace(/\bGND\b/g, 'GROUND')
        .replace(/\bBAT\b/g, 'BATTERY')
        .replace(/\bCONN\b/g, 'CONNECTOR')
        .replace(/[^A-Z0-9\s]/g, ' ');

      // Boilerplate words to ignore
      const stopWords = ['CADD', 'SOLIS', '1/EA', 'EA', 'PUMP', 'DEVICE', 'MODEL', '2120', 'VIP', '3RD', 'EDITION', 'CUL', 'BLUE', 'ONLY', 'COSTA', 'RICA', 'BLACK', 'DRK', 'GREY', 'RX', 'W/O', 'WITH'];
      const tokens = normName.split(/\s+/).filter(w => w.length >= 2 && !stopWords.includes(w));

      if (tokens.length === 0) return;

      // Check how many tokens exist in OCR text
      let hits = 0;
      tokens.forEach(t => {
        if (alphaNumOCR.includes(t)) hits++;
      });

      // STRICT CHECK: 100% of tokens must be matched
      if (hits === tokens.length) {
        if (!chk.checked) {
          chk.checked = true;
          chk.dispatchEvent(new Event("change", { bubbles: true }));
        }
        matchedCount++;
      }
    });

    return matchedCount;
  };

  const renderPartsList = (partsData) => {
    let listContainer = document.getElementById("s_parts_list");
    listContainer.innerHTML = "";
    
    let freq = getFreq();
    partsData.sort((a, b) => (freq[b] || 0) - (freq[a] || 0));

    partsData.forEach((partName) => {
      let row = document.createElement("div");
      row.className = "part_row";
      row.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:5px 0;font-size:12px;border-bottom:1px solid #21262d;";
      row.innerHTML = `
        <label style="display:flex;align-items:center;cursor:pointer;flex:1;color:#c9d1d9;">
          <input type="checkbox" class="s_chk" value="${partName}" style="margin-right:8px;transform:scale(1.1);flex-shrink:0;">
          <span class="desc_txt">${partName}</span>
        </label>
      `;
      listContainer.appendChild(row);
    });
  };

  renderPartsList(getStoredParts());

  document.getElementById("s_cancel").onclick = () => {
    if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
    document.body.removeChild(overlay);
  };

  document.getElementById("s_copy").onclick = () => {
    if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
    let checkedBoxes = Array.from(box.querySelectorAll(".s_chk:checked"));
    checkedBoxes.forEach(cb => recordUsage(cb.value));

    const laborPartName = "Hub Service Labor Rate (ONLY SELECT WHEN NOTHING ELSE IS REPLACED BY OEM)";
    let physicalParts = checkedBoxes.map(cb => cb.value).filter(name => name !== laborPartName);
    let hasLabor = checkedBoxes.some(cb => cb.value === laborPartName);

    let text = "";
    const testBlock = "Visual Inspection, Pump Power Up Test, Motor Test, Remote Dose Test, Keypad Test, Latch Lock Test, Disposable Test, Air Detector Test, Verify Air Detector Height, LCD Screen Inspection, Amber Green and LED Functional Test, Adjust LCD POT Screen, Downstream Occlusion Test, Upstream Occlusion Sensor Test, Battery Fallout Test, 50ml Cassette Test, Go_No_Go Test, and Delivery Accuracy Test 20mL.";

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

  window._otCurrentOEMTool = {
    id: 'solis',
    autoSelect: window._otAutoSelectSolis
  };
})();
