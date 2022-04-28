import React from "react";
import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { TITLE } from "../common/constants";
import LoginView from "./LoginView";
import { CreateTeamModal } from "./CreateBlocModal";
export const Navbar = () => {
  const pages = [{ name: "All Teams", url: "/teams" }];
  const {
    isOpen: isCreateBlockModalOpen,
    onOpen: onCreateBlocOpen,
    onClose: onCreateBlocClose,
  } = useDisclosure();
  return (
    <Box
      pt="25px"
      display="flex"
      width="100%"
      justifyContent="space-between"
      alignItems="center"
    >
      <Link to={"/"}>
        <Box
          background="linear-gradient(91.97deg, #4C5CE6 31.99%, #FF7749 70.33%)"
          backgroundClip="text"
          display="flex"
          fontSize="24px"
          fontWeight="bold"
        >
          {TITLE}
        </Box>
      </Link>

      <Box
        display="flex"
        sx={{ columnGap: ["4px", null, "25px"] }}
        alignItems="center"
      >
        <Button
          colorScheme="black"
          fontWeight="400"
          variant="link"
          onClick={onCreateBlocOpen}
        >
          +Create a BLOC
        </Button>
        {pages.map((page, idx) => (
          <Link key={idx} to={page.url}>
            <Button
              display={["none", null, "block"]}
              colorScheme="black"
              fontWeight="400"
              variant="link"
            >
              {page.name}
            </Button>
          </Link>
        ))}
        <LoginView />
      </Box>
      <CreateTeamModal
        isOpen={isCreateBlockModalOpen}
        onClose={onCreateBlocClose}
      />
    </Box>
  );
};
