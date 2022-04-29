import axios from "axios";

export const indexContract = async (contract) => {
  return axios.post(
    "https://us-central1-bloc-party-a25f6.cloudfunctions.net/indexer",
    { contract_id: contract, team_id: contract }
  );
};
