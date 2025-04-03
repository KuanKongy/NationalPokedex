import { useState } from "react";
import { Popover, Portal, Button, Input, Stack, Field } from "@chakra-ui/react";

interface FormData {
    id: number;
    name: string;
    rank: number;
    region_name: string;
  }
  
  interface TrainerProps {
    onSubmit: (data: FormData) => void;
  }

const AddTrainer: React.FC<TrainerProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    rank: 0,
    region_name: "",
  });

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
        <Button size="sm" variant="outline">Add Trainer</Button>
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
                <Field.Label>Rank</Field.Label>
                <Input name="rank" value={formData.rank} onChange={handleChange} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Region Name</Field.Label>
                <Input name="region_name" value={formData.region_name} onChange={handleChange} />
              </Field.Root>
              <Button mt={2} colorScheme="blue" onClick={handleSubmit}>Submit</Button>
            </Stack>
          </Popover.Body>
        </Popover.Content>
      </Portal>
    </Popover.Root>
  );
};

export default AddTrainer;
