'use client';

import UserDashboardClient from "./UserDashClient";


export default function UserDashboardWrapper({ id }) {
  return <UserDashboardClient id={id} />;
}