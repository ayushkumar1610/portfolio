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