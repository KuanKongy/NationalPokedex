import { useQuery } from '@tanstack/react-query';
import { Table, Spinner, Box } from '@chakra-ui/react';

const fetchAvg = async () => {
  try {
    const response = await fetch(`http://localhost:2424/pokemonavg-bytype`, {
      method: 'GET'
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching Avg:', error);
    return [];
  }
};

const AvgPokemonPerType = () => {
  const { data: avgpokes, isLoading } = useQuery({
    queryKey: ['AvgPoke'],
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
              <Table.ColumnHeader>Average HP</Table.ColumnHeader>
              <Table.ColumnHeader>Average Attack</Table.ColumnHeader>
              <Table.ColumnHeader>Average Defence</Table.ColumnHeader>
              <Table.ColumnHeader>Average Special Attack</Table.ColumnHeader>
              <Table.ColumnHeader>Average Special Defence</Table.ColumnHeader>
              <Table.ColumnHeader>Average Speed</Table.ColumnHeader>
              <Table.ColumnHeader>Average Total</Table.ColumnHeader>
              <Table.ColumnHeader>Average Number of Pokemon</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {avgpokes?.map((avgpoke: any) => (
              <Table.Row key={avgpoke.TYPE_NAME}>
                <Table.Cell>{avgpoke.TYPE_NAME}</Table.Cell>
                <Table.Cell>{avgpoke.AVG_HP.toFixed(0)}</Table.Cell>
                <Table.Cell>{avgpoke.AVG_ATTACK.toFixed(0)}</Table.Cell>
                <Table.Cell>{avgpoke.AVG_DEFENSE.toFixed(0)}</Table.Cell>
                <Table.Cell>{avgpoke.AVG_SPECIAL_ATTACK.toFixed(0)}</Table.Cell>
                <Table.Cell>{avgpoke.AVG_SPECIAL_DEFENSE.toFixed(0)}</Table.Cell>
                <Table.Cell>{avgpoke.AVG_SPEED.toFixed(0)}</Table.Cell>
                <Table.Cell>{avgpoke.AVG_TOTAL.toFixed(0)}</Table.Cell>
                <Table.Cell>{avgpoke.NUM_POKEMON.toFixed(0)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
};

export default AvgPokemonPerType;
