import React from "react";
import { Box, Image, Text } from "@chakra-ui/react";
import StockNFT from "../assets/stock_nft.png";
import NearLogo from "../assets/near_logo.svg";

export const NFTCard = () => {
  return (
    <Box
      display="flex"
      flexDir="column"
      bg="white"
      borderRadius="20px"
      p="13px"
      border="1px solid #5F59BD"
      width="fit-content"
    >
      <Image src={StockNFT} />
      <Box display="flex" justifyContent="space-between">
        <Text fontSize="24px">BLOCSana</Text>
        <Image
          transform={{ transition: "all 1s ease" }}
          _hover={{
            filter: "drop-shadow(0px 0px 10px rgba(82, 78, 138, 0.21))",
          }}
          src={NearLogo}
        />
      </Box>
      <Box
        height="min-content"
        display="flex"
        flexDir="column"
        color="#615F77"
        fontSize="14px"
        lineHeight="15.39px"
        fontWeight="500"
      >
        <Box>Buy price: 5 NEAR</Box>
        <Box>6 members</Box>
        <Box
          position="relative"
          mt="10px"
          sx={{ "& *": { borderRadius: "10px" } }}
        >
          <Box
            position="absolute"
            width="100%"
            height="6px"
            bg="linear-gradient(269.99deg, #FFF7E9 0.01%, #ECEBFB 101.44%)"
          />
          <Box bg="#524E8A" position="absolute" width="12%" height="6px" />
        </Box>
        <Text mt="10px" color="#9998A8" fontSize="10px">
          Raised 0.5 / 5 NEAR
        </Text>
        <Box
          mt="20px"
          mx="-13px"
          mb="-13px"
          borderBottomRadius="20px"
          height="30px"
          bg="#ECEBFB"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text>Live BLOC</Text>
        </Box>
      </Box>
    </Box>
  );
};
