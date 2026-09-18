(function(){
  const DEFAULT_DATA={"INFINITY":["N/A"],"OMNI":["8A"],"SOLIS":["45TR","80TR"],"JOEY":["45TR"],"CURLIN":["8TR","77TR","148TR","134TR","6J"],"FREEDOM":["45TR","8A"]};
  const SOFTWARE_VERSIONS={"CURLIN":{title:"Select Software for CURLIN",searchStr:"confirm software",versions:["2.04 - F5 - B0","2.04 - F6 - B1","2.04 - F6 - B2","2.05 - F5 - B0","2.05 - F6 - B1","2.05 - F6 - B2","2.05 - F6 - B3"]},"SOLIS":{title:"Select Software for SOLIS",searchStr:"latest software",versions:["0106","0106(M)"]}};

  function toTextFormat(data){return Object.entries(data).map(([k,v])=>`${k}: ${v.join(', ')}`).join('\n');}
  function parseInputFormat(str){
    str=str.trim();
    if(str.startsWith('{'))return JSON.parse(str);
    let res={};
    str.split('\n').forEach(line=>{
      let p=line.split(':');
      if(p.length>=2){
        let k=p[0].trim().toUpperCase();
        let v=p.slice(1).join(':').split(',').map(s=>s.trim()).filter(Boolean);
        if(k)res[k]=v;
      }
    });
    return res;
  }

  function getDeviceData(callback){
    let saved=localStorage.getItem('my_te_config');
    if(saved){
      try{callback(JSON.parse(saved));return;}catch(e){console.error(e);}
    }
    promptForConfig(DEFAULT_DATA,callback);
  }

  function promptForConfig(initialData,callback){
    let overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;';
    let box=document.createElement('div');
    box.style.cssText='background:#fff;padding:20px;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.3);width:360px;text-align:center;color:#333;';
    box.innerHTML=`<h3 style="margin-top:0;margin-bottom:8px;font-size:16px;color:#222;">Add / Edit TE Config</h3><p style="font-size:11px;color:#666;margin-bottom:10px;">Enter DEVICE: TE1, TE2 (one per line) or paste JSON:</p><textarea id="cfg_txt" style="width:90%;height:150px;font-family:monospace;font-size:12px;padding:6px;margin-bottom:10px;">${toTextFormat(initialData)}</textarea><div style="display:flex;gap:10px;"><button id="cfg_save" style="flex:1;padding:10px;background:#28a745;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;">Save & Continue</button><button id="cfg_cancel" style="flex:1;padding:10px;background:#dc3545;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;">Cancel</button></div>`;
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    document.getElementById('cfg_cancel').onclick=()=>{document.body.removeChild(overlay);};
    document.getElementById('cfg_save').onclick=()=>{
      try{
        let parsed=parseInputFormat(document.getElementById('cfg_txt').value);
        if(!Object.keys(parsed).length)throw new Error();
        localStorage.setItem('my_te_config',JSON.stringify(parsed));
        document.body.removeChild(overlay);
        callback(parsed);
      }catch(err){alert('Invalid format!');}
    };
  }

  function createDeviceModal(title,options,callback){
    let overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;';
    let box=document.createElement('div');
    box.style.cssText='background:#fff;padding:20px;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.3);min-width:380px;max-width:400px;text-align:center;color:#333;';
    let heading=document.createElement('h3');
    heading.innerText=title;
    heading.style.cssText='margin-top:0;margin-bottom:15px;font-size:16px;color:#222;';
    box.appendChild(heading);

    options.forEach(opt=>{
      let btn=document.createElement('button');
      btn.innerText=opt;
      btn.style.cssText='display:block;width:100%;padding:10px;margin:6px 0;background:#007bff;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:14px;font-weight:bold;';
      btn.onclick=()=>{document.body.removeChild(overlay);callback(opt);};
      box.appendChild(btn);
    });

    let addBtn=document.createElement('button');
    addBtn.innerText='+ Add / Edit Devices';
    addBtn.style.cssText='display:block;width:100%;padding:8px;margin-top:10px;background:#17a2b8;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;';
    addBtn.onclick=()=>{
      document.body.removeChild(overlay);
      let currentJSON=parseLocalConfig();
      promptForConfig(currentJSON,(newConfig)=>{
        createDeviceModal('Select Device',Object.keys(newConfig),(selDev)=>handleDeviceSelection(selDev,newConfig));
      });
    };
    box.appendChild(addBtn);

    let cancelBtn=document.createElement('button');
    cancelBtn.innerText='Cancel';
    cancelBtn.style.cssText='display:block;width:100%;padding:8px;margin-top:6px;background:#dc3545;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;';
    cancelBtn.onclick=()=>document.body.removeChild(overlay);
    box.appendChild(cancelBtn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  function parseLocalConfig(){
    let saved=localStorage.getItem('my_te_config');
    return saved?JSON.parse(saved):DEFAULT_DATA;
  }

  function createMultiSelectModal(title,options,callback,onBack){
    let overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;';
    let box=document.createElement('div');
    box.style.cssText='background:#fff;padding:20px;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.3);min-width:300px;max-width:400px;text-align:left;color:#333;';
    let heading=document.createElement('h3');
    heading.innerText=title;
    heading.style.cssText='margin-top:0;margin-bottom:15px;font-size:16px;color:#222;text-align:center;';
    box.appendChild(heading);

    let container=document.createElement('div');
    container.style.cssText='max-height:200px;overflow-y:auto;margin-bottom:15px;';
    options.forEach(opt=>{
      let lbl=document.createElement('label');
      lbl.style.cssText='display:flex;align-items:center;padding:6px;cursor:pointer;font-size:14px;';
      let chk=document.createElement('input');
      chk.type='checkbox';
      chk.value=opt;
      chk.style.cssText='margin-right:10px;transform:scale(1.2);';
      lbl.appendChild(chk);
      lbl.appendChild(document.createTextNode(opt));
      container.appendChild(lbl);
    });
    box.appendChild(container);

    let btnBox=document.createElement('div');
    btnBox.style.cssText='display:flex;gap:6px;';
    let submitBtn=document.createElement('button');
    submitBtn.innerText='Confirm';
    submitBtn.style.cssText='flex:1;padding:10px;background:#28a745;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;';
    submitBtn.onclick=()=>{
      let selected=Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map(c=>c.value);
      document.body.removeChild(overlay);
      callback(selected);
    };
    btnBox.appendChild(submitBtn);

    let backBtn=document.createElement('button');
    backBtn.innerText='Back';
    backBtn.style.cssText='flex:1;padding:10px;background:#6c757d;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;';
    backBtn.onclick=()=>{
      document.body.removeChild(overlay);
      if(onBack)onBack();
    };
    btnBox.appendChild(backBtn);

    let cancelBtn=document.createElement('button');
    cancelBtn.innerText='Cancel';
    cancelBtn.style.cssText='flex:1;padding:10px;background:#dc3545;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;';
    cancelBtn.onclick=()=>document.body.removeChild(overlay);
    btnBox.appendChild(cancelBtn);

    box.appendChild(btnBox);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  function setElementValue(el,val){
    el.focus();
    el.value=val;
    el.dispatchEvent(new Event('input',{bubbles:true}));
    el.dispatchEvent(new Event('change',{bubbles:true}));
    el.dispatchEvent(new Event('blur',{bubbles:true}));
  }

  function applyTE(teStr){
    let notesField=document.getElementById('note')||document.querySelector('textarea[name="Notes"]');
    if(notesField)setElementValue(notesField,teStr);
  }

  function autoFillRemainingRows(){
    let validTargets=['pass','yes','true'];
    let rows=Array.from(document.querySelectorAll('tr'));
    rows.forEach(tr=>{
      let descTd=tr.querySelector('td.ellipses')||tr.querySelector('td:nth-child(1)');
      let expTd=tr.querySelector('td.expected-value-column')||tr.querySelector('td:nth-child(2)');
      let inputEl=tr.querySelector('input[type="text"]:not([type="hidden"])')||tr.querySelector('textarea')||tr.querySelector('select');
      if(descTd&&expTd&&inputEl){
        let descText=descTd.innerText.toLowerCase();
        if(descText.includes('software'))return;
        let expVal=expTd.innerText.trim().toLowerCase();
        if(validTargets.includes(expVal)){
          let matchOpt=Array.from(inputEl.options||[]).find(o=>o.value.toLowerCase()===expVal||o.text.toLowerCase()===expVal);
          if(matchOpt){setElementValue(inputEl,matchOpt.value);}else{setElementValue(inputEl,expTd.innerText.trim());}
        }
      }
    });
  }

  function applySoftware(swVal,searchPattern){
    let rows=Array.from(document.querySelectorAll('tr'));
    for(let tr of rows){
      let expTd=tr.querySelector('td.ellipses')||tr.querySelector('td:nth-child(2)');
      let inputEl=tr.querySelector('input[type="text"]:not([type="hidden"])')||tr.querySelector('textarea')||tr.querySelector('select');
      if(expTd&&inputEl){
        let text=expTd.innerText.toLowerCase();
        if(text.includes(searchPattern.toLowerCase())){
          setElementValue(inputEl,swVal);
          break;
        }
      }
    }
    autoFillRemainingRows();
  }

  function handleSoftwareFlow(selectedDevice){
    let swConfig=SOFTWARE_VERSIONS[selectedDevice];
    if(!swConfig){autoFillRemainingRows();return;}
    createDeviceModal(swConfig.title,swConfig.versions,(selectedSW)=>{
      applySoftware(selectedSW,swConfig.searchStr);
    });
  }

  function handleDeviceSelection(selectedDevice,deviceData){
    let availableTEs=deviceData[selectedDevice]||[];
    let finalizeAndNext=(teString)=>{
      applyTE(teString);
      handleSoftwareFlow(selectedDevice);
    };

    if(selectedDevice==='SOLIS'){
      finalizeAndNext(`TE: ${availableTEs.join(', ')}`);
      return;
    }
    if(availableTEs.length===1){
      let teText=(availableTEs[0]==='N/A')?`TE: N/A`:`TE: ${availableTEs[0]}`;
      finalizeAndNext(teText);
    } else if(availableTEs.length>1){
      createMultiSelectModal(`Select TE(s) for ${selectedDevice}`,availableTEs,(selectedTEs)=>{
        if(selectedTEs.length){
          let teText=`TE: ${selectedTEs.join(', ')}`;
          finalizeAndNext(teText);
        }
      },()=>{
        createDeviceModal('Select Device',Object.keys(deviceData),(dev)=>handleDeviceSelection(dev,deviceData));
      });
    } else {
      finalizeAndNext(`TE: N/A`);
    }
  }

  getDeviceData((deviceData)=>{
    createDeviceModal('Select Device',Object.keys(deviceData),(selectedDevice)=>{
      handleDeviceSelection(selectedDevice,deviceData);
    });
  });
})();
