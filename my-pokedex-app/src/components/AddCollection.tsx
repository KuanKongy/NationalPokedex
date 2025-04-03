import { useState, useEffect } from "react";
import { Popover, Portal, Button, Input, Stack, Field, NativeSelect } from "@chakra-ui/react";

export interface CollectionFormData {
    collection_name: string, 
    collection_category: string, 
    collection_number: number, 
  }
  
  interface CollectionProps {
    onSubmit: (data: CollectionFormData) => void;
  }

const AddCollection: React.FC<CollectionProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<CollectionFormData>({
    collection_name: "", 
    collection_category: "", 
    collection_number: 0, 
  });

  const [Categories, setCategories] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`http://localhost:2424/project-selected-collection`,  {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              "selectedAttributes": ["collection_category"]
          }),
          });
        const data = await response.json();
        console.log(data.data);
        const formattedCategories = data.data.map((cat: any) => ({
            label: cat.COLLECTION_CATEGORY,
            value: cat.COLLECTION_CATEGORY,
          }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        alert("Error fetching collection categories");
      }
    };
  
    fetchCategories();
  }, []);

  const setCategory = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      collection_category: value,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData); 
  };

  return (
    <Popover.Root>
      <Popover.Trigger as="span">
        <Button size="sm" variant="outline">Add Collection</Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Content>
          <Popover.Arrow />
          <Popover.Body>
          <NativeSelect.Root>
            <NativeSelect.Field
            value={formData.collection_category}
            onChange={(e) => setCategory(e.target.value)}
            >
            {Categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                {cat.label}
                </option>
            ))}
            </NativeSelect.Field>
        </NativeSelect.Root>
            <Stack gap={4}>
              <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input name="collection_name" value={formData.collection_name} onChange={handleChange} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Number</Field.Label>
                <Input name="collection_number" value={formData.collection_number} onChange={handleChange} />
              </Field.Root>
              <Button mt={2} onClick={handleSubmit}>Submit</Button>
            </Stack>
          </Popover.Body>
        </Popover.Content>
      </Portal>
    </Popover.Root>
  );
};

export default AddCollection;
