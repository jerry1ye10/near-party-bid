import axios from "axios";

export const updateContract = async (contract) => {
  return axios.post(
    "https://us-central1-bloc-party-a25f6.cloudfunctions.net/updateContract",
    { contract_id: contract }
  );
};
