async function loadOptions(){
  try{
    const [patients,doctors]=await Promise.all([api("/patients"),api("/doctors")]);
    $("patient_id").innerHTML='<option value="">Choose patient</option>'+patients.map(p=>`<option value="${p.patient_id}">${escapeHTML(p.name)}</option>`).join("");
    $("doctor_id").innerHTML='<option value="">Choose doctor</option>'+doctors.map(d=>`<option value="${d.doctor_id}">${escapeHTML(d.name)} — ${escapeHTML(d.specialization)}</option>`).join("");
  }catch(e){toast(e.message,true);}
}
async function loadAppointments(){
  try{
    const rows=await api(`/appointments?search=${encodeURIComponent($("searchInput").value)}`);
    $("recordCount").textContent=`${rows.length} appointments`;
    $("dataTable").innerHTML=rows.length?rows.map(a=>`<tr>
      <td><span class="person">${escapeHTML(a.patient_name)}</span></td><td>${escapeHTML(a.doctor_name)}</td>
      <td>${escapeHTML(a.specialization)}</td><td>${dateLabel(a.appointment_date)}</td><td>${timeLabel(a.appointment_time)}</td>
      <td><select class="status-select" data-id="${a.appointment_id}" aria-label="Appointment status">
        ${["Scheduled","Confirmed","Completed","Cancelled"].map(s=>`<option ${s===a.status?"selected":""}>${s}</option>`).join("")}</select></td>
      <td><button class="action-btn danger" data-delete="${a.appointment_id}">Delete</button></td></tr>`).join(""):`<tr><td colspan="7" class="empty">No appointments found.</td></tr>`;
  }catch(e){toast(e.message,true);}
}
const modal=$("recordModal");
$("addBtn").addEventListener("click",async()=>{await loadOptions();$("recordForm").reset();modal.classList.add("open");});
$("closeModal").addEventListener("click",()=>modal.classList.remove("open"));
$("cancelModal").addEventListener("click",()=>modal.classList.remove("open"));
modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("open");});
$("searchInput").addEventListener("input",loadAppointments);
$("dataTable").addEventListener("change",async e=>{
 if(!e.target.matches(".status-select"))return;
 try{await api(`/appointments/${e.target.dataset.id}/status`,{method:"PATCH",body:JSON.stringify({status:e.target.value})});toast("Appointment status updated.");}
 catch(err){toast(err.message,true);loadAppointments();}
});
$("dataTable").addEventListener("click",async e=>{
 const b=e.target.closest("[data-delete]");if(!b)return;
 if(confirm("Delete this appointment?"))try{await api(`/appointments/${b.dataset.delete}`,{method:"DELETE"});toast("Appointment deleted.");loadAppointments();}catch(err){toast(err.message,true);}
});
$("recordForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const body={patient_id:$("patient_id").value,doctor_id:$("doctor_id").value,appointment_date:$("appointment_date").value,appointment_time:$("appointment_time").value,status:$("status").value};
 try{await api("/appointments",{method:"POST",body:JSON.stringify(body)});modal.classList.remove("open");toast("Appointment booked successfully.");loadAppointments();}
 catch(err){toast(err.message,true);}
});
loadAppointments();
