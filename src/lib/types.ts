
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
  price: number; // 0 for free
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
  imageUrl: string;
}

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
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

export type Assignment = {
    id?: string;
    title: string;
    courseId: string;
    questions: Question[];
}

export type AssignmentSubmission = {
    id?: string;
    assignmentId: string;
    userId: string;
    answers: number[]; // array of selected option indices
    score: number; // percentage
    submittedAt: Date;
}

export type Payment = {
    id?: string;
    userId: string;
    courseId: string;
    amount: number;
    currency: string; // e.g., 'USD'
    status: 'succeeded' | 'pending' | 'failed';
    paymentMethod: string; // e.g., 'card', 'paypal'
    transactionId: string; // From the payment provider
    createdAt: Date;
}

export type Certificate = {
    id?: string;
    userId: string;
    userName: string;
    courseId: string;
    courseTitle: string;
    issuedAt: {
        seconds: number;
        nanoseconds: number;
    };
}
