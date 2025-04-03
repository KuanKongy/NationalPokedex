import { useState } from "react";
import { Popover, Portal, Button, Input, Stack, Field } from "@chakra-ui/react";

interface FormData {
    id: number;
    name: string;
    hp: number;
    attack: number;
    defence: number;
    special_attack: string;
    special_defence: string;
    speed: number;
    from_pokemon_id: number;
    to_pokemon_id: number;
    req_name: string;
    spawn_rate: number;
    spawn_weather: string;
    spawn_time: number;
  }
  
  interface TrainerPokemonProps {
    onSubmit: (data: FormData) => void;
  }

const AddPokemon: React.FC<TrainerPokemonProps> = ({ onSubmit }) => {
  // Initialize form data state
  const [alertData, setAlertData] = useState<{ title: string; message: string } | null>(null);
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    hp: 0,
    attack: 0,
    defence: 0,
    special_attack: "",
    special_defence: "",
    speed: 0,
    from_pokemon_id: 0,
    to_pokemon_id: 0,
    req_name: "",
    spawn_rate: 0,
    spawn_weather: "",
    spawn_time: 0,
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    alert("This function is not yep implemented");
  };

  return (
    <>
    <Popover.Root>
      <Popover.Trigger as="span">
        <Button size="sm" variant="outline">Add Pokémon</Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Content>
          <Popover.Arrow />
          <Popover.Body>
            <Stack gap={4}>
              <Field.Root>
                <Field.Label>ID</Field.Label>
                <Input name="id" value={formData.id} onChange={handleChange} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input name="name" value={formData.name} onChange={handleChange} />
              </Field.Root>
              <Field.Root>
                <Field.Label>HP</Field.Label>
                <Input name="hp" value={formData.hp} onChange={handleChange} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Attack</Field.Label>
                <Input name="attack" value={formData.attack} onChange={handleChange} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Defence</Field.Label>
                <Input name="defence" value={formData.defence} onChange={handleChange} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Special Attack</Field.Label>
                <Input name="special_attack" value={formData.special_attack} onChange={handleChange} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Special Defence</Field.Label>
                <Input name="special_defence" value={formData.special_defence} onChange={handleChange} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Speed</Field.Label>
                <Input name="speed" value={formData.speed} onChange={handleChange} />
              </Field.Root>
              <Field.Root>
                <Field.Label>From Pokémon ID</Field.Label>
                <Input name="from_pokemon_id" value={formData.from_pokemon_id} onChange={handleChange} />
              </Field.Root>
              <Field.Root>
                <Field.Label>To Pokémon ID</Field.Label>
                <Input name="to_pokemon_id" value={formData.to_pokemon_id} onChange={handleChange} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Requirement Name</Field.Label>
                <Input name="req_name" value={formData.req_name} onChange={handleChange} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Spawn Rate</Field.Label>
                <Input name="spawn_rate" value={formData.spawn_rate} onChange={handleChange} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Spawn Weather</Field.Label>
                <Input name="spawn_weather" value={formData.spawn_weather} onChange={handleChange} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Spawn Time</Field.Label>
                <Input name="spawn_time" value={formData.spawn_time} onChange={handleChange} />
              </Field.Root>

              <Button mt={2} colorScheme="blue" onClick={handleSubmit}>Submit</Button>
            </Stack>
          </Popover.Body>
        </Popover.Content>
      </Portal>
    </Popover.Root>
    </>
  );
};

export default AddPokemon;
