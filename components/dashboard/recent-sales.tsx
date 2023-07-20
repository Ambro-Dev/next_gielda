import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>JK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Jan Kowalski</p>
          <p className="text-sm text-muted-foreground">
            jan.kowalski@email.com
          </p>
        </div>
        <div className="ml-auto font-medium">+99</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/avatars/02.png" alt="Avatar" />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Julia lipka</p>
          <p className="text-sm text-muted-foreground">julia.lipka@email.com</p>
        </div>
        <div className="ml-auto font-medium">+69</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Avatar" />
          <AvatarFallback>IN</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Izabela Nos</p>
          <p className="text-sm text-muted-foreground">izabela.nos@email.com</p>
        </div>
        <div className="ml-auto font-medium">+59</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/04.png" alt="Avatar" />
          <AvatarFallback>WK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Wiesław Kapeć</p>
          <p className="text-sm text-muted-foreground">wieska@email.com</p>
        </div>
        <div className="ml-auto font-medium">+49</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/05.png" alt="Avatar" />
          <AvatarFallback>SD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Szymon Dom</p>
          <p className="text-sm text-muted-foreground">szymdom@email.com</p>
        </div>
        <div className="ml-auto font-medium">+33</div>
      </div>
    </div>
  );
}
