let menu=[],customers=[],orders=[],sales=[],cart=[];let currentCustomer=null,adminToken=localStorage.getItem('foodhub_admin_token')||'';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=v=>'₱'+Number(v||0).toLocaleString('en-PH',{minimumFractionDigits:2,maximumFractionDigits:2});
const cls=s=>({completed:'success',ready:'info',confirmed:'info',pending:'warning',cancelled:'danger',paid:'success',partial:'warning',unpaid:'warning'}[String(s).toLowerCase()]||'info');
const UI=window.FoodHubComponents;

async function api(url,opt={}){
  const headers={'Content-Type':'application/json',...(opt.headers||{})};
  if(adminToken)headers.Authorization='Bearer '+adminToken;
  const r=await fetch(url,{...opt,headers});let j={};try{j=await r.json()}catch(_){}
  if(!r.ok){
    const err=new Error(j.error||j.message||'Request failed');
    err.status=r.status;
    err.field=j.field||null;
    err.data=j.data||null;
    throw err;
  }
  return j.data;
}
function setFormBusy(form,busy,label='Saving...'){
  if(!form)return;
  const button=form.querySelector('button[type="submit"]');
  if(!button)return;
  if(busy){
    button.dataset.originalText=button.textContent;
    button.disabled=true;
    button.setAttribute('aria-busy','true');
    button.textContent=label;
  }else{
    button.disabled=false;
    button.removeAttribute('aria-busy');
    button.textContent=button.dataset.originalText||'Save';
  }
}
function formError(form,message,field=null){
  const box=form?.querySelector('.form-error');
  if(box)box.textContent=field?field+': '+message:message;
}
function toast(msg,type='success'){const x=document.createElement('div');x.className='toast-msg '+type;x.textContent=msg;$('#toast').appendChild(x);setTimeout(()=>x.remove(),3200)}
function show(id){['welcomeScreen','roleScreen','adminLogin','customerEntry','adminApp','customerApp'].forEach(x=>{const el=$('#'+x);if(el)el.classList.toggle('hidden',x!==id)})}
function table(headers,rows,empty='No records found.'){return UI.table(headers,rows,empty,'There is nothing to display yet.')}

function adminTab(name){$$('.page').forEach(x=>x.classList.toggle('active',x.id===name));$$('.nav').forEach(x=>x.classList.toggle('active',x.dataset.tab===name));$('#pageTitle').textContent={dashboard:'Dashboard',menu:'Menu',customers:'Customers',orders:'Orders',sales:'Sales'}[name];if(window.innerWidth<=800)$('#sidebar').classList.remove('open')}

function setAdminState(state,message=''){
  const ids=['stats','recentOrders','stockAlerts','menuList','customerList','orderList','salesList'];
  ids.forEach(id=>{const el=$('#'+id);if(!el)return;el.innerHTML=state==='loading'?UI.loadingState('Loading '+id.replace(/([A-Z])/g,' $1').toLowerCase()+'...'):UI.errorState(message||'Please try again.')});
}

async function loadAdmin(){
  setAdminState('loading');
  try{[menu,customers,orders,sales]=await Promise.all([api('/api/menu'),api('/api/customers'),api('/api/orders'),api('/api/sales')]);renderAdmin();const d=await api('/api/dashboard');renderStats(d)}
  catch(e){if(e.message.includes('login'))logoutAdmin();else{setAdminState('error',e.message);toast(e.message,'error')}}
}
function renderStats(d){
  const a=[['🍽','Menu Items',d.menu_count,'Catalog'],['♙','Customers',d.customer_count,'Registered'],['▤','Orders',d.order_count,'All orders'],['₱','Revenue',money(d.revenue),'Completed sales'],['◷','Pending',d.pending_orders,'Needs attention'],['✓','Completed',d.completed_orders,'Finished'],['⚠','Low Stock',d.low_stock,'Inventory alert']];
  $('#stats').innerHTML=a.map(x=>UI.stat(x[0],x[1],x[2],x[3])).join('');
  const recent=[...orders].slice(-5).reverse();
  $('#recentOrders').innerHTML=recent.length?recent.map(o=>'<div class="row"><div class="row-icon">🧾</div><div class="row-main"><strong>'+esc(o.order_number)+'</strong><small>'+esc(o.customer?.full_name||o.customer_id)+'</small></div><span class="badge '+cls(o.order_status)+'">'+esc(o.order_status)+'</span><b>'+money(o.total_amount)+'</b></div>').join(''):'<div class="empty">No orders yet.</div>';
  const low=menu.filter(x=>Number(x.stock_quantity)<=5);$('#stockAlerts').innerHTML=low.length?low.map(x=>'<div class="row"><div class="row-icon">🍽</div><div class="row-main"><strong>'+esc(x.name)+'</strong><small>'+esc(x.category)+'</small></div><span class="badge '+(x.stock_quantity===0?'danger':'warning')+'">'+x.stock_quantity+' left</span></div>').join(''):'<div class="empty">✨ Stock looks good.</div>';
}
function renderAdmin(){renderMenu();renderCustomers();renderOrders();renderSales()}
function renderMenu(){const q=($('#menuSearch')?.value||'').toLowerCase(),f=$('#menuFilter')?.value||'all';const rows=menu.filter(x=>(f==='all'||x.category===f)&&[x.name,x.category,x.id].join(' ').toLowerCase().includes(q)).map(x=>'<tr><td><div class="food-cell"><div class="food-avatar">🍴</div><div><strong>'+esc(x.name)+'</strong><small>'+esc(x.id)+'</small></div></div></td><td>'+esc(x.category)+'</td><td><b>'+money(x.price)+'</b></td><td><span class="badge '+(x.stock_quantity<=0?'danger':x.stock_quantity<=5?'warning':'success')+'">'+x.stock_quantity+'</span></td><td><span class="badge '+(x.status==='available'?'success':'danger')+'">'+esc(x.status)+'</span></td><td><div class="action-group"><button class="small-btn edit" onclick="menuForm(\''+x.id+'\')">Edit</button><button class="small-btn delete" onclick="deleteMenu(\''+x.id+'\')">Delete</button></div></td></tr>');$('#menuList').innerHTML=table(['Food Item','Category','Price','Stock','Status','Actions'],rows,'No menu items found.')}
function renderCustomers(){const q=($('#customerSearch')?.value||'').toLowerCase();const rows=customers.filter(x=>[x.full_name,x.contact_number,x.address].join(' ').toLowerCase().includes(q)).map(x=>'<tr><td><div class="food-cell"><div class="food-avatar">👤</div><div><strong>'+esc(x.full_name)+'</strong><small>'+esc(x.id)+'</small></div></div></td><td>'+esc(x.contact_number)+'</td><td>'+esc(x.address)+'</td><td><span class="badge info">'+x.total_orders+' orders</span></td><td><div class="action-group"><button class="small-btn edit" onclick="customerForm(\''+x.id+'\')">Edit</button><button class="small-btn delete" onclick="deleteCustomer(\''+x.id+'\')">Delete</button></div></td></tr>');$('#customerList').innerHTML=table(['Customer','Phone','Address','Orders','Actions'],rows,'No customers found.')}
function renderOrders(){const q=($('#orderSearch')?.value||'').toLowerCase(),f=$('#orderFilter')?.value||'all';const rows=orders.filter(x=>(f==='all'||x.order_status===f)&&[x.order_number,x.customer?.full_name,x.customer_id,x.fulfillment_type,x.delivery_location].join(' ').toLowerCase().includes(q)).map(x=>{const delivery=x.fulfillment_type==='delivery';const method=delivery?'🚚 Delivery':'🏪 Pickup';const location=delivery&&x.delivery_location?'<small style="display:block;color:#9aa1aa;margin-top:4px">📍 '+esc(x.delivery_location)+'</small>':'';return '<tr><td><b>'+esc(x.order_number)+'</b><small style="display:block;color:#9aa1aa">'+esc(x.pickup_datetime||'No pickup time')+'</small></td><td>'+esc(x.customer?.full_name||x.customer_id)+'</td><td>'+x.items.map(i=>esc(i.name)+' × '+i.quantity).join('<br>')+'</td><td><span class="badge info">'+method+'</span>'+location+'</td><td><b>'+money(x.total_amount)+'</b></td><td><span class="badge '+cls(x.payment_status)+'">'+esc(x.payment_status)+'</span></td><td><span class="badge '+cls(x.order_status)+'">'+esc(x.order_status)+'</span></td><td><button class="small-btn edit" onclick="orderEdit(\''+x.id+'\')">Update</button></td></tr>'});$('#orderList').innerHTML=table(['Order','Customer','Items','Fulfillment','Total','Payment','Status','Action'],rows,'No orders found.')}
function renderSales(){const total=sales.reduce((s,x)=>s+Number(x.total_received||0),0);$('#salesSummary').innerHTML='<div class="sale-box"><small>TRANSACTIONS</small><strong>'+sales.length+'</strong></div><div class="sale-box"><small>TOTAL REVENUE</small><strong>'+money(total)+'</strong></div><div class="sale-box"><small>AVERAGE SALE</small><strong>'+money(sales.length?total/sales.length:0)+'</strong></div>';$('#salesList').innerHTML=table(['Sale ID','Order','Date','Amount','Method'],sales.map(x=>'<tr><td>'+esc(x.id)+'</td><td>'+esc(x.order_id)+'</td><td>'+esc(x.transaction_date)+'</td><td><b>'+money(x.total_received)+'</b></td><td>'+esc(x.payment_method)+'</td></tr>'),'No completed sales yet.')}

function openModal(html){$('#modal').innerHTML='<div class="modal-box">'+html+'</div>';$('#modal').classList.remove('hidden')}function closeModal(){$('#modal').classList.add('hidden');$('#modal').innerHTML=''}
function menuForm(id){const x=id?menu.find(a=>a.id===id):{};openModal('<div class="modal-head"><h2>'+(id?'Edit':'Add')+' Menu Item</h2><button class="close" onclick="closeModal()">×</button></div><div class="modal-body"><form id="menuForm" class="form-grid"><label class="form-field full-field">FOOD NAME<input name="name" required value="'+esc(x.name||'')+'"></label><label class="form-field">CATEGORY<select name="category">'+['Main Dish','Rice','Side Dish','Dessert','Beverage'].map(v=>'<option '+(x.category===v?'selected':'')+'>'+v+'</option>').join('')+'</select></label><label class="form-field">PRICE<input name="price" type="number" min=".01" step=".01" required value="'+(x.price||'')+'"></label><label class="form-field">STOCK<input name="stock_quantity" type="number" min="0" required value="'+(x.stock_quantity??0)+'"></label><label class="form-field">STATUS<select name="status"><option value="available">Available</option><option value="unavailable" '+(x.status==='unavailable'?'selected':'')+'>Unavailable</option></select></label><label class="form-field full-field">DESCRIPTION<textarea name="description">'+esc(x.description||'')+'</textarea></label><div class="form-error full-field" role="alert"></div><div class="form-actions full-field"><button type="button" class="secondary" onclick="closeModal()">Cancel</button><button class="primary-btn">Save Item</button></div></form></div>');$('#menuForm').onsubmit=async e=>{
  e.preventDefault();
  const form=e.target; formError(form,'');
  const data=new FormData(form);
  const body={name:data.get('name'),description:data.get('description'),category:data.get('category'),price:Number(data.get('price')),stock_quantity:Number(data.get('stock_quantity')),status:data.get('status')};
  setFormBusy(form,true,id?'Updating...':'Creating...');
  try{
    await api(id?'/api/menu/'+id:'/api/menu',{method:id?'PUT':'POST',body:JSON.stringify(body)});
    closeModal(); await loadAdmin(); toast(id?'Menu updated.':'Menu added.');
  }catch(err){
    formError(form,err.message,err.status===422?err.field:null); toast(err.message,'error');
  }finally{setFormBusy(form,false);}
}}
async function deleteMenu(id){if(!confirm('Delete this menu item?'))return;try{await api('/api/menu/'+id,{method:'DELETE'});await loadAdmin();toast('Menu item deleted.')}catch(e){toast(e.message,'error')}}
function customerForm(id){const x=id?customers.find(a=>a.id===id):{};openModal('<div class="modal-head"><h2>'+(id?'Edit':'Add')+' Customer</h2><button class="close" onclick="closeModal()">×</button></div><div class="modal-body"><form id="customerForm" class="form-grid"><label class="form-field full-field">FULL NAME<input name="full_name" required value="'+esc(x.full_name||'')+'"></label><label class="form-field full-field">PHONE NUMBER<input name="contact_number" required value="'+esc(x.contact_number||'')+'"></label><label class="form-field full-field">ADDRESS<textarea name="address" required>'+esc(x.address||'')+'</textarea></label><div class="form-error full-field" role="alert"></div><div class="form-actions full-field"><button type="button" class="secondary" onclick="closeModal()">Cancel</button><button class="primary-btn">Save Customer</button></div></form></div>');$('#customerForm').onsubmit=async e=>{
  e.preventDefault();
  const form=e.target; formError(form,'');
  const body=Object.fromEntries(new FormData(form));
  setFormBusy(form,true,id?'Updating...':'Creating...');
  try{
    await api(id?'/api/customers/'+id:'/api/customers',{method:id?'PUT':'POST',body:JSON.stringify(body)});
    closeModal(); await loadAdmin(); toast(id?'Customer updated.':'Customer added.');
  }catch(err){
    formError(form,err.message,err.status===422?err.field:null); toast(err.message,'error');
  }finally{setFormBusy(form,false);}
}}
async function deleteCustomer(id){if(!confirm('Delete this customer?'))return;try{await api('/api/customers/'+id,{method:'DELETE'});await loadAdmin();toast('Customer deleted.')}catch(e){toast(e.message,'error')}}
function orderEdit(id){const x=orders.find(a=>a.id===id);openModal('<div class="modal-head"><h2>Update Order</h2><button class="close" onclick="closeModal()">×</button></div><div class="modal-body"><p><b>'+esc(x.order_number)+'</b> · '+money(x.total_amount)+'</p><form id="orderEditForm" class="form-grid"><label class="form-field">ORDER STATUS<select name="order_status">'+['pending','confirmed','ready','completed','cancelled'].map(v=>'<option '+(v===x.order_status?'selected':'')+'>'+v+'</option>').join('')+'</select></label><label class="form-field">PAYMENT STATUS<select name="payment_status">'+['unpaid','partial','paid'].map(v=>'<option '+(v===x.payment_status?'selected':'')+'>'+v+'</option>').join('')+'</select></label><label class="form-field full-field">PAYMENT METHOD<select name="payment_method">'+['cash','gcash','bank transfer'].map(v=>'<option '+(v===x.payment_method?'selected':'')+'>'+v+'</option>').join('')+'</select></label><div class="form-error full-field" role="alert"></div><div class="form-actions full-field"><button type="button" class="secondary" onclick="closeModal()">Cancel</button><button type="submit" class="primary-btn">Update</button></div></form></div>');$('#orderEditForm').onsubmit=async e=>{
  e.preventDefault();
  const form=e.target; formError(form,'');
  setFormBusy(form,true,'Updating...');
  try{
    await api('/api/orders/'+id,{method:'PUT',body:JSON.stringify(Object.fromEntries(new FormData(form)))});
    closeModal(); await loadAdmin(); toast('Order updated.');
  }catch(err){
    formError(form,err.message,err.status===422?err.field:null); toast(err.message,'error');
  }finally{setFormBusy(form,false);}
}}

function renderCustomerMenu(){const q=($('#customerMenuSearch')?.value||'').toLowerCase();const items=menu.filter(x=>x.status==='available'&&x.stock_quantity>0&&[x.name,x.category].join(' ').toLowerCase().includes(q));$('#customerMenu').innerHTML=items.length?items.map(x=>'<article class="food-card"><div class="food-image">🍲</div><div class="food-body"><span class="eyebrow">'+esc(x.category)+'</span><h3>'+esc(x.name)+'</h3><p>'+esc(x.description||'Home-cooked favorite')+'</p><div class="food-meta"><span class="food-price">'+money(x.price)+'</span><button class="add-food" onclick="addCart(\''+x.id+'\')">＋ Add</button></div></div></article>').join(''):'<div class="empty">No available food found.</div>'}
function addCart(id){const item=menu.find(x=>x.id===id);const existing=cart.find(x=>x.id===id);if(existing){if(existing.quantity<item.stock_quantity)existing.quantity++;else return toast('Maximum available stock reached.','error')}else cart.push({id,quantity:1});renderCart();toast(item.name+' added to your order.')}
function changeCart(id,delta){
  const c=cart.find(x=>x.id===id),item=menu.find(x=>x.id===id);
  if(!c)return;
  if(!item){cart=cart.filter(x=>x.id!==id);return renderCart()}
  c.quantity+=delta;
  if(c.quantity>item.stock_quantity)c.quantity=item.stock_quantity;
  if(c.quantity<=0)cart=cart.filter(x=>x.id!==id);
  renderCart();
}
function renderCart(){cart=cart.filter(c=>menu.some(i=>i.id===c.id&&i.stock_quantity>0));const total=cart.reduce((s,c)=>{const i=menu.find(x=>x.id===c.id);return s+i.price*c.quantity},0);$('#cartCount').textContent=cart.reduce((s,x)=>s+x.quantity,0);$('#cartTotal').textContent=money(total);$('#cartItems').innerHTML=cart.length?cart.map(c=>{const i=menu.find(x=>x.id===c.id);if(!i)return '';return '<div class="cart-line"><div class="cart-line-main"><strong>'+esc(i.name)+'</strong><small>'+money(i.price)+' each</small></div><div class="qty"><button onclick="changeCart(\''+i.id+'\',-1)">−</button><b>'+c.quantity+'</b><button onclick="changeCart(\''+i.id+'\',1)">+</button></div></div>'}).join(''):UI.emptyState('Your cart is empty','Add something delicious!','🛒')}
function formatSchedule(o){
  if(!o || !o.scheduled_datetime) return 'No schedule';
  const d=new Date(o.scheduled_datetime);
  return Number.isNaN(d.getTime()) ? esc(o.scheduled_datetime) : d.toLocaleString('en-PH',{dateStyle:'medium',timeStyle:'short'});
}
function setCustomerState(state,message=''){
  const ids=['customerMenu','customerOrders'];
  ids.forEach(id=>{const el=$('#'+id);if(!el)return;el.innerHTML=state==='loading'?UI.loadingState('Loading '+id.replace(/([A-Z])/g,' $1').toLowerCase()+'...'):UI.errorState(message||'Please try again.')});
}

async function loadCustomer(){
  setCustomerState('loading');
  try{
    const data=await api('/api/menu');
    menu=data;
    renderCustomerMenu();
    renderCart();
    await loadCustomerOrders();
  }catch(e){
    setCustomerState('error',e.message);
    toast(e.message,'error');
  }
}
async function loadCustomerOrders(){
  if(!currentCustomer)return;
  const os=await api('/api/customers/'+currentCustomer.id+'/orders');
  $('#customerOrders').innerHTML=table(['Order','Items','Total','Fulfillment','Schedule'],os.map(o=>'<tr><td><b>'+esc(o.order_number)+'</b></td><td>'+o.items.map(i=>esc(i.name)+' × '+i.quantity).join('<br>')+'</td><td><b>'+money(o.total_amount)+'</b></td><td><span class="badge info">'+(o.fulfillment_type==='delivery'?'🚚 Delivery':'🏪 Pickup')+'</span>'+(o.delivery_location?'<small style="display:block;color:#8d95a0;margin-top:4px">📍 '+esc(o.delivery_location)+'</small>':'')+'</td><td>'+formatSchedule(o)+'</td></tr>'),'You have not placed any orders yet.')}
function checkoutForm(){
  const now=new Date();
  const minDate=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10);
  const defaultDate=new Date(now.getTime()+60*60*1000-now.getTimezoneOffset()*60000).toISOString().slice(0,10);
  const modalHtml='<div class="modal-head"><div><h2>Order Details</h2><small class="modal-subtitle">Choose how and when you want to receive your food.</small></div><button class="close" onclick="closeModal()">×</button></div><div class="modal-body"><form id="checkoutForm" class="form-grid"><div class="form-field full-field"><span class="field-title">FULFILLMENT METHOD</span><div class="fulfillment-grid"><label class="fulfillment-option"><input type="radio" name="fulfillment_type" value="pickup" checked><span>🏪 <b>Pick Up</b><small>Collect your order at FOODHUB</small></span></label><label class="fulfillment-option"><input type="radio" name="fulfillment_type" value="delivery"><span>🚚 <b>Delivery</b><small>We will deliver to your location</small></span></label></div></div><label id="deliveryLocationField" class="form-field full-field hidden">DELIVERY LOCATION<textarea id="deliveryLocation" name="delivery_location" maxlength="250" placeholder="Complete delivery address, landmark, barangay..."></textarea></label><label class="form-field">DATE<input id="orderDate" name="order_date" type="date" min="'+minDate+'" value="'+defaultDate+'" required></label><label class="form-field">TIME<input id="orderTime" name="order_time" type="time" required></label><div class="schedule-note full-field">Please choose the date and time you want your order ready for pickup or delivered.</div><div id="checkoutError" class="form-error full-field" role="alert"></div><div class="form-actions full-field"><button type="button" class="secondary" onclick="closeModal()">Back</button><button type="submit" class="primary-btn">Place Order</button></div></form></div>';
  openModal(modalHtml);
  const toggle=()=>{const delivery=$('input[name="fulfillment_type"]:checked').value==='delivery';$('#deliveryLocationField').classList.toggle('hidden',!delivery);$('#deliveryLocation').required=delivery};
  $$('input[name="fulfillment_type"]').forEach(r=>r.onchange=toggle);
  toggle();
  $('#checkoutForm').onsubmit=async e=>{e.preventDefault();$('#checkoutError').textContent='';const f=new FormData(e.target),date=f.get('order_date'),time=f.get('order_time');const scheduled=date+'T'+time,delivery=f.get('fulfillment_type')==='delivery';if(!date||!time)return $('#checkoutError').textContent='Please choose both a date and time.';if(delivery&&!String(f.get('delivery_location')||'').trim())return $('#checkoutError').textContent='Please enter the delivery location.';if(new Date(scheduled).getTime()<Date.now())return $('#checkoutError').textContent='Please choose a future date and time.';const form=e.target;
  const submit=form.querySelector('button[type="submit"]');
  submit.disabled=true; submit.setAttribute('aria-busy','true'); submit.textContent='Placing order...';
  try{
    await api('/api/orders',{method:'POST',body:JSON.stringify({customer_id:currentCustomer.id,items:cart.map(c=>({menu_id:c.id,quantity:c.quantity})),fulfillment_type:f.get('fulfillment_type'),delivery_location:String(f.get('delivery_location')||'').trim(),scheduled_datetime:scheduled})});
    cart=[]; closeModal(); await loadCustomer(); toast(delivery?'Delivery order placed!':'Pickup order placed!');
  }catch(err){
    $('#checkoutError').textContent=(err.status===422&&err.field?err.field+': ':'')+err.message;
  }finally{
    submit.disabled=false; submit.removeAttribute('aria-busy'); submit.textContent='Place Order';
  }
};
}
async function placeCustomerOrder(){if(!cart.length)return toast('Add at least one food item first.','error');checkoutForm()}
function logoutAdmin(){adminToken='';localStorage.removeItem('foodhub_admin_token');show('roleScreen')}
function logoutCustomer(){currentCustomer=null;localStorage.removeItem('foodhub_customer');cart=[];show('roleScreen')}

function setup(){
  // Bind each control independently so one optional control cannot prevent the role buttons from working.
  const bind=(selector,event,handler)=>{const el=$(selector);if(el)el.addEventListener(event,handler);};
  bind('#adminChoice','click',()=>show('adminLogin'));
  bind('#customerChoice','click',()=>show('customerEntry'));
  $$('[data-back="role"]').forEach(b=>b.onclick=()=>show('roleScreen'));
  bind('#adminLoginForm','submit',async e=>{e.preventDefault();$('#loginError').textContent='';try{const d=await api('/api/admin/login',{method:'POST',body:JSON.stringify({username:$('#adminUsername').value,password:$('#adminPassword').value})});adminToken=d.token;localStorage.setItem('foodhub_admin_token',adminToken);show('adminApp');await loadAdmin()}catch(err){$('#loginError').textContent=err.message}});
  bind('#customerEntryForm','submit',async e=>{e.preventDefault();$('#customerError').textContent='';try{const d=await api('/api/customers/session',{method:'POST',body:JSON.stringify({full_name:$('#customerName').value,contact_number:$('#customerPhone').value,address:$('#customerAddress').value})});currentCustomer=d;localStorage.setItem('foodhub_customer',JSON.stringify(d));$('#customerGreeting').textContent='Hi, '+d.full_name.split(' ')[0]+' 👋';show('customerApp');await loadCustomer()}catch(err){$('#customerError').textContent=err.message}});
  bind('#adminLogout','click',async()=>{try{await api('/api/admin/logout',{method:'POST'})}catch(_){}logoutAdmin()});
  bind('#customerLogout','click',logoutCustomer);
  $$('.nav').forEach(b=>b.onclick=()=>adminTab(b.dataset.tab));$$('[data-tab-link]').forEach(b=>b.onclick=()=>adminTab(b.dataset.tabLink));
  bind('#menuToggle','click',()=>$('#sidebar').classList.toggle('open'));
  bind('#addMenuBtn','click',()=>menuForm());bind('#addCustomerBtn','click',()=>customerForm());
  bind('#menuSearch','input',renderMenu);bind('#menuFilter','change',renderMenu);bind('#customerSearch','input',renderCustomers);bind('#orderSearch','input',renderOrders);bind('#orderFilter','change',renderOrders);
  bind('#customerMenuSearch','input',renderCustomerMenu);bind('#placeCustomerOrder','click',placeCustomerOrder);
  bind('#modal','click',e=>{if(e.target.id==='modal')closeModal()});document.onkeydown=e=>{if(e.key==='Escape')closeModal()};
}
window.addEventListener('DOMContentLoaded',()=>{
  // Always dismiss the welcome screen after exactly 3 seconds.
  // Keep this timer independent so a later UI setup error cannot leave the splash screen stuck.
  const enterApp=()=>{
    // Only perform the automatic transition if the splash screen is still visible.
    // This prevents the 3-second timer from overriding a user's Admin/Customer choice.
    const welcome=$('#welcomeScreen');
    if(!welcome || welcome.classList.contains('hidden')) return;
    welcome.classList.add('hidden');
    welcome.style.removeProperty('display');
    const savedCustomer=localStorage.getItem('foodhub_customer');
    if(adminToken){show('adminApp');loadAdmin()}
    else if(savedCustomer){try{currentCustomer=JSON.parse(savedCustomer);$('#customerGreeting').textContent='Hi, '+currentCustomer.full_name.split(' ')[0]+' 👋';show('customerApp');loadCustomer()}catch(_){localStorage.removeItem('foodhub_customer');show('roleScreen')}}
    else show('roleScreen');
  };
  setTimeout(enterApp,3000);
  try{setup()}catch(error){console.error('FOODHUB setup error:',error)}
});

// CI selector regression fix
