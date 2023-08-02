import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function RecentTransports({ transports }: { transports: any[] }) {
  return (
    <div className="space-y-8">
      {transports.map((transport) => (
        <>
          <div className="flex items-center" key={transport.id}>
            <div className="space-y-2 flex-col flex">
              <Badge className="flex items-center justify-center">
                {transport.category.name}
              </Badge>
              <Badge className="flex items-center justify-center">
                {transport.vehicle.name}
              </Badge>
            </div>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {transport.creator.username}
              </p>
              <p className="text-sm text-muted-foreground">
                Dodano: {transport.createdAt.slice(0, 10)}
              </p>
            </div>
            <div className="ml-auto font-medium">
              Przedmioty: <span>{transport._count.objects}</span>
            </div>
          </div>
          <Separator />
        </>
      ))}
    </div>
  );
}
