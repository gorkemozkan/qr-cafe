"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Captcha from "@/components/ui/captcha";
import { useRequest } from "@/hooks/use-request";
import SkipLink from "@/components/auth/SkipLink";
import { ChevronLeft, Loader2 } from "lucide-react";
import { authRepository } from "@/lib/repositories";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupSchema } from "@/lib/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const defaultValues: SignupSchema = {
  email: "",
  password: "",
  confirmPassword: "",
  captchaToken: "",
};

const SignupForm = () => {
  //#region Hooks

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
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
    mutationFn: (payload: SignupSchema) => authRepository.signup(payload),
  });

  //#endregion

  //#region Render

  return (
    <div>
      <SkipLink targetId="signup-form">Skip to signup form</SkipLink>
      <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="self-start -ml-2 mb-2" disabled={isLoading} aria-label="Go back to home page">
        <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
        Back
      </Button>
      <Card className="bg-background">
        <CardHeader>
          <CardTitle id="signup-title">Create your account</CardTitle>
          <CardDescription id="signup-description">Enter your details below to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="signup-form" onSubmit={handleSubmit(execute)} aria-labelledby="signup-title" aria-describedby="signup-description" noValidate>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  disabled={isLoading}
                  className={errors.email ? "border-red-500" : ""}
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  aria-label="Email address"
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-500" role="alert" aria-live="polite">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  disabled={isLoading}
                  placeholder="*********"
                  className={errors.password ? "border-red-500" : ""}
                  aria-required="true"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  aria-label="Password"
                />
                {errors.password && (
                  <p id="password-error" className="text-sm text-red-500" role="alert" aria-live="polite">
                    {errors.password.message}
                  </p>
                )}
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
                  aria-required="true"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                  aria-label="Confirm password"
                />
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className="text-sm text-red-500" role="alert" aria-live="polite">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="captcha">Security Verification</Label>
                <Captcha onVerify={(token) => setValue("captchaToken", token)} onError={() => setValue("captchaToken", "")} onExpire={() => setValue("captchaToken", "")} />
                {errors.captchaToken && (
                  <p id="captcha-error" className="text-sm text-red-500" role="alert" aria-live="polite">
                    {errors.captchaToken.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" size="sm" disabled={isLoading} aria-describedby={isLoading ? "loading-status" : undefined}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              {isLoading && (
                <div id="loading-status" className="sr-only" aria-live="polite">
                  Processing account creation request
                </div>
              )}
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
                  aria-label="Navigate to login page"
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
