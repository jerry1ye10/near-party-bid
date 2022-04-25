import React from "react";
import { Box, Container } from "@chakra-ui/react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
export const Layout = ({ children }) => {
  return (
    <Box>
      <Box px="16px">
        <Navbar />
      </Box>
      <Container maxW={["container.sm", null, "container.md", "container.lg"]}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
};
