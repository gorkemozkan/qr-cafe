"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Captcha from "@/components/ui/captcha";
import { useRequest } from "@/hooks/useRequest";
import SkipLink from "@/components/auth/SkipLink";
import { ChevronLeft, Loader2 } from "lucide-react";
import { authRepository } from "@/lib/repositories";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/lib/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const defaultValues: LoginSchema = {
  email: "",
  password: "",
  captchaToken: "",
};

const LoginForm = () => {
  //#region Hooks

  const router = useRouter();

  const t = useTranslations();

  const tAuth = useTranslations("auth.login");

  const tCommon = useTranslations("common");

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
    successMessage: tAuth("successMessage"),
    onSuccess: () => router.replace("/admin/app/dashboard"),
    mutationFn: (payload: LoginSchema) => authRepository.login(payload),
  });

  //#endregion

  //#region Render

  return (
    <div>
      <SkipLink targetId="login-form">{t("auth.skipToForm", { form: t("navigation.login") })}</SkipLink>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/")}
        className="self-start -ml-2 mb-2"
        disabled={isLoading}
        aria-label={t("auth.goBackHome")}
      >
        <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
        {tCommon("back")}
      </Button>
      <Card className="bg-background">
        <CardHeader>
          <CardTitle id="login-title">{tAuth("title")}</CardTitle>
          <CardDescription id="login-description">{tAuth("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={handleSubmit(execute)} aria-labelledby="login-title" aria-describedby="login-description" noValidate>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">{tCommon("email")}</Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder={tAuth("emailPlaceholder")}
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
                <div className="flex items-center">
                  <Label htmlFor="password">{tCommon("password")}</Label>
                </div>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  disabled={isLoading}
                  placeholder={tAuth("passwordPlaceholder")}
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
                <Label htmlFor="captcha">{tAuth("securityVerification")}</Label>
                <Captcha
                  onVerify={(token) => setValue("captchaToken", token)}
                  onError={() => setValue("captchaToken", "")}
                  onExpire={() => setValue("captchaToken", "")}
                />
                {errors.captchaToken && (
                  <p id="captcha-error" className="text-sm text-red-500" role="alert" aria-live="polite">
                    {errors.captchaToken.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading} aria-describedby={isLoading ? "loading-status" : undefined}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                    {tAuth("loggingIn")}
                  </>
                ) : (
                  tAuth("loginButton")
                )}
              </Button>
              {isLoading && (
                <div id="loading-status" className="sr-only" aria-live="polite">
                  {tAuth("processingRequest")}
                </div>
              )}
              {/*      <div className="text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto font-normal"
                  onClick={(event) => {
                    event.preventDefault();
                    router.push("/admin/auth/signup");
                  }}
                  aria-label="Navigate to sign up page"
                >
                  Sign up
                </Button>
              </div> */}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  //#endregion
};

export default LoginForm;
