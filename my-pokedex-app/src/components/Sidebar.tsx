"use client"

import { Button, CloseButton, Drawer, Portal, Box } from "@chakra-ui/react"
import { useState } from "react"
import { Link } from "@chakra-ui/react"

const Sidebar = () => {
  const [open, setOpen] = useState(false)

  return (
    <Drawer.Root placement="start" open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Drawer.Trigger asChild>
        <Button variant="outline" size="sm">
          Menu
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Menu</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
            <Box w="full" p={3} borderRadius="md" ><Link href="./">Pokemon Filter</Link></Box>
            <Box w="full" p={3} borderRadius="md" ><Link href="./list">Pokemon by Columns</Link></Box>
            <Box w="full" p={3} borderRadius="md" ><Link href="./trainer">Trainer Profiles</Link></Box>
            <Box w="full" p={3} borderRadius="md" ><Link href="./regionmap">Regions Map</Link></Box>
            <Box w="full" p={3} borderRadius="md" ><Link href="./statistics">Pokemon info</Link></Box>
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}

export default Sidebar;
