"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/hooks/use-request";
import { ChevronLeft, Loader2 } from "lucide-react";
import { authRepository } from "@/lib/repositories";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupSchema } from "@/lib/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const defaultValues: SignupSchema = {
  email: "",
  password: "",
  confirmPassword: "",
};

const SignupForm = () => {
  //#region Hooks

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues,
  });
  //#endregion

  //#region Requests

  const { isLoading, execute } = useRequest({
    successMessage: "Account created successfully!",
    onSuccess: () => router.push("/admin/auth/login"),
    fn: (payload: SignupSchema) => authRepository.signup(payload),
  });

  //#endregion

  //#region Render

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="self-start -ml-2 mb-2" disabled={isLoading}>
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </Button>
      <Card className="bg-background">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Enter your details below to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(execute)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input {...register("email")} id="email" type="email" placeholder="m@example.com" disabled={isLoading} className={errors.email ? "border-red-500" : ""} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input {...register("password")} id="password" type="password" disabled={isLoading} placeholder="*********" className={errors.password ? "border-red-500" : ""} />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  type="password"
                  disabled={isLoading}
                  placeholder="*********"
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
              </div>
              <Button type="submit" className="w-full" size="sm" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto font-normal"
                  onClick={(event) => {
                    event.preventDefault();
                    router.push("/admin/auth/login");
                  }}
                >
                  Log in
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  //#endregion
};

export default SignupForm;
