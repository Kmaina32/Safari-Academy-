
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Trash2 } from "lucide-react"
import { Card } from "../ui/card"

const questionSchema = z.object({
    text: z.string().min(5, "Question text must be at least 5 characters."),
    options: z.array(z.string().min(1, "Option cannot be empty.")).min(2, "Must have at least two options."),
    correctAnswer: z.coerce.number().min(0),
});

export const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  courseId: z.string({ required_error: "Please select a course." }),
  questions: z.array(questionSchema).min(1, "Must have at least one question."),
})

export type QuizFormValues = z.infer<typeof formSchema>;

interface QuizFormProps {
    onQuizHandled: () => void;
    courses: { id: string, title: string }[];
    form: UseFormReturn<QuizFormValues>;
    initialData?: QuizFormValues | null;
    quizId?: string;
}

export function QuizForm({ onQuizHandled, courses, form, initialData, quizId }: QuizFormProps) {
    const { toast } = useToast()
    const isEditing = !!initialData;

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "questions"
    });
    
    const watchedQuestions = form.watch('questions');

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (isEditing && quizId) {
                const quizRef = doc(db, "quizzes", quizId);
                await updateDoc(quizRef, values);
                toast({
                    title: "Quiz Updated!",
                    description: "The quiz has been successfully updated.",
                });
            } else {
                 await addDoc(collection(db, "quizzes"), values);
                toast({
                    title: "Quiz Created!",
                    description: "The new quiz has been successfully added.",
                })
            }
            form.reset();
            onQuizHandled();
        } catch (e) {
            console.error("Error handling document: ", e);
            toast({
                title: "Error",
                description: `There was an error ${isEditing ? 'updating' : 'creating'} the quiz.`,
                variant: "destructive"
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quiz Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Module 1 Review" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="courseId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Associated Course</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a course" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {courses.map(course => (
                                    <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4">
                    <FormLabel>Questions</FormLabel>
                    {fields.map((field, index) => {
                         const currentOptions = watchedQuestions[index]?.options || [];
                        return (
                        <Card key={field.id} className="p-4 bg-secondary">
                             <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold">Question {index + 1}</h4>
                                     <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                                        <Trash2 className="h-4 w-4 text-destructive"/>
                                    </Button>
                                </div>
                               <FormField
                                    control={form.control}
                                    name={`questions.${index}.text`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Question Text</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="What is..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {currentOptions.map((option, optionIndex) => (
                                    <FormField
                                        key={`${field.id}-option-${optionIndex}`}
                                        control={form.control}
                                        name={`questions.${index}.options.${optionIndex}`}
                                        render={({ field }) => (
                                            <FormItem>
                                                 <FormLabel>Option {optionIndex + 1}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={`Answer choice ${optionIndex + 1}`} {...field} />
                                                </FormControl>
                                                 <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                                 <Button type="button" variant="outline" size="sm" onClick={() => {
                                    const newOptions = [...currentOptions, ""];
                                    form.setValue(`questions.${index}.options`, newOptions);
                                 }}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Option
                                </Button>
                                <FormField
                                    control={form.control}
                                    name={`questions.${index}.correctAnswer`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Correct Answer</FormLabel>
                                            <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={String(field.value)}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select the correct option" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {currentOptions.map((_, i) => (
                                                        <SelectItem key={i} value={String(i)}>Option {i + 1}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </Card>
                    )})}
                     <Button type="button" variant="outline" size="sm" onClick={() => append({ text: "", options: ["", ""], correctAnswer: 0 })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Question
                    </Button>
                </div>


                <Button type="submit">{isEditing ? 'Save Changes' : 'Create Quiz'}</Button>
            </form>
        </Form>
    )
}
