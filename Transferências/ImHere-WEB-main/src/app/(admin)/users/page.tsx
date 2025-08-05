import { Card, CardTitle } from "@/components/ui/card";
import { CreateUserModal } from "@/components/users/CreateUserModal";
import { Users } from "@/components/users/Users";

export default function UserPage() {
  return (
    <div>
      <Card className="w-full p-6  shadow-none mb-8 rounded-lg">
        <div className="flex justify-between items-center">
          <CardTitle>
            Utilizadores
          </CardTitle>
          <CreateUserModal />
        </div>
      </Card>
      <Card className="w-full p-6  shadow-none rounded-lg">
        <Users />
      </Card>
    </div>
  )
}
