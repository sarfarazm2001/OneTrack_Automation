(function(){
  const rows=Array.from(document.querySelectorAll('#historicalPmDataTable tbody tr'));
  if(!rows.length){
    alert('Could not find historical PM records in #historicalPmDataTable.');
    return;
  }

  function parseRowDate(row){
    const dateCell=row.querySelector('td:nth-child(2)');
    if(!dateCell)return null;
    const match=dateCell.innerText.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if(!match)return null;
    const[_,m,d,y]=match;
    return{date:new Date(parseInt(y,10),parseInt(m,10)-1,parseInt(d,10)),text:`${String(m).padStart(2,'0')}/${String(d).padStart(2,'0')}/${y}`};
  }

  const latestPm=parseRowDate(rows[0]);
  if(!latestPm){
    alert('Could not parse date from the latest record.');
    return;
  }

  const today=new Date();
  today.setHours(0,0,0,0);
  const compareDate=new Date(latestPm.date);
  compareDate.setHours(0,0,0,0);
  const diffTime=today.getTime()-compareDate.getTime();
  const elapsedDays=Math.floor(diffTime/(1000*60*60*24));
  const isRecycle=elapsedDays<90;
  const statusText=isRecycle?'RECYCLE':'FULL PM';
  const statusColor=isRecycle?'#4ade80':'#e05252';
  const daysLeft=Math.max(0,90-elapsedDays);
  const fullRow=rows.find(tr=>{
    const typeCell=tr.querySelector('td:first-child');
    return typeCell&&/full/i.test(typeCell.innerText);
  });
  const fullPm=fullRow?parseRowDate(fullRow):null;
  const baseFullPm=fullPm||latestPm;
  const nextFullPmDate=new Date(baseFullPm.date);
  nextFullPmDate.setFullYear(nextFullPmDate.getFullYear()+1);
  const nextM=String(nextFullPmDate.getMonth()+1).padStart(2,'0');
  const nextD=String(nextFullPmDate.getDate()).padStart(2,'0');
  const nextY=nextFullPmDate.getFullYear();
  const formattedNextFullPm=`${nextM}/${nextD}/${nextY}`;

  const existingModal=document.getElementById('pm-recommendation-overlay');
  if(existingModal)existingModal.remove();

  const overlay=document.createElement('div');
  overlay.id='pm-recommendation-overlay';
  overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999999;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;';
  
  const card=document.createElement('div');
  card.style.cssText='background:#1a1d1f;border:1px solid #2d3238;border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,0.6);width:350px;padding:26px 24px 22px 24px;text-align:center;box-sizing:border-box;color:#e1e4ea;';
  card.innerHTML=`
    <div style="font-size:12px;font-weight:600;letter-spacing:1px;color:#9aa0a6;text-transform:uppercase;margin-bottom:12px;">RECOMMENDATION</div>
    <div style="font-size:30px;font-weight:800;color:${statusColor};letter-spacing:0.5px;margin-bottom:18px;">${statusText}</div>
    <div style="display:flex;align-items:center;justify-content:center;gap:8px;font-size:13px;color:#cbd2d9;margin-bottom:16px;">
      <label style="cursor:pointer;user-select:none;display:flex;align-items:center;gap:6px;">
        <span>Show Details:</span>
        <input type="checkbox" id="pm_details_toggle" style="cursor:pointer;accent-color:#3b82f6;transform:scale(1.15);">
      </label>
    </div>
    <div id="pm_details_wrapper" style="display:none;">
      <div style="border-top:1px solid #2d3238;margin-bottom:16px;"></div>
      <div style="text-align:left;font-size:13px;line-height:1.8;color:#c4cbd4;margin-bottom:20px;">
        <div><span style="font-weight:700;color:#ffffff;">Last PM Date:</span> ${latestPm.text}</div>
        <div><span style="font-weight:700;color:#ffffff;">Days Elapsed:</span> ${elapsedDays} day(s)</div>
        <div><span style="font-weight:700;color:#ffffff;">Days Left for Recycle PM:</span> ${daysLeft} day(s)</div>
        <div><span style="font-weight:700;color:#ffffff;">Last Full PM Date:</span> ${baseFullPm.text}</div>
        <div><span style="font-weight:700;color:#ffffff;">Next Full PM Due (1 Year):</span> ${formattedNextFullPm}</div>
      </div>
    </div>
    <button id="pm-rec-close" style="background:#3b82f6;color:#ffffff;border:none;padding:9px 36px;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;outline:none;">Close</button>
  `;

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  const toggle=document.getElementById('pm_details_toggle');
  const details=document.getElementById('pm_details_wrapper');
  toggle.onchange=()=>{details.style.display=toggle.checked?'block':'none';};
  
  const closeFn=()=>{overlay.remove();document.removeEventListener('keydown',keyHandler);};
  const keyHandler=(e)=>{if(e.key==='Escape')closeFn();};
  document.addEventListener('keydown',keyHandler);
  document.getElementById('pm-rec-close').onclick=closeFn;
  overlay.onclick=(e)=>{if(e.target===overlay)closeFn();};
})();
