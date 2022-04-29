import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { NFTCard } from "../components/NFTCard";
import { Box, Text, Image, Button, useDisclosure } from "@chakra-ui/react";
import { safeFormatNearAmount } from "../common/utils";
import axios from "axios";
import { Loader } from "../components/Loader";
export const Blocs = () => {
  const [teamData, setTeamData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    setIsLoading(true);
    const data = await axios.post(
      "https://us-central1-bloc-party-a25f6.cloudfunctions.net/searcher"
    );
    setTeamData(
      data.data.data

        .map((i) => i._fieldsProto)
        .filter((i) => Object.keys(i).length === 5)
    );
    setIsLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && (
        <Layout>
          <Box>
            <Text fontSize="25px" fontWeight="700" textAlign="center">
              ALL BLOCs
            </Text>
            {teamData.length === 0 && (
              <Box
                height="65vh"
                mt="50px"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Text>There are no Blocs right now :(.</Text>
              </Box>
            )}
            {teamData.length !== 0 && (
              <Box
                mt="50px"
                display="grid"
                justifyItems="center"
                gridTemplateColumns={["1fr", "1fr", "1fr 1fr", "1fr 1fr 1fr"]}
                columnGap={["20px", "25px"]}
                rowGap={["20px", "50px"]}
              >
                {teamData.map((data, idx) => (
                  <Link key={idx} to={`/bloc/${data.contract_id.stringValue}`}>
                    <NFTCard
                      key={idx}
                      moneyGoal={Number(
                        safeFormatNearAmount(data.money_goal?.stringValue ?? 0)
                      ).toFixed(2)}
                      raised={Number(
                        safeFormatNearAmount(
                          data.money_accrued?.stringValue ?? 0
                        )
                      ).toFixed(2)}
                      status={data.status.stringValue}
                    />
                  </Link>
                ))}
              </Box>
            )}
          </Box>
        </Layout>
      )}
    </>
  );
};
