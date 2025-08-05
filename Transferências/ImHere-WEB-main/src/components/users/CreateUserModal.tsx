import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { CreateUserForm } from "./CreateUserForm"

export function CreateUserModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Adicionar Utilizador</Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Adicionar Utilizador</DialogTitle>
        </DialogHeader>
        <div>
          <CreateUserForm />
        </div>
      </DialogContent>
    </Dialog>
  )
}
