import axios from "axios";
import { UserDonationSet } from "./../../types";

export const fetchUserDonations = async () => {
  const { data } = await axios.get("/api/user/getDonations");
  return data.donations as UserDonationSet;
};
