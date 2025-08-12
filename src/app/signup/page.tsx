import { SignupForm } from "@/components/auth/SignupForm";
import { Logo } from "@/components/shared/Logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div 
        className="flex h-screen w-screen items-center justify-center bg-cover bg-center py-8"
        style={{
            backgroundImage: "url('https://cdn.prod.website-files.com/65cb6a13e28e17a9782545c2/6628a14fd0bbecd12de2b04b_gfsb-p-1080.jpg')"
        }}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
            <div className="flex flex-col space-y-2 text-center">
                <Logo />
                <h1 className="text-2xl font-semibold tracking-tight">
                    Create an account
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your details below to create your account
                </p>
            </div>
        </CardHeader>
        <CardContent>
            <SignupForm />
            <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
            >
                Privacy Policy
            </Link>
            .
            </p>
            <p className="mt-2 px-8 text-center text-sm text-muted-foreground">
            <Link
                href="/login"
                className="hover:text-brand underline underline-offset-4"
            >
                Already have an account? Login
            </Link>
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
