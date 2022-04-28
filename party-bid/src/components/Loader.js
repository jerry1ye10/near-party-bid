import React, { useEffect, useState, useRef, useCallback } from "react";
import { Box, Text, Spinner } from "@chakra-ui/react";
import { BiCoffeeTogo, BiHeart } from "react-icons/bi";

export const Loader = () => {
  return (
    <Box
      zIndex={10000}
      position="fixed"
      left="0"
      right="0"
      top="0"
      bottom="0"
      display="flex"
      opacity="0.7"
      justifyContent="center"
      alignItems="center"
      bg="#FAFAFF"
    >
      <Box display="flex" alignItems={"center"} flexDir="column">
        <Text color="black" fontWeight="700" fontSize="24px">
          Loading...
        </Text>
        <Spinner color="purple.700" />
      </Box>
    </Box>
  );
};
