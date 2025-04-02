const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});

});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({ 
            success: true,  
            count: tableCount
        });
    } else {
        res.status(500).json({ 
            success: false, 
            count: tableCount
        });
    }
});

////////////////////////////////////////////////////////////////////////////////////////// 1. Insert
router.post("/insert-pokemon", async (req, res) => {
    console.log("Inserting Pokemon...");
    const { to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name, total } = req.body;
    const insertResult = await appService.insertPokemon(to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name, total);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-item", async (req, res) => {
    console.log("Inserting Item...");
    const { item_name, item_category, item_effect } = req.body;
    const insertResult = await appService.insertItem(item_name, item_category, item_effect);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-trainer", async (req, res) => {
    console.log("Inserting Trainer...");
    const { trainer_name, rank, trainer_id, region_name } = req.body;
    const insertResult = await appService.insertTrainer(trainer_name, rank, trainer_id, region_name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-collection", async (req, res) => {
    console.log("Inserting Collection...");
    const { collection_name, collection_category, collection_number, trainer_id } = req.body; //collection_size
    const insertResult = await appService.insertCollection(collection_name, collection_category, collection_number, trainer_id); //collection_size
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-trainerpokemon", async (req, res) => {
    console.log("Inserting TrainerPokemon...");
    const { pokedex_id, experience, leveling_group, pet_name, height, weight, collection_number, trainer_id, pokemon_level } = req.body;
    const insertResult = await appService.insertTrainerPokemon(pokedex_id, experience, leveling_group, pet_name, height, weight, collection_number, trainer_id, pokemon_level);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-addtype", async (req, res) => {
    console.log("Inserting Add Type...");
    const { type_name, pokedex_id } = req.body;
    const insertResult = await appService.insertAddTypeToPokemon(type_name, pokedex_id);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-addmove", async (req, res) => {
    console.log("Inserting Add Move...");
    const { move_name, pokedex_id } = req.body;
    const insertResult = await appService.insertAddMoveToPokemon(move_name, pokedex_id);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-addability", async (req, res) => {
    console.log("Inserting Add Ability...");
    const { ability_name, pokedex_id } = req.body;
    const insertResult = await appService.insertAddAbilityToPokemon(ability_name, pokedex_id);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-additem", async (req, res) => {
    console.log("Inserting Add Item...");
    const { item_name, trainer_id } = req.body;
    const insertResult = await appService.insertAddItemToTrainer(item_name, trainer_id);;
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

////////////////////////////////////////////////////////////////////////////////////////// 2. Update
router.post("/update-dynamic-trainer", async (req, res) => {
    console.log("Updating Trainer...");
    const { updates, trainer_id } = req.body;
    const updateResult = await appService.updateTrainer(updates, trainer_id);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-dynamic-collection", async (req, res) => {
    console.log("Updating Collection...");
    const { updates, trainer_id, collection_number } = req.body;
    const updateResult = await appService.updateCollection(updates, trainer_id, collection_number);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-dynamic-trainerpokemon", async (req, res) => {
    console.log("Updating TrainerPokemon...");
    const { inserts, updates, pokedex_id } = req.body;
    const updateResult = await appService.updateTrainerPokemon(inserts, updates, pokedex_id);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-dynamic-item", async (req, res) => {
    console.log("Updating Item...");
    const { updates, item_name } = req.body;
    const updateResult = await appService.updateItem(updates, item_name);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-dynamic-pokemon", async (req, res) => {
    console.log("Updating Pokemon...");
    const { inserts, updates, to_pokedex_id } = req.body;
    const updateResult = await appService.updatePokemon(inserts, updates, to_pokedex_id);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-dynamic-hasitem", async (req, res) => {
    console.log("Updating hasItem...");
    const { updates, item_name, trainer_id } = req.body;
    const updateResult = await appService.updateHasItem(updates, item_name, trainer_id);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-dynamic-hastype", async (req, res) => {
    console.log("Updating hasType...");
    const { updates, type_name, pokedex_id } = req.body;
    const updateResult = await appService.updateHasType(updates, type_name, pokedex_id)
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-dynamic-hasmove", async (req, res) => {
    console.log("Updating hasMove...");
    const { updates, move_name, pokedex_id } = req.body;
    const updateResult = await appService.updateHasMove(updates, move_name, pokedex_id)
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-dynamic-ableto", async (req, res) => {
    console.log("Updating ableTo...");
    const { updates, ability_name, pokedex_id } = req.body;
    const updateResult = await appService.updateAbleTo(updates, ability_name, pokedex_id)
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

////////////////////////////////////////////////////////////////////////////////////////// 3. Delete
router.post("/delete-trainer", async (req, res) => {
    console.log("Deleting Trainer...");
    const { trainer_id } = req.body;
    const deleteResult = await appService.deleteTrainer(trainer_id);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/delete-collection", async (req, res) => {
    console.log("Deleting Collection...");
    const { trainer_id, collection_number } = req.body;
    const deleteResult = await appService.deleteCollection(trainer_id, collection_number);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/delete-trainerpokemon", async (req, res) => {
    console.log("Deleting TrainerPokemon...");
    const { pokedex_id } = req.body;
    const deleteResult = await appService.deleteTrainerPokemon(pokedex_id);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/delete-item", async (req, res) => {
    console.log("Deleting Item...");
    const { item_name } = req.body;
    const deleteResult = await appService.deleteItem(item_name);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/delete-hasitem", async (req, res) => {
    console.log("Deleting hasItem...");
    const { trainer_id, item_name } = req.body;
    const deleteResult = await appService.deleteHasItem(trainer_id, item_name);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/delete-hastype", async (req, res) => {
    console.log("Deleting hasType...");
    const { type_name, pokedex_id } = req.body;
    const deleteResult = await appService.deleteHasType(type_name, pokedex_id)
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/delete-hasmove", async (req, res) => {
    console.log("Deleting hasMove...");
    const { move_name, pokedex_id } = req.body;
    const deleteResult = await appService.deleteHasMove(move_name, pokedex_id);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/delete-ableto", async (req, res) => {
    console.log("Deleting ableTo...");
    const { ability_name, pokedex_id } = req.body;
    const deleteResult = await appService.deleteAbleTo(ability_name, pokedex_id);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

////////////////////////////////////////////////////////////////////////////////////////// 4. Selection
router.get("/select-filters-item", async (req, res) => {
    console.log("Selecting Item...");
    const { filters } = req.body;
    const selectResult = await appService.selectItem(filters);
    res.json({data: selectResult});
});

router.get("/select-filters-pokemon", async (req, res) => {
    console.log("Selecting Pokemon...");
    const { filters } = req.body;
    const selectResult = await appService.selectPokemon(filters);
    res.json({data: selectResult});
});

router.get("/select-filters-trainerpokemon", async (req, res) => {
    console.log("Selecting TrainerPokemon...");
    const { filters } = req.body;
    const selectResult = await appService.selectTrainerPokemon(filters);
    res.json({data: selectResult});
});

////////////////////////////////////////////////////////////////////////////////////////// 5. Projection
router.get("/project-selected-pokemon", async (req, res) => {
    console.log("Projecting Pokemon...");
    const { selectedAttributes } = req.body;
    const projectedResult = await appService.projectPokemon(selectedAttributes);
    res.json({data: projectedResult});
});

router.get("/project-selected-item", async (req, res) => {
    console.log("Projecting Item...");
    const { selectedAttributes } = req.body;
    const projectedResult = await appService.projectItem(selectedAttributes);
    res.json({data: projectedResult});
});

router.get("/project-selected-trainerpokemon", async (req, res) => {
    console.log("Projecting TrainerPokemon...");
    const { selectedAttributes } = req.body;
    const projectedResult = await appService.projectTrainerPokemon(selectedAttributes);
    res.json({data: projectedResult});
});

router.get("/project-regions", async (req, res) => {
    console.log("Projecting Regions...");
    const projectedResult = await appService.projectRegions();
    res.json({data: projectedResult});
});

router.get("/project-trainers", async (req, res) => {
    console.log("Projecting Trainers...");
    const projectedResult = await appService.projectTrainer();
    res.json({data: projectedResult});
});

router.get("/project-types", async (req, res) => {
    console.log("Projecting Types...");
    const projectedResult = await appService.projectTypes();
    res.json({data: projectedResult});
});

router.get("/project-moves", async (req, res) => {
    console.log("Projecting Moves...");
    const projectedResult = await appService.projectMoves();
    res.json({data: projectedResult});
});

router.get("/project-abilities", async (req, res) => {
    console.log("Projecting Abilities...");
    const projectedResult = await appService.projectAbilities();
    res.json({data: projectedResult});
});

////////////////////////////////////////////////////////////////////////////////////////// 6. Join
router.get("/join-region-route-byregion", async (req, res) => {
    console.log("Joining Region Route...");
    const { region_name } = req.body;
    const joinedResult = await appService.joinRegionRoute(region_name);
    res.json({data: joinedResult});
});

router.get("/join-route-wildpokemon-byroute", async (req, res) => {
    console.log("Joining Route WildPokemon...");
    const { route_name } = req.body;
    const joinedResult = await appService.joinRouteWildPokemon(route_name);
    res.json({data: joinedResult});
});

router.get("/join-trainer-item-bytrainer", async (req, res) => {
    console.log("Joining Trainer Item...");
    const { trainer_id } = req.body;
    const joinedResult = await appService.joinTrainerItem(trainer_id);
    res.json({data: joinedResult});
});

router.get("/join-trainer-collection-bytrainer", async (req, res) => {
    console.log("Joining Route Collection...");
    const { trainer_id } = req.body;
    const joinedResult = await appService.joinTrainerCollection(trainer_id);
    res.json({data: joinedResult});
});

router.get("/join-collection-trainerpokemon-bycollection", async (req, res) => {
    console.log("Joining Collection TrainerPokemon...");
    const { trainer_id, collection_number } = req.body;
    const joinedResult = await appService.joinCollectionTrainerPokemon(trainer_id, collection_number);
    res.json({data: joinedResult});
});

router.get("/join-pokemon-type-bypokemon", async (req, res) => {
    console.log("Joining Pokemon Type...");
    const { pokedex_id } = req.body;
    const joinedResult = await appService.joinPokemonType(pokedex_id);
    res.json({data: joinedResult});
});

router.get("/join-pokemon-move-bypokemon", async (req, res) => {
    console.log("Joining Pokemon Move...");
    const { pokedex_id } = req.body;
    const joinedResult = await appService.joinPokemonMove(pokedex_id);
    res.json({data: joinedResult});
});

router.get("/join-pokemon-ability-bypokemon", async (req, res) => {
    console.log("Joining Pokemon Ability...");
    const { pokedex_id } = req.body;
    const joinedResult = await appService.joinPokemonAbility(pokedex_id);
    res.json({data: joinedResult});
});

router.get("/evolutionchain-bypokemon", async (req, res) => {
    console.log("Evolution Chain...");
    const { pokedex_id } = req.body;
    const joinedResult = await appService.getEvolutionChain(pokedex_id);
    res.json({data: joinedResult});
});

////////////////////////////////////////////////////////////////////////////////////////// 7. Aggregation with GROUP BY
router.get("/pokemonavg-bytype", async (req, res) => {
    console.log("Pokemon Avg By Type...");
    const joinedResult = await appService.getPokemonAvgByType();
    res.json({data: joinedResult});
});

router.get("/pokemoncount-byregion", async (req, res) => {
    console.log("Pokemon Count By Region...");
    const joinedResult = await appService.getCountPokemonByRegion();
    res.json({data: joinedResult});
});

router.get("/trainercount-byregion", async (req, res) => {
    console.log("Trainer Count By Region...");
    const joinedResult = await appService.getRegionCountTrainer();
    res.json({data: joinedResult});
});

////////////////////////////////////////////////////////////////////////////////////////// 8. Aggregation with HAVING
router.get("/pokemon-byoneroute", async (req, res) => {
    console.log("Pokemon with >1 Route...");
    const joinedResult = await appService.getPokemonFoundMoreOneRoute();
    res.json({data: joinedResult});
});

router.get("/type-bythreepokemon", async (req, res) => {
    console.log("Type with >3 Pokemon...");
    const joinedResult = await appService.getTypeMoreThreePokemon();
    res.json({data: joinedResult});
});

////////////////////////////////////////////////////////////////////////////////////////// 9. Nested Aggregation with GROUP BY
router.get("/type-byweakpokemon", async (req, res) => {
    console.log("Weak Type by Total...");
    const joinedResult = await appService.getPokemonHighAvgByType();
    res.json({data: joinedResult});
});

router.get("/region-byspawnrate", async (req, res) => {
    console.log("Region by above avg spawn rate...");
    const joinedResult = await appService.getRegionCountAboveAvg();
    res.json({data: joinedResult});
});

////////////////////////////////////////////////////////////////////////////////////////// 10. Division
router.get("/trainer-byalllevelgroup", async (req, res) => {
    console.log("Trainer with all leveling group...");
    const joinedResult = await appService.getTrainerAllLevelingGroup();
    res.json({data: joinedResult});
});

router.get("/trainer-byallcollectioncategory", async (req, res) => {
    console.log("Trainer with all collection category...");
    const joinedResult = await appService.getTrainerAllCollectionCategory();
    res.json({data: joinedResult});
});

router.get("/trainer-byallitemcategory", async (req, res) => {
    console.log("Trainer with all item category...");
    const joinedResult = await appService.getTrainerAllItemCategory();
    res.json({data: joinedResult});
});

router.get("/pokemon-byallmovecategory", async (req, res) => {
    console.log("Pokemon with all move category...");
    const joinedResult = await appService.getPokemonAllMoveCategory();
    res.json({data: joinedResult});
});

module.exports = router;