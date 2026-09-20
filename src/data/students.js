import rawStudents from './students.json';

// Import 20 Boy Vector Avatars
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
import boy13 from '../assets/avatars/boy13.svg';
import boy14 from '../assets/avatars/boy14.svg';
import boy15 from '../assets/avatars/boy15.svg';
import boy16 from '../assets/avatars/boy16.svg';
import boy17 from '../assets/avatars/boy17.svg';
import boy18 from '../assets/avatars/boy18.svg';
import boy19 from '../assets/avatars/boy19.svg';
import boy20 from '../assets/avatars/boy20.svg';

// Import 20 Girl Vector Avatars
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
import girl13 from '../assets/avatars/girl13.svg';
import girl14 from '../assets/avatars/girl14.svg';
import girl15 from '../assets/avatars/girl15.svg';
import girl16 from '../assets/avatars/girl16.svg';
import girl17 from '../assets/avatars/girl17.svg';
import girl18 from '../assets/avatars/girl18.svg';
import girl19 from '../assets/avatars/girl19.svg';
import girl20 from '../assets/avatars/girl20.svg';

export const boyAvatars = [
  boy1, boy2, boy3, boy4, boy5, boy6, boy7, boy8, boy9, boy10,
  boy11, boy12, boy13, boy14, boy15, boy16, boy17, boy18, boy19, boy20
];

export const girlAvatars = [
  girl1, girl2, girl3, girl4, girl5, girl6, girl7, girl8, girl9, girl10,
  girl11, girl12, girl13, girl14, girl15, girl16, girl17, girl18, girl19, girl20
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
  '/avatars/boy13.svg': boy13,
  '/avatars/boy14.svg': boy14,
  '/avatars/boy15.svg': boy15,
  '/avatars/boy16.svg': boy16,
  '/avatars/boy17.svg': boy17,
  '/avatars/boy18.svg': boy18,
  '/avatars/boy19.svg': boy19,
  '/avatars/boy20.svg': boy20,
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
  '/avatars/girl13.svg': girl13,
  '/avatars/girl14.svg': girl14,
  '/avatars/girl15.svg': girl15,
  '/avatars/girl16.svg': girl16,
  '/avatars/girl17.svg': girl17,
  '/avatars/girl18.svg': girl18,
  '/avatars/girl19.svg': girl19,
  '/avatars/girl20.svg': girl20,
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

  const resolvedAvatar = avatarMap[student.avatar] || student.avatar || boy1;

  return {
    ...student,
    avatar: resolvedAvatar,
    initials: initials || 'ST'
  };
});

export default initialStudents;
