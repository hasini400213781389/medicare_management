setupRecords({
 endpoint:"doctors", singular:"doctor", id:"doctor_id", columns:5,
 fields:[{key:"name"},{key:"specialization"},{key:"email"},{key:"phone"}],
 render:r=>`<tr><td><span class="person">${escapeHTML(r.name)}</span><br><span class="muted">ID #${r.doctor_id}</span></td><td><span class="status confirmed">${escapeHTML(r.specialization)}</span></td><td>${escapeHTML(r.email)}</td><td>${escapeHTML(r.phone||"—")}</td><td><button class="action-btn" data-action="edit" data-id="${r.doctor_id}">Edit</button><button class="action-btn danger" data-action="delete" data-id="${r.doctor_id}">Delete</button></td></tr>`
});
