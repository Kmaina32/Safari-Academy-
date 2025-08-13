
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { collection, addDoc, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import type { User, Course } from "@/lib/types"

const formSchema = z.object({
  userId: z.string({ required_error: "Please select a student." }),
  courseId: z.string({ required_error: "Please select a course." }),
})

interface GenerateCertificateFormProps {
    onCertificateGenerated: () => void;
    users: User[];
    courses: Course[];
}

export function GenerateCertificateForm({ onCertificateGenerated, users, courses }: GenerateCertificateFormProps) {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userId: "",
            courseId: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const course = courses.find(c => c.id === values.courseId);
            const user = users.find(u => u.id === values.userId);

            if (!course || !user) {
                toast({ title: "Error", description: "Selected user or course not found.", variant: "destructive" });
                return;
            }

            // Check if a certificate already exists for this user and course
            const q = query(collection(db, "certificates"), where("userId", "==", user.id), where("courseId", "==", values.courseId));
            const existingCert = await getDocs(q);
            if (!existingCert.empty) {
                toast({ title: "Certificate Exists", description: "A certificate for this course has already been issued to this user.", variant: "destructive" });
                return;
            }

            await addDoc(collection(db, "certificates"), {
                userId: user.id,
                userName: user.name,
                courseId: values.courseId,
                courseTitle: course.title,
                issuedAt: serverTimestamp(),
            });
            toast({
                title: "Certificate Generated!",
                description: `Certificate for ${course.title} has been issued to ${user.name}.`,
            })
            form.reset();
            onCertificateGenerated();
        } catch (e) {
            console.error("Error adding document: ", e);
            toast({
                title: "Error",
                description: "There was an error generating the certificate.",
                variant: "destructive"
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <FormField
                    control={form.control}
                    name="userId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select Student</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a student to certify" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {users.map(user => (
                                    <SelectItem key={user.id} value={user.id!}>{user.name} ({user.email})</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="courseId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select Course</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a completed course" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {courses.map(course => (
                                    <SelectItem key={course.id} value={course.id!}>{course.title}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Generate Certificate</Button>
            </form>
        </Form>
    )
}
