import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">Contact Us</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" placeholder="John Doe"/>
            </div>
             <div className="space-y-2">
                <Label htmlFor="email">Your Email</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com"/>
            </div>
          </div>
           <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Question about a course"/>
            </div>
          <div className="space-y-2">
            <Label htmlFor="message">Your Message</Label>
            <Textarea id="message" rows={6} placeholder="Please describe your inquiry..."/>
          </div>
          <Button type="submit" size="lg" className="w-full">Send Message</Button>
        </form>
      </div>
    </div>
  );
}
