import { useQuery } from '@tanstack/react-query';
import { Table, Spinner, Box } from '@chakra-ui/react';

const fetchMoves = async () => {
  try {
    const response = await fetch(`http://localhost:2424/project-items`, {
      method: 'GET'
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching Move:', error);
    return [];
  }
};

const ItemTable = () => {
  const { data: moves, isLoading } = useQuery({
    queryKey: ['item'],
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
              <Table.ColumnHeader>Item Name</Table.ColumnHeader>
              <Table.ColumnHeader>Item's Category</Table.ColumnHeader>
              <Table.ColumnHeader>Item's Effect</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {moves?.map((move: any) => (
              <Table.Row key={move.ITEM_NAME.trim()}>
                <Table.Cell>{move.ITEM_NAME.trim()}</Table.Cell>
                <Table.Cell>{move.ITEM_CATEGORY.trim()}</Table.Cell>
                <Table.Cell>{move.ITEM_EFFECT.trim()}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
};

export default ItemTable;
