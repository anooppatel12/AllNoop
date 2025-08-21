
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

type Course = {
  name: string;
  credits: string;
  grade: string;
};

const gradePoints: { [key: string]: number } = {
  'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0,
};

export function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([{ name: '', credits: '', grade: '' }]);
  const [gpa, setGpa] = useState<number | null>(null);

  const handleCourseChange = (index: number, field: keyof Course, value: string) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
  };

  const addCourse = () => {
    setCourses([...courses, { name: '', credits: '', grade: '' }]);
  };

  const removeCourse = (index: number) => {
    const newCourses = courses.filter((_, i) => i !== index);
    setCourses(newCourses);
  };

  const calculateGpa = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      const credits = parseFloat(course.credits);
      const grade = course.grade.toUpperCase();
      const point = gradePoints[grade];

      if (!isNaN(credits) && credits > 0 && point !== undefined) {
        totalPoints += credits * point;
        totalCredits += credits;
      }
    });

    if (totalCredits > 0) {
      setGpa(totalPoints / totalCredits);
    } else {
      setGpa(null);
    }
  };

  const resetCalculator = () => {
    setCourses([{ name: '', credits: '', grade: '' }]);
    setGpa(null);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>GPA Calculator</CardTitle>
        <CardDescription>Enter your courses, credits, and grades to calculate your GPA.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {courses.map((course, index) => (
          <div key={index} className="grid grid-cols-1 items-end gap-4 rounded-lg border p-4 sm:grid-cols-[1fr_auto_auto_auto]">
            <div className="space-y-2">
              <Label htmlFor={`course-name-${index}`}>Course Name (Optional)</Label>
              <Input
                id={`course-name-${index}`}
                placeholder="e.g. Mathematics"
                value={course.name}
                onChange={(e) => handleCourseChange(index, 'name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`credits-${index}`}>Credits</Label>
              <Input
                id={`credits-${index}`}
                type="number"
                placeholder="e.g. 3"
                value={course.credits}
                onChange={(e) => handleCourseChange(index, 'credits', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`grade-${index}`}>Grade</Label>
              <Input
                id={`grade-${index}`}
                placeholder="e.g. A"
                value={course.grade}
                onChange={(e) => handleCourseChange(index, 'grade', e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeCourse(index)} aria-label="Remove course">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" onClick={addCourse}>
          <Plus className="mr-2 h-4 w-4" /> Add Course
        </Button>
        <div className="flex gap-4 pt-4">
          <Button onClick={calculateGpa} className="w-full">Calculate GPA</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {gpa !== null && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Your GPA is:</p>
            <p className="text-3xl font-bold">{gpa.toFixed(2)}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
