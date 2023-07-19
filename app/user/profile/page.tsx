import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./profile-form";

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profil</h3>
        <p className="text-sm text-muted-foreground">
          Tak widzą Cię inni użytkownicy.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
}
