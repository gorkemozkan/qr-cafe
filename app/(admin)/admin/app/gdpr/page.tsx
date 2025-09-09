import { Metadata } from "next";
import { GdprCompliance } from "@/components/gdpr/GdprCompliance";

export const metadata: Metadata = {
  title: "GDPR Compliance",
  description: "Manage your data rights under GDPR",
};

export default function GdprPage() {
  return <GdprCompliance />;
}
