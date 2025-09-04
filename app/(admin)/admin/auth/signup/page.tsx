import { notFound } from "next/navigation";

export const metadata = {
  title: "Page Not Found",
  description: "The requested page was not found",
  robots: {
    index: false,
    follow: false,
  },
};

const Page = () => {
  notFound();
};

export default Page;
