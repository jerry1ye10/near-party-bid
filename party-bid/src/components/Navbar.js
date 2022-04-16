import React from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
export const Navbar = () => {
  const pages = [
    { name: "+ Create Team", url: "/create" },
    { name: "All Teams", url: "/teams" },
    { name: "Governance", url: "/gov" },
  ];

  return (
    <Box
      mt="25px"
      display="flex"
      width="100%"
      justifyContent="space-between"
      alignItems="center"
    >
      <Link to={"/"}>
        <Box display="flex">
          <Text fontSize="30px" fontWeight="500">
            Team
          </Text>
          <Text
            cursor="pointer"
            _hover={{
              color: "rgb(59 130 246/0.5)",
              transition: "color 0.5s ease",
            }}
          >
            Bidder
          </Text>
        </Box>
      </Link>
      <Box display="flex" sx={{ columnGap: "25px" }}>
        {pages.map((page, idx) => (
          <Link key={idx} to={page.url}>
            <Button colorScheme="black" fontWeight="400" variant="link">
              {page.name}
            </Button>
          </Link>
        ))}
      </Box>
    </Box>
  );
};
