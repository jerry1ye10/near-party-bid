import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  useToast,
  Text,
  Input,
} from "@chakra-ui/react";
import { indexContract } from "../data/indexer";
export const CreateBlocModal = ({ isOpen, onClose }) => {
  // TODO: Add Validation
  const [url, set_url] = useState("");
  const [URLError, setURLError] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const toast = useToast();

  async function createParty() {
    setIsCreating(true);
    setURLError(false);
    const validURL = url.match(
      /https:\/\/testnet\.paras\.id\/token\/paras-token-v2\.testnet::\d+/g
    );
    if (validURL !== null) {
      //TODO: Change this algo when we convert from testnet -> mainnet
      //Testnet input URL to be in format: https://testnet.paras.id/token/paras-token-v2.testnet::40
      //currently only works for cheap price
      const parsedStringArray = url.split("/").pop().split("::");
      // const contractId = parsedStringArray[0]; // pass this into factory deploy when we move to mainnet
      const nftId = parsedStringArray[1];
      const response = await window.parasContract.nft_get_series_price({
        token_series_id: nftId,
      });

      try {
        const resp = await window.contract.deploy(
          {
            money_goal: BigInt(
              parseFloat(response) + 7780000000000000000000
            ).toString(),
            nft_id: nftId,
            current_time: new Date().valueOf().toString(),
            team_name: teamName,
            token_name: tokenName,
            token_symbol: symbol,
          },
          "300000000000000" // attached GAS (optional)
        );

        const res = await indexContract(resp);

        if (res.status === 200) {
          toast({
            title: "BLOC Created!",
            description: "You've successfully created a block",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
          window.location = "/bloc/" + resp;
          setIsCreating(false);
        } else {
          throw Error("Block Creation Failed");
        }
      } catch (e) {
        console.log(e);
        toast({
          title: "BLOC Creation Failed!",
          description: "There was an error in creating the bloc. Try again.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
      setIsCreating(false);
    } else {
      setURLError(true);
      setIsCreating(false);
    }
  }

  return (
    <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize="24px">Create a BLOC</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mt="10px" fontWeight="600" fontSize="15px">
            What is your Team Name?
          </Text>
          <Input
            placeholder="BLOC Crew"
            mt="5px"
            type="text"
            value={teamName}
            onChange={(e) => {
              setTeamName(e.target.value);
            }}
          />
          <Text mt="10px" fontWeight="600" fontSize="15px">
            If you win this bid, what is your token name?
          </Text>
          <Input
            placeholder="BLOC"
            mt="5px"
            type="text"
            value={tokenName}
            onChange={(e) => {
              setTokenName(e.target.value);
            }}
          />
          <Text mt="10px" fontWeight="600" fontSize="15px">
            If you win this bid, what is your token symbol?
          </Text>
          <Input
            placeholder="BLC"
            mt="5px"
            type="text"
            value={symbol}
            onChange={(e) => {
              setSymbol(e.target.value);
            }}
          />
          <Text mt="10px" fontWeight="600" fontSize="15px">
            Enter URL of NFT to Bid:
          </Text>
          {URLError && (
            <Text color="red.300">
              The URL must be a valid link from Paras. Please try submitting a
              valid URL.
            </Text>
          )}
          <Input
            isInvalid={URLError}
            placeholder="https://testnet.paras.id/token/paras-token-v2.testnet::298"
            mt="5px"
            type="text"
            value={url}
            onChange={(e) => {
              set_url(e.target.value);
            }}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            isLoading={isCreating}
            variant="primary"
            width="100%"
            _hover={{ bg: "unset" }}
            disabled={!window.walletConnection.isSignedIn() || isCreating}
            onClick={
              window.walletConnection.isSignedIn() ? createParty : () => {}
            }
          >
            {window.walletConnection.isSignedIn()
              ? "Create"
              : "Connect Wallet to Continue"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
