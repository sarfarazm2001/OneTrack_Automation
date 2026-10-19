(function runSolisCalc() {
  const initialParts = [
    { name: "Hub Service Labor Rate (ONLY SELECT WHEN NOTHING ELSE IS REPLACED BY OEM)", pn: "LABOR" },
    { name: "ADHESIVE, PSA, PIEZO RING, CADD-SOLIS 1/EA", pn: "30-3285" },
    { name: "AIR DETECTOR, SOLIS", pn: "70-0446" },
    { name: "AY, 27MM PIEZO SOUNDER, FRONT", pn: "70-0354" },
    { name: "AY, 27MM PIEZO SOUNDER, REAR", pn: "70-0447" },
    { name: "AY, USO, CADD-SOLIS 1/EA", pn: "67-2341" },
    { name: "BEARING, CAMSHAFT", pn: "60013" },
    { name: "BEARING, CAMSHAFT, .375\" OD X 0.187\" ID, CADD-SOLIS 1/EA", pn: "30-3028" },
    { name: "BEZEL, CASSETTE DETECTION", pn: "30-3052" },
    { name: "BEZEL, DSO, CADD-SOLIS", pn: "30-3028" },
    { name: "BRACKET, OPTICAL SWITCH, CADD-SOLIS", pn: "30-3052" },
    { name: "CAMSHAFT, 3 LOBE, DUAL ACTIVATION", pn: "31-0485" },
    { name: "CONNECTOR, LEMO HALF MOON INSERT (NUT FIXING) FIXED RECEPTACLE, CADD-SOLIS", pn: "10018270-001" },
    { name: "CONTACT, BATTERY COMPARTMENT FLOOR", pn: "70-0227" },
    { name: "CONTACT, BATTERY, SPRING PIN, CADD-SOLIS", pn: "70-0178" },
    { name: "DISK, OPTICAL, DUAL FLAG, CADD-SOLIS", pn: "30-3053" },
    { name: "DISPLAY, LCD, TRULY/HIMAX, 320 X 320 W/BACKLIGHT, CADD-SOLIS", pn: "70-0508" },
    { name: "DOOR AY, BATTERY, PUMP", pn: "30-3245" },
    { name: "DOOR AY, BATTERY, PUMP (Do Not Use)", pn: "10022677-001" },
    { name: "EXPULSOR, MACHINED, .344\"", pn: "30-3086-001" },
    { name: "FLEX AY, CAM SENSOR", pn: "70-0243" },
    { name: "FLEX AY, LED, CADD-SOLIS", pn: "70-0301" },
    { name: "FLEX CIRCUIT, SENSOR, L/L", pn: "70-0335" },
    { name: "FOAM, ISOLATION, LCD", pn: "30-3181" },
    { name: "FOAM, POSITIONING, LCD", pn: "30-3173" },
    { name: "GASKET, CONDUCTIVE, BAT COMP", pn: "30-3174" },
    { name: "GASKET, CONDUCTIVE, CHASSIS", pn: "30-3173" },
    { name: "GASKET, CONDUCTIVE, COPPER, RIGHT", pn: "N/A" },
    { name: "GASKET, CONDUCTIVE, LCD, TOP", pn: "N/A" },
    { name: "GASKET, CONDUCTIVE, LCD/FRAMING", pn: "N/A" },
    { name: "GASKET, ENVIRONMENTAL, BATTERY COMPARTMENT", pn: "30-3289" },
    { name: "GASKET, ENVIRONMENTAL, CHASSIS", pn: "30-3171" },
    { name: "GASKET, ENVIRONMENTAL, POWER BOARD", pn: "30-3171" },
    { name: "GASKET, PERIMETER, EMC", pn: "30-3167" },
    { name: "GASKET, PSA, LENS, CADD SOLIS", pn: "30-3288" },
    { name: "GASKET, TUBING, SILICON HOUSING", pn: "60002" },
    { name: "GEAR, FLAT", pn: "60003" },
    { name: "GEAR, HUB (FASTENS TO MOTOR)", pn: "60002" },
    { name: "GEARMOTOR, PLANETARY, 12V, 16MM", pn: "10009592" },
    { name: "GUARD, PIEZO ALARM", pn: "30-3299" },
    { name: "HANDLE, LATCH LEVER, CADD-SOLIS", pn: "30-4106" },
    { name: "HARNESS, WIRE, ON/OFF SWITCH", pn: "70-0216" },
    { name: "HSG, BATTERY COMPARTMENT", pn: "30-3248" },
    { name: "HSG, PUMP, FRONT, SHLD", pn: "30-4065" },
    { name: "HSG, PUMP, REAR SHLD", pn: "70-0229" },
    { name: "INSULATOR, KAPTON, CADD SOLIS", pn: "30-3106" },
    { name: "INSULATOR, PWA/HOUSING", pn: "30-3322" },
    { name: "INSULATOR, USB", pn: "30-4065" },
    { name: "KEYPAD, MEMBRANE SW, W/O CONN, CADD-SOLIS", pn: "70-0229" },
    { name: "LABEL, PUMP, REAR, CADD SOLIS VIP", pn: "10011174-001" },
    { name: "LATCH/LOCK", pn: "67-2482" },
    { name: "LBL, DEVICE, PUMP, CADD-SOLIS, MODEL 2120, VIP, 3RD EDITION w cUL, BLUE, RX ONLY", pn: "10017410-001" },
    { name: "LBL, DEVICE, PUMP, CADD-SOLIS, MODEL 2120, VIP, 3RD EDITION w cUL, BLUE, RX ONLY, COSTA RICA", pn: "10017410-001" },
    { name: "LBL, DEVICE, PUMP, CADD-SOLIS, MODEL 2120, VIP, 3RD EDITION w cUL, DRK GREY, RX ONLY", pn: "10017409-001" },
    { name: "LBL, DEVICE, PUMP, CADD-SOLIS, VIP 1.2", pn: "10006271-002" },
    { name: "LBL, DEVICE, PUMP, CADD-SOLIS, VIP, BLACK", pn: "10012921-001" },
    { name: "LBL, DEVICE, PUMP, CADD-SOLIS, VIP, BLUE", pn: "10013249-001" },
    { name: "LBL, SET, DEVICE, CADD-SOLIS", pn: "40-6288-24A" },
    { name: "LENS, PAD PRINTED, CADD SOLIS", pn: "40-5733-51A" },
    { name: "NLT - HEADER, IDC, 5 POS", pn: "40-6288-24A" },
    { name: "OVERLAY, MEMBRANE SWITCH (KEYPAD), CADD-SOLIS, 21-2101-08", pn: "21-2101-08" },
    { name: "OVERLAY, MEMBRANE SWITCH, CE ENGLISH", pn: "31-0993" },
    { name: "PAD, GND, L/L SENSOR", pn: "70-0171" },
    { name: "PCBA, CADD-SOLIS, FUSED", pn: "N/A" },
    { name: "PCBA, CADD-SOLIS, TRULY/HIMAX LCD, FLASH MEMORY UPGRADE", pn: "30-4712" },
    { name: "PIN, CASSETTE DETECTOR", pn: "10015258-001" },
    { name: "PLATE, AY, GROUNDING", pn: "30-3163" },
    { name: "SEAL, DIAPHRAGM, CASSETTE SENSOR", pn: "30-4086" },
    { name: "SEAL, DSO, NEOPRENE", pn: "30-4085" },
    { name: "SEAL, FOAM, CADD-SOLIS", pn: "30-3381" },
    { name: "SEAL, UPSTREAM OCCLUSION", pn: "31-0993" },
    { name: "SENSOR, DSO, CADD-SOLIS", pn: "30-4712" },
    { name: "SOLIS, CHASSIS, MACHINED 1/EA", pn: "30-4712" },
    { name: "STABILIZER, BATTERY, SST", pn: "30-3294" },
    { name: "STRIP, ADHESIVE, UPPER", pn: "30-3294" },
    { name: "SWITCH, POWER", pn: "30-3163" },
    { name: "TAB, LCD INSTALLATION", pn: "N/A" },
    { name: "TAPE, ADHESIVE, PIEZO GUARD", pn: "N/A" },
    { name: "TAPE, LCD HOLD DOWN", pn: "30-3306" },
    { name: "TAPE, POGO CONTACT", pn: "30-4085" },
    { name: "VALVE, DUAL ACTIVATION, CADD-SOLIS", pn: "30-3063" }
  ];

  function getStoredParts() {
    try {
      const stored = localStorage.getItem("solis_parts_list_v1");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    localStorage.setItem("solis_parts_list_v1", JSON.stringify(initialParts));
    return initialParts;
  }

  function saveStoredParts(list) {
    localStorage.setItem("solis_parts_list_v1", JSON.stringify(list));
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
  box.style.cssText = "background:#1e2329;padding:20px;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.5);width:540px;text-align:left;color:#e6edf3;border:1px solid #30363d;";

  let html = `
    <h3 style="margin-top:0;margin-bottom:12px;font-size:15px;text-align:center;color:#fff;">Select Solis OEM Replaced Parts & Scanner</h3>
    
    <!-- Scanner Toggle Button -->
    <button id="s_scan_toggle_btn" style="width:100%;padding:8px;margin-bottom:10px;background:#007bff;color:#fff;border:none;border-radius:5px;cursor:pointer;font-weight:bold;font-size:12px;">
      📷 Open Document Scanner Viewfinder
    </button>

    <!-- Webcam Container -->
    <div id="s_webcam_container" style="display:none;background:#0d1117;padding:10px;border-radius:6px;border:1px solid #30363d;margin-bottom:10px;text-align:center;">
      <video id="s_video_element" autoplay playsinline style="width:100%;max-height:220px;border-radius:4px;background:#000;"></video>
      <button id="s_capture_btn" style="width:100%;margin-top:8px;padding:8px;background:#28a745;color:#fff;border:none;border-radius:5px;cursor:pointer;font-weight:bold;font-size:12px;">
        📸 Snap Document Photo
      </button>
    </div>

    <!-- Status Toast -->
    <div id="s_toast" style="display:none;padding:6px 10px;background:#17a2b8;color:#fff;border-radius:4px;font-size:11px;font-weight:bold;margin-bottom:10px;text-align:center;"></div>

    <!-- Parts List Container -->
    <div id="s_parts_list" style="max-height:260px;overflow-y:auto;margin-bottom:12px;background:#161b22;padding:6px;border-radius:6px;border:1px solid #30363d;"></div>

    <!-- Action Buttons -->
    <div style="display:flex;gap:8px;">
      <button id="s_copy" style="flex:1.5;padding:10px;background:#28a745;color:#fff;border:none;border-radius:5px;cursor:pointer;font-size:12px;font-weight:bold;">Confirm Selection</button>
      <button id="s_cancel" style="flex:1;padding:10px;background:#dc3545;color:#fff;border:none;border-radius:5px;cursor:pointer;font-size:12px;font-weight:bold;">Cancel</button>
    </div>
  `;

  box.innerHTML = html;
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  let mediaStream = null;
  const scanToggleBtn = box.querySelector("#s_scan_toggle_btn");
  const webcamContainer = box.querySelector("#s_webcam_container");
  const videoElement = box.querySelector("#s_video_element");
  const captureBtn = box.querySelector("#s_capture_btn");
  const toast = box.querySelector("#s_toast");

  function showToast(msg) {
    toast.innerText = msg;
    toast.style.display = "block";
  }

  scanToggleBtn.onclick = async () => {
    if (webcamContainer.style.display === "none") {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1920 }, height: { ideal: 1080 }, facingMode: { ideal: "environment" } }
        });
        videoElement.srcObject = mediaStream;
        webcamContainer.style.display = "block";
        scanToggleBtn.innerText = "❌ Close Scanner Viewfinder";
      } catch (err) {
        alert("Camera Error: " + err.message);
      }
    } else {
      if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
      webcamContainer.style.display = "none";
      scanToggleBtn.innerText = "📷 Open Document Scanner Viewfinder";
    }
  };

  // --- BUILT-IN TESSERACT OCR SCANNER ---
  captureBtn.onclick = async () => {
    let canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth || 1280;
    canvas.height = videoElement.videoHeight || 720;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    let imageDataUrl = canvas.toDataURL("image/jpeg", 0.85);

    if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
    webcamContainer.style.display = "none";
    scanToggleBtn.innerText = "📷 Open Document Scanner Viewfinder";

    showToast("⏳ Loading OCR engine & analyzing document...");

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

      let result = await Tesseract.recognize(imageDataUrl, "eng");
      let rawText = result.data.text ? result.data.text.trim().toUpperCase() : "";

      if (rawText) {
        console.log("--- RAW TESSERACT OCR SCAN --- \n", rawText);
        let matchedCount = 0;
        let cleanScanText = rawText.replace(/[\s,\-\/]+/g, " ");

        const checkboxes = box.querySelectorAll(".s_chk");
        checkboxes.forEach((chk) => {
          let partName = chk.value;
          if (!partName || partName.includes("ONLY SELECT") || partName.includes("DO NOT USE")) return;

          let partNameUpper = partName.toUpperCase();
          let isMatched = false;
          let cleanPartName = partNameUpper.replace(/[\s,\-\/]+/g, " ");

          if (cleanScanText.includes(cleanPartName)) {
            isMatched = true;
          }

          // 1. HSG, Battery Compartment
          if ((rawText.includes("BATTERY") && rawText.includes("COMPARTMENT")) && partNameUpper === "HSG, BATTERY COMPARTMENT") {
            isMatched = true;
          }
          // 2. Door Assembly, Battery, Pump
          if ((rawText.includes("DOOR") && (rawText.includes("BATTERY") || rawText.includes("PUMP"))) || rawText.includes("30-3245")) {
            if (partNameUpper === "DOOR AY, BATTERY, PUMP") isMatched = true;
          }
          // 3. Seal, DSO, Neoprene
          if ((rawText.includes("NEOPRENE") || (rawText.includes("SEAL") && rawText.includes("DSO"))) || rawText.includes("30-3381") || rawText.includes("30-4085")) {
            if (partNameUpper === "SEAL, DSO, NEOPRENE") isMatched = true;
          }
          // 4. Overlay Membrane Switch 21-2101-08
          if ((rawText.includes("21-2101") || (rawText.includes("OVERLAY") && rawText.includes("KEYPAD"))) || rawText.includes("21-2101-08")) {
            if (partNameUpper.includes("21-2101-08")) isMatched = true;
          }
          // 5. Overlay Membrane Switch CE English
          if (rawText.includes("CE ENGLISH") || (rawText.includes("OVERLAY") && rawText.includes("ENGLISH"))) {
            if (partNameUpper.includes("CE ENGLISH")) isMatched = true;
          }
          // 6. Blue Model Label
          if (rawText.includes("MODEL 2120") && rawText.includes("BLUE") && partNameUpper.includes("BLUE, RX ONLY")) {
            isMatched = true;
          }
          // 7. Dark Grey Model Label
          if (rawText.includes("MODEL 2120") && rawText.includes("DRK GREY") && partNameUpper.includes("DRK GREY, RX ONLY")) {
            isMatched = true;
          }
          // 8. Keypad Membrane Switch w/o Conn
          if ((rawText.includes("KEYPAD") && (rawText.includes("MEMBRANE") || rawText.includes("W/O CONN") || rawText.includes("CONN"))) || rawText.includes("70-0229")) {
            if (partNameUpper === "KEYPAD, MEMBRANE SW, W/O CONN, CADD-SOLIS") isMatched = true;
          }
          // 9. Set Label
          if ((rawText.includes("LBL") && rawText.includes("SET")) || rawText.includes("40-6288-24A")) {
            if (partNameUpper.includes("LBL, SET, DEVICE")) isMatched = true;
          }
          // 10. Lens Pad Printed
          if ((rawText.includes("LENS") && rawText.includes("PAD PRINTED")) || rawText.includes("40-5733-51A") || rawText.includes("40-5733")) {
            if (partNameUpper === "LENS, PAD PRINTED, CADD SOLIS") isMatched = true;
          }

          if (isMatched && !chk.checked) {
            chk.checked = true;
            chk.dispatchEvent(new Event("change", { bubbles: true }));
            matchedCount++;
          }
        });

        showToast(`✓ OCR scanned! Auto-selected ${matchedCount} specific part(s).`);
      } else {
        alert("Could not detect any text from captured image.");
      }
    } catch (err) {
      console.error("Tesseract Error:", err);
      alert("Error processing local OCR: " + err.message);
    }
  };

  const renderPartsList = (partsData) => {
    let listContainer = document.getElementById("s_parts_list");
    listContainer.innerHTML = "";
    
    let freq = getFreq();
    partsData.sort((a, b) => (freq[b.name] || 0) - (freq[a.name] || 0));

    partsData.forEach((p) => {
      let row = document.createElement("div");
      row.className = "part_row";
      row.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:5px 0;font-size:12px;border-bottom:1px solid #21262d;";
      row.innerHTML = `
        <label style="display:flex;align-items:center;cursor:pointer;flex:1;margin-right:10px;color:#c9d1d9;">
          <input type="checkbox" class="s_chk" data-pn="${p.pn}" value="${p.name}" style="margin-right:8px;transform:scale(1.1);flex-shrink:0;">
          <span class="desc_txt">${p.name}</span>
        </label>
        <span class="pn_txt" style="color:#8b949e;font-family:monospace;white-space:nowrap;">${p.pn}</span>
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

    let physicalParts = checkedBoxes.filter(cb => cb.dataset.pn !== "LABOR").map(cb => cb.value);
    let hasLabor = checkedBoxes.some(cb => cb.dataset.pn === "LABOR");

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
