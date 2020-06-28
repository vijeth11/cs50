window.addEventListener('scroll', function() {
    var el = document.getElementById('pizza');
    console.log(el.getBoundingClientRect().top);
    if(el.getBoundingClientRect().top > 80){
        el.classList.add("active");
    }
  });

  function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }