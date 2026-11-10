
const menuButton=document.querySelector('.menu-button');
const nav=document.querySelector('.primary-nav');
if(menuButton&&nav){
 menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');}));
}
const filters=[...document.querySelectorAll('.filter')];
const cards=[...document.querySelectorAll('.course-card')];
const search=document.querySelector('#course-search');
let currentFilter='all';
function applyCourseFilter(){
 const term=(search?.value||'').trim().toLowerCase();
 cards.forEach(card=>{
   const cat=card.dataset.category||'';
   const title=card.dataset.title||'';
   const filterOK=currentFilter==='all'||cat===currentFilter;
   const searchOK=!term||title.includes(term)||card.textContent.toLowerCase().includes(term);
   card.classList.toggle('hidden',!(filterOK&&searchOK));
 });
}
filters.forEach(btn=>btn.addEventListener('click',()=>{filters.forEach(x=>x.classList.remove('active'));btn.classList.add('active');currentFilter=btn.dataset.filter;applyCourseFilter();}));
if(search) search.addEventListener('input',applyCourseFilter);

const form=document.querySelector('#enquiry-form');
if(form){
 const params=new URLSearchParams(location.search);
 const course=params.get('course');
 if(course){
   const select=form.querySelector('[name="course"]');
   const option=[...select.options].find(o=>o.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')===(course==='bls-aed'?'adult-basic-life-support-and-aed-training':course));
   if(option) select.value=option.value;
 }
}


// Combined offer mapping and optional non-personal campaign identifiers.
const offerIds={"Pathway to Aesthetics":"PTA-20261028","Wellness Injection Masterclass":"WIM-TBD","Regenerative Medicine Masterclass":"RMM-TBD","Collagen Biostimulators Masterclass":"CBM-TBD"};
if(form){
 const courseSelect=form.querySelector('[name="course"]');
 const syncOffer=()=>{const field=form.querySelector('[name="offer_id"]');if(field)field.value=offerIds[courseSelect.value]||'';};
 syncOffer();courseSelect.addEventListener('change',syncOffer);
 const campaignParams=new URLSearchParams(location.search);
 ['utm_source','utm_medium','utm_campaign','utm_content'].forEach(key=>{
  const field=form.querySelector('[name="'+key+'"]');const value=campaignParams.get(key)||'';
  if(field&&/^[A-Za-z0-9_. -]{0,100}$/.test(value))field.value=value;
 });
 if(form.dataset.reviewOnly==='true'){
  const draftCheck=form.querySelector('[data-draft-check]');
  if(draftCheck)draftCheck.addEventListener('click',()=>{
   const fields=[...form.querySelectorAll('input,select,textarea')];
   const invalid=fields.find(field=>!field.checkValidity());
   if(invalid){invalid.reportValidity();return;}
   document.querySelector('#draft-form-result').textContent='Draft check complete. Nothing has been sent, saved or charged. The Academy enquiry route must be tested before release.';
  });
 }
}

const homeEnquiryForm=document.querySelector(".home-enquiry-form");
if(homeEnquiryForm){
  const statusEl=homeEnquiryForm.querySelector(".home-form-status");
  homeEnquiryForm.addEventListener("submit",async(e)=>{
    e.preventDefault();
    const button=homeEnquiryForm.querySelector('button[type="submit"]');
    const fd=new FormData(homeEnquiryForm);
    const payload={
      name:String(fd.get("name")||""),
      email:String(fd.get("email")||""),
      phone:String(fd.get("phone")||""),
      course:String(fd.get("course")||""),
      message:(fd.get("background")?"Professional background: "+String(fd.get("background"))+"\n\n":"")+String(fd.get("message")||""),
      privacy:fd.get("privacy")==="Agreed",
      website:String(fd.get("website")||""),
      page:location.pathname+location.search,
      utm_source:String(fd.get("utm_source")||""),
      utm_medium:String(fd.get("utm_medium")||""),
      utm_campaign:String(fd.get("utm_campaign")||""),
      utm_content:String(fd.get("utm_content")||"")
    };
    try{
      if(button){button.disabled=true;button.textContent="Sending…"}
      if(statusEl)statusEl.textContent="";
      const res=await fetch(homeEnquiryForm.action,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      if(!res.ok)throw new Error("submit_failed");
      const saved=await res.json();
      if(saved.ok!==true||!saved.lead_id)throw new Error("submit_failed");
      try{
        const emailRes=await fetch("https://formsubmit.co/ajax/academy@medicalwellnesslondon.com",{
          method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},
          signal:AbortSignal.timeout(15000),
          body:JSON.stringify({...payload,_subject:"New Medical Wellness Academy website enquiry",_template:"table",_url:location.href,lead_id:saved.lead_id})
        });
        const emailResult=await emailRes.json();
        if(!emailRes.ok||String(emailResult.success)!=="true")throw new Error("email_failed");
      }catch{
        if(statusEl)statusEl.textContent="Your enquiry has been received. The email notification could not be confirmed, but you do not need to submit again.";
        if(button){button.disabled=true;button.textContent="Enquiry received";}
        return;
      }
      location.href="thanks.html";
    }catch{
      if(statusEl)statusEl.textContent="That did not send. Please try again or email academy@medicalwellnesslondon.com.";
      if(button){button.disabled=false;button.textContent="Send Enquiry →"}
    }
  });
}
