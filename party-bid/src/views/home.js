import React from "react";
import { Layout } from "../components/Layout";
import { Box, Text, Image, Button } from "@chakra-ui/react";
import NFT from "../assets/nft_home_page.png";
export const Home = () => {
  return (
    <Layout>
      <Box
        mt="30px"
        borderRadius="15px"
        height="fit-content"
        width="100%"
        display="flex"
        flexDir={["column", null, null, "row"]}
        bg="rgb(227,220,240)"
      >
        <Box
          maxW={[null, null, null, "600px"]}
          pt={["10px", null, null, "100px"]}
          px={["10px", null, null, "50px"]}
        >
          <Text
            fontWeight="500"
            fontSize={["4xl", null, null, "5xl"]}
            textAlign={["center", null, null, "unset"]}
          >
            Join a team and buy the{" "}
            <Box as="span" borderBottom="5px solid rgb(0,114,205)">
              NFT
            </Box>{" "}
            of your dreams.
          </Text>
          <Button size="lg" mt="30px">
            Create Team
          </Button>
        </Box>
        <Box
          ml={["10px", null, null, "30px"]}
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={["300px", null, null, "500px"]}
        >
          <Image
            borderRadius="5px"
            boxShadow="3px 3px 9px 5px rgba(0,0,0,0.27)"
            height={["90%"]}
            src={NFT}
          />
        </Box>
      </Box>
    </Layout>
  );
};
