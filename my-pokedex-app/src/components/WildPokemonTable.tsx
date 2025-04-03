import { useState, useEffect } from "react";
import {
  Table,
  Button,
  VStack,
  HStack,
  Box,
  NativeSelect,
  Text,
  Input,
  Stack,
} from "@chakra-ui/react";

interface Pokemon {
  id: number;
  name: string;
  hp: number;
  attack: number;
  defence: number;
  special_attack: number;
  special_defence: number;
  speed: number;
  [key: string]: string | number | undefined;
}

const attributes = [
  { key: "POKEDEX_ID", label: "Pokédex ID", attr: "pokedex_id" },
  { key: "POKEMON_NAME", label: "Name", attr: "pokemon_name" },
  { key: "HP", label: "Health Points", attr: "hp" },
  { key: "ATTACK", label: "Attack", attr: "attack" },
  { key: "DEFENCE", label: "Defence", attr: "defence" },
  { key: "SPECIAL_ATTACK", label: "Special Attack", attr: "special_attack" },
  { key: "SPECIAL_DEFENCE", label: "Special Defence", attr: "special_defence" },
  { key: "SPEED", label: "Speed", attr: "speed" },
  { key: "TOTAL", label: "Total", attr: "total" },
];

const operators = [
  { label: "=", value: "=" },
  { label: "!=", value: "!=" },
  { label: ">", value: ">" },
  { label: "<", value: "<" },
  { label: ">=", value: ">=" },
  { label: "<=", value: "<=" },
  { label: "LIKE", value: "LIKE" },
];

const logicalOperators = [
  { label: "AND", value: "AND" },
  { label: "OR", value: "OR" },
];

interface Condition {
  attribute: string;
  operator: "=" | "!=" | ">" | "<" | ">=" | "<=" | "LIKE";
  value: string;
  logicalOp?: "AND" | "OR";
}

const PokemonTable = () => {
  const [filteredPokemonList, setFilteredPokemonList] = useState<Pokemon[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([
    { attribute: attributes[0].key, operator: ">", value: "0", logicalOp: "AND" }
]);
  const [wildPokemonList, setWildPokemonList] = useState<Pokemon[]>([]);

   useEffect(() => {
      const fetchWildPokemonList = async () => {
        try {
          const response = await fetch('http://localhost:2424/project-selected-pokemon', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              "selectedAttributes": ["pokedex_id", "pokemon_name", "hp", "attack", "defence", "special_attack", "special_defence", "speed", "total" ]
          }),
    }); 
          const data = await response.json();
          console.log(data.data);
          parseData(data);
        } catch (error) {
          console.error("Error fetching Pokémon list:", error);
          alert("There was an error fetching wild pokemon");
        }
      };
  
      fetchWildPokemonList();
    }, []);

    const parseData = (data: any) => {
      console.log("Parsing data...\n");
      const columns = Object.keys(data.data[0]);
      const results = data.data.map((row: any) => 
        Object.fromEntries(
          columns.map((col) => [col, row[col]]) 
        )
      );
      console.log(results);
      setWildPokemonList(results);
    };

    const addFilter = () => {
      setConditions((prev) => {
        const newConditions: Condition[] = [...prev, { 
          attribute: attributes[0].key, 
          operator: "=" as Condition["operator"], 
          value: "", 
          logicalOp: "AND"
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
      // if (conditions.length > 0) {
      //   delete conditions[conditions.length-1].logic;
      // }
      //console.log(conditions[0]);
      try {
        console.log(JSON.stringify({
          "filters": conditions
      }));
          const response = await fetch('http://localhost:2424/select-filters-pokemon', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "filters": conditions
        }),
        }); 
            const data = await response.json();
            console.log(data.data);
            //setWildPokemonList(data.data);
            parseData(data);
      } catch (error) {
          console.error("Error fetching Filtered Pokémon list:", error);
          alert("There was an error fetching the filtered list");
      }
     };
  
    //  const resetFilters = () => {
    //   setConditions([]);
    //   applyFilters();
    // };

    const resetFilters = () => {
      setConditions([{ attribute: attributes[0].key, operator: ">", value: "0", logicalOp: "AND" }]);
      //applyFilters();
    };
  
    const handleUpdate = () => {
      //setAlertData({ title: "Error!", message: "The update function is not yet implemented." });
    };
  
    const getFilterString = (filter: Condition) => {
      const columnLabel = attributes.find(col => col.key === filter.attribute)?.label || filter.attribute;
      const operatorLabel = operators.find(op => op.value === filter.operator)?.label || filter.operator;
      const logicLabel = operators.find(op => op.value === filter.logicalOp)?.label || filter.logicalOp;
      return `${columnLabel} ${operatorLabel} ${filter.value} ${logicLabel}`;
    };
  

  return (
    <>
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
                  value={cond.logicalOp}
                  onChange={(e) => handleFilterChange(index, "logicalOp", e.target.value)}
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
    <HStack>
      </HStack>
      <Table.ScrollArea borderWidth="1px" rounded="md" maxH="1000px">
        <Table.Root size="sm" stickyHeader>
          <Table.Header>
            <Table.Row bg="bg.subtle">
              {attributes.map(({ key, label }) =>
                 <Table.ColumnHeader key={key}>{label}</Table.ColumnHeader> 
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {wildPokemonList.length > 0 ? (
              wildPokemonList.map((wild_pokemon) => (
                <Table.Row key={wild_pokemon.id}>
                  {attributes.map(({ key }) =>
                    <Table.Cell key={key}>{wild_pokemon[key]}</Table.Cell> 
                  )}
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
      </Table.ScrollArea>
    </>
  );
}

export default PokemonTable;