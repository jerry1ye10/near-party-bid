import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { Button, Input } from "@chakra-ui/react";
export const CreateTeam = () => {
  const [url, set_url] = useState("");
  async function createParty() {
    //TODO: Change this algo when we convert from testnet -> mainnet
    //Testnet input URL to be in format: https://testnet.paras.id/token/paras-token-v2.testnet::40
    //currently only works for cheap price 
    const parsedStringArray = url.split("/").pop().split("::");
    const contractId = parsedStringArray[0];
    const nftId = parsedStringArray[1];
    const response = await window.parasContract.nft_get_series_price({
      token_series_id: nftId,
    });
    console.log(parseInt(response));
    window.contract.deploy({
      money_goal: parseInt(response),
      nft_id: nftId,
    });
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
