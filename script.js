
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
   const option=[...select.options].find(o=>o.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')===course);
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
