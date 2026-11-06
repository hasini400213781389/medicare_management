setupRecords({
 endpoint:"patients", singular:"patient", id:"patient_id", columns:6,
 fields:[{key:"name"},{key:"email"},{key:"phone"},{key:"gender"},{key:"age"}],
 render:r=>`<tr><td><span class="person">${escapeHTML(r.name)}</span><br><span class="muted">ID #${r.patient_id}</span></td><td>${escapeHTML(r.email)}</td><td>${escapeHTML(r.phone||"—")}</td><td>${escapeHTML(r.gender||"—")}</td><td>${escapeHTML(r.age??"—")}</td><td><button class="action-btn" data-action="edit" data-id="${r.patient_id}">Edit</button><button class="action-btn danger" data-action="delete" data-id="${r.patient_id}">Delete</button></td></tr>`
});
