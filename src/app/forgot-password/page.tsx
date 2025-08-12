import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Logo } from "@/components/shared/Logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div 
        className="flex h-screen w-screen items-center justify-center bg-cover bg-center"
        style={{
            backgroundImage: "url('https://cdn.prod.website-files.com/65cb6a13e28e17a9782545c2/6628a14fd0bbecd12de2b04b_gfsb-p-1080.jpg')"
        }}
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
            <div className="flex flex-col space-y-2 text-center">
                <Logo />
                <h1 className="text-2xl font-semibold tracking-tight">
                    Forgot Password
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email to receive a reset link.
                </p>
            </div>
        </CardHeader>
        <CardContent>
            <ForgotPasswordForm />
            <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
            <Link
                href="/login"
                className="hover:text-brand underline underline-offset-4"
            >
                Remember your password? Login
            </Link>
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
