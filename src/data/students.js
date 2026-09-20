import rawStudents from './students.json';

export const departments = [
  'Computer Science',
  'Information Technology',
  'Artificial Intelligence',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Data Science',
  'Cybersecurity',
  'Aerospace Engineering'
];

export const initialStudents = rawStudents.map(student => {
  let initials = '';
  if (student.name) {
    const parts = student.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts.length === 1 && parts[0].length > 0) {
      initials = parts[0].slice(0, 2).toUpperCase();
    }
  }
  return {
    ...student,
    initials: initials || 'ST'
  };
});

export default initialStudents;
