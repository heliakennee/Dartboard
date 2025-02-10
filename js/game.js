//Gestion utilisateurs

let players = JSON.parse(localStorage.getItem("players")) || [];
let scoredepart = JSON.parse(localStorage.getItem("score")) || [];
        
// Gestion de la cible
const canvas = document.getElementById("dartboard");
const ctx = canvas.getContext("2d");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius1 = canvas.width * 0.35;
const radius2 = canvas.width * 0.2;
const radiusborder = canvas.width * 0.5
const radiuscarre = canvas.width * 0.4;
const radiuscube = canvas.width * 0.25;
const radiuscenter = canvas.width * 0.075;

const sections = [
    { startAngle: -Math.PI / 20, endAngle: Math.PI / 20, value: 6 },
    { startAngle: Math.PI / 20, endAngle: 3 * Math.PI / 20, value: 10 },
    { startAngle: 3 * Math.PI / 20, endAngle: Math.PI / 4, value: 15 },
    { startAngle: Math.PI / 4, endAngle: 7 * Math.PI / 20, value: 2 },
    { startAngle: 7 * Math.PI / 20, endAngle: 9 * Math.PI / 20, value: 17 },
    { startAngle: 9 * Math.PI / 20, endAngle: 11 * Math.PI / 20, value: 3 },
    { startAngle: 11 * Math.PI / 20, endAngle: 13 * Math.PI / 20, value: 19 },
    { startAngle: 13 * Math.PI / 20, endAngle: 3 * Math.PI / 4, value: 7 },
    { startAngle: 3 * Math.PI / 4, endAngle: 17 * Math.PI / 20, value: 16 },
    { startAngle: 17 * Math.PI / 20, endAngle: 19 * Math.PI / 20, value: 8 },
    { startAngle: 19 * Math.PI / 20, endAngle: 21 * Math.PI / 20, value: 11 },
    { startAngle: 21 * Math.PI / 20, endAngle: 23 * Math.PI / 20, value: 14 },
    { startAngle: 23 * Math.PI / 20, endAngle: 5 * Math.PI / 4, value: 9 },
    { startAngle: 5 * Math.PI / 4, endAngle: 27 * Math.PI / 20, value: 12 },
    { startAngle: 27 * Math.PI / 20, endAngle: 29 * Math.PI / 20, value: 5 },
    { startAngle: 29 * Math.PI / 20, endAngle: 31 * Math.PI / 20, value: 20 },
    { startAngle: 31 * Math.PI / 20, endAngle: 33 * Math.PI / 20, value: 1 },
    { startAngle: 33 * Math.PI / 20, endAngle: 7 * Math.PI / 4, value: 18 },
    { startAngle: 7 * Math.PI / 4, endAngle: 37 * Math.PI / 20, value: 4 },
    { startAngle: 37 * Math.PI / 20, endAngle: 39 * Math.PI / 20, value: 13 },
];

function drawTarget(radius, color1, color2) {
    sections.forEach((section, index) => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, section.startAngle, section.endAngle);
        ctx.closePath();
        ctx.fillStyle = index % 2 === 1 ? color1 : color2;
        ctx.fill();
        ctx.stroke();
    });
}


function drawBorder() {
    ctx.arc(centerX, centerY, radiusborder, 0, 2 * Math.PI);
    ctx.fillStyle = "#001F20";
    ctx.fill();
    ctx.stroke();
}

function drawCenter() {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radiuscenter, 0, 2* Math.PI);
    ctx.fillStyle = '#0E670E';
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radiuscenter / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#B20000";
    ctx.fill();
    ctx.stroke();
}

function drawScoresOnBorder() {
    const borderRadius = radiusborder -50;  // Rayon de la bordure
    ctx.font = "40px Arial";  // Taille de la police
    ctx.fillStyle = "white";  // Couleur du texte

    sections.forEach((section, index) => {
        // Calculer l'angle moyen pour chaque section
        const angle = (section.startAngle + section.endAngle) / 2;
        
        // Calculer les coordonnées (x, y) pour le texte sur la bordure
        const x = centerX + borderRadius * Math.cos(angle);
        const y = centerY + borderRadius * Math.sin(angle);
        
        // Dessiner le texte pour cette section
        ctx.fillText(section.value, x -20, y+15);  // Ajuster la position du texte pour qu'il soit centré
    });
}

function drawDartboard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canevas

    drawBorder();

    const ringConfigs = [
        { radius: radiuscarre, colors: ["#B20000", "#0E670E"] },
        { radius: radius1, colors: ["#001F20", "#FAEBD7"] },
        { radius: radiuscube, colors: ["#B20000", "#0E670E"] },
        { radius: radius2, colors: ["#001F20", "#FAEBD7"] }
    ];

    ringConfigs.forEach(config => {
        drawTarget(config.radius, config.colors[0], config.colors[1]);
    });

    // Dessiner le centre et la bordure
    drawCenter();

    // Dessiner les scores sur la bordure
    drawScoresOnBorder();
}

function calculatePoints(angle, distance) {
    if (distance > radiusborder) {
        return null; // Hors cible
    } else if (distance < radiuscenter / 2) {
        return 50; // Centre rouge
    } else if (distance < radiuscenter) {
        return 25; // Anneau vert
    } else if (distance >= radiuscarre && distance < radiusborder) {
        return 0;
    } else {
        // Parcourir les sections pour trouver le secteur
        for (const section of sections) {
            if (angle >= section.startAngle && angle < section.endAngle) {
                // Vérifier si l'angle est dans la zone normale
                if (distance >= radius1 && distance < radiuscarre) {
                    return section.value * 2; // Zone double
                } else if (distance >= radius2 && distance < radiuscube) {
                    return section.value * 3; // Zone triple
                } else {
                    return section.value; // Zone normale
                }
            }
        }
    }
    return null;
}

function showHit(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();

    setTimeout(() => drawDartboard(), 200); // Redessine la cible après 200ms
}

canvas.addEventListener("click", function (event) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    const distance = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2);
    let angle = Math.atan2(mouseY - centerY, mouseX - centerX);
    
    if (angle < 0) {
        angle += 2*Math.PI;
    }

    const points = calculatePoints(angle, distance);
    updateScore(points);
    if (points !== null) {
        showHit(mouseX, mouseY);
    }
});

document.getElementById("reset-button").addEventListener("click", resetGame);
document.getElementById("undo-throw-button").addEventListener("click", undoLastThrow);


// Initialisation des variables de gestion des joueurs et des tours
let currentPlayerIndex = 0;
let currentThrows = 0;
let throwHistory = [];
let beforeturn = 0;
let scoremax = 0;
const maxThrowsPerTurn = 3;


// Passer au joueur suivant
function nextPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    beforeturn = players[currentPlayerIndex].score; // Mise à jour du score initial du joueur suivant
    currentThrows = 0; // Réinitialiser le compteur de lancers
    updatePlayersList(); // Mettre à jour l'affichage des joueurs
}


// Mettre à jour le score et gérer les tours
function updateScore(points) {
    if (points === null) return;

    const player = players[currentPlayerIndex];
    throwHistory.push({ playerIndex: currentPlayerIndex, points });

    scoremax += points;
    player.total += points;
    player.score -= points;
    player.nbrlance++;

    if (player.score === 0) {
        alert(`Félicitations, ${player.name} a gagné !`);
        showEndGameStats();
        return;
    } else if (player.score < 0) {
        alert(`${player.name} a dépassé le score autorisé.`);
        player.score = beforeturn;
        currentThrows = maxThrowsPerTurn;
        nextPlayer();
        return;
    }

    localStorage.setItem("players", JSON.stringify(players));
    currentThrows++;

    updatePlayersList();

    if (currentThrows >= maxThrowsPerTurn) {
        if (scoremax > player.max) {
            player.max = scoremax;
            scoremax = 0;
        }
        setTimeout(() => {
            nextPlayer();
        }, 2000);
    }
}


function updatePlayersList() {
    const playersListContainer = document.getElementById("players-list");

    if (!playersListContainer) {
        console.error("Erreur: L'élément #players-list n'existe pas.");
        return;
    }

    playersListContainer.innerHTML = ""; // Vider la liste avant de la remplir

    players.forEach((player, index) => {
        const isCurrentPlayer = index === currentPlayerIndex;
        const remainingThrows = isCurrentPlayer ? maxThrowsPerTurn - currentThrows : maxThrowsPerTurn;

        const playerElement = document.createElement("div");
        playerElement.textContent = `${player.name} - Score: ${player.score} | Lancers restants: ${remainingThrows}`;

        // Mettre en évidence le joueur en train de jouer
        if (isCurrentPlayer) {
            playerElement.style.background = "whitesmoke"
            playerElement.style.color = "black" 
        }

        playersListContainer.appendChild(playerElement);
    });
}

function undoLastThrow() {
    if (throwHistory.length === 0) {
        alert("Aucun lancer à annuler !");
        return;
    }

    const lastThrow = throwHistory.pop();
    const player = players[lastThrow.playerIndex];

    // Restaurer le score du joueur
    player.score += lastThrow.points;
    player.nbrlance--;
    player.total -= lastThrow.points;

    // Vérifier si l'annulation ramène à un joueur précédent
    if (currentPlayerIndex !== lastThrow.playerIndex) {
        currentPlayerIndex = lastThrow.playerIndex;
        currentThrows = maxThrowsPerTurn - 1; // Remettre à 2 lancers restants
    } else {
        currentThrows = Math.max(0, currentThrows - 1); // Éviter les valeurs négatives
    }

    // Sauvegarde et mise à jour de l'affichage
    localStorage.setItem("players", JSON.stringify(players));
    updatePlayersList();
    drawDartboard();
}



function calculateStatistics() {
    let bestSequence = { playerName: "", maxScore: 0 };
    let stats = players.map(player => {
        const average = player.total / player.nbrlance || 0; // Moyenne par lancer
        if (player.max > bestSequence.maxScore) {
            bestSequence = { playerName: player.name, maxScore: player.max };
        }
        return {
            name: player.name,
            average: average.toFixed(2),
            total: player.total,
            finalScore: player.score
        };
    });

    return { stats, bestSequence };
}


function showEndGameStats() {
    const { stats, bestSequence } = calculateStatistics();
    
    const statsContainer = document.createElement("div");
    statsContainer.id = "end-game-stats";
    statsContainer.innerHTML = `
        <h2>Statistiques de fin de jeu</h2>
        <p><strong>Meilleur enchaînement:</strong> ${bestSequence.playerName} avec ${bestSequence.maxScore} points</p>
        <table>
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Moyenne des points par lancer</th>
                    <th>Score total</th>
                    <th>Score final</th>
                </tr>
            </thead>
            <tbody>
                ${stats.map(player => `
                    <tr>
                        <td>${player.name}</td>
                        <td>${player.average}</td>
                        <td>${player.total}</td>
                        <td>${player.finalScore}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <button id="restart-game">Recommencer</button>
    `;

    document.body.appendChild(statsContainer);

    // Redémarrer le jeu
    document.getElementById("restart-game").addEventListener("click", () => {
        resetGame();
        statsContainer.remove();
    });
}


// Réinitialiser le jeu
function resetGame() {
    players.forEach(player => {
        player.score = 301; // Remettre le score de départ (ajuste selon tes règles)
        player.nbrlance = 0;
        player.max = 0;
        player.total = 0;
    });

    // Réinitialisation des variables globales
    currentPlayerIndex = 0;
    currentThrows = 0;
    throwHistory = [];  // Vider l'historique des lancers

    // Sauvegarde dans le stockage local
    localStorage.setItem("players", JSON.stringify(players));

    // Mise à jour de l'affichage
    updatePlayersList();
    drawDartboard();
}


// Ajouter les informations des joueurs et des lancers dans l'interface

const info_container = document.getElementById("info-container");


// Initialiser le jeu

updatePlayersList()
// Dessiner la cible au chargement
drawDartboard();