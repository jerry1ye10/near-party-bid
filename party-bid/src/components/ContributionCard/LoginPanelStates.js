import React, { useState } from "react";
import { login } from "../../utils";
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
  Image,
  ModalFooter,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import NearLogo from "../../assets/near_logo.svg";
export const LoginPanelStates = ({
  money_accrued,
  teamMetadata,
  send_money,
  money_goal,
}) => {
  const {
    isOpen: isContributionModalOpen,
    onOpen: onContributionModalOpen,
    onClose: onContributionModalClose,
  } = useDisclosure();

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
        <Button
          width="100%"
          variant="primary"
          onClick={onContributionModalOpen}
        >
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
          money_accrued={money_accrued}
          isOpen={isContributionModalOpen}
          onClose={onContributionModalClose}
          money_goal={money_goal}
          send_money={send_money}
        />
      </Box>
    );
  }
};

const ContributionModal = ({
  isOpen,
  onClose,
  money_goal,
  send_money,
  money_accrued,
}) => {
  // const moneyInput = useRef(null);
  const [moneyInput, setMoneyInput] = useState("");
  return (
    <Modal borderRadius="20px" size={"md"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize="24px">Contribute NEAR</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontWeight="700" color="#8B89A8" fontSize="20px">
              Buy Price
            </Text>
            <Text fontWeight="700" fontSize="20px">
              {Number(money_goal).toFixed(5)} NEAR
            </Text>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontWeight="700" color="#8B89A8" fontSize="20px">
              Raised
            </Text>
            <Text fontWeight="700" fontSize="20px">
              {Number(money_accrued).toFixed(5)} NEAR
            </Text>
          </Box>
          <InputGroup mt="56px">
            <Input
              value={moneyInput}
              onChange={(e) => setMoneyInput(e.target.value)}
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

        <ModalFooter gap="10px">
          <Button
            variant="primary"
            width="100%"
            colorScheme="blue"
            onClick={() => send_money(moneyInput)}
          >
            Contribute
          </Button>
          <Button
            variant="outline"
            width="100%"
            colorScheme="blue"
            onClick={() => setMoneyInput(money_goal - money_accrued)}
          >
            Contribute ALL
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
