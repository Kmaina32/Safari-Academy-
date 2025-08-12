"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { collection, addDoc } from "firebase/firestore"; 
import { db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"


const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
      message: "Description must be at least 10 characters."
  }),
  longDescription: z.string().min(20, {
      message: "Long description must be at least 20 characters."
  }),
  instructor: z.string().min(2),
  category: z.string().min(2),
  duration: z.string().min(2),
})

interface CourseFormProps {
    onCourseAdded: () => void;
}

const generateLessons = (moduleId: number) => {
    return Array.from({length: 5}, (_, i) => ({
        id: `m${moduleId}-l${i+1}`,
        title: `Lesson ${i+1} of Module ${moduleId}`,
        duration: `${Math.floor(Math.random() * 10) + 5} min`,
        content: `This is the detailed content for lesson ${i+1}. Students will learn key concepts and practical skills.`,
        videoUrl: ''
    }))
}

const generateModules = () => {
    return Array.from({length: 3}, (_, i) => ({
        title: `Module ${i+1}: Getting Started`,
        lessons: generateLessons(i+1)
    }))
}

export function CourseForm({ onCourseAdded }: CourseFormProps) {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      longDescription: "",
      instructor: "",
      category: "",
      duration: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        const modules = generateModules();
        const allLessons = modules.flatMap(m => m.lessons);

        await addDoc(collection(db, "courses"), {
            ...values,
            imageUrl: `https://placehold.co/600x400?text=${values.title.replace(/\s/g, '+')}`,
            rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // Random rating between 3.5 and 5.0
            enrolledStudents: Math.floor(Math.random() * 1000),
            lessons: allLessons,
            modules: modules,
        });
        toast({
            title: "Course Created!",
            description: "The new course has been successfully added.",
        })
        form.reset();
        onCourseAdded();
    } catch (e) {
        console.error("Error adding document: ", e);
         toast({
            title: "Error",
            description: "There was an error creating the course.",
            variant: "destructive"
        })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Introduction to Web Development" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief summary of the course..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="longDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A detailed description of the course content..." {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instructor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructor</FormLabel>
              <FormControl>
                <Input placeholder="Jane Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem className="flex-1">
                <FormLabel>Category</FormLabel>
                <FormControl>
                    <Input placeholder="Development" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
                <FormItem className="flex-1">
                <FormLabel>Duration</FormLabel>
                <FormControl>
                    <Input placeholder="8 weeks" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <Button type="submit">Create Course</Button>
      </form>
    </Form>
  )
}
