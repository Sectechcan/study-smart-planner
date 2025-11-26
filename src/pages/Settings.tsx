import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, User, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [theme, setTheme] = useState<"light" | "dark">(
    localStorage.getItem("theme") as "light" | "dark" || "light"
  );
  const [displayName, setDisplayName] = useState("John Doe");
  const [email] = useState("john.doe@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    toast.success(`Switched to ${newTheme} mode`);
  };

  const handleUpdateDisplayName = () => {
    if (!displayName.trim()) {
      toast.error("Display name cannot be empty");
      return;
    }
    toast.success("Display name updated successfully");
  };

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    // TODO: Integrate with Lovable Cloud authentication
    toast.success("Password updated successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Settings
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your account preferences and settings
            </p>
          </div>

          <div className="space-y-6">
            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {theme === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  Appearance
                </CardTitle>
                <CardDescription>
                  Choose your preferred theme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark theme
                    </p>
                  </div>
                  <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  View and update your account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <div className="flex gap-2">
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                    <Button onClick={handleUpdateDisplayName}>Update</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input id="email" value={email} disabled />
                  <p className="text-sm text-muted-foreground">
                    Your email address cannot be changed
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your account password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button onClick={handleUpdatePassword} className="w-full">
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
