var canvas = document.querySelector("#gameCanvas");
var startButton = document.querySelector(".start");

startButton.addEventListener("click", function() {

    var karakter = document.querySelector(
        'input[name="character"]:checked'
    ).value;

    if (karakter == "cowboy") {
        canvas.style.backgroundImage = "url('kepek/cowboy_map.png')";
    }
    else if (karakter == "samurai") {
        canvas.style.backgroundImage = "url('kepek/samurai_map.png')";
    }

});