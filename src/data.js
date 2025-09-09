import { GraduationCap, UserCheck, BookOpen, Building } from 'lucide-react';

// Mock data for the lesson management system

export const children = [
  { id: 1, name: 'Emma', age: 8, curriculum: 'Primary', avatar: '👧' },
  { id: 2, name: 'James', age: 12, curriculum: 'Lower Secondary', avatar: '👦' },
  { id: 3, name: 'Sophie', age: 16, curriculum: 'Upper Secondary', avatar: '👩' }
];

export const hiredTeachers = [
  { id: 1, name: 'Mrs. Johnson', subject: 'Mathematics', rating: 4.8, avatar: '👩‍🏫', color: 'bg-green-700', pricePerLesson: 45, lessonsToReschedule: 2, totalLessons: 12 },
  { id: 2, name: 'Mr. Smith', subject: 'English', rating: 4.9, avatar: '👨‍🏫', color: 'bg-[#6f9685]', pricePerLesson: 50, lessonsToReschedule: 1, totalLessons: 8 },
  { id: 3, name: 'Dr. Williams', subject: 'Science', rating: 4.7, avatar: '👨‍🔬', color: 'bg-green-700', pricePerLesson: 55, lessonsToReschedule: 0, totalLessons: 15 },
  { id: 4, name: 'Ms. Davis', subject: 'History', rating: 4.6, avatar: '👩‍🏫', color: 'bg-green-800', pricePerLesson: 40, lessonsToReschedule: 3, totalLessons: 10 },
  { id: 5, name: 'Prof. Brown', subject: 'Geography', rating: 4.8, avatar: '👨‍🏫', color: 'bg-[#A7C6B9]', pricePerLesson: 42, lessonsToReschedule: 1, totalLessons: 6 }
];

export const initialSubjects = [
  {
    id: 1,
    name: 'Mathematics',
    color: 'bg-blue-500',
    totalHours: 40,
    completedHours: 15,
    subSubjects: [
      { 
        id: 11, 
        name: 'Algebra', 
        totalHours: 15, 
        completedHours: 8,
        topics: [
          { id: 111, name: 'Linear Equations', completed: true },
          { id: 112, name: 'Quadratic Equations', completed: true },
          { id: 113, name: 'Polynomial Functions', completed: false },
          { id: 114, name: 'Exponential Functions', completed: false }
        ]
      },
      { 
        id: 12, 
        name: 'Geometry', 
        totalHours: 15, 
        completedHours: 5,
        topics: [
          { id: 121, name: 'Angles and Triangles', completed: true },
          { id: 122, name: 'Circles and Arcs', completed: false },
          { id: 123, name: 'Area and Perimeter', completed: false },
          { id: 124, name: 'Volume and Surface Area', completed: false }
        ]
      },
      { 
        id: 13, 
        name: 'Statistics', 
        totalHours: 10, 
        completedHours: 2,
        topics: [
          { id: 131, name: 'Mean, Median, Mode', completed: true },
          { id: 132, name: 'Probability', completed: false },
          { id: 133, name: 'Data Visualization', completed: false }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'English',
    color: 'bg-purple-500',
    totalHours: 35,
    completedHours: 22,
    subSubjects: [
      { 
        id: 21, 
        name: 'Literature', 
        totalHours: 12, 
        completedHours: 8,
        topics: [
          { id: 211, name: 'Poetry Analysis', completed: true },
          { id: 212, name: 'Short Stories', completed: true },
          { id: 213, name: 'Novel Study', completed: false },
          { id: 214, name: 'Drama and Plays', completed: false }
        ]
      },
      { 
        id: 22, 
        name: 'Grammar', 
        totalHours: 12, 
        completedHours: 9,
        topics: [
          { id: 221, name: 'Parts of Speech', completed: true },
          { id: 222, name: 'Sentence Structure', completed: true },
          { id: 223, name: 'Punctuation', completed: true },
          { id: 224, name: 'Advanced Grammar', completed: false }
        ]
      },
      { 
        id: 23, 
        name: 'Writing', 
        totalHours: 11, 
        completedHours: 5,
        topics: [
          { id: 231, name: 'Essay Writing', completed: true },
          { id: 232, name: 'Creative Writing', completed: false },
          { id: 233, name: 'Research Papers', completed: false },
          { id: 234, name: 'Letter Writing', completed: false }
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Science',
    color: 'bg-teal-500',
    totalHours: 45,
    completedHours: 18,
    subSubjects: [
      { 
        id: 31, 
        name: 'Physics', 
        totalHours: 15, 
        completedHours: 7,
        topics: [
          { id: 311, name: 'Motion and Forces', completed: true },
          { id: 312, name: 'Energy and Work', completed: true },
          { id: 313, name: 'Waves and Sound', completed: false },
          { id: 314, name: 'Electricity', completed: false }
        ]
      },
      { 
        id: 32, 
        name: 'Chemistry', 
        totalHours: 15, 
        completedHours: 6,
        topics: [
          { id: 321, name: 'Atomic Structure', completed: true },
          { id: 322, name: 'Chemical Bonds', completed: true },
          { id: 323, name: 'Chemical Reactions', completed: false },
          { id: 324, name: 'Acids and Bases', completed: false }
        ]
      },
      { 
        id: 33, 
        name: 'Biology', 
        totalHours: 15, 
        completedHours: 5,
        topics: [
          { id: 331, name: 'Cell Structure', completed: true },
          { id: 332, name: 'Genetics', completed: false },
          { id: 333, name: 'Evolution', completed: false },
          { id: 334, name: 'Ecosystems', completed: false }
        ]
      }
    ]
  },
  {
    id: 4,
    name: 'History',
    color: 'bg-amber-500',
    totalHours: 30,
    completedHours: 12,
    subSubjects: [
      { 
        id: 41, 
        name: 'World History', 
        totalHours: 18, 
        completedHours: 8,
        topics: [
          { id: 411, name: 'Ancient Civilizations', completed: true },
          { id: 412, name: 'Medieval Period', completed: true },
          { id: 413, name: 'Renaissance', completed: false },
          { id: 414, name: 'World Wars', completed: false }
        ]
      },
      { 
        id: 42, 
        name: 'Local History', 
        totalHours: 12, 
        completedHours: 4,
        topics: [
          { id: 421, name: 'Colonial Period', completed: true },
          { id: 422, name: 'Independence', completed: false },
          { id: 423, name: 'Modern Era', completed: false }
        ]
      }
    ]
  },
  {
    id: 5,
    name: 'Geography',
    color: 'bg-green-500',
    totalHours: 25,
    completedHours: 8,
    subSubjects: [
      { 
        id: 51, 
        name: 'Physical Geography', 
        totalHours: 13, 
        completedHours: 5,
        topics: [
          { id: 511, name: 'Climate and Weather', completed: true },
          { id: 512, name: 'Landforms', completed: true },
          { id: 513, name: 'Water Bodies', completed: false },
          { id: 514, name: 'Natural Disasters', completed: false }
        ]
      },
      { 
        id: 52, 
        name: 'Human Geography', 
        totalHours: 12, 
        completedHours: 3,
        topics: [
          { id: 521, name: 'Population', completed: true },
          { id: 522, name: 'Urban Development', completed: false },
          { id: 523, name: 'Economic Geography', completed: false }
        ]
      }
    ]
  }
];

export const initialBookedLessons = [
  { id: 1, teacherId: 1, day: 1, time: '14:00', duration: 60, childId: 1, subject: 'Math', type: 'tutor', subjectId: 1, recurring: false },
  { id: 2, teacherId: 2, day: 3, time: '16:00', duration: 30, childId: 2, subject: 'English', type: 'tutor', subjectId: 2, recurring: true },
  { id: 3, teacherId: 3, day: 5, time: '10:00', duration: 90, childId: 1, subject: 'Physics', type: 'tutor', subjectId: 3, recurring: true },
  { id: 4, childId: 1, day: 2, time: '09:00', duration: 60, subject: 'Mathematics', type: 'silo', subjectId: 1, recurring: false },
  { id: 5, childId: 2, day: 4, time: '11:00', duration: 30, subject: 'History', type: 'silo', subjectId: 4, recurring: false },
  { id: 6, childId: 3, day: 1, time: '08:00', duration: 120, subject: 'Classroom Learning', type: 'classroom', recurring: true },
  { id: 7, childId: 1, day: 6, time: '13:00', duration: 90, subject: 'Classroom Learning', type: 'classroom', recurring: false },
];

export const teacherAvailability = {
  1: {
    1: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    2: ['09:00', '10:00', '13:00', '14:00', '15:00'],
    3: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
    4: ['09:00', '13:00', '14:00', '15:00', '16:00'],
    5: ['09:00', '10:00', '11:00', '15:00', '16:00'],
    6: ['10:00', '11:00', '14:00', '15:00'],
    0: ['14:00', '15:00', '16:00']
  },
  2: {
    1: ['08:00', '09:00', '13:00', '15:00', '17:00'],
    2: ['09:00', '10:00', '14:00', '16:00', '17:00'],
    3: ['08:00', '09:00', '15:00', '16:00', '17:00'],
    4: ['09:00', '13:00', '14:00', '16:00', '17:00'],
    5: ['08:00', '09:00', '13:00', '15:00'],
    6: ['09:00', '10:00', '15:00', '16:00'],
    0: []
  },
  3: {
    1: ['10:00', '11:00', '15:00', '16:00', '18:00'],
    2: ['09:00', '11:00', '14:00', '17:00', '18:00'],
    3: ['10:00', '11:00', '16:00', '17:00'],
    4: ['09:00', '10:00', '15:00', '17:00', '18:00'],
    5: ['10:00', '11:00', '14:00', '15:00', '16:00'],
    6: ['11:00', '15:00', '16:00', '17:00'],
    0: ['15:00', '16:00']
  },
  4: {
    1: ['08:00', '09:00', '10:00', '14:00', '15:00'],
    2: ['09:00', '10:00', '11:00', '16:00', '17:00'],
    3: ['08:00', '09:00', '15:00', '16:00', '17:00'],
    4: ['09:00', '10:00', '14:00', '16:00', '17:00'],
    5: ['08:00', '09:00', '10:00', '15:00'],
    6: ['09:00', '10:00', '15:00', '16:00'],
    0: ['15:00', '16:00']
  },
  5: {
    1: ['10:00', '11:00', '12:00', '16:00', '17:00'],
    2: ['09:00', '10:00', '14:00', '17:00', '18:00'],
    3: ['10:00', '11:00', '15:00', '17:00'],
    4: ['09:00', '10:00', '14:00', '17:00', '18:00'],
    5: ['10:00', '11:00', '12:00', '15:00', '16:00'],
    6: ['11:00', '14:00', '16:00', '17:00'],
    0: ['14:00', '15:00']
  }
};

export const learningTypes = [
  { id: 'all', name: 'All', icon: GraduationCap },
  { id: 'tutor', name: 'Tutor Learning', icon: UserCheck },
  { id: 'silo', name: 'Silo Learning', icon: BookOpen },
  { id: 'classroom', name: 'Classroom Learning', icon: Building }
];