import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Logo } from "@/components/shared/Logo";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
            <Logo />
          <h1 className="text-2xl font-semibold tracking-tight">
            Forgot Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a reset link.
          </p>
        </div>
        <ForgotPasswordForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="hover:text-brand underline underline-offset-4"
          >
            Remember your password? Login
          </Link>
        </p>
      </div>
    </div>
  );
}
