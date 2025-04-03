import { Box, Input, Button, Heading, VStack, Text, HStack } from "@chakra-ui/react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

const EvolutionChecker = () => {
  const [pokedexId, setPokedexId] = useState("");
  const [ancestors, setAncestors] = useState<string[]>([]);
  const [evolutions, setEvolutions] = useState<string[]>([]);

    const handleEvolutionCheck = async () => {
      try {
        const response = await fetch(`http://localhost:2424/evolutionchain-bypokemon`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "pokedex_id": pokedexId
          }),
        });
        const data = await response.json();
        setAncestors(data);
        setEvolutions(data);
      } catch (error) {
        console.error("Error fetching evolution chain:", error);
      }
    };

    const handleClear = () => {
      setPokedexId("");
      setAncestors([]);
      setEvolutions([]);
    };

  return (
    <>
    <Sidebar />
    <VStack>
      <Heading mt={10} fontSize="4xl" textAlign="left" >Pokédex App</Heading>
      <HStack w="95%">
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
      <Box mt={8} textAlign="center" p={4} bg="gray.100" borderRadius="md">
      <Text fontSize="sm">Created by Dinh Nam Khanh Le, Jaskarandeep Sandhu, and Abigail McPhee </Text>
      </Box>
    </VStack>
    </>
  )
}

export default EvolutionChecker;

