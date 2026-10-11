(() => {
const form=document.querySelector("#booking-form");if(!form)return;
const service=document.querySelector("#service"),date=document.querySelector("#date"),time=document.querySelector("#time"),feedback=document.querySelector("#booking-feedback");
const params=new URLSearchParams(location.search);
if(params.has("servico")){const wanted=params.get("servico");[...service.options].forEach(o=>{if(o.textContent.toLowerCase().startsWith(wanted.toLowerCase()))service.value=o.value})}
if(params.has("barbeiro")){const wanted=params.get("barbeiro");[...document.querySelector("#barber").options].forEach(o=>{if(o.textContent===wanted)document.querySelector("#barber").value=o.value})}
const today=new Date();today.setMinutes(today.getMinutes()-today.getTimezoneOffset());date.min=today.toISOString().slice(0,10);
function updateTimes(){
  time.innerHTML='<option value="">Selecione um horário</option>';
  if(!date.value)return;
  const d=new Date(`${date.value}T12:00:00`),day=d.getDay();
  if(day===1){time.innerHTML='<option value="">Fechado às segundas</option>';return}
  const start=9,end=day===0?14:20;
  for(let h=start;h<end;h++){for(const m of [0,30]){
    if(h===end-1&&m===30)continue;
    const value=`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
    const opt=document.createElement("option");opt.value=value;opt.textContent=value;time.append(opt);
  }}
  const bookings=JSON.parse(localStorage.getItem("bnBookings")||"[]");
  const barber=document.querySelector("#barber").value;
  [...time.options].forEach(opt=>{
    if(!opt.value)return;
    const taken=bookings.some(b=>b.date===date.value&&b.time===opt.value&&(b.barber===barber||b.barber==="Sem preferência"||barber==="Sem preferência"));
    if(taken){opt.disabled=true;opt.textContent+=" — solicitado"}
  });
}
date.addEventListener("change",updateTimes);document.querySelector("#barber").addEventListener("change",updateTimes);updateTimes();
form.addEventListener("submit",e=>{
  e.preventDefault();if(!form.reportValidity())return;
  const selected=service.options[service.selectedIndex];
  const record={id:Date.now(),service:selected.textContent,price:Number(selected.dataset.price||0),barber:document.querySelector("#barber").value,date:date.value,time:time.value,name:document.querySelector("#name").value.trim(),phone:document.querySelector("#phone").value.trim(),notes:document.querySelector("#notes").value.trim(),status:"Solicitado",createdAt:new Date().toISOString()};
  const bookings=JSON.parse(localStorage.getItem("bnBookings")||"[]");
  if(bookings.some(b=>b.date===record.date&&b.time===record.time&&(b.barber===record.barber||b.barber==="Sem preferência"||record.barber==="Sem preferência"))){
    feedback.textContent="Este horário já foi solicitado nesta demonstração. Escolha outro horário.";feedback.classList.add("show");return;
  }
  bookings.push(record);localStorage.setItem("bnBookings",JSON.stringify(bookings));
  feedback.textContent=`Solicitação registrada neste navegador!\n\n${record.service}\n${record.date} às ${record.time}\nProfissional: ${record.barber}\n\nAtenção: isso não confirma uma reserva real. Para uso real, conecte um backend e valide a disponibilidade no servidor.`;
  feedback.classList.add("show");feedback.scrollIntoView({behavior:"smooth",block:"nearest"});form.reset();time.innerHTML='<option value="">Escolha a data primeiro</option>';date.min=today.toISOString().slice(0,10);
});
})();