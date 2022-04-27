import React, { useRef } from "react";
import { login, logout } from "../utils";
import {
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Input,
  Button,
  Box,
  Image,
  Text,
  SkeletonCircle,
  SkeletonText,
  useDisclosure,
} from "@chakra-ui/react";
import NearLogo from "../assets/near_logo.svg";

const LoginPanelStates = ({ teamMetadata, send_money, money_goal }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (!window.walletConnection.isSignedIn()) {
    return (
      <Box mt="52px">
        <Button width="100%" variant="primary" onClick={login}>
          Connect Wallet
        </Button>
        <Text
          mt="16px"
          color="rgba(139, 137, 168, 1)"
          fontSize="13px"
          textAlign="center"
        >
          Connect wallet to buy ${teamMetadata.token_metadata.symbol} and hold a
          fraction of this NFT
        </Text>
      </Box>
    );
  } else {
    return (
      <Box mt="52px">
        <Button width="100%" variant="primary" onClick={onOpen}>
          Contribute NEAR
        </Button>
        <Text
          mt="16px"
          color="rgba(139, 137, 168, 1)"
          fontSize="13px"
          textAlign="center"
        >
          Buy ${teamMetadata.token_metadata.symbol} token with NEAR to
          contribute. If the reserve price is reached, a fraction of the NFT is
          yours!
        </Text>
        <ContributionModal
          isOpen={isOpen}
          onClose={onClose}
          money_goal={money_goal}
          send_money={send_money}
        />
      </Box>
    );
  }
};

const ContributionModal = ({ isOpen, onClose, money_goal, send_money }) => {
  const moneyInput = useRef(null);
  return (
    <Modal borderRadius="20px" size={"md"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize="24px">Contribute NEAR</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="400" fontSize="20px">
            Buy Price
          </Text>
          <Text fontWeight="700" fontSize="28px">
            {money_goal} NEAR
          </Text>
          <Input
            ref={moneyInput}
            borderRadius="15px"
            mt="56px"
            bg="rgba(249, 249, 254, 1)"
          />
        </ModalBody>

        <ModalFooter>
          <Button
            variant="primary"
            width="100%"
            colorScheme="blue"
            onClick={() => send_money(moneyInput.current.value)}
          >
            Contribute
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const ContributionCard = ({
  teamMetadata,
  money_accrued,
  money_goal,
  send_money,
}) => {
  return (
    <Box
      mt="24px"
      borderRadius="20px"
      display="flex"
      flexDir="column"
      bg="rgba(250, 250, 255, 1)"
      width={["unset", null, null, "100%"]}
      py="48px"
      px={["32px", null, null, "72px"]}
      boxShadow="0px 0px 10px #D8D7E6"
    >
      <Box width="100%" display="flex" justifyContent="space-between">
        {teamMetadata && (
          <>
            <Box width="100%">
              <Text fontSize="18px" fontWeight="700" color="#8B89A8">
                BLOC CONTRIBUTIONS
              </Text>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text
                  color="rgba(34, 31, 78, 1)"
                  fontSize="20px"
                  fontWeight="700"
                >
                  {Number(money_accrued)?.toFixed(2)} /{" "}
                  {Number(money_goal)?.toFixed(2)} NEAR raised
                </Text>
                <Image
                  mt="-5px"
                  transform={{ transition: "all 1s ease" }}
                  _hover={{
                    filter: "drop-shadow(0px 0px 10px rgba(82, 78, 138, 0.21))",
                  }}
                  src={NearLogo}
                />
              </Box>
              <Box
                position="relative"
                mt="10px"
                sx={{ "& *": { borderRadius: "10px", height: "16px" } }}
              >
                <Box
                  position="absolute"
                  width="100%"
                  bg="rgba(95, 88, 189, 0.2)"
                />
                <Box
                  bg="#524E8A"
                  position="absolute"
                  width={`${
                    (Number(money_accrued) / Number(money_goal)) * 100
                  }%`}
                  transition="width 1s ease-in-out"
                />
              </Box>
              <LoginPanelStates
                teamMetadata={teamMetadata}
                send_money={send_money}
                money_goal={money_goal}
              />
            </Box>
          </>
        )}
        {!teamMetadata && (
          <Box display="flex" flexDir="column" width="100%">
            <SkeletonCircle size="10" />
            <SkeletonText mt="10px" mb="25px" width="100%" height="20px" />
          </Box>
        )}
      </Box>
      {teamMetadata && <></>}
    </Box>
  );
};
