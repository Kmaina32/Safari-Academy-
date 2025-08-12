import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const discussions = [
    { id: 1, user: 'Jane Smith', course: 'Advanced Graphic Design', comment: 'This is a great course, but I am stuck on the photo manipulation part.', time: '2h ago' },
    { id: 2, user: 'Alex Doe', course: 'Intro to Web Development', comment: 'Where can I find the source code for lesson 2?', time: '5h ago' }
]

export default function AdminDiscussionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Discussions</CardTitle>
        <CardDescription>Moderate and manage user discussions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
            {discussions.map(d => (
                <div key={d.id} className="flex gap-4">
                    <Avatar>
                        <AvatarImage />
                        <AvatarFallback>{d.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">{d.user} <span className="font-normal text-muted-foreground">on {d.course}</span></p>
                            <p className="text-xs text-muted-foreground">{d.time}</p>
                        </div>
                        <p className="text-sm mt-1">{d.comment}</p>
                    </div>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
