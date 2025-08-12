import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Settings</h1>
      <Card>
        <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <CardDescription>Manage your e-learning platform's global settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input id="platform-name" defaultValue="Safari Academy" />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                    <Label>New User Registration</Label>
                    <p className="text-xs text-muted-foreground">Allow new users to sign up.</p>
                </div>
                <Switch defaultChecked/>
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-xs text-muted-foreground">Temporarily disable access to the platform.</p>
                </div>
                <Switch />
            </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
            <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
