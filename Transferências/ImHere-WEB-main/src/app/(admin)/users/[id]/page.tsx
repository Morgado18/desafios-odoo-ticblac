import { UserDetail } from "@/components/users/UserDetail";


export default async function UserDetailPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  return (
    <div>
      <UserDetail
        id={id} />
    </div>
  )
}
