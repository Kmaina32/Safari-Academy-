
'use server';
/**
 * @fileOverview An AI flow for generating comprehensive course content.
 *
 * - generateCourse - A function that creates a course structure based on a topic.
 * - CourseGeneratorInput - The input type for the generateCourse function.
 * - CourseGeneratorOutput - The return type for the generateCourse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CourseGeneratorInputSchema = z.object({
  topic: z.string().describe('The topic for the course to be generated.'),
});
export type CourseGeneratorInput = z.infer<typeof CourseGeneratorInputSchema>;

const LessonSchema = z.object({
    title: z.string().describe("The title of the lesson."),
    duration: z.string().describe("The estimated duration of the lesson (e.g., '15 min')."),
    content: z.string().describe("A detailed summary or script for the lesson content."),
    videoUrl: z.string().optional().describe("An optional URL for a relevant YouTube video."),
});

const ModuleSchema = z.object({
    title: z.string().describe("The title of the module."),
    lessons: z.array(LessonSchema).describe("A list of lessons within this module."),
});

const CourseGeneratorOutputSchema = z.object({
  title: z.string().describe('A creative and engaging title for the course.'),
  description: z.string().describe('A concise, one-sentence summary of the course.'),
  longDescription: z.string().describe('A detailed, paragraph-long description of the course, its objectives, and what students will learn.'),
  instructor: z.string().describe("The name of a fictional, plausible-sounding instructor for this course."),
  category: z.string().describe('A relevant category for the course (e.g., "Development", "Design", "Business").'),
  duration: z.string().describe("The total estimated duration of the course (e.g., '8 weeks', '12 hours')."),
  modules: z.array(ModuleSchema).describe("A list of modules that make up the course curriculum."),
});
export type CourseGeneratorOutput = z.infer<typeof CourseGeneratorOutputSchema>;

export async function generateCourse(input: CourseGeneratorInput): Promise<CourseGeneratorOutput> {
  return courseGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'courseGeneratorPrompt',
  input: {schema: CourseGeneratorInputSchema},
  output: {schema: CourseGeneratorOutputSchema},
  prompt: `You are an expert curriculum designer for an online learning platform called "Safari Academy". Your task is to generate a comprehensive and engaging course structure based on a given topic.

The course should be well-structured, with logical modules and lessons. The content should be practical and informative.

Create a course about: {{{topic}}}

Please generate all the required fields, including a full set of modules and lessons. Ensure the lesson content is detailed enough to be useful.
`,
});

const courseGeneratorFlow = ai.defineFlow(
  {
    name: 'courseGeneratorFlow',
    inputSchema: CourseGeneratorInputSchema,
    outputSchema: CourseGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
