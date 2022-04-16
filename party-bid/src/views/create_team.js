import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { Button, Input } from "@chakra-ui/react";
export const CreateTeam = () => {
  const [url, set_url] = useState("");
  function createParty() {
    //TODO: Change this algo when we convert from testnet -> mainnet
    //Testnet input URL to be in format: https://testnet.paras.id/token/paras-token-v2.testnet::40
    const parsedStringArray = url.split("/").pop().split("::");
    const contractId = parsedStringArray[0];
    const nftId = parsedStringArray[1];
//get price of nft
    //Customize contract to take in
    //Figure out contract infra
    //Call on deploy contract with this
  }

  return (
    <Layout>
      Enter Url:{" "}
      <Input
        type="text"
        value={url}
        onChange={(e) => {
          set_url(e.target.value);
        }}
      />
      <Button
        style={{
          justifyContent: "center",
          display: "flex",
          alignContent: "center",
        }}
        onClick={createParty}
      >
        Create Party{" "}
      </Button>
    </Layout>
  );
};
