import React, { useState, useMemo } from "react";

import getConfig from "../config";
import {
  Grid,
  Input,
  Button,
  Box,
  Image,
  Text,
  Tooltip,
  Badge,
} from "@chakra-ui/react";
import { QuestionMark, ShareIcon, ShoppingCart } from "../components/svgs";
export const AuctionStatusComponents = (status, price) => {
  const copyObjectHandler = (status) => {
    switch (status) {
      case "Active":
        return {
          bg: "#EFF7F2",
          color: "#4E8A6A",
          bannerCopy: "Buy Price",
          tooltipCopy: "This BLOC is actively trying to buy an NFT.",
          badgeCopy: "Live BLOC 🤞",
        };
      case "Failed":
        return {
          bg: "#F7EFEF",
          color: "#8A4E4E",
          bannerCopy: "Buy Price",
          tooltipCopy: "This BLOC failed in trying to buy an NFT.",
          badgeCopy: "BLOC failed 😥",
        };
      case "Bought":
        return {
          bg: "#F7EFEF",
          color: "#8A4E4E",
          tooltipCopy: "This BLOC has successfully bought the NFT.",
          bannerCopy: "Reserved Price",
          badgeCopy: "BLOC won 😁",
        };
    }
  };

  const copyObject = useMemo(() => copyObjectHandler(status), [status]);

  return {
    banner: (
      <Box
        display="flex"
        alignItems={"center"}
        justifyContent="space-between"
        px="18px"
        bg={copyObject.bg}
        mt="36px"
        mx="-18px"
        height="48px"
      >
        <Box display="flex">
          <ShoppingCart fill={copyObject.color} />
          <Text mt="-2px" ml="8px" color={copyObject.color} fontWeight="800">
            {copyObject.bannerCopy}
          </Text>
        </Box>
        <Box display="flex">
          <Text color={copyObject.color} fontWeight="800">
            {price} NEAR
          </Text>
        </Box>
      </Box>
    ),
    badge: () => (
      <Box display="flex" alignItems="center">
        <Badge
          bg={copyObject.bg}
          borderRadius="10px"
          px="16px"
          py="8px"
          fontWeight="800"
        >
          {copyObject.badgeCopy}
        </Badge>

        <Box ml="16px">
          <Tooltip
            hasArrow
            placement="top"
            label={copyObject.tooltipCopy}
            bg="#524E8A"
            color="white"
            borderRadius="20px"
            px="16px"
            py="12px"
          >
            <Box>
              <QuestionMark />
            </Box>
          </Tooltip>
        </Box>
      </Box>
    ),
  };
};
