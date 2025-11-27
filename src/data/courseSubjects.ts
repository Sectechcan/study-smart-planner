export interface Subject {
  name: string;
  optional?: boolean;
}

export interface CourseSubjects {
  id: string;
  name: string;
  subjects: Subject[];
}

export const courseSubjects: CourseSubjects[] = [
  {
    id: "general-science",
    name: "General Science",
    subjects: [
      { name: "Physics" },
      { name: "Chemistry" },
      { name: "Biology" },
      { name: "Elective Mathematics" },
      { name: "ICT" },
      { name: "Core Mathematics" },
      { name: "English Language" },
      { name: "Social Studies" },
      { name: "Integrated Science" },
    ],
  },
  {
    id: "general-arts",
    name: "General Arts",
    subjects: [
      { name: "Elective Mathematics", optional: true },
      { name: "Literature in English" },
      { name: "Economics" },
      { name: "Geography" },
      { name: "Government" },
      { name: "History" },
      { name: "CRS" },
      { name: "English Language" },
      { name: "Core Mathematics" },
      { name: "Social Studies" },
      { name: "Integrated Science" },
    ],
  },
  {
    id: "business",
    name: "Business",
    subjects: [
      { name: "Accounting" },
      { name: "Business Management" },
      { name: "Economics" },
      { name: "Cost Accounting", optional: true },
      { name: "Elective Mathematics" },
      { name: "English Language" },
      { name: "Core Mathematics" },
      { name: "Social Studies" },
      { name: "Integrated Science" },
    ],
  },
  {
    id: "home-economics",
    name: "Home Economics",
    subjects: [
      { name: "Management-in-Living" },
      { name: "Food & Nutrition" },
      { name: "Clothing & Textiles" },
      { name: "Biology", optional: true },
      { name: "Elective Mathematics", optional: true },
      { name: "English Language" },
      { name: "Core Mathematics" },
      { name: "Social Studies" },
      { name: "Integrated Science" },
    ],
  },
];

// Helper function to get subjects for a specific course
export const getSubjectsForCourse = (courseId: string): Subject[] => {
  const course = courseSubjects.find((c) => c.id === courseId);
  return course?.subjects || [];
};

// Helper function to get course name by id
export const getCourseName = (courseId: string): string => {
  const course = courseSubjects.find((c) => c.id === courseId);
  return course?.name || "";
};
