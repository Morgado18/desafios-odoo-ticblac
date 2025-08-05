import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"

export function CreateAppointmentModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>

      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Criar  Agendamento</DialogTitle>
        </DialogHeader>
        <div>
          {/* <CreateAppointmentForm /> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
