import { useQuery } from '@tanstack/react-query';
import { Table, Spinner, Box } from '@chakra-ui/react';

const fetchWildPokemon = async (trainer_id: number, collection_number: number) => {
  try {
    const response = await fetch(`http://localhost:2424/join-collection-trainerpokemon-bycollection`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "trainer_id": trainer_id,
        "collection_number": collection_number
    }),
    });
    const data = await response.json();
    if (!Array.isArray(data.data)) {
        throw new Error('Invalid response format: Expected an array.');
    }
    return data.data;
  } catch (error) {
    console.error('Error fetching wild Pokémon:', error);
    return [];
  }
};

const TrainerPokemonCollectionTable = ({ trainer_id, collection_number }: { trainer_id: number, collection_number: number }) => {
  const { data: wildPokemon, isLoading } = useQuery({
    queryKey: ['wildPokemon', trainer_id, collection_number],
    queryFn: () => fetchWildPokemon(trainer_id, collection_number),
    enabled: !!trainer_id, // Only fetch when routeName is available
  });

  return (
    <Box>
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Pokédex ID</Table.ColumnHeader>
              <Table.ColumnHeader>Pet Name</Table.ColumnHeader>
              <Table.ColumnHeader>Leveel</Table.ColumnHeader>
              <Table.ColumnHeader>Experience</Table.ColumnHeader>
              <Table.ColumnHeader>Leveling group</Table.ColumnHeader>
              <Table.ColumnHeader>Height</Table.ColumnHeader>
              <Table.ColumnHeader>Weight</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {wildPokemon?.map((poke: any) => (
              <Table.Row key={poke.POKEDEX_ID}>
                <Table.Cell>{poke.POKEDEX_ID}</Table.Cell>
                <Table.Cell>{poke.PET_NAME.trim()}</Table.Cell>
                <Table.Cell>{poke.POKEMON_LEVEL}</Table.Cell>
                <Table.Cell>{poke.EXPERIENCE}</Table.Cell>
                <Table.Cell>{poke.LEVELING_GROUP.trim()}</Table.Cell>
                <Table.Cell>{poke.HEIGHT}</Table.Cell>
                <Table.Cell>{poke.WEIGHT}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
};

export default TrainerPokemonCollectionTable;
