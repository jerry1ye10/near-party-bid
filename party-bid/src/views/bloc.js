import "regenerator-runtime/runtime";
import React, { useState, useMemo } from "react";
import { login, logout } from "../utils";
import moon from "../assets/moon_nft.jpg";
import LoginView from "../components/LoginView";
import {
  connect,
  Contract,
  keyStores,
  WalletConnection,
  utils,
} from "near-api-js";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from "../components/Layout";
import getConfig from "../config";
import {
  Grid,
  Input,
  Button,
  Box,
  Image,
  Text,
  Tooltip,
  useToast,
  SkeletonCircle,
  SkeletonText,
  Skeleton,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import { ShareIcon, ShareIconHover, ShoppingCart } from "../components/svgs";
const { networkId } = getConfig("development");
import NearLogo from "../assets/near_logo.svg";
import {
  truncateAddress,
  safeFormatNearAmount,
  safeParseNearAmount,
  roundToFourDec,
} from "../common/utils";
import { ContributionFeed } from "../components/ContributionFeed";
import { AuctionStatusComponents } from "../components/AuctionStatusComponents";
import AVATAR from "../assets/avatar.svg";
import { ContributionCard } from "../components/ContributionCard/index";
import { updateContract } from "../data/updateContract";

export const Bloc = () => {
  const [money_accrued, set_money_accrued] = useState(0.0);
  const [money_goal, set_money_goal] = useState(0.0);
  const [transactionsData, setTransactions] = useState({});
  const [contract, setContract] = useState(null);
  const [contractState, setContractState] = useState("Loading");
  const [sellPrice, setSellPrice] = useState(0);

  const toast = useToast();

  const [NFTMetadata, setNFTMetadata] = useState(null);
  /*
   * NFTMetadata
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

  const [teamMetadata, setTeamMetadata] = useState(null);
  /**
   * teamMetadata
   * 
  {
    "team_name": "Test",
    "token_metadata": {
        "spec": "ft-1.0.0",
        "name": "test",
        "symbol": "test",
        "icon": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 288 288'%3E%3Cg id='l' data-name='l'%3E%3Cpath d='M187.58,79.81l-30.1,44.69a3.2,3.2,0,0,0,4.75,4.2L191.86,103a1.2,1.2,0,0,1,2,.91v80.46a1.2,1.2,0,0,1-2.12.77L102.18,77.93A15.35,15.35,0,0,0,90.47,72.5H87.34A15.34,15.34,0,0,0,72,87.84V201.16A15.34,15.34,0,0,0,87.34,216.5h0a15.35,15.35,0,0,0,13.08-7.31l30.1-44.69a3.2,3.2,0,0,0-4.75-4.2L96.14,186a1.2,1.2,0,0,1-2-.91V104.61a1.2,1.2,0,0,1,2.12-.77l89.55,107.23a15.35,15.35,0,0,0,11.71,5.43h3.13A15.34,15.34,0,0,0,216,201.16V87.84A15.34,15.34,0,0,0,200.66,72.5h0A15.35,15.35,0,0,0,187.58,79.81Z'/%3E%3C/g%3E%3C/svg%3E",
        "reference": null,
        "reference_hash": null,
        "decimals": 24
    }
  }
   */

  const history = useLocation();

  const [teamId, setTeamId] = useState("");

  function getTeamId(path) {
    //given pathname
    return path.split("/")[2];
  }

  const nftImage = useMemo(
    () =>
      NFTMetadata?.metadata?.media
        ? `https://ipfs.fleek.co/ipfs/${NFTMetadata?.metadata?.media}`
        : null,
    [NFTMetadata]
  );

  const getContractState = async (contract) => {
    const isNFTSold = await contract.get_nft_sold();
    const isNFTBought = await contract.get_nft_bought();
    const isListingAvailable = await contract.get_listing_available();

    if (isListingAvailable && !isNFTSold) {
      return "OnSale";
    } else if (isNFTSold) {
      return "Sold";
    } else if (isNFTBought) {
      return "Bought";
    } else if (!isNFTBought) {
      return "Active";
    } else {
      return "Failed";
    }
  };

  React.useEffect(
    async () => {
      const id = getTeamId(window.location.pathname);
      setTeamId(id);
      const newContract = new Contract(window.walletConnection.account(), id, {
        viewMethods: [
          "get_money_accrued",
          "get_money_goal",
          "get_record",
          "get_records",
          "get_nft_id",
          "get_team_metadata",
          "get_nft_bought",
          "get_vote_price",
          "get_sell_price",
          "get_percent_voted",
          "get_token_count",
          "get_listing_available",
          "get_nft_sold",
        ],
        changeMethods: [
          "pay_money",
          "buy_nft",
          "refund_money",
          "set_vote_price",
        ],
      });
      await updateContract(id);
      setContract(newContract);

      // get NFTMetadata
      const token_id = await newContract.get_nft_id();
      const fetchedNFTMetadata = await window.parasContract.nft_token({
        token_id: token_id.includes(":") ? `${token_id}` : `${token_id}:1`,
      });
      setNFTMetadata(fetchedNFTMetadata);

      const contractState = await getContractState(newContract);
      setContractState(contractState);

      // get teamMetadata
      const fetchedTeamMetadata = await newContract.get_team_metadata();
      setTeamMetadata(fetchedTeamMetadata);

      setSellPrice(safeFormatNearAmount(await newContract?.get_sell_price()));
      const fetchedNFTBought = await newContract.get_nft_bought();
      // in this case, we only care to query the contract when signed in
      if (window.walletConnection.isSignedIn()) {
        // window.contract is set by initContract in index.js
        newContract.get_money_accrued().then((money_accrued) => {
          set_money_accrued(safeFormatNearAmount(money_accrued));
        });
        newContract.get_money_goal().then((money_goal) => {
          set_money_goal(safeFormatNearAmount(money_goal) + 1);
        });
        newContract.get_records().then((records) => {
          let transactions = {};
          for (let i = 0; i < records[0].length; i++) {
            transactions[records[0][i]] = records[1][i];
          }
          setTransactions(transactions);
        });
      }
    },

    // The second argument to useEffect tells React when to re-run the effect
    // Use an empty array to specify "only run on first render"
    // This works because signing into NEAR Wallet reloads the page
    [history]
  );

  // if not signed in, return early with sign-in prompt

  function send_money(deposit) {
    // refund_money();
    contract
      .pay_money(
        {},
        "300000000000000", // attached GAS (optional)
        safeParseNearAmount(deposit) // attached deposit in yoctoNEAR (optional)
      )
      .catch((e) => {
        console.log(e);
      });
  }

  // function refund_money() {
  //   // const deposit = money_entered.concat("0000000000000000000");
  //   contract
  //     .refund_money(
  //       { amount: deposit },
  //       "300000000000000" // attached GAS (optional)
  //     )
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // }

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast({
      title: "BLOC Link Copied!",
      description: "We've copied the link for you to share.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const MemoizedAuctionComponents = AuctionStatusComponents(
    contractState,
    contractState === "Active" ? money_goal : sellPrice
  );

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
          <Box
            display="flex"
            justifyContent="center"
            borderRadius="20px"
            flexDir="column"
            p="18px"
            boxShadow="0px 0px 10px #D8D7E6"
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width={["100%", null, "500px"]}
              height={["300px", null, "500px"]}
            >
              {nftImage && (
                <Image
                  objectFit="contain"
                  borderRadius="20px"
                  src={nftImage}
                  width={"100%"}
                  height={"100%"}
                />
              )}
              {!nftImage && <Spinner size="xl" />}
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text mt="24px" fontSize="24px" fontWeight="600">
                {NFTMetadata?.metadata.title ?? "Loading..."}
              </Text>
              <Image
                pt="10px"
                mt="10px"
                transform={{ transition: "all 1s ease" }}
                _hover={{
                  filter: "drop-shadow(0px 0px 10px rgba(82, 78, 138, 0.21))",
                }}
                src={NearLogo}
              />
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Text color="#221F4E" fontWeight="600">
                Current Owner
              </Text>
              <Tooltip label={NFTMetadata?.owner_id} placement="top">
                <Text color="#597BBD">
                  {truncateAddress(NFTMetadata?.owner_id)}
                </Text>
              </Tooltip>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Text color="#221F4E" fontWeight="600">
                Token ID
              </Text>
              <Text color="#597BBD">{NFTMetadata?.token_id}</Text>
            </Box>
            {MemoizedAuctionComponents.banner}
          </Box>
        </Box>
        <Box
          mt={["24px", null, null, "unset"]}
          width="100%"
          ml={["0px", null, null, "33px"]}
        >
          <Box
            borderRadius="20px"
            display="flex"
            flexDir="column"
            width={["unset", null, null, "100%"]}
            py="48px"
            px={["32px", null, null, "48px"]}
            boxShadow="0px 0px 10px #D8D7E6"
          >
            <Box width="100%" display="flex" justifyContent="space-between">
              {teamMetadata && (
                <>
                  <Box>
                    <Text fontSize="20px" fontWeight="700" color="#8B89A8">
                      {`$${teamMetadata?.token_metadata?.symbol}`}
                    </Text>
                    <Text fontSize="24px" fontWeight="600">
                      {teamMetadata?.team_name}
                    </Text>
                    <Box mt="8px">
                      <MemoizedAuctionComponents.badge />
                    </Box>
                    <Box mt="8px">
                      <Text color="rgba(89, 123, 189, 1)" fontSize="16px">
                        {Object.keys(transactionsData).length} BLOC members
                      </Text>
                    </Box>
                  </Box>

                  <Box>
                    <Box
                      borderRadius="100%"
                      p="10px"
                      _hover={{ bg: "rgba(0, 0, 0, 0.05)" }}
                      transition="all 0.2s ease-in"
                      onClick={copy}
                    >
                      <ShareIcon />
                    </Box>
                  </Box>
                </>
              )}
              {!teamMetadata && (
                <Box display="flex" flexDir="column" width="100%">
                  <SkeletonCircle size="10" />
                  <SkeletonText
                    mt="10px"
                    mb="25px"
                    width="100%"
                    height="20px"
                  />
                </Box>
              )}
            </Box>
            {teamMetadata && (
              <>
                {/* Divider */}
                <Box borderTop="1px solid rgba(236, 235, 251, 1)" my="24px" />
                {/* Divider */}
                <Box>
                  <Text
                    color="rgba(139, 137, 168, 1)"
                    fontWeight="700"
                    fontSize="20px"
                  >
                    BLOC HOST
                  </Text>
                  <Text
                    fontSize="13px"
                    mt="16px"
                    color="rgba(105, 103, 142, 1)"
                  >
                    The BLOC Host below summoned the BLOC.
                  </Text>

                  <Badge
                    mt="16px"
                    py="2px"
                    px="8px"
                    display="flex"
                    bg="rgba(249, 249, 254, 1)"
                    color="rgba(82, 78, 138, 1)"
                    width="fit-content"
                    alignItems="center"
                    borderRadius="10px"
                  >
                    <Image src={AVATAR} />{" "}
                    <Text ml="4px">{teamMetadata.host}</Text>
                  </Badge>
                </Box>
              </>
            )}
          </Box>
          <ContributionCard
            contract={contract}
            contractState={contractState}
            money_accrued={money_accrued}
            money_goal={money_goal}
            teamMetadata={teamMetadata}
            send_money={send_money}
          />
        </Box>
      </Box>
      <Box mt="42px" width="100%">
        <Text fontSize="28px" fontWeight="700">
          Recent Activity
        </Text>
        <Box my="24px">
          {Object.keys(transactionsData).map(function (key) {
            return (
              <Box
                key={key}
                borderRadius="15px"
                boxShadow="0px 0px 10px #D8D7E6"
                px="50px"
                py="23px"
                alignItems="center"
                display="flex"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center">
                  <Image width="50px" height="50px" src={AVATAR} />
                  <Text
                    ml="24px"
                    color="rgba(89, 123, 189, 1)"
                    fontWeight="600"
                  >
                    @{key}{" "}
                    <Box as="span" color="black">
                      contributed to
                    </Box>{" "}
                    {teamMetadata.team_name}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="32px">
                    {Number(
                      safeFormatNearAmount(transactionsData[key])
                    ).toFixed(2)}{" "}
                    NEAR
                  </Text>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
      {/* <main>
      : {safeFormatNearAmount(transactionsData[key])} Near
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
