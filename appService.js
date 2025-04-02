const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

////////////////////////////////////////////////////////////////////////////////////////// 1. Insert

async function insertPokemon(to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name, total) {
    return await withOracleDB(async (connection) => {
        let result;
        let val;

        const checkResult = await connection.execute(
            `SELECT 1 FROM Pokemon2 WHERE hp = :hp AND attack = :attack AND defence = :defence 
            AND special_attack = :special_attack AND special_defence = :special_defence AND speed = :speed`,
            { hp, attack, defence, special_attack, special_defence, speed }
        );

        if (checkResult.rows.length === 0) {
            result = await connection.execute(
                `INSERT INTO Pokemon2 (hp, attack, defence, special_attack, special_defence, speed, total) 
                VALUES (:hp, :attack, :defence, :special_attack, :special_defence, :speed, :total)`,
                { hp, attack, defence, special_attack, special_defence, speed, total },
                { autoCommit: true }
            );
            val = result.rowsAffected && result.rowsAffected > 0;
            if (!val) {
                return val;
            }
        }

        result = await connection.execute(
            `INSERT INTO Pokemon1 (to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name) 
            VALUES (:to_pokedex_id, :pokemon_name, :hp, :attack, :defence, :special_attack, :special_defence, :speed, :from_pokedex_id, :req_name)`,
            [to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertItem(item_name, item_category, item_effect) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Item (item_name, item_category, item_effect) VALUES (:item_name, :item_category, :item_effect)`,
            [item_name, item_category, item_effect],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertTrainer(trainer_name, rank, trainer_id, region_name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Trainer (trainer_name, rank, trainer_id, region_name) VALUES (:trainer_name, :rank, :trainer_id, :region_name)`,
            [trainer_name, rank, trainer_id, region_name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertCollection(collection_name, collection_category, collection_number, trainer_id) { //collection_size
    return await withOracleDB(async (connection) => {
        let result;
        //let val;

        // const checkResult = await connection.execute(
        //     `SELECT 1 FROM Collection2 WHERE collection_category = :collection_category`,
        //     { collection_category }
        // );

        // if (checkResult.rows.length === 0) {
        //     result = await connection.execute(
        //         `INSERT INTO Collection2 (collection_category, collection_size)
        //         VALUES (:collection_category, :collection_size)`,
        //         { collection_category, collection_size },
        //         { autoCommit: true }
        //     );
        //     val = result.rowsAffected && result.rowsAffected > 0;
        //     if (!val) {
        //         return val;
        //     }
        // }

        result = await connection.execute(
            `INSERT INTO Collection1 (collection_name, collection_category, collection_number, trainer_id) 
            VALUES (:collection_name, :collection_category, :collection_number, :trainer_id)`,
            [collection_name, collection_category, collection_number, trainer_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertTrainerPokemon(pokedex_id, experience, leveling_group, pet_name, height, weight, collection_number, trainer_id, pokemon_level) {
    return await withOracleDB(async (connection) => {
        let result;
        let val;

        const checkResult = await connection.execute(
            `SELECT 1 FROM TrainerPokemon2 WHERE experience = :experience AND leveling_group = :leveling_group`,
            { experience, leveling_group }
        );

        if (checkResult.rows.length === 0) {
            result = await connection.execute(
                `INSERT INTO TrainerPokemon2 (pokemon_level, experience, leveling_group)
                VALUES (:pokemon_level, :experience, :leveling_group)`,
                { pokemon_level, experience, leveling_group },
                { autoCommit: true }
            );
            val = result.rowsAffected && result.rowsAffected > 0;
            if (!val) {
                return val;
            }
        }

        result = await connection.execute(
            `INSERT INTO TrainerPokemon1 (pokedex_id, experience, leveling_group, pet_name, height, weight, collection_number, trainer_id)
            VALUES (:pokedex_id, :experience, :leveling_group, :pet_name, :height, :weight, :collection_number, :trainer_id)`,
            [pokedex_id, experience, leveling_group, pet_name, height, weight, collection_number, trainer_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertAddTypeToPokemon(type_name, pokedex_id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO hasType(type_name, pokedex_id) VALUES (:type_name, :pokedex_id)`,
            [type_name, pokedex_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertAddMoveToPokemon(move_name, pokedex_id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO hasMove (move_name, pokedex_id) VALUES (:move_name, :pokedex_id)`,
            [move_name, pokedex_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertAddAbilityToPokemon(ability_name, pokedex_id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO ableTo (ability_name, pokedex_id) VALUES (:ability_name, :pokedex_id)`,
            [ability_name, pokedex_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertAddItemToTrainer(item_name, trainer_id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO hasItem (item_name, trainer_id) VALUES (:item_name, :trainer_id)`,
            [item_name, trainer_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

////////////////////////////////////////////////////////////////////////////////////////// 2. Update
async function updateTrainer(updates, trainer_id) {
    return await withOracleDB(async (connection) => {
        const keys = Object.keys(updates);

        if (keys.length === 0) {
            return false;
        }

        const setClause = keys.map((key, index) => `${key}=:val${index}`).join(", ");
        const bindParams = keys.reduce((params, key, index) => {
            params[`val${index}`] = updates[key];
            return params;
        }, {});

        bindParams.trainer_id = trainer_id;

        const result = await connection.execute(
            `UPDATE Trainer SET ${setClause} WHERE trainer_id=:trainer_id`,
            bindParams,
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => false);
}

async function updateCollection(updates, trainer_id, collection_number) {
    return await withOracleDB(async (connection) => {
        const keys = Object.keys(updates);

        if (keys.length === 0) {
            return false;
        }

        const setClause = keys.map((key, index) => `${key}=:val${index}`).join(", ");
        const bindParams = keys.reduce((params, key, index) => {
            params[`val${index}`] = updates[key];
            return params;
        }, {});

        bindParams.trainer_id = trainer_id;
        bindParams.collection_number = collection_number;

        const result = await connection.execute(
            `UPDATE Collection1 SET ${setClause} WHERE trainer_id=:trainer_id AND collection_number=:collection_number`,
            bindParams,
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => false);
}

async function updateTrainerPokemon(inserts, updates, pokedex_id) {
    return await withOracleDB(async (connection) => {
        const keys = Object.keys(updates);

        if (keys.length === 0) {
            return false;
        }

        const setClause = keys.map((key, index) => `${key}=:val${index}`).join(", ");
        const bindParams = keys.reduce((params, key, index) => {
            params[`val${index}`] = updates[key];
            return params;
        }, {});

        bindParams.pokedex_id = pokedex_id;

        let result;
        let val;

        if (inserts) {
            const checkResult = await connection.execute(
                `SELECT 1 FROM TrainerPokemon2 WHERE experience = :experience AND leveling_group = :leveling_group`,
                [inserts.experience, inserts.leveling_group]
            );
    
            if (checkResult.rows.length === 0) {
                result = await connection.execute(
                    `INSERT INTO TrainerPokemon2 (pokemon_level, experience, leveling_group)
                    VALUES (:pokemon_level, :experience, :leveling_group)`,
                    inserts,
                    { autoCommit: true }
                );
                val = result.rowsAffected && result.rowsAffected > 0;
                if (!val) {
                    return val;
                }
            }
        }

        result = await connection.execute(
            `UPDATE TrainerPokemon1 SET ${setClause} WHERE pokedex_id=:pokedex_id`,
            bindParams,
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => false);
}

async function updateItem(updates, item_name) {
    return await withOracleDB(async (connection) => {
        const keys = Object.keys(updates);

        if (keys.length === 0) {
            return false;
        }

        const setClause = keys.map((key, index) => `${key}=:val${index}`).join(", ");
        const bindParams = keys.reduce((params, key, index) => {
            params[`val${index}`] = updates[key];
            return params;
        }, {});

        bindParams.item_name = item_name;

        const result = await connection.execute(
            `UPDATE Item SET ${setClause} WHERE item_name=:item_name`,
            bindParams,
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => false);
}

async function updatePokemon(inserts, updates, to_pokedex_id) {
    return await withOracleDB(async (connection) => {
        const keys = Object.keys(updates);

        if (keys.length === 0) {
            return false;
        }

        const setClause = keys.map((key, index) => `${key}=:val${index}`).join(", ");
        const bindParams = keys.reduce((params, key, index) => {
            params[`val${index}`] = updates[key];
            return params;
        }, {});

        bindParams.to_pokedex_id = to_pokedex_id;

        let result;
        let val;

        if (inserts) {
            const checkResult = await connection.execute(
                `SELECT 1 FROM Pokemon2 WHERE hp = :hp AND attack = :attack AND defence = :defence 
                AND special_attack = :special_attack AND special_defence = :special_defence AND speed = :speed`,
                [ inserts.hp, inserts.attack, inserts.defence, inserts.special_attack, inserts.special_defence, inserts.speed ]
            );
    
            if (checkResult.rows.length === 0) {
                result = await connection.execute(
                    `INSERT INTO Pokemon2 (hp, attack, defence, special_attack, special_defence, speed, total) 
                    VALUES (:hp, :attack, :defence, :special_attack, :special_defence, :speed, :total)`,
                    inserts,
                    { autoCommit: true }
                );
                val = result.rowsAffected && result.rowsAffected > 0;
                if (!val) {
                    return val;
                }
            }
        }

        result = await connection.execute(
            `UPDATE Pokemon1 SET ${setClause} WHERE to_pokedex_id=:to_pokedex_id`,
            bindParams,
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => false);
}

async function updateHasItem(updates, item_name, trainer_id) {
    return await withOracleDB(async (connection) => {
        const keys = Object.keys(updates);

        if (keys.length === 0) {
            return false;
        }

        const setClause = keys.map((key, index) => `${key}=:val${index}`).join(", ");
        const bindParams = keys.reduce((params, key, index) => {
            params[`val${index}`] = updates[key];
            return params;
        }, {});

        bindParams.item_name = item_name;
        bindParams.trainer_id = trainer_id;

        const result = await connection.execute(
            `UPDATE hasItem SET ${setClause} WHERE item_name =:item_name AND trainer_id=:trainer_id`,
            bindParams,
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => false);
}

async function updateHasType(updates, type_name, pokedex_id) {
    return await withOracleDB(async (connection) => {
        const keys = Object.keys(updates);

        if (keys.length === 0) {
            return false;
        }

        const setClause = keys.map((key, index) => `${key}=:val${index}`).join(", ");
        const bindParams = keys.reduce((params, key, index) => {
            params[`val${index}`] = updates[key];
            return params;
        }, {});

        bindParams.type_name = type_name;
        bindParams.pokedex_id = pokedex_id;

        const result = await connection.execute(
            `UPDATE hasType SET ${setClause} WHERE type_name =:type_name AND pokedex_id=:pokedex_id`,
            bindParams,
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => false);
}

async function updateHasMove(updates, move_name, pokedex_id) {
    return await withOracleDB(async (connection) => {
        const keys = Object.keys(updates);

        if (keys.length === 0) {
            return false;
        }

        const setClause = keys.map((key, index) => `${key}=:val${index}`).join(", ");
        const bindParams = keys.reduce((params, key, index) => {
            params[`val${index}`] = updates[key];
            return params;
        }, {});

        bindParams.move_name = move_name;
        bindParams.pokedex_id = pokedex_id;

        const result = await connection.execute(
            `UPDATE hasMove SET ${setClause} WHERE move_name =:move_name AND pokedex_id=:pokedex_id`,
            bindParams,
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => false);
}

async function updateAbleTo(updates, ability_name, pokedex_id) {
    return await withOracleDB(async (connection) => {
        const keys = Object.keys(updates);

        if (keys.length === 0) {
            return false;
        }

        const setClause = keys.map((key, index) => `${key}=:val${index}`).join(", ");
        const bindParams = keys.reduce((params, key, index) => {
            params[`val${index}`] = updates[key];
            return params;
        }, {});

        bindParams.ability_name = ability_name;
        bindParams.pokedex_id = pokedex_id;

        const result = await connection.execute(
            `UPDATE ableTo SET ${setClause} WHERE ability_name =:ability_name AND pokedex_id=:pokedex_id`,
            bindParams,
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => false);
}

////////////////////////////////////////////////////////////////////////////////////////// 3. Delete
async function deleteTrainer(trainer_id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Trainer WHERE trainer_id = :trainer_id`,
            [trainer_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteCollection(trainer_id, collection_number) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Collection1 WHERE trainer_id = :trainer_id AND collection_number = :collection_number`,
            [trainer_id, collection_number],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteTrainerPokemon(pokedex_id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM TrainerPokemon1 WHERE pokedex_id = :pokedex_id`,
            [pokedex_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteItem(item_name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Item WHERE item_name = :item_name`,
            [item_name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteHasItem(trainer_id, item_name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM hasItem WHERE trainer_id = :trainer_id AND item_name = :item_name`,
            [trainer_id, item_name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteHasType(type_name, pokedex_id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM hasType WHERE type_name = :type_name AND pokedex_id = :pokedex_id`,
            [type_name, pokedex_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteHasMove(move_name, pokedex_id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM hasMove WHERE move_name = :move_name AND pokedex_id = :pokedex_id`,
            [move_name, pokedex_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteAbleTo(ability_name, pokedex_id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM ableTo WHERE ability_name = :ability_name AND pokedex_id = :pokedex_id`,
            [ability_name, pokedex_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

////////////////////////////////////////////////////////////////////////////////////////// 4. Selection
async function selectItem(filters) {
    return await withOracleDB(async (connection) => {
        let baseQuery = `SELECT * FROM Item WHERE `;
        let whereClauses = [];
        let bindParams = {};

        filters.forEach((filter, index) => {
            const { attribute, operator, value, logicalOp } = filter;
            const paramName = `val${index}`;
            whereClauses.push(`${attribute} ${operator} :${paramName}`);
            bindParams[paramName] = value;

            if (logicalOp && index !== filters.length - 1) {
                whereClauses.push(logicalOp);
            }
        });

        if (whereClauses.length === 0) {
            baseQuery = `SELECT * FROM Item`;
        } else {
            baseQuery += whereClauses.join(" ");
        }

        const result = await connection.execute(
            baseQuery,
            bindParams
        );
        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function selectPokemon(filters) {
    return await withOracleDB(async (connection) => {
        let baseQuery = `SELECT * FROM Pokemon WHERE `;
        let whereClauses = [];
        let bindParams = {};

        filters.forEach((filter, index) => {
            const { attribute, operator, value, logicalOp } = filter;
            const paramName = `val${index}`;
            whereClauses.push(`${attribute} ${operator} :${paramName}`);
            bindParams[paramName] = value;

            if (logicalOp && index !== filters.length - 1) {
                whereClauses.push(logicalOp);
            }
        });

        if (whereClauses.length === 0) {
            baseQuery = `SELECT * FROM Pokemon`;
        } else {
            baseQuery += whereClauses.join(" ");
        }

        const result = await connection.execute(
            baseQuery,
            bindParams
        );
        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function selectTrainerPokemon(filters) {
    return await withOracleDB(async (connection) => {
        let baseQuery = `SELECT * FROM TrainerPokemon WHERE `;
        let whereClauses = [];
        let bindParams = {};

        filters.forEach((filter, index) => {
            const { attribute, operator, value, logicalOp } = filter;
            const paramName = `val${index}`;
            whereClauses.push(`${attribute} ${operator} :${paramName}`);
            bindParams[paramName] = value;

            if (logicalOp && index !== filters.length - 1) {
                whereClauses.push(logicalOp);
            }
        });

        if (whereClauses.length === 0) {
            baseQuery = `SELECT * FROM TrainerPokemon`;
        } else {
            baseQuery += whereClauses.join(" ");
        }

        const result = await connection.execute(
            baseQuery,
            bindParams
        );
        return result.rows;
    }).catch(() => {
        return false;
    });
}



////////////////////////////////////////////////////////////////////////////////////////// 5. Projection
async function projectPokemon(selectedAttributes) {
    return await withOracleDB(async (connection) => {
        const countQuery = `SELECT COUNT(*) FROM Pokemon`;
        const countResult = await connection.execute(countQuery);
        const rowCount = countResult.rows[0][0];

        if (selectedAttributes.length === 0) {
            return Array(rowCount).fill([]);
        }

        // if (selectedAttributes.length === 0) {
        //     return [];
        // }

        const attributes = selectedAttributes.join(", ");
        const query = `SELECT ${attributes} FROM Pokemon`;

        const result = await connection.execute(query);

        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function projectItem(selectedAttributes) {
    return await withOracleDB(async (connection) => {
        const countQuery = `SELECT COUNT(*) FROM Item`;
        const countResult = await connection.execute(countQuery);
        const rowCount = countResult.rows[0][0];

        if (selectedAttributes.length === 0) {
            return Array(rowCount).fill([]);
        }

        // if (selectedAttributes.length === 0) {
        //     return [];
        // }

        const attributes = selectedAttributes.join(", ");
        const query = `SELECT ${attributes} FROM Item`;

        const result = await connection.execute(query);

        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function projectTrainerPokemon(selectedAttributes) {
    return await withOracleDB(async (connection) => {
        const countQuery = `SELECT COUNT(*) FROM TrainerPokemon`;
        const countResult = await connection.execute(countQuery);
        const rowCount = countResult.rows[0][0];

        if (selectedAttributes.length === 0) {
            return Array(rowCount).fill([]);
        }

        // if (selectedAttributes.length === 0) {
        //     return [];
        // }

        const attributes = selectedAttributes.join(", ");
        const query = `SELECT ${attributes} FROM TrainerPokemon`;

        const result = await connection.execute(query);

        return result.rows;
    }).catch(() => {
        return false;
    });
}

////////////////////////////////////////////////////////////////////////////////////////// 6. Join
async function joinRegionRoute(region_name) {
    return await withOracleDB(async (connection) => {;
        const result = await connection.execute(
            `SELECT 
                r.region_name, 
                r.region_description, 
                route.route_name, 
                route.terrain_type, 
                route.difficulty_level
            FROM Region r
            JOIN Route1 r1 ON r.region_name = r1.region_name
            JOIN Route route ON r1.route_name = route.route_name
            WHERE r.region_name = :region_name`,
            {region_name}
        );

        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function joinRouteWildPokemon(route_name) {
    return await withOracleDB(async (connection) => {;
        const result = await connection.execute(
            `SELECT 
                wpv.pokedex_id, 
                wpv.pokemon_name, 
                wpv.spawn_rate, 
                wpv.spawn_weather, 
                wpv.spawn_time,
                r.route_name,
                r.terrain_type,
                r.difficulty_level
            FROM WildPokemonView wpv
            JOIN foundAt f ON wpv.pokedex_id = f.pokedex_id
            JOIN Route r ON f.route_name = r.route_name
            WHERE r.route_name = :route_name`,
            {route_name}
        );

        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function joinTrainerItem(trainer_id) {
    return await withOracleDB(async (connection) => {;
        const result = await connection.execute(
            `SELECT 
                t.trainer_id, 
                t.trainer_name, 
                hi.item_name
            FROM Trainer t
            JOIN hasItem hi ON t.trainer_id = hi.trainer_id
            WHERE t.trainer_id = :trainer_id`,
            {trainer_id}
        );

        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function joinTrainerCollection(trainer_id) {
    return await withOracleDB(async (connection) => {;
        const result = await connection.execute(
            `SELECT 
                t.trainer_id, 
                t.trainer_name, 
                c.collection_number, 
                c.collection_name, 
                c.collection_category, 
                c.collection_size
            FROM Trainer t
            JOIN Collection c ON t.trainer_id = c.trainer_id
            WHERE t.trainer_id = :trainer_id`,
            {trainer_id}
        );

        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function joinTrainerCollection(trainer_id, collection_number) {
    return await withOracleDB(async (connection) => {;
        const result = await connection.execute(
            `SELECT 
                c.collection_number, 
                c.collection_name, 
                c.trainer_id, 
                c.collection_category, 
                c.collection_size, 
                tp.pokedex_id, 
                tp.pet_name, 
                tp.pokemon_level, 
                tp.experience
            FROM Collection c
            JOIN TrainerPokemon tp 
            ON c.trainer_id = tp.trainer_id AND c.collection_number = tp.collection_number
            WHERE c.trainer_id = :trainer_id AND c.collection_number = :collection_number`,
            {trainer_id, collection_number}
        );

        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function joinTrainerCollection(trainer_id, collection_number) {
    return await withOracleDB(async (connection) => {;
        const result = await connection.execute(
            `SELECT 
                c.collection_number, 
                c.collection_name, 
                c.trainer_id, 
                c.collection_category, 
                c.collection_size, 
                tp.pokedex_id, 
                tp.pet_name, 
                tp.pokemon_level, 
                tp.experience
            FROM Collection c
            JOIN TrainerPokemon tp 
            ON c.trainer_id = tp.trainer_id AND c.collection_number = tp.collection_number
            WHERE c.trainer_id = :trainer_id AND c.collection_number = :collection_number`,
            {trainer_id, collection_number}
        );

        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function joinPokemonType(trainer_id, collection_number) {
    return await withOracleDB(async (connection) => {;
        const result = await connection.execute(
            `SELECT 
                p.pokedex_id, 
                p.pokemon_name, 
                pt.type_name
            FROM Pokemon p
            JOIN PokemonType pt ON p.pokedex_id = pt.pokedex_id;`,
            {trainer_id, collection_number}
        );

        return result.rows;
    }).catch(() => {
        return false;
    });
}


////////////////////////////////////////////////////////////////////////////////////////// 7. Aggregation with GROUP BY

////////////////////////////////////////////////////////////////////////////////////////// 8. Aggregation with HAVING

////////////////////////////////////////////////////////////////////////////////////////// 9. Nested Aggregation with GROUP BY

////////////////////////////////////////////////////////////////////////////////////////// 10. Division


module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable, 
    insertDemotable, 
    updateNameDemotable, 
    countDemotable,
    insertPokemon,
    insertItem,
    insertTrainer,
    insertCollection,
    insertTrainerPokemon,
    insertAddTypeToPokemon,
    insertAddMoveToPokemon,
    insertAddAbilityToPokemon,
    insertAddItemToTrainer,
    updateTrainer,
    updateCollection,
    updateTrainerPokemon,
    updateItem,
    updatePokemon,
    updateHasItem,
    updateHasType,
    updateHasMove,
    updateAbleTo,
    deleteTrainer,
    deleteCollection,
    deleteTrainerPokemon,
    deleteItem,
    deleteHasItem,
    deleteHasType,
    deleteHasMove,
    deleteAbleTo,
    selectItem,
    selectPokemon,
    selectTrainerPokemon,
    projectPokemon,
    projectItem,
    projectTrainerPokemon,
    joinRouteWildPokemon
};