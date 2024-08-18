const baseUrl = `http://localhost:3030/jsonstore/matches`;

const loadButton = document.getElementById('load-matches');
const addButton = document.getElementById('add-match');
const editButton = document.getElementById('edit-match');
const matchList = document.getElementById('list');
const formElement = document.querySelector('#form form');
const hostInput = document.getElementById('host');
const scoreInput = document.getElementById('score');
const guestInput = document.getElementById('guest');


matchList.addEventListener('click', function(event) {
    const target = event.target;
    if (target.classList.contains('delete-btn')) {
        const matchId = target.closest('.match').getAttribute('data-match-id');
        deleteMatch(matchId);
    } else if (target.classList.contains('change-btn')) {
        const infoDiv = target.closest('.match').querySelector('.info');
        hostInput.value = infoDiv.children[0].textContent;
        scoreInput.value = infoDiv.children[1].textContent;
        guestInput.value = infoDiv.children[2].textContent;
        formElement.setAttribute('data-match-id', target.closest('.match').getAttribute('data-match-id'));
        editButton.disabled = false;
        addButton.disabled = true;
    }
});

loadButton.addEventListener('click', loadMatches);
addButton.addEventListener('click', addMatch);
editButton.addEventListener('click', editMatch);

async function addMatch() {
    try {
        const host = hostInput.value.trim();
        const score = scoreInput.value.trim();
        const guest = guestInput.value.trim();

        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ host, score, guest }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Failed to post new match: ${errorData}`);
        }

        clearInputs();
        console.log('Match added successfully');
        await loadMatches();
    } catch (error) {
        console.error('Add match error:', error);
    }
}

async function editMatch() {
    try {
        const matchId = formElement.getAttribute('data-match-id');
        if (!matchId) {
            console.error('No match ID found for editing');
            return;
        }

        const host = hostInput.value.trim();
        const score = scoreInput.value.trim();
        const guest = guestInput.value.trim();

        const response = await fetch(`${baseUrl}/${matchId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ host, score, guest }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Failed to update match with ID ${matchId}: ${errorData}`);
        }

        clearInputs();
        console.log(`Match with ID ${matchId} edited successfully`);
        await loadMatches();
        editButton.disabled = true;
        addButton.disabled = false;
        formElement.removeAttribute('data-match-id');
    } catch (error) {
        console.error('Edit match error:', error);
    }
}

async function loadMatches() {
    try {
        const response = await fetch(baseUrl);
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Failed to fetch matches: ${errorData}`);
        }

        const matches = await response.json();
        matchList.innerHTML = '';
        Object.values(matches).forEach(match => {
            matchList.appendChild(createMatchElement(match.host, match.score, match.guest, match._id));
        });
        console.log('Matches loaded successfully');
    } catch (error) {
        console.error('Load matches error:', error);
    }
}

function clearInputs() {
    hostInput.value = '';
    scoreInput.value = '';
    guestInput.value = '';
}

function createMatchElement(host, score, guest, matchId) {
    const li = document.createElement('li');
    li.className = 'match';
    li.setAttribute('data-match-id', matchId);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'info';
    infoDiv.innerHTML = `<p>${host}</p><p>${score}</p><p>${guest}</p>`;

    const changeButton = document.createElement('button');
    changeButton.className = 'change-btn';
    changeButton.textContent = 'Change';

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'Delete';

    const btnWrapper = document.createElement('div');
    btnWrapper.className = 'btn-wrapper';
    btnWrapper.append(changeButton, deleteButton);

    li.append(infoDiv, btnWrapper);

    return li;
}


// глупака аз бях забравил да направя триенето async :DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
async function deleteMatch(matchId) {
    try {
        const response = await fetch(`${baseUrl}/${matchId}`, { method: 'DELETE' });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Failed to delete match with ID ${matchId}: ${errorData}`);
        }
        console.log(`Match with ID ${matchId} deleted successfully`);
        await loadMatches();
    } catch (error) {
        console.error('Delete match error:', error);
    }
}
