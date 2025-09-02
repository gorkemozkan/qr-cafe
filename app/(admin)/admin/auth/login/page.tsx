import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login",
  description: "Login to your account",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Login",
    description: "Login to your account",
  },
  twitter: {
    title: "Login",
    description: "Login to your account",
  },
  alternates: {
    canonical: "/admin/auth/login",
  },
};

const Page = () => <LoginForm />;

export default Page;
