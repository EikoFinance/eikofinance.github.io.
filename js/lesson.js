/* Menu burger mobile + quiz des leçons */
var t=document.querySelector('.menu-toggle'),n=document.querySelector('nav');
if(t&&n){t.addEventListener('click',function(){n.classList.toggle('mobile-open');});}
document.querySelectorAll('.q').forEach(function(q){
  var good=+q.dataset.good,btns=q.querySelectorAll('button'),fb=q.querySelector('.fb');
  btns.forEach(function(b,i){
    b.addEventListener('click',function(){
      btns.forEach(function(x){x.disabled=true});
      btns[good].classList.add('good');
      if(i===good){fb.textContent="Bravo, c'est la bonne réponse.";}
      else{b.classList.add('bad');fb.textContent="Pas tout à fait : la bonne réponse est « "+btns[good].textContent+" ».";}
    });
  });
});
