import { usePlayer } from "@/components/Providers/PlayerProvider";
import { useToast } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { MAX_KANDI_DONATION } from "../constants";

export default function useKandi() {
  const [donationAmount, setDonationAmount] = useState(0);
  const queryClient = useQueryClient();
  const { currentTrack } = usePlayer();
  const { user } = useUser();
  const toast = useToast();

  const handleDonation = () => {
    setDonationAmount((previous) => Math.min(previous + 1, MAX_KANDI_DONATION));
  };

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
        colorScheme: "red",
      });
    } else if (outOfKandi) {
      toast({
        position: "bottom",
        duration: 3000,
        description: `Out of Kandi.`,
        status: "warning",
        colorScheme: "red",
      });
    } else {
      toast({
        position: "bottom",
        duration: 3000,
        description: `Donated ${additionalKandi} kandi!`,
        status: "success",
        colorScheme: "blue",
      });
    }

    queryClient.invalidateQueries("user");
    queryClient.invalidateQueries("browsePlaylistContext");
  };

  // Open donation window
  useEffect(() => {
    const timer = setTimeout(() => {
      if (donationAmount > 0) {
        sendDonation(donationAmount);
        setDonationAmount(0);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [donationAmount]);

  return { handleDonation };
}
