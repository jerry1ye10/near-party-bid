import React from "react";
import { Box, Image, Text, Badge, Avatar } from "@chakra-ui/react";

export const LiveFeed = ({ feed }) => {
  return (
    <Box
      sx={{
        scrollbarWidth: "none",
        msOverflowStyle: {
          width: "0px",
          height: "0px",
        },
        "&::-webkit-scrollbar": {
          width: "0px",
          height: "0px",
        },
      }}
      borderRadius="20px"
      width="100%"
      overflow="scroll"
      height="269px"
      boxShadow="0px 0px 10px #D8D7E6"
    >
      <Box
        pt="0px"
        pb="24px"
        display="grid"
        gridTemplateColumns="1.1fr 1fr 1fr 1.1fr"
        sx={{
          "& > *": {
            p: "12px",
            pl: "75px",
            height: "fit-content",
            whiteSpace: "nowrap",
          },
        }}
      >
        {["Transaction", "BLOC Member", "Amount", "BLOC"].map((text, idx) => (
          <Text
            key={idx}
            position="sticky"
            top="0px"
            pt="26px"
            bg="white"
            fontWeight="700"
            fontSize="16px"
            color="#5F58BD"
          >
            {text}
          </Text>
        ))}

        {feed.map((item, idx) => {
          return (
            <React.Fragment key={idx}>
              <Box
                fontWeight="700"
                display="flex"
                sx={{
                  bg: idx % 2 === 0 ? "rgba(236, 235, 251, 0.5)" : "white",
                }}
              >
                <Badge
                  py="4px"
                  borderRadius="10px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="fit-content"
                  color="white"
                  fontWeight="700"
                  bg={item.type === "Contribution" ? "#57BE8D" : "#0056FE"}
                >
                  {item.type}
                </Badge>
              </Box>
              <Box
                display="flex"
                sx={{
                  zIndex: "-1",
                  bg: idx % 2 === 0 ? "rgba(236, 235, 251, 0.5)" : "white",
                }}
              >
                <Avatar
                  pr="4px"
                  bg="none !important"
                  size="xs"
                  src={item.user.avatar}
                />
                <Text>{item.user.name}</Text>
              </Box>
              <Text
                sx={{
                  color: "rgba(89, 123, 189, 1)",
                  bg: idx % 2 === 0 ? "rgba(236, 235, 251, 0.5)" : "white",
                }}
              >
                {item.amount}
              </Text>
              <Text
                sx={{
                  color: "rgba(89, 123, 189, 1)",
                  bg: idx % 2 === 0 ? "rgba(236, 235, 251, 0.5)" : "white",
                }}
              >
                {item.blocName}
              </Text>
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
};
