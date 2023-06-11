import { UserDonations } from "./../../types";
import axios from "axios";

export const fetchUserDonations = async () => {
  const { data } = await axios.get("/api/user/getDonations");
  return data.donations as UserDonations;
};
