import Sidebar from "@/components/Sidebar";
import {
  getAccountants,
  getAdmins,
  getEducators,
  getPsychologists,
  getTherapists,
  getUsers,
} from "@/server/users";
import ParentsTable from "@/components/tables/ParentsTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import Link from "next/link";
import Team from "@/components/Team";

type Props = {
  searchParams: { [key: string]: string | undefined };
};
const Page = async ({ searchParams }: Props) => {
  const role = searchParams.role;

  const users =
    role == "admin"
      ? await getAdmins()
      : role == "educator"
      ? await getEducators()
      : role == "accountant"
      ? await getAccountants()
      : role == "psychologist"
      ? await getPsychologists()
      : role == "therapist"
      ? await getTherapists()
      : [];

  console.log(users);
  return (
    <div className="flex h-full">
      <Sidebar active="Team" />
      <div className="container main space-y-4">
        <Team searchParams = {searchParams} users={users} />
      </div>
    </div>
  );
};

export default Page;
