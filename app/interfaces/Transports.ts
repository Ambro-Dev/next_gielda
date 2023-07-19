export interface NextTransportRequest {
  category: string;
  transportVehicle: string;
  type: string;
  timeAvailable: number;
  description: string;
  sendDate: Date;
  recieveDate: Date;
  objects?: {
    name: string;
    description: string;
    amount: number;
    weight: number;
    height: number;
    width: number;
    length: number;
  }[];
  directions: {
    start: {
      lat: number;
      lng: number;
    };
    finish: {
      lat: number;
      lng: number;
    };
  };
  creator: string;
}

export interface Transports {
  id: string;
  category: string;
  transportVehicle: string;
  type: string;
  timeAvailable: number;
  sendDate: Date;
  recieveDate: Date;
  description: string;
  objects?: {
    name: string;
    description: string;
    amount: number;
    weight: number;
    height: number;
    width: number;
    length: number;
  }[];
  directions: {
    start: {
      lat: number;
      lng: number;
    };
    finish: {
      lat: number;
      lng: number;
    };
  };
  creator: string;
}
