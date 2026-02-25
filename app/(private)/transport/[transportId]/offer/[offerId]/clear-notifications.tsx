"use client";

import { useMessages } from "@/app/context/message-provider";
import { axiosInstance } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

type Props = {
  offerId: string;
};

const ClearNotifications = ({ offerId }: Props) => {
  const { data } = useSession();
  const { setOffers, setOfferMessages } = useMessages();

  useEffect(() => {
    if (!data?.user?.id) return;
    const userId = data.user.id;

    // Mark offer as viewed
    axiosInstance
      .put("/api/offers/viewed", { offerId })
      .catch(() => {});

    // Mark offer messages as read
    axiosInstance
      .put("/api/offers/offer/message/read", { offerId, userId })
      .catch(() => {});

    // Remove this offer from badge state
    setOffers((prev) => prev.filter((o) => o.id !== offerId));

    // Remove offer messages for this offer from badge state
    setOfferMessages((prev) =>
      prev.filter((m) => m.offer?.id !== offerId)
    );
  }, [offerId, data?.user?.id]);

  return null;
};

export default ClearNotifications;
