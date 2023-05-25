import { MAX_KANDI_DONATION } from "@/app/api/track/donateKandi/route";
import { usePlayer } from "@/components/Providers/PlayerProvider";
import { useToast } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { QueryClient, useMutation } from "react-query";
import { User } from "../../lib/types";

const queryClient = new QueryClient();

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

    const { data } = await axios.post("/api/track/donateKandi", {
      donationAmount: amount,
      trackId: currentTrack.id,
    });

    const { capExceeded, outOfKandi, additionalKandi, error, remainingKandi } =
      data;
    if (error) throw new Error(error);

    if (capExceeded) {
      toast({
        position: "bottom",
        duration: 3000,
        description: `Maximum donation limit reached.`,
        status: "warning",
      });
    } else if (outOfKandi) {
      toast({
        position: "bottom",
        duration: 3000,
        description: `Out of Kandi.`,
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

    queryClient.invalidateQueries("user"); // refetch kandi balacne
  };

  // Open donation window
  useEffect(() => {
    const timer = setTimeout(() => {
      if (donationAmount > 0) {
        sendDonation(donationAmount);
        setDonationAmount(0);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [donationAmount]);

  return { handleDonation };
}
