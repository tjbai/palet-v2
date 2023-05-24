import { MAX_KANDI_DONATION } from "@/app/api/track/donateKandi/route";
import { usePlayer } from "@/components/Providers/PlayerProvider";
import { useToast } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import CustomToast from "@/components/Common/CustomToast";

/*
Desired flow:

User spams spacebar. These donations are aggregated and after a certain
window elapses a post request is made to /api/track/donateKandi
There should be an immediate visual confirmation that the spacebar has been
pressed, but after the request/response loop has completed, a toast
appears on the screen with the resultant behavior. 

After making a donation, the local donationAmount variable should 
be reset to 0. We need to be careful here to prevent data races
because setState() is not a synchronous operation...
*/

export default function useKandi() {
  const [donationAmount, setDonationAmount] = useState(0);
  const { currentTrack } = usePlayer();
  const { user } = useUser();
  const toast = useToast();

  const handleDonation = () => {
    setDonationAmount((previous) => Math.min(previous + 1, MAX_KANDI_DONATION));
  };

  /* 
  Let D represent the current donation amount, 
  D' the outstanding donations, and M the limit.

  Case 1: D < M, D + D' <= M. 
  We should notify the user that they successfully donated D' kandi.

  Case 2: D < M, D + D' > M.
  We should notify the user that they donated D + D' - M kandi.

  Case 3: D > M
  We should notify the user that they have reached their donation limit.
  */
  const sendDonation = async (amount: number) => {
    if (!user || !currentTrack) return;
    console.log(user.id);
    console.log(currentTrack.id);

    try {
      const { data } = await axios.post("/api/track/donateKandi", {
        donationAmount: amount,
        userId: user.id,
        trackId: currentTrack.id,
      });

      const { capExceeded, additionalKandi, error } = data;
      if (error) throw new Error(error); // this could be a really boneheaded loc

      if (capExceeded) {
        toast({
          position: "bottom",
          duration: 3000,
          description: `Maximum donation limit reached`,
          status: "warning",
        });
      } else {
        toast({
          position: "bottom",
          duration: 3000,
          description: `Donated ${additionalKandi} kandi!`,
          status: "success",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (donationAmount > 0) {
        sendDonation(donationAmount);
        setDonationAmount(0);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [donationAmount]);

  return { handleDonation };
}
