(function(){
  // Targeted label-value scraper for OneTrack's grid / table layout
  function getFieldFromDOM(labelText) {
    const allElements = Array.from(document.querySelectorAll('td, th, label, div, span'));
    const target = allElements.find(el => {
      const directText = Array.from(el.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent.trim())
        .join(' ');
      return (directText || el.textContent.trim()).toLowerCase() === labelText.toLowerCase();
    });

    if (target) {
      // 1. Next sibling element
      if (target.nextElementSibling) {
        const val = target.nextElementSibling.innerText || target.nextElementSibling.textContent;
        if (val && val.trim()) return val.trim();
      }
      // 2. Parent's sibling (table cell / bootstrap col pairing)
      const parent = target.parentElement;
      if (parent) {
        if (parent.nextElementSibling) {
          const val = parent.nextElementSibling.innerText || parent.nextElementSibling.textContent;
          if (val && val.trim()) return val.trim();
        }
        const siblings = Array.from(parent.children);
        const idx = siblings.indexOf(target);
        if (idx !== -1 && siblings[idx + 1]) {
          const val = siblings[idx + 1].innerText || siblings[idx + 1].textContent;
          if (val && val.trim()) return val.trim();
        }
      }
    }
    return "";
  }

  // Company Map
  const companyMap = [
    { pattern: /Walgreens/i, name: "Walgreens Specialty" },
    { pattern: /Patient-?Owned/i, name: "Patient-Owned" },
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

  // Device Map
  const deviceMap = [
    { pattern: /Curlin\s*6000(?:\s*CMS)?|6000\s*CMS/i, name: "Curlin 6000 CMS" },
    { pattern: /Curlin\s*4000(?:\s*CMS)?|4000\s*CMS/i, name: "Curlin 4000 CMS" },
    { pattern: /Curlin\s*PainSmart/i, name: "Curlin PainSmart" },
    { pattern: /Curlin/i, name: "Curlin" },
    { pattern: /Kangaroo\s*Omni|Omni/i, name: "Omni" },
    { pattern: /Kangaroo\s*Joey|Joey/i, name: "Joey" },
    { pattern: /Infinity|EnteraLite/i, name: "Infinity" },
    { pattern: /Solis/i, name: "Solis" },
    { pattern: /Freedom\s*Edge/i, name: "Freedom Edge" },
    { pattern: /Freedom\s*60|Freedom/i, name: "Freedom 60" },
    { pattern: /Baxter\s*Fl(?:o|-)Gard|Fl(?:o|-)Gard/i, name: "Baxter Flo-Gard" },
    { pattern: /Baxter\s*Syringe/i, name: "Baxter Syringe" },
    { pattern: /Excelsior\s*Syringe/i, name: "Excelsior Syringe" },
    { pattern: /Cronos?\s*S-?PID/i, name: "Cronos S-PID" },
    { pattern: /Zyno\s*800F?/i, name: "Zyno 800F" },
    { pattern: /Vista\s*Basic|Vista/i, name: "Vista Basic" },
    { pattern: /Sigma/i, name: "Sigma" },
    { pattern: /Sapphire/i, name: "Sapphire" }
  ];

  const ownerDOM = getFieldFromDOM("Owner");
  const modelDOM = getFieldFromDOM("Model");
  const serialDOM = getFieldFromDOM("Serial Number");

  // Fallback body scan that strictly avoids scanning the Repair House select dropdown
  function collectSafeBodyText() {
    let clone = document.body.cloneNode(true);
    clone.querySelectorAll('select, #repairHouse, [name*="repairHouse"], [id*="repairHouse"]').forEach(el => el.remove());
    return clone.innerText || "";
  }
  const bodyText = collectSafeBodyText();

  // Serial Number Extraction
  let sn = serialDOM || "";
  if (!sn) {
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
  }

  // Device Detection
  let detectedDevice = "";
  if (modelDOM) {
    for (const d of deviceMap) {
      if (d.pattern.test(modelDOM)) { detectedDevice = d.name; break; }
    }
  }
  if (!detectedDevice) {
    for (const d of deviceMap) {
      if (d.pattern.test(bodyText)) { detectedDevice = d.name; break; }
    }
  }

  // Company Detection - Strictly prioritize Owner DOM
  let detectedCompany = "";
  if (ownerDOM) {
    for (const c of companyMap) {
      if (c.pattern.test(ownerDOM)) { detectedCompany = c.name; break; }
    }
  }
  if (!detectedCompany) {
    for (const c of companyMap) {
      if (c.pattern.test(bodyText)) { detectedCompany = c.name; break; }
    }
  }

  const clean = str => (str || "").replace(/[\\/:*?"<>|]/g, "").trim();
  let finalCompany = clean(detectedCompany) || "Walgreens Specialty";
  let finalDevice = clean(detectedDevice) || "Curlin";
  let finalSn = clean(sn);

  if (!finalSn) {
    finalSn = prompt("Serial Number not detected. Enter Serial #:", "");
    if (!finalSn) return;
  }

  const snPrefix = /^[A-Za-z]/.test(finalSn) ? "SN " : "SN";
  const baseTitle = `${clean(finalCompany)} ${clean(finalDevice)} ${snPrefix}${clean(finalSn)} Repair Authorization Report`;
  const fullPdfName = `${baseTitle}.pdf`;

  // Synchronous clipboard write
  function forceCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "0";
    ta.style.width = "2em";
    ta.style.height = "2em";
    ta.style.padding = "0";
    ta.style.border = "none";
    ta.style.outline = "none";
    ta.style.boxShadow = "none";
    ta.style.background = "transparent";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand("copy");
    } catch (e) {
      console.error("Clipboard copy failed", e);
    }
    document.body.removeChild(ta);
  }

  // Set page title for print dialog default
  document.title = baseTitle;

  // Copy to clipboard
  forceCopy(fullPdfName);

  // Show Toast
  const toast = document.createElement("div");
  toast.style.cssText = "position:fixed;bottom:24px;right:24px;background:#1a1d1f;color:#4ade80;border:1px solid #2d3238;padding:14px 20px;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.6);z-index:9999999;font-family:sans-serif;font-size:13px;";
  toast.innerHTML = `
    <div style="font-weight:bold;color:#fff;margin-bottom:4px;">Copied to Clipboard!</div>
    <div style="color:#cbd2d9;font-family:monospace;font-size:12px;">${fullPdfName}</div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);

  // Trigger Print View
  setTimeout(() => {
    if (typeof window.printRepairAuthorization === "function") {
      window.printRepairAuthorization();
    } else {
      const btn = document.querySelector('button[onclick*="printRepairAuthorization"]');
      if (btn) btn.click();
    }
  }, 150);
})();
