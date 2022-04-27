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
  Text,
  Input,
} from "@chakra-ui/react";

export const CreateTeamModal = ({ isOpen, onClose }) => {
  // TODO: Add Validation
  const [url, set_url] = useState("");
  const [teamName, setTeamName] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [symbol, setSymbol] = useState("");

  async function createParty() {
    //TODO: Change this algo when we convert from testnet -> mainnet
    //Testnet input URL to be in format: https://testnet.paras.id/token/paras-token-v2.testnet::40
    //currently only works for cheap price
    const parsedStringArray = url.split("/").pop().split("::");
    const contractId = parsedStringArray[0]; // pass this into factory deploy when we move to mainnet
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
      console.log(resp);
    } catch (e) {
      console.log(e);
      alert("oh no!");
      console.log("FAILRUE");
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
          <Input
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
            variant="primary"
            width="100%"
            colorScheme="blue"
            onClick={createParty}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
