function setupRecords(config) {
  let records = [];
  const modal=$("recordModal"), form=$("recordForm"), tbody=$("dataTable"), search=$("searchInput");
  const fields=config.fields;
  function openModal(record) {
    form.reset(); $("recordId").value=record?.[config.id] || "";
    $("modalTitle").textContent=record ? `Edit ${config.singular}` : `Add ${config.singular}`;
    fields.forEach(f=>{ const el=$(f.key); if(el) el.value=record?.[f.key] ?? ""; });
    modal.classList.add("open");
  }
  function closeModal(){modal.classList.remove("open");}
  $("addBtn").addEventListener("click",()=>openModal());
  $("closeModal").addEventListener("click",closeModal); $("cancelModal").addEventListener("click",closeModal);
  modal.addEventListener("click",e=>{if(e.target===modal)closeModal();});
  async function load(){
    try {
      records=await api(`/${config.endpoint}?search=${encodeURIComponent(search.value)}`);
      $("recordCount").textContent=`${records.length} records`;
      tbody.innerHTML=records.length?records.map(r=>config.render(r)).join(""):`<tr><td colspan="${config.columns}" class="empty">No records found.</td></tr>`;
    } catch(e){tbody.innerHTML=`<tr><td colspan="${config.columns}" class="empty">${escapeHTML(e.message)}</td></tr>`;}
  }
  search.addEventListener("input",load);
  tbody.addEventListener("click",async e=>{
    const btn=e.target.closest("[data-action]"); if(!btn)return;
    const id=btn.dataset.id, record=records.find(r=>String(r[config.id])===id);
    if(btn.dataset.action==="edit") openModal(record);
    if(btn.dataset.action==="delete" && confirm(`Delete this ${config.singular}? Related appointments may also be removed.`)){
      try{await api(`/${config.endpoint}/${id}`,{method:"DELETE"});toast(`${config.singular} deleted.`);load();}
      catch(err){toast(err.message,true);}
    }
  });
  form.addEventListener("submit",async e=>{
    e.preventDefault(); const body={}; fields.forEach(f=>body[f.key]=$(f.key).value.trim() || null);
    const id=$("recordId").value;
    try{
      await api(id?`/${config.endpoint}/${id}`:`/${config.endpoint}`,{method:id?"PUT":"POST",body:JSON.stringify(body)});
      closeModal();toast(`${config.singular} saved successfully.`);load();
    }catch(err){toast(err.message,true);}
  });
  load();
}
