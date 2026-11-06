const API = "/api";
const $ = (id) => document.getElementById(id);
function toast(message, isError=false) {
  const el = $("toast"); if (!el) return alert(message);
  el.textContent = message; el.style.background = isError ? "#a83e48" : "#183b67";
  el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 2800);
}
async function api(url, options={}) {
  const response = await fetch(API + url, { headers: { "Content-Type":"application/json" }, ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong.");
  return data;
}
function dateLabel(value) {
  if (!value) return "—";
  const d = new Date(value); return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString(undefined,{day:"2-digit",month:"short",year:"numeric"});
}
function timeLabel(value) { return value ? String(value).slice(0,5) : "—"; }
function statusBadge(status) { return `<span class="status ${(status||"").toLowerCase()}">${status || "—"}</span>`; }
function escapeHTML(value) { return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
const today = $("todayLabel"); if (today) today.textContent = new Date().toLocaleDateString(undefined,{weekday:"short",day:"numeric",month:"short",year:"numeric"});

async function loadDashboard() {
  try {
    const d = await api("/dashboard");
    $("patientCount").textContent=d.patients; $("doctorCount").textContent=d.doctors;
    $("appointmentCount").textContent=d.appointments; $("todayCount").textContent=d.today;
    $("recentTable").innerHTML = d.recent.length ? d.recent.map(a=>`<tr>
      <td><span class="person">${escapeHTML(a.patient_name)}</span></td><td>${escapeHTML(a.doctor_name)}</td>
      <td>${escapeHTML(a.specialization)}</td><td>${dateLabel(a.appointment_date)} · ${timeLabel(a.appointment_time)}</td><td>${statusBadge(a.status)}</td></tr>`).join("") : `<tr><td colspan="5" class="empty">No appointments yet. Book your first visit to get started.</td></tr>`;
  } catch(e) { toast(e.message,true); }
}
