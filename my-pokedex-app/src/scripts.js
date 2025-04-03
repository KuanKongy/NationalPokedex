/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    });
}

// Fetches data from the demotable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('demotable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/demotable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the demotable.
async function insertDemotable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;

    const response = await fetch('/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

// Updates names in the demotable.
async function updateNameDemotable(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}

////////////////////////////////////////////////////////////////////////////////////////// 1. Insert

// {
//     "to_pokedex_id": 123,
//     "name": "Scyther",
//     "hp": 70,
//     "attack": 110,
//     "defence": 80,
//     "special_attack": 55,
//     "special_defence": 80,
//     "speed": 105,
//     "from_pokedex_id": null,
//     "req_name": null,
//     "total": 500
// }

// {
//     "item_name": "PokeBall",
//     "item_category": "Pokeballs",
//     "item_effect": "CatchPokemon"
// }

// {
//     "trainer_name": "Nam",
//     "rank": "GymLeader",
//     "trainer_id": 7,
//     "region_name": "Kanto"
// }

// {
//     "collection_name": "Bug",
//     "collection_category": "Typed",
//     "collection_number": 123,
//     "trainer_id": 7,
//     "collection_size": 60
// }

// {
//     "pokedex_id": 123,
//     "experience": 100,
//     "leveling_group": "MediumFast",
//     "pet_name": "Scythe",
//     "height": 1.5,
//     "weight": 56,
//     "collection_number": 123,
//     "trainer_id": 7,
//     "pokemon_level": 3
// }

// {
//     "type_name": "Flying",
//     "pokedex_id": 123
// }

// {
//     "move_name": "Agility",
//     "pokedex_id": 123
// }

// {
//     "ability_name": "AirLock",
//     "pokedex_id": 123
// }

// {
//     "item_name": "PokeBall",
//     "trainer_id": 7
// }

////////////////////////////////////////////////////////////////////////////////////////// 2. Update
// {
//     "updates": { "rank": "Ace", "trainer_name": "Sai", "region_name": "Alola" },
//     "trainer_id": 7
// }

// {
//     "updates": { "collection_name": "PowerUP", "collection_category": "General" },
//     "trainer_id": 7,
//     "collection_number": 123
// }

// {
//     "inserts": {"pokemon_level": 100, "experience": 1640000, "leveling_group": "Fluctuating"},  //null works
//     "updates": { "experience": 1640000, "leveling_group": "Fluctuating", "pet_name": "Greeny", "height": 2, "weight": 60, "collection_number": 807, "trainer_id": 1 },
//     "pokedex_id": 123
// }

// {
//     "updates": { "item_category": "Pokeballs", "item_effect": "Catches" },
//     "item_name": "PokeBall"
// }

// {
//     "inserts": {"hp": 2, "attack": 2, "defence": 2, "special_attack": 2, "special_defence": 2, "speed": 2, "total": 12 },
//     "updates": { "pokemon_name": "Scyther", "hp": 2, "attack": 2, "defence": 2, "special_attack": 2, "special_defence": 2, "speed": 2, "from_pokedex_id": null, "req_name": null },
//     "to_pokedex_id": 123
// }

// {
//     "updates": { "item_name": "FireStone", "trainer_id": 4 },
//     "item_name": "CharizarditeX",
//     "trainer_id": 3
// }

// {
//     "updates": { "type_name": "Psychic", "pokedex_id": 4 },
//     "type_name": "Flying",
//     "pokedex_id": 6
// }

// {
//     "updates": { "move_name": "VoltTackle", "pokedex_id": 10007 },
//     "move_name": "DragonAscent",
//     "pokedex_id": 384
// }

// {
//     "updates": { "ability_name": "SolarPower", "pokedex_id": 10007 },
//     "ability_name": "AirLock",
//     "pokedex_id": 384
// }

////////////////////////////////////////////////////////////////////////////////////////// 3. Delete

// {
//     "trainer_id": 2
// }

// {
//     "trainer_id": 3,
//     "collection_number": 888
// }

// {
//     "pokedex_id": 10003
// }

// {
//     "item_name": "CharizarditeX"
// }

// {
//     "item_name": "CharizarditeY",
//     "trainer_id": 2
// }

// {
//     "type_name": "Fire",
//     "pokedex_id": 6
// }

// {
//     "move_name": "DragonAscent",
//     "pokedex_id": 384
// }

// {
//     "ability_name": "AirLock",
//     "pokedex_id": 384
// }

////////////////////////////////////////////////////////////////////////////////////////// 4. Selection
// {
//     "filters": [
//     { "attribute": "item_name", "operator": "LIKE", "value": "%Y%", "logicalOp": "OR" },
//     { "attribute": "item_category", "operator": "LIKE", "value": "%Poke%" }
//     ]
// }

// {
//     "filters": [
//     { "attribute": "hp", "operator": ">", "value": 50, "logicalOp": "AND" },
//     { "attribute": "level", "operator": "<=", "value": 30, "logicalOp": "OR" },
//     { "attribute": "trainer_id", "operator": "=", "value": 5 }
//     ]
// }

// {
//     "filters": [
//     { "attribute": "hp", "operator": ">", "value": 50, "logicalOp": "AND" },
//     { "attribute": "speed", "operator": "<=", "value": 30, "logicalOp": "OR" },
//     { "attribute": "pokedex_id", "operator": ">", "value": 4 }
//     ]
// }

// {
//     "filters": [
//     { "attribute": "experience", "operator": ">", "value": 50, "logicalOp": "AND" },
//     { "attribute": "pokemon_level", "operator": "<=", "value": 30, "logicalOp": "OR" },
//     { "attribute": "trainer_id", "operator": "=", "value": 5 }
//     ]
// }

////////////////////////////////////////////////////////////////////////////////////////// 5. Projection
// {
//     "selectedAttributes": ["pokedex_id", "hp"]
// }

// {
//     "selectedAttributes": ["pokedex_id", "pet_name"]
// }

// {
//     "selectedAttributes": ["item_name", "item_category"]
// }

////////////////////////////////////////////////////////////////////////////////////////// 6. Join
// {
//     "route_name": "Route2"
// }

////////////////////////////////////////////////////////////////////////////////////////// 7. Aggregation with GROUP BY

////////////////////////////////////////////////////////////////////////////////////////// 8. Aggregation with HAVING

////////////////////////////////////////////////////////////////////////////////////////// 9. Nested Aggregation with GROUP BY

/////////////////////////////////////////////////////////////////////////////////////////// 10. Division


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    document.getElementById("countDemotable").addEventListener("click", countDemotable);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}