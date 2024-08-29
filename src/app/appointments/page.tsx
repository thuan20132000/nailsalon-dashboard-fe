import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";
import TableThree from "@/components/Tables/TableThree";
import TableTwo from "@/components/Tables/TableTwo";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AppointmentListTable from "./components/AppointmentListTable";

export const metadata: Metadata = {
  title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const AppointmentPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Appointments" />
      <AppointmentListTable />
    </DefaultLayout>
  );
};

export default AppointmentPage;
