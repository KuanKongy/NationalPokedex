drop table foundAt;
drop table leadsTo;
drop table hasItem;
drop table ableTo;
drop table hasMove;
drop table hasType;
drop table WildPokemon;
drop table TrainerPokemon1;
drop table TrainerPokemon2;
drop table Pokemon1;
drop table Pokemon2;
drop table Collection1;
drop table Collection2;
drop table Trainer;
drop table Route1;
drop table Route2;
drop table Region;
drop table Item;
drop table Ability1;
drop table Ability2;
drop table Move1;
drop table Move2;
drop table Type;
drop table EvolutionReq;



CREATE TABLE EvolutionReq
    (req_name VARCHAR(50) PRIMARY KEY, 
    method CHAR(50), 
    threshold INT);

CREATE TABLE Type
    (weakness VARCHAR(50), 
    resistance VARCHAR(50), 
    type_name VARCHAR(50) PRIMARY KEY);

CREATE TABLE Move2
    (move_category CHAR(10), 
    move_effect CHAR(50) PRIMARY KEY);

CREATE TABLE Move1
    (move_effect CHAR(50), 
    move_scale INT, 
    move_name VARCHAR(50) PRIMARY KEY,
    FOREIGN KEY (move_effect) REFERENCES Move2(move_effect));

CREATE TABLE Ability2
    (ability_effect VARCHAR(50) PRIMARY KEY, 
    ability_scale INT);

CREATE TABLE Ability1
    (ability_effect VARCHAR(50), 
    ability_name VARCHAR(50) PRIMARY KEY,
    FOREIGN KEY (ability_effect) REFERENCES Ability2(ability_effect));

CREATE TABLE Item
    (item_name VARCHAR(50) PRIMARY KEY, 
    item_category VARCHAR(50), 
    item_effect VARCHAR(50));

CREATE TABLE Region
    (region_name VARCHAR(50) PRIMARY KEY, 
    climate VARCHAR(50), 
    theme VARCHAR(50));

CREATE TABLE Route2
    (difficulty_level CHAR(10), 
    terrain_type VARCHAR(50) PRIMARY KEY);

CREATE TABLE Route1
    (route_name VARCHAR(50) PRIMARY KEY, 
    terrain_type VARCHAR(50),
    FOREIGN KEY (terrain_type) REFERENCES Route2(terrain_type));

CREATE TABLE Trainer
    (trainer_name VARCHAR(50), 
    rank VARCHAR(50), 
    trainer_id INT PRIMARY KEY,
    region_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (region_name) REFERENCES Region(region_name));

CREATE TABLE Collection2
    (collection_category VARCHAR(50) PRIMARY KEY, 
    collection_size INT);

CREATE TABLE Collection1
    (collection_name VARCHAR(50), 
    collection_category VARCHAR(50), 
    collection_number INT, 
    trainer_id INT,
    PRIMARY KEY (trainer_id, collection_number),
    FOREIGN KEY (collection_category) REFERENCES Collection2(collection_category),
    FOREIGN KEY (trainer_id) REFERENCES Trainer(trainer_id) ON DELETE CASCADE);

CREATE TABLE Pokemon2
    (hp INT,
    attack INT,
    defence INT, 
    special_attack INT, 
    special_defence INT, 
    speed INT,
    total INT,
    PRIMARY KEY (speed, special_attack, special_defence, defence, attack, hp));

CREATE TABLE Pokemon1
    (to_pokedex_id INT PRIMARY KEY, 
    pokemon_name CHAR(12), 
    hp INT, 
    attack INT, 
    defence INT, 
    special_attack INT, 
    special_defence INT, 
    speed INT, 
    from_pokedex_id INT,
    req_name VARCHAR(50),
    FOREIGN KEY (speed, special_attack, special_defence, defence, attack, hp) REFERENCES Pokemon2 (speed, special_attack, special_defence, defence, attack, hp),
    FOREIGN KEY (from_pokedex_id) REFERENCES Pokemon1 (to_pokedex_id),
    FOREIGN KEY (req_name) REFERENCES EvolutionReq(req_name));

CREATE TABLE TrainerPokemon2
    (pokemon_level INT, 
    experience INT, 
    leveling_group VARCHAR(50),
    PRIMARY KEY (experience, leveling_group));

CREATE TABLE TrainerPokemon1
    (pokedex_id INT PRIMARY KEY, 
    experience INT, 
    leveling_group VARCHAR(50),
    pet_name CHAR(10), 
    height FLOAT, 
    weight FLOAT,
    collection_number INT NOT NULL,
    trainer_id INT NOT NULL,
    FOREIGN KEY (experience, leveling_group) REFERENCES TrainerPokemon2 (experience, leveling_group),
    FOREIGN KEY (pokedex_id) REFERENCES Pokemon1 (to_pokedex_id),
    FOREIGN KEY (trainer_id, collection_number) REFERENCES Collection1(trainer_id, collection_number));

CREATE TABLE WildPokemon
    (pokedex_id INT PRIMARY KEY, 
    spawn_rate VARCHAR(50), 
    spawn_weather VARCHAR(50), 
    spawn_time VARCHAR(50),
    FOREIGN KEY (pokedex_id) REFERENCES Pokemon1 (to_pokedex_id));

CREATE TABLE hasType
    (type_name VARCHAR(50), 
    pokedex_id INT,
    PRIMARY KEY (type_name, pokedex_id),
    FOREIGN KEY (type_name) REFERENCES Type (type_name),
    FOREIGN KEY (pokedex_id) REFERENCES Pokemon1 (to_pokedex_id));

CREATE TABLE hasMove
    (move_name VARCHAR(50), 
    pokedex_id INT,
    PRIMARY KEY (move_name, pokedex_id),
    FOREIGN KEY (move_name) REFERENCES Move1 (move_name),
    FOREIGN KEY (pokedex_id) REFERENCES Pokemon1 (to_pokedex_id));

CREATE TABLE ableTo
    (ability_name VARCHAR(50),
    pokedex_id INT,
    PRIMARY KEY (ability_name, pokedex_id),
    FOREIGN KEY (ability_name) REFERENCES Ability1 (ability_name),
    FOREIGN KEY (pokedex_id) REFERENCES Pokemon1 (to_pokedex_id));

CREATE TABLE hasItem
    (item_name VARCHAR(50), 
    trainer_id INT,
    PRIMARY KEY (item_name, trainer_id),
    FOREIGN KEY (item_name) REFERENCES Item (item_name),
    FOREIGN KEY (trainer_id) REFERENCES Trainer (trainer_id));

CREATE TABLE leadsTo
    (region_name VARCHAR(50), 
    route_name VARCHAR(50),
    PRIMARY KEY (region_name, route_name),
    FOREIGN KEY (region_name) REFERENCES Region (region_name),
    FOREIGN KEY (route_name) REFERENCES Route1 (route_name));

CREATE TABLE foundAt
    (route_name VARCHAR(50), 
    pokedex_id INT,
    PRIMARY KEY (route_name, pokedex_id),
    FOREIGN KEY (route_name) REFERENCES Route1 (route_name),
    FOREIGN KEY (pokedex_id) REFERENCES Pokemon1 (to_pokedex_id));



INSERT INTO EvolutionReq(req_name, method, threshold) VALUES ('Level16', 'Level', 16);
INSERT INTO EvolutionReq(req_name, method, threshold) VALUES ('Level36', 'Level', 36);
INSERT INTO EvolutionReq(req_name, method, threshold) VALUES ('MegaEvolution', 'MegaStone', 1);
INSERT INTO EvolutionReq(req_name, method, threshold) VALUES ('DragonAscent', 'Move', 1);
INSERT INTO EvolutionReq(req_name, method, threshold) VALUES ('HighFriendship', 'Friendship', 220);

INSERT INTO Type(weakness, resistance, type_name) VALUES ('Water', 'Grass', 'Fire');
INSERT INTO Type(weakness, resistance, type_name) VALUES ('Electric', 'Fire', 'Water');
INSERT INTO Type(weakness, resistance, type_name) VALUES ('Fairy', 'Grass', 'Dragon');
INSERT INTO Type(weakness, resistance, type_name) VALUES ('Rock', 'Ground', 'Flying');
INSERT INTO Type(weakness, resistance, type_name) VALUES ('Bug', 'Fighting', 'Psychic');
INSERT INTO Type(weakness, resistance, type_name) VALUES ('Ground', 'Flying', 'Electric');

INSERT INTO Move2(move_category, move_effect) VALUES ('Physical', 'AttackLowerDefenses');
INSERT INTO Move2(move_category, move_effect) VALUES ('Special', 'AttackStunRecoil');
INSERT INTO Move2(move_category, move_effect) VALUES ('Special', 'SpecialAttackLowerAttack');
INSERT INTO Move2(move_category, move_effect) VALUES ('Status', 'RaiseSpecials');
INSERT INTO Move2(move_category, move_effect) VALUES ('Status', 'RaiseSpeed');
INSERT INTO Move2(move_category, move_effect) VALUES ('Physical', 'Attack');
INSERT INTO Move2(move_category, move_effect) VALUES ('Special', 'SpecialAttack');

INSERT INTO Move1(move_effect, move_scale, move_name) VALUES ('AttackLowerDefenses', 120, 'DragonAscent');
INSERT INTO Move1(move_effect, move_scale, move_name) VALUES ('AttackStunRecoil', 120, 'VoltTackle');
INSERT INTO Move1(move_effect, move_scale, move_name) VALUES ('SpecialAttackLowerAttack', 140, 'PsychoBoost');
INSERT INTO Move1(move_effect, move_scale, move_name) VALUES ('SpecialAttackLowerAttack', 150, 'BlastBurn');
INSERT INTO Move1(move_effect, move_scale, move_name) VALUES ('RaiseSpecials', 1, 'CalmMind');
INSERT INTO Move1(move_effect, move_scale, move_name) VALUES ('RaiseSpeed', 2, 'Tailwind');
INSERT INTO Move1(move_effect, move_scale, move_name) VALUES ('RaiseSpeed', 2, 'Agility');
INSERT INTO Move1(move_effect, move_scale, move_name) VALUES ('Attack', 40, 'Scratch');
INSERT INTO Move1(move_effect, move_scale, move_name) VALUES ('Attack', 90, 'AquaTail');
INSERT INTO Move1(move_effect, move_scale, move_name) VALUES ('SpecialAttack', 40, 'WaterGun');
INSERT INTO Move1(move_effect, move_scale, move_name) VALUES ('SpecialAttack', 90, 'Surf');
INSERT INTO Move1(move_effect, move_scale, move_name) VALUES ('SpecialAttack', 110, 'HydroPump');

INSERT INTO Ability2 (ability_effect, ability_scale) VALUES ('NegateWeather', 0);
INSERT INTO Ability2 (ability_effect, ability_scale) VALUES ('InPinch', 1.5);
INSERT INTO Ability2 (ability_effect, ability_scale) VALUES ('PowersUp', 1.5);
INSERT INTO Ability2 (ability_effect, ability_scale) VALUES ('NegateSleep', 0);
INSERT INTO Ability2 (ability_effect, ability_scale) VALUES ('RaiseAttack', 1);
INSERT INTO Ability2 (ability_effect, ability_scale) VALUES ('SunnyRaiseSpecialAttack', 2);
INSERT INTO Ability2 (ability_effect, ability_scale) VALUES ('DebuffEnemyPPUsage', 2);
INSERT INTO Ability2 (ability_effect, ability_scale) VALUES ('NegateFood', 0);
INSERT INTO Ability2 (ability_effect, ability_scale) VALUES ('ChanceParalyze', 30);

INSERT INTO Ability1 (ability_effect, ability_name) VALUES ('NegateWeather', 'AirLock');
INSERT INTO Ability1 (ability_effect, ability_name) VALUES ('InPinch', 'Blaze');
INSERT INTO Ability1 (ability_effect, ability_name) VALUES ('InPinch', 'Overgrow');
INSERT INTO Ability1 (ability_effect, ability_name) VALUES ('InPinch', 'Swarm');
INSERT INTO Ability1 (ability_effect, ability_name) VALUES ('InPinch', 'Torrent');
INSERT INTO Ability1 (ability_effect, ability_name) VALUES ('PowersUp', 'DragonsMaw');
INSERT INTO Ability1 (ability_effect, ability_name) VALUES ('PowersUp', 'RockyPayload');
INSERT INTO Ability1 (ability_effect, ability_name) VALUES ('PowersUp', 'Steelworker');
INSERT INTO Ability1 (ability_effect, ability_name) VALUES ('PowersUp', 'Transistor');
INSERT INTO Ability1 (ability_effect, ability_name) VALUES ('NegateSleep', 'Insomnia');
INSERT INTO Ability1 (ability_effect, ability_name) VALUES ('NegateSleep', 'SweetVeil');
INSERT INTO Ability1 (ability_effect, ability_name) VALUES ('NegateSleep', 'VitalSpirit');
INSERT INTO Ability1 (ability_effect, ability_name) VALUES ('RaiseAttack', 'HugePower');
INSERT INTO Ability1 (ability_effect, ability_name) VALUES ('RaiseAttack', 'PurePower');
INSERT INTO Ability1 (ability_effect, ability_name) VALUES ('SunnyRaiseSpecialAttack', 'SolarPower');
INSERT INTO Ability1 (ability_effect, ability_name) VALUES ('DebuffEnemyPPUsage', 'Pressure');
INSERT INTO Ability1 (ability_effect, ability_name) VALUES ('NegateFood', 'Unnerve');
INSERT INTO Ability1 (ability_effect, ability_name) VALUES ('ChanceParalyze', 'Static');
INSERT INTO Ability1 (ability_effect, ability_name) VALUES ('NegateWeather', 'CloudNine');

INSERT INTO Item (item_name, item_category, item_effect) VALUES ('CharizarditeX', 'Hold', 'MegaEvolveCharizard');
INSERT INTO Item (item_name, item_category, item_effect) VALUES ('CharizarditeY', 'Hold', 'MegaEvolveCharizard');
INSERT INTO Item (item_name, item_category, item_effect) VALUES ('RareCandy', 'Medicine', 'RaiseLevel');
INSERT INTO Item (item_name, item_category, item_effect) VALUES ('MasterBall', 'Pokeballs', 'CatchPokemonNoFail');
INSERT INTO Item (item_name, item_category, item_effect) VALUES ('FireStone', 'General', 'EvolvePokemon');
INSERT INTO Item (item_name, item_category, item_effect) VALUES ('SassyMint', 'Battle', 'ChangeStats');
INSERT INTO Item (item_name, item_category, item_effect) VALUES ('TM153', 'Machine', 'TeachBlastBurnMove');
INSERT INTO Item (item_name, item_category, item_effect) VALUES ('WikiBerry', 'Berry', 'RestoreHP');

INSERT INTO Region (region_name, climate, theme) VALUES ('Kanto', 'Temperate', 'Genetics');
INSERT INTO Region (region_name, climate, theme) VALUES ('Alola', 'Tropical', 'NaturalSelection');
INSERT INTO Region (region_name, climate, theme) VALUES ('Sinnoh', 'Cold', 'Religion');
INSERT INTO Region (region_name, climate, theme) VALUES ('Unova', 'Seasonal', 'Ethics');
INSERT INTO Region (region_name, climate, theme) VALUES ('Kalos', 'Mediterranean', 'Art');
INSERT INTO Region (region_name, climate, theme) VALUES ('Hoenn', 'Subtropical', 'Ecology');
INSERT INTO Region (region_name, climate, theme) VALUES ('Johto', 'Temperate', 'History');
INSERT INTO Region (region_name, climate, theme) VALUES ('Galar', 'Wet', 'Sports');

INSERT INTO Route2 (difficulty_level, terrain_type) VALUES ('Medium', 'Tower');
INSERT INTO Route2 (difficulty_level, terrain_type) VALUES ('Easy', 'Forest');
INSERT INTO Route2 (difficulty_level, terrain_type) VALUES ('Hard', 'UltraSpace');
INSERT INTO Route2 (difficulty_level, terrain_type) VALUES ('Very Easy', 'Grassland');
INSERT INTO Route2 (difficulty_level, terrain_type) VALUES ('Medium', 'Cave');
INSERT INTO Route2 (difficulty_level, terrain_type) VALUES ('Easy', 'CoastalCity');

INSERT INTO Route1 (route_name, terrain_type) VALUES ('SkyPillar', 'Tower');
INSERT INTO Route1 (route_name, terrain_type) VALUES ('Route2', 'Forest');
INSERT INTO Route1 (route_name, terrain_type) VALUES ('UltraSpaceWilds', 'UltraSpace');
INSERT INTO Route1 (route_name, terrain_type) VALUES ('TrophyGarden', 'Grassland');
INSERT INTO Route1 (route_name, terrain_type) VALUES ('EmbeddedTower', 'Tower');
INSERT INTO Route1 (route_name, terrain_type) VALUES ('FloccesyRanch', 'Grassland');
INSERT INTO Route1 (route_name, terrain_type) VALUES ('TerminusCave', 'Cave');
INSERT INTO Route1 (route_name, terrain_type) VALUES ('MossdeepCity', 'CoastalCity');
INSERT INTO Route1 (route_name, terrain_type) VALUES ('PalletTown', 'Forest');
INSERT INTO Route1 (route_name, terrain_type) VALUES ('LostlornForest', 'Forest');

INSERT INTO Trainer (trainer_name, rank, trainer_id, region_name) VALUES ('Ash', 'Champion', 1, 'Alola');
INSERT INTO Trainer (trainer_name, rank, trainer_id, region_name) VALUES ('Brock', 'GymLeader', 2, 'Kanto');
INSERT INTO Trainer (trainer_name, rank, trainer_id, region_name) VALUES ('Misty', 'GymLeader', 3, 'Kanto');
INSERT INTO Trainer (trainer_name, rank, trainer_id, region_name) VALUES ('Abigail', 'Rookie', 4, 'Kalos');
INSERT INTO Trainer (trainer_name, rank, trainer_id, region_name) VALUES ('Ash', 'Ace', 5, 'Kanto');
INSERT INTO Trainer (trainer_name, rank, trainer_id, region_name) VALUES ('Jas', 'Rookie', 6, 'Sinnoh');

INSERT INTO Collection2 (collection_category, collection_size) VALUES ('General', 9300);
INSERT INTO Collection2 (collection_category, collection_size) VALUES ('BattleTCG', 60);
INSERT INTO Collection2 (collection_category, collection_size) VALUES ('BattleVCG', 4);
INSERT INTO Collection2 (collection_category, collection_size) VALUES ('BattleSmogon', 6);
INSERT INTO Collection2 (collection_category, collection_size) VALUES ('BattleGO', 3);
INSERT INTO Collection2 (collection_category, collection_size) VALUES ('BattleClassic', 6);

INSERT INTO Collection1 (collection_name, collection_category, collection_number, trainer_id) VALUES ('AllPokemon', 'General', 807, 1);
INSERT INTO Collection1 (collection_name, collection_category, collection_number, trainer_id) VALUES ('AllPokemon', 'General', 151, 2);
INSERT INTO Collection1 (collection_name, collection_category, collection_number, trainer_id) VALUES ('MetaMewTwo', 'BattleTCG', 1, 4);
INSERT INTO Collection1 (collection_name, collection_category, collection_number, trainer_id) VALUES ('MetaMewTwo', 'BattleTCG', 2, 4);
INSERT INTO Collection1 (collection_name, collection_category, collection_number, trainer_id) VALUES ('SunTeamZacian', 'BattleVCG', 888, 3);
INSERT INTO Collection1 (collection_name, collection_category, collection_number, trainer_id) VALUES ('EternatusDitto', 'BattleSmogon', 890, 3);
INSERT INTO Collection1 (collection_name, collection_category, collection_number, trainer_id) VALUES ('MewTwoShadowBallspam', 'BattleGO', 150, 5);
INSERT INTO Collection1 (collection_name, collection_category, collection_number, trainer_id) VALUES ('MewTwoShadowBallspam', 'BattleClassic', 151, 5);

INSERT INTO Pokemon2 (hp, attack, defence, special_attack, special_defence, speed, total) VALUES (105, 150, 90, 150, 90, 95, 680);  
INSERT INTO Pokemon2 (hp, attack, defence, special_attack, special_defence, speed, total) VALUES (39, 52, 43, 60, 50, 65, 309);  
INSERT INTO Pokemon2 (hp, attack, defence, special_attack, special_defence, speed, total) VALUES (58, 64, 58, 80, 65, 80, 405);  
INSERT INTO Pokemon2 (hp, attack, defence, special_attack, special_defence, speed, total) VALUES (78, 84, 78, 109, 85, 100, 534);
INSERT INTO Pokemon2 (hp, attack, defence, special_attack, special_defence, speed, total) VALUES (50, 150, 50, 150, 50, 150, 600);  
INSERT INTO Pokemon2 (hp, attack, defence, special_attack, special_defence, speed, total) VALUES (20, 40, 15, 35, 35, 60, 205);  
INSERT INTO Pokemon2 (hp, attack, defence, special_attack, special_defence, speed, total) VALUES (106, 110, 90, 154, 90, 130, 680);  
INSERT INTO Pokemon2 (hp, attack, defence, special_attack, special_defence, speed, total) VALUES (50, 53, 48, 53, 48, 64, 316);  
INSERT INTO Pokemon2 (hp, attack, defence, special_attack, special_defence, speed, total) VALUES (78, 130, 111, 130, 85, 100, 634);  
INSERT INTO Pokemon2 (hp, attack, defence, special_attack, special_defence, speed, total) VALUES (78, 104, 78, 154, 115, 100, 629);  
INSERT INTO Pokemon2 (hp, attack, defence, special_attack, special_defence, speed, total) VALUES (105, 180, 100, 180, 100, 115, 780);  
INSERT INTO Pokemon2 (hp, attack, defence, special_attack, special_defence, speed, total) VALUES (320, 274, 166, 274, 166, 175, 1375);  
INSERT INTO Pokemon2 (hp, attack, defence, special_attack, special_defence, speed, total) VALUES (266, 155, 144, 200, 157, 184, 1106);  
INSERT INTO Pokemon2 (hp, attack, defence, special_attack, special_defence, speed, total) VALUES (35, 55, 40, 50, 50, 90, 320);  
INSERT INTO Pokemon2 (hp, attack, defence, special_attack, special_defence, speed, total) VALUES (50, 52, 48, 65, 50, 55, 320);  
INSERT INTO Pokemon2 (hp, attack, defence, special_attack, special_defence, speed, total) VALUES (322, 202, 166, 281, 166, 238, 1375);  
INSERT INTO Pokemon2 (hp, attack, defence, special_attack, special_defence, speed, total) VALUES (180, 103, 76, 94, 94, 166, 885);  
INSERT INTO Pokemon2 (hp, attack, defence, special_attack, special_defence, speed, total) VALUES (210, 98, 90, 121, 94, 103, 716);  

INSERT INTO Pokemon1 (to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name) VALUES (384, 'Rayquaza', 105, 150, 90, 150, 90, 95, NULL, NULL);
INSERT INTO Pokemon1 (to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name) VALUES (4, 'Charmander', 39, 52, 43, 60, 50, 65, NULL, NULL);
INSERT INTO Pokemon1 (to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name) VALUES (5, 'Charmeleon', 58, 64, 58, 80, 65, 80, 4, 'Level16');
INSERT INTO Pokemon1 (to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name) VALUES (6, 'Charizard', 78, 84, 78, 109, 85, 100, 5,  'Level36');  
INSERT INTO Pokemon1 (to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name) VALUES (386, 'Deoxys', 50, 150, 50, 150, 50, 150, NULL, NULL);
INSERT INTO Pokemon1 (to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name) VALUES (172, 'Pichu', 20, 40, 15, 35, 35, 60, NULL, NULL);
INSERT INTO Pokemon1 (to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name) VALUES (150, 'MewTwo', 106, 110, 90, 154, 90, 130, NULL, NULL);
INSERT INTO Pokemon1 (to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name) VALUES (513, 'Pansear', 50, 53, 48, 53, 48, 64, NULL, NULL);
INSERT INTO Pokemon1 (to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name) VALUES (1006, 'MCharizardX', 78, 130, 111, 130, 85, 100, 6, 'MegaEvolution');
INSERT INTO Pokemon1 (to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name) VALUES (2006, 'MCharizardY', 78, 104, 78, 154, 115, 100, 6, 'MegaEvolution');
INSERT INTO Pokemon1 (to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name) VALUES (1384, 'MRayquaza', 105, 180, 100, 180, 100, 115, 384, 'DragonAscent');
INSERT INTO Pokemon1 (to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name) VALUES (10000, 'Rayquaza', 320, 274, 166, 274, 166, 175, NULL, NULL);  
INSERT INTO Pokemon1 (to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name) VALUES (10001, 'Charizard', 266, 155, 144, 200, 157, 184, 5, 'Level36'); 
INSERT INTO Pokemon1 (to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name) VALUES (10002, 'MewTwo', 106, 110, 90, 154, 90, 130, NULL, NULL);
INSERT INTO Pokemon1 (to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name) VALUES (10003, 'Pikachu', 35, 55, 40, 50, 50, 90, 172,  'HighFriendship'); 
INSERT INTO Pokemon1 (to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name) VALUES (10004, 'Psyduck', 50, 52, 48, 65, 50, 55, NULL, NULL);
INSERT INTO Pokemon1 (to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name) VALUES (10005, 'MewTwo', 322, 202, 166, 281, 166, 238, NULL, NULL);
INSERT INTO Pokemon1 (to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name) VALUES (10006, 'Pikachu', 180, 103, 76, 94, 94, 166, 172, 'HighFriendship'); 
INSERT INTO Pokemon1 (to_pokedex_id, pokemon_name, hp, attack, defence, special_attack, special_defence, speed, from_pokedex_id, req_name) VALUES (10007, 'Psyduck', 210, 98, 90, 121, 94, 103, NULL, NULL);

INSERT INTO WildPokemon(pokedex_id, spawn_rate, spawn_weather, spawn_time) VALUES (384, 'Limited', 'Windy', 'DayNight');
INSERT INTO WildPokemon(pokedex_id, spawn_rate, spawn_weather, spawn_time) VALUES (4, 'Common', 'Sunny', 'MorningDayNight');
INSERT INTO WildPokemon(pokedex_id, spawn_rate, spawn_weather, spawn_time) VALUES (5, 'Uncommon', 'Sunny', 'MorningDayNight');
INSERT INTO WildPokemon(pokedex_id, spawn_rate, spawn_weather, spawn_time) VALUES (6, 'Rare', 'SunnyWindy', 'MorningDayNight');
INSERT INTO WildPokemon(pokedex_id, spawn_rate, spawn_weather, spawn_time) VALUES (386, 'Limited', 'Windy', 'DayNight');
INSERT INTO WildPokemon(pokedex_id, spawn_rate, spawn_weather, spawn_time) VALUES (172, 'Common', 'Rainy', 'Morning');
INSERT INTO WildPokemon(pokedex_id, spawn_rate, spawn_weather, spawn_time) VALUES (150, 'Limited', 'Windy', 'MorningDayNight');
INSERT INTO WildPokemon(pokedex_id, spawn_rate, spawn_weather, spawn_time) VALUES (513, 'Common', 'Sunny', 'MorningDayNight');
INSERT INTO WildPokemon(pokedex_id, spawn_rate, spawn_weather, spawn_time) VALUES (1006, 'Limited', 'Sunny', 'MorningDayNight');
INSERT INTO WildPokemon(pokedex_id, spawn_rate, spawn_weather, spawn_time) VALUES (2006, 'Limited', 'SunnyWindy', 'MorningDayNight');
INSERT INTO WildPokemon(pokedex_id, spawn_rate, spawn_weather, spawn_time) VALUES (1384, 'Limited', 'Windy', 'DayNight');

INSERT INTO TrainerPokemon2 (pokemon_level, experience, leveling_group) VALUES (100, 10700000, 'Slow');
INSERT INTO TrainerPokemon2 (pokemon_level, experience, leveling_group) VALUES (100, 9100000, 'MediumSlow');
INSERT INTO TrainerPokemon2 (pokemon_level, experience, leveling_group) VALUES (100, 8600000, 'MediumFast');
INSERT INTO TrainerPokemon2 (pokemon_level, experience, leveling_group) VALUES (1, 340, 'Slow');
INSERT INTO TrainerPokemon2 (pokemon_level, experience, leveling_group) VALUES (1, 112, 'MediumFast');

INSERT INTO TrainerPokemon1 (pokedex_id, experience, leveling_group, pet_name, height, weight, collection_number, trainer_id) VALUES (10000, 10700000, 'Slow', 'Beamer', 8, 300, 807, 1);
INSERT INTO TrainerPokemon1 (pokedex_id, experience, leveling_group, pet_name, height, weight, collection_number, trainer_id) VALUES (10001, 9100000, 'MediumSlow', 'Charred', 2, 90, 151, 2);
INSERT INTO TrainerPokemon1 (pokedex_id, experience, leveling_group, pet_name, height, weight, collection_number, trainer_id) VALUES (10005, 10700000, 'Slow', 'MewMew', 2, 122, 1, 4);
INSERT INTO TrainerPokemon1 (pokedex_id, experience, leveling_group, pet_name, height, weight, collection_number, trainer_id) VALUES (10006, 8600000, 'MediumFast', 'Churizard', 0.4, 6, 2, 4);
INSERT INTO TrainerPokemon1 (pokedex_id, experience, leveling_group, pet_name, height, weight, collection_number, trainer_id) VALUES (10007, 8600000, 'MediumFast', 'TheDuck', 1, 20, 888, 3);
INSERT INTO TrainerPokemon1 (pokedex_id, experience, leveling_group, pet_name, height, weight, collection_number, trainer_id) VALUES (10002, 340, 'Slow', 'MewMew', 2, 122, 890, 3);
INSERT INTO TrainerPokemon1 (pokedex_id, experience, leveling_group, pet_name, height, weight, collection_number, trainer_id) VALUES (10003, 112, 'MediumFast', 'Churizard', 0.6, 5, 150, 5);
INSERT INTO TrainerPokemon1 (pokedex_id, experience, leveling_group, pet_name, height, weight, collection_number, trainer_id) VALUES (10004, 112, 'MediumFast', 'TheDuck', 1.2, 21, 151, 5);

INSERT INTO hasType(type_name, pokedex_id) VALUES ('Fire', 4);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Fire', 5);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Fire', 6);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Fire', 513);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Fire', 1006);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Fire', 2006);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Fire', 10001);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Dragon', 384);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Dragon', 1384);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Dragon', 10000);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Flying', 6);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Flying', 384);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Flying', 1006);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Flying', 2006);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Flying', 1384);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Flying', 10000);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Flying', 10001);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Psychic', 150);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Psychic', 386);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Psychic', 10002);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Psychic', 10005);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Electric', 172);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Electric', 10003);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Electric', 10006);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Water', 10004);
INSERT INTO hasType(type_name, pokedex_id) VALUES ('Water', 10007);

INSERT INTO hasMove (move_name, pokedex_id) VALUES ('DragonAscent', 384);
INSERT INTO hasMove (move_name, pokedex_id) VALUES ('DragonAscent', 1384);
INSERT INTO hasMove (move_name, pokedex_id) VALUES ('DragonAscent', 10000);
INSERT INTO hasMove (move_name, pokedex_id) VALUES ('VoltTackle', 10003);
INSERT INTO hasMove (move_name, pokedex_id) VALUES ('VoltTackle', 10006);
INSERT INTO hasMove (move_name, pokedex_id) VALUES ('VoltTackle', 172);
INSERT INTO hasMove (move_name, pokedex_id) VALUES ('PsychoBoost', 386);
INSERT INTO hasMove (move_name, pokedex_id) VALUES ('Scratch', 4);
INSERT INTO hasMove (move_name, pokedex_id) VALUES ('Scratch', 5);
INSERT INTO hasMove (move_name, pokedex_id) VALUES ('BlastBurn', 6);
INSERT INTO hasMove (move_name, pokedex_id) VALUES ('BlastBurn', 1006);
INSERT INTO hasMove (move_name, pokedex_id) VALUES ('BlastBurn', 2006);
INSERT INTO hasMove (move_name, pokedex_id) VALUES ('BlastBurn', 10001);
INSERT INTO hasMove (move_name, pokedex_id) VALUES ('Scratch', 513);
INSERT INTO hasMove (move_name, pokedex_id) VALUES ('CalmMind', 150);
INSERT INTO hasMove (move_name, pokedex_id) VALUES ('CalmMind', 10002);
INSERT INTO hasMove (move_name, pokedex_id) VALUES ('CalmMind', 10004);
INSERT INTO hasMove (move_name, pokedex_id) VALUES ('CalmMind', 10005);
INSERT INTO hasMove (move_name, pokedex_id) VALUES ('CalmMind', 10007);
INSERT INTO hasMove (move_name, pokedex_id) VALUES ('Tailwind', 384);
INSERT INTO hasMove (move_name, pokedex_id) VALUES ('Agility', 150);
INSERT INTO hasMove (move_name, pokedex_id) VALUES ('Agility', 386);

INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('AirLock', 384);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('AirLock', 1384);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('AirLock', 10000);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('Blaze', 4);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('Blaze', 5);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('Blaze', 6);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('Blaze', 513);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('SolarPower', 4);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('SolarPower', 5);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('SolarPower', 6);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('Blaze', 1006);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('SolarPower', 1006);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('Blaze', 2006);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('SolarPower', 2006);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('Blaze', 10001);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('SolarPower', 10001);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('Pressure', 386);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('Pressure', 150);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('Unnerve', 150);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('Pressure', 10002);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('Unnerve', 10002);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('Pressure', 10005);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('Unnerve', 10005);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('Static', 172);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('Static', 10003);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('Static', 10006);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('CloudNine', 10004);
INSERT INTO ableTo (ability_name, pokedex_id) VALUES ('CloudNine', 10007);

INSERT INTO hasItem (item_name, trainer_id) VALUES ('CharizarditeX', 2);
INSERT INTO hasItem (item_name, trainer_id) VALUES ('CharizarditeY', 2);
INSERT INTO hasItem (item_name, trainer_id) VALUES ('RareCandy', 1);
INSERT INTO hasItem (item_name, trainer_id) VALUES ('MasterBall', 5);
INSERT INTO hasItem (item_name, trainer_id) VALUES ('TM153', 2);

INSERT INTO leadsTo (region_name, route_name) VALUES ('Hoenn', 'SkyPillar');
INSERT INTO leadsTo (region_name, route_name) VALUES ('Kanto', 'Route2');
INSERT INTO leadsTo (region_name, route_name) VALUES ('Johto', 'Route2');
INSERT INTO leadsTo (region_name, route_name) VALUES ('Sinnoh', 'Route2');
INSERT INTO leadsTo (region_name, route_name) VALUES ('Unova', 'Route2');
INSERT INTO leadsTo (region_name, route_name) VALUES ('Galar', 'Route2');
INSERT INTO leadsTo (region_name, route_name) VALUES ('Alola', 'UltraSpaceWilds');
INSERT INTO leadsTo (region_name, route_name) VALUES ('Sinnoh', 'TrophyGarden');
INSERT INTO leadsTo (region_name, route_name) VALUES ('Johto', 'EmbeddedTower');
INSERT INTO leadsTo (region_name, route_name) VALUES ('Unova', 'FloccesyRanch');
INSERT INTO leadsTo (region_name, route_name) VALUES ('Kalos', 'TerminusCave');
INSERT INTO leadsTo (region_name, route_name) VALUES ('Hoenn', 'MossdeepCity');
INSERT INTO leadsTo (region_name, route_name) VALUES ('Kanto', 'PalletTown');
INSERT INTO leadsTo (region_name, route_name) VALUES ('Unova', 'LostlornForest');

INSERT INTO foundAt (route_name, pokedex_id) VALUES ('SkyPillar', 384);
INSERT INTO foundAt (route_name, pokedex_id) VALUES ('EmbeddedTower', 384);
INSERT INTO foundAt (route_name, pokedex_id) VALUES ('Route2', 6);
INSERT INTO foundAt (route_name, pokedex_id) VALUES ('SkyPillar', 386);
INSERT INTO foundAt (route_name, pokedex_id) VALUES ('TrophyGarden', 172);
INSERT INTO foundAt (route_name, pokedex_id) VALUES ('UltraSpaceWilds', 150);
INSERT INTO foundAt (route_name, pokedex_id) VALUES ('PalletTown', 4);
INSERT INTO foundAt (route_name, pokedex_id) VALUES ('Route2', 5);
INSERT INTO foundAt (route_name, pokedex_id) VALUES ('LostlornForest', 513);
INSERT INTO foundAt (route_name, pokedex_id) VALUES ('Route2', 1006);
INSERT INTO foundAt (route_name, pokedex_id) VALUES ('Route2', 2006);
INSERT INTO foundAt (route_name, pokedex_id) VALUES ('SkyPillar', 1384);