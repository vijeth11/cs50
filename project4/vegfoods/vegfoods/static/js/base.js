window.onscroll = function(){ scrollFunction();}

function scrollFunction()
{
    if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
        document.getElementById("co-navbar").classList.add("scrolled");
      } else {
        document.getElementById("co-navbar").classList.remove("scrolled");
      }
}
