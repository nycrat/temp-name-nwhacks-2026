import { Course, LiveClass } from './types';

// new fake data for live classes
const now = new Date();

export const INITIAL_LIVE_CLASSES: LiveClass[] = [
  {
    id: '1',
    course: {
      code: 'CPSC 310',
      name: 'Software Engineering',
      description: 'Processes and tools for large-scale software development.',
      imageUrl: 'https://picsum.photos/seed/code/400/300',
      level: 'Intermediate'
    },
    instructor: 'Dr. Reid',
    location: 'DMP 110',
    startTime: new Date(now.getTime() - 30 * 60000), // Started 30 mins ago
    durationMinutes: 90,
    capacity: 200,
    sneakScore: 'High',
    progress: 33
  },
  {
    id: '2',
    course: {
      code: 'ECON 101',
      name: 'Microeconomics',
      description: 'The study of individual decision-making in the economy.',
      imageUrl: 'https://picsum.photos/seed/econ/400/300',
      level: 'Beginner'
    },
    instructor: 'Prof. Gateman',
    location: 'BUCH A101',
    startTime: new Date(now.getTime() - 10 * 60000), // Started 10 mins ago
    durationMinutes: 50,
    capacity: 400,
    sneakScore: 'Low',
    progress: 20
  },
  {
    id: '3',
    course: {
      code: 'PHYS 401',
      name: 'Quantum Mechanics II',
      description: 'Advanced quantum phenomena and mathematical formalisms.',
      imageUrl: 'https://picsum.photos/seed/physics/400/300',
      level: 'Advanced'
    },
    instructor: 'Dr. Singh',
    location: 'HEBB 10',
    startTime: new Date(now.getTime() + 45 * 60000), // Starts in 45 mins
    durationMinutes: 120,
    capacity: 60,
    sneakScore: 'Medium',
    progress: 0
  },
  {
    id: '4',
    course: {
      code: 'MATH 200',
      name: 'Calculus III',
      description: 'Multivariable calculus and vector analysis.',
      imageUrl: 'https://picsum.photos/seed/math/400/300',
      level: 'Intermediate'
    },
    instructor: 'Prof. Euler',
    location: 'LSK 201',
    startTime: new Date(now.getTime() + 120 * 60000), // Starts in 2 hours
    durationMinutes: 60,
    capacity: 180,
    sneakScore: 'High',
    progress: 0
  }
];

export const INITIAL_COURSES: Course[] = []; // Main panel uses LiveClass course data or fresh search
