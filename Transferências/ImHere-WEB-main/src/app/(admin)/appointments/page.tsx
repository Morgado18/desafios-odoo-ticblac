import { Appointments } from "@/components/appointment/Appointments";
import { Card, CardTitle } from "@/components/ui/card";



export default function AppointmentsPage() {
  return (
    <div>
      <Card className="w-full p-6  shadow-none mb-8 rounded-lg">
        <div className="flex justify-between items-center">
          <CardTitle>
            Agendamentos
          </CardTitle>
          {/* <CreateAppointmentModal /> */}
        </div>
      </Card>
      <Card className="w-full p-6  shadow-none rounded-lg">
        <Appointments />
      </Card>
    </div>
  );
}
