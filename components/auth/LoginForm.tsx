"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import BackButton from "@/components/common/BackButton";
import Captcha from "@/components/common/Captcha";
import InputErrorMessage from "@/components/common/InputErrorMessage";
import SubmitButton from "@/components/common/SubmitButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRequest } from "@/hooks/useRequest";
import { authRepository } from "@/lib/repositories/auth-repository";
import { type LoginSchema, loginSchema } from "@/lib/schema";

const defaultValues: LoginSchema = {
  email: "",
  password: "",
  captchaToken: "",
};

const LoginForm = () => {
  //#region Hooks

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  //#endregion

  //#region Requests

  const { isLoading, execute } = useRequest({
    successMessage: "Login successful!",
    onSuccess: () => router.replace("/admin/app/dashboard"),
    mutationFn: (payload: LoginSchema) => authRepository.login(payload),
  });

  //#endregion

  return (
    <div>
      <BackButton href="/" />
      <Card className="bg-background">
        <CardHeader>
          <CardTitle id="login-title">Login to your account</CardTitle>
          <CardDescription id="login-description">Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={handleSubmit(execute)} aria-labelledby="login-title" aria-describedby="login-description" noValidate>
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
                <InputErrorMessage id="email-error">{errors.email?.message}</InputErrorMessage>
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
                <InputErrorMessage id="password-error">{errors.password?.message}</InputErrorMessage>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="captcha">Security Verification</Label>
                <Captcha
                  onError={() => setValue("captchaToken", "")}
                  onExpire={() => setValue("captchaToken", "")}
                  onVerify={(token) => setValue("captchaToken", token)}
                />
                <InputErrorMessage id="captcha-error">{errors.captchaToken?.message}</InputErrorMessage>
              </div>
              <SubmitButton isLoading={isLoading} text="Login" onClick={handleSubmit(execute)} disabled={isLoading} loadingText="Logging in..." />
              {isLoading && (
                <div id="loading-status" className="sr-only" aria-live="polite">
                  Processing login request
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
