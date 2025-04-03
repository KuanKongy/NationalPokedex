import { useState } from "react";
import {
  Table,
  Button,
  Checkbox,
  VStack,
  HStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  NativeSelect,
  Input,
  Text,
  Box,
  Stack,
} from "@chakra-ui/react";
import PokemonPopover from "../components/PokemonPopover";
import AddPokemon from "../components/AddPokemon";

interface Pokemon {
  id: number;
  name: string;
  hp: number;
  attack: number;
  defence: number;
  special_attack: number;
  special_defence: number;
  speed: number;
  from_pokemon_id?: number;
  to_pokemon_id?: number;
  req_name?: string;
  experience: number;
  level: number;
  leveling_group: number;
  [key: string]: string | number | undefined;
}

interface Props {
  wildPokemonList: Pokemon[];
  handleDeletePokemon: (id: number) => void;
}

interface Condition {
  attribute: string;
  operator: "=" | "!=" | ">" | "<" | ">=" | "<=";
  value: string;
  logic?: "AND" | "OR";
}

const attributes = [
  { key: "POKEMON_NAME", label: "Name" },
  { key: "POKEDEX_ID", label: "Pokédex ID" },
  { key: "HP", label: "Health Points" },
  { key: "ATTACK", label: "Attack" },
  { key: "DEFENCE", label: "Defence" },
  { key: "SPECIAL_ATTACK", label: "Special Attack" },
  { key: "SPECIAL_DEFENCE", label: "Special Defence" },
  { key: "SPEED", label: "Speed" },
  { key: "FROM_POKEMON_ID", label: "From ID" },
  { key: "TO_POKEMON_ID", label: "To ID" },
  { key: "REQ_NAME", label: "Requirement Name" },
  { key: "LEVEL", label: "Level" },
  { key: "LEVELING_GROUP", label: "Leveling Group" },
  { key: "EXPERIENCE", label: "Experience" },
];

export default function PokemonTable({ wildPokemonList, handleDeletePokemon }: Props) {
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    attributes.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
  );
  const [filteredPokemonList, setFilteredPokemonList] = useState<Pokemon[]>(wildPokemonList);
  const [conditions, setConditions] = useState<Condition[]>([
    { attribute: attributes[0].key, operator: "=", value: "", logic: "AND" }
]);

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const operators = [
    { label: "=", value: "=" },
    { label: "!=", value: "!=" },
    { label: ">", value: ">" },
    { label: "<", value: "<" },
    { label: ">=", value: ">=" },
    { label: "<=", value: "<=" },
  ];
  
  const logicalOperators = [
    { label: "AND", value: "AND" },
    { label: "OR", value: "OR" },
  ];


  const addFilter = () => {
    setConditions((prev) => {
      const newConditions: Condition[] = [...prev, { 
        attribute: attributes[0].key, 
        operator: "=" as Condition["operator"], 
        value: "", 
        logic: "AND"
      }];
      return newConditions;
    });
  };

  const handleFilterChange = (index: number, key: keyof Condition, value: string) => {
    setConditions((prev) => {
      const updatedConditions = [...prev];
      updatedConditions[index] = { ...updatedConditions[index], [key]: value };
      return updatedConditions;
    });
  };

  const applyFilters = async () => {
    if (conditions.length > 0) {
      delete conditions[conditions.length-1].logic;
    }
    console.log(conditions[0]);
    try {
        const response = await fetch('http://localhost:2424/select-filters-trainerpokemon', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "filters": conditions
      }),
      }); 
          const data = await response.json();
          console.log(data);
          setFilteredPokemonList(data);
    } catch (error) {
        console.error("Error fetching Filtered Pokémon list:", error);
        alert("There was an error fetching the filtered list");
    }
   };

   const resetFilters = () => {
    setConditions([]);
    applyFilters();
  };

  const handleUpdate = () => {
    //setAlertData({ title: "Error!", message: "The update function is not yet implemented." });
  };

  const getFilterString = (filter: Condition) => {
    const columnLabel = attributes.find(col => col.key === filter.attribute)?.label || filter.attribute;
    const operatorLabel = operators.find(op => op.value === filter.operator)?.label || filter.operator;
    const logicLabel = operators.find(op => op.value === filter.logic)?.label || filter.logic;
    return `${columnLabel} ${operatorLabel} ${filter.value} ${logicLabel}`;
  };

   return (
    <>
      <HStack> 
        <Popover.Root>
          <PopoverTrigger as="span">
            <Button size="sm">Toggle Columns</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverBody>
              <VStack align="start">
                {attributes.map(({ key, label }) => (
                  <Checkbox.Root
                  key={key}
                  checked={visibleColumns[key]}
                  onChange={() => toggleColumn(key)}
                >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                  <Checkbox.Label>{ label }</Checkbox.Label>
                </Checkbox.Root>
                ))}
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Popover.Root>
        <AddPokemon onSubmit={handleUpdate} />
        <PokemonPopover onSubmit={handleUpdate} />
        </HStack>
        
        <Stack >
        <HStack>
        <VStack align="start" >
            {conditions.map((cond, index) => (
              <HStack key={index}>
                <NativeSelect.Root>
                <NativeSelect.Field
                  value={cond.attribute}
                  onChange={(e) => handleFilterChange(index, "attribute", e.target.value)}
                >
                  {attributes.map(({ key, label }) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </NativeSelect.Field>
                </NativeSelect.Root>
                <NativeSelect.Root>
                <NativeSelect.Field
                  value={cond.operator}
                  onChange={(e) => handleFilterChange(index, "operator", e.target.value)}
                >
                  {operators.map((operator) => (
                    <option key={operator.value} value={operator.value}>{operator.label}</option>
                  ))}
                </NativeSelect.Field>
                </NativeSelect.Root>
                <Input
                  placeholder="Enter Value"
                  value={cond.value}
                  onChange={(e) => handleFilterChange(index, "value", e.target.value)}
                />
                <NativeSelect.Root>
                <NativeSelect.Field
                  value={cond.logic}
                  onChange={(e) => handleFilterChange(index, "logic", e.target.value)}
                >
                  {logicalOperators.map((operator) => (
                    <option key={operator.value} value={operator.value}>{operator.label}</option>
                  ))}
                </NativeSelect.Field>
                </NativeSelect.Root>
              </HStack>
            ))}
        </VStack>
        <Button onClick={addFilter} maxW={150}>Add Filter</Button>
        </HStack>
        <Box mb={4}>
        <Text fontSize="lg" fontWeight="bold">Currently Applied Filters:</Text>
        <Box>
          {conditions.length > 0 ? (
            conditions.map((filter, index) => (
              <Text key={index}>{getFilterString(filter)}</Text>
            ))
          ) : (
            <Text>No filters applied</Text>
          )}
        </Box>
      </Box>
      <Button onClick={resetFilters} maxW={150}>Reset Filters</Button>
      <Button onClick={applyFilters} maxW={150}>Apply Filters</Button>
      </Stack>
      
      <Table.Root borderWidth="1px" rounded="md" maxH="1000px">
        <Table.Header>
          <Table.Row bg="bg.subtle">
            {attributes.map(
              ({ key, label }) =>
                visibleColumns[key] && (
                  <Table.ColumnHeader key={key}>{label}</Table.ColumnHeader>
                )
            )}
            <Table.ColumnHeader textAlign="end">Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredPokemonList.length > 0 ? (
            filteredPokemonList.map((wild_pokemon) => (
              <Table.Row key={wild_pokemon.id}>
                {attributes.map(
                  ({ key }) =>
                    visibleColumns[key] && (
                      <Table.Cell key={key}>{wild_pokemon[key]}</Table.Cell>
                    )
                )}
                <Table.Cell textAlign="end">
                  <Button colorScheme="red" size="xs" onClick={() => handleDeletePokemon(wild_pokemon.id)}>
                    Delete
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={attributes.length + 1} textAlign="center">
                No Pokémon found
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </>
  );
}


