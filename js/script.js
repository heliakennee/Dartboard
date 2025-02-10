let score = 0; // Score initialisé à 0

function setScore(value) {
    score = value; // Met à jour le score en fonction du bouton cliqué
    console.log(`Score défini : ${score}`);
}

document.addEventListener("DOMContentLoaded", () => {
    const generateButtonDiv = document.getElementById("config-players-container");
    const scoreButtons = document.querySelectorAll(".score-btn");

    // Gestion pour afficher le formulaire de joueurs
    generateButtonDiv.addEventListener("click", (event) => {
        if (!event.target.matches(".score-btn")) return; // Ignore les clics hors des boutons
        generateButtonDiv.innerHTML = `
            <h1>Configuration des joueurs</h1>
            <label for="player-count">Nombre de joueurs :</label>
            <input type="number" id="player-count" min="1" value="1">
            <button id="generate-inputs">Ajouter les joueurs</button>
            <form id="players-form">
                <div id="players-inputs"></div>
                <button type="submit" id="start-game" disabled>Lancer la partie</button>
            </form>
        `;

        const playerCountInput = document.getElementById("player-count");
        const generateInputsButton = document.getElementById("generate-inputs");
        const playersForm = document.getElementById("players-form");
        const playersInputsContainer = document.getElementById("players-inputs");
        const startGameButton = document.getElementById("start-game");

        generateInputsButton.addEventListener("click", () => {
            const playerCount = parseInt(playerCountInput.value, 10);
            if (playerCount >= 1) {
                playersInputsContainer.innerHTML = ""; // Réinitialise les champs
                for (let i = 1; i <= playerCount; i++) {
                    const input = document.createElement("input");
                    input.type = "text";
                    input.placeholder = `Nom du joueur ${i}`;
                    input.id = `player-${i}`;
                    input.required = true;
                    playersInputsContainer.appendChild(input);
                }
                startGameButton.disabled = false;
            }
        });

        playersForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const players = [];
            playersInputsContainer.querySelectorAll("input").forEach((input, index) => {
                players.push({
                    id: index + 1,
                    name: input.value.trim(),
                    score: score,
                    max : 0,
                    nbrlance : 0,
                    total : 0
                });
            });

            localStorage.setItem("score", JSON.stringify(players[0].score));
            localStorage.setItem("players", JSON.stringify(players));
            window.location.href = "game.html";
        });
    });
});
