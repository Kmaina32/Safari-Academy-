
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
  role: 'Admin' | 'Student';
};

export type EnrolledCourse = {
    courseId: string;
    progress: number; // percentage
    completedLessons: number;
    totalLessons: number;
}

export type Question = {
    text: string;
    options: string[];
    correctAnswer: number; // index of the correct option
}

export type Quiz = {
    id?: string;
    title: string;
    courseId: string;
    questions: Question[];
}

export type QuizSubmission = {
    id?: string;
    quizId: string;
    userId: string;
    answers: number[]; // array of selected option indices
    score: number; // percentage
    submittedAt: Date;
}
