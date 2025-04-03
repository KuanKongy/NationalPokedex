import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Checkbox,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  HStack,
} from "@chakra-ui/react";
import Sidebar from "./Sidebar";

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

const columns = [
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

const PokemonTable = () => {
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    columns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
  );

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getVisibleColumns = () => {
    return columns
      .filter((col) => visibleColumns[col.key]) 
      .map((col) => col.attr);
  };

  const [wildPokemonList, setWildPokemonList] = useState<Pokemon[]>([]);

   useEffect(() => {
      const visibleColumnKeys = getVisibleColumns();
      console.log("Visible columns:", visibleColumnKeys);
      const fetchWildPokemonList = async () => {
        try {
          const response = await fetch('http://localhost:2424/project-selected-pokemon', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              "selectedAttributes": visibleColumnKeys
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
    }, [visibleColumns]);

    const parseData = (data: any) => {
      console.log("Parsing data...\n");
      const columns = Object.keys(data.data[0]);
      const results = data.data.map((row: any) => 
        Object.fromEntries(
          columns.map((col, index) => [col, row[col]]) 
        )
      );
      console.log(results);
      setWildPokemonList(results);
    };

  return (
    <>
    <Sidebar />
    <HStack>
      <Popover.Root>
        <PopoverTrigger as="span">
          <Button size="sm">Toggle Columns</Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody>
            <VStack align="start">
              {columns.map(({ key, label }) => (
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
      </HStack>
      <Table.ScrollArea borderWidth="1px" rounded="md" maxH="1000px">
        <Table.Root size="sm" stickyHeader>
          <Table.Header>
            <Table.Row bg="bg.subtle">
              {columns.map(({ key, label }) =>
                visibleColumns[key] ? <Table.ColumnHeader key={key}>{label}</Table.ColumnHeader> : null
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {wildPokemonList.length > 0 ? (
              wildPokemonList.map((wild_pokemon) => (
                <Table.Row key={wild_pokemon.id}>
                  {columns.map(({ key }) =>
                    visibleColumns[key] ? <Table.Cell key={key}>{wild_pokemon[key]}</Table.Cell> : null
                  )}
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={columns.length + 1} textAlign="center">
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