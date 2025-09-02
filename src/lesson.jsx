import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, BookOpen, ChevronLeft, ChevronRight, X, Check, AlertCircle, Users, Star } from 'lucide-react';

const LessonManagementSystem = () => {
  const [userType, setUserType] = useState('parent'); // 'parent' or 'child'
  const [selectedChild, setSelectedChild] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    duration: 30,
    teacherId: null
  });

  // Mock data
  const children = [
    { id: 1, name: 'Emma', age: 8, curriculum: 'Primary', avatar: '👧' },
    { id: 2, name: 'James', age: 12, curriculum: 'Lower Secondary', avatar: '👦' },
    { id: 3, name: 'Sophie', age: 16, curriculum: 'Upper Secondary', avatar: '👩' }
  ];

  const hiredTeachers = [
    { id: 1, name: 'Mrs. Johnson', subject: 'Mathematics', rating: 4.8, avatar: '👩‍🏫', color: 'bg-blue-500' },
    { id: 2, name: 'Mr. Smith', subject: 'English', rating: 4.9, avatar: '👨‍🏫', color: 'bg-purple-500' },
    { id: 3, name: 'Dr. Williams', subject: 'Science', rating: 4.7, avatar: '👨‍🔬', color: 'bg-teal-500' }
  ];

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const bookedLessons = [
    { teacherId: 1, day: 1, time: '14:00', duration: 60, childId: 1, subject: 'Math' },
    { teacherId: 2, day: 3, time: '16:00', duration: 30, childId: 2, subject: 'English' },
    { teacherId: 3, day: 5, time: '10:00', duration: 90, childId: 1, subject: 'Physics' },
    { teacherId: 1, day: 2, time: '15:00', duration: 60, childId: 3, subject: 'Algebra' },
    { teacherId: 2, day: 4, time: '11:00', duration: 30, childId: 2, subject: 'Literature' }
  ];

  const teacherAvailability = {
    1: { // Mrs. Johnson
      1: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      2: ['09:00', '10:00', '13:00', '14:00', '15:00'],
      3: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
      4: ['09:00', '13:00', '14:00', '15:00', '16:00'],
      5: ['09:00', '10:00', '11:00', '15:00', '16:00'],
      6: ['10:00', '11:00', '14:00', '15:00'],
      0: ['14:00', '15:00', '16:00']
    },
    2: { // Mr. Smith  
      1: ['08:00', '09:00', '13:00', '15:00', '17:00'],
      2: ['09:00', '10:00', '14:00', '16:00', '17:00'],
      3: ['08:00', '09:00', '15:00', '16:00', '17:00'],
      4: ['09:00', '13:00', '14:00', '16:00', '17:00'],
      5: ['08:00', '09:00', '13:00', '15:00'],
      6: ['09:00', '10:00', '15:00', '16:00'],
      0: []
    },
    3: { // Dr. Williams
      1: ['10:00', '11:00', '15:00', '16:00', '18:00'],
      2: ['09:00', '11:00', '14:00', '17:00', '18:00'],
      3: ['10:00', '11:00', '16:00', '17:00'],
      4: ['09:00', '10:00', '15:00', '17:00', '18:00'],
      5: ['10:00', '11:00', '14:00', '15:00', '16:00'],
      6: ['11:00', '15:00', '16:00', '17:00'],
      0: ['15:00', '16:00']
    }
  };

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

  const handleSlotClick = (dayIndex, timeSlot) => {
    const availableTeachers = getAvailableTeachers(dayIndex, timeSlot);
    if (availableTeachers.length > 0) {
      setSelectedSlot({ dayIndex, timeSlot, availableTeachers });
      setBookingDetails({
        duration: 30,
        teacherId: availableTeachers.length === 1 ? availableTeachers[0].id : null
      });
      setShowBookingModal(true);
    }
  };

  const handleBookLesson = () => {
    // Here you would typically make an API call to book the lesson
    console.log('Booking lesson:', {
      childId: children[selectedChild].id,
      teacherId: bookingDetails.teacherId,
      day: selectedSlot.dayIndex,
      time: selectedSlot.timeSlot,
      duration: bookingDetails.duration
    });
    
    setShowBookingModal(false);
    setSelectedSlot(null);
  };

  const renderCalendarGrid = () => {
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
        <div className="flex-1">
          {timeSlots.slice(8, 20).map((timeSlot, timeIndex) => (
            <div key={timeSlot} className="grid grid-cols-8 border-b border-gray-100 h-16">
              <div className="p-3 bg-gray-50 text-sm font-medium text-gray-600 border-r border-gray-200 flex items-center justify-center">
                {timeSlot}
              </div>
              {weekDates.map((date, dayIndex) => {
                const availableTeachers = getAvailableTeachers(dayIndex, timeSlot);
                const bookedLesson = bookedLessons.find(lesson => 
                  lesson.day === dayIndex && 
                  lesson.time === timeSlot
                );
                
                // Check if this slot is reserved for the current child or another child
                const isReservedForCurrentChild = bookedLesson && 
                  (userType === 'parent' ? bookedLesson.childId === children[selectedChild].id : true);
                const isReservedForOtherChild = bookedLesson && 
                  (userType === 'parent' ? bookedLesson.childId !== children[selectedChild].id : false);

                return (
                  <div
                    key={`${dayIndex}-${timeSlot}`}
                    className={`p-2 border-r border-gray-100 h-16 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                      isReservedForCurrentChild
                        ? 'bg-green-100 border-l-4 border-green-500' 
                        : isReservedForOtherChild
                          ? 'bg-orange-100 border-l-4 border-orange-500 cursor-not-allowed'
                        : availableTeachers.length > 0 
                          ? 'hover:bg-blue-50 hover:shadow-inner' 
                          : 'bg-gray-50 cursor-not-allowed'
                    }`}
                    onClick={() => !bookedLesson && availableTeachers.length > 0 && handleSlotClick(dayIndex, timeSlot)}
                  >
                    {isReservedForCurrentChild ? (
                      <div className="text-xs text-center">
                        <div className="font-semibold text-green-700 truncate">{bookedLesson.subject}</div>
                        <div className="text-green-600 truncate">{hiredTeachers.find(t => t.id === bookedLesson.teacherId)?.name.split(' ')[0]}</div>
                        <div className="text-green-500">{bookedLesson.duration}min</div>
                      </div>
                    ) : isReservedForOtherChild ? (
                      <div className="text-xs text-center">
                        <div className="font-semibold text-orange-700">Reserved</div>
                        <div className="text-orange-600">{children.find(c => c.id === bookedLesson.childId)?.name}</div>
                        <div className="text-orange-500">{bookedLesson.duration}min</div>
                      </div>
                    ) : availableTeachers.length > 0 ? (
                      <div className="flex flex-wrap gap-1 justify-center">
                        {availableTeachers.slice(0, 6).map(teacher => (
                          <div
                            key={teacher.id}
                            className={`w-5 h-5 rounded-full ${teacher.color} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
                            title={teacher.name}
                          >
                            {teacher.name.charAt(0)}
                          </div>
                        ))}
                        {availableTeachers.length > 6 && (
                          <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold">
                            +{availableTeachers.length - 6}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 text-center">Not available</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSidebar = () => {
    return (
      <div className="h-full p-6 space-y-6 overflow-y-auto">
        {/* User Type Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setUserType('parent')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              userType === 'parent' ? 'bg-green-700 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Parent View
          </button>
          <button
            onClick={() => setUserType('child')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              userType === 'child' ? 'bg-green-700 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Child View
          </button>
        </div>

        {/* Child Selection (Parent View Only) */}
        {userType === 'parent' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Child</h3>
            <div className="space-y-2">
              {children.map((child, index) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(index)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedChild === index
                      ? 'bg-green-700 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{child.avatar}</span>
                    <div>
                      <div className="font-semibold">{child.name}</div>
                      <div className={`text-sm ${selectedChild === index ? 'text-green-200' : 'text-gray-500'}`}>
                        {child.curriculum} • Age {child.age}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hired Teachers */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Teachers</h3>
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
                    <div className="flex items-center text-sm text-yellow-600">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {teacher.rating}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Summary */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">This Week</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-green-700">Lessons Booked</span>
              <span className="font-semibold text-green-800">
                {bookedLessons.filter(lesson => 
                  userType === 'parent' ? lesson.childId === children[selectedChild].id : true
                ).length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-700">Available Slots</span>
              <span className="font-semibold text-blue-800">24</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm text-purple-700">Total Hours</span>
              <span className="font-semibold text-purple-800">4.5h</span>
            </div>
          </div>
        </div>
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
                {[30, 60, 90, 120].map(duration => (
                  <button
                    key={duration}
                    onClick={() => setBookingDetails(prev => ({ ...prev, duration }))}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                      bookingDetails.duration === duration
                        ? 'bg-green-700 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {duration === 30 ? '30 min' : duration === 60 ? '1 hour' : duration === 90 ? '1.5 hours' : '2 hours'}
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
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex-shrink-0">
        {renderSidebar()}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {/* <div className="bg-white border-b border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Lesson Management</h1>
          <p className="text-gray-600">
            {userType === 'parent' 
              ? `Managing lessons for ${children[selectedChild].name}` 
              : 'Your upcoming lessons and schedule'
            }
          </p>
        </div> */}

        {/* Week Navigation */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                const newWeek = new Date(currentWeek);
                newWeek.setDate(newWeek.getDate() - 7);
                setCurrentWeek(newWeek);
              }}
              className="p-2 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800">
                {weekDates[0].toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </h2>
              <p className="text-sm text-gray-600">
                {weekDates[0].getDate()} - {weekDates[6].getDate()}
              </p>
            </div>
            
            <button
              onClick={() => {
                const newWeek = new Date(currentWeek);
                newWeek.setDate(newWeek.getDate() + 7);
                setCurrentWeek(newWeek);
              }}
              className="p-2 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid - Takes remaining space */}
        <div className="flex-1 p-6">
          {renderCalendarGrid()}
        </div>

        {/* Instructions Footer */}
        {/* <div className="bg-blue-50 border-t border-blue-200 p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800">How to book lessons:</h4>
              <div className="text-sm text-blue-700 mt-1 flex flex-wrap gap-x-6 gap-y-1">
                <span>• Click on colored circles to book</span>
                <span>• Green slots are booked lessons</span>
                <span>• Gray slots are unavailable</span>
                <span>• Each color represents a different teacher</span>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Booking Modal */}
      {renderBookingModal()}
    </div>
  );
};

export default LessonManagementSystem;