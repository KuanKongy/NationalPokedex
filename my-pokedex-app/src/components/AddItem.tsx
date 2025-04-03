import { useState } from "react";
import { Popover, Portal, Button, Input, Stack, Field } from "@chakra-ui/react";
  
  interface ItemProps {
    trainer: { id: number; name: string; region_name: string; } | undefined;
  }

const AddItem: React.FC<ItemProps> = ({ trainer })  => {
  // Initialize form data state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [effect, setEffect] = useState("");

  // Handle input changes
    const handleChange = (field: string, value: string) => {
      switch (field) {
        case "name":
          setName(value);
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
        alert("Must select trainer before adding an item");
        console.log(JSON.stringify({ 
          "item_name": name, 
          "item_category": category, 
          "item_effect": effect
         }));
      } else {
        try {
          const response = await fetch("http://localhost:2424/insert-item", {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              "item_name": name, 
              "item_category": category, 
              "item_effect": effect
             }),
          });
          
          if (response.status === 500) {
            // !!! alert
          } else {
            alert("Add item unsuccessful");
          }
        } catch (error) {
          console.error("Error submitting:", error);
          alert("There was an error adding item");
        }
      }
    };

  return (
    <Popover.Root>
      <Popover.Trigger as="span">
        <Button size="sm" variant="outline">Add Item</Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Content>
          <Popover.Arrow />
          <Popover.Body>
            <Stack gap={4}>
              <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input name="name" value={name} onChange={(e) => handleChange("name", e.target.value)} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Category</Field.Label>
                <Input name="category" value={category} onChange={(e) => handleChange("category", e.target.value)} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Effect</Field.Label>
                <Input name="effect" value={effect} onChange={(e) => handleChange("effect", e.target.value)} />
              </Field.Root>
              <Button mt={2} colorScheme="blue" onClick={handleSubmit}>Submit</Button>
            </Stack>
          </Popover.Body>
        </Popover.Content>
      </Portal>
    </Popover.Root>
  );
};

export default AddItem;
