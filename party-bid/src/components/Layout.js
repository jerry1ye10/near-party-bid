import React from "react";
import { Box, Container } from "@chakra-ui/react";
import { Navbar } from "./Navbar";
export const Layout = ({ children }) => {
  return (
    <Box>
      <Container maxW="container.xl">
        <Navbar />
        {children}
      </Container>
    </Box>
  );
};