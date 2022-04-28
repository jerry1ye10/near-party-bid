import React from "react";
import { Layout } from "../components/Layout";
import { NFTCard } from "../components/NFTCard";
import { Box, Text, Image, Button, useDisclosure } from "@chakra-ui/react";
export const Marketplace = () => {
  return (
    <Layout>
      <Box>
        <Text fontSize="25px" fontWeight="700" textAlign="center">
          Current NFTS for sale
        </Text>
        <Box
          mt="50px"
          display="grid"
          justifyItems="center"
          gridTemplateColumns={["1fr", "1fr", "1fr 1fr", "1fr 1fr 1fr"]}
          columnGap={["20px", "25px"]}
          rowGap={["20px", "50px"]}
        >
          {[
            "Lost",
            "Won",
            "Live",
            "Lost",
            "Won",
            "Live",
            "Lost",
            "Won",
            "Live",
          ].map((status, idx) => (
            <NFTCard key={idx} moneyGoal={10} raised={3} status={status} />
          ))}
        </Box>
      </Box>
    </Layout>
  );
};
