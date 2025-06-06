import { useQuery } from '@tanstack/react-query';
import { Table, Spinner, Box } from '@chakra-ui/react';

const fetchAvg = async () => {
  try {
    const response = await fetch(`http://localhost:2424/pokemon-byallmovecategory`, {
      method: 'GET'
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching Avg:', error);
    return [];
  }
};

const PokemonAllMoveCategory = () => {
  const { data: avgpokes, isLoading } = useQuery({
    queryKey: ['AllMove'],
    queryFn: () => fetchAvg()
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
              <Table.ColumnHeader>Pokemon Name</Table.ColumnHeader>
              <Table.ColumnHeader>Total Stats</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {avgpokes?.map((avgpoke: any) => (
              <Table.Row key={avgpoke.POKEDEX_ID}>
                <Table.Cell>{avgpoke.POKEDEX_ID}</Table.Cell>
                <Table.Cell>{avgpoke.POKEMON_NAME.trim()}</Table.Cell>
                <Table.Cell>{avgpoke.TOTAL.toFixed(0)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
};

export default PokemonAllMoveCategory;