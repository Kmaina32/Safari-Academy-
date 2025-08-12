import type { Course, EnrolledCourse, User } from './types';

export const user: User = {
  id: 'user-1',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatarUrl: 'https://placehold.co/100x100',
};

export const courses: Course[] = [
  {
    id: 'course-1',
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript.',
    longDescription: 'This comprehensive course covers everything you need to know to get started with web development. From basic HTML structure to advanced JavaScript concepts, you\'ll gain the skills to build modern, responsive websites.',
    instructor: 'Jane Smith',
    imageUrl: 'https://placehold.co/600x400',
    category: 'Development',
    duration: '8 weeks',
    rating: 4.8,
    enrolledStudents: 1204,
    lessons: [
      { id: 'l1-1', title: 'HTML Basics', duration: '45 mins', content: 'In this lesson, we will cover the foundational tags and structure of an HTML document.' },
      { id: 'l1-2', title: 'CSS Fundamentals', duration: '1 hr 15 mins', content: 'Learn how to style your web pages with CSS, including selectors, properties, and the box model.' },
      { id: 'l1-3', title: 'Introduction to JavaScript', duration: '1 hr 30 mins', content: 'Get started with JavaScript, the programming language of the web. We will cover variables, data types, and functions.' },
    ],
    modules: [
        { 
            title: 'Module 1: Getting Started', 
            lessons: [
                { id: 'l1-1', title: 'HTML Basics', duration: '45 mins', content: 'In this lesson, we will cover the foundational tags and structure of an HTML document.' },
                { id: 'l1-2', title: 'CSS Fundamentals', duration: '1 hr 15 mins', content: 'Learn how to style your web pages with CSS, including selectors, properties, and the box model.' },
            ]
        },
        {
            title: 'Module 2: JavaScript Essentials',
            lessons: [
                 { id: 'l1-3', title: 'Introduction to JavaScript', duration: '1 hr 30 mins', content: 'Get started with JavaScript, the programming language of the web. We will cover variables, data types, and functions.' },
            ]
        }
    ]
  },
  {
    id: 'course-2',
    title: 'Advanced Graphic Design',
    description: 'Master Adobe Photoshop and Illustrator for stunning visuals.',
    longDescription: 'Take your design skills to the next level. This course delves into advanced techniques in Adobe Photoshop and Illustrator, focusing on creating professional-grade graphics for web and print.',
    instructor: 'John Art',
    imageUrl: 'https://placehold.co/600x400',
    category: 'Design',
    duration: '12 weeks',
    rating: 4.9,
    enrolledStudents: 852,
    lessons: [
       { id: 'l2-1', title: 'Advanced Vector Art', duration: '2 hrs', content: 'Explore complex vector illustration techniques in Adobe Illustrator.' },
       { id: 'l2-2', title: 'Photo Manipulation', duration: '1 hr 45 mins', content: 'Master the art of photo manipulation and compositing in Adobe Photoshop.' },
    ],
    modules: [
        {
            title: 'Module 1: Vector Mastery',
            lessons: [
                { id: 'l2-1', title: 'Advanced Vector Art', duration: '2 hrs', content: 'Explore complex vector illustration techniques in Adobe Illustrator.' },
            ]
        },
        {
            title: 'Module 2: Photoshop Wizardry',
            lessons: [
                 { id: 'l2-2', title: 'Photo Manipulation', duration: '1 hr 45 mins', content: 'Master the art of photo manipulation and compositing in Adobe Photoshop.' },
            ]
        }
    ]
  },
  {
    id: 'course-3',
    title: 'Digital Marketing Essentials',
    description: 'Explore SEO, SMM, and content marketing strategies.',
    longDescription: 'Learn how to effectively market products and services in the digital age. This course covers the core pillars of digital marketing, including Search Engine Optimization (SEO), Social Media Marketing (SMM), and creating compelling content.',
    instructor: 'Marketeer Mike',
    imageUrl: 'https://placehold.co/600x400',
    category: 'Marketing',
    duration: '6 weeks',
    rating: 4.7,
    enrolledStudents: 2341,
    lessons: [
        { id: 'l3-1', title: 'Understanding SEO', duration: '1 hr', content: 'A deep dive into search engine optimization principles and practices.' },
        { id: 'l3-2', title: 'Social Media Strategy', duration: '1 hr 30 mins', content: 'Learn to build and execute a successful social media marketing plan.' },
    ],
     modules: [
        {
            title: 'Module 1: Core Concepts',
            lessons: [
                { id: 'l3-1', title: 'Understanding SEO', duration: '1 hr', content: 'A deep dive into search engine optimization principles and practices.' },
                { id: 'l3-2', title: 'Social Media Strategy', duration: '1 hr 30 mins', content: 'Learn to build and execute a successful social media marketing plan.' },
            ]
        }
    ]
  },
   {
    id: 'course-4',
    title: 'The Art of Public Speaking',
    description: 'Build confidence and deliver powerful presentations.',
    longDescription: 'Conquer your fear of public speaking and learn to command a room. This course provides practical techniques for structuring a speech, using body language effectively, and engaging your audience.',
    instructor: 'Susan Orator',
    imageUrl: 'https://placehold.co/600x400',
    category: 'Personal Development',
    duration: '4 weeks',
    rating: 4.8,
    enrolledStudents: 950,
    lessons: [
        { id: 'l4-1', title: 'Crafting Your Message', duration: '45 mins', content: 'Learn how to structure a compelling narrative for your speech.' },
        { id: 'l4-2', title: 'Delivery Techniques', duration: '1 hr', content: 'Practice vocal variety, pacing, and body language to engage your audience.' },
    ],
    modules: [
        {
            title: 'Module 1: The Foundation',
            lessons: [
                { id: 'l4-1', title: 'Crafting Your Message', duration: '45 mins', content: 'Learn how to structure a compelling narrative for your speech.' },
                { id: 'l4-2', title: 'Delivery Techniques', duration: '1 hr', content: 'Practice vocal variety, pacing, and body language to engage your audience.' },
            ]
        }
    ]
  },
];

export const enrolledCourses: EnrolledCourse[] = [
    {
        courseId: 'course-1',
        progress: 75,
        completedLessons: 2,
        totalLessons: 3,
    },
    {
        courseId: 'course-3',
        progress: 30,
        completedLessons: 1,
        totalLessons: 2,
    }
]
