window.addEventListener('scroll', function() {
    var el = document.getElementById('pizza');
    console.log(el.getBoundingClientRect().top);
    if(el.getBoundingClientRect().top > 80){
        el.classList.add("active");
    }
  });