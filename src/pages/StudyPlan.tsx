import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

// Mock data - will be replaced with real data from backend
const studyPlan = [
  { day: "Monday", subjects: ["Mathematics", "Physics"], time: "Morning" },
  { day: "Tuesday", subjects: ["Chemistry", "Biology"], time: "Afternoon" },
  { day: "Wednesday", subjects: ["English", "Literature"], time: "Evening" },
  { day: "Thursday", subjects: ["Mathematics", "Computer Science"], time: "Morning" },
  { day: "Friday", subjects: ["Physics", "Chemistry"], time: "Afternoon" },
  { day: "Saturday", subjects: ["Biology", "English"], time: "Morning" },
  { day: "Sunday", subjects: ["Review & Practice"], time: "Flexible" },
];

export default function StudyPlan() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Your 7-Day Study Plan
            </h1>
            <p className="text-lg text-muted-foreground">
              Follow this personalized schedule to stay on track with your studies
            </p>
          </div>

          <div className="space-y-4">
            {studyPlan.map((day, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      {day.day}
                    </CardTitle>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {day.time}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {day.subjects.map((subject, subIndex) => (
                      <Badge key={subIndex} variant="outline" className="text-sm py-1 px-3">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 bg-primary text-primary-foreground border-none">
            <CardContent className="py-6">
              <h3 className="text-lg font-semibold mb-2">Pro Tip!</h3>
              <p className="text-primary-foreground/90">
                Take a 5-10 minute break between subjects to stay fresh and focused.
                Remember to review your notes at the end of each study session.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
