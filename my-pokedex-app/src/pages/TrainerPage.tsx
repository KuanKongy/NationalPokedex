import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Button, Box, Spinner, Container, Heading, HStack, Input, Fieldset, Dialog, useDisclosure, Portal, VStack, Select, createListCollection } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import CollectionTrainerTable from "../components/CollectionTrainerTable";

const fetchTrainers = async () => {
    try {
      const response = await fetch("http://localhost:2424/project-trainers");
      const data = await response.json();
      console.log(data.data);
      return data.data;
    } catch (error) {
      console.error("Error fetching trainers:", error);
      return [];
    }
};

  interface Trainer {
    TRAINER_ID: number;
    TRAINER_NAME: string;
    RANK: string;
    REGION_NAME: string;
  }

  const attributeOptions = ["TRAINER_NAME", "RANK", "REGION_NAME"];

const TrainerPage = () => {
    const queryClient = useQueryClient();
    const { data: trainers, isLoading } = useQuery({ queryKey: ["trainers"], queryFn: fetchTrainers });
    const { open, onOpen, onClose } = useDisclosure();
    const { open: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
    const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

    const deleteTrainer = async (trainerId: number) => {
        const response = await fetch(`http://localhost:2424/delete-trainer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trainer_id: trainerId }),
        });
        const data = await response.json();
        if (!data.success) throw new Error("Failed to delete trainer");
        return data;
      };

      const mutationDelete = useMutation({
        mutationFn: deleteTrainer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trainers"] });
          setSelectedTrainer(null); // Clear selection
        },
        onError: (error) => {
          alert("Error deleting trainer: " + error.message);
        }
      });
    
    const mutation = useMutation({
        mutationFn: async (trainerData: { 
          trainer_name: string; 
          rank: string; 
          trainer_id: string; 
          region_name: string; 
        }) => {
          try {
            console.log(trainerData);
            const response = await fetch("http://localhost:2424/insert-trainer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(trainerData),
              });
              const data = await response.json();
              console.log(data.success);
              if (!data.success) {
                alert("Error fetching trainers");
              }
              return data.success;
          } catch (error) {
            alert("Error fetching trainers");
            console.error("Error fetching trainers:", error);
            return [];
          }
        },
        onSuccess: () => {
            console.log("added");
          queryClient.invalidateQueries({ queryKey: ["trainers"] });
        },
        onError: (error) => {
          console.error("Insert failed:", error);
          alert("Failed to add trainer!");
        },
      });

    const [newTrainer, setNewTrainer] = useState({ trainer_name: "", rank: "", trainer_id: "", region_name: "" });

    const handleChange = (e: any) => {
        setNewTrainer({ ...newTrainer, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        mutation.mutate(newTrainer);
    };

    const handleDelete = (e: any) => {
        e.preventDefault();
        if (selectedTrainer) {
            const confirmDelete = window.confirm(`Delete ${selectedTrainer.TRAINER_NAME}?`);
            if (confirmDelete) {
                mutationDelete.mutate(selectedTrainer.TRAINER_ID);
            }
          }
    }

    const [selectedAttributes, setSelectedAttributes] = useState<{ attribute: string; value: string }[]>([]);
const [currentSelection, setCurrentSelection] = useState<string>("");

const handleAddAttribute = () => {
  if (currentSelection && !selectedAttributes.some(attr => attr.attribute === currentSelection)) {
    setSelectedAttributes([...selectedAttributes, { attribute: currentSelection, value: "" }]);
    setCurrentSelection(""); // Reset dropdown
  }
};

const handleChangeValue = (index: number, newValue: string) => {
  const updatedAttributes = [...selectedAttributes];
  updatedAttributes[index].value = newValue;
  setSelectedAttributes(updatedAttributes);
};

const updateTrainerMutation = useMutation({
    mutationFn: async (updateData: any) => {
      const response = await fetch(`http://localhost:2424/update-dynamic-trainer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      if (!data.success) throw new Error("Failed to update trainer");
      return data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["trainers"] });
      onClose(); // Close modal
    },
    onError: (error) => {
      alert("Update failed: " + error.message);
    },
  });
  
  const handleSubmitUpdate = () => {
    if (selectedTrainer && selectedAttributes.length > 0) {
      const updateData = {
        trainer_id: selectedTrainer.TRAINER_ID,
        updates: Object.fromEntries(selectedAttributes.map(attr => [attr.attribute, attr.value])),
      };
      updateTrainerMutation.mutate(updateData);
    }
  };

  const attributeCollection = createListCollection({
    items: attributeOptions
      .filter((attr) => !selectedAttributes.some((a) => a.attribute === attr))
      .map((attr) => ({ label: attr, value: attr })),
  });
  const contentRef = useRef<HTMLDivElement>(null)

    return (
        <>
        {/* Add Trainer */}
        <Dialog.Root placement="center" motionPreset="slide-in-bottom" open={open} onOpenChange={onClose}>
                <Dialog.Trigger />
                <Portal>
                <Dialog.Content position="absolute" top="10vh" left="50%" transform="translateX(-50%)" >
                    <Dialog.Header>Add Trainer</Dialog.Header>
                    <Dialog.CloseTrigger />
                    <Dialog.Body>
                        <Fieldset.Root>
                            <Fieldset.Legend>Trainer ID</Fieldset.Legend>
                            <Input name="trainer_id" onChange={handleChange} />
                        </Fieldset.Root>
                        <Fieldset.Root mt={4}>
                            <Fieldset.Legend>Trainer Name</Fieldset.Legend>
                            <Input name="trainer_name" onChange={handleChange} />
                        </Fieldset.Root>
                        <Fieldset.Root mt={4}>
                            <Fieldset.Legend>Rank</Fieldset.Legend>
                            <Input name="rank" onChange={handleChange} />
                        </Fieldset.Root>
                        <Fieldset.Root mt={4}>
                            <Fieldset.Legend>Region</Fieldset.Legend>
                            <Input name="region_name" onChange={handleChange} />
                        </Fieldset.Root>
                    </Dialog.Body>
                    <Dialog.Footer>
                        {mutation.isPending ? <Spinner size="lg" /> :
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                        Submit
                        </Button>
                        }
                        
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    </Dialog.Footer>
                </Dialog.Content>
                </Portal>
            </Dialog.Root>

                         {/* Update Trainer */}
            <Dialog.Root open={isUpdateOpen} onOpenChange={onUpdateClose}>
            <Dialog.Trigger />
            <Portal>
            <Dialog.Content position="absolute" top="10vh" left="50%" transform="translateX(-50%)" ref={contentRef}>
                <Dialog.Header>Update Trainer</Dialog.Header>
                <Dialog.Body>
                <VStack gap={4}>
                    {/* Dropdown to select attribute */}
                    <HStack>
                        <Select.Root
                        collection={attributeCollection}
                        value={currentSelection ? [currentSelection] : []}
                        onValueChange={(newValue) => {
                            console.log(newValue);
                            setCurrentSelection(newValue.value[0]);
                        }}
                        >
                        <Select.HiddenSelect />
                        <Select.Label>Select Attribute</Select.Label>

                        <Select.Control>
                            <Select.Trigger>
                            <Select.ValueText>{currentSelection || "Select Attribute"}</Select.ValueText>
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                            <Select.Indicator />
                            <Select.ClearTrigger />
                            </Select.IndicatorGroup>
                        </Select.Control>

                        <Portal container={contentRef}>
                            <Select.Positioner>
                            <Select.Content>
                                {attributeCollection.items.map((attr) => (
                                <Select.Item key={attr.value} item={attr}>
                                    {attr.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                                ))}
                            </Select.Content>
                            </Select.Positioner>
                        </Portal>
                        </Select.Root>

                    <Button onClick={handleAddAttribute} disabled={!currentSelection}>
                        Add Attribute
                    </Button>
                    </HStack>

                    {/* Dynamically added attributes */}
                    {selectedAttributes.map((attr, index) => (
                    <HStack key={attr.attribute}>
                        <span>{attr.attribute}</span>
                        <Input
                        value={attr.value}
                        onChange={(e) => handleChangeValue(index, e.target.value)}
                        placeholder={`Enter new ${attr.attribute}`}
                        />
                    </HStack>
                    ))}
                </VStack>
                </Dialog.Body>

                <Dialog.Footer>
                <Button colorScheme="blue" onClick={handleSubmitUpdate} disabled={selectedAttributes.length === 0}>
                    Submit
                </Button>
                <Button onClick={onUpdateClose} ml={3}>Cancel</Button>
                </Dialog.Footer>
            </Dialog.Content>
            </Portal>
            </Dialog.Root>

            <Sidebar />
            <Container maxW="container.md" py={8}>
                <Heading as="h1" size="xl" mb={4}>Trainer Page</Heading>
                <HStack mb={4}>
                    <Button colorScheme="green" onClick={onOpen}>Add Trainer</Button>
                    <Button colorScheme="green" onClick={onUpdateOpen}>Updare Trainer</Button>
                    <Button colorScheme="red" disabled={!selectedTrainer} onClick={handleDelete}>Delete Trainer</Button>
                </HStack>
                
                {isLoading ? (
                    <Box display="flex" justifyContent="center" py={8}>
                        <Spinner size="lg" />
                    </Box>
                ) : (
            <Table.Root>
            <Table.Header>
            <Table.Row>
                <Table.ColumnHeader>Trainer ID</Table.ColumnHeader>
                <Table.ColumnHeader>Trainer Name</Table.ColumnHeader>
                <Table.ColumnHeader>Rank</Table.ColumnHeader>
                <Table.ColumnHeader>Region</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
            </Table.Row>
            </Table.Header>
            <Table.Body>
            {Array.isArray(trainers) && trainers.map((trainer: any) => (
                <Table.Row
                key={trainer.TRAINER_ID}
                onClick={() => {
                    setSelectedTrainer(trainer);
                    console.log(trainer);
                }}
                style={{ background: selectedTrainer?.TRAINER_ID === trainer.TRAINER_ID ? "#f0f0f0" : "" }}
                >
                <Table.Cell>{trainer.TRAINER_ID}</Table.Cell>
                <Table.Cell>{trainer.TRAINER_NAME}</Table.Cell>
                <Table.Cell>{trainer.RANK}</Table.Cell>
                <Table.Cell>{trainer.REGION_NAME}</Table.Cell>
                <Table.Cell>
                    <Button size="sm" colorScheme="blue" onClick={() => alert(`Selected ${trainer.TRAINER_NAME}`)}>
                    Select
                    </Button>
                </Table.Cell>
                </Table.Row>
            ))}
            </Table.Body>
        </Table.Root>
                )}
                <CollectionTrainerTable trainer_id={String(selectedTrainer?.TRAINER_ID)}></CollectionTrainerTable>
            </Container>
        </>
    );
};

export default TrainerPage;
