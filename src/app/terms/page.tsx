export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-headline mb-8">Terms of Service</h1>
        <div className="prose max-w-none text-foreground">
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

            <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Safari Academy website (the "Service") operated by us.</p>
            
            <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.</p>

            <h2>1. Accounts</h2>
            <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>

            <h2>2. Course Enrollment and Access</h2>
            <p>When you enroll in a course, you are granted a non-exclusive, non-transferable license to access and view the course content for your personal, non-commercial purposes. You may not share your account or any course content with any other person.</p>
            
            <h2>3. Intellectual Property</h2>
            <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Safari Academy and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>

             <h2>4. Termination</h2>
            <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            
            <h2>5. Changes</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
        </div>
      </div>
    </div>
  );
}
