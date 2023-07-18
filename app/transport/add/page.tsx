import { AddTransportForm } from "@/components/AddTransportForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AddTransportPage = () => {
  return (
    <div className="flex w-full h-full">
      <Card className="w-full h-full pt-5">
        <CardContent>
          <AddTransportForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTransportPage;
