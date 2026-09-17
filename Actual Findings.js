(function(){
  const DEFAULT_PHRASES=[
    "Outdated battery and it needs to be changed. (JOEY)",
    "Battery replaced on {DATE}. (JOEY)",
    "This device is under warranty.",
    "No issue found. PM was successful.",
    "Repairs declined and asked to be disposed of by Shana Brown. (CORAM)",
    "Repairs declined and asked to be disposed of by Amy Kwong. (CORAM)",
    "Repairs declined and asked to be disposed of by William Maturo. (CVS)",
    "Repairs declined and asked to be disposed of by Janey Mechler. (OPTUM)",
    "Repairs declined and asked to be disposed of by Heather LeClair. (OPTUM)",
    "Repairs declined and asked to be returned by William Maturo. (CVS)",
    "Repairs declined and asked to be returned by David Rolph. (AmeriMed)",
    "Repairs declined and asked to be returned by Alexsis Gauthier. (NELC)",
    "Repairs declined and asked to be returned by Sheryl Guyer. (NELC)",
    "Repairs declined and asked to be returned by Lauren Lynch. (NELC)",
    "Repairs declined and asked to be returned by Michael OConnor. (NELC)",
    "Repairs approved by Lauren Lynch. (NELC)",
    "To be placed in the storage until further notice by Brian Fitzpatrick. (OPTION CARE)",
    "No response from client. Returning unrepaired.",
    "Software needs to be updated to 97-0625-010600-01. (SOLIS)",
    "Software updated to 97-0625-010600-01 at McKesson. (SOLIS)",
    "Software needs to be updated to 97-0625-010600-01(M). (SOLIS)",
    "Software updated to 97-0625-010600-01(M) at McKesson. (SOLIS)",
    "Completed 10 day charge cycle per OEM recommendation. Passed all functional tests without error and passed PM per manufacturer specifications."
  ];

  function getPhrases(){
    let saved=localStorage.getItem('my_preset_notes');
    if(saved){
      try{return JSON.parse(saved);}catch(e){}
    }
    return DEFAULT_PHRASES;
  }

  function showMainModal(){
    let phrases=getPhrases();
    let overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:999999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;';
    let box=document.createElement('div');
    box.style.cssText='background:#fff;padding:20px;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.3);width:450px;max-height:80vh;display:flex;flex-direction:column;color:#333;';
    
    let heading=document.createElement('h3');
    heading.innerText='Select Preset Note';
    heading.style.cssText='margin-top:0;margin-bottom:12px;font-size:16px;color:#222;text-align:center;';
    box.appendChild(heading);

    let container=document.createElement('div');
    container.style.cssText='overflow-y:auto;flex:1;padding-right:5px;margin-bottom:12px;';
    
    let todayStr=new Date().toLocaleDateString('en-US',{month:'2-digit',day:'2-digit',year:'numeric'});
    phrases.forEach(text=>{
      let displayText=text.replace('{DATE}',todayStr);
      let cleanText=displayText.replace(/\s*\([^)]*\)\s*$/,'').trim();
      let btn=document.createElement('button');
      btn.innerText=displayText;
      btn.style.cssText='display:block;width:100%;padding:8px 10px;margin:4px 0;background:#f8f9fa;color:#212529;border:1px solid #ced4da;border-radius:4px;cursor:pointer;font-size:12px;text-align:left;line-height:1.4;';
      btn.onmouseover=()=>btn.style.background='#e2e6ea';
      btn.onmouseout=()=>btn.style.background='#f8f9fa';
      btn.onclick=()=>{
        document.body.removeChild(overlay);
        processTextSelection(cleanText);
      };
      container.appendChild(btn);
    });
    box.appendChild(container);

    let btnRow=document.createElement('div');
    btnRow.style.cssText='display:flex;gap:6px;';

    let backBtn=document.createElement('button');
    backBtn.innerText='← Back';
    backBtn.style.cssText='flex:1;padding:8px;background:#6c757d;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;';
    backBtn.onclick=()=>{
      document.body.removeChild(overlay);
      if(window.reopenMasterLauncher) window.reopenMasterLauncher();
    };
    btnRow.appendChild(backBtn);

    let editBtn=document.createElement('button');
    editBtn.innerText='✏️ Edit Notes';
    editBtn.style.cssText='flex:1.5;padding:8px;background:#17a2b8;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;';
    editBtn.onclick=()=>{
      document.body.removeChild(overlay);
      showEditModal();
    };
    btnRow.appendChild(editBtn);

    let cancelBtn=document.createElement('button');
    cancelBtn.innerText='Cancel';
    cancelBtn.style.cssText='flex:1;padding:8px;background:#dc3545;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;';
    cancelBtn.onclick=()=>document.body.removeChild(overlay);
    btnRow.appendChild(cancelBtn);

    box.appendChild(btnRow);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  function showEditModal(){
    let phrases=getPhrases();
    let overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:999999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;';
    let box=document.createElement('div');
    box.style.cssText='background:#fff;padding:20px;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.3);width:450px;display:flex;flex-direction:column;color:#333;';
    box.innerHTML=`<h3 style="margin-top:0;margin-bottom:8px;font-size:16px;color:#222;text-align:center;">Edit Preset Notes List</h3><p style="font-size:11px;color:#666;margin-bottom:10px;">Enter one note per line. Use <b>{DATE}</b> where you want today's date automatically filled.</p><textarea id="notes_txt" style="width:95%;height:220px;font-family:sans-serif;font-size:12px;padding:6px;margin-bottom:10px;">${phrases.join('\n')}</textarea><div style="display:flex;gap:10px;"><button id="save_notes" style="flex:1;padding:8px;background:#28a745;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;">Save Changes</button><button id="cancel_edit" style="flex:1;padding:8px;background:#dc3545;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;">Cancel</button></div>`;
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    document.getElementById('cancel_edit').onclick=()=>{
      document.body.removeChild(overlay);
      showMainModal();
    };
    document.getElementById('save_notes').onclick=()=>{
      let lines=document.getElementById('notes_txt').value.split('\n').map(l=>l.trim()).filter(Boolean);
      localStorage.setItem('my_preset_notes',JSON.stringify(lines));
      document.body.removeChild(overlay);
      showMainModal();
    };
  }

  function processTextSelection(str){
    navigator.clipboard.writeText(str);
    let modalBody=document.querySelector('#addActualFindingsModal .msd-modal-body, #addActualFindingsModal');
    let target=modalBody?modalBody.querySelector('textarea, input[type="text"]:not([readonly])'):null;
    if(target){
      target.value=str;
      target.focus();
      target.dispatchEvent(new Event('input',{bubbles:true}));
      target.dispatchEvent(new Event('change',{bubbles:true}));
      showToast('Pasted into Pop-up!');
    } else {
      showToast('Copied to Clipboard! Press Ctrl+V to paste.');
    }
  }

  function showToast(msg){
    let toast=document.createElement('div');
    toast.style.cssText='position:fixed;bottom:20px;right:20px;background:#28a745;color:#fff;padding:12px 20px;border-radius:6px;z-index:9999999;font-family:sans-serif;font-size:13px;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-weight:bold;';
    toast.innerText=msg;
    document.body.appendChild(toast);
    setTimeout(()=>document.body.removeChild(toast),2500);
  }

  showMainModal();
})();
