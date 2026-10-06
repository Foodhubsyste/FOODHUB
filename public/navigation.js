(function(){
  function ready(){
    function go(from,to){
      var a=document.getElementById(from), b=document.getElementById(to);
      if(a){ a.classList.add('hidden'); a.style.display='none'; }
      if(b){ b.classList.remove('hidden'); b.style.display=''; }
    }
    var admin=document.getElementById('adminChoice');
    var customer=document.getElementById('customerChoice');
    if(admin) admin.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();go('roleScreen','adminLogin');},true);
    if(customer) customer.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();go('roleScreen','customerEntry');},true);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',ready);
  else ready();
})();