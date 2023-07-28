import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./settings-form";

export default function SettingsAccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Ustawienia</h3>
        <p className="text-sm text-muted-foreground">
          Zaktualizuj ustawienia konta. Zmień adres mailowy lub zresetuj hasło.
        </p>
      </div>
      <Separator />
      <AccountForm />
    </div>
  );
}
