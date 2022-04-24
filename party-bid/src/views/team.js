import "regenerator-runtime/runtime";
import React, { useState } from "react";
import { login, logout } from "../utils";
import moon from "../assets/moon_nft.jpg";
import LoginView from "../components/LoginView";
import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from "../components/Layout";
import getConfig from "../config";
import { Grid, Input, Button } from "@chakra-ui/react";
const { networkId } = getConfig("development");

export const Team = (props) => {
  const [money_accrued, set_money_accrued] = useState(0.0);
  const [money_goal, set_money_goal] = useState(0.0);
  const [money_entered, set_money_entered] = useState(" ");
  const [transactionsData, setTransactions] = useState({});
  const [contract, setContract] = useState({});

  // when the user has not yet interacted with the form, disable the Button
  const [ButtonDisabled, setButtonDisabled] = React.useState(true);

  const roundToHundredth = (value) => {
    return Number(value.toFixed(2));
  };

  function convert_yocto_to_near(float) {
    return roundToHundredth(float / 1000000000000000000000000);
  }

  function convert_near_to_yocto(near_val) {
    return roundToHundredth(near_val * 1000000000000000000000000);
  }
  const history = useLocation();

  const [teamId, setTeamId] = useState("");

  function getTeamId(path) {
    //given pathname
    return path.split("/")[2];
  }

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
          ],
          changeMethods: ["pay_money", "refund_money"],
        }
      );

      setContract(newContract);

      console.log(await newContract.get_money_accrued());

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
          console.log("hello");
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
    refund_money();
    // const deposit = money_entered.concat("00000000000000000000");
    // contract
    //   .pay_money(
    //     {},
    //     "300000000000000", // attached GAS (optional)
    //     deposit // attached deposit in yoctoNEAR (optional)
    //   )
    //   .catch((e) => {
    //     console.log(e);
    //   });
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
      <main>
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

        <div style={{ justifyContent: "center", display: "flex" }}>
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
        </div>
      </main>
    </Layout>
  );
};
