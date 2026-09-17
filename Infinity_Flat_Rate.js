(function(){
  const pageText=document.body.innerText;
  const match=pageText.match(/Serial Number\D*([569]\d{8})/i)||pageText.match(/\b([569]\d{8})\b/);
  if(!match){
    alert("Could not detect a valid 9-digit Infinity serial number on this page.");
    return;
  }
  const sn=match[1];
  const yr=parseInt("20"+sn.substring(1,3),10);
  const dayOfYear=parseInt(sn.substring(3,6),10);
  const buildDate=new Date(yr,0,dayOfYear);
  const today=new Date();
  let ageMonths=(today.getFullYear()-buildDate.getFullYear())*12+(today.getMonth()-buildDate.getMonth());
  let tempDate=new Date(buildDate);
  tempDate.setMonth(tempDate.getMonth()+ageMonths);
  if(tempDate>today){ageMonths--;}
  ageMonths=Math.max(0,ageMonths);
  let cost=0;
  if(ageMonths<=24){cost=40.00;}
  else if(ageMonths<=48){cost=225.00;}
  else if(ageMonths<=72){cost=275.00;}
  else{cost=325.00;}

  const findings=`Device S/N: ${sn} requires an OEM level repair. Age of device is ${ageMonths} months. Cost of flat rate repair including handling is $${cost.toFixed(2)}. Pumps requiring PCB replacement will incur an additional charge which MOOG will notify and provide an estimate for. McKesson Biomed will provide an updated estimate for repair if required.`;
  const target=document.querySelector('#addActualFindingsModal textarea')||document.getElementById('note')||document.querySelector('textarea[name="Notes"]')||document.querySelector('textarea');

  if(target){
    target.focus();
    const setter=Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,"value")?.set;
    if(setter){setter.call(target,findings);}else{target.value=findings;}
    target.dispatchEvent(new Event('input',{bubbles:true}));
    target.dispatchEvent(new Event('change',{bubbles:true}));
    target.dispatchEvent(new Event('blur',{bubbles:true}));
  } else {
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(findings).then(()=>{
        alert("Textarea not found. Findings copied to clipboard!\n\n"+findings);
      });
    } else {
      prompt("Textarea not found. Press Ctrl+C to copy:", findings);
    }
  }
})();
