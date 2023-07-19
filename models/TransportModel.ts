import mongoose from "mongoose";

interface DestinationDocument extends mongoose.Document {
  place: string;
  lat: number;
  lng: number;
}

const StartDestinationSchema = new mongoose.Schema<DestinationDocument, {}>(
  {
    lat: {
      type: Number,
      required: [true, "Dodaj szerokość geograficzną"],
    },
    lng: {
      type: Number,
      required: [true, "Dodaj długość geograficzną"],
    },
  },
  { timestamps: true }
);

const EndDestinationSchema = new mongoose.Schema<DestinationDocument, {}>(
  {
    lat: {
      type: Number,
      required: [true, "Dodaj szerokość geograficzną"],
    },
    lng: {
      type: Number,

      required: [true, "Dodaj długość geograficzną"],
    },
  },
  { timestamps: true }
);

interface ObjectDocument extends mongoose.Document {
  name: string;
  description: string;
  amount: number;
  weight: number;
  height: number;
  width: number;
  length: number;
}

const ObjectSchema = new mongoose.Schema<ObjectDocument, {}>(
  {
    name: {
      type: String,
      required: [true, "Dodaj nazwę"],
    },
    description: {
      type: String,
      required: [true, "Dodaj opis"],
    },
    amount: {
      type: Number,
      required: [true, "Dodaj ilość"],
    },
    weight: {
      type: Number,
      required: [true, "Dodaj wagę"],
    },
    height: {
      type: Number,
      required: [true, "Dodaj wysokość"],
    },
    width: {
      type: Number,
      required: [true, "Dodaj szerokość"],
    },
    length: {
      type: Number,
      required: [true, "Dodaj długość"],
    },
  },
  { timestamps: true }
);

interface TransportDocument extends mongoose.Document {
  category: string;
  transportVehicle: string;
  type: string;
  timeAvailable: number;
  isAvailable: boolean;
  isDeleted: boolean;
  sendDate: Date;
  recieveDate: Date;
  description: string;
  creator: mongoose.Schema.Types.ObjectId;
  objects: ObjectDocument[];
  directions: {
    start: DestinationDocument;
    finish: DestinationDocument;
  };
}

const TransportSchema = new mongoose.Schema<TransportDocument, {}>(
  {
    category: {
      type: String,
      required: [true, "Dodaj kategorie"],
      enum: ["meble", "samochody", "elektronika", "inne"],
    },
    transportVehicle: {
      type: String,
      required: [true, "Dodaj pojazd"],
      enum: ["bus", "osobowy", "rower", "inne"],
    },
    type: {
      type: String,
      required: [true, "Dodaj typ"],
      enum: ["prywatne", "firmowe"],
    },
    timeAvailable: {
      type: Number,
      required: [true, "Dodaj czas dostępności w dniach"],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Dodaj użytkownika"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    sendDate: {
      type: Date,
      required: [true, "Dodaj datę wysłania"],
    },
    recieveDate: {
      type: Date,
      required: [true, "Dodaj datę odbioru"],
    },
    description: {
      type: String,
      required: [true, "Dodaj opis"],
    },
    objects: [ObjectSchema],
    directions: {
      start: StartDestinationSchema,
      finish: EndDestinationSchema,
    },
  },
  { timestamps: true }
);

const Transport =
  mongoose.models.Transport || mongoose.model("Transport", TransportSchema);

export default Transport as mongoose.Model<TransportDocument, {}>;
