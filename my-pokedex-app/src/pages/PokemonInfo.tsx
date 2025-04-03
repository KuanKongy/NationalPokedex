import { useState } from 'react';
import { Portal, Select, createListCollection, Container, Heading, Card } from '@chakra-ui/react';
import TypeTable from '../components/TypeTable';
import MoveTable from '../components/MoveTable';
import AbilityTable from '../components/AbilityTable';
import Sidebar from '../components/Sidebar';
import AvgPokemonPerType from '../components/AvgPokemonPerType';
import PokemonAllMoveCategory from '../components/PokemonAllMoveCategory';
import WeakTypeByPokemon from '../components/WeakTypeByPokemon';
import PokemonFewPlaces from '../components/PokemonFewPlaces';
import EvolutionChain from '../components/EvolutionChain';
import ItemTable from '../components/ItemTable';

const categories = createListCollection({
  items: [
    { label: 'Types', value: 'Type' },
    { label: 'Moves', value: 'Move' },
    { label: 'Abilities', value: 'Ability' },
    { label: 'Items', value: 'Item' },
    { label: 'Average Pokemon Stats per Type', value: 'Avg Stats' },
    { label: 'Pokemon Found in Few Places', value: 'Few Routes' },
    { label: 'Weakest Types by Total Stats', value: 'Weak Stats' },
    { label: 'Pokemon With All Move Categories', value: 'All Moves' },
    { label: 'Evolution Chain', value: 'Evolution Chain' },
  ],
});

const PokemonInfo = () => {
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['Type'])

  const renderTable = () => {
    console.log(selectedCategory);
    switch (selectedCategory[0]) {
        case 'Type':
            return <TypeTable />;
        case 'Move':
            return <MoveTable />;
        case 'Ability':
            return <AbilityTable />;
        case 'Item':
            return <ItemTable />;
        case 'Avg Stats':
            return <AvgPokemonPerType />;
        case 'Few Routes':
            return <PokemonFewPlaces />;
        case 'Weak Stats':
            return <WeakTypeByPokemon />;
        case 'All Moves':
            return <PokemonAllMoveCategory />;
        case 'Evolution Chain':
            return <EvolutionChain />;
      default:
        return null;
    }
  };

  return (
    <>
    <Sidebar />
    <Container maxW="container.md" py={8}>
      <Heading as="h1" size="xl" mb={4}>Pokémon Info</Heading>
      
      <Select.Root
        collection={categories}
        width="320px"
        value={selectedCategory}
        onValueChange={(e) => setSelectedCategory(e.value)}
        mb={6}
      >
        <Select.HiddenSelect />
        <Select.Label>Select Information</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Select Category" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {categories.items.map((category) => (
                <Select.Item item={category} key={category.value}>
                  {category.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>

      <Card.Root>
        <Card.Header>
          <Heading as="h2" size="md">{selectedCategory} Information</Heading>
        </Card.Header>
        <Card.Body>
          {renderTable()}
        </Card.Body>
      </Card.Root>
    </Container>
    </>
  );
};

export default PokemonInfo;
