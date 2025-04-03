import { Input, Button, Popover, Portal, Field, Stack } from "@chakra-ui/react";
import { useState } from "react";

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

interface FormData {
  pokedexId: string;
  feature: string;
  newValue: string;
}

interface TrainerPopoverProps {
  onSubmit: (data: FormData) => void;
}

const TrainerPopover: React.FC<TrainerPopoverProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    pokedexId: "",
    feature: "",
    newValue: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!formData.pokedexId || !formData.feature || !formData.newValue) {
      alert("All fields are required!");
      return;
    }

    onSubmit(formData);
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button size="sm" variant="outline">
          Edit Trainer
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>
              <Stack gap="4">
                <Field.Root>
                  <Field.Label>Trainer ID</Field.Label>
                  <Input name="pokedexId" value={formData.pokedexId} onChange={handleChange} />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Feature</Field.Label>
                  <Input name="feature" value={formData.feature} onChange={handleChange} />
                </Field.Root>
                <Field.Root>
                  <Field.Label>New Value</Field.Label>
                  <Input name="newValue" value={formData.newValue} onChange={handleChange} />
                </Field.Root>
                <Button mt={2} colorScheme="blue" onClick={handleSubmit}>
                  Submit
                </Button>
              </Stack>
            </Popover.Body>
            <Popover.CloseTrigger />
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

export default TrainerPopover;
