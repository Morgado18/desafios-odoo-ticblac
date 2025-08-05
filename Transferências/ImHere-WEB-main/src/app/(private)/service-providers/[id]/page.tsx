
import { ServiceProvidersByProfession } from "./ServiceProvidersByProfession";

export default async function ServiceProvidersByProfessionPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  return (
    <div>
      <ServiceProvidersByProfession id={id} />
    </div>
  );
}
