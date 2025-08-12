export type Course = {
  id?: string;
  title: string;
  description: string;
  longDescription: string;
  instructor: string;
  imageUrl: string;
  category: string;
  duration: string;
  lessons: Lesson[];
  rating: number;
  enrolledStudents: number;
  modules: Module[];
};

export type Lesson = {
  id:string;
  title: string;
  duration: string;
  videoUrl?: string;
  content: string;
};

export type Module = {
  title: string;
  lessons: Lesson[];
}

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export type EnrolledCourse = {
    courseId: string;
    progress: number; // percentage
    completedLessons: number;
    totalLessons: number;
}
