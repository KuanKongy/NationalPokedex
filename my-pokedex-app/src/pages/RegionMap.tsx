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
import RoutesMap from '../components/RoutesMap';
import Sidebar from '../components/Sidebar';

const fetchRegions = async () => {
  try {
    const response = await fetch(`http://localhost:2424/project-regions`, {
      method: 'GET',
    });
    const data = await response.json();
    console.log(data.data);
    return data.data;
  } catch (error) {
    console.error('Error fetching regions:', error);
    return [];
  }
};

const Map = () => {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  const { data: regions, isLoading } = useQuery({
    queryKey: ['regions'],
    queryFn: fetchRegions,
  });

  useEffect(() => {
    if (regions && regions.length > 0 && !selectedRegionId) {
      setSelectedRegionId(regions[0].REGION_NAME);
      console.log(regions[0].REGION_NAME);
    }
  }, [regions, selectedRegionId]);

  return (
    <>
    <Sidebar />
    <Container maxW="container.md" py={8}>
      <Heading as="h1" size="xl" mb={2}>
        Pokémon Map
      </Heading>
      <Text color="gray.600" mb={6}>
        Explore locations and discover which Pokémon can be found in different regions.
      </Text>

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <Spinner size="lg" />
        </Box>
      ) : (
        <Tabs.Root value={selectedRegionId} onValueChange={(e) => 
            {
            setSelectedRegionId(e.value);
            }
            }>
            <Tabs.List>
            {regions?.map((region: any) => (
              <Tabs.Trigger value={region.REGION_NAME}>{region.REGION_NAME}</Tabs.Trigger>
            ))}
          </Tabs.List>
          {!selectedRegionId ? null : 
            <Tabs.Content value={selectedRegionId}>
                <Card.Root>
                <Card.Header position='relative' justifyContent={"center"}>
                <Text textStyle="7x1" fontWeight="bold">{selectedRegionId} Region</Text>
                </Card.Header>
                <Card.Body> 
                    <RoutesMap region_name={selectedRegionId}></RoutesMap>
                </Card.Body>
                <Card.Footer>
                    
                </Card.Footer>
                </Card.Root>
            </Tabs.Content>
            }
        </Tabs.Root>
      )}
    </Container>
    </>
  );
};

export default Map;
