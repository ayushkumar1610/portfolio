function disableAll() {
    $('#home-content').hide();
    $('#skills-content').hide();
    $('#contact-content').hide();
    $('#achievements-content').hide();
}

function activeHome(){
    disableAll();
    $('#home-content').show();

}

function activeSkills(){
    disableAll();
    $('#skills-content').show();

}

function activeContact(){
    disableAll();
    $('#contact-content').show();

}

function activeAchievements(){
    disableAll();
    $('#achievements-content').show();

}

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
}

$('.navbar-nav>li>a').on('click', function(){
    $('.navbar-collapse').collapse('hide');
});


function myFunction(x) {
  if (x.matches && sideOpen==1) { // If media query matches
    
      document.getElementById("sidebar").style.width = "100%";
      document.getElementById("main").style.marginLeft = "0%";
  }
  else if(sideOpen==1){
      document.getElementById("sidebar").style.width = "21%";
      document.getElementById("main").style.marginLeft = "21%";
  }
}

var x = window.matchMedia("(max-width: 700px)")
myFunction(x) // Call listener function at run time
x.addListener(myFunction) // Attach listener function on state changes