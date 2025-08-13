
import type { Course, EnrolledCourse, User } from './types';

export const user: User = {
  id: 'user-1',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatarUrl: 'https://placehold.co/100x100',
  role: 'Student',
};

// Mock data for enrolled courses - will be replaced with real data later
export const enrolledCourses: EnrolledCourse[] = []


export const sampleCourses: Omit<Course, 'id'>[] = [
    {
        title: "Introduction to Web Development",
        description: "Learn the fundamentals of web development, including HTML, CSS, and JavaScript.",
        longDescription: "This comprehensive course covers everything you need to know to start building modern websites. From basic HTML structure to advanced CSS layouts and interactive JavaScript, you'll gain the hands-on experience needed for a career in web development.",
        instructor: "John Doe",
        imageUrl: "https://placehold.co/600x400?text=Web+Dev",
        category: "Development",
        duration: "10 weeks",
        rating: 4.7,
        enrolledStudents: 1250,
        price: 49.99,
        status: 'Published',
        targetAudience: 'Beginners',
        prerequisites: 'None',
        modules: [
            {
                title: "Module 1: Getting Started",
                imageUrl: "https://placehold.co/600x400",
                lessons: [
                    { id: "m1-l1", title: "HTML Basics", duration: "12 min", content: "Learn the basic structure of HTML pages." },
                    { id: "m1-l2", title: "CSS Fundamentals", duration: "18 min", content: "Discover how to style your web pages with CSS." },
                ]
            },
            {
                title: "Module 2: JavaScript Essentials",
                 imageUrl: "https://placehold.co/600x400",
                lessons: [
                    { id: "m2-l1", title: "JavaScript Variables", duration: "15 min", content: "Understand variables and data types in JavaScript." }
                ]
            }
        ]
    },
    {
        title: "Advanced Graphic Design",
        description: "Take your design skills to the next level with Adobe Photoshop and Illustrator.",
        longDescription: "In this course, you'll master the tools and techniques used by professional graphic designers. Learn about color theory, typography, and composition while working on real-world projects.",
        instructor: "Jane Smith",
        imageUrl: "https://placehold.co/600x400?text=Design",
        category: "Design",
        duration: "8 weeks",
        rating: 4.9,
        enrolledStudents: 850,
        price: 99.99,
        status: 'Published',
        targetAudience: 'Intermediate Designers',
        prerequisites: 'Basic design knowledge',
        modules: [
            {
                title: "Module 1: Photoshop Deep Dive",
                 imageUrl: "https://placehold.co/600x400",
                lessons: [
                     { id: "m1-l1", title: "Photoshop Mastery", duration: "25 min", content: "Advanced photo editing and manipulation techniques." },
                ]
            },
            {
                title: "Module 2: Illustrator for Experts",
                 imageUrl: "https://placehold.co/600x400",
                lessons: [
                     { id: "m2-l1", title: "Vector Art with Illustrator", duration: "30 min", content: "Create stunning vector illustrations from scratch." },
                ]
            }
        ]
    },
     {
        title: "The Art of Public Speaking",
        description: "Master the art of public speaking and deliver confident, compelling presentations.",
        longDescription: "Whether you're speaking to a small group or a large audience, this course will equip you with the skills to engage and persuade. Learn how to structure your speech, use body language effectively, and overcome stage fright.",
        instructor: "Alex Johnson",
        imageUrl: "https://placehold.co/600x400?text=Speaking",
        category: "Personal Development",
        duration: "4 weeks",
        rating: 4.6,
        enrolledStudents: 500,
        price: 29.99,
        status: 'Published',
        targetAudience: 'Anyone',
        prerequisites: 'None',
        modules: [
            {
                title: "Module 1: Speechwriting",
                 imageUrl: "https://placehold.co/600x400",
                lessons: [
                    { id: "m1-l1", title: "Crafting Your Message", duration: "20 min", content: "Learn how to structure a compelling narrative." },
                ]
            },
            {
                title: "Module 2: Performance",
                 imageUrl: "https://placehold.co/600x400",
                lessons: [
                    { id: "m2-l1", title: "Confident Delivery", duration: "22 min", content: "Techniques for confident and engaging delivery." },
                ]
            }
        ]
    }
];
