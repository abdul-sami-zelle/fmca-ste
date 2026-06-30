import UserDashboardWrapper from "@/UI/Components/UserDashClient/UserDashboardWrapper";

export async function generateMetadata() {
  return {
    title: `User Dashboard - Furniture Mecca`,
    description: `Browse our Furniture Mecca collection`,
  };
}

export default async function UserDashboard({ params }) {
  const resolvedParam = await params
  return <UserDashboardWrapper id={resolvedParam.id} />
}