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
import TrainerPokemonCollectionTable from './TrainerPokemonCollectionTable';

interface PokemonMapProps {
    trainer_id?: string|null;
  }

const CollectionTrainerTable: React.FC<PokemonMapProps> = ({ trainer_id }) => {
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const fetchRegions = async () => {
    try {
        if (!trainer_id) return [];
      const response = await fetch(`http://localhost:2424/join-trainer-collection-bytrainer`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "trainer_id": trainer_id
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
    queryKey: ['collections', trainer_id],  // Ensures query runs when region changes
    queryFn: fetchRegions,
    enabled: !!trainer_id,  // Only fetch when region_name is defined
  });

  useEffect(() => {
    setSelectedRoute(null);
  }, [trainer_id]);

  useEffect(() => {
    if (regions && regions.length > 0 && !selectedRoute) {
        setSelectedRoute(String(regions[0].COLLECTION_NUMBER));
      console.log(String(regions[0].COLLECTION_NUMBER));
    }
  }, [regions, selectedRoute]);

  return (
    <Container maxW="container.md" py={8}>
      <Heading as="h1" size="xl" mb={2}>
        Trainer's Collection
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
            {Array.isArray(regions) && regions?.map((region: any) => (
              <Tabs.Trigger value={String(region.COLLECTION_NUMBER)}>{String(region.COLLECTION_NUMBER)}</Tabs.Trigger>
            ))}
          </Tabs.List>
          {!selectedRoute ? null : 
            <Tabs.Content value={selectedRoute}>
                <Card.Root>
                <Card.Header position='relative' justifyContent={"center"}>
                <Text textStyle="7x1" fontWeight="bold">{selectedRoute}</Text>
                </Card.Header>
                <Card.Body> 
                <TrainerPokemonCollectionTable trainer_id={Number(trainer_id)} collection_number={Number(selectedRoute)}></TrainerPokemonCollectionTable>
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

export default CollectionTrainerTable;
