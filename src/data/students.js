import rawStudents from './students.json';

// Import Boy Vector Avatars
import boy1 from '../assets/avatars/boy1.svg';
import boy2 from '../assets/avatars/boy2.svg';
import boy3 from '../assets/avatars/boy3.svg';
import boy4 from '../assets/avatars/boy4.svg';
import boy5 from '../assets/avatars/boy5.svg';
import boy6 from '../assets/avatars/boy6.svg';
import boy7 from '../assets/avatars/boy7.svg';
import boy8 from '../assets/avatars/boy8.svg';
import boy9 from '../assets/avatars/boy9.svg';
import boy10 from '../assets/avatars/boy10.svg';
import boy11 from '../assets/avatars/boy11.svg';
import boy12 from '../assets/avatars/boy12.svg';

// Import Girl Vector Avatars
import girl1 from '../assets/avatars/girl1.svg';
import girl2 from '../assets/avatars/girl2.svg';
import girl3 from '../assets/avatars/girl3.svg';
import girl4 from '../assets/avatars/girl4.svg';
import girl5 from '../assets/avatars/girl5.svg';
import girl6 from '../assets/avatars/girl6.svg';
import girl7 from '../assets/avatars/girl7.svg';
import girl8 from '../assets/avatars/girl8.svg';
import girl9 from '../assets/avatars/girl9.svg';
import girl10 from '../assets/avatars/girl10.svg';
import girl11 from '../assets/avatars/girl11.svg';
import girl12 from '../assets/avatars/girl12.svg';

export const boyAvatars = [
  boy1, boy2, boy3, boy4, boy5, boy6,
  boy7, boy8, boy9, boy10, boy11, boy12
];

export const girlAvatars = [
  girl1, girl2, girl3, girl4, girl5, girl6,
  girl7, girl8, girl9, girl10, girl11, girl12
];

export const avatarMap = {
  '/avatars/boy1.svg': boy1,
  '/avatars/boy2.svg': boy2,
  '/avatars/boy3.svg': boy3,
  '/avatars/boy4.svg': boy4,
  '/avatars/boy5.svg': boy5,
  '/avatars/boy6.svg': boy6,
  '/avatars/boy7.svg': boy7,
  '/avatars/boy8.svg': boy8,
  '/avatars/boy9.svg': boy9,
  '/avatars/boy10.svg': boy10,
  '/avatars/boy11.svg': boy11,
  '/avatars/boy12.svg': boy12,
  '/avatars/girl1.svg': girl1,
  '/avatars/girl2.svg': girl2,
  '/avatars/girl3.svg': girl3,
  '/avatars/girl4.svg': girl4,
  '/avatars/girl5.svg': girl5,
  '/avatars/girl6.svg': girl6,
  '/avatars/girl7.svg': girl7,
  '/avatars/girl8.svg': girl8,
  '/avatars/girl9.svg': girl9,
  '/avatars/girl10.svg': girl10,
  '/avatars/girl11.svg': girl11,
  '/avatars/girl12.svg': girl12,
};

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

  // Resolve bundled asset, fallback to boy1
  const resolvedAvatar = avatarMap[student.avatar] || student.avatar || boy1;

  return {
    ...student,
    avatar: resolvedAvatar,
    initials: initials || 'ST'
  };
});

export default initialStudents;
