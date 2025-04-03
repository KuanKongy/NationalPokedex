import { useQuery } from '@tanstack/react-query';
import { Table, Spinner, Box } from '@chakra-ui/react';

const fetchMoves = async () => {
  try {
    const response = await fetch(`http://localhost:2424/project-moves`, {
      method: 'GET'
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching Move:', error);
    return [];
  }
};

const MoveTable = () => {
  const { data: moves, isLoading } = useQuery({
    queryKey: ['move'],
    queryFn: () => fetchMoves()
  });

  return (
    <Box>
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Move Name</Table.ColumnHeader>
              <Table.ColumnHeader>Move's Category</Table.ColumnHeader>
              <Table.ColumnHeader>Move's Effect</Table.ColumnHeader>
              <Table.ColumnHeader>Move's Scale</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {moves?.map((move: any) => (
              <Table.Row key={move.MOVE_NAME.trim()}>
                <Table.Cell>{move.MOVE_NAME.trim()}</Table.Cell>
                <Table.Cell>{move.MOVE_CATEGORY.trim()}</Table.Cell>
                <Table.Cell>{move.MOVE_EFFECT.trim()}</Table.Cell>
                <Table.Cell>{move.MOVE_SCALE}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
};

export default MoveTable;
