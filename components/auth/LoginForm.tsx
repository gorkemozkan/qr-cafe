"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Captcha from "@/components/Captcha";
import { useRequest } from "@/hooks/useRequest";
import SkipLink from "@/components/auth/SkipLink";
import { authRepository } from "@/lib/repositories/auth-repository";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/lib/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InputErrorMessage from "@/components/InputErrorMessage";
import SubmitButton from "../SubmitButton";
import BackButton from "../BackButton";

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
      <BackButton href="/" />
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
                <InputErrorMessage id="email-error">{errors.email?.message}</InputErrorMessage>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">{tCommon("password")}</Label>
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
                <InputErrorMessage id="password-error">{errors.password?.message}</InputErrorMessage>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="captcha">{tAuth("securityVerification")}</Label>
                <Captcha
                  onVerify={(token) => setValue("captchaToken", token)}
                  onError={() => setValue("captchaToken", "")}
                  onExpire={() => setValue("captchaToken", "")}
                />
                <InputErrorMessage id="captcha-error">{errors.captchaToken?.message}</InputErrorMessage>
              </div>
              <SubmitButton
                isLoading={isLoading}
                text={tAuth("loginButton")}
                onClick={handleSubmit(execute)}
                disabled={isLoading}
                loadingText={tAuth("loggingIn")}
              />
              {isLoading && (
                <div id="loading-status" className="sr-only" aria-live="polite">
                  {tAuth("processingRequest")}
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  //#endregion
};

export default LoginForm;
