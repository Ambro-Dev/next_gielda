import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./profile-form";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const getProfile = async (userId: String) => {
  const res = await fetch(
    `http://localhost:3000/api/auth/users/profile?userId=${userId}`
  );
  const data = await res.json();

  return data;
};

export default async function SettingsProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin");
  const profile = await getProfile(session.user.id);
  console.log(profile);
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profil</h3>
        <p className="text-sm text-muted-foreground">
          Tak widzą Cię inni użytkownicy.
        </p>
      </div>
      <Separator />
      <ProfileForm profile={profile.user} />
    </div>
  );
}
