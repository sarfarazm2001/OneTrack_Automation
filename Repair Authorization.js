(function(){
  // Helper: Pulls text strictly from the "Owner" row in OneTrack
  function getOwnerFromDOM() {
    const labels = Array.from(document.querySelectorAll('td, th, label, span, div, p'));
    const ownerLabel = labels.find(el => el.children.length === 0 && el.textContent.trim() === 'Owner');
    
    if (ownerLabel) {
      if (ownerLabel.nextElementSibling) {
        return ownerLabel.nextElementSibling.textContent.trim();
      }
      const parent = ownerLabel.parentElement;
      if (parent && parent.children.length > 1) {
        const idx = Array.from(parent.children).indexOf(ownerLabel);
        if (idx !== -1 && parent.children[idx + 1]) {
          return parent.children[idx + 1].textContent.trim();
        }
      }
    }
    return "";
  }

  // Extract text across page, inputs, selects, and readable iframes (fallback)
  function collectAllText() {
    let fullText = document.body ? (document.body.innerText || "") : "";
    
    document.querySelectorAll("input, select, textarea").forEach(el => {
      if (el.value) fullText += " " + el.value;
    });

    document.querySelectorAll("iframe, frame").forEach(f => {
      try {
        const doc = f.contentDocument || (f.contentWindow && f.contentWindow.document);
        if (doc && doc.body) {
          fullText += " " + doc.body.innerText;
          doc.querySelectorAll("input, select").forEach(el => {
            if (el.value) fullText += " " + el.value;
          });
        }
      } catch(e){}
    });
    return fullText;
  }

  const ownerDOM = getOwnerFromDOM();
  const bodyText = collectAllText();

  // 1. Company Map (Prioritizes McKesson if listed as the Owner)
  const companyMap = [
    { pattern: /McKesson/i, name: "McKesson" },
    { pattern: /New England Life Care|NELC/i, name: "NELC" },
    { pattern: /Adv(?:\.|anced)?\s*Infusion\s*Care/i, name: "Adv. Infusion Care" },
    { pattern: /AHN|Allegheny\s*Health\s*Network/i, name: "AHN" },
    { pattern: /Amerimed/i, name: "Amerimed" },
    { pattern: /Amerita/i, name: "Amerita" },
    { pattern: /Accredo/i, name: "Accredo" },
    { pattern: /Blackburn/i, name: "Blackburn" },
    { pattern: /Diplomat|Optum/i, name: "Optum" },
    { pattern: /Children'?s\s*Home\s*Care\s*Group/i, name: "Childrens Home Care Group" },
    { pattern: /Coram/i, name: "Coram" },
    { pattern: /CVS/i, name: "CVS" },
    { pattern: /Eagleville/i, name: "Eagleville" },
    { pattern: /EPPY'?S/i, name: "EPPY'S" },
    { pattern: /Fairview\s*Home\s*Infusion/i, name: "Fairview Home Infusion" },
    { pattern: /Hospice\s*Care\s*of\s*Southern\s*WV/i, name: "Hospice Care of Southern WV" },
    { pattern: /Liberty\s*Medical\s*Specialties/i, name: "Liberty Medical Specialties" },
    { pattern: /Lifetime/i, name: "Lifetime" },
    { pattern: /Mercy\s*Health\s*Home\s*Infusion/i, name: "Mercy Health Home Infusion" },
    { pattern: /Michigan\s*IV\s*Rx/i, name: "Michigan IV Rx" },
    { pattern: /Omni\s*Care/i, name: "Omnicare" },
    { pattern: /Option\s*Care/i, name: "Option Care" },
    { pattern: /Reverence\s*Home\s*Health/i, name: "Reverence Home Health" },
    { pattern: /Trinity\s*Infusion/i, name: "Trinity Infusion" },
    { pattern: /Twel?veStone/i, name: "TwevleStone" },
    { pattern: /UNC\s*Homecare\s*Specialists/i, name: "UNC Homecare Specialists" },
    { pattern: /University\s*Hospitals/i, name: "University Hospitals" },
    { pattern: /William\s*Bros/i, name: "William Bros" }
  ];

  // 2. Device Map
  const deviceMap = [
    { pattern: /Kangaroo\s*Omni|Omni/i, name: "Kangaroo Omni" },
    { pattern: /Freedom\s*60/i, name: "Freedom 60" },
    { pattern: /Freedom\s*Edge/i, name: "Freedom Edge" },
    { pattern: /Freedom/i, name: "Freedom 60" },
    { pattern: /Baxter\s*Fl(?:o|-)Gard|Fl(?:o|-)Gard/i, name: "Baxter Flo-Gard" },
    { pattern: /Baxter\s*Syringe/i, name: "Baxter Syringe" },
    { pattern: /Excelsior\s*Syringe/i, name: "Excelsior Syringe" },
    { pattern: /Cronos?\s*S-?PID/i, name: "Cronos S-PID" },
    { pattern: /Zyno\s*800F?/i, name: "Zyno 800F" },
    { pattern: /Vista\s*Basic|Vista/i, name: "Vista Basic" },
    { pattern: /Infinity|Infinitys|EnteraLite/i, name: "Infinity" },
    { pattern: /Curlin|Curlins/i, name: "Curlin" },
    { pattern: /Solis/i, name: "Solis" },
    { pattern: /Joey|Joeys/i, name: "Joey" },
    { pattern: /Sigma/i, name: "Sigma" },
    { pattern: /Sapphire/i, name: "Sapphire" }
  ];

  // --- SERIAL NUMBER EXTRACTION ---
  let sn = "";
  const snMatch = bodyText.match(/Serial\s*(?:Number|#)?\s*[:#-]?\s*([A-Za-z0-9]+)/i);

  if (snMatch && snMatch[1].length >= 4) {
    sn = snMatch[1].trim();
  } else {
    const patternMatch = 
      bodyText.match(/\b(KS[A-Za-z0-9]{8,12})\b/i) ||
      bodyText.match(/\b([FS]\d{7,9})\b/i)          ||
      bodyText.match(/\b(\d{5,9})\b/);
      
    sn = patternMatch ? patternMatch[1].trim() : "";
  }

  // --- DEVICE DETECTION ---
  let detectedDevice = "";
  for (const d of deviceMap) {
    if (d.pattern.test(bodyText)) {
      detectedDevice = d.name;
      break;
    }
  }

  // --- COMPANY DETECTION (Owner field checked first) ---
  let detectedCompany = "";
  
  if (ownerDOM) {
    for (const c of companyMap) {
      if (c.pattern.test(ownerDOM)) {
        detectedCompany = c.name;
        break;
      }
    }
  }

  // Fallback to searching the broader page text only if the Owner field is empty
  if (!detectedCompany) {
    for (const c of companyMap) {
      if (c.pattern.test(bodyText)) {
        detectedCompany = c.name;
        break;
      }
    }
  }

  const clean = str => (str || "").replace(/[\\/:*?"<>|]/g, "").trim();

  let finalCompany = clean(detectedCompany);
  let finalDevice = clean(detectedDevice) || "Infinity";
  let finalSn = clean(sn);

  if (!finalCompany) {
    finalCompany = prompt("Company not recognized automatically. Enter Company name (e.g. McKesson, NELC, Option Care):", "McKesson");
    if (!finalCompany) return;
  }

  if (!finalSn) {
    finalSn = prompt("Serial Number not detected. Enter Serial #:", "");
    if (!finalSn) return;
  }

  const fileName = `${clean(finalCompany)} ${finalDevice} SN${clean(finalSn)} Repair Authorization Report.pdf`;

  // --- CLIPBOARD ACTION ---
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy") ? resolve() : reject();
      } catch(e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  copyText(fileName).then(() => {
    const toast = document.createElement("div");
    toast.style.cssText = "position:fixed;bottom:24px;right:24px;background:#1a1d1f;color:#4ade80;border:1px solid #2d3238;padding:14px 20px;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.6);z-index:9999999;font-family:sans-serif;font-size:13px;max-width:420px;line-height:1.5;";
    toast.innerHTML = `
      <div style="font-weight:bold;color:#fff;margin-bottom:4px;">Ready to Paste!</div>
      <div style="color:#cbd2d9;font-family:monospace;font-size:12px;word-break:break-all;">${fileName}</div>
      <div style="color:#9aa0a6;font-size:11px;margin-top:6px;">Press <b>Ctrl + V</b> in the Save dialog.</div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }).catch(() => {
    prompt("Copy filename manually (Ctrl+C):", fileName);
  });
})();
