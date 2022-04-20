import React from "react";
import { Box, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { TITLE } from "../common/constants";
export const Navbar = () => {
  const pages = [
    { name: "+ Create Team", url: "/create" },
    { name: "All Teams", url: "/teams" },
    { name: "Governance", url: "/gov" },
  ];

  return (
    <Box
      pt="25px"
      display="flex"
      width="100%"
      justifyContent="space-between"
      alignItems="center"
    >
      <Link to={"/"}>
        <Box display="flex" fontSize="24px" fontWeight="bold">
          {TITLE}
        </Box>
      </Link>
      <Box display="flex" sx={{ columnGap: "25px" }} alignItems="center">
        {pages.map((page, idx) => (
          <Link key={idx} to={page.url}>
            <Button colorScheme="black" fontWeight="400" variant="link">
              {page.name}
            </Button>
          </Link>
        ))}
        <Button variant="primary">Connect Wallet</Button>
      </Box>
    </Box>
  );
};
