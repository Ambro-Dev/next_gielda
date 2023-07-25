import CardWithMap from "@/components/CardWithMap";
import React from "react";

export type Transport = {
  id: string;
  sendDate: Date;
  receiveDate: Date;
  vehicle: { id: string; name: string };
  category: { id: string; name: string };
  type: { id: string; name: string };
  directions: {
    finish: {
      lat: number;
      lng: number;
    };
    start: {
      lat: number;
      lng: number;
    };
  };
  creator: { id: string; username: string };
};

const TransportsMap = ({ transports }: { transports: Transport[] }) => {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-8 lg:w-4/5 w-full">
      {transports &&
        transports.map((item) => {
          return <CardWithMap key={item.id} transport={item} />;
        })}
    </div>
  );
};

export default TransportsMap;
