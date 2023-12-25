import React from "react";

type Props = {
  params: {
    id: string;
  };
};

const page = (props: Props) => {
  const { id } = props.params;

  return <div>{id}</div>;
};

export default page;
