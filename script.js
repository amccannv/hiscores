const SKILL_NAMES = [
    'Total', 'Attack', 'Defence', 'Strength', 'Constitution', 'Ranged',
    'Prayer', 'Magic', 'Cooking', 'Woodcutting', 'Fletching', 'Fishing',
    'Firemaking', 'Crafting', 'Smithing', 'Mining', 'Herblore', 'Agility',
    'Thieving', 'Slayer', 'Farming', 'Runecrafting', 'Hunter', 'Construction',
    'Summoning', 'Dungeoneering', 'Divination', 'Invention', 'Archaeology', 'Necromancy'
];

function lookupHiscores() {
    const playerName = document.getElementById('playerName').value;
    const apiUrl = `https://corsproxy.io/?https://secure.runescape.com/m=hiscore/index_lite.ws?player=${playerName}`;

    fetch(apiUrl)
        .then(handleResponse)
        .then(data => handleSuccess(data))
        .catch(error => handleFailure(error));
}

function handleResponse(response) {
    if (response.status === 404) {
        throw new Error('Player not found');
    }
    if (!response.ok) {
        throw new Error('Failed to fetch player data');
    }
    return response.text();
}

function handleSuccess(data) {
    const parsedData = parseHiscores(data);
    displayHiscores(parsedData);
}

function handleFailure(error) {
    if (error.message === 'Player not found') {
        displayErrorMessage('Player Not Found');
    } else {
        console.error('Error fetching hiscores:', error);
        displayErrorMessage('Error fetching player data');
    }
}

function parseHiscores(rawData) {
    const lines = rawData.split('\n');
    const parsedData = [];

    for (let i = 0; i < lines.length && i < SKILL_NAMES.length; i++) {
        const line = lines[i];
        const [rank, level, experience] = line.split(',');

        // Check if the line contains valid data
        if (rank !== '-1' && level !== '-1') {
            parsedData.push({
                skillName: SKILL_NAMES[i],
                rank: parseInt(rank),
                level: parseInt(level),
                experience: parseInt(experience),
            });
        }
    }

    return parsedData;
}

function displayHiscores(playerData) {
    const table = document.getElementById('hiscoresTable');
    table.innerHTML = ''; // Clear previous data

    // Create table header
    const headerRow = table.insertRow(0);
    const headerCells = ['Skill', 'Rank', 'Level', 'Experience'];
    headerCells.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    // Populate table with player data or placeholder values
    if (playerData.length === 0) {
        const row = table.insertRow(1);
        const placeholderCells = ['-', '-', '-', '-'];
        placeholderCells.forEach(cellData => {
            const td = document.createElement('td');
            td.textContent = cellData;
            row.appendChild(td);
        });
    } else {
        for (let i = 0; i < playerData.length; i++) {
            const row = table.insertRow(-1);
            const skillName = playerData[i].skillName;
            const cells = [skillName, playerData[i].rank.toLocaleString(), playerData[i].level.toLocaleString(), playerData[i].experience.toLocaleString()];
            cells.forEach(cellData => {
                const td = document.createElement('td');
                td.textContent = cellData;
                row.appendChild(td);
            });
        }
    }
}

function loadDefaultStats() {
    // Set the default player name
    document.getElementById('playerName').value = 'Lepage';

    // Trigger the lookup function
    lookupHiscores();
}
