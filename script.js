let startBtn = document.getElementById("startBtn");
let gameDiv = document.getElementById("game");

let leftName = document.getElementById("leftName");
let rightName = document.getElementById("rightName");

let leftImg = document.getElementById("leftImg");
let rightImg = document.getElementById("rightImg");

let leftBtn = document.getElementById("leftBtn");
let rightBtn = document.getElementById("rightBtn");

let resultText = document.getElementById("result");

startBtn.addEventListener("click", function () {
    gameDiv.style.display = "block";
    startBtn.style.display = "none";

    leftName.innerHTML = "Bulbasaur";
    rightName.innerHTML = "Charmander";

    leftImg.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png";
    rightImg.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png";

    resultText.innerHTML = "Test round loaded.";
});

leftBtn.addEventListener("click", function () {
    resultText.innerHTML = "You clicked Left.";
});

rightBtn.addEventListener("click", function () {
    resultText.innerHTML = "You clicked Right.";
});
