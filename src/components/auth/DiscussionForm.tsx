
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
import { Textarea } from "@/components/ui/textarea"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 
import { db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  user: z.string().min(2, {
    message: "User name must be at least 2 characters.",
  }),
  course: z.string().min(2, {
      message: "Course name must be at least 2 characters."
  }),
  comment: z.string().min(5, {
      message: "Comment must be at least 5 characters."
  }),
})

interface DiscussionFormProps {
    onDiscussionAdded: () => void;
}

export function DiscussionForm({ onDiscussionAdded }: DiscussionFormProps) {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: "",
      course: "",
      comment: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        await addDoc(collection(db, "discussions"), {
            ...values,
            avatar: `https://placehold.co/64x64`,
            createdAt: serverTimestamp(),
        });
        toast({
            title: "Discussion Posted!",
            description: "The new discussion has been successfully created.",
        })
        form.reset();
        onDiscussionAdded();
    } catch (e) {
        console.error("Error adding document: ", e);
         toast({
            title: "Error",
            description: "There was an error posting the discussion.",
            variant: "destructive"
        })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="user"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="course"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Intro to Web Dev" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea placeholder="What's on your mind?" {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Post Discussion</Button>
      </form>
    </Form>
  )
}
