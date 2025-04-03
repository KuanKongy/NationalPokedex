import { Box, Table, Button, Heading, VStack, NativeSelect, Text, HStack, Tabs } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import TrainerPopover from "../components/TrainerPopover";
import AddTrainer from "../components/AddTrainer";
import AddItem from "../components/AddItem";
import EditItem from "../components/EditItem";
import TrainerPokemonTable from "../components/TrainerPokemonTable";
import Sidebar from "../components/Sidebar";
import AddCollection from "../components/AddCollection";
import { CollectionFormData } from "../components/AddCollection";

const TrainerProfile = () => {
  const [trainers, setTrainers] = useState<{ id: number ; name: string; region_name: string; }[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<{ id: number; name: string; region_name: string; }>();
  const [items, setItems] = useState<{ name: string; category: string; effect: string }[]>([]);
  const [collections, setCollections] = useState<{  collection_name: string; collection_category: number; collection_number: string; trainer_id: number; }[]>([]);
  const [pokemonList, setPokemonList] = useState<
    { id: number; name: string; hp: number; attack: number; defence: number; special_attack: number; special_defence: number; speed: number; total: number; from_pokemon_id: 
      number; to_pokemon_id: number; req_name: string; level: number; leveling_group: number; experience: number;
     }[]
  >([]);
  const [selectedCollection, setSelectedCollection] = useState<{  collection_name: string; collection_category: number; collection_number: string; trainer_id: number; }>();

  const fetchTrainers = async () => {
    try {
      const response = await fetch("http://localhost:2424/project-trainers", {
        method: "GET"
      });
      const data = await response.json();
      console.log(data.data);
      setTrainers(data.data);
    } catch (error) {
      console.error("Error fetching trainers:", error);
      alert("Error fetching trainers");
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);
    
  const handleUpdate = () => {
      //setAlertData({ title: "Error!", message: "The update function is not yet implemented." });
    };

    const handleAddCollection = async (data: CollectionFormData) => {
      if (!selectedTrainer) {
        console.error("select trainer");
        alert("Must select a trainer before adding a collection");
      } else {
        try {
          const response = await fetch("http://localhost:2424/insert-collection",  {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "collection_name": data.collection_name,
              "collection_category": data.collection_category,
              "collection_number": data.collection_number,
              "trainer_id": selectedTrainer.id,
            }),
        });
          if (response.status == 500) {
            alert("Collection added successfully");
          } else {
            alert("Add collection failed");
          }
        } catch (error) {
          console.error("Error deleting pokemon:", error);
          alert("Add collection caused an error");
        }

      }
  };

    const handleDeletePokemon = async (id: number) => {
        try {
          const response = await fetch("http://localhost:2424/delete-trainerpokemon",  {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              "pokedex_id": id
          })
        });
          if (response.status == 500) {
            
          } else {
            alert("Pokemon delete was unsuccessful");
          }
        } catch (error) {
          console.error("Error deleting pokemon:", error);
          alert("Pokemon delete caused an error");
        }
    };

    const handleDeleteCollection = async () => {
      if (!selectedTrainer || !selectedCollection) {
        alert("Must select both a trainer and a collection to delete a collection");
      } else {
        try {
          const response = await fetch("http://localhost:2424/delete-collection",  {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              "trainer_id": selectedTrainer.id,
              "collection_number": selectedCollection
          })
        });
          if (response.status == 500) {

          } else {
            alert("Delete collection failed");
          }
        } catch (error) {
          console.error("Error deleting collection:", error);
          alert("There was an error deleting the collection");
        }
      }

    };

    const handleDeleteTrainer = async () => {
      if (!selectedTrainer) {
        alert("Must select a trainer before attempting to delete");
      } else {
        try {
          const response = await fetch("http://localhost:2424/delete-trainer",  {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              "trainer_id": selectedTrainer.id 
            })
        });
          if (response.status == 500) {
            alert("Trainer deleted successfully!");
          } else {
            alert("Delete trainer failed");
          }
        } catch (error) {
          console.error("Error deleting trainer:", error);
          alert("There was an error when deleting trainer");
        }
      }
  };

    const handleDeleteItem = async (name: string) => {
        try {
          const response = await fetch("http://localhost:2424/delete-item",  {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              "item_name": name
            })
        });
          if (response.status == 500) {
            // !!! alert
          } else {
            alert("Delete unsuccessful");
          }
        } catch (error) {
          console.error("Error deleting item:", error);
          alert("Delete item caused an error");
        }
    };   

    useEffect(() => {
      if (!selectedTrainer) return; 
  
      const fetchItems = async () => {
        try {
          const response = await fetch(`http://localhost:2424//join-trainer-item-bytrainer`,  {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              "trainer_id": selectedTrainer.id
            })
          });
          const itemKeys = ['ITEM_NAME', 'ITEM_CATEGORY', 'ITEM_EFFECT'];
          const data = await response.json();
          console.log("gothere");
          console.log(data.data);
          const columns = Object.keys(data.data[0]).filter(col => itemKeys.includes(col));
          const results = data.data.map((row: any) => 
          Object.fromEntries(
            columns.map((col, index) => [col, row[col]]) 
          ));
          console.log(results);
          setItems(results); 
        } catch (error) {
          console.error("Error fetching items:", error);
          alert("There was an error fetching items");
        }
      };
  
      fetchItems();
    }, [selectedTrainer]);

    useEffect(() => {
      if (!selectedTrainer) return;
  
      const fetchCollections = async () => {
        try {
          const response = await fetch(`http://localhost:2424//join-trainer-collection-bytrainer`,  {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              "trainer_id": selectedTrainer.id
            })
          });
          const data = await response.json();
          const collectionKeys = ['COLLECTION_NAME', 'COLLECTION_NUMBER', 'COLLECTION_CATEGORY'];
          const columns = Object.keys(data.data[0]).filter(col => collectionKeys.includes(col));
          const results = data.data.map((row: any) => 
          Object.fromEntries(
            columns.map((col, index) => [col, row[col]]) 
          ));
          console.log(results);
          setCollections(results);
        } catch (error) {
          console.error("Error fetching collections:", error);
          alert("There was an error fetching collections");
        }
      };
  
      fetchCollections();
    }, [selectedTrainer]);

    useEffect(() => {
      if (!selectedCollection || !selectedTrainer) return;
      const fetchPokemonList = async () => {
        try {
          const response = await fetch('http://localhost:2424//join-collection-trainerpokemon-bycollection', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              "trainer_id": selectedTrainer.id, 
              "collection_number": selectedCollection.collection_number
          }),
    }); 
          const data = await response.json();
          const collectionKeys = ["POKEDEX_ID", "POKEMON_NAME", "HP", "ATTACK", "DEFENCE", "SPECIAL_ATTACK", 
            "SPECIAL_DEFENCE", "SPEED", "FROM_POKEMON_ID", "TO_POKEMON_ID", "REQUIREMENT_NAME", "LEVEL", "LEVELING_GROUP", 
            "EXPERIENCE"];
          const columns = Object.keys(data.data[0]).filter(col => collectionKeys.includes(col));
          const results = data.data.map((row: any) => 
          Object.fromEntries(
            columns.map((col, index) => [col, row[col]]) 
          ));
          console.log(results);
          setPokemonList(results);
        } catch (error) {
          console.error("Error fetching Pokémon list:", error);
          alert("There was an error fetching trainer's pokemon");
        }
      };
  
      fetchPokemonList();
    }, [selectedCollection]);

    const parseData = (data: any) => {
      console.log("Parsing data...\n");
      const columns = Object.keys(data.data[0]);
      const results = data.data.map((row: any) => 
        Object.fromEntries(
          columns.map((col, index) => [col, row[col]]) 
        )
      );
      console.log(results);
      setPokemonList(results);
    };

  return (
    <>
    <Sidebar />

    <VStack>
      <Heading mt={10} fontSize="4xl" textAlign="left" >Pokédex App</Heading>
      <Box w="95%">
        <Heading>Trainer Profile</Heading>
        <HStack>
          <HStack>
            <NativeSelect.Root>
              <NativeSelect.Field placeholder="Select Trainer" onChange={(e) => 
              { 
                //setSelectedTrainer(lookupTrainer(e.target.value)); 
                setCollections([]); 
              }}>
              {trainers.length > 0 ? (
                trainers.map((trainer: { id: number ; name: string; region_name: string; }, index: number) => (
                  <option key={index} value={trainer.name}>
                    {trainer.name}
                  </option>
                ))
              ) : (
                <option>Loading...</option>
              )}
              </NativeSelect.Field>
            </NativeSelect.Root>
            <AddCollection onSubmit={handleAddCollection} />
            <AddTrainer onSubmit={handleUpdate} />
            <TrainerPopover onSubmit={handleUpdate} />
            <Button onClick={() => handleDeleteTrainer()}>Delete Trainer</Button>
          </HStack>
        </HStack>
        <Tabs.Root lazyMount unmountOnExit defaultValue="tab-1">
          <Tabs.List>
            <Tabs.Trigger value="Collections">Collections</Tabs.Trigger>
            <Tabs.Trigger value="Inventory">Inventory</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="Inventory"> 
            <VStack>
              <HStack>
              <AddItem trainer={selectedTrainer} />
              <EditItem items={items} trainer={selectedTrainer} />
              </HStack>
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
                <NativeSelect.Field placeholder="Select Collection" mt={2} onChange={(e) => { 
                  const selectedName = e.target.value;
                  const selectedCollectionObj = collections.find(
                  (collection) => collection.collection_name === selectedName
                  );

                  if (selectedCollectionObj) {
                    setSelectedCollection(selectedCollectionObj);
                    setPokemonList([]);
                  }
                }}>
                {collections.length > 0 ? (
                  collections.map((collection, index) => (
                    <option key={index} value={collection.collection_name}>
                      {collection.collection_name}
                    </option>
                  ))
                ) : (
                  <option>No collections found</option>
                )}
                </NativeSelect.Field>
              </NativeSelect.Root>
              <Button onClick={() => handleDeleteCollection()}>Delete Collection</Button>
          </HStack>
          <TrainerPokemonTable wildPokemonList={pokemonList} handleDeletePokemon={handleDeletePokemon}></TrainerPokemonTable>
            </VStack>
          </Tabs.Content>
        </Tabs.Root>
      </Box>
      <Box mt={8} textAlign="center" p={4} bg="gray.100" borderRadius="md">
      <Text fontSize="sm">Created by Dinh Nam Khanh Le, Jaskarandeep Sandhu, and Abigail McPhee </Text>
      </Box>
    </VStack>
    </>
  )
}

export default TrainerProfile;

