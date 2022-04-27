import React, { useRef } from "react";
import { login } from "../../utils";
import {
  safeFormatNearAmount,
  safeParseNearAmount,
  toLongNumber,
} from "../../common/utils";
import {
  Button,
  Box,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Image,
  Input,
  InputGroup,
  Badge,
  InputRightElement,
} from "@chakra-ui/react";
import NearLogo from "../../assets/near_logo.svg";
export const VoteModal = ({
  isOpen,
  onClose,
  reserve_price,
  vote_price,
  percent_owned,
  setVotePrice,
}) => {
  const moneyInput = useRef(null);
  return (
    <Modal borderRadius="20px" size={"md"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize="24px">Vote on Reserve Price</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="400" fontSize="20px">
            NFT Reserve Price
          </Text>
          <Text fontWeight="700" fontSize="28px">
            {reserve_price} NEAR
          </Text>

          {[
            {
              key: "Your current reserve price vote",
              value: `${
                vote_price ? safeFormatNearAmount(vote_price) : 0
              } NEAR`,
            },
            {
              key: "Fractional Ownership",
              value: `${percent_owned}%`,
            },
          ].map((contributionProperties, idx) => {
            return (
              <Box
                key={idx}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt="5px"
              >
                <Text color="rgba(139, 137, 168, 1)">
                  {contributionProperties.key}
                </Text>
                <Badge
                  display="flex"
                  borderRadius="10px"
                  alignItems="center"
                  px="8px"
                  py="2px"
                  bg="rgba(95, 88, 189, 0.2)"
                  color="rgba(82, 78, 138, 1)"
                >
                  {contributionProperties.value}
                </Badge>
              </Box>
            );
          })}

          <InputGroup mt="56px">
            <Input
              ref={moneyInput}
              placeholder="0.5"
              borderRadius="15px"
              bg="rgba(249, 249, 254, 1)"
            />
            <InputRightElement
              children={
                <Image
                  transform={{ transition: "all 1s ease" }}
                  _hover={{
                    filter: "drop-shadow(0px 0px 10px rgba(82, 78, 138, 0.21))",
                  }}
                  src={NearLogo}
                />
              }
            />
          </InputGroup>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="primary"
            width="100%"
            colorScheme="blue"
            onClick={() => setVotePrice(moneyInput.current.value)}
          >
            Vote
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
