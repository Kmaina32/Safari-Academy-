
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray, type UseFormReturn } from "react-hook-form"
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
import { PlusCircle, Trash2 } from "lucide-react"
import { Card } from "../ui/card"
import { Switch } from "../ui/switch"
import React from "react"
import { ScrollArea } from "../ui/scroll-area"

const lessonSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(2, "Lesson title is too short."),
    content: z.string().min(10, "Lesson content is too short."),
    duration: z.string().optional(),
    videoUrl: z.string().url("Must be a valid YouTube URL.").optional().or(z.literal('')),
})

const moduleSchema = z.object({
    title: z.string().min(2, "Module title is too short."),
    imageUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
    lessons: z.array(lessonSchema).min(1, "Each module must have at least one lesson."),
})

export const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  longDescription: z.string().min(20, "Long description must be at least 20 characters."),
  instructor: z.string().min(2),
  category: z.string().min(2),
  duration: z.string().min(2),
  isFree: z.boolean().default(false),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  modules: z.array(moduleSchema).min(1, "Course must have at least one module."),
}).refine(data => data.isFree || data.price > 0, {
    message: "Price must be greater than 0 for paid courses.",
    path: ["price"],
})

export type CourseFormValues = z.infer<typeof formSchema>;

interface CourseFormProps {
    onCourseAdded: () => void;
    form: UseFormReturn<CourseFormValues>
}

export function CourseForm({ onCourseAdded, form }: CourseFormProps) {
  const { toast } = useToast()

  const { fields: moduleFields, append: appendModule, remove: removeModule } = useFieldArray({
    control: form.control,
    name: "modules"
  });

  const watchIsFree = form.watch("isFree");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        const finalPrice = values.isFree ? 0 : values.price;
        const allLessons = values.modules.flatMap((m, moduleIndex) => m.lessons.map((l, lessonIndex) => ({
            ...l,
            id: `m${moduleIndex+1}-l${lessonIndex+1}`,
            duration: l.duration || `${Math.floor(Math.random() * 10) + 5} min`
        })));

        await addDoc(collection(db, "courses"), {
            ...values,
            price: finalPrice,
            imageUrl: `https://placehold.co/600x400`,
            rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
            enrolledStudents: Math.floor(Math.random() * 1000),
            lessons: allLessons,
            modules: values.modules.map((m, moduleIndex) => ({
                ...m,
                lessons: m.lessons.map((l, lessonIndex) => ({
                    ...l,
                     id: `m${moduleIndex+1}-l${lessonIndex+1}`,
                     duration: l.duration || `${Math.floor(Math.random() * 10) + 5} min`
                }))
            })),
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ScrollArea className="h-[calc(100vh-28rem)] pr-4">
        <div className="space-y-6">
            <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Introduction to Web Development" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Short Description</FormLabel><FormControl><Textarea placeholder="A brief summary of the course..." {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="longDescription" render={({ field }) => (<FormItem><FormLabel>Full Description</FormLabel><FormControl><Textarea placeholder="A detailed description of the course content..." {...field} rows={5} /></FormControl><FormMessage /></FormItem>)} />
            <div className="flex gap-4">
                <FormField control={form.control} name="instructor" render={({ field }) => (<FormItem className="flex-1"><FormLabel>Instructor</FormLabel><FormControl><Input placeholder="Jane Smith" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="category" render={({ field }) => (<FormItem className="flex-1"><FormLabel>Category</FormLabel><FormControl><Input placeholder="Development" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="duration" render={({ field }) => (<FormItem className="flex-1"><FormLabel>Duration</FormLabel><FormControl><Input placeholder="8 weeks" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <div className="flex gap-4 items-end">
                <FormField
                    control={form.control}
                    name="isFree"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5 mr-4">
                                <FormLabel>Free Course</FormLabel>
                                <FormDescription>
                                    Is this course free?
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                {!watchIsFree && (
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="29.99" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
            </div>

            <div>
                <FormLabel>Modules & Lessons</FormLabel>
                <div className="space-y-4 mt-2">
                    {moduleFields.map((moduleField, moduleIndex) => (
                        <Card key={moduleField.id} className="p-4 bg-secondary/50 space-y-4">
                            <div className="flex justify-between items-center gap-4">
                                <FormField control={form.control} name={`modules.${moduleIndex}.title`} render={({ field }) => (<FormItem className="flex-1"><FormLabel>Module {moduleIndex + 1} Title</FormLabel><FormControl><Input placeholder="Module Title" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeModule(moduleIndex)} disabled={moduleFields.length <= 1}>
                                    <Trash2 className="h-4 w-4 text-destructive"/>
                                </Button>
                            </div>
                             <FormField control={form.control} name={`modules.${moduleIndex}.imageUrl`} render={({ field }) => (<FormItem><FormLabel>Module Image URL</FormLabel><FormControl><Input placeholder="https://placehold.co/600x400" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <LessonArray control={form.control} moduleIndex={moduleIndex} />
                        </Card>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => appendModule({ title: `Module ${moduleFields.length + 1}`, imageUrl: 'https://placehold.co/600x400', lessons: [{ title: "Lesson 1", content: "", videoUrl: "" }] })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Module
                    </Button>
                </div>
            </div>
        </div>
        </ScrollArea>
        <div className="pt-6 border-t">
          <Button type="submit">Create Course</Button>
        </div>
      </form>
    </Form>
  )
}


function LessonArray({ moduleIndex, control }: { moduleIndex: number; control: any }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `modules.${moduleIndex}.lessons`
  });

  return (
    <div className="space-y-3 pl-4 border-l-2 ml-2 border-slate-300">
        {fields.map((lessonField, lessonIndex) => (
            <div key={lessonField.id} className="p-3 bg-background rounded-md space-y-3">
                 <div className="flex justify-between items-center">
                     <h4 className="font-semibold text-sm">Lesson {lessonIndex + 1}</h4>
                     <Button type="button" variant="ghost" size="icon" onClick={() => remove(lessonIndex)} disabled={fields.length <= 1}>
                        <Trash2 className="h-4 w-4 text-destructive"/>
                    </Button>
                </div>
                <FormField control={control} name={`modules.${moduleIndex}.lessons.${lessonIndex}.title`} render={({ field }) => (<FormItem><FormLabel className="text-xs">Lesson Title</FormLabel><FormControl><Input placeholder="Lesson Title" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name={`modules.${moduleIndex}.lessons.${lessonIndex}.content`} render={({ field }) => (<FormItem><FormLabel className="text-xs">Lesson Content</FormLabel><FormControl><Textarea placeholder="Lesson details..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name={`modules.${moduleIndex}.lessons.${lessonIndex}.videoUrl`} render={({ field }) => (<FormItem><FormLabel className="text-xs">YouTube Video URL (Optional)</FormLabel><FormControl><Input placeholder="https://www.youtube.com/watch?v=..." {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => append({ title: `Lesson ${fields.length + 1}`, content: "", videoUrl: "" })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Lesson
        </Button>
    </div>
  )
}
