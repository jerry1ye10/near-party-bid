import React from "react";
import { Box, Container } from "@chakra-ui/react";
import { Navbar } from "./Navbar";
export const Layout = ({ children }) => {
  return (
    <Box>
      <Box px="16px">
        <Navbar />
      </Box>
      <Container maxW="container.lg">{children}</Container>
    </Box>
  );
};
