const submitBtn = document.querySelector(".submitBtn");
const selectOption = document.querySelector(".select");
const pokemonImg = document.querySelector(".pokemonImg");
const rotate = document.querySelector("#rotate");
let pokemonId = "";
let spriteURL = "";
let intervalID = "";
let shinyMode = localStorage.getItem("shinyMode");

if (shinyMode === "enabled") {
    shinyCheck.checked = true;
}

(async () => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=200`)

        if (!response.ok) {
            throw new Error("Could not fetch data");
        }
        
        const data = await response.json();

        for (let i = 0; i < data.results.length; i++) {
            const pokemonOption = document.createElement("option");
            pokemonOption.textContent = data.results[i].name[0].toUpperCase() + data.results[i].name.slice(1);
            selectOption.append(pokemonOption);
        }
    }
    catch (error) {
        console.error("the error was", error);
    }
})();

submitBtn.addEventListener("click", async event => {
    event.preventDefault();
    
    try {
        const shinyCheck = document.querySelector("#shinyCheck");
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${selectOption.value.toLowerCase()}`)

        if (!response.ok) {
            throw new Error("Could not fetch data");
        }
        
        const data = await response.json();
        pokemonId = data.id;

        if (shinyCheck.checked) {
            spriteURL = data.sprites.front_shiny;
        }
        else {
            spriteURL = data.sprites.front_default;
        }
        
        pokemonImg.style.display = "block";
        pokemonImg.src = spriteURL;
    }
    catch (error) {
        console.error("the error was", error);
    }
});

shinyCheck.addEventListener("change", () => {
    if (pokemonImg.src !== "") {
        if (shinyCheck.checked) {
            pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonId}.png`
            localStorage.setItem("shinyMode", "enabled");
        }
        else {
            pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`
            localStorage.setItem("shinyMode", null);
        }
    }
});

rotate.addEventListener("change", () => {
    if (!rotate.checked) {
        clearInterval(intervalID);
        if (shinyCheck.checked) {
            pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonId}.png`
        }
        else {
            pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`
        }
    }
    else if (pokemonImg.src !== "" && rotate.checked) {
        intervalID = setInterval(() => {
                if (shinyCheck.checked) {
                    if (pokemonImg.src.includes("back")) {
                        pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonId}.png`
                    }
                    else {
                        pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/${pokemonId}.png`
                    }
                }
                else {
                    if (pokemonImg.src.includes("back")) {
                        pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`
                    }
                    else {
                        pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemonId}.png`
                   }
                }
        }, 1000);
    }
});