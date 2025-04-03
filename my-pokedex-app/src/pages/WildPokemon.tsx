import { Box, Heading, VStack, HStack, Text} from "@chakra-ui/react";
import WildPokemonTable from "../components/WildPokemonTable";
import Sidebar from "../components/Sidebar";

const WildPokemon = () => {

  return (
    <>
    <Sidebar />
    <VStack>
      <Heading mt={10} fontSize="4xl" textAlign="left" >Pokédex App</Heading>
      <HStack w="95%">
      <Box w="100%">
        <HStack>
          <Heading>Wild Pokemon List</Heading>
        </HStack>
          <WildPokemonTable></WildPokemonTable>
      </Box>
      </HStack>
      <Box mt={8} textAlign="center" p={4} bg="gray.100" borderRadius="md">
      <Text fontSize="sm">Created by Dinh Nam Khanh Le, Jaskarandeep Sandhu, and Abigail McPhee </Text>
      </Box>
    </VStack>
    </>
  )
}

export default WildPokemon;

