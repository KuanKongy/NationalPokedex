# National Pokedex Database  
## Project Summary  
The main focus of the project will be describing video game characters called Pokémon through
their in-game statistics, types, moves, abilities, and evolution chains. Our database will differentiate between two categories of Pokémon, Wild Pokémon and Trainer Pokémon in which Wild Pokémon can be found in routes and regions, while Trainer Pokémon will be associated with Trainers and their collections. Trainers are video game characters that own collections of Pokémon and items that can be used on the Pokémon and both Pokémon and Trainers can be found in Routes and Regions in the world of Pokémon.  

## Additional information / Navigation  
### Deliverables from milestones 1 and 2: 
Pdf of M1 and M2 are found in info/prevMilestones/  
Current ER Diagram is found in info/pokedexER.pdf  
Current Oracle database is found in pokedexOracle.sql  

### Deliverables for milestones 3:  
Coverpage is found in info/milestone3cover.pdf  
Summary is found on top of this README.md  
Timeline and task breakdown/assignment is found in info/timeline.md  
Deliverables for milestones 1 and 2 is referred in previous part of README.md  

### Updates:
TrainerPokemon's level attribute has change its name to pokemon_level  

### Queries to test database:
SELECT * FROM Item;  
DESCRIBE Item;  
DESCRIBE hasItem;  
SELECT * FROM Trainer;  
SELECT * FROM EvolutionReq;  
SELECT * FROM Pokemon1;  
SELECT p1.to_pokedex_id, p1.pokemon_name, p1.from_pokedex_id, e.method
FROM Pokemon1 p1
LEFT JOIN EvolutionReq e ON p1.req_name = e.req_name
START WITH p1.to_pokedex_id = 4
CONNECT BY PRIOR p1.to_pokedex_id = p1.from_pokedex_id;

### AI Acknowledgement:  
We did not make use of AI for this milestone of the project.  

