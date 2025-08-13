
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal } from "lucide-react";

export default function AdminTestsPage() {
  const npmTestCommand = `npm test`;
  const npmTestWatchCommand = `npm run test:watch`;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Running Tests</h1>
      <p className="text-muted-foreground">
        This page provides instructions on how to run the project's automated tests.
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Testing Environment</CardTitle>
          <CardDescription>
            Tests are run using Jest and React Testing Library directly from your command-line interface (CLI) in your project's root directory. They cannot be executed from the browser for security reasons.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Run All Tests Once</h3>
            <p className="text-sm text-muted-foreground mb-2">
              To run the entire test suite once and see the results, use the following command:
            </p>
            <div className="bg-muted p-3 rounded-md font-mono text-sm flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              <span>{npmTestCommand}</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Run Tests in Watch Mode</h3>
            <p className="text-sm text-muted-foreground mb-2">
              For active development, it's often more useful to run tests in "watch mode." This will automatically re-run tests when you save changes to a file.
            </p>
            <div className="bg-muted p-3 rounded-md font-mono text-sm flex items-center gap-2">
               <Terminal className="h-4 w-4" />
               <span>{npmTestWatchCommand}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
