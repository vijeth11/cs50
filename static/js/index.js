$(document).ready(function(){
    $('.owl-carousel').owlCarousel({
    loop:true,
    margin:50,
    responsiveClass:true,
    responsive:{
        0:{
          nav:true,
          dots:true,
          dotsEach:true,
          items:1
        },
        600:{
          nav:true,
          dots:true,
          dotsEach:true,
          items:2
        },
        1000:{
          nav:true,
          dots:true,
          dotsEach:true,
          items:3
        }
    }    
    });
    
    var dealenddate =  document.getElementById("dealenddate") ? document.getElementById("dealenddate").value : null;
    if(dealenddate && dealenddate.length > 0){
        var countdowndate = new Date(dealenddate).getTime();
        var dealtimer = setInterval(function(){
          var now =  new Date().getTime();
          var distance = countdowndate - now;
          var days = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);

          document.getElementById("days").innerHTML = "-"+days+"<span>Days</span>";
          document.getElementById("hours").innerHTML = hours + "<span>Hours</span>";
          document.getElementById("minutes").innerHTML = minutes + "<span>Minutes</span>";
          document.getElementById("seconds").innerHTML = seconds + "<span>Seconds</span>";

          if(distance < 0 ){
            clearInterval(dealtimer);
          }
        },1000);
    }
  });


