export interface NextTransportRequest {
  category: string;
  transportVehicle: string;
  type: string;
  timeAvailable: number;
  description: string;
  sendDate: Date;
  receiveDate: Date;
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
  receiveDate: Date;
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
