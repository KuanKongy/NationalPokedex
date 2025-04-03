import { useQuery } from '@tanstack/react-query';
import { Table, Spinner, Box } from '@chakra-ui/react';

const fetchWildPokemon = async (routeName: string) => {
  try {
    const response = await fetch(`http://localhost:2424/join-route-wildpokemon-byroute`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ route_name: routeName }),
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

const WildPokemonTable = ({ routeName }: { routeName: string }) => {
  const { data: wildPokemon, isLoading } = useQuery({
    queryKey: ['wildPokemon', routeName],
    queryFn: () => fetchWildPokemon(routeName),
    enabled: !!routeName, // Only fetch when routeName is available
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
              <Table.ColumnHeader>Pokémon Name</Table.ColumnHeader>
              <Table.ColumnHeader>Spawn Rate</Table.ColumnHeader>
              <Table.ColumnHeader>Spawn Weather</Table.ColumnHeader>
              <Table.ColumnHeader>Spawn Time</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {wildPokemon?.map((poke: any) => (
              <Table.Row key={poke.POKEDEX_ID}>
                <Table.Cell>{poke.POKEDEX_ID}</Table.Cell>
                <Table.Cell>{poke.POKEMON_NAME.trim()}</Table.Cell>
                <Table.Cell>{poke.SPAWN_RATE}</Table.Cell>
                <Table.Cell>{poke.SPAWN_WEATHER}</Table.Cell>
                <Table.Cell>{poke.SPAWN_TIME}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
};

export default WildPokemonTable;
