window.onscroll = function(){ scrollFunction();}

function scrollFunction()
{
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        document.getElementById("co-navbar").classList.add("scrolled");
      } else {
        document.getElementById("co-navbar").classList.remove("scrolled");
      }
}
