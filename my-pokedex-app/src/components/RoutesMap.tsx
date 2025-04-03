import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Tabs,
  Spinner,
  Heading,
  Text,
  Box,
  Container,
  Card
} from '@chakra-ui/react';
import WildPokemonTable from '../components/WildPokemonRouteTable';
import ErrorBoundary from './ErrorBoundary';

interface PokemonMapProps {
    region_name?: string;
  }

const RoutesMap: React.FC<PokemonMapProps> = ({ region_name }) => {
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const fetchRegions = async () => {
    try {
        if (!region_name) return [];
      const response = await fetch(`http://localhost:2424/join-region-route-byregion`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "region_name": region_name
          }),
        });
      const data = await response.json();
      console.log(data.data);
      return data.data;
    } catch (error) {
      console.error('Error fetching regions routes:', error);
      return [];
    }
  };

  const { data: regions, isLoading } = useQuery({
    queryKey: ['routes', region_name],  // Ensures query runs when region changes
    queryFn: fetchRegions,
    enabled: !!region_name,  // Only fetch when region_name is defined
  });

  useEffect(() => {
    setSelectedRoute(null);
  }, [region_name]);

  useEffect(() => {
    if (regions && regions.length > 0 && !selectedRoute) {
        setSelectedRoute(regions[0].ROUTE_NAME);
      console.log(regions[0].ROUTE_NAME);
    }
  }, [regions, selectedRoute]);

  return (
    <Container maxW="container.md" py={8}>
      <Heading as="h1" size="xl" mb={2}>
        Routes Map
      </Heading>
      <Text color="gray.600" mb={6}>
        
      </Text>

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <Spinner size="lg" />
        </Box>
      ) : (
        <Tabs.Root value={selectedRoute} onValueChange={(e) => 
            {
                setSelectedRoute(e.value);
            }
            }>
            <Tabs.List>
            {regions?.map((region: any) => (
              <Tabs.Trigger value={region.ROUTE_NAME}>{region.ROUTE_NAME}</Tabs.Trigger>
            ))}
          </Tabs.List>
          {!selectedRoute ? null : 
            <Tabs.Content value={selectedRoute}>
                <Card.Root>
                <Card.Header position='relative' justifyContent={"center"}>
                <Text textStyle="7x1" fontWeight="bold">{selectedRoute}</Text>
                </Card.Header>
                <Card.Body> 
                <ErrorBoundary>
                <WildPokemonTable routeName={selectedRoute}></WildPokemonTable>
                </ErrorBoundary>
                </Card.Body>
                <Card.Footer>

                </Card.Footer>
                </Card.Root>
            </Tabs.Content>
            }
        </Tabs.Root>
      )}
    </Container>
  );
};

export default RoutesMap;
