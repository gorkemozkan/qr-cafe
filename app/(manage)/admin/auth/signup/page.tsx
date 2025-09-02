import SignupForm from "@/components/auth/SignupForm";

export const metadata = {
  title: "Signup",
  description: "Signup to your account",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Signup",
    description: "Signup to your account",
  },
  twitter: {
    title: "Signup",
    description: "Signup to your account",
  },
  alternates: {
    canonical: "/admin/auth/signup",
  },
};

const Page = () => <SignupForm />;

export default Page;
