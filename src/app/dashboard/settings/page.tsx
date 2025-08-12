import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function UserSettingsPage() {
  return (
    <div>
        <h1 className="text-3xl font-bold font-headline mb-6">Settings</h1>
        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive emails about new course announcements and platform updates.</p>
                    </div>
                    <Switch defaultChecked/>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                        <Label>Push Notifications</Label>
                        <p className="text-xs text-muted-foreground">Get push notifications on your devices.</p>
                    </div>
                    <Switch />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button>Save Preferences</Button>
            </CardFooter>
        </Card>
    </div>
  );
}
