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
let roundLocked = false;
let pokemonList = [];

function setChoiceButtonsDisabled(disabled) {
    leftBtn.disabled = disabled;
    rightBtn.disabled = disabled;
}

async function loadPokemonData() {
    let response = await fetch("./pokemon-data.json");

    if (!response.ok) {
        throw new Error("Could not load Pokémon data");
    }

    let data = await response.json();

    if (!Array.isArray(data) || data.length < 2) {
        throw new Error("Pokémon data is missing or invalid");
    }

    pokemonList = data;
}

function getRandomPokemon() {
    let index = Math.floor(Math.random() * pokemonList.length);
    return pokemonList[index];
}

function getTwoDifferentPokemon() {
    let left = getRandomPokemon();
    let right = getRandomPokemon();

    while (right.id === left.id) {
        right = getRandomPokemon();
    }

    return { left, right };
}

function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

async function loadRound() {
    roundLocked = true;
    setChoiceButtonsDisabled(true);

    resultText.className = "";
    resultText.innerHTML = "Loading...";

    try {
        let pair = getTwoDifferentPokemon();
        leftPokemon = pair.left;
        rightPokemon = pair.right;

        leftName.innerHTML = capitalize(leftPokemon.name);
        rightName.innerHTML = capitalize(rightPokemon.name);

        leftImg.src = leftPokemon.image || "";
        rightImg.src = rightPokemon.image || "";

        leftImg.alt = capitalize(leftPokemon.name);
        rightImg.alt = capitalize(rightPokemon.name);

        resultText.innerHTML = "Choose the Pokémon with the higher total stats.";
        roundLocked = false;
        setChoiceButtonsDisabled(false);
    } catch (error) {
        console.error(error);
        resultText.className = "wrong";
        resultText.innerHTML = "Error loading Pokémon. Please try again.";
        startBtn.style.display = "inline-block";
        startBtn.innerHTML = "Play Again";
    }
}

startBtn.addEventListener("click", async function () {
    score = 0;
    scoreText.innerHTML = "Score: 0";

    startBtn.style.display = "none";
    gameDiv.style.display = "block";

    try {
        if (pokemonList.length === 0) {
            await loadPokemonData();
        }

        await loadRound();
    } catch (error) {
        console.error(error);
        resultText.className = "wrong";
        resultText.innerHTML = "Could not load game data.";
        startBtn.style.display = "inline-block";
        startBtn.innerHTML = "Try Again";
    }
});

function handleChoice(choice) {
    if (roundLocked || !leftPokemon || !rightPokemon) {
        return;
    }

    roundLocked = true;
    setChoiceButtonsDisabled(true);

    let isTie = leftPokemon.total === rightPokemon.total;

    let correct =
        isTie ||
        (choice === "left" && leftPokemon.total > rightPokemon.total) ||
        (choice === "right" && rightPokemon.total > leftPokemon.total);

    if (correct) {
        score++;
        scoreText.innerHTML = "Score: " + score;

        if (isTie) {
            resultText.className = "correct";
            resultText.innerHTML =
                "Draw! Free point! " +
                capitalize(leftPokemon.name) + ": " + leftPokemon.total +
                " vs " +
                capitalize(rightPokemon.name) + ": " + rightPokemon.total;
        } else {
            resultText.className = "correct";
            resultText.innerHTML =
                "Correct! " +
                capitalize(leftPokemon.name) + ": " + leftPokemon.total +
                " vs " +
                capitalize(rightPokemon.name) + ": " + rightPokemon.total;
        }

        setTimeout(loadRound, 1400);
    } else {
        resultText.className = "wrong";
        resultText.innerHTML =
            "Wrong! Final Score: " + score +
            "<br>" +
            capitalize(leftPokemon.name) + ": " + leftPokemon.total +
            " vs " +
            capitalize(rightPokemon.name) + ": " + rightPokemon.total;

        startBtn.style.display = "block";
        startBtn.style.margin = "0 auto 18px auto";
        startBtn.innerHTML = "Play Again";
    }
}

leftBtn.addEventListener("click", function () {
    handleChoice("left");
});

rightBtn.addEventListener("click", function () {
    handleChoice("right");
});
