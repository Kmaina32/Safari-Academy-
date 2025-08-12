import type { Course, EnrolledCourse, User } from './types';

export const user: User = {
  id: 'user-1',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatarUrl: 'https://placehold.co/100x100',
};

// Mock data for enrolled courses - will be replaced with real data later
export const enrolledCourses: EnrolledCourse[] = [
    {
        courseId: 'course-1', // This ID should match a document in your 'courses' collection
        progress: 75,
        completedLessons: 2,
        totalLessons: 3,
    },
    {
        courseId: 'course-3', // This ID should match a document in your 'courses' collection
        progress: 30,
        completedLessons: 1,
        totalLessons: 2,
    }
]
