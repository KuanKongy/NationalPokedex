import { useQuery } from '@tanstack/react-query';
import { Table, Spinner, Box } from '@chakra-ui/react';

const fetchAbilities = async () => {
  try {
    const response = await fetch(`http://localhost:2424/project-abilities`, {
      method: 'GET'
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching Ability:', error);
    return [];
  }
};

const AbilityTable = () => {
  const { data: abilities, isLoading } = useQuery({
    queryKey: ['ability'],
    queryFn: () => fetchAbilities()
  });

  return (
    <Box>
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Ability Name</Table.ColumnHeader>
              <Table.ColumnHeader>Ability's Effect</Table.ColumnHeader>
              <Table.ColumnHeader>Ability's Scale</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {abilities?.map((ability: any) => (
              <Table.Row key={ability.ABILITY_NAME.trim()}>
                <Table.Cell>{ability.ABILITY_NAME.trim()}</Table.Cell>
                <Table.Cell>{ability.ABILITY_EFFECT.trim()}</Table.Cell>
                <Table.Cell>{ability.ABILITY_SCALE}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
};

export default AbilityTable;
