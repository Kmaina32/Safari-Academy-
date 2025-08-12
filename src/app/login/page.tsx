import { LoginForm } from "@/components/auth/LoginForm";
import { Logo } from "@/components/shared/Logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
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
                    Welcome back
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email to sign in to your account
                </p>
            </div>
        </CardHeader>
        <CardContent>
            <LoginForm />
            <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
            <Link
                href="/signup"
                className="hover:text-brand underline underline-offset-4"
            >
                Don't have an account? Sign Up
            </Link>
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
