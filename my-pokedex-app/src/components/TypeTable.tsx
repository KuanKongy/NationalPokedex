import { useQuery } from '@tanstack/react-query';
import { Table, Spinner, Box } from '@chakra-ui/react';

const fetchTypes = async () => {
  try {
    const response = await fetch(`http://localhost:2424/project-types`, {
      method: 'GET'
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching Type:', error);
    return [];
  }
};

const TypeTable = () => {
  const { data: types, isLoading } = useQuery({
    queryKey: ['type'],
    queryFn: () => fetchTypes()
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
              <Table.ColumnHeader>Type's Weakness</Table.ColumnHeader>
              <Table.ColumnHeader>Type's Resistance</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {types?.map((type: any) => (
              <Table.Row key={type.TYPE_NAME}>
                <Table.Cell>{type.TYPE_NAME.trim()}</Table.Cell>
                <Table.Cell>{type.WEAKNESS.trim()}</Table.Cell>
                <Table.Cell>{type.RESISTANCE.trim()}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
};

export default TypeTable;
