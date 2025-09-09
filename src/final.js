
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, BookOpen, ChevronLeft, ChevronRight, X, Check, AlertCircle, Users, Star, ChevronDown, Info, GraduationCap, UserCheck, Building, MoreHorizontal } from 'lucide-react';

const LessonManagementSystem = () => {
  const [userType, setUserType] = useState('parent');
  const [selectedChild, setSelectedChild] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [learningType, setLearningType] = useState('all');
  const [enabledLearningTypes, setEnabledLearningTypes] = useState({
    all: true,
    tutor: false,
    silo: false,
    classroom: false
  });
  const [draggedSubject, setDraggedSubject] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const [showChildDropdown, setShowChildDropdown] = useState(false);
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [bookingDetails, setBookingDetails] = useState({
    duration: 30,
    teacherId: null
  });
  const [showTutorMenu, setShowTutorMenu] = useState(null);
  const [tutorTab, setTutorTab] = useState('calendar'); // 'calendar' or 'tutors'
  const [sidebarCalendarMonth, setSidebarCalendarMonth] = useState(new Date());
  const [calendarView, setCalendarView] = useState('week'); // 'day', 'week', 'month'
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [expandedSubjects, setExpandedSubjects] = useState({});

  // Mock data
  const children = [
    { id: 1, name: 'Emma', age: 8, curriculum: 'Primary', avatar: '👧' },
    { id: 2, name: 'James', age: 12, curriculum: 'Lower Secondary', avatar: '👦' },
    { id: 3, name: 'Sophie', age: 16, curriculum: 'Upper Secondary', avatar: '👩' }
  ];

  const hiredTeachers = [
    { id: 1, name: 'Mrs. Johnson', subject: 'Mathematics', rating: 4.8, avatar: '👩‍🏫', color: 'bg-green-700', pricePerLesson: 45, lessonsToReschedule: 2, totalLessons: 12 },
    { id: 2, name: 'Mr. Smith', subject: 'English', rating: 4.9, avatar: '👨‍🏫', color: 'bg-[#6f9685]', pricePerLesson: 50, lessonsToReschedule: 1, totalLessons: 8 },
    { id: 3, name: 'Dr. Williams', subject: 'Science', rating: 4.7, avatar: '👨‍🔬', color: 'bg-green-700', pricePerLesson: 55, lessonsToReschedule: 0, totalLessons: 15 },
    { id: 4, name: 'Ms. Davis', subject: 'History', rating: 4.6, avatar: '👩‍🏫', color: 'bg-green-800', pricePerLesson: 40, lessonsToReschedule: 3, totalLessons: 10 },
    { id: 5, name: 'Prof. Brown', subject: 'Geography', rating: 4.8, avatar: '👨‍🏫', color: 'bg-[#A7C6B9]', pricePerLesson: 42, lessonsToReschedule: 1, totalLessons: 6 }
  ];

  const subjects = [
    {
      id: 1,
      name: 'Mathematics',
      color: 'bg-blue-500',
      totalHours: 40,
      completedHours: 15,
      subSubjects: [
        { id: 11, name: 'Algebra', totalHours: 15, completedHours: 8 },
        { id: 12, name: 'Geometry', totalHours: 15, completedHours: 5 },
        { id: 13, name: 'Statistics', totalHours: 10, completedHours: 2 }
      ]
    },
    {
      id: 2,
      name: 'English',
      color: 'bg-purple-500',
      totalHours: 35,
      completedHours: 22,
      subSubjects: [
        { id: 21, name: 'Literature', totalHours: 12, completedHours: 8 },
        { id: 22, name: 'Grammar', totalHours: 12, completedHours: 9 },
        { id: 23, name: 'Writing', totalHours: 11, completedHours: 5 }
      ]
    },
    {
      id: 3,
      name: 'Science',
      color: 'bg-teal-500',
      totalHours: 45,
      completedHours: 18,
      subSubjects: [
        { id: 31, name: 'Physics', totalHours: 15, completedHours: 7 },
        { id: 32, name: 'Chemistry', totalHours: 15, completedHours: 6 },
        { id: 33, name: 'Biology', totalHours: 15, completedHours: 5 }
      ]
    },
    {
      id: 4,
      name: 'History',
      color: 'bg-amber-500',
      totalHours: 30,
      completedHours: 12,
      subSubjects: [
        { id: 41, name: 'World History', totalHours: 18, completedHours: 8 },
        { id: 42, name: 'Local History', totalHours: 12, completedHours: 4 }
      ]
    },
    {
      id: 5,
      name: 'Geography',
      color: 'bg-green-500',
      totalHours: 25,
      completedHours: 8,
      subSubjects: [
        { id: 51, name: 'Physical Geography', totalHours: 13, completedHours: 5 },
        { id: 52, name: 'Human Geography', totalHours: 12, completedHours: 3 }
      ]
    }
  ];

  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  // Enhanced booking data structure
  const [bookedLessons, setBookedLessons] = useState([
    { id: 1, teacherId: 1, day: 1, time: '14:00', duration: 60, childId: 1, subject: 'Math', type: 'tutor', subjectId: 1 },
    { id: 2, teacherId: 2, day: 3, time: '16:00', duration: 30, childId: 2, subject: 'English', type: 'tutor', subjectId: 2 },
    { id: 3, teacherId: 3, day: 5, time: '10:00', duration: 90, childId: 1, subject: 'Physics', type: 'tutor', subjectId: 3 },
    { id: 4, childId: 1, day: 2, time: '09:00', duration: 60, subject: 'Mathematics', type: 'silo', subjectId: 1 },
    { id: 5, childId: 2, day: 4, time: '11:00', duration: 30, subject: 'History', type: 'silo', subjectId: 4 },
    { id: 6, childId: 3, day: 1, time: '08:00', duration: 120, subject: 'Classroom Learning', type: 'classroom' },
    { id: 7, childId: 1, day: 6, time: '13:00', duration: 90, subject: 'Classroom Learning', type: 'classroom' },
  ]);

  const teacherAvailability = {
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

  const learningTypes = [
    { id: 'all', name: 'All', icon: GraduationCap },
    { id: 'tutor', name: 'Tutor Learning', icon: UserCheck },
    { id: 'silo', name: 'Silo Learning', icon: BookOpen },
    { id: 'classroom', name: 'Classroom Learning', icon: Building }
  ];

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

  const weekDates = getWeekDates(currentWeek);
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

  const getFilteredLessons = () => {
    const currentChildLessons = bookedLessons.filter(lesson =>
      userType === 'parent' ? lesson.childId === children[selectedChild].id : true
    );

    if (learningType === 'all') {
      return currentChildLessons;
    }
    return currentChildLessons.filter(lesson => lesson.type === learningType);
  };

  const handleSlotClick = (dayIndex, timeSlot) => {
    // Only allow booking if user is parent
    if (userType === 'parent' && learningType === 'tutor') {
      const availableTeachers = getAvailableTeachers(dayIndex, timeSlot);
      if (availableTeachers.length > 0) {
        setSelectedSlot({ dayIndex, timeSlot, availableTeachers });
        setBookingDetails({
          duration: 30,
          teacherId: availableTeachers.length === 1 ? availableTeachers[0].id : null
        });
        setShowBookingModal(true);
      }
    }
  };

  const handleDrop = (e, dayIndex, timeSlot) => {
    e.preventDefault();
    setDragOverSlot(null);
    // Only allow drag and drop if user is parent
    if (userType === 'parent' && draggedSubject && learningType === 'silo') {
      const newLesson = {
        id: Date.now(),
        childId: children[selectedChild].id,
        day: dayIndex,
        time: timeSlot,
        duration: 30,
        subject: draggedSubject.parentSubject ? `${draggedSubject.parentSubject} - ${draggedSubject.name}` : draggedSubject.name,
        type: 'silo',
        subjectId: draggedSubject.id
      };
      setBookedLessons(prev => [...prev, newLesson]);
      setDraggedSubject(null);
    }
  };

  const handleDragOver = (e, dayIndex, timeSlot) => {
    e.preventDefault();
    if (draggedSubject && learningType === 'silo') {
      setDragOverSlot(`${dayIndex}-${timeSlot}`);
    }
  };

  const handleDragLeave = (e) => {
    // Only clear drag over slot if we're leaving the entire grid area
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setDragOverSlot(null);
    }
  };

  const handleBookLesson = () => {
    const newLesson = {
      id: Date.now(),
      childId: children[selectedChild].id,
      teacherId: bookingDetails.teacherId,
      day: selectedSlot.dayIndex,
      time: selectedSlot.timeSlot,
      duration: bookingDetails.duration,
      subject: hiredTeachers.find(t => t.id === bookingDetails.teacherId)?.subject,
      type: 'tutor',
      subjectId: hiredTeachers.find(t => t.id === bookingDetails.teacherId)?.id
    };

    setBookedLessons(prev => [...prev, newLesson]);
    setShowBookingModal(false);
    setSelectedSlot(null);
  };

  // iOS-style Switch Component
  const SwitchToggle = ({ enabled, onChange, label, icon: IconComponent, isActive }) => {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            isActive ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-600'
          } transition-colors`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <span className={`font-medium ${
            isActive ? 'text-gray-900' : 'text-gray-700'
          }`}>{label}</span>
        </div>
        <button
          onClick={onChange}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
            enabled
              ? 'bg-green-600'
              : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    );
  };

  const handleLearningTypeToggle = (typeId) => {
    // Set only the selected type as enabled, all others disabled
    const newEnabledTypes = {
      all: false,
      tutor: false,
      silo: false,
      classroom: false
    };
    
    // Enable only the selected type
    newEnabledTypes[typeId] = true;
    
    setEnabledLearningTypes(newEnabledTypes);
    setLearningType(typeId);
  };

  const isSlotOccupied = (dayIndex, timeSlot, currentType) => {
    return bookedLessons.some(lesson =>
      lesson.childId === children[selectedChild].id &&
      lesson.day === dayIndex &&
      lesson.time === timeSlot &&
      (currentType === 'all' || lesson.type !== currentType)
    );
  };

  const getSlotReservations = (dayIndex, timeSlot) => {
    return bookedLessons.filter(lesson =>
      lesson.childId === children[selectedChild].id &&
      lesson.day === dayIndex &&
      lesson.time === timeSlot
    );
  };

  const getTutorSlotBackgroundColor = (tutorCount) => {
    if (tutorCount === 0) return 'bg-gray-50';
    if (tutorCount === 1) return 'bg-[#e1f0e8] hover:bg-[#d4e8dc] border-l-2 border-[#b3d6c4]';
    if (tutorCount === 2) return 'bg-[#d4e8dc] hover:bg-[#c4dfd0] border-l-2 border-[#8bc7a5]';
    if (tutorCount === 3) return 'bg-[#c4dfd0] hover:bg-[#b3d6c4] border-l-2 border-[#6bb888]';
    if (tutorCount === 4) return 'bg-[#b3d6c4] hover:bg-[#9cccb2] border-l-2 border-[#05513C]';
    return 'bg-[#9cccb2] hover:bg-[#8bc7a5] border-l-2 border-[#033d2b]'; // 5 or more tutors
  };

  const renderDayView = () => {
    const filteredLessons = getFilteredLessons();
    const selectedDayIndex = selectedDay.getDay() === 0 ? 6 : selectedDay.getDay() - 1; // Convert Sunday=0 to Monday=0 format
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Day Header */}
        <div className="grid grid-cols-2 border-b border-gray-200">
          <div className="p-4 bg-gray-50 font-semibold text-gray-600 h-16 flex items-center justify-center">Time</div>
          <div className="p-4 bg-gray-50 text-center h-16 flex flex-col items-center justify-center">
            <div className="font-semibold text-gray-800">{selectedDay.toLocaleDateString('en-GB', { weekday: 'long' })}</div>
            <div className="text-sm text-gray-600">{selectedDay.getDate()}</div>
          </div>
        </div>

        {/* Time Slots - Full day from 00:00 to 23:30 */}
        <div className="flex-1" onDragLeave={handleDragLeave}>
          {timeSlots.map((timeSlot, timeIndex) => (
            <div key={timeSlot} className="grid grid-cols-2 border-b border-gray-100 h-8">
              {timeIndex % 2 === 0 && (
                <div className="p-2 bg-gray-50 text-xs font-medium text-gray-600 border-r border-gray-200 flex items-center justify-center row-span-2">
                  {timeSlot.substring(0, 5)}
                </div>
              )}
              {timeIndex % 2 !== 0 && (
                <div className="border-r border-gray-200"></div>
              )}
              
              {(() => {
                const availableTeachers = getAvailableTeachers(selectedDayIndex, timeSlot);
                const currentSlotLessons = filteredLessons.filter(lesson =>
                  lesson.day === selectedDayIndex && lesson.time === timeSlot
                );
                const allSlotReservations = getSlotReservations(selectedDayIndex, timeSlot);
                const isReservedByOtherType = allSlotReservations.length > 0 &&
                  learningType !== 'all' &&
                  !allSlotReservations.some(r => r.type === learningType);
                const slotKey = `${selectedDayIndex}-${timeSlot}`;
                const isDraggedOver = dragOverSlot === slotKey;
                const canDrop = draggedSubject && learningType === 'silo' && currentSlotLessons.length === 0 && !isReservedByOtherType;

                return (
                  <div
                    key={slotKey}
                    className={`p-1 border-r border-gray-100 h-8 cursor-pointer transition-all duration-200 flex items-center justify-center text-xs relative ${currentSlotLessons.length > 0
                      ? currentSlotLessons[0].type === 'tutor'
                        ? 'bg-blue-100 border-l-2 border-blue-500'
                        : currentSlotLessons[0].type === 'silo'
                          ? 'bg-green-100 border-l-2 border-green-500'
                          : 'bg-purple-100 border-l-2 border-purple-500'
                      : isReservedByOtherType
                        ? 'bg-gray-200 border-l-2 border-gray-400'
                        : isDraggedOver && canDrop
                          ? 'bg-green-200 border-2 border-green-500 border-dashed shadow-inner'
                          : learningType === 'tutor' && availableTeachers.length > 0
                            ? getTutorSlotBackgroundColor(availableTeachers.length)
                            : learningType === 'silo'
                              ? canDrop
                                ? 'hover:bg-green-50 bg-green-25'
                                : 'bg-gray-50'
                              : 'bg-gray-50'
                      }`}
                    onClick={() => userType === 'parent' && !currentSlotLessons.length && !isReservedByOtherType && handleSlotClick(selectedDayIndex, timeSlot)}
                    onDrop={(e) => handleDrop(e, selectedDayIndex, timeSlot)}
                    onDragOver={(e) => handleDragOver(e, selectedDayIndex, timeSlot)}
                    onMouseEnter={(e) => {
                      if (learningType === 'tutor' && availableTeachers.length > 0 && currentSlotLessons.length === 0) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltipPosition({
                          x: rect.right + 10,
                          y: rect.top
                        });
                        setHoveredSlot({ dayIndex: selectedDayIndex, timeSlot, availableTeachers });
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredSlot(null);
                    }}
                  >
                    {currentSlotLessons.length > 0 ? (
                      <div className="text-center w-full">
                        <div className="font-semibold truncate text-xs">
                          {currentSlotLessons[0].subject.includes(' - ') 
                            ? currentSlotLessons[0].subject.split(' - ')[1].substring(0, 8)
                            : currentSlotLessons[0].subject.substring(0, 8)
                          }
                        </div>
                        {currentSlotLessons[0].teacherId && (
                          <div className="text-gray-600 truncate text-xs">
                            {hiredTeachers.find(t => t.id === currentSlotLessons[0].teacherId)?.name.split(' ')[0]}
                          </div>
                        )}
                      </div>
                    ) : isReservedByOtherType ? (
                      <div className="text-center">
                        <div className="text-gray-600 text-xs">Reserved</div>
                        <div className="text-xs text-gray-500">
                          {allSlotReservations[0]?.type === 'tutor' ? 'Tutor' :
                            allSlotReservations[0]?.type === 'classroom' ? 'Class' : 'Silo'}
                        </div>
                      </div>
                    ) : isDraggedOver && canDrop ? (
                      <div className="text-center">
                        <div className="text-green-700 text-xs font-semibold">Drop here</div>
                        <div className="text-green-600 text-xs">
                          {draggedSubject?.parentSubject ? `${draggedSubject.parentSubject} - ${draggedSubject.name}` : draggedSubject?.name}
                        </div>
                        <div className="text-green-500 text-xs">
                          {timeSlot}
                        </div>
                      </div>
                    ) : learningType === 'tutor' && availableTeachers.length > 0 ? (
                      <div className="text-center w-full flex flex-col items-center justify-center">
                        <div className="text-xs text-green-700 font-bold">
                          {availableTeachers.length}
                        </div>
                        <div className="text-xs text-green-600">
                          tutor{availableTeachers.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    ) : learningType === 'silo' && canDrop ? (
                      <div className="text-xs text-green-600 text-center opacity-60">
                        {/* Drop subjects here */}
                      </div>
                    ) : null}
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const filteredLessons = getFilteredLessons();
    const year = selectedDay.getFullYear();
    const month = selectedDay.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Month Header */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 text-center">
          <h2 className="text-xl font-semibold text-gray-800">{monthNames[month]} {year}</h2>
        </div>
        
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
            <div key={index} className="p-3 bg-gray-50 text-center font-semibold text-gray-600 border-r border-gray-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {(() => {
            const totalCells = startingDayOfWeek + daysInMonth;
            const totalWeeks = Math.ceil(totalCells / 7);
            const cells = [];

            for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex++) {
              for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                const cellIndex = (weekIndex * 7) + dayIndex;
                const dayOfMonth = cellIndex - startingDayOfWeek + 1;

                if (cellIndex < startingDayOfWeek || dayOfMonth > daysInMonth) {
                  // Empty cell
                  cells.push(
                    <div key={`empty-${cellIndex}`} className="h-24 border-r border-b border-gray-100 bg-gray-25"></div>
                  );
                } else {
                  // Day cell with lessons
                  const dayLessons = filteredLessons.filter(lesson => {
                    const lessonDate = weekDates[lesson.day];
                    return lessonDate && 
                           lessonDate.getDate() === dayOfMonth && 
                           lessonDate.getMonth() === month && 
                           lessonDate.getFullYear() === year;
                  });

                  const isToday = new Date().getDate() === dayOfMonth && 
                                new Date().getMonth() === month && 
                                new Date().getFullYear() === year;
                  
                  cells.push(
                    <div
                      key={dayOfMonth}
                      className={`h-24 border-r border-b border-gray-100 p-2 ${
                        isToday ? 'bg-blue-50 border-l-2 border-blue-500' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isToday ? 'text-blue-700' : 'text-gray-900'
                      }`}>
                        {dayOfMonth}
                      </div>
                      <div className="space-y-1">
                        {dayLessons.slice(0, 3).map((lesson, idx) => (
                          <div
                            key={idx}
                            className={`text-xs p-1 rounded truncate ${
                              lesson.type === 'tutor'
                                ? 'bg-blue-100 text-blue-800'
                                : lesson.type === 'silo'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {lesson.time} {lesson.subject.includes(' - ') 
                              ? lesson.subject.split(' - ')[1]
                              : lesson.subject}
                          </div>
                        ))}
                        {dayLessons.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{dayLessons.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              }
            }
            return cells;
          })()}
        </div>
      </div>
    );
  };

  const renderCalendarGrid = () => {
    const filteredLessons = getFilteredLessons();

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Week Header */}
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-4 bg-gray-50 font-semibold text-gray-600 h-16 flex items-center justify-center">Time</div>
          {weekDates.map((date, index) => (
            <div key={index} className="p-4 bg-gray-50 text-center h-16 flex flex-col items-center justify-center">
              <div className="font-semibold text-gray-800">{dayNames[index]}</div>
              <div className="text-sm text-gray-600">{date.getDate()}</div>
            </div>
          ))}
        </div>

        {/* Time Slots */}
        <div className="flex-1" onDragLeave={handleDragLeave}>
          {timeSlots.slice(16, 40).map((timeSlot, timeIndex) => (
            <div key={timeSlot} className="grid grid-cols-8 border-b border-gray-100 h-8">
              {timeIndex % 2 === 0 && (
                <div className="p-2 bg-gray-50 text-xs font-medium text-gray-600 border-r border-gray-200 flex items-center justify-center row-span-2">
                  {timeSlot.substring(0, 5)}
                </div>
              )}
              {timeIndex % 2 !== 0 && (
                <div className="border-r border-gray-200"></div>
              )}
              {weekDates.map((date, dayIndex) => {
                const availableTeachers = getAvailableTeachers(dayIndex, timeSlot);
                const currentSlotLessons = filteredLessons.filter(lesson =>
                  lesson.day === dayIndex && lesson.time === timeSlot
                );
                const allSlotReservations = getSlotReservations(dayIndex, timeSlot);
                const isReservedByOtherType = allSlotReservations.length > 0 &&
                  learningType !== 'all' &&
                  !allSlotReservations.some(r => r.type === learningType);
                const slotKey = `${dayIndex}-${timeSlot}`;
                const isDraggedOver = dragOverSlot === slotKey;
                const canDrop = draggedSubject && learningType === 'silo' && currentSlotLessons.length === 0 && !isReservedByOtherType;

                return (
                  <div
                    key={slotKey}
                    className={`p-1 border-r border-gray-100 h-8 cursor-pointer transition-all duration-200 flex items-center justify-center text-xs relative ${currentSlotLessons.length > 0
                      ? currentSlotLessons[0].type === 'tutor'
                        ? 'bg-blue-100 border-l-2 border-blue-500'
                        : currentSlotLessons[0].type === 'silo'
                          ? 'bg-green-100 border-l-2 border-green-500'
                          : 'bg-purple-100 border-l-2 border-purple-500'
                      : isReservedByOtherType
                        ? 'bg-gray-200 border-l-2 border-gray-400'
                        : isDraggedOver && canDrop
                          ? 'bg-green-200 border-2 border-green-500 border-dashed shadow-inner'
                          : learningType === 'tutor' && availableTeachers.length > 0
                            ? getTutorSlotBackgroundColor(availableTeachers.length)
                            : learningType === 'silo'
                              ? canDrop
                                ? 'hover:bg-green-50 bg-green-25'
                                : 'bg-gray-50'
                              : 'bg-gray-50'
                      }`}
                    onClick={() => userType === 'parent' && !currentSlotLessons.length && !isReservedByOtherType && handleSlotClick(dayIndex, timeSlot)}
                    onDrop={(e) => handleDrop(e, dayIndex, timeSlot)}
                    onDragOver={(e) => handleDragOver(e, dayIndex, timeSlot)}
                    onMouseEnter={(e) => {
                      if (learningType === 'tutor' && availableTeachers.length > 0 && currentSlotLessons.length === 0) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltipPosition({
                          x: rect.right + 10,
                          y: rect.top
                        });
                        setHoveredSlot({ dayIndex, timeSlot, availableTeachers });
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredSlot(null);
                    }}
                  >
                    {currentSlotLessons.length > 0 ? (
                      <div className="text-center w-full">
                        <div className="font-semibold truncate text-xs">
                          {currentSlotLessons[0].subject.includes(' - ') 
                            ? currentSlotLessons[0].subject.split(' - ')[1].substring(0, 8)
                            : currentSlotLessons[0].subject.substring(0, 8)
                          }
                        </div>
                        {currentSlotLessons[0].teacherId && (
                          <div className="text-gray-600 truncate text-xs">
                            {hiredTeachers.find(t => t.id === currentSlotLessons[0].teacherId)?.name.split(' ')[0]}
                          </div>
                        )}
                      </div>
                    ) : isReservedByOtherType ? (
                      <div className="text-center">
                        <div className="text-gray-600 text-xs">Reserved</div>
                        <div className="text-xs text-gray-500">
                          {allSlotReservations[0]?.type === 'tutor' ? 'Tutor' :
                            allSlotReservations[0]?.type === 'classroom' ? 'Class' : 'Silo'}
                        </div>
                      </div>
                    ) : isDraggedOver && canDrop ? (
                      <div className="text-center">
                        <div className="text-green-700 text-xs font-semibold">Drop here</div>
                        <div className="text-green-600 text-xs">
                          {draggedSubject?.parentSubject ? `${draggedSubject.parentSubject} - ${draggedSubject.name}` : draggedSubject?.name}
                        </div>
                        <div className="text-green-500 text-xs">
                          {timeSlot} - {dayNames[dayIndex]}
                        </div>
                      </div>
                    ) : learningType === 'tutor' && availableTeachers.length > 0 ? (
                      // Show number of available tutors
                      <div className="text-center w-full flex flex-col items-center justify-center">
                        <div className="text-xs text-green-700 font-bold">
                          {availableTeachers.length}
                        </div>
                        <div className="text-xs text-green-600">
                          tutor{availableTeachers.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    ) : learningType === 'silo' && canDrop ? (
                      <div className="text-xs text-green-600 text-center opacity-60">
                        {/* Drop subjects here */}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTutorsTab = () => {
    return (
      <div className="p-4">
        <div className="grid gap-3">
          {hiredTeachers.map(teacher => {
            const teacherLessons = bookedLessons.filter(lesson => 
              lesson.teacherId === teacher.id && 
              lesson.childId === children[selectedChild].id
            );
            
            return (
              <div key={teacher.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  {/* Teacher Info - Compact Layout */}
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`w-12 h-12 rounded-full ${teacher.color} flex items-center justify-center text-white font-bold`}>
                      {teacher.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                          <p className="text-sm text-gray-600">{teacher.subject}</p>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                            <span>{teacher.rating}</span>
                          </div>
                          <div className="font-semibold text-blue-700">${teacher.pricePerLesson}</div>
                        </div>
                      </div>
                      
                      {/* Quick Stats - Inline */}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{teacher.totalLessons} lessons booked</span>
                        {teacher.lessonsToReschedule > 0 && (
                          <span className="text-orange-600 font-medium">
                            {teacher.lessonsToReschedule} to reschedule
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Three Dots Menu */}
                  <div className="relative ml-3">
                    <button
                      onClick={() => setShowTutorMenu(showTutorMenu === teacher.id ? null : teacher.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {showTutorMenu === teacher.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => {
                            setShowTutorMenu(null);
                            console.log('Buy more lessons for', teacher.name);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg transition-colors flex items-center"
                        >
                          <BookOpen className="w-3 h-3 mr-2" />
                          Buy More Lessons
                        </button>
                        <button
                          onClick={() => {
                            setShowTutorMenu(null);
                            console.log('Reschedule lessons for', teacher.name);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                        >
                          <Calendar className="w-3 h-3 mr-2" />
                          Reschedule Lessons
                        </button>
                        <button
                          onClick={() => {
                            setShowTutorMenu(null);
                            console.log('View schedule for', teacher.name);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                        >
                          <Clock className="w-3 h-3 mr-2" />
                          View Schedule
                        </button>
                        <button
                          onClick={() => {
                            setShowTutorMenu(null);
                            console.log('Message', teacher.name);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg transition-colors flex items-center"
                        >
                          <User className="w-3 h-3 mr-2" />
                          Message Teacher
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Marketplace Navigation */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <a
            href="https://tutormarketplace.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 hover:text-green-800 underline text-sm cursor-pointer"
          >
            Need extra support in a new subject? Find the right match in our tutor marketplace
          </a>
        </div>
      </div>
    );
  };

  // Helper function to get days with lessons for a specific month
  const getDaysWithLessons = (month, year) => {
    const daysWithLessons = new Set();
    const currentChildId = userType === 'parent' ? children[selectedChild].id : null;
    
    // Only highlight lesson days for the current week being viewed
    const weekDates = getWeekDates(currentWeek);
    
    bookedLessons.forEach(lesson => {
      if (userType === 'parent' && lesson.childId !== currentChildId) return;
      
      // Get the actual date for this lesson in the current week
      const lessonDate = weekDates[lesson.day];
      
      // Only add if the lesson date is in the calendar month being displayed
      if (lessonDate && lessonDate.getMonth() === month && lessonDate.getFullYear() === year) {
        daysWithLessons.add(lessonDate.getDate());
      }
    });
    
    return daysWithLessons;
  };

  // Helper function to get the week row index for a given date
  const getWeekRowIndex = (date, calendarMonth, calendarYear) => {
    if (date.getMonth() !== calendarMonth || date.getFullYear() !== calendarYear) {
      return -1; // Date is not in the calendar month
    }
    
    const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1);
    const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0
    const dayOfMonth = date.getDate();
    const cellIndex = startingDayOfWeek + dayOfMonth - 1;
    
    return Math.floor(cellIndex / 7);
  };

  const renderSidebarCalendar = () => {
    const year = sidebarCalendarMonth.getFullYear();
    const month = sidebarCalendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0

    const daysWithLessons = getDaysWithLessons(month, year);
    const selectedWeekRowIndex = getWeekRowIndex(currentWeek, month, year);
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];

    const handleDateClick = (day) => {
      const selectedDate = new Date(year, month, day);
      setCurrentWeek(selectedDate);
      setSelectedDay(selectedDate);
    };

    const navigateMonth = (direction) => {
      const newMonth = new Date(sidebarCalendarMonth);
      newMonth.setMonth(newMonth.getMonth() + direction);
      setSidebarCalendarMonth(newMonth);
    };

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h3 className="text-lg font-semibold text-gray-800">
            {monthNames[month]} {year}
          </h3>
          
          <button
            onClick={() => navigateMonth(1)}
            className="p-1 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <div key={index} className="text-center text-xs font-medium text-gray-500 p-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="space-y-1">
          {/* Create calendar rows */}
          {(() => {
            const totalCells = startingDayOfWeek + daysInMonth;
            const totalWeeks = Math.ceil(totalCells / 7);
            const rows = [];

            for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex++) {
              const weekCells = [];
              
              // Check if this is the selected week row
              const isCurrentWeekRow = weekIndex === selectedWeekRowIndex;

              for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                const cellIndex = (weekIndex * 7) + dayIndex;
                const dayOfMonth = cellIndex - startingDayOfWeek + 1;

                if (cellIndex < startingDayOfWeek || dayOfMonth > daysInMonth) {
                  // Empty cell
                  weekCells.push(
                    <div key={`empty-${cellIndex}`} className="h-8"></div>
                  );
                } else {
                  // Day cell
                  const hasLessons = daysWithLessons.has(dayOfMonth);
                  const isSelectedDay = selectedDay.getDate() === dayOfMonth && 
                    selectedDay.getMonth() === month && selectedDay.getFullYear() === year;
                  
                  weekCells.push(
                    <button
                      key={dayOfMonth}
                      onClick={() => handleDateClick(dayOfMonth)}
                      className={`h-8 text-sm rounded transition-all hover:bg-green-100 ${
                        isSelectedDay
                          ? 'bg-gray-500 text-white hover:bg-gray-600 border-2 border-gray-200'
                          : hasLessons
                            ? 'bg-green-600 text-white font-medium hover:bg-green-700'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {dayOfMonth}
                    </button>
                  );
                }
              }

              rows.push(
                <div
                  key={weekIndex}
                  className={`grid grid-cols-7 gap-1 p-1 rounded ${
                    isCurrentWeekRow
                      ? 'bg-green-50 border-2 border-green-600 shadow-sm'
                      : ''
                  }`}
                >
                  {weekCells}
                </div>
              );
            }

            return rows;
          })()}
        </div>
      </div>
    );
  };

  const renderSidebar = () => {
    return (
      <div className="p-6 space-y-6">
        {/* Lesson Management Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lesson Management</h1>
          <p className="text-gray-600 text-sm">
            {userType === 'parent'
              ? `Managing ${learningTypes.find(t => t.id === learningType)?.name.toLowerCase()} for ${children[selectedChild].name}`
              : `Your ${learningTypes.find(t => t.id === learningType)?.name.toLowerCase()} schedule`
            }
          </p>
        </div>

        {/* Logo */}
        {/* <div className='flex flex-col'>
          <div className='flex items-center justify-center w-full'>
          <img
                src="logo.png"
                alt="RightSteps"
                className="h-24 w-24 bg-white p-1"
              />
              </div>
        </div> */}

        {/* Full Monthly Calendar */}
        {renderSidebarCalendar()}

        {/* Weekly Summary */}
        <div className='flex flex-col'>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">This Week</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-green-700">Lessons Booked</span>
              <span className="font-semibold text-green-800">
                {getFilteredLessons().length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-700">Available Slots</span>
              <span className="font-semibold text-blue-800">156</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm text-purple-700">Total Hours</span>
              <span className="font-semibold text-purple-800">
                {getFilteredLessons().reduce((acc, lesson) => acc + (lesson.duration / 60), 0).toFixed(1)}h
              </span>
            </div>
          </div>
        </div>


        {/* Color Legend for All View */}
        {learningType === 'all' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Legend</h3>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-100 border-l-2 border-blue-500 rounded"></div>
                  <span className="text-sm text-gray-700">Tutor Learning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-100 border-l-2 border-green-500 rounded"></div>
                  <span className="text-sm text-gray-700">Silo Learning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-purple-100 border-l-2 border-purple-500 rounded"></div>
                  <span className="text-sm text-gray-700">Classroom Learning</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Silo Learning Hint - Parent Only */}
        {learningType === 'silo' && userType === 'parent' && (
          <div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-green-600 mt-0.5" />
                <div className="text-sm text-green-700">
                  <p className="font-semibold">Silo Learning</p>
                  <p>Click on subjects below to expand and view their sub-topics. Drag and drop specific sub-topics (like Physics, Chemistry, Biology) onto calendar slots to schedule focused self-study sessions.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subject Cards for Silo Learning - Child View (Read Only) */}
        {learningType === 'silo' && userType === 'child' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Subjects</h3>
            <div className="space-y-3">
              {subjects.map(subject => {
                const progress = (subject.completedHours / subject.totalHours) * 100;
                const isExpanded = expandedSubjects[subject.id];
                
                return (
                  <div
                    key={subject.id}
                    className="bg-white border border-gray-200 rounded-lg transition-all"
                  >
                    {/* Main Subject Header */}
                    <div className="p-3">
                      <div 
                        className="flex items-center space-x-3 mb-2 cursor-pointer"
                        onClick={() => setExpandedSubjects(prev => ({ ...prev, [subject.id]: !prev[subject.id] }))}
                      >
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        <div className={`w-4 h-4 rounded ${subject.color}`}></div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 text-sm">{subject.name}</div>
                          <div className="text-xs text-gray-600">
                            {subject.completedHours}h / {subject.totalHours}h completed
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${subject.color}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{Math.round(progress)}% complete</div>
                    </div>

                    {/* Sub-subjects */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 p-3 space-y-2">
                        {subject.subSubjects.map(subSubject => {
                          const subProgress = (subSubject.completedHours / subSubject.totalHours) * 100;
                          
                          return (
                            <div
                              key={subSubject.id}
                              className="p-2 bg-gray-50 rounded-md border border-gray-100"
                            >
                              <div className="flex items-center space-x-2 mb-1">
                                <div className={`w-3 h-3 rounded ${subject.color}`}></div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-700 text-sm">{subSubject.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {subSubject.completedHours}h / {subSubject.totalHours}h completed
                                  </div>
                                  <div className="text-xs text-gray-400 italic mt-1">View only</div>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1">
                                <div
                                  className={`h-1 rounded-full ${subject.color}`}
                                  style={{ width: `${subProgress}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{Math.round(subProgress)}% complete</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Subject Cards for Silo Learning */}
        {learningType === 'silo' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Subjects</h3>
            <div className="space-y-3">
              {subjects.map(subject => {
                const progress = (subject.completedHours / subject.totalHours) * 100;
                const isExpanded = expandedSubjects[subject.id];
                const canDrag = userType === 'parent';
                
                return (
                  <div
                    key={subject.id}
                    className="bg-white border border-gray-200 rounded-lg transition-all"
                  >
                    {/* Main Subject Header */}
                    <div className="p-3">
                      <div 
                        className="flex items-center space-x-3 mb-2 cursor-pointer"
                        onClick={() => setExpandedSubjects(prev => ({ ...prev, [subject.id]: !prev[subject.id] }))}
                      >
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        <div className={`w-4 h-4 rounded ${subject.color}`}></div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 text-sm">{subject.name}</div>
                          <div className="text-xs text-gray-600">
                            {subject.completedHours}h / {subject.totalHours}h completed
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${subject.color}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{Math.round(progress)}% complete</div>
                    </div>

                    {/* Sub-subjects */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 p-3 space-y-2">
                        {subject.subSubjects.map(subSubject => {
                          const subProgress = (subSubject.completedHours / subSubject.totalHours) * 100;
                          const isDragging = draggedSubject?.id === subSubject.id;
                          
                          return (
                            <div
                              key={subSubject.id}
                              draggable={canDrag}
                              onDragStart={() => canDrag && setDraggedSubject({ ...subSubject, parentSubject: subject.name, color: subject.color })}
                              onDragEnd={() => {
                                setDraggedSubject(null);
                                setDragOverSlot(null);
                              }}
                              className={`p-2 bg-gray-50 rounded-md border border-gray-100 transition-all ${
                                canDrag 
                                  ? `cursor-grab hover:shadow-sm ${isDragging ? 'opacity-30 scale-95' : 'hover:scale-105 hover:bg-gray-100'}`
                                  : 'cursor-default'
                              }`}
                            >
                              <div className="flex items-center space-x-2 mb-1">
                                <div className={`w-3 h-3 rounded ${subject.color}`}></div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-700 text-sm">{subSubject.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {subSubject.completedHours}h / {subSubject.totalHours}h completed
                                  </div>
                                  {!canDrag && (
                                    <div className="text-xs text-gray-400 italic mt-1">View only</div>
                                  )}
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1">
                                <div
                                  className={`h-1 rounded-full ${subject.color}`}
                                  style={{ width: `${subProgress}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{Math.round(subProgress)}% complete</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Hired Teachers for Tutor Learning */}
        {learningType === 'tutor' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{`${children[selectedChild].name}'s Teachers`}</h3>
            <div className="space-y-3">
              {hiredTeachers.map(teacher => (
                <div key={teacher.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full ${teacher.color} flex items-center justify-center text-white font-bold`}>
                      {teacher.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{teacher.name}</div>
                      <div className="text-sm text-gray-600">{teacher.subject}</div>
                      {userType === 'child' && (
                        <div className="text-xs text-gray-400 italic mt-1">View only</div>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowTutorMenu(showTutorMenu === teacher.id ? null : teacher.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {showTutorMenu === teacher.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => {
                              setShowTutorMenu(null);
                              console.log('Buy more lessons for', teacher.name);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg transition-colors flex items-center"
                          >
                            <BookOpen className="w-3 h-3 mr-2" />
                            Buy More Lessons
                          </button>
                          <button
                            onClick={() => {
                              setShowTutorMenu(null);
                              console.log('Reschedule lessons for', teacher.name);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                          >
                            <Calendar className="w-3 h-3 mr-2" />
                            Reschedule Lessons
                          </button>
                          <button
                            onClick={() => {
                              setShowTutorMenu(null);
                              console.log('View schedule for', teacher.name);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                          >
                            <Clock className="w-3 h-3 mr-2" />
                            View Schedule
                          </button>
                          <button
                            onClick={() => {
                              setShowTutorMenu(null);
                              console.log('Message', teacher.name);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg transition-colors flex items-center"
                          >
                            <User className="w-3 h-3 mr-2" />
                            Message Teacher
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    );
  };

  const renderBookingModal = () => {
    if (!showBookingModal || !selectedSlot) return null;

    const availableTeachers = selectedSlot.availableTeachers;
    const selectedTeacher = hiredTeachers.find(t => t.id === bookingDetails.teacherId);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-96 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Book Lesson</h3>
            <button
              onClick={() => setShowBookingModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Time Slot Info */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {dayNames[selectedSlot.dayIndex]}, {weekDates[selectedSlot.dayIndex].getDate()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{selectedSlot.timeSlot}</span>
              </div>
            </div>

            {/* Duration Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Lesson Duration</label>
              <div className="grid grid-cols-2 gap-2">
                {[25, 50].map(duration => (
                  <button
                    key={duration}
                    onClick={() => setBookingDetails(prev => ({ ...prev, duration }))}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${bookingDetails.duration === duration
                      ? 'bg-green-700 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {duration < 60 ? `${duration} min` : `${Math.floor(duration / 60)}h ${duration % 60 > 0 ? `${duration % 60}m` : ''}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Teacher Selection */}
            {availableTeachers.length > 1 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Teacher</label>
                <select
                  value={bookingDetails.teacherId || ''}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, teacherId: parseInt(e.target.value) }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Choose a teacher...</option>
                  {availableTeachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} - {teacher.subject}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedTeacher && (
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${selectedTeacher.color} flex items-center justify-center text-white font-bold`}>
                    {selectedTeacher.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-green-800">{selectedTeacher.name}</div>
                    <div className="text-sm text-green-600">{selectedTeacher.subject}</div>
                    <div className="flex items-center text-sm text-yellow-600">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {selectedTeacher.rating}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBookLesson}
                disabled={!bookingDetails.teacherId}
                className="flex-1 py-3 px-4 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Check className="w-4 h-4 inline mr-2" />
                Book Lesson
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Tutor Availability Tooltip */}
      {hoveredSlot && (
        // <div
        //   className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs"
        //   style={{
        //     left: tooltipPosition.x,
        //     top: tooltipPosition.y,
        //     transform: 'translateY(-50%)'
        //   }}
        // >
        //   <div className="text-sm font-semibold text-gray-800 mb-2">
        //     Available Tutors - {hoveredSlot.timeSlot}
        //   </div>
        //   <div className="space-y-2">
        //     {hoveredSlot.availableTeachers.map(teacher => (
        //       <div key={teacher.id} className="flex items-center space-x-2">
        //         <div className={`w-6 h-6 rounded-full ${teacher.color} flex items-center justify-center text-white text-xs font-bold`}>
        //           {teacher.name.charAt(0)}
        //         </div>
        //         <div className="flex-1">
        //           <div className="text-sm font-medium text-gray-800">{teacher.name}</div>
        //           <div className="text-xs text-gray-600">{teacher.subject}</div>
        //         </div>
        //         <div className="flex items-center text-xs text-yellow-600">
        //           <Star className="w-3 h-3 mr-1 fill-current" />
        //           {teacher.rating}
        //         </div>
        //       </div>
        //     ))}
        //   </div>
        // </div>
        <div
    className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-xs"
    style={{
      left: tooltipPosition.x,
      top: tooltipPosition.y,
      transform: 'translateY(-50%)'
    }}
  >
    <div className="text-sm font-semibold text-gray-800 mb-3">
      Available Tutors - {hoveredSlot.timeSlot}
    </div>
    <div className="space-y-3">
      {hoveredSlot.availableTeachers.map(teacher => (
        <div key={teacher.id} className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full ${teacher.color} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
            {teacher.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-800">{teacher.name}</div>
            <div className="text-xs text-gray-600">{teacher.subject}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
      )}

      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0 h-screen overflow-y-auto">
        {renderSidebar()}
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto">
        {/* Header with Child Selection */}
        <div className="bg-white border-b border-gray-200 p-2 sticky top-0 z-20 shadow-sm backdrop-blur-sm">
          {/* <div className='w-full flex flex-col items-center mt-1'>
            <div className='flex items-center justify-center'>
              <img
                src="logo.png"
                alt="RightSteps"
                className="h-24 bg-white p-1"
              />
            </div>
            <h3 className='text-3xl font-bold text-gray-800 mb-2'>Welcome, User</h3>
            <p className='text-md text-gray-700 text-center mb-6'>Track learning progress and upcoming activities with insights</p>
            <div className='relative w-full max-w-lg mb-4'>
              <input
                className='bg-gray-100 w-full py-2 pl-10 pr-12 rounded-full !border focus:!border-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-700 focus:outline-none text-md focus:bg-white'
                placeholder='Search'
              />
              <button className='absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full'>
              </button>
            </div>
          </div> */}
          <div className="flex items-center justify-between mb-4 p-2">

            <div className="flex items-center space-x-6">
              {/* Learning Types */}
              <div className="flex items-center space-x-4">
                {learningTypes.map(type => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${
                      learningType === type.id ? 'text-gray-900' : 'text-gray-700'
                    }`}>{type.name}</span>
                    <button
                      onClick={() => handleLearningTypeToggle(type.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                        enabledLearningTypes[type.id]
                          ? 'bg-green-600'
                          : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          enabledLearningTypes[type.id] ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* User Type Toggle */}
              {/* <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setUserType('parent')}
                  className={`py-1.5 px-3 rounded-md text-xs font-medium transition-all ${userType === 'parent' ? 'bg-green-700 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  <Users className="w-3 h-3 inline mr-1" />
                  Parent
                </button>
                <button
                  onClick={() => setUserType('child')}
                  className={`py-1.5 px-3 rounded-md text-xs font-medium transition-all ${userType === 'child' ? 'bg-green-700 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  <User className="w-3 h-3 inline mr-1" />
                  Child
                </button>
              </div> */}
            </div>

            {/* Child Dropdown (Parent View Only) */}
            {userType === 'parent' && children.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => setShowChildDropdown(!showChildDropdown)}
                  className="flex items-center space-x-3 p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* <span className="text-2xl">{children[selectedChild].avatar}</span> */}
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">{children[selectedChild].name}</div>
                    <div className="text-sm text-gray-600">{children[selectedChild].curriculum}</div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showChildDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showChildDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {children.map((child, index) => (
                      <button
                        key={child.id}
                        onClick={() => {
                          setSelectedChild(index);
                          setShowChildDropdown(false);
                        }}
                        className={`w-full p-3 text-left hover:bg-gray-50 transition-colors ${index !== children.length - 1 ? 'border-b border-gray-100' : ''
                          } ${selectedChild === index ? 'bg-green-50' : ''}`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{child.avatar}</span>
                          <div>
                            <div className="font-semibold text-gray-800">{child.name}</div>
                            <div className="text-sm text-gray-600">{child.curriculum} • Age {child.age}</div>
                          </div>
                          {selectedChild === index && (
                            <Check className="w-4 h-4 text-green-600 ml-auto" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tutor Learning Tabs */}
        {learningType === 'tutor' && (
          <div className="bg-white border-b border-gray-200 px-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setTutorTab('calendar')}
                className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                  tutorTab === 'calendar'
                    ? 'text-green-700 border-green-700'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setTutorTab('tutors')}
                className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                  tutorTab === 'tutors'
                    ? 'text-green-700 border-green-700'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tutors
              </button>
            </div>
          </div>
        )}

        {/* Calendar View Selector and Navigation - Only show for calendar tab or non-tutor learning */}
        {(learningType !== 'tutor' || tutorTab === 'calendar') && (
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              {/* View Selector */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCalendarView('day')}
                  className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    calendarView === 'day' 
                      ? 'bg-green-700 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setCalendarView('week')}
                  className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    calendarView === 'week' 
                      ? 'bg-green-700 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setCalendarView('month')}
                  className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    calendarView === 'month' 
                      ? 'bg-green-700 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Month
                </button>
              </div>

              {/* Current View Label */}
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800">
                  {calendarView === 'day' 
                    ? selectedDay.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                    : calendarView === 'week'
                      ? weekDates[0].toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
                      : weekDates[0].toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
                  }
                </h2>
                <p className="text-sm text-gray-600">
                  {calendarView === 'day' 
                    ? `Selected: ${selectedDay.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                    : calendarView === 'week'
                      ? `${weekDates[0].getDate()} - ${weekDates[6].getDate()} • Selected: ${selectedDay.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                      : `Month View • Selected: ${selectedDay.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                  }
                </p>
              </div>

              {/* Empty div for layout balance */}
              <div className="w-24"></div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => {
                  const newDate = new Date(selectedDay);
                  if (calendarView === 'day') {
                    newDate.setDate(newDate.getDate() - 1);
                  } else if (calendarView === 'week') {
                    newDate.setDate(newDate.getDate() - 7);
                  } else {
                    newDate.setMonth(newDate.getMonth() - 1);
                  }
                  setCurrentWeek(newDate);
                  setSelectedDay(newDate);
                  // Update sidebar calendar month to match
                  setSidebarCalendarMonth(new Date(newDate));
                }}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-white bg-gray-100 hover:bg-green-700 rounded-lg transition-all shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Previous</span>
              </button>

              <div className="px-4">
                <button
                  onClick={() => {
                    const today = new Date();
                    setCurrentWeek(today);
                    setSidebarCalendarMonth(new Date(today));
                    setSelectedDay(today);
                  }}
                  className="text-sm font-medium text-green-700 hover:text-green-800 hover:underline transition-colors"
                >
                  Today
                </button>
              </div>

              <button
                onClick={() => {
                  const newDate = new Date(selectedDay);
                  if (calendarView === 'day') {
                    newDate.setDate(newDate.getDate() + 1);
                  } else if (calendarView === 'week') {
                    newDate.setDate(newDate.getDate() + 7);
                  } else {
                    newDate.setMonth(newDate.getMonth() + 1);
                  }
                  setCurrentWeek(newDate);
                  setSelectedDay(newDate);
                  // Update sidebar calendar month to match
                  setSidebarCalendarMonth(new Date(newDate));
                }}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-white bg-gray-100 hover:bg-green-700 rounded-lg transition-all shadow-sm"
              >
                <span className="text-sm font-medium">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Content Area - Takes remaining space */}
        <div className="flex-1">
          {learningType === 'tutor' && tutorTab === 'tutors' ? (
            renderTutorsTab()
          ) : (
            <div className="p-6">
              {calendarView === 'day' ? renderDayView() : 
               calendarView === 'month' ? renderMonthView() : 
               renderCalendarGrid()}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {renderBookingModal()}

      {/* Click outside to close dropdown */}
      {showChildDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowChildDropdown(false)}
        />
      )}

      {/* Click outside to close tutor menu */}
      {showTutorMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowTutorMenu(null)}
        />
      )}
    </div>
  );
};

export default LessonManagementSystem;