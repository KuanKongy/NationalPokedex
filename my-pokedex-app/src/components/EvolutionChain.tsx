import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Spinner, Box, Input, Button } from '@chakra-ui/react';

const EvolutionChain = () => {
    const [inputId, setInputId] = useState('');
    const [selectedId, setSelectedId] = useState<number | null>(null);


const fetchAvg = async (selectedId: number | null) => {
    try {
      if (!selectedId) return [];
      const response = await fetch(`http://localhost:2424/evolutionchain-bypokemon`, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pokedex_id: selectedId }),
        });
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching Avg:', error);
      return [];
    }
  };

  const { data: avgpokes, isLoading } = useQuery({
    queryKey: ['EvolutionChain', selectedId],
    queryFn: () => fetchAvg(selectedId),
    enabled: !!selectedId,
  });

  const handleSubmit = () => {
    if (!inputId) return;
    setSelectedId(Number(inputId));
  }

  return (
    <Box>
        <Box mb={4}>
        <Input
          placeholder="Enter Pokédex ID"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          width="200px"
          mr={2}
        />
        <Button onClick={handleSubmit} colorScheme="blue">
          Submit
        </Button>
      </Box>

      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Pokédex ID</Table.ColumnHeader>
              <Table.ColumnHeader>Pokemon Name</Table.ColumnHeader>
              <Table.ColumnHeader>Evolves From</Table.ColumnHeader>
              <Table.ColumnHeader>Evolution Requirement</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {avgpokes?.map((avgpoke: any) => (
              <Table.Row key={avgpoke.POKEDEX_ID}>
                <Table.Cell>{avgpoke.POKEDEX_ID}</Table.Cell>
                <Table.Cell>{avgpoke.POKEMON_NAME.trim()}</Table.Cell>
                <Table.Cell>{avgpoke.FROM_POKEDEX_ID}</Table.Cell>
                <Table.Cell>{avgpoke.METHOD?.trim()}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
};

export default EvolutionChain;