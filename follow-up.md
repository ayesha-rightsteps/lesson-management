# Lesson Management System - Complete Code Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture & Structure](#architecture--structure)
3. [Data Flow](#data-flow)
4. [State Management](#state-management)
5. [Core Features](#core-features)
6. [Component Breakdown](#component-breakdown)
7. [Event Handling](#event-handling)
8. [Utility Functions](#utility-functions)
9. [Styling System](#styling-system)
10. [How to Make Changes](#how-to-make-changes)

## Overview

The Lesson Management System is a React-based application for managing educational lessons across different learning types (tutor, silo, classroom). It provides calendar views, lesson booking, subject tracking, and progress monitoring.

### Key Technologies
- **React**: Component-based UI framework
- **React Hooks**: State management (useState)
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first CSS framework

## Architecture & Structure

### File Organization
```
src/
├── lesson.jsx          # Main component (all functionality)
├── data.js            # Static data and configurations
└── follow-up.md       # This documentation
```

### Component Structure
The entire application is a single component (`LessonManagementSystem`) with multiple render functions:

```
LessonManagementSystem
├── Constants & State
├── Utility Functions
├── Event Handlers
├── Render Functions
│   ├── renderDayView()
│   ├── renderMonthView()
│   ├── renderCalendarGrid()
│   ├── renderTutorsTab()
│   ├── renderSidebarCalendar()
│   ├── renderSidebar()
│   └── renderBookingModal()
└── Main JSX Return
```

## Data Flow

### 1. Data Sources (data.js)
```javascript
// External data imported into component
children          // Student profiles
hiredTeachers     // Teacher information
initialSubjects   // Subject hierarchy with topics
initialBookedLessons // Pre-existing lessons
teacherAvailability  // Teacher schedules
learningTypes     // Learning mode configurations
```

### 2. State Flow
```
User Action → Event Handler → State Update → UI Re-render
```

### 3. Data Transformation Pipeline
```
Raw Data → Filtering (child, type, recurrence) → Display
```

## State Management

### State Categories

#### 1. Child and Selection States
```javascript
const [selectedChild, setSelectedChild] = useState(0);
```
- **Purpose**: Tracks which child's lessons are being viewed
- **Type**: Number (index into children array)
- **Usage**: Filters all lesson data to show only selected child

#### 2. Calendar and Date States
```javascript
const [currentWeek, setCurrentWeek] = useState(new Date());
const [selectedDay, setSelectedDay] = useState(new Date());
const [sidebarCalendarMonth, setSidebarCalendarMonth] = useState(new Date());
const [calendarView, setCalendarView] = useState('week');
const [recurrenceView, setRecurrenceView] = useState('single');
```
- **currentWeek**: Controls main calendar display week
- **selectedDay**: Specific day selection for day view
- **sidebarCalendarMonth**: Controls sidebar mini-calendar
- **calendarView**: 'day'|'week'|'month' - determines calendar layout
- **recurrenceView**: 'single'|'recurring' - filters lesson display

#### 3. Learning Type States
```javascript
const [learningType, setLearningType] = useState('all');
const [enabledLearningTypes, setEnabledLearningTypes] = useState({...});
```
- **learningType**: Current active learning mode ('all'|'tutor'|'silo'|'classroom')
- **enabledLearningTypes**: Toggle states for each learning type

#### 4. Booking and Modal States
```javascript
const [selectedSlot, setSelectedSlot] = useState(null);
const [showBookingModal, setShowBookingModal] = useState(false);
const [bookingDetails, setBookingDetails] = useState({...});
```
- **selectedSlot**: Contains day, time, and available teachers for booking
- **showBookingModal**: Controls booking popup visibility
- **bookingDetails**: Form data for lesson booking (duration, teacher, recurring)

#### 5. UI Interaction States
```javascript
const [showChildDropdown, setShowChildDropdown] = useState(false);
const [showTutorMenu, setShowTutorMenu] = useState(null);
const [hoveredSlot, setHoveredSlot] = useState(null);
const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
```
- **showChildDropdown**: Child selector dropdown visibility
- **showTutorMenu**: Which tutor's menu is open (null = closed)
- **hoveredSlot**: Currently hovered calendar slot for tooltip
- **tooltipPosition**: Tooltip coordinates

#### 6. Drag and Drop States
```javascript
const [draggedSubject, setDraggedSubject] = useState(null);
const [dragOverSlot, setDragOverSlot] = useState(null);
```
- **draggedSubject**: Currently dragged topic/subject data
- **dragOverSlot**: Calendar slot being dragged over

#### 7. Expansion States
```javascript
const [expandedSubjects, setExpandedSubjects] = useState({});
const [expandedSubSubjects, setExpandedSubSubjects] = useState({});
```
- **expandedSubjects**: Which main subjects are expanded (subject.id → boolean)
- **expandedSubSubjects**: Which sub-subjects show topics (subSubject.id → boolean)

#### 8. Data States
```javascript
const [subjects, setSubjects] = useState(initialSubjects);
const [bookedLessons, setBookedLessons] = useState(initialBookedLessons);
```
- **subjects**: Subject hierarchy with completion tracking
- **bookedLessons**: All lesson bookings with metadata

## Core Features

### 1. Multi-View Calendar System

#### Day View
```javascript
const renderDayView = () => {
  const selectedDayIndex = selectedDay.getDay() === 0 ? 6 : selectedDay.getDay() - 1;
  // Shows: Single day, all 48 time slots (00:00-23:30)
}
```
- **Grid**: Time slots × Single day
- **Time Range**: 00:00 to 23:30 (30-minute intervals)
- **Features**: Lesson display, booking, drag-drop

#### Week View
```javascript
const renderCalendarGrid = () => {
  // Shows: 7 days × Time slots
}
```
- **Grid**: Time slots × 7 days
- **Time Range**: All 48 slots
- **Features**: Full weekly overview

#### Month View
```javascript
const renderMonthView = () => {
  // Shows: Monthly calendar with lesson counts
}
```
- **Grid**: Calendar month layout
- **Features**: Lesson overview, navigation

### 2. Learning Type System

#### Types Available
1. **All**: Shows all lesson types
2. **Tutor**: One-on-one with hired teachers
3. **Silo**: Self-study with topic tracking
4. **Classroom**: Group learning sessions

#### Filtering Logic
```javascript
const getFilteredLessons = () => {
  let filteredByType = currentChildLessons;
  if (learningType !== 'all') {
    filteredByType = currentChildLessons.filter(lesson => lesson.type === learningType);
  }
  
  // Additional recurrence filtering
  return filteredByType.filter(lesson => {
    if (recurrenceView === 'single') return !lesson.recurring;
    if (recurrenceView === 'recurring') return lesson.recurring;
    return true;
  });
};
```

### 3. Lesson Booking System

#### Tutor Booking Flow
1. **Click slot** → `handleSlotClick()`
2. **Check availability** → `getAvailableTeachers()`
3. **Show modal** → `setShowBookingModal(true)`
4. **Select options** → Update `bookingDetails`
5. **Confirm** → `handleBookLesson()`

#### Recurring Lessons
```javascript
if (bookingDetails.recurring) {
  for (let i = 0; i < RECURRING_WEEKS_COUNT; i++) {
    recurringLessons.push({...baseLesson, id: Date.now() + i, weekOffset: i});
  }
}
```

### 4. Subject & Topic Management

#### Hierarchy Structure
```
Subject (Math, English, etc.)
├── Sub-Subject (Algebra, Geometry)
│   ├── Topic 1 (Linear Equations) ✓
│   ├── Topic 2 (Quadratic Equations) ✓
│   └── Topic 3 (Polynomials) ⭕
```

#### Drag & Drop Logic
1. **Start drag** → Store topic data in `draggedSubject`
2. **Drag over slot** → Visual feedback via `dragOverSlot`
3. **Drop** → Create silo lesson + mark topic complete

#### Completion Tracking
```javascript
const markTopicAsCompleted = (topicId, subjectId, subSubjectId) => {
  setSubjects(prevSubjects => 
    prevSubjects.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          subSubjects: subject.subSubjects.map(subSubject => {
            if (subSubject.id === subSubjectId) {
              return {
                ...subSubject,
                topics: subSubject.topics.map(topic => 
                  topic.id === topicId ? { ...topic, completed: true } : topic
                )
              };
            }
            return subSubject;
          })
        };
      }
      return subject;
    })
  );
};
```

## Component Breakdown

### Main Layout Structure
```jsx
<div className="min-h-screen bg-white flex overflow-hidden">
  {/* Tutor Availability Tooltip */}
  {hoveredSlot && <Tooltip />}
  
  {/* Sidebar */}
  <div className="w-80 bg-white border-r">
    {renderSidebar()}
  </div>
  
  {/* Main Content */}
  <div className="flex-1">
    {/* Header with controls */}
    <div className="bg-white border-b">
      {/* Learning type toggles */}
      {/* Child selector */}
    </div>
    
    {/* Tutor tabs (if tutor mode) */}
    {learningType === 'tutor' && <TutorTabs />}
    
    {/* Calendar view controls */}
    <div className="bg-white border-b">
      {/* Day/Week/Month selector */}
      {/* Navigation buttons */}
      {/* Single/Recurring toggle */}
    </div>
    
    {/* Calendar content */}
    <div className="flex-1">
      {calendarView === 'day' ? renderDayView() : 
       calendarView === 'month' ? renderMonthView() : 
       renderCalendarGrid()}
    </div>
  </div>
  
  {/* Modals */}
  {renderBookingModal()}
</div>
```

### Sidebar Components
```jsx
const renderSidebar = () => (
  <div className="p-6 space-y-6">
    {/* Header */}
    <div>
      <h1>Lesson Management</h1>
      <p>Managing {learningType} for {selectedChild}</p>
    </div>
    
    {/* Mini Calendar */}
    {renderSidebarCalendar()}
    
    {/* Color Legend (All view) */}
    {learningType === 'all' && <Legend />}
    
    {/* Silo Learning Hint */}
    {learningType === 'silo' && <SiloHint />}
    
    {/* Subject Cards (Silo) */}
    {learningType === 'silo' && <SubjectCards />}
    
    {/* Teacher List (Tutor) */}
    {learningType === 'tutor' && <TeacherList />}
    
    {/* Weekly Summary */}
    <WeeklySummary />
  </div>
);
```

## Event Handling

### 1. Calendar Interactions

#### Slot Clicking
```javascript
const handleSlotClick = (dayIndex, timeSlot) => {
  if (learningType === 'tutor') {
    const availableTeachers = getAvailableTeachers(dayIndex, timeSlot);
    if (availableTeachers.length > 0) {
      setSelectedSlot({ dayIndex, timeSlot, availableTeachers });
      setShowBookingModal(true);
    }
  }
};
```

#### Navigation
```javascript
const navigateWeek = (direction) => {
  const newDate = new Date(selectedDay);
  newDate.setDate(newDate.getDate() + (direction * 7));
  setCurrentWeek(newDate);
  setSelectedDay(newDate);
};
```

### 2. Drag and Drop Events

#### Drag Start
```javascript
onDragStart={() => {
  if (!topic.completed) {
    setDraggedSubject({ 
      ...topic, 
      topicId: topic.id,
      parentSubject: subject.name,
      subjectId: subject.id,
      subSubjectId: subSubject.id
    });
  }
}}
```

#### Drop Handling
```javascript
const handleDrop = (e, dayIndex, timeSlot) => {
  e.preventDefault();
  if (draggedSubject && learningType === 'silo') {
    const newLesson = {
      id: Date.now(),
      childId: children[selectedChild].id,
      day: dayIndex,
      time: timeSlot,
      type: 'silo',
      subject: `${draggedSubject.parentSubject} - ${draggedSubject.name}`
    };
    
    setBookedLessons(prev => [...prev, newLesson]);
    
    // Mark topic as completed
    if (draggedSubject.topicId) {
      markTopicAsCompleted(draggedSubject.topicId, draggedSubject.subjectId, draggedSubject.subSubjectId);
    }
  }
};
```

### 3. Form Handling

#### Learning Type Toggle
```javascript
const handleLearningTypeToggle = (typeId) => {
  const newEnabledTypes = {
    all: false, tutor: false, silo: false, classroom: false
  };
  newEnabledTypes[typeId] = true;
  
  setEnabledLearningTypes(newEnabledTypes);
  setLearningType(typeId);
};
```

#### Booking Form
```javascript
const handleBookLesson = () => {
  const baseLesson = {
    childId: children[selectedChild].id,
    teacherId: bookingDetails.teacherId,
    day: selectedSlot.dayIndex,
    time: selectedSlot.timeSlot,
    duration: bookingDetails.duration,
    recurring: bookingDetails.recurring
  };

  if (bookingDetails.recurring) {
    // Create multiple lessons for recurring
    const recurringLessons = [];
    for (let i = 0; i < RECURRING_WEEKS_COUNT; i++) {
      recurringLessons.push({...baseLesson, id: Date.now() + i});
    }
    setBookedLessons(prev => [...prev, ...recurringLessons]);
  } else {
    setBookedLessons(prev => [...prev, {...baseLesson, id: Date.now()}]);
  }
};
```

## Utility Functions

### 1. Date and Time Utilities

#### Week Date Calculation
```javascript
const getWeekDates = (date) => {
  const week = [];
  const startDate = new Date(date);
  const day = startDate.getDay();
  const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
  startDate.setDate(diff);

  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    week.push(day);
  }
  return week;
};
```

#### Time Slot Generation
```javascript
const timeSlots = Array.from({ length: TOTAL_TIME_SLOTS }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = (i % 2) * MINUTES_PER_SLOT;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});
```

### 2. Data Filtering Utilities

#### Available Teachers
```javascript
const getAvailableTeachers = (dayIndex, timeSlot) => {
  return hiredTeachers.filter(teacher => {
    const availability = teacherAvailability[teacher.id]?.[dayIndex] || [];
    const isBooked = bookedLessons.some(lesson =>
      lesson.teacherId === teacher.id &&
      lesson.day === dayIndex &&
      lesson.time === timeSlot
    );
    return availability.includes(timeSlot) && !isBooked;
  });
};
```

#### Lesson Filtering
```javascript
const getFilteredLessons = () => {
  const currentChildLessons = bookedLessons.filter(lesson =>
    lesson.childId === children[selectedChild].id
  );

  let filteredByType = currentChildLessons;
  if (learningType !== 'all') {
    filteredByType = currentChildLessons.filter(lesson => lesson.type === learningType);
  }

  return filteredByType.filter(lesson => {
    if (recurrenceView === 'single') return !lesson.recurring;
    if (recurrenceView === 'recurring') return lesson.recurring;
    return true;
  });
};
```

### 3. Visual Utilities

#### Background Color Logic
```javascript
const getTutorSlotBackgroundColor = (tutorCount) => {
  if (tutorCount === 0) return 'bg-gray-50';
  if (tutorCount === 1) return 'bg-[#e1f0e8] hover:bg-[#d4e8dc] border-l-2 border-[#b3d6c4]';
  if (tutorCount === 2) return 'bg-[#d4e8dc] hover:bg-[#c4dfd0] border-l-2 border-[#8bc7a5]';
  // ... more color variations
  return 'bg-[#9cccb2] hover:bg-[#8bc7a5] border-l-2 border-[#033d2b]';
};
```

## Styling System

### Tailwind CSS Classes Used

#### Layout Classes
- `min-h-screen`, `flex`, `overflow-hidden` - Full screen layout
- `w-80`, `flex-1`, `flex-shrink-0` - Sidebar and main content sizing
- `grid`, `grid-cols-8`, `space-y-6` - Grid layouts and spacing

#### Interactive Classes
- `cursor-pointer`, `cursor-grab` - Different cursor states
- `hover:bg-gray-50`, `hover:shadow-md` - Hover effects
- `transition-all`, `duration-200` - Smooth animations
- `disabled:opacity-50` - Disabled states

#### Color System
- **Green palette**: Primary actions, success states
  - `bg-green-700`, `text-green-700` - Primary green
  - `bg-green-50`, `border-green-200` - Light green backgrounds
- **Blue palette**: Tutor learning
  - `bg-blue-100`, `border-blue-500` - Tutor lesson indicators
- **Purple palette**: English/Literature subjects
- **Teal palette**: Science subjects
- **Amber palette**: History subjects

#### Component-Specific Styles
- **Calendar slots**: `h-8`, `border-r`, `border-gray-100`
- **Cards**: `rounded-lg`, `border`, `border-gray-200`
- **Buttons**: `py-2`, `px-4`, `rounded-md`
- **Modals**: `fixed`, `inset-0`, `bg-black`, `bg-opacity-50`

## How to Make Changes

### 1. Adding New Learning Types

#### Step 1: Update data.js
```javascript
export const learningTypes = [
  // existing types...
  { id: 'workshop', name: 'Workshop Learning', icon: Users }
];
```

#### Step 2: Update initial state
```javascript
const [enabledLearningTypes, setEnabledLearningTypes] = useState({
  // existing types...
  workshop: false
});
```

#### Step 3: Add handling in components
- Update `handleLearningTypeToggle()`
- Add conditional rendering where needed
- Add appropriate styling/colors

### 2. Modifying Calendar Views

#### Adding New Time Ranges
```javascript
// Change constants
const TOTAL_TIME_SLOTS = 32; // 8am to 8pm only
const START_HOUR = 8;

// Update time slot generation
const timeSlots = Array.from({ length: TOTAL_TIME_SLOTS }, (_, i) => {
  const hour = Math.floor(i / 2) + START_HOUR;
  // ... rest of logic
});
```

#### Adding New Calendar Views
1. Create new render function: `renderWeek2View()`
2. Add to view selector in header
3. Update `calendarView` state options
4. Add conditional rendering in main content

### 3. Extending Subject System

#### Adding Subject Levels
```javascript
// In data.js - add another nesting level
{
  id: 1,
  name: 'Mathematics',
  subSubjects: [{
    id: 11,
    name: 'Algebra',
    topics: [{
      id: 111,
      name: 'Linear Equations',
      subtopics: [  // New level
        { id: 1111, name: 'Slope-Intercept Form', completed: false }
      ]
    }]
  }]
}
```

#### Adding Progress Tracking
```javascript
const calculateSubjectProgress = (subject) => {
  const totalTopics = subject.subSubjects.reduce((acc, sub) => 
    acc + sub.topics.length, 0
  );
  const completedTopics = subject.subSubjects.reduce((acc, sub) => 
    acc + sub.topics.filter(t => t.completed).length, 0
  );
  return (completedTopics / totalTopics) * 100;
};
```

### 4. Adding New Modal Types

#### Step 1: Add state
```javascript
const [showNewModal, setShowNewModal] = useState(false);
const [newModalData, setNewModalData] = useState(null);
```

#### Step 2: Create render function
```javascript
const renderNewModal = () => {
  if (!showNewModal) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-96 p-6">
        {/* Modal content */}
      </div>
    </div>
  );
};
```

#### Step 3: Add to main JSX
```jsx
{renderNewModal()}
```

### 5. Performance Optimizations

#### Memoization
```javascript
import { useMemo, useCallback } from 'react';

const filteredLessons = useMemo(() => getFilteredLessons(), [
  bookedLessons, selectedChild, learningType, recurrenceView
]);

const handleSlotClick = useCallback((dayIndex, timeSlot) => {
  // ... handler logic
}, [learningType, bookedLessons]);
```

#### Component Splitting
```javascript
// Extract complex renders into separate components
const CalendarSlot = memo(({ dayIndex, timeSlot, lesson }) => {
  // Slot rendering logic
});
```

### 6. Adding Features

#### Export/Import Functionality
```javascript
const exportLessons = () => {
  const data = {
    lessons: bookedLessons,
    subjects: subjects,
    timestamp: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lessons-backup.json';
  a.click();
};
```

#### Search Functionality
```javascript
const [searchTerm, setSearchTerm] = useState('');

const searchLessons = (lessons, term) => {
  if (!term) return lessons;
  return lessons.filter(lesson => 
    lesson.subject.toLowerCase().includes(term.toLowerCase()) ||
    lesson.teacherName?.toLowerCase().includes(term.toLowerCase())
  );
};
```

### 7. Debugging Tips

#### State Logging
```javascript
// Add to component for debugging
useEffect(() => {
  console.log('Current state:', {
    selectedChild,
    learningType,
    calendarView,
    bookedLessons: bookedLessons.length
  });
}, [selectedChild, learningType, calendarView, bookedLessons]);
```

#### Error Boundaries
```javascript
// Wrap components in error boundaries for production
<ErrorBoundary>
  <LessonManagementSystem />
</ErrorBoundary>
```

#### Performance Monitoring
```javascript
// Use React DevTools Profiler
// Add performance.mark() for custom measurements
performance.mark('lesson-filter-start');
const filtered = getFilteredLessons();
performance.mark('lesson-filter-end');
performance.measure('lesson-filter', 'lesson-filter-start', 'lesson-filter-end');
```

## Key Constants for Easy Modification

```javascript
// Time and scheduling
const TOTAL_TIME_SLOTS = 48;           // Number of time slots per day
const MINUTES_PER_SLOT = 30;           // Minutes per time slot
const DEFAULT_LESSON_DURATION = 30;    // Default lesson length
const RECURRING_WEEKS_COUNT = 10;      // How many weeks for recurring lessons

// Colors (can be moved to CSS variables)
const TUTOR_COLOR = 'bg-blue-100';
const SILO_COLOR = 'bg-green-100';
const CLASSROOM_COLOR = 'bg-purple-100';

// Layout
const SIDEBAR_WIDTH = 'w-80';          // Sidebar width class
const CALENDAR_SLOT_HEIGHT = 'h-8';    // Height of each calendar slot
```

This documentation should give you complete understanding of the codebase architecture and how to make any changes you need. Each section builds upon the previous ones to give you both high-level understanding and practical implementation details.