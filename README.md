
# Safari Academy - Online Learning Platform

![Safari Academy](https://placehold.co/1200x600)
*<p align="center">A modern, AI-powered e-learning platform.</p>*

---

## Description

**Safari Academy** is a comprehensive online learning platform built with Next.js, Firebase, and Google's Generative AI (Genkit). It empowers creators to build and manage in-depth courses, while providing students with an engaging and interactive learning experience.

The platform includes a rich administrative dashboard for managing all aspects of the site—from courses and users to system-wide settings like maintenance mode. The student-facing side features course discovery, enrollment, lesson progression, and progress tracking.

## Features

- **AI-Powered Course Generation**: Use generative AI to create a full course curriculum—including modules, lessons, and content—from a single topic prompt.
- **Comprehensive Admin Dashboard**:
  - Manage courses, users, quizzes, and discussions.
  - View platform analytics for revenue, enrollments, and more.
  - Issue completion certificates.
  - Control site-wide maintenance mode.
- **Student Dashboard**:
  - View enrolled courses and track progress.
  - Access certificates of completion.
  - Manage user profile and settings.
- **Rich Learning Experience**:
  - Interactive video player for lessons.
  - Paginated lesson content for easy reading.
  - Course-specific quizzes to test knowledge.
- **User Authentication**: Secure sign-up, login, and password reset functionality.
- **Modern Tech Stack**: Built with Next.js App Router, TypeScript, and styled with Tailwind CSS and shadcn/ui.

## Technologies Used

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **UI Components:** shadcn/ui
- **Backend & Database:** Firebase (Authentication, Firestore, Storage)
- **Generative AI:** Google AI (Gemini) via Genkit
- **Testing:** Jest, React Testing Library

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20.x or later recommended)
- `npm` or `yarn`

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd safari-academy
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Configuration

1.  **Set up Firebase:**
    - Create a new project in the [Firebase Console](https://console.firebase.google.com/).
    - Go to **Project settings** > **General** and find your web app's Firebase configuration object.
    - Copy this configuration into `src/lib/firebase.ts`.

2.  **Set up Google AI (for Genkit):**
    - Obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    - Create a file named `.env.local` in the root of your project.
    - Add your API key to the `.env.local` file:
      ```env
      GEMINI_API_KEY=your_api_key_here
      ```

3.  **Configure Firestore Security Rules:**
    - Go to the **Firestore Database** section in your Firebase project.
    - Navigate to the **Rules** tab.
    - Copy the contents of the `firestore.rules` file from this repository and paste them into the editor.
    - Publish the rules.

## Available Scripts

In the project directory, you can run the following commands:

-   **`npm run dev`**: Runs the app in development mode. Open [http://localhost:9002](http://localhost:9002) to view it in the browser.

-   **`npm run genkit:dev`**: Starts the Genkit development server, which is required for AI features to work. Run this in a separate terminal.

-   **`npm run build`**: Builds the app for production to the `.next` folder.

-   **`npm run start`**: Starts a Next.js production server.

-   **`npm test`**: Runs the test suite using Jest.

-   **`npm run test:watch`**: Runs the tests in interactive watch mode.

## Folder Structure

Here is an overview of the main directories and their purposes:

```
.
├── src
│   ├── app                 # Next.js App Router: pages, layouts, and routes
│   │   ├── (public)        # Publicly accessible pages
│   │   ├── admin           # Admin-only pages and layout
│   │   └── dashboard       # Logged-in user dashboard pages
│   ├── components          # Reusable React components
│   │   ├── admin           # Components specific to the admin panel
│   │   ├── auth            # Auth-related forms (Login, Signup)
│   │   ├── courses         # Course-related components (Card, Player)
│   │   ├── dashboard       # Components for the user dashboard
│   │   ├── layout          # Layout components (Header, Footer)
│   │   ├── shared          # Globally shared components (Logo, Loader)
│   │   └── ui              # Core UI components from shadcn/ui
│   ├── ai                  # Genkit AI flows and configuration
│   │   └── flows           # AI agent flows (e.g., course generation)
│   ├── hooks               # Custom React hooks (useAuth, useToast)
│   ├── lib                 # Core logic, utilities, and integrations
│   └── ...
├── public                  # Static assets (images, fonts)
├── firestore.rules         # Security rules for the Firestore database
├── jest.config.ts          # Jest testing configuration
└── ...
```
