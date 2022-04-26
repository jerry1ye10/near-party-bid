import "regenerator-runtime/runtime";
import React, { useState, useMemo } from "react";
import { login, logout } from "../utils";
import moon from "../assets/moon_nft.jpg";
import LoginView from "../components/LoginView";
import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from "../components/Layout";
import getConfig from "../config";
import { Grid, Input, Button, Box, Image, Text } from "@chakra-ui/react";
import { ShareIcon } from "../components/svgs";
const { networkId } = getConfig("development");
import NearLogo from "../assets/near_logo.svg";
import { ContributionFeed } from "../components/ContributionFeed";
export const Team = () => {
  const [money_accrued, set_money_accrued] = useState(0.0);
  const [money_goal, set_money_goal] = useState(0.0);
  const [money_entered, set_money_entered] = useState(" ");
  const [transactionsData, setTransactions] = useState({});
  const [contract, setContract] = useState({});

  // format
  /***
    {
    "token_id": "437:1",
    "owner_id": "ahuiheo.testnet",
    "metadata": {
        "title": "Jojo is mad #1",
        "description": null,
        "media": "bafkreifxnl5cyaxru4n2fabd7paoc4qaq37xspyjogjji7j6nvyd5mil5a",
        "media_hash": null,
        "copies": 10000,
        "issued_at": "1648221315015699420",
        "expires_at": null,
        "starts_at": null,
        "updated_at": null,
        "extra": null,
        "reference": "bafkreih6dtj3wfff6cllrgq3vvzynn727hxedvstnskuecgow62idatrw4",
        "reference_hash": null
    },
    "approved_account_ids": {
        "paras-marketplace-v2.testnet": 6
    }
   */
  const [NFTMetadata, setNFTMetadata] = useState(null);

  // when the user has not yet interacted with the form, disable the Button
  const [ButtonDisabled, setButtonDisabled] = React.useState(true);

  const roundToHundredth = (value) => {
    return Number(value.toFixed(2));
  };

  function convert_yocto_to_near(float) {
    return roundToHundredth(float / 10 ** 24);
  }

  function convert_near_to_yocto(near_val) {
    return roundToHundredth(near_val * 10 ** 24);
  }
  const history = useLocation();

  const [teamId, setTeamId] = useState("");

  function getTeamId(path) {
    //given pathname
    return path.split("/")[2];
  }

  const nftImage = useMemo(
    () => `https://ipfs.fleek.co/ipfs/${NFTMetadata?.metadata?.media}`,
    [NFTMetadata]
  );

  React.useEffect(
    async () => {
      const id = getTeamId(window.location.pathname);
      setTeamId(id);

      const newContract = await new Contract(
        window.walletConnection.account(),
        id,
        {
          viewMethods: [
            "get_money_accrued",
            "get_money_goal",
            "get_record",
            "get_records",
            "get_nft_Id",
          ],
          changeMethods: ["pay_money", "refund_money"],
        }
      );

      setContract(newContract);
      const token_id = await newContract.get_nft_Id();
      console.log(token_id);
      const response = await window.parasContract.nft_token({
        token_id: token_id.includes(":") ? `${token_id}` : `${token_id}:1`,
      });
      console.log(response);
      setNFTMetadata(response);

      // in this case, we only care to query the contract when signed in
      if (window.walletConnection.isSignedIn()) {
        // window.contract is set by initContract in index.js
        newContract.get_money_accrued().then((money_accrued) => {
          set_money_accrued(convert_yocto_to_near(money_accrued));
        });
        newContract.get_money_goal().then((money_goal) => {
          set_money_goal(convert_yocto_to_near(money_goal) + 1);
        });
        newContract.get_records().then((records) => {
          let transactions = {};
          for (let i = 0; i < records[0].length; i++) {
            transactions[records[0][i]] = records[1][i];
          }
          setTransactions(transactions);
          console.log(transactions);
        });
      }
    },

    // The second argument to useEffect tells React when to re-run the effect
    // Use an empty array to specify "only run on first render"
    // This works because signing into NEAR Wallet reloads the page
    [history]
  );

  // if not signed in, return early with sign-in prompt

  function send_money() {
    // refund_money();
    const deposit = BigInt(parseInt(money_entered) * 10 ** 24);
    console.log(parseFloat(deposit, 10));
    console.log(deposit.toString());
    contract
      .pay_money(
        {},
        "300000000000000", // attached GAS (optional)
        deposit.toString() // attached deposit in yoctoNEAR (optional)
      )
      .catch((e) => {
        console.log(e);
      });
  }

  function refund_money() {
    const deposit = money_entered.concat("0000000000000000000");
    contract
      .refund_money(
        { amount: deposit },
        "300000000000000" // attached GAS (optional)
      )
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <Layout>
      <Box
        display="flex"
        mx={["50px", null, null, "unset"]}
        flexDir={["column", null, null, "row"]}
        mt="75px"
      >
        <Box>
          <Box display="flex" justifyContent="center">
            <Box
              borderRadius="20px"
              boxShadow="0px 0px 10px #D8D7E6"
              display="flex"
              alignItems="center"
              justifyContent="center"
              width={["300px", "400px", "500px"]}
              height={["300px", "400px", "500px"]}
            >
              <Image
                objectFit="cover"
                borderRadius="20px"
                src={nftImage ? nftImage : moon}
                width={"93%"}
                height={"93%"}
              />
            </Box>
          </Box>
          <Box
            position="relative"
            mt="10px"
            sx={{ "& *": { borderRadius: "10px", height: "20px" } }}
          >
            <Box
              position="absolute"
              width="100%"
              bg="linear-gradient(269.99deg, #FFF7E9 0.01%, #ECEBFB 101.44%)"
            />
            <Box
              bg="#524E8A"
              position="absolute"
              width={`${0.2 * 100}%`}
              transition="width 1s ease-in-out"
            />
          </Box>
          <Box ml="-5px" mt="30px" display="flex" alignItems="center">
            <Image
              transform={{ transition: "all 1s ease" }}
              _hover={{
                filter: "drop-shadow(0px 0px 10px rgba(82, 78, 138, 0.21))",
              }}
              src={NearLogo}
            />
            <Text color="#9998A8" fontSize="20px">
              Raised {money_accrued} / {money_goal} NEAR
            </Text>
            {money_goal ? (
              <Text ml="4px">({(money_accrued / money_goal) * 100}%)</Text>
            ) : (
              <></>
            )}
          </Box>
        </Box>
        <Box ml={["0px", null, null, "33px"]}>
          <Box
            display="flex"
            justifyContent="space-between"
            width={["unset", null, null, "100%"]}
          >
            <Box>
              <Text fontSize="24px" fontWeight="600">
                {NFTMetadata?.metadata.title ?? "Loading..."}
              </Text>
              <Box fontSize="14px" color="rgba(97,95,119,1)">
                <Text>Buy Price: {money_goal} Near</Text>
                <Text>{Object.keys(transactionsData).length} members</Text>
              </Box>
            </Box>
            <Box>
              <ShareIcon />
            </Box>
          </Box>
          <Box mt="24px" display="flex">
            <Input
              type="text"
              value={money_entered}
              onChange={(e) => {
                set_money_entered(e.target.value);
              }}
            />
            <Button
              style={{
                justifyContent: "center",
                display: "flex",
                alignContent: "center",
              }}
              onClick={send_money}
            >
              Send Money
            </Button>
          </Box>
        </Box>
      </Box>
      <Box mt="42px">
        <Text fontSize="28px" fontWeight="700">
          Contributors
        </Text>
        <Box my="24px">
          <ul style={{ marginTop: "5px", marginBottom: "5px" }}>
            {Object.keys(transactionsData).map(function (key) {
              return (
                <li>
                  {key}: {convert_yocto_to_near(transactionsData[key])} Near
                </li>
              );
            })}
          </ul>
          <ContributionFeed feed={[]} />
        </Box>
      </Box>
      {/* <main>
        <h1 style={{ justifyContent: "center", display: "flex" }}>
          {money_accrued < money_goal ? <>Almost there </> : <> NFT Bought!</>}
        </h1>

        <Grid spacing={2}>
          <Grid xs={2}></Grid>
          <Grid xs={4}>
            <img src={moon} width={300} height={300} />
          </Grid>
          <Grid xs={4}>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                Money Needed: {money_goal}
              </Grid>
              <Grid item xs={12}>
                Money Pooled: {money_accrued}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={4}></Grid>
        </Grid>

        <div style={{ justifyContent: "center", display: "flex" }}>
          <h2
            style={{
              marginTop: "0px",
              marginBottom: "0px",
              marginLeft: "16px",
              marginRight: "16px",
            }}
          >
            Contributors{" "}
          </h2>
        </div>
        <div style={{ justifyContent: "center", display: "flex" }}>
          <ul style={{ marginTop: "5px", marginBottom: "5px" }}>
            {Object.keys(transactionsData).map(function (key) {
              return (
                <li>
                  {key}: {convert_yocto_to_near(transactionsData[key])} Near
                </li>
              );
            })}
          </ul>
        </div>

    
      </main> */}
    </Layout>
  );
};
