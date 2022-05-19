import React, { useState, useEffect } from "react";
import {
  safeFormatNearAmount,
  safeParseNearAmount,
  toLongNumber,
} from "../../common/utils";
import {
  Button,
  Box,
  Image,
  Text,
  SkeletonCircle,
  Badge,
  SkeletonText,
  useDisclosure,
} from "@chakra-ui/react";
import NearLogo from "../../assets/near_logo.svg";
import { LoginPanelStates } from "./LoginPanelStates";
import { VoteModal } from "./VoteModal";

export const ContributionCard = ({
  contract,
  contractState,
  teamMetadata,
  money_accrued,
  money_goal,
  send_money,
}) => {
  const [sellPrice, setSellPrice] = useState(0);
  const [percentVoted, setPercentVoted] = useState(0);
  const [contribution, setContribution] = useState(0);
  const [tokenCount, setTokenCount] = useState(0);
  const [votePrice, setVotePrice] = useState(null);
  const {
    isOpen: isVoteModalOpen,
    onOpen: onVoteModalOpen,
    onClose: onVoteModalClose,
  } = useDisclosure();
  useEffect(() => {
    (async () => {
      if (contract) {
        setSellPrice(safeFormatNearAmount(await contract?.get_sell_price()));
        setPercentVoted(await contract.get_percent_voted());
        setContribution(
          safeFormatNearAmount(
            await contract.get_record({
              account_id: window.walletConnection.getAccountId(),
            })
          )
        );
        setTokenCount(
          (
            await contract.get_token_count({
              account_id: window.walletConnection.getAccountId(),
            })
          ).toLocaleString("fullwide", { useGrouping: false })
        );
        setVotePrice(
          await contract.get_vote_price({
            account_id: window.walletConnection.getAccountId(),
          })
        );
      }
    })();
  }, [contract]);

  const setVotedReservePrice = (price) => {
    // refund_money();
    contract
      .set_vote_price(
        { price: safeParseNearAmount(price) },
        "300000000000000" // attached GAS (optional)
      )
      .catch((e) => {
        console.log(e);
      });
  };

  const buyNFT = async () => {
    const sellPrice = await contract?.get_sell_price();
    contract
      .buy_nft(
        {},
        "300000000000000", // attached GAS (optional)
        toLongNumber(sellPrice + 300000000000000) // attached deposit in yoctoNEAR (optional)
      )
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Box
      mt="24px"
      borderRadius="20px"
      display="flex"
      flexDir="column"
      bg="rgba(250, 250, 255, 1)"
      width={["unset", null, null, "100%"]}
      py="48px"
      px={["32px", null, null, "48px"]}
      boxShadow="0px 0px 10px #D8D7E6"
    >
      {contractState === "Active" && (
        <>
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
                        filter:
                          "drop-shadow(0px 0px 10px rgba(82, 78, 138, 0.21))",
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
                    money_accrued={money_accrued}
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
        </>
      )}
      {contractState === "Bought" && (
        <Box>
          <Box width="100%">
            <Text fontSize="18px" fontWeight="700" color="#8B89A8">
              CURRENT RESERVE PRICE
            </Text>
            <Text color="#221F4E" fontSize="28px" fontWeight="700">
              {Number(sellPrice).toFixed(3)} NEAR
            </Text>
            <Text
              fontSize="12px"
              color="rgba(139, 137, 168, 1);"
              textAlign="center"
              mt="5px"
            >
              Once 75% of total fraction supply owners have voted on a reserve
              price, this NFT will be put for sale.
            </Text>
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
                width={`${percentVoted * 100}%`}
                transition="width 1s ease-in-out"
              />
            </Box>
            <Text
              fontSize="12px"
              color="rgba(139, 137, 168, 1);"
              textAlign="center"
              mt="40px"
            >
              {percentVoted * 100}% of owners have voted.
            </Text>
            <Button
              mt="15px"
              variant="primary"
              width="100%"
              onClick={onVoteModalOpen}
            >
              {votePrice === null && "Loading..."}
              {votePrice === 0 && "Vote on a reserve price"}
              {votePrice > 0 && "Update vote on reserve price"}
            </Button>
            {/* Divider */}
            <Box borderTop="1px solid rgba(236, 235, 251, 1)" my="24px" />
            {/* Divider */}

            <Box>
              <Text fontSize="18px" fontWeight="700" color="#8B89A8">
                YOUR CONTRIBUTIONS
              </Text>
              {[
                {
                  key: "Contributed",
                  value: `${Number(contribution).toFixed(2)} NEAR`,
                },
                {
                  key: "Fractional Ownership",
                  value: `${
                    Number(
                      safeFormatNearAmount(tokenCount) / money_goal
                    ).toFixed(2) * 100
                  }%`,
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
            </Box>
          </Box>
          <VoteModal
            isOpen={isVoteModalOpen}
            onClose={onVoteModalClose}
            reserve_price={Number(sellPrice).toFixed(3)}
            vote_price={votePrice}
            percent_owned={
              Number(safeFormatNearAmount(tokenCount) / money_goal).toFixed(2) *
              100
            }
            setVotePrice={setVotedReservePrice}
          />
        </Box>
      )}
      {contractState === "OnSale" && (
        <Box>
          <Box width="100%">
            <Text fontSize="18px" fontWeight="700" color="#8B89A8">
              ON SALE
            </Text>
            <Text color="#4E8A6A" fontSize="28px" fontWeight="700">
              {Number(sellPrice).toFixed(3)} NEAR
            </Text>
            <Text
              fontSize="12px"
              color="rgba(139, 137, 168, 1);"
              textAlign="center"
              mt="5px"
            >
              75% of owners of this NFT has put up a vote for sale at the
              specified reserve price.
            </Text>

            <Button mt="15px" variant="primary" width="100%" onClick={buyNFT}>
              Buy Now
            </Button>
          </Box>
        </Box>
      )}
      {contractState === "Sold" && (
        <Box>
          <Box width="100%">
            <Text fontSize="18px" fontWeight="700" color="#8B89A8">
              SOLD FOR
            </Text>
            <Text color="black" fontSize="28px" fontWeight="700">
              {Number(sellPrice).toFixed(3)} NEAR
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};
