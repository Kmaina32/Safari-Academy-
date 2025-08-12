import type { Course, EnrolledCourse, User } from './types';

export const user: User = {
  id: 'user-1',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatarUrl: 'https://placehold.co/100x100',
};

// Mock data for enrolled courses - will be replaced with real data later
export const enrolledCourses: EnrolledCourse[] = []
