
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { doc, setDoc } from "firebase/firestore"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
})

export function SignupForm() {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      agreeToTerms: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // Update user profile with name
      await updateProfile(user, {
        displayName: values.name,
      });

      // Store additional user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: values.name,
        email: values.email,
        phone: values.phone,
        createdAt: new Date(),
      });

      toast({
        title: "Account Created!",
        description: "Welcome to Safari Academy!",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="(123) 456-7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="agreeToTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I agree to the{" "}
                   <Dialog>
                        <DialogTrigger asChild>
                           <Button variant="link" className="p-0 h-auto font-medium">Terms of Service</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px]">
                            <DialogHeader>
                                <DialogTitle>Terms of Service</DialogTitle>
                                <DialogDescription>
                                    Last Updated: {new Date().toLocaleDateString()}
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="h-[50vh]">
                               <div className="prose max-w-none text-foreground p-4">
                                  <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Safari Academy website (the "Service") operated by us.</p>
                                  <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.</p>
                                  <h2>1. Accounts</h2>
                                  <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
                                  <h2>2. Course Enrollment and Access</h2>
                                  <p>When you enroll in a course, you are granted a non-exclusive, non-transferable license to access and view the course content for your personal, non-commercial purposes. You may not share your account or any course content with any other person.</p>
                                  <h2>3. Intellectual Property</h2>
                                  <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Safari Academy and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>
                                  <h2>4. Termination</h2>
                                  <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
                                  <h2>5. Changes</h2>
                                  <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
                              </div>
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>>
                </FormLabel>
                 <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Create Account</Button>
      </form>
    </Form>
  )
}
