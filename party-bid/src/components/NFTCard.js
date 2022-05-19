import React, { useMemo, useState } from "react";
import { Box, Image, Spinner, Text } from "@chakra-ui/react";
import NearLogo from "../assets/near_logo.svg";

const statusObjectHandler = (status) => {
  switch (status) {
    case '"Party Lost"':
      return { bg: "#F7EFEF", color: "#8A4E4E", text: "BLOC Lost" };
    case '"Currently being sold"':
      return { bg: "#F2F7EF", color: "#708A4E", text: "BLOC for Sale" };
    case '"Currently Voting on Price"':
      return { bg: "#EFF0F7", color: "#524E8A", text: "Voting on BLOC Price" };
    case '"NFT has been bought and sold!"':
      return { bg: "#EEEEEE", color: "#8A8A8A", text: "NFT has been sold" };
    case '"Party Ongoing"':
    default:
      return { bg: "#EFF7F2", color: "#4E8A6A", text: "BLOC Live" };
  }
};

export const NFTCard = ({
  status,
  moneyGoal,
  members,
  raised,
  partyName,
  imageUrl,
}) => {
  const statusObject = useMemo(() => statusObjectHandler(status), [status]);
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <Box
      display="flex"
      flexDir="column"
      bg="white"
      borderRadius="20px"
      p="13px"
      filter="drop-shadow(0px 0px 10px #D8D7E6)"
      transition={"all 0.2s ease-in"}
      _hover={{
        filter: "drop-shadow(0px 10px 20px #D8D7E6)",
        transform: "translate3d(0px, -5px, 12px)",
      }}
      width="fit-content"
    >
      <Box
        mb="15px"
        width="250px"
        height="250px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {!imageLoaded && <Spinner size="lg" />}
        <Image
          width="100%"
          height="100%"
          objectFit="contain"
          display={imageLoaded ? "inherit" : "none"}
          src={imageUrl}
          onLoad={() => setImageLoaded(true)}
        />
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text fontSize="24px">{partyName}</Text>
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
        <Box>Buy price: {moneyGoal} NEAR</Box>
        <Box>{members} members</Box>
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
          <Box
            bg="#524E8A"
            position="absolute"
            width={`${(raised / moneyGoal) * 100}%`}
            transition="width 1s ease-in-out"
            height="6px"
          />
        </Box>
        <Text mt="10px" color="#9998A8" fontSize="10px">
          Raised {raised} / {moneyGoal} NEAR
        </Text>
        <Box
          mt="20px"
          mx="-13px"
          mb="-13px"
          borderBottomRadius="20px"
          height="30px"
          bg={statusObject.bg}
          color={statusObject.color}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text>{statusObject.text}</Text>
        </Box>
      </Box>
    </Box>
  );
};
