"use client";

import React from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import admin from "@/assets/icons/administrator.png";
import Image from "next/image";

type Props = {
  administrators: {
    id: string;
    username: string;
    email: string;
    name: string;
    surname: string;
  }[];
};

const AdminsCarousel = (props: Props) => {
  const { administrators } = props;
  return (
    <div className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          Administratorzy szkoły
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-gray-100">
          {administrators.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
            >
              <Image src={admin} alt="admin" width={32} height={32} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{user.username}</div>
                <p className="text-xs text-muted-foreground truncate">
                  {(user.name || "") + " " + (user.surname || "")}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </div>
  );
};

export default AdminsCarousel;
