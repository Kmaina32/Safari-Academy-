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
      { id: 'l1', title: 'HTML Basics', duration: '45 mins', content: '...' },
      { id: 'l2', title: 'CSS Fundamentals', duration: '1 hr 15 mins', content: '...' },
    ],
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
       { id: 'l1', title: 'Advanced Vector Art', duration: '2 hrs', content: '...' },
       { id: 'l2', title: 'Photo Manipulation', duration: '1 hr 45 mins', content: '...' },
    ],
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
        { id: 'l1', title: 'Understanding SEO', duration: '1 hr', content: '...' },
        { id: 'l2', title: 'Social Media Strategy', duration: '1 hr 30 mins', content: '...' },
    ],
  },
   {
    id: 'course-4',
    title: 'The Art of Public Speaking',
    description: 'Build confidence and deliver powerful presentations.',
    longDescription: 'Conquer your fear of public speaking and learn to command a room. This course provides practical techniques for structuring a speech, using body language effectively, and engaging your audience.',
    instructor: 'Susan orator',
    imageUrl: 'https://placehold.co/600x400',
    category: 'Personal Development',
    duration: '4 weeks',
    rating: 4.8,
    enrolledStudents: 950,
    lessons: [
        { id: 'l1', title: 'Crafting Your Message', duration: '45 mins', content: '...' },
        { id: 'l2', title: 'Delivery Techniques', duration: '1 hr', content: '...' },
    ],
  },
];

export const enrolledCourses: EnrolledCourse[] = [
    {
        courseId: 'course-1',
        progress: 75,
        completedLessons: 8
    },
    {
        courseId: 'course-3',
        progress: 30,
        completedLessons: 2
    }
]
