import React from "react";
import { Layout } from "../components/Layout";
import { Box, Text, Image, Button } from "@chakra-ui/react";
import ORB from "../assets/orb.svg";
import { NFTCard } from "../components/NFTCard";
export const Home = () => {
  return (
    <Layout>
      {/* BG */}
      <Box
        position="absolute"
        height="500px"
        width="100%"
        bg="linear-gradient(#FDE0CD, #FFFCF3)"
        left="0"
        top="0"
        right="0"
        zIndex={-1}
      />
      <Image
        display={["none", null, "unset"]}
        position="absolute"
        src={ORB}
        right="0"
        top="100px"
        zIndex={-1}
      />
      <Box mt="68px" fontWeight="700" fontSize="48px" lineHeight="58px">
        <Text>Join a team, pool NEAR</Text>
        <Text>
          Buy NFTs
          <Box
            ml="14px"
            as="span"
            background="linear-gradient(90.85deg, #4C5CE6 35.33%, #F95D12 62.15%)"
            backgroundClip="text"
          >
            together
          </Box>
        </Text>
        <Text fontWeight="500" fontSize="14px">
          Buy, tokenize, and sell NFTs on
          <Box ml="4px" as="span" color="#5951BF">
            NEAR
          </Box>
          , now with friends
        </Text>
        <Box display="flex" sx={{ columnGap: "10px" }}>
          <Button variant="primary">Create your BLOC</Button>
          <Button variant="outline">Join a BLOC</Button>
        </Box>
      </Box>
      <Box
        mt="250px"
        display="grid"
        justifyItems="center"
        gridTemplateColumns={["1fr", null, "1fr 1fr", "1fr 1fr 1fr"]}
        gap={"10px"}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map((card) => (
          <NFTCard />
        ))}
      </Box>
    </Layout>
  );
};
