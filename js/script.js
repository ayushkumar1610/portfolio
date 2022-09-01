var sideOpen = 0;

function openNav() {
    if(sideOpen==0){
      document.getElementById("sidebar").style.width = "21%";
      document.getElementById("main").style.marginLeft = "21%";
      sideOpen = 1;
      document.getElementById("obtn").innerHTML = "&#10094;"
      myFunction(x)
    }
    else{
        document.getElementById("sidebar").style.width = "0";
        document.getElementById("main").style.marginLeft= "0";
        sideOpen = 0;
        document.getElementById("obtn").innerHTML = "&#10095;"
    }
}

function closeNav() {
  document.getElementById("sidebar").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
  sideOpen = 0;
  document.getElementById("obtn").innerHTML = "&#10095;"
  $('.navbar').show();
}

$('.navbar-nav>li>a, .content, #sidebar').on('click', function(){
    $('.navbar-collapse').collapse('hide');
});


function myFunction(x) {
  if (x.matches && sideOpen==1) { // If media query matches
      $('.navbar').hide();
      document.getElementById("sidebar").style.width = "100%";
      document.getElementById("main").style.marginLeft = "0%";
      document.getElementById("profile-pic").style.height = "75%";
      document.getElementById("profile-pic").style.width = "75%";
      document.getElementById("sidebar").style.fontSize = "large";
      document.getElementById("side-name").style.fontSize = "x-large";
      document.getElementById("resume-btn").style.fontSize = "large";
      document.getElementById("resume-btn").style.background = "#198754";
      document.getElementById("resume-btn").style.color = "white";
  }
  else if(sideOpen==1){
      $('.navbar').show();
      document.getElementById("sidebar").style.width = "21%";
      document.getElementById("main").style.marginLeft = "21%";
  }
}

var x = window.matchMedia("(max-width: 700px)")
myFunction(x) // Call listener function at run time
x.addListener(myFunction) // Attach listener function on state changes