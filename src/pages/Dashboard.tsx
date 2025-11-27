import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookOpen, Calendar, Settings, Trophy } from "lucide-react";
import { toast } from "sonner";
import { courseSubjects, getSubjectsForCourse } from "@/data/courseSubjects";

const timeBlocks = [
  { id: "morning", label: "Morning (6AM - 12PM)" },
  { id: "afternoon", label: "Afternoon (12PM - 6PM)" },
  { id: "evening", label: "Evening (6PM - 10PM)" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTimeBlocks, setSelectedTimeBlocks] = useState<string[]>([]);

  const availableSubjects = getSubjectsForCourse(selectedCourse);

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedSubjects([]); // Reset subjects when course changes
  };

  const handleSubjectChange = (subjectName: string, checked: boolean) => {
    if (checked) {
      setSelectedSubjects([...selectedSubjects, subjectName]);
    } else {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subjectName));
    }
  };

  const handleTimeBlockChange = (blockId: string, checked: boolean) => {
    if (checked) {
      setSelectedTimeBlocks([...selectedTimeBlocks, blockId]);
    } else {
      setSelectedTimeBlocks(selectedTimeBlocks.filter((id) => id !== blockId));
    }
  };

  const handleGenerateSchedule = () => {
    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }
    if (selectedSubjects.length === 0) {
      toast.error("Please select at least one subject");
      return;
    }
    if (selectedTimeBlocks.length === 0) {
      toast.error("Please select at least one study time");
      return;
    }
    
    toast.success("Study plan generated successfully!");
    navigate("/study-plan");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome to Your Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Set up your personalized study plan to get started
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Study Days</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Plans</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/settings")}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <Settings className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Settings</p>
                    <p className="text-lg font-semibold">Manage</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step 1: Course Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Step 1: Select Your Course</CardTitle>
              <CardDescription>
                Choose the SHS course you are currently studying
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedCourse} onValueChange={handleCourseChange}>
                <div className="grid sm:grid-cols-2 gap-3">
                  {courseSubjects.map((course) => (
                    <div key={course.id} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={course.id} id={course.id} />
                      <Label htmlFor={course.id} className="cursor-pointer flex-1">
                        {course.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Step 2: Subject Selection - Only show if course is selected */}
          {selectedCourse && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Step 2: Select Your Subjects</CardTitle>
                <CardDescription>
                  Choose the subjects you are offering (optional subjects are marked)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {availableSubjects.map((subject) => (
                    <div 
                      key={subject.name} 
                      className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={subject.name}
                        checked={selectedSubjects.includes(subject.name)}
                        onCheckedChange={(checked) => handleSubjectChange(subject.name, checked as boolean)}
                      />
                      <Label htmlFor={subject.name} className="cursor-pointer flex-1">
                        {subject.name}
                        {subject.optional && (
                          <span className="ml-2 text-xs text-muted-foreground">(Optional)</span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Time Selection - Only show if subjects are selected */}
          {selectedSubjects.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Step 3: Select Study Time</CardTitle>
                <CardDescription>
                  Choose when you prefer to study (you can select multiple times)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-3">
                  {timeBlocks.map((block) => (
                    <div key={block.id} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id={block.id}
                        checked={selectedTimeBlocks.includes(block.id)}
                        onCheckedChange={(checked) => handleTimeBlockChange(block.id, checked as boolean)}
                      />
                      <Label htmlFor={block.id} className="cursor-pointer flex-1">
                        {block.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 text-center">
            <Button size="lg" onClick={handleGenerateSchedule} className="px-8">
              Generate My Study Plan
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
