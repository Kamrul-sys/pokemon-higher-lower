let startBtn = document.getElementById("startBtn");
let gameDiv = document.getElementById("game");

let leftBtn = document.getElementById("leftBtn");
let rightBtn = document.getElementById("rightBtn");

let leftName = document.getElementById("leftName");
let rightName = document.getElementById("rightName");

let leftImg = document.getElementById("leftImg");
let rightImg = document.getElementById("rightImg");

let scoreText = document.getElementById("score");
let resultText = document.getElementById("result");

let leftPokemon = null;
let rightPokemon = null;
let score = 0;

async function getPokemon() {
    let id = Math.floor(Math.random() * 1025) + 1;
    let url = "https://pokeapi.co/api/v2/pokemon/" + id;

    let response = await fetch(url);

    if (!response.ok) {
        throw new Error("Could not fetch Pokémon");
    }

    let data = await response.json();

    let totalStats = data.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

    return {
        name: data.name,
        image: data.sprites.front_default,
        total: totalStats
    };
}

function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

async function loadRound() {
    resultText.innerHTML = "Loading...";

    try {
        leftPokemon = await getPokemon();
        rightPokemon = await getPokemon();

        leftName.innerHTML = capitalize(leftPokemon.name);
        rightName.innerHTML = capitalize(rightPokemon.name);

        leftImg.src = leftPokemon.image;
        rightImg.src = rightPokemon.image;

        resultText.innerHTML = "";
    } catch (error) {
        console.error(error);
        resultText.innerHTML = "Error loading Pokémon. Please try again.";
    }
}

startBtn.addEventListener("click", async function () {
    score = 0;
    scoreText.innerHTML = "Score: 0";

    startBtn.style.display = "none";
    gameDiv.style.display = "block";

    await loadRound();
});

function handleChoice(choice) {
    let correct =
        (choice === "left" && leftPokemon.total >= rightPokemon.total) ||
        (choice === "right" && rightPokemon.total >= leftPokemon.total);

    if (correct) {
        score++;
        scoreText.innerHTML = "Score: " + score;
        resultText.innerHTML =
            "Correct! " +
            capitalize(leftPokemon.name) + ": " + leftPokemon.total +
            " vs " +
            capitalize(rightPokemon.name) + ": " + rightPokemon.total;

        setTimeout(loadRound, 1200);
    } else {
        resultText.innerHTML =
            "Wrong! Final Score: " + score +
            "<br>" +
            capitalize(leftPokemon.name) + ": " + leftPokemon.total +
            " vs " +
            capitalize(rightPokemon.name) + ": " + rightPokemon.total;

        startBtn.style.display = "inline-block";
        startBtn.innerHTML = "Play Again";
    }
}

leftBtn.addEventListener("click", function () {
    handleChoice("left");
});

rightBtn.addEventListener("click", function () {
    handleChoice("right");
});
