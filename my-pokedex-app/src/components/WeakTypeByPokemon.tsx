import { useQuery } from '@tanstack/react-query';
import { Table, Spinner, Box } from '@chakra-ui/react';

const fetchAvg = async () => {
  try {
    const response = await fetch(`http://localhost:2424/type-byweakpokemon`, {
      method: 'GET'
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching Avg:', error);
    return [];
  }
};

const WeakTypeByPokemon = () => {
  const { data: avgpokes, isLoading } = useQuery({
    queryKey: ['WeakType'],
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
              <Table.ColumnHeader>Type Name</Table.ColumnHeader>
              <Table.ColumnHeader>Average Total</Table.ColumnHeader>
              <Table.ColumnHeader>Average Number of Pokemon</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {avgpokes?.map((avgpoke: any) => (
              <Table.Row key={avgpoke.TYPE_NAME}>
                <Table.Cell>{avgpoke.TYPE_NAME.trim()}</Table.Cell>
                <Table.Cell>{avgpoke.TOTAL_AVG.toFixed(0)}</Table.Cell>
                <Table.Cell>{avgpoke.POKEMON_COUNT}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
};

export default WeakTypeByPokemon;