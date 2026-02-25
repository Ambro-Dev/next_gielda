import { Transport } from "@/app/(private)/transport/page";
import CardWithMap from "@/components/CardWithMap";
import React from "react";

const TransportsMap = ({ transports }: { transports: Transport[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
      {transports &&
        transports.map((item) => {
          return <CardWithMap key={item.id} transport={item} />;
        })}
    </div>
  );
};

export default TransportsMap;
