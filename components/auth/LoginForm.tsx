"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/app/(manage)/admin/auth/actions";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const LoginForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="self-start -ml-2 mb-2"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </Button>
      <Card className="bg-background">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  required
                  placeholder="*********"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                formAction={login}
              >
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
