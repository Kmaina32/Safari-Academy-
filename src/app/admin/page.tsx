import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, BarChart } from "lucide-react";

const stats = [
    { title: "Total Students", value: "1,250", icon: Users, change: "+12%" },
    { title: "Total Courses", value: "48", icon: BookOpen, change: "+5" },
    { title: "Monthly Revenue", value: "$12,345", icon: DollarSign, change: "+8%" },
    { title: "Average Completion", value: "68%", icon: BarChart, change: "-2%" },
]

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
             <Card key={stat.title}>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
               <stat.icon className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{stat.value}</div>
               <p className="text-xs text-muted-foreground">
                 {stat.change} from last month
               </p>
             </CardContent>
           </Card>
        ))}
      </div>
      <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Activity feed will be displayed here.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
