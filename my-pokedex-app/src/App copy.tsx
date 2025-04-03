import { Box, Table, Input, Button, Heading, VStack, NativeSelect, Text, HStack, Tabs } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import TrainerPopover from "./components/TrainerPopover";
import PokemonPopover from "./components/PokemonPopover";
import AddPokemon from "./components/AddPokemon";
import AddTrainer from "./components/AddTrainer";
import AddItem from "./components/AddItem";
import WildPokemonTable from "./components/WildPokemonTable";
import TrainerPokemonTable from "./components/TrainerPokemonTable";
import CustomAlert from "./components/Alert";
//import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const PokedexApp = () => {
  const [alertData, setAlertData] = useState<{ title: string; message: string; }>();
  const [pokedexId, setPokedexId] = useState("");
  const [ancestors, setAncestors] = useState<string[]>([]);
  const [evolutions, setEvolutions] = useState<string[]>([]);
  const [trainers, setTrainers] = useState<string[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [items, setItems] = useState<{ name: string; category: string; effect: string }[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [pokemonList, setPokemonList] = useState<
    { id: number; name: string; hp: number; attack: number; defence: number; special_attack: number; special_defence: number; speed: number; from_pokemon_id: 
      number; to_pokemon_id: number; req_name: string; level: number; leveling_group: number; experience: number;
     }[]
  >([]);
  const [wildPokemonList, setWildPokemonList] = useState<
    { id: number; name: string; hp: number; attack: number; defence: number; special_attack: number; special_defence: number; speed: number; from_pokemon_id: 
      number; to_pokemon_id: number; req_name: string; spawn_rate: number; spawn_weather: string; spawn_time: number;
     }[]
  >([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [rarestPokemon, setRarestPokemon] = useState("");
  const [totalPokemon, setTotalPokemon] = useState(0);

    const handleEvolutionCheck = async () => {
      try {
        const response = await fetch(`https://your-api.com/evolutions?pokemon/${pokedexId}`); // Replace with actual API
        const data = await response.json();
        setAncestors(data);
        setEvolutions(data);
        setAlertData({ title: "Success!", message: "The evolution check was handled successfully." });
      } catch (error) {
        console.error("Error fetching Pokémon list:", error);
        setAlertData({ title: "Error!", message: "The update function is not yet implemented." });
      }
    };

    const handleClear = () => {
      setPokedexId("");
      setAncestors([]);
      setEvolutions([]);
    };

    const handleUpdated = () => {
      //setAlertData({ title: "Error!", message: "The update function is not yet implemented." });
    };

    const handleUpdate = () => {
      //setAlertData({ title: "Error!", message: "The update function is not yet implemented." });
    };

    const handleDeletePokemon = (id: number) => {
      <CustomAlert title="Error!" message="The delete pokemon function is not yet implemented." />
    };

    const handleDeleteItem = (name: string) => {
      <CustomAlert title="Error!" message="The delete item function is not yet implemented." />
    };


    useEffect(() => {
      const fetchTrainers = async () => {
        try {
          const response = await fetch("https://your-api.com/trainers"); // Replace with your actual API endpoint
          const data = await response.json();
          setTrainers(data);
        } catch (error) {
          console.error("Error fetching trainers:", error);
        }
      };

      fetchTrainers();
    }, []);

    useEffect(() => {
      if (!selectedTrainer) return; 
  
      const fetchItems = async () => {
        try {
          const response = await fetch(`https://your-api.com/items?trainer=${selectedTrainer}`); // Replace with actual API
          const data = await response.json();
          setItems(data); 
        } catch (error) {
          console.error("Error fetching items:", error);
        }
      };
  
      fetchItems();
    }, [selectedTrainer]);

    useEffect(() => {
      if (!selectedTrainer) return;
  
      const fetchCollections = async () => {
        try {
          const response = await fetch(`https://your-api.com/collections?trainer=${selectedTrainer}`); // Replace with actual API
          const data = await response.json();
          setCollections(data);
        } catch (error) {
          console.error("Error fetching collections:", error);
        }
      };
  
      fetchCollections();
    }, [selectedTrainer]);

    useEffect(() => {
      if (!selectedTrainer) return;
  
      const fetchRarestPokemon = async () => {
        try {
          const response = await fetch(`https://your-api.com/rarest?trainer=${selectedTrainer}`); // Replace with actual API
          const data = await response.json();
          setRarestPokemon(data);
        } catch (error) {
          console.error("Error fetching rarest pokemon:", error);
        }
      };
  
      fetchRarestPokemon();
    }, [selectedTrainer]);

    useEffect(() => {
      if (!selectedTrainer) return;
  
      const fetchTotalPokemon = async () => {
        try {
          const response = await fetch(`https://your-api.com/total?trainer=${selectedTrainer}`); // Replace with actual API
          const data = await response.json();
          setTotalPokemon(data);
        } catch (error) {
          console.error("Error fetching total pokemon:", error);
        }
      };
  
      fetchTotalPokemon();
    }, [selectedTrainer]);

    useEffect(() => {
      if (!selectedCollection) return;
  
      const fetchPokemonList = async () => {
        try {
          const response = await fetch(`https://your-api.com/pokemon?collection=${selectedCollection}`); // Replace with actual API
          const data = await response.json();
          setPokemonList(data);
        } catch (error) {
          console.error("Error fetching Pokémon list:", error);
        }
      };
  
      fetchPokemonList();
    }, [selectedCollection]);

    useEffect(() => {
      if (!selectedCollection) return;
  
      const fetchWildPokemonList = async () => {
        try {
          const response = await fetch(`https://your-api.com/pokemon`); // Replace with actual API
          const data = await response.json();
          setWildPokemonList(data);
        } catch (error) {
          console.error("Error fetching Pokémon list:", error);
        }
      };
  
      fetchWildPokemonList();
    }, [selectedCollection]);

  return (
    <VStack>
      <Heading mt={10} fontSize="4xl" textAlign="left" >Pokédex App</Heading>
      <HStack w="95%">
      <Box w="60%">
        <HStack>
          <Heading>Pokédex Viewer</Heading>
          <AddPokemon onSubmit={handleUpdated} />
          <PokemonPopover onSubmit={handleUpdate} />
        </HStack>
          <WildPokemonTable wildPokemonList={ wildPokemonList } handleDeletePokemon={function (id: number): void {
            throw new Error("Function not implemented.");
          } } {...handleDeletePokemon }></WildPokemonTable>
      </Box>
      
      <CustomAlert { ...alertData } />

      <Box w="50%">
        <Heading>Evolution</Heading>
          <Input placeholder="Enter Pokédex ID" value={pokedexId} onChange={(e) => setPokedexId(e.target.value)} />
          <Button mt={2} onClick={handleEvolutionCheck}>Enter</Button>
          <Button mt={2} ml={2} onClick={handleClear} colorScheme="red">Clear</Button>
          <Box mt={4}>
            <Heading size="md">Possible Ancestors</Heading>
            {ancestors.map((ancestor, index) => (
              <Box key={index}>{ancestor}</Box>
            ))}
          </Box>
          <Box mt={4}>
            <Heading size="md">Possible Evolutions</Heading>
            {evolutions.map((evolution, index) => (
              <Box key={index}>{evolution}</Box>
            ))}
          </Box>
      </Box>
      </HStack>

      <Box w="95%">
        <Heading>Trainer Profile</Heading>
        <HStack>
          <HStack>
            <NativeSelect.Root>
              <NativeSelect.Field placeholder="Select Trainer" onChange={(e) => 
              { 
                setSelectedTrainer(e.target.value); 
                setCollections([]); 
              }}>
              {trainers.length > 0 ? (
                trainers.map((trainer, index) => (
                  <option key={index} value={trainer}>
                    {trainer}
                  </option>
                ))
              ) : (
                <option>Loading...</option>
              )}
              </NativeSelect.Field>
            </NativeSelect.Root>
            <AddTrainer onSubmit={handleUpdate} />
            <TrainerPopover onSubmit={handleUpdate} />
          </HStack>
          <VStack>
            <Text> Rarest Pokémon: {rarestPokemon} </Text>
            <Text> Total Pokémon: {totalPokemon} </Text>
          </VStack>
        </HStack>
        <Tabs.Root lazyMount unmountOnExit defaultValue="tab-1">
          <Tabs.List>
            <Tabs.Trigger value="Collections">Collections</Tabs.Trigger>
            <Tabs.Trigger value="Inventory">Inventory</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="Inventory">
            <VStack>
            <AddItem onSubmit={handleUpdate} />
              <Table.ScrollArea borderWidth="1px" rounded="md" maxH="500px" w="50%">
            <Table.Root size="sm" stickyHeader>
              <Table.Header>
                <Table.Row bg="bg.subtle">
                  <Table.ColumnHeader>Item Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Type</Table.ColumnHeader>
                  <Table.ColumnHeader>Effect</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {items.map((item) => (
                  <Table.Row key={item.name}>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.category}</Table.Cell>
                    <Table.Cell textAlign="end">{item.effect}</Table.Cell>
                    <Table.Cell textAlign="end">
                      <Button colorScheme="red" size="xs" onClick={() => handleDeleteItem(item.name)}> Delete </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
            </Table.ScrollArea>
            </VStack>
          </Tabs.Content>
          <Tabs.Content value="Collections">
            <VStack>
              <HStack>
            <NativeSelect.Root>
                <NativeSelect.Field placeholder="Select Collection" mt={2} onChange={(e) => { setSelectedCollection(e.target.value); setPokemonList([]); }}>
                {collections.length > 0 ? (
                  collections.map((collection, index) => (
                    <option key={index} value={collection}>
                      {collection}
                    </option>
                  ))
                ) : (
                  <option>No collections found</option>
                )}
                </NativeSelect.Field>
              </NativeSelect.Root>
          </HStack>
          <TrainerPokemonTable wildPokemonList={pokemonList} handleDeletePokemon={function (id: number): void {
            throw new Error("Function not implemented.");
          } } {...handleDeletePokemon }></TrainerPokemonTable>
            </VStack>
          </Tabs.Content>
        </Tabs.Root>
      </Box>
      <Box mt={8} textAlign="center" p={4} bg="gray.100" borderRadius="md">
      <Text fontSize="sm">Created by Dinh Nam Khanh Le, Jaskarandeep Sandhu, and Abigail McPhee </Text>
      </Box>
    </VStack>
  )
}

export default PokedexApp;

