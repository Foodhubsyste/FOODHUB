let menu=[],customers=[],orders=[],sales=[];let currentTab='dashboard';

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const escapeHtml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=v=>'₱'+Number(v||0).toLocaleString('en-PH',{minimumFractionDigits:2,maximumFractionDigits:2});
const statusClass=s=>({completed:'success',paid:'success',ready:'info',confirmed:'info',pending:'warning',cancelled:'danger',unpaid:'warning',partial:'warning'}[String(s).toLowerCase()]||'info');

async function api(url,options={}){
  const response=await fetch(url,{...options,headers:{'Content-Type':'application/json',...(options.headers||{})}});
  let data={};try{data=await response.json()}catch(_){}
  if(!response.ok)throw new Error(data.error||data.message||'Something went wrong.');
  return data.data;
}

function showToast(message,type='success'){
  const toast=document.createElement('div');toast.className='toast '+type;
  toast.innerHTML='<span>'+(type==='success'?'✓':'!')+'</span><span>'+escapeHtml(message)+'</span>';
  $('#toastContainer').appendChild(toast);setTimeout(()=>toast.remove(),3200);
}

function setTab(tabName){
  currentTab=tabName;
  $$('.page-section').forEach(s=>s.classList.toggle('active-section',s.id===tabName));
  $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.tab===tabName));
  const titles={dashboard:'Dashboard',menu:'Menu',customers:'Customers',orders:'Orders',sales:'Sales'};
  $('#pageTitle').textContent=titles[tabName]||'Dashboard';
  closeMobileNav();
  window.scrollTo({top:0,behavior:'smooth'});
}

function openModal(content){
  $('#modal').innerHTML='<div class="modal-box">'+content+'</div>';
  $('#modal').classList.remove('is-hidden');
  document.body.style.overflow='hidden';
}
function closeModal(){ $('#modal').classList.add('is-hidden');$('#modal').innerHTML='';document.body.style.overflow=''; }
function closeMobileNav(){$('#sidebar').classList.remove('open');$('#mobileOverlay').classList.remove('show')}

function table(headers,rows,empty='No records found.'){
  if(!rows.length)return '<div class="empty-state"><div class="empty-icon">📭</div><strong>'+empty+'</strong><p>Try adding a new record or changing your search.</p></div>';
  return '<div class="table-card"><div class="table-scroll"><table><thead><tr>'+headers.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+rows.join('')+'</tbody></table></div></div>';
}

async function load(){
  try{
    const result=await Promise.all([api('/api/menu'),api('/api/customers'),api('/api/orders'),api('/api/sales')]);
    [menu,customers,orders,sales]=result;
    renderAll();
    const d=await api('/api/dashboard');renderDashboard(d);
  }catch(error){showToast(error.message,'error');console.error(error)}
}

function renderDashboard(d){
  const cards=[
    ['🍽','Menu Items',d.menu_count,'Catalog'],['♙','Customers',d.customer_count,'Registered'],
    ['▤','Total Orders',d.order_count,'All orders'],['₱','Revenue',money(d.revenue),'Completed sales'],
    ['◷','Pending',d.pending_orders,'Needs attention'],['✓','Completed',d.completed_orders,'Finished'],
    ['⚠','Low Stock',d.low_stock,'Inventory alert']
  ];
  $('#stats').innerHTML=cards.map(c=>'<div class="stat-card"><div><div class="stat-label">'+c[1]+'</div><div class="stat-value">'+c[2]+'</div><div class="stat-note">'+c[3]+'</div></div><div class="stat-icon">'+c[0]+'</div></div>').join('');
  const recent=[...orders].sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0)).slice(0,5);
  $('#recentOrders').innerHTML=recent.length?recent.map(o=>'<div class="recent-row"><div class="row-icon">🧾</div><div class="row-main"><strong>'+escapeHtml(o.order_number)+'</strong><small>'+escapeHtml(o.customer?.full_name||o.customer_id)+'</small></div><span class="badge '+statusClass(o.order_status)+'">'+escapeHtml(o.order_status)+'</span><span class="row-value">'+money(o.total_amount)+'</span></div>').join(''):'<div class="empty-state"><div class="empty-icon">🧾</div><strong>No orders yet</strong><p>Your newest orders will appear here.</p></div>';
  const low=menu.filter(x=>Number(x.stock_quantity)<=5).slice(0,5);
  $('#stockAlerts').innerHTML=low.length?low.map(x=>'<div class="stock-row"><div class="row-icon">🍽</div><div class="row-main"><strong>'+escapeHtml(x.name)+'</strong><small>'+escapeHtml(x.category)+'</small></div><span class="badge '+(Number(x.stock_quantity)===0?'danger':'warning')+'">'+Number(x.stock_quantity)+' left</span></div>').join(''):'<div class="empty-state"><div class="empty-icon">✨</div><strong>Stock looks good</strong><p>No low-stock items right now.</p></div>';
}

function renderAll(){renderMenu();renderCustomers();renderOrders();renderSales();}

function renderMenu(){
  const q=($('#menuSearch')?.value||'').toLowerCase(),filter=$('#menuFilter')?.value||'all';
  const rows=menu.filter(x=>(filter==='all'||x.category===filter)&&[x.name,x.category,x.id].join(' ').toLowerCase().includes(q)).map(x=>'<tr><td><div class="food-cell"><div class="food-avatar">🍴</div><div><strong>'+escapeHtml(x.name)+'</strong><small>'+escapeHtml(x.id)+'</small></div></div></td><td>'+escapeHtml(x.category)+'</td><td class="price">'+money(x.price)+'</td><td><span class="badge '+(Number(x.stock_quantity)<=0?'danger':Number(x.stock_quantity)<=5?'warning':'success')+'">'+Number(x.stock_quantity)+' in stock</span></td><td><span class="badge '+(x.status==='available'?'success':'danger')+'">'+escapeHtml(x.status)+'</span></td><td><div class="action-group"><button class="small-button primary" onclick="menuForm(\''+x.id+'\')">Edit</button><button class="small-button danger" onclick="deleteMenu(\''+x.id+'\')">Delete</button></div></td></tr>');
  $('#menuList').innerHTML=table(['Food Item','Category','Price','Stock','Status','Actions'],rows,'No menu items found.');
}

function renderCustomers(){
  const q=($('#customerSearch')?.value||'').toLowerCase();
  const rows=customers.filter(x=>[x.full_name,x.contact_number,x.address,x.id].join(' ').toLowerCase().includes(q)).map(x=>'<tr><td><div class="food-cell"><div class="food-avatar">👤</div><div><strong>'+escapeHtml(x.full_name)+'</strong><small>'+escapeHtml(x.id)+'</small></div></div></td><td>'+escapeHtml(x.contact_number)+'</td><td>'+escapeHtml(x.address)+'</td><td><span class="badge info">'+Number(x.total_orders||0)+' orders</span></td><td><div class="action-group"><button class="small-button primary" onclick="customerForm(\''+x.id+'\')">Edit</button><button class="small-button danger" onclick="deleteCustomer(\''+x.id+'\')">Delete</button></div></td></tr>');
  $('#customerList').innerHTML=table(['Customer','Contact','Address','Orders','Actions'],rows,'No customers found.');
}

function renderOrders(){
  const q=($('#orderSearch')?.value||'').toLowerCase(),filter=$('#orderFilter')?.value||'all';
  const rows=orders.filter(x=>(filter==='all'||x.order_status===filter)&&[x.order_number,x.customer?.full_name,x.customer_id].join(' ').toLowerCase().includes(q)).map(x=>'<tr><td><strong>'+escapeHtml(x.order_number)+'</strong><small style="display:block;color:#9aa1aa;margin-top:3px">'+escapeHtml(x.pickup_datetime||'No pickup time')+'</small></td><td>'+escapeHtml(x.customer?.full_name||x.customer_id)+'</td><td>'+x.items.map(i=>escapeHtml(i.name)+' × '+Number(i.quantity)).join('<br>')+'</td><td class="price">'+money(x.total_amount)+'</td><td><span class="badge '+statusClass(x.payment_status)+'">'+escapeHtml(x.payment_status)+'</span></td><td><span class="badge '+statusClass(x.order_status)+'">'+escapeHtml(x.order_status)+'</span></td><td><button class="small-button primary" onclick="orderEdit(\''+x.id+'\')">Update</button></td></tr>');
  $('#orderList').innerHTML=table(['Order','Customer','Items','Total','Payment','Status','Action'],rows,'No orders found.');
}

function renderSales(){
  const total=sales.reduce((sum,x)=>sum+Number(x.total_received||0),0);
  $('#salesSummary').innerHTML='<div class="sales-box"><span>TOTAL TRANSACTIONS</span><strong>'+sales.length+'</strong></div><div class="sales-box"><span>TOTAL REVENUE</span><strong>'+money(total)+'</strong></div><div class="sales-box"><span>AVERAGE SALE</span><strong>'+money(sales.length?total/sales.length:0)+'</strong></div>';
  const rows=sales.map(x=>'<tr><td><strong>'+escapeHtml(x.id)+'</strong></td><td>'+escapeHtml(x.order_id)+'</td><td>'+escapeHtml(x.transaction_date||'—')+'</td><td class="price">'+money(x.total_received)+'</td><td><span class="badge info">'+escapeHtml(x.payment_method||'cash')+'</span></td></tr>');
  $('#salesList').innerHTML=table(['Sale ID','Order','Date','Amount','Method'],rows,'No completed sales yet.');
}

function menuForm(id){
  const x=id?menu.find(a=>a.id===id):{};
  openModal('<div class="modal-head"><h2>'+(id?'Edit Menu Item':'Add Menu Item')+'</h2><button class="close-button" onclick="closeModal()">×</button></div><div class="modal-body"><form onsubmit="saveMenu(event,\''+(id||'')+'\')"><div class="form-grid"><div class="form-field full"><label>FOOD NAME</label><input name="name" required maxlength="100" value="'+escapeHtml(x.name||'')+'" placeholder="e.g. Chicken Adobo"></div><div class="form-field"><label>CATEGORY</label><select name="category">'+['Main Dish','Side Dish','Dessert','Beverage'].map(v=>'<option '+(x.category===v?'selected':'')+'>'+v+'</option>').join('')+'</select></div><div class="form-field"><label>PRICE</label><input name="price" type="number" min=".01" step=".01" required value="'+(x.price||'')+'" placeholder="0.00"></div><div class="form-field"><label>STOCK</label><input name="stock_quantity" type="number" min="0" required value="'+(x.stock_quantity??0)+'"></div><div class="form-field"><label>STATUS</label><select name="status"><option value="available" '+(x.status!=='unavailable'?'selected':'')+'>Available</option><option value="unavailable" '+(x.status==='unavailable'?'selected':'')+'>Unavailable</option></select></div><div class="form-field full"><label>DESCRIPTION</label><textarea name="description" maxlength="250" placeholder="Short description...">'+escapeHtml(x.description||'')+'</textarea></div></div><div class="form-actions"><button type="button" class="secondary-button" onclick="closeModal()">Cancel</button><button class="primary-button">Save Item</button></div></form></div>');
}
async function saveMenu(e,id){e.preventDefault();try{const f=new FormData(e.target);const body={name:f.get('name'),description:f.get('description'),category:f.get('category'),price:Number(f.get('price')),stock_quantity:Number(f.get('stock_quantity')),status:f.get('status')};await api(id?'/api/menu/'+id:'/api/menu',{method:id?'PUT':'POST',body:JSON.stringify(body)});closeModal();await load();showToast(id?'Menu item updated.':'Menu item added.')}catch(err){showToast(err.message,'error')}}
async function deleteMenu(id){if(!confirm('Delete this menu item?'))return;try{await api('/api/menu/'+id,{method:'DELETE'});await load();showToast('Menu item deleted.')}catch(err){showToast(err.message,'error')}}

function customerForm(id){
  const x=id?customers.find(a=>a.id===id):{};
  openModal('<div class="modal-head"><h2>'+(id?'Edit Customer':'Add Customer')+'</h2><button class="close-button" onclick="closeModal()">×</button></div><div class="modal-body"><form onsubmit="saveCustomer(event,\''+(id||'')+'\')"><div class="form-grid"><div class="form-field full"><label>FULL NAME</label><input name="full_name" required value="'+escapeHtml(x.full_name||'')+'" placeholder="Customer name"></div><div class="form-field full"><label>CONTACT NUMBER</label><input name="contact_number" required value="'+escapeHtml(x.contact_number||'')+'" placeholder="09XXXXXXXXX"></div><div class="form-field full"><label>ADDRESS</label><textarea name="address" required placeholder="Complete address">'+escapeHtml(x.address||'')+'</textarea></div></div><div class="form-actions"><button type="button" class="secondary-button" onclick="closeModal()">Cancel</button><button class="primary-button">Save Customer</button></div></form></div>');
}
async function saveCustomer(e,id){e.preventDefault();try{const body=Object.fromEntries(new FormData(e.target));await api(id?'/api/customers/'+id:'/api/customers',{method:id?'PUT':'POST',body:JSON.stringify(body)});closeModal();await load();showToast(id?'Customer updated.':'Customer added.')}catch(err){showToast(err.message,'error')}}
async function deleteCustomer(id){if(!confirm('Delete this customer?'))return;try{await api('/api/customers/'+id,{method:'DELETE'});await load();showToast('Customer deleted.')}catch(err){showToast(err.message,'error')}}

function orderForm(){
  const available=menu.filter(x=>x.status==='available'&&Number(x.stock_quantity)>0);
  if(!customers.length)return showToast('Please add a customer first.','error');
  if(!available.length)return showToast('No available menu items with stock.','error');
  openModal('<div class="modal-head"><h2>Create New Order</h2><button class="close-button" onclick="closeModal()">×</button></div><div class="modal-body"><form onsubmit="saveOrder(event)"><div class="form-grid"><div class="form-field full"><label>CUSTOMER</label><select name="customer_id">'+customers.map(x=>'<option value="'+x.id+'">'+escapeHtml(x.full_name)+' — '+escapeHtml(x.contact_number)+'</option>').join('')+'</select></div><div class="form-field full"><label>MENU ITEM</label><select name="menu_id">'+available.map(x=>'<option value="'+x.id+'">'+escapeHtml(x.name)+' — '+money(x.price)+' ('+x.stock_quantity+' left)</option>').join('')+'</select></div><div class="form-field"><label>QUANTITY</label><input name="quantity" type="number" min="1" max="99" value="1" required></div><div class="form-field"><label>PICKUP DATE & TIME</label><input name="pickup_datetime" type="datetime-local"></div></div><div class="form-actions"><button type="button" class="secondary-button" onclick="closeModal()">Cancel</button><button class="primary-button">Place Order</button></div></form></div>');
}
async function saveOrder(e){e.preventDefault();try{const f=new FormData(e.target);const body={customer_id:f.get('customer_id'),items:[{menu_id:f.get('menu_id'),quantity:Number(f.get('quantity'))}],pickup_datetime:f.get('pickup_datetime')};await api('/api/orders',{method:'POST',body:JSON.stringify(body)});closeModal();await load();setTab('orders');showToast('Order placed successfully.')}catch(err){showToast(err.message,'error')}}

function orderEdit(id){
  const x=orders.find(a=>a.id===id);if(!x)return;
  openModal('<div class="modal-head"><h2>Update Order</h2><button class="close-button" onclick="closeModal()">×</button></div><div class="modal-body"><div style="background:#f8f9fb;padding:13px;border-radius:12px;margin-bottom:15px"><strong>'+escapeHtml(x.order_number)+'</strong><div style="font-size:10px;color:#8d95a0;margin-top:4px">'+escapeHtml(x.customer?.full_name||x.customer_id)+' · '+money(x.total_amount)+'</div></div><form onsubmit="saveOrderEdit(event,\''+id+'\')"><div class="form-grid"><div class="form-field"><label>ORDER STATUS</label><select name="order_status">'+['pending','confirmed','ready','completed','cancelled'].map(s=>'<option value="'+s+'" '+(s===x.order_status?'selected':'')+'>'+s.replace(/^./,m=>m.toUpperCase())+'</option>').join('')+'</select></div><div class="form-field"><label>PAYMENT STATUS</label><select name="payment_status">'+['unpaid','partial','paid'].map(s=>'<option value="'+s+'" '+(s===x.payment_status?'selected':'')+'>'+s.replace(/^./,m=>m.toUpperCase())+'</option>').join('')+'</select></div><div class="form-field full"><label>PAYMENT METHOD</label><select name="payment_method">'+['cash','gcash','bank transfer'].map(s=>'<option value="'+s+'" '+(s===x.payment_method?'selected':'')+'>'+s.replace(/\b\w/g,m=>m.toUpperCase())+'</option>').join('')+'</select></div></div><div class="form-actions"><button type="button" class="secondary-button" onclick="closeModal()">Cancel</button><button class="primary-button">Update Order</button></div></form></div>');
}
async function saveOrderEdit(e,id){e.preventDefault();try{const body=Object.fromEntries(new FormData(e.target));await api('/api/orders/'+id,{method:'PUT',body:JSON.stringify(body)});closeModal();await load();showToast('Order updated successfully.')}catch(err){showToast(err.message,'error')}}

function setup(){
  $$('.nav-item').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));
  $$('[data-tab-link]').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tabLink)));
  $('#addMenuBtn').addEventListener('click',()=>menuForm());
  $('#addCustomerBtn').addEventListener('click',()=>customerForm());
  $('#newOrderBtn').addEventListener('click',orderForm);
  $('#menuSearch').addEventListener('input',renderMenu);$('#menuFilter').addEventListener('change',renderMenu);
  $('#customerSearch').addEventListener('input',renderCustomers);
  $('#orderSearch').addEventListener('input',renderOrders);$('#orderFilter').addEventListener('change',renderOrders);
  $('#menuToggle').addEventListener('click',()=>{$('#sidebar').classList.add('open');$('#mobileOverlay').classList.add('show')});
  $('#mobileOverlay').addEventListener('click',closeMobileNav);
  $('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeMobileNav()}});
}

window.addEventListener('DOMContentLoaded',()=>{
  setup();
  setTimeout(()=>{$('#welcomeScreen').classList.add('is-hidden');$('#appShell').classList.remove('is-hidden');load()},3000);
});
