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