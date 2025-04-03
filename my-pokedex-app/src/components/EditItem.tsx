import { useState } from "react";
import { Popover, Portal, Button, Input, Stack, Field, NativeSelect } from "@chakra-ui/react";

export interface ItemFormData {
  name: string;
  new_name: string;
  category: string;
  effect: string;
}

interface EditItemProps {
  items: { name: string; category: string; effect: string }[];
  trainer: { id: number; name: string; region_name: string; } | undefined;
}

const EditItem: React.FC<EditItemProps> = ({ items, trainer }) => {
  // Initialize form data state
  const [name, setName] = useState("");
  const [new_name, setNewName] = useState("");
  const [category, setCategory] = useState("");
  const [effect, setEffect] = useState("");

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "new_name":
        setNewName(value);
        break;
      case "category":
        setCategory(value);
        break;
      case "effect":
        setEffect(value);
        break;
      default:
        break;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!trainer) {
      console.error("Select trainer");
      alert("Must first select trainer");
    } else {
      const updates: { [key: string]: string | number } = {};
    
      if (new_name) updates["item_name"] = new_name;
      if (category) updates["item_category"] = category;
      if (effect) updates["item_effect"] = effect;

      console.log(updates);

      try {
        const response = await fetch("http://localhost:2424/update-dynamic-item", {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "updates": updates,
            "item_name": new_name,
            "trainer_id": 0,
          }),
        });
        
        if (response.status === 500) {
          // !!! alert
        } else {
          alert("Update item was unsuccessful");
        }
      } catch (error) {
        console.error("Error submitting:", error);
        alert("There was an error updating item");
      }
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger as="span">
        <Button size="sm" variant="outline">Edit Item</Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Content>
          <Popover.Arrow />
          <Popover.Body>
            <Stack gap={4}>
              <NativeSelect.Root>
                {Array.isArray(items) && items.length > 0 ? (
                  <NativeSelect.Field
                    value={name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  >
                    {items.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </NativeSelect.Field>
                ) : (
                  <p>No items available</p>
                )}
              </NativeSelect.Root>
              <Field.Root>
                <Field.Label>New Name</Field.Label>
                <Input
                  name="new_name"
                  value={new_name}
                  onChange={(e) => handleChange("new_name", e.target.value)}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Category</Field.Label>
                <Input
                  name="category"
                  value={category}
                  onChange={(e) => handleChange("category", e.target.value)}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Effect</Field.Label>
                <Input
                  name="effect"
                  value={effect}
                  onChange={(e) => handleChange("effect", e.target.value)}
                />
              </Field.Root>
              <Button mt={2} colorScheme="blue" onClick={handleSubmit}>Submit</Button>
            </Stack>
          </Popover.Body>
        </Popover.Content>
      </Portal>
    </Popover.Root>
  );
};

const dummyItems = [
  { name: "FireStone", category: "Evolution", effect: "Evolves Fire-type Pokémon" },
  { name: "ThunderStone", category: "Evolution", effect: "Evolves Electric-type Pokémon" },
  { name: "WaterStone", category: "Evolution", effect: "Evolves Water-type Pokémon" },
  { name: "LeafStone", category: "Evolution", effect: "Evolves Grass-type Pokémon" },
  { name: "CharizarditeX", category: "Mega Evolution", effect: "Mega Evolves Charizard" },
  { name: "RazorClaw", category: "Item", effect: "Increases critical hit ratio" },
  { name: "MasterBall", category: "Item", effect: "Catches any Pokémon without fail" },
  { name: "RareCandy", category: "Item", effect: "Instantly levels up a Pokémon by 1" },
];



export default EditItem;
