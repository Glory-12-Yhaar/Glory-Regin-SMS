
// -----------------------------------
// STATE & CONFIG
// -----------------------------------
let currentRole = 'Visitor', currentMod = 'dashboard', darkMode = false, loginRole = 'Teacher';
const SCHOOL_EMAIL = 'gloryreign2011@gmail.com';
let navigationHistory = ['dashboard'];  // Track page history for back button
let miniCalDate = new Date();  // Track mini calendar navigation

// -----------------------------------
// DARK MODE INITIALIZATION
// -----------------------------------
function initializeDarkMode() {
  // Load saved theme preference from localStorage
  const savedTheme = localStorage.getItem('gloryReignTheme');
  if (savedTheme) {
    darkMode = savedTheme === 'dark';
  } else if (SETTINGS_DATA && SETTINGS_DATA.appearance) {
    darkMode = SETTINGS_DATA.appearance.theme === 'Dark';
  }
  applyTheme();
}

function applyTheme() {
  if (darkMode) {
    document.body.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  } else {
    document.body.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }
  // Update Settings data
  if (SETTINGS_DATA && SETTINGS_DATA.appearance) {
    SETTINGS_DATA.appearance.theme = darkMode ? 'Dark' : 'Light';
    saveSettingsToStorage();
  }
  // Update theme selector if it exists
  const themeSelect = document.getElementById('theme-select');
  if (themeSelect) {
    themeSelect.value = darkMode ? 'Dark' : 'Light';
  }
}

// Initialize dark mode on page load
window.addEventListener('load', initializeDarkMode);

// -----------------------------------
// DATA LAYER - STUDENTS, SUBJECTS, SCORES
// -----------------------------------

// SUBJECTS BY CLASS
const SUBJECTS_BY_CLASS = {
  'Creche': ['Numeracy', 'Literacy', 'Creative Art', 'Writing', 'Environmental Studies'],
  'Nursery': ['Numeracy', 'Literacy', 'Creative Art', 'Writing', 'Environmental Studies'],
  'KG 1': ['Numeracy', 'Literacy', 'Creative Art', 'Writing', 'Environmental Studies'],
  'KG 2': ['Numeracy', 'Literacy', 'Creative Art', 'Writing', 'Environmental Studies'],
  'Basic 1': ['Mathematics', 'Science', 'English', 'Dagaare', 'Computing', 'History', 'RME', 'Creative Art'],
  'Basic 2': ['Mathematics', 'Science', 'English', 'Dagaare', 'Computing', 'History', 'RME', 'Creative Art'],
  'Basic 3': ['Mathematics', 'Science', 'English', 'Dagaare', 'Computing', 'History', 'RME', 'Creative Art'],
  'Basic 4': ['Mathematics', 'Science', 'English', 'Dagaare', 'Computing', 'History', 'RME', 'Creative Art'],
  'Basic 5': ['Mathematics', 'Science', 'English', 'Dagaare', 'Computing', 'History', 'RME', 'Creative Art'],
  'Basic 6': ['Mathematics', 'Science', 'English', 'Dagaare', 'Computing', 'History', 'RME', 'Creative Art'],
  'JHS 1': ['Mathematics', 'Science', 'English', 'Social Studies', 'Computing', 'Career Technology', 'RME', 'Creative Art', 'Dagaare'],
  'JHS 2': ['Mathematics', 'Science', 'English', 'Social Studies', 'Computing', 'Career Technology', 'RME', 'Creative Art', 'Dagaare'],
  'JHS 3': ['Mathematics', 'Science', 'English', 'Social Studies', 'Computing', 'Career Technology', 'RME', 'Creative Art', 'Dagaare']
};

// STUDENT DATA STRUCTURE
const STUDENTS_DATA = {
  'Ama Serwaa': {
    id: '2024-38',
    class: 'JHS 1',
    classTeacher: 'Ms. Mensah',
    stream: 'General',
    term: '1st Term',
    academicYear: '2024/2025',
    attendance: 92,
    dob: '2010-05-15',
    gender: 'Female',
    scores: {
      'Mathematics': { classScore: 45, examScore: 39 },
      'English Language': { classScore: 48, examScore: 42 },
      'Integrated Science': { classScore: 46, examScore: 44 },
      'Social Studies': { classScore: 44, examScore: 40 },
      'Coputing': { classScore: 45, examScore: 38 },
      'French Language': { classScore: 42, examScore: 35 }
    }
  },
  'Kwame Asante': {
    id: '2024-41',
    class: 'Basic 6',
    classTeacher: 'Mr. Boateng Sr.',
    stream: 'General',
    term: '1st Term',
    academicYear: '2024/2025',
    attendance: 88,
    dob: '2011-03-22',
    gender: 'Male',
    scores: {
      'Mathematics': { classScore: 35, examScore: 32 },
      'English Language': { classScore: 42, examScore: 40 },
      'History': { classScore: 44, examScore: 42 },
      'Natural Science': { classScore: 40, examScore: 38 },
      'Computing': { classScore: 38, examScore: 36 },
      'French Language': { classScore: 35, examScore: 33 }
    }
  },
  'Abena Mensah': {
    id: '2024-42',
    class: 'Basic 6',
    classTeacher: 'Mr. Boateng Sr.',
    stream: 'General',
    term: '1st Term',
    academicYear: '2024/2025',
    attendance: 95,
    dob: '2011-07-10',
    gender: 'Female',
    scores: {
      'Mathematics': { classScore: 48, examScore: 43 },
      'English Language': { classScore: 49, examScore: 45 },
      'History': { classScore: 47, examScore: 44 },
      'Natural Science': { classScore: 45, examScore: 42 },
      'Computing': { classScore: 46, examScore: 41 },
      'French Language': { classScore: 43, examScore: 40 }
    }
  },
  'Kofi Boateng': {
    id: '2024-43',
    class: 'Basic 6',
    classTeacher: 'Mr. Boateng Sr.',
    stream: 'General',
    term: '1st Term',
    academicYear: '2024/2025',
    attendance: 81,
    dob: '2011-09-18',
    gender: 'Male',
    scores: {
      'Mathematics': { classScore: 28, examScore: 25 },
      'English Language': { classScore: 36, examScore: 34 },
      'History': { classScore: 38, examScore: 36 },
      'Natural': { classScore: 35, examScore: 32 },
      'Computing': { classScore: 32, examScore: 30 },
      'French Language': { classScore: 30, examScore: 28 }
    }
  },
  'Akosua Darko': {
    id: '2024-39',
    class: 'JHS 1',
    classTeacher: 'Ms. Mensah',
    stream: 'General',
    term: '1st Term',
    academicYear: '2024/2025',
    attendance: 97,
    dob: '2010-01-12',
    gender: 'Female',
    scores: {
      'Mathematics': { classScore: 49, examScore: 48 },
      'English Language': { classScore: 50, examScore: 48 },
      'Integrated Science': { classScore: 49, examScore: 47 },
      'Social Studies': { classScore: 48, examScore: 46 },
      'Computing': { classScore: 48, examScore: 47 },
      'French Language': { classScore: 45, examScore: 42 }
    }
  },
  'Yaw Mensah': {
    id: '2024-44',
    class: 'Basic 5',
    classTeacher: 'Mrs. Asante',
    stream: 'General',
    term: '1st Term',
    academicYear: '2024/2025',
    attendance: 90,
    dob: '2011-11-08',
    gender: 'Male',
    scores: {
      'Mathematics': { classScore: 41, examScore: 39 },
      'English Language': { classScore: 43, examScore: 41 },
      'Science': { classScore: 42, examScore: 40 },
      'Social Studies': { classScore: 41, examScore: 39 },
      'ICT': { classScore: 40, examScore: 37 },
      'Physical Education': { classScore: 43, examScore: 41 }
    }
  },
  'Adwoa Frimpong': {
    id: '2024-45',
    class: 'Basic 5',
    classTeacher: 'Mrs. Asante',
    stream: 'General',
    term: '1st Term',
    academicYear: '2024/2025',
    attendance: 93,
    dob: '2011-04-20',
    gender: 'Female',
    scores: {
      'Mathematics': { classScore: 45, examScore: 42 },
      'English Language': { classScore: 46, examScore: 44 },
      'Science': { classScore: 44, examScore: 42 },
      'Social Studies': { classScore: 43, examScore: 41 },
      'ICT': { classScore: 44, examScore: 40 },
      'Physical Education': { classScore: 45, examScore: 43 }
    }
  },
  'Kweku Ofori': {
    id: '2024-46',
    class: 'JHS 2',
    classTeacher: 'Mr. Owusu',
    stream: 'General',
    term: '1st Term',
    academicYear: '2024/2025',
    attendance: 79,
    dob: '2009-12-05',
    gender: 'Male',
    scores: {
      'Mathematics': { classScore: 30, examScore: 28 },
      'English Language': { classScore: 34, examScore: 32 },
      'Integrated Science': { classScore: 32, examScore: 30 },
      'Social Studies': { classScore: 35, examScore: 33 },
      'ICT': { classScore: 33, examScore: 31 },
      'French Language': { classScore: 31, examScore: 29 }
    }
  }
};

// ASSIGNMENTS DATA STRUCTURE
const ASSIGNMENTS_DATA = {
  '1': {
    id: '1',
    title: 'Chapter 5 Problems',
    subject: 'Mathematics',
    class: 'Basic 6',
    teacher: 'Mr. Boateng Sr.',
    dueDate: '2025-03-17',
    createdDate: '2025-03-10',
    maxScore: 50,
    status: 'Active',
    instructions: 'Solve all problems in Chapter 5 including word problems. Show all working.',
    attachment: 'Chapter5-Problems.pdf',
    submissions: {
      'Ama Serwaa': { submitted: '2025-03-16', score: 45, feedback: 'Excellent work! All problems solved correctly.' },
      'Kwame Asante': { submitted: '2025-03-16', score: 38, feedback: 'Good effort. Check problem 7 again.' },
      'Abena Mensah': { submitted: '2025-03-15', score: 48, feedback: 'Perfect! Very accurate solutions.' },
      'Akosua Darko': { submitted: '2025-03-14', score: 50, feedback: 'Outstanding! Perfect solution.' },
      'Yaw Mensah': { submitted: '2025-03-16', score: 42, feedback: 'Good work overall.' }
    }
  },
  '2': {
    id: '2',
    title: 'Essay on Climate Change',
    subject: 'English',
    class: 'JHS 1',
    teacher: 'Ms. Mensah',
    dueDate: '2025-03-20',
    createdDate: '2025-03-08',
    maxScore: 40,
    status: 'Active',
    instructions: 'Write a 500-word essay on the causes and effects of climate change. Include at least 3 sources.',
    attachment: 'EssayGuidelines.docx',
    submissions: {
      'Ama Serwaa': { submitted: '2025-03-18', score: 36, feedback: 'Great research and clear arguments.' },
      'Abena Mensah': { submitted: '2025-03-17', score: 38, feedback: 'Excellent essay with strong points.' },
      'Akosua Darko': { submitted: '2025-03-16', score: 40, feedback: 'Outstanding essay! Perfect structure.' }
    }
  },
  '3': {
    id: '3',
    title: 'Lab Report Chapter 3',
    subject: 'Science',
    class: 'Basic 4',
    teacher: 'Mrs. Asante',
    dueDate: '2025-03-22',
    createdDate: '2025-03-15',
    maxScore: 30,
    status: 'Active',
    instructions: 'Write a detailed lab report on the experiment conducted in class. Include hypothesis, procedure, results, and conclusion.',
    attachment: 'LabReportTemplate.docx',
    submissions: {
      'Kwame Asante': { submitted: '2025-03-21', score: 25, feedback: 'Good attempt. Include more details in results.' },
      'Yaw Mensah': { submitted: '2025-03-20', score: 28, feedback: 'Excellent report with clear structure.' }
    }
  },
  '4': {
    id: '4',
    title: 'Database Design',
    subject: 'ICT',
    class: 'Basic 5',
    teacher: 'Mr. Owusu',
    dueDate: '2025-03-25',
    createdDate: '2025-03-17',
    maxScore: 60,
    status: 'Active',
    instructions: 'Design a database for a school management system with ERD and SQL queries.',
    attachment: 'DatabaseTemplate.sql',
    submissions: {}
  },
  '5': {
    id: '5',
    title: 'WWI Essay',
    subject: 'History',
    class: 'JHS 2',
    teacher: 'Mr. Owusu',
    dueDate: '2025-03-28',
    createdDate: '2025-03-18',
    maxScore: 40,
    status: 'Upcoming',
    instructions: 'Write an essay on the causes and consequences of World War I.',
    attachment: 'WW1Guidelines.pdf',
    submissions: {}
  },
  '6': {
    id: '6',
    title: 'French Vocab Test',
    subject: 'French',
    class: 'Basic 6',
    teacher: 'Mr. Boateng Sr.',
    dueDate: '2025-04-01',
    createdDate: '2025-03-20',
    maxScore: 25,
    status: 'Upcoming',
    instructions: 'Test on vocabulary from Units 5-7. 50 multiple choice and 10 fill-in-the-blank questions.',
    attachment: 'VocabList.pdf',
    submissions: {}
  }
};

// ALUMNI DATA STRUCTURE
const ALUMNI_DATA = {
  'ALM001': { id: 'ALM001', name: 'Abena Owusu', classYear: 2018, profession: 'Software Engineer', location: 'Accra Â· Google Ghana', avatar: 'AO', avatarColor: 'purple', bio: 'Working as Senior Developer at Google Ghana', email: 'abena.owusu@gmail.com', phone: '+233 24 111 0001', instagram: '@abenaotech', linkedin: 'linkedin.com/in/abenaowusu', twitter: '@abenaotech', facebook: 'facebook.com/abena.owusu' },
  'ALM002': { id: 'ALM002', name: 'Kwabena Asare', classYear: 2016, profession: 'Medical Doctor', location: 'London Â· NHS', avatar: 'KA', avatarColor: 'blue', bio: 'Consultant Physician at London NHS Hospital', email: 'kwabena.asare@nhs.uk', phone: '+44 7911 123456', instagram: '@kwabenadr', linkedin: 'linkedin.com/in/kwabenaasare', twitter: '@kwabenaasare', facebook: 'facebook.com/kwabena.asare' },
  'ALM003': { id: 'ALM003', name: 'Esi Mensah', classYear: 2020, profession: 'Teacher', location: 'Kumasi Â· College', avatar: 'EM', avatarColor: 'green', bio: 'Secondary School Teacher - English & Literature', email: 'esi.mensah@college.edu.gh', phone: '+233 24 222 0003', instagram: '@esimenteach', linkedin: 'linkedin.com/in/esimensah', twitter: '@esiteacher', facebook: 'facebook.com/esi.mensah' },
  'ALM004': { id: 'ALM004', name: 'Yaw Boateng', classYear: 2015, profession: 'Lawyer', location: 'Toronto Â· Law Firm', avatar: 'YB', avatarColor: 'gold', bio: 'Senior Associate at Toronto Law Partnership', email: 'yaw.boateng@lawfirm.ca', phone: '+1 416 987 6543', instagram: '@yawlawyer', linkedin: 'linkedin.com/in/yawboateng', twitter: '@yawboatenglaw', facebook: 'facebook.com/yaw.boateng' },
  'ALM005': { id: 'ALM005', name: 'Akua Adjei', classYear: 2019, profession: 'Nurse', location: 'Accra Â· Korle Bu', avatar: 'AA', avatarColor: 'teal', bio: 'Registered Nurse at Korle Bu Teaching Hospital', email: 'akua.adjei@korlebu.org', phone: '+233 24 333 0005', instagram: '@akuanurse', linkedin: 'linkedin.com/in/akuaadjei', twitter: '@akuahealth', facebook: 'facebook.com/akua.adjei' },
  'ALM006': { id: 'ALM006', name: 'Kofi Antwi', classYear: 2014, profession: 'Civil Engineer', location: 'Takoradi Â· GHA', avatar: 'KA', avatarColor: 'orange', bio: 'Project Manager - Civil Engineering Division', email: 'kofi.antwi@gha-eng.com.gh', phone: '+233 24 444 0006', instagram: '@kofieng', linkedin: 'linkedin.com/in/kofiantwi', twitter: '@kofiengineering', facebook: 'facebook.com/kofi.antwi' },
  'ALM007': { id: 'ALM007', name: 'Nadia Hassan', classYear: 2017, profession: 'Business Analyst', location: 'Dubai Â· Tech Corp', avatar: 'NH', avatarColor: 'purple', bio: 'Business Solutions Analyst - Middle East Tech', email: 'nadia.hassan@techcorp.ae', phone: '+971 50 123 4567', instagram: '@nadiabiz', linkedin: 'linkedin.com/in/nadiahassan', twitter: '@nadiatech', facebook: 'facebook.com/nadia.hassan' },
  'ALM008': { id: 'ALM008', name: 'Samuel Boadi', classYear: 2013, profession: 'Banking Executive', location: 'Accra Â· Bank HQ', avatar: 'SB', avatarColor: 'blue', bio: 'Head of Business Development - Banking Sector', email: 'samuel.boadi@bank.com.gh', phone: '+233 24 555 0008', instagram: '@samuelbanks', linkedin: 'linkedin.com/in/samuelboadi', twitter: '@samuelboadi', facebook: 'facebook.com/samuel.boadi' },
  'ALM009': { id: 'ALM009', name: 'Grace Mensah', classYear: 2021, profession: 'Graphic Designer', location: 'Accra Â· Creative Studio', avatar: 'GM', avatarColor: 'pink', bio: 'UI/UX Designer at Accra Creative Studio', email: 'grace.mensah@creative.com.gh', phone: '+233 24 666 0009', instagram: '@gracedesi_gns', linkedin: 'linkedin.com/in/gracemensah', twitter: '@gracedesigns', facebook: 'facebook.com/grace.mensah' },
  'ALM010': { id: 'ALM010', name: 'David Owusu', classYear: 2012, profession: 'Architect', location: 'Singapore Â· Design Firm', avatar: 'DO', avatarColor: 'teal', bio: 'Senior Architect - International Design Projects', email: 'david.owusu@designfirm.sg', phone: '+65 6789 0123', instagram: '@davidarch', linkedin: 'linkedin.com/in/davidowusu', twitter: '@davidarchitect', facebook: 'facebook.com/david.owusu' }
};

// STAFF DATA STRUCTURE
const STAFF_DATA = {
  'KWA001': {
    id: 'KWA001',
    name: 'Mr. Kweku Amponsah',
    email: 'kweku.amponsah@school.edu.gh',
    phone: '+233 24 100 0001',
    category: 'Teaching',
    department: 'Mathematics',
    position: 'Senior Teacher',
    qualifications: 'B.Sc Mathematics (Legon), Diploma in Education',
    salaryGrade: 'Grade 8',
    joinDate: '2013-01-15',
    gender: 'Male',
    dob: '1985-05-22',
    address: '123 Education Street, Accra',
    emergencyContact: 'Ama Amponsah',
    emergencyPhone: '+233 244 567 890',
    status: 'Active',
    performance: '4.8/5',
    assignments: ['JHS 1 Math', 'Basic 6 Maths', 'Further Maths'],
    avatar: 'KA'
  },
  'AKA002': {
    id: 'AKA002',
    name: 'Mrs. Akua Asante',
    email: 'akua.asante@school.edu.gh',
    phone: '+233 24 100 0002',
    category: 'Teaching',
    department: 'Languages',
    position: 'Senior Teacher',
    qualifications: 'B.A English (UCC), Diploma in Education',
    salaryGrade: 'Grade 7',
    joinDate: '2017-03-10',
    gender: 'Female',
    dob: '1988-07-14',
    address: '456 Learning Street, Accra',
    emergencyContact: 'Kwame Asante',
    emergencyPhone: '+233 245 678 901',
    status: 'Active',
    performance: '4.6/5',
    assignments: ['JHS 1 English', 'Basic 6 English'],
    avatar: 'AA'
  },
  'KMN003': {
    id: 'KMN003',
    name: 'Mr. Kojo Mensah',
    email: 'kojo.mensah@school.edu.gh',
    phone: '+233 24 100 0003',
    category: 'Admin',
    department: 'Finance',
    position: 'Accounts Officer',
    qualifications: 'HND Accounting',
    salaryGrade: 'Admin A',
    joinDate: '2015-06-20',
    gender: 'Male',
    dob: '1982-09-03',
    address: '789 Finance Lane, Accra',
    emergencyContact: 'Abena Mensah',
    emergencyPhone: '+233 246 789 012',
    status: 'Active',
    performance: '4.5/5',
    assignments: ['Payroll', 'Accounts'],
    avatar: 'KM'
  },
  'ABO004': {
    id: 'ABO004',
    name: 'Ms. Abena Ofori',
    email: 'abena.ofori@school.edu.gh',
    phone: '+233 24 100 0004',
    category: 'Admin',
    department: 'Front Office',
    position: 'Receptionist',
    qualifications: 'Diploma in Secretarial Studies',
    salaryGrade: 'Admin B',
    joinDate: '2020-09-15',
    gender: 'Female',
    dob: '1995-02-11',
    address: '321 Office Avenue, Accra',
    emergencyContact: 'John Ofori',
    emergencyPhone: '+233 247 890 123',
    status: 'Active',
    performance: '4.3/5',
    assignments: ['Reception', 'Calls'],
    avatar: 'AO'
  },
  'KWO005': {
    id: 'KWO005',
    name: 'Mr. Kwame Oti',
    email: 'kwame.oti@school.edu.gh',
    phone: '+233 24 100 0005',
    category: 'Support',
    department: 'Maintenance',
    position: 'Maintenance Supervisor',
    qualifications: 'Technical Certificate in Building Maintenance',
    salaryGrade: 'Support',
    joinDate: '2018-01-08',
    gender: 'Male',
    dob: '1980-11-30',
    address: '654 Support Road, Accra',
    emergencyContact: 'Ama Oti',
    emergencyPhone: '+233 248 901 234',
    status: 'Active',
    performance: '4.4/5',
    assignments: ['Maintenance', 'Repairs'],
    avatar: 'KO'
  },
  'FPA006': {
    id: 'FPA006',
    name: 'Ms. Freda Poku',
    email: 'freda.poku@school.edu.gh',
    phone: '+233 24 100 0006',
    category: 'Teaching',
    department: 'ICT',
    position: 'Teacher',
    qualifications: 'B.Tech ICT (KNUST)',
    salaryGrade: 'Grade 6',
    joinDate: '2019-08-25',
    gender: 'Female',
    dob: '1992-04-18',
    address: '987 Tech Street, Accra',
    emergencyContact: 'Ernest Poku',
    emergencyPhone: '+233 249 012 345',
    status: 'Active',
    performance: '4.7/5',
    assignments: ['ICT Lab', 'Computer Classes'],
    avatar: 'FP'
  },
  'YOB007': {
    id: 'YOB007',
    name: 'Mr. Yaw Boateng Sr.',
    email: 'yaw.boateng@school.edu.gh',
    phone: '+233 24 100 0007',
    category: 'Teaching',
    department: 'Social Studies',
    position: 'Teacher',
    qualifications: 'B.A History (UG)',
    salaryGrade: 'Grade 6',
    joinDate: '2016-09-12',
    gender: 'Male',
    dob: '1986-03-25',
    address: '159 History Street, Accra',
    emergencyContact: 'Grace Boateng',
    emergencyPhone: '+233 240 123 456',
    status: 'Active',
    performance: '4.5/5',
    assignments: ['Basic 6 History', 'Social Studies'],
    avatar: 'YB'
  },
  'NYS008': {
    id: 'NYS008',
    name: 'Mrs. Nana Yaa Sekyere',
    email: 'nana.sekyere@school.edu.gh',
    phone: '+233 24 100 0008',
    category: 'Teaching',
    department: 'Science',
    position: 'Science Coordinator',
    qualifications: 'B.Sc Biology (KNUST), Diploma in Education',
    salaryGrade: 'Grade 7',
    joinDate: '2014-02-01',
    gender: 'Female',
    dob: '1987-06-09',
    address: '357 Science Park, Accra',
    emergencyContact: 'Samuel Sekyere',
    emergencyPhone: '+233 241 234 567',
    status: 'Active',
    performance: '4.8/5',
    assignments: ['Science Lab', 'Biology', 'Chemistry'],
    avatar: 'NS'
  },
  'ABD009': {
    id: 'ABD009',
    name: 'Mr. Abdul Hassan',
    email: 'abdul.hassan@school.edu.gh',
    phone: '+233 24 100 0009',
    category: 'Support',
    department: 'Security',
    position: 'Security Officer',
    qualifications: 'National Security Certificate',
    salaryGrade: 'Support',
    joinDate: '2017-07-10',
    gender: 'Male',
    dob: '1979-08-15',
    address: '741 Security Lane, Accra',
    emergencyContact: 'Zainab Hassan',
    emergencyPhone: '+233 242 345 678',
    status: 'Active',
    performance: '4.2/5',
    assignments: ['Gate Security', 'Patrol'],
    avatar: 'AH'
  },
  'RSO010': {
    id: 'RSO010',
    name: 'Ms. Rose Sarbah',
    email: 'rose.sarbah@school.edu.gh',
    phone: '+233 24 100 0010',
    category: 'Admin',
    department: 'Registrar',
    position: 'Registrar',
    qualifications: 'Diploma in Educational Management',
    salaryGrade: 'Admin A',
    joinDate: '2012-08-20',
    gender: 'Female',
    dob: '1981-10-05',
    address: '852 Admin Street, Accra',
    emergencyContact: 'Daniel Sarbah',
    emergencyPhone: '+233 243 456 789',
    status: 'Active',
    performance: '4.9/5',
    assignments: ['Records', 'Registration'],
    avatar: 'RS'
  }
};

// USER ACCOUNTS DATA
const USERS_DATA = {
  'user001': {
    id: 'user001',
    name: 'System Admin',
    username: 'admin',
    email: 'admin@excellence.edu.gh',
    role: 'Admin',
    password: 'admin123', // hashed in production
    lastLogin: 'Today 8:00 AM',
    status: 'Active',
    createdDate: '2024-01-15',
    avatar: 'SA'
  },
  'user002': {
    id: 'user002',
    name: 'Mr. Amponsah',
    username: 'k.amponsah',
    email: 'k.amponsah@excellence.edu.gh',
    role: 'Teacher',
    password: 'teacher123',
    lastLogin: 'Today 7:30 AM',
    status: 'Active',
    createdDate: '2024-02-01',
    avatar: 'MA'
  },
  'user003': {
    id: 'user003',
    name: 'Ama Serwaa',
    username: 'ama.serwaa',
    email: 'ama@student.edu.gh',
    role: 'Student',
    password: 'student123',
    lastLogin: 'Yesterday',
    status: 'Active',
    createdDate: '2024-08-10',
    avatar: 'AS'
  },
  'user004': {
    id: 'user004',
    name: 'Mr. Kojo (Acct)',
    username: 'k.accountant',
    email: 'accountant@excellence.edu.gh',
    role: 'Accountant',
    password: 'acct123',
    lastLogin: 'Today 9:00 AM',
    status: 'Active',
    createdDate: '2024-03-05',
    avatar: 'KA'
  },
  'user005': {
    id: 'user005',
    name: 'Mr. Serwaa (Parent)',
    username: 'serwaa.parent',
    email: 'parent@email.com',
    role: 'Parent',
    password: 'parent123',
    lastLogin: '2 days ago',
    status: 'Active',
    createdDate: '2024-08-15',
    avatar: 'SP'
  }
};

function getSessionUser() {
  if (window.SESSION_USER) {
    window.SESSION_USER = normalizeSessionUser(window.SESSION_USER);
    return window.SESSION_USER;
  }
  try {
    const saved = localStorage.getItem('gr_session_user');
    if (saved) {
      window.SESSION_USER = normalizeSessionUser(JSON.parse(saved));
      return window.SESSION_USER;
    }
  } catch (e) {}
  return null;
}

function normalizeRoleName(role) {
  const exact = ['Admin', 'Teacher', 'Student', 'Parent', 'Accountant', 'Alumni', 'Visitor'];
  const key = String(role || '').trim().toLowerCase();
  return exact.find(name => name.toLowerCase() === key) || role;
}

function normalizeSessionUser(user) {
  if (!user) return null;
  return {
    ...user,
    role: normalizeRoleName(user.role || user.user_role || user.type || user.account_type || currentRole || 'Visitor')
  };
}

function setSessionUser(user) {
  window.SESSION_USER = normalizeSessionUser(user);
  try {
    if (window.SESSION_USER) localStorage.setItem('gr_session_user', JSON.stringify(window.SESSION_USER));
    else localStorage.removeItem('gr_session_user');
  } catch (e) {}
}

function normalizeIdentity(value) {
  return String(value || '').trim().toLowerCase();
}

function getInitials(name, fallback) {
  const source = String(name || fallback || 'User').trim();
  return source.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();
}

function findUserByLogin(login, role) {
  const key = normalizeIdentity(login);
  const users = typeof getUsers === 'function' ? getUsers() : Object.values(USERS_DATA || {});
  return users.find(user =>
    user.role === role &&
    [user.username, user.email, user.name].map(normalizeIdentity).includes(key)
  ) || null;
}

function createFallbackSessionUser(role, login, password = '') {
  const found = findUserByLogin(login, role);
  if (found) return { ...found };
  return {
    id: 'local-' + role.toLowerCase(),
    name: login || role,
    username: login || role.toLowerCase(),
    email: String(login || '').includes('@') ? login : '',
    role,
    password,
    avatar: getInitials(login, role),
    status: 'Active'
  };
}

// -----------------------------------
// LOGIC LAYER - CALCULATIONS & GRADES
// -----------------------------------

function calculateTotalScore(classScore, examScore) {
  return classScore + examScore;
}

function calculateGrade(totalScore) {
  if (totalScore >= 90) return 'A';
  if (totalScore >= 80) return 'B';
  if (totalScore >= 70) return 'C';
  if (totalScore >= 60) return 'D';
  return 'E';
}

function calculateAverage(scores) {
  if (!scores || Object.keys(scores).length === 0) return 0;
  const totals = Object.values(scores).map(s => calculateTotalScore(s.classScore, s.examScore));
  return Math.round((totals.reduce((a, b) => a + b, 0) / totals.length) * 10) / 10;
}

function calculateTotalMarks(scores) {
  if (!scores || Object.keys(scores).length === 0) return 0;
  const totals = Object.values(scores).map(s => calculateTotalScore(s.classScore, s.examScore));
  return totals.reduce((a, b) => a + b, 0);
}

function generateRemark(average) {
  if (average >= 90) return 'Exceptional! Outstanding performance across all subjects.';
  if (average >= 85) return 'Excellent! Consistently strong academic achievement.';
  if (average >= 80) return 'Very Good! Demonstrating solid understanding of concepts.';
  if (average >= 75) return 'Good! Making steady progress in your studies.';
  if (average >= 70) return 'Satisfactory. Keep improving your efforts.';
  if (average >= 60) return 'Needs Improvement. More focus and effort required.';
  return 'Poor. Urgent attention needed. Please see your teacher.';
}

function calculateClassPosition(studentName, classVal) {
  const classStudents = Object.entries(STUDENTS_DATA).filter(([_, data]) => data.class === classVal);
  const classWithAverages = classStudents.map(([name, data]) => ({
    name,
    average: calculateAverage(data.scores)
  }));

  classWithAverages.sort((a, b) => b.average - a.average);
  const position = classWithAverages.findIndex(s => s.name === studentName) + 1;
  const totalInClass = classWithAverages.length;

  return { position, totalInClass };
}

function getStudentScoresWithGrades(studentName) {
  const student = STUDENTS_DATA[studentName];
  if (!student) return null;

  const subjectScores = {};
  Object.entries(student.scores).forEach(([subject, scores]) => {
    const total = calculateTotalScore(scores.classScore, scores.examScore);
    subjectScores[subject] = {
      classScore: scores.classScore,
      examScore: scores.examScore,
      total,
      grade: calculateGrade(total)
    };
  });

  return subjectScores;
}

// -----------------------------------
// TOAST NOTIFICATION SYSTEM
// -----------------------------------
function showToast(message, type = 'success', duration = 3000) {
  const toastContainer = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  const cleanedMessage = String(message || '')
    .replace(/^\?\s*/, '<i class="fas fa-check-circle"></i> ')
    .replace(/\s\?\s(?=\d|[A-Za-z])/, ' <i class="fas fa-arrow-up"></i> ');
  toast.innerHTML = cleanedMessage;
  toast.style.animation = 'slideInRight 0.3s ease';
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;max-width:90%';
  document.body.appendChild(container);
  return container;
}

// -----------------------------------
// MODAL SYSTEM
// -----------------------------------
function openModal(content, isCustom = false) {
  let modal = document.getElementById('global-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'global-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:10000;padding:20px';
    modal.onclick = (e) => e.target === modal && closeModal();
    document.body.appendChild(modal);
  }

  if (isCustom) {
    modal.innerHTML = content;
  } else {
    modal.innerHTML = `<div style="background:white;border-radius:8px;max-height:90vh;overflow-y:auto;box-shadow:0 10px 40px rgba(0,0,0,0.2);max-width:900px;width:95vw">${content}</div>`;
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('global-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

function openEventRegistrationModal(title, date) {
  openModal(`
    <div style="padding:24px;width:400px;max-width:90vw;">
      <h3 style="margin-top:0;margin-bottom:8px;font-size:20px;color:var(--blue-dark)">Event Registration</h3>
      <div style="font-size:14px;font-weight:600;color:var(--gray-800);margin-bottom:4px">${title}</div>
      <div style="font-size:12px;color:var(--gray-500);margin-bottom:20px"><i class="fas fa-calendar-alt"></i> ${date}</div>
      
      <div class="f-field" style="margin-bottom:16px">
        <label>Attending?</label>
        <select id="event-attending">
          <option value="yes">Yes, I will attend</option>
          <option value="maybe">Maybe</option>
        </select>
      </div>
      <div class="f-field" style="margin-bottom:24px">
        <label>Number of Guests (including you)</label>
        <input type="number" id="event-guests" value="1" min="1" max="5">
      </div>
      
      <div style="display:flex;gap:12px">
        <button class="btn btn-primary" style="flex:1" onclick="submitEventRegistration()">Confirm Registration</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `, true);
}

function submitEventRegistration() {
  const guests = document.getElementById('event-guests').value;
  closeModal();
  showToast('<i class="fas fa-check-circle"></i> Successfully registered for ' + guests + ' guest(s)!', 'success');
}

// -----------------------------------
// ENHANCED SELECT/DROPDOWN SYSTEM
// -----------------------------------
function initializeSelectEnhancements() {
  // Add enhanced visual feedback to all selects
  const allSelects = document.querySelectorAll('select');
  allSelects.forEach(select => {
    // Add change event listener for visual feedback
    select.addEventListener('change', function () {
      this.style.color = this.value && this.value !== '-- Select --' && this.value !== '-- Select Class --' ? 'var(--blue-main)' : 'var(--gray-800)';
      this.style.fontWeight = this.value && this.value !== '-- Select --' && this.value !== '-- Select Class --' ? '600' : '500';
    });

    // Add focus event for better interaction
    select.addEventListener('focus', function () {
      this.style.boxShadow = '0 0 0 4px rgba(26,86,219,.12)';
    });

    // Add blur event
    select.addEventListener('blur', function () {
      this.style.boxShadow = '';
    });
  });
}

// Initialize select enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  initializeSelectEnhancements();
  // Re-initialize after any page navigation
});

// Helper function to get selected option label
function getSelectLabel(selectElement) {
  if (!selectElement) return '';
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  return selectedOption ? selectedOption.text : '';
}

// Helper function to create a styled dropdown button
function createStyledDropdownButton(selectElement, label = 'Select') {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'position:relative;display:inline-block;width:100%';

  const button = document.createElement('button');
  button.className = 'select-btn';
  button.type = 'button';
  button.innerHTML = `<span>${getSelectLabel(selectElement) || label}</span>`;
  button.style.width = '100%';
  button.style.justifyContent = 'space-between';

  button.addEventListener('click', (e) => {
    e.preventDefault();
    selectElement.click();
  });

  selectElement.addEventListener('change', () => {
    button.innerHTML = `<span>${getSelectLabel(selectElement)}</span><i class="fas fa-chevron-down" style="font-size:11px;opacity:0.6"></i>`;
  });

  return { wrapper, button, selectElement };
}

function getModuleBadgeCount(moduleId) {
  try {
    if (moduleId === 'admissions') return admissionsData.filter(a => a.status === 'Pending').length;
    if (moduleId === 'students') return getActiveStudents(enrolledStudents).length;
    if (moduleId === 'teachers') return getActiveTeachers(teachersData).length;
    if (moduleId === 'parents') return parentsData.length;
    if (moduleId === 'notices') return (typeof NOTICES_DATA !== 'undefined' ? NOTICES_DATA.length : (typeof notices !== 'undefined' ? notices.length : 0));
    if (moduleId === 'users') return (typeof getUsers === 'function' ? getUsers().length : 0);
  } catch (e) {
    return 0;
  }
  return 0;
}

const MENUS = {
  Admin: [
    {
      g: 'Main', items: [
        { id: 'dashboard', ic: '<i class="fas fa-chart-pie"></i>', lbl: 'Dashboard Overview' },
        { id: 'admissions', ic: '<i class="fas fa-file-alt"></i>', lbl: 'Admissions', badge: () => getModuleBadgeCount('admissions') },
        { id: 'students', ic: '<i class="fas fa-graduation-cap"></i>', lbl: 'Students', badge: () => getModuleBadgeCount('students') },
        { id: 'teachers', ic: '<i class="fas fa-chalkboard-user"></i>', lbl: 'Teachers', badge: () => getModuleBadgeCount('teachers') },
        { id: 'parents', ic: '<i class="fa-solid fa-hands-holding-child"></i>', lbl: 'Parents', badge: () => getModuleBadgeCount('parents') },
      ]
    },
    {
      g: 'Academic', items: [
        { id: 'classes', ic: '<i class="fas fa-building"></i>', lbl: 'Classes' },
        { id: 'subjects', ic: '<i class="fas fa-book"></i>', lbl: 'Subjects' },
        { id: 'timetable', ic: '<i class="fas fa-calendar"></i>', lbl: 'Timetable' },
        { id: 'attendance', ic: '<i class="fas fa-check-circle"></i>', lbl: 'Attendance' },
        { id: 'exams', ic: '<i class="fas fa-file-alt"></i>', lbl: 'Exams & Reports' },
        { id: 'assignments', ic: '<i class="fas fa-clipboard-list"></i>', lbl: 'Assignments' },
      ]
    },
    {
      g: 'Finance', items: [
        { id: 'fees', ic: '<i class="fas fa-money-bill"></i>', lbl: 'Fees / Payments' },
      ]
    },
    {
      g: 'Communication', items: [
        { id: 'events', ic: '<i class="fas fa-calendar-alt"></i>', lbl: 'Events / Calendar' },
        { id: 'notices', ic: '<i class="fas fa-bullhorn"></i>', lbl: 'Notices', badge: () => getModuleBadgeCount('notices') },
        { id: 'hero_slides', ic: '<i class="fas fa-images"></i>', lbl: 'Hero Slides' },
        { id: 'news', ic: '<i class="fas fa-newspaper"></i>', lbl: 'News & Blog' },
        { id: 'messaging', ic: '<i class="fas fa-comments"></i>', lbl: 'Messaging' },
        { id: 'contact_messages', ic: '<i class="fas fa-envelope"></i>', lbl: 'Contact Messages', badge: () => contactMessages.filter(m => !m.read).length || 0 },
      ]
    },
    {
      g: 'Administration', items: [
        { id: 'staff', ic: '<i class="fas fa-users"></i>', lbl: 'Staff Management' },
        { id: 'users', ic: '<i class="fas fa-key"></i>', lbl: 'User Accounts' },
        { id: 'roles', ic: '<i class="fas fa-shield"></i>', lbl: 'Roles & Permissions' },
        { id: 'reports', ic: '<i class="fas fa-chart-line"></i>', lbl: 'Reports & Analytics' },
        { id: 'alumni', ic: '<i class="fas fa-medal"></i>', lbl: 'Alumni Module' },
        { id: 'backup', ic: '<i class="fas fa-hard-drive"></i>', lbl: 'Backup & Logs' },
        { id: 'settings', ic: '<i class="fas fa-cog"></i>', lbl: 'Settings' },
        { id: 'yearbook_admin', ic: '<i class="fas fa-book-open"></i>', lbl: 'Yearbook Management' },
      ]
    },
  ],
  Teacher: [
    {
      g: 'Main', items: [
        { id: 'dashboard', ic: '<i class="fas fa-chart-pie"></i>', lbl: 'Dashboard Overview' },
        { id: 'classes', ic: '<i class="fas fa-building"></i>', lbl: 'My Classes' },
        { id: 'subjects', ic: '<i class="fas fa-book"></i>', lbl: 'My Subjects' },
        { id: 'students', ic: '<i class="fas fa-users"></i>', lbl: 'Students List' },
        { id: 'timetable', ic: '<i class="fas fa-calendar-alt"></i>', lbl: 'Class Timetable' },
      ]
    },
    {
      g: 'Academics', items: [
        { id: 'attendance', ic: '<i class="fas fa-check-circle"></i>', lbl: 'Attendance' },
        { id: 'assignments', ic: '<i class="fas fa-clipboard-list"></i>', lbl: 'Assignment / Homework' },
        { id: 'materials', ic: '<i class="fas fa-cloud-upload-alt"></i>', lbl: 'Upload Learning Materials' },
      ]
    },
    {
      g: 'Assessments', items: [
        { id: 'sba', ic: '<i class="fas fa-balance-scale"></i>', lbl: 'SBA Module' },
        { id: 'exams', ic: '<i class="fas fa-calendar-alt"></i>', lbl: 'Exam Schedule' },
        { id: 'reportcards', ic: '<i class="fas fa-certificate"></i>', lbl: 'Report Cards' },
      ]
    },
    {
      g: 'Communication', items: [
        { id: 'messaging', ic: '<i class="fas fa-comments"></i>', lbl: 'Messaging' },
        { id: 'notices', ic: '<i class="fas fa-bullhorn"></i>', lbl: 'Notices' },
        { id: 'events', ic: '<i class="fas fa-calendar-alt"></i>', lbl: 'Events / Calendar' },
      ]
    },
    { g: 'Account', items: [{ id: 'profile', ic: '<i class="fas fa-user-cog"></i>', lbl: 'Profile Settings' }] },
  ],
  Student: [
    {
      g: 'Main', items: [
        { id: 'dashboard', ic: '<i class="fas fa-chart-pie"></i>', lbl: 'Dashboard Overview' },
        { id: 'subjects', ic: '<i class="fas fa-book"></i>', lbl: 'My Subjects' },
        { id: 'teachers', ic: '<i class="fas fa-chalkboard-user"></i>', lbl: 'My Teachers' },
        { id: 'timetable', ic: '<i class="fas fa-calendar"></i>', lbl: 'Timetable' },
      ]
    },
    {
      g: 'Academic', items: [
        { id: 'attendance', ic: '<i class="fas fa-check-circle"></i>', lbl: 'Attendance' },
        { id: 'assignments', ic: '<i class="fas fa-clipboard-list"></i>', lbl: 'Assignments' },
        { id: 'exams', ic: '<i class="fas fa-file-alt"></i>', lbl: 'Exam Results' },
        { id: 'reportcards', ic: '<i class="fas fa-certificate"></i>', lbl: 'Report Card' },
      ]
    },
    {
      g: 'Finance & Info', items: [
        { id: 'fees', ic: '<i class="fas fa-money-bill"></i>', lbl: 'Fees Status' },
        { id: 'notices', ic: '<i class="fas fa-bullhorn"></i>', lbl: 'Notices' },
        { id: 'messaging', ic: '<i class="fas fa-comments"></i>', lbl: 'Messages' },
        { id: 'events', ic: '<i class="fas fa-calendar-alt"></i>', lbl: 'Events' },
      ]
    },
    { g: 'Account', items: [{ id: 'profile', ic: '<i class="fas fa-user"></i>', lbl: 'Profile' }] },
  ],
  Parent: [
    {
      g: 'Main', items: [
        { id: 'dashboard', ic: '<i class="fas fa-chart-pie"></i>', lbl: 'Dashboard Overview' },
        { id: 'children', ic: '<i class="fas fa-child"></i>', lbl: 'My Child / Children' },
      ]
    },
    {
      g: 'Academics', items: [
        { id: 'attendance', ic: '<i class="fas fa-check-circle"></i>', lbl: 'Attendance Tracking' },
        { id: 'reportcards', ic: '<i class="fas fa-certificate"></i>', lbl: 'Report Cards / Results' },
        { id: 'assignments', ic: '<i class="fas fa-clipboard-list"></i>', lbl: 'Assignment Tracking' },
      ]
    },
    {
      g: 'Finance & Info', items: [
        { id: 'fees', ic: '<i class="fas fa-money-bill"></i>', lbl: 'Fees / Payments' },
        { id: 'transport', ic: '<i class="fas fa-bus"></i>', lbl: 'Transport Tracking' },
      ]
    },
    {
      g: 'Communication', items: [
        { id: 'teachers', ic: '<i class="fas fa-comments"></i>', lbl: 'Messages with Teachers' },
        { id: 'notices', ic: '<i class="fas fa-bullhorn"></i>', lbl: 'Notices / Announcements' },
        { id: 'events', ic: '<i class="fas fa-calendar-alt"></i>', lbl: 'Events / Calendar' },
      ]
    },
    { g: 'Account', items: [{ id: 'profile', ic: '<i class="fas fa-user-cog"></i>', lbl: 'Profile Settings' }] },
  ],
  Accountant: [
    {
      g: 'Main', items: [
        { id: 'dashboard', ic: '<i class="fas fa-chart-pie"></i>', lbl: 'Dashboard Overview' },
        { id: 'fees', ic: '<i class="fas fa-credit-card"></i>', lbl: 'Student Fees' },
        { id: 'payments', ic: '<i class="fas fa-money-bill-wave"></i>', lbl: 'Payments' },
        { id: 'expenses', ic: '<i class="fas fa-chart-line"></i>', lbl: 'Expenses' },
      ]
    },
    {
      g: 'Payroll & Structure', items: [
        { id: 'salary', ic: '<i class="fas fa-briefcase"></i>', lbl: 'Salary / Payroll' },
        { id: 'receipts', ic: '<i class="fas fa-file-invoice"></i>', lbl: 'Invoice & Receipts' },
      ]
    },
    {
      g: 'Grants & Recovery', items: [
        { id: 'scholarships', ic: '<i class="fas fa-gift"></i>', lbl: 'Scholarships / Discounts' },
        { id: 'debtors', ic: '<i class="fas fa-users-slash"></i>', lbl: 'Debtors List' },
      ]
    },
    {
      g: 'Reporting & Comms', items: [
        { id: 'reports', ic: '<i class="fas fa-chart-bar"></i>', lbl: 'Financial Reports' },
        { id: 'messaging', ic: '<i class="fas fa-comments"></i>', lbl: 'Messaging' },
      ]
    },
    {
      g: 'System', items: [
        { id: 'settings', ic: '<i class="fas fa-cog"></i>', lbl: 'Settings' },
      ]
    },
  ],
  Alumni: [
    {
      g: 'Main', items: [
        { id: 'dashboard', ic: '<i class="fas fa-chart-pie"></i>', lbl: 'Dashboard Overview' },
        { id: 'profile', ic: '<i class="fas fa-user"></i>', lbl: 'Alumni Profile' },
        { id: 'directory', ic: '<i class="fas fa-address-book"></i>', lbl: 'Alumni Directory' },
      ]
    },
    {
      g: 'Community', items: [
        { id: 'events', ic: '<i class="fas fa-calendar-alt"></i>', lbl: 'Events / Reunions' },
        { id: 'donations', ic: '<i class="fas fa-handshake"></i>', lbl: 'Donations' },
        { id: 'messaging', ic: '<i class="fas fa-comments"></i>', lbl: 'Messages' },
        { id: 'notices', ic: '<i class="fas fa-bullhorn"></i>', lbl: 'Notices' },
        { id: 'jobs', ic: '<i class="fas fa-briefcase"></i>', lbl: 'Job Board' },
        { id: 'certificates', ic: '<i class="fas fa-certificate"></i>', lbl: 'Certificates Request' },
        { id: 'gallery', ic: '<i class="fas fa-images"></i>', lbl: 'Gallery' },
        { id: 'yearbook', ic: '<i class="fas fa-book-open"></i>', lbl: 'Digital Yearbook' },
      ]
    },
  ],
  Visitor: [
    {
      g: 'Public Pages', items: [
        { id: 'dashboard', ic: '<i class="fas fa-home"></i>', lbl: 'Home Page' },
        { id: 'about', ic: '<i class="fas fa-info-circle"></i>', lbl: 'About School' },
        { id: 'admission', ic: '<i class="fas fa-file-alt"></i>', lbl: 'Admission Info' },
        { id: 'news', ic: '<i class="fas fa-newspaper"></i>', lbl: 'News / Blog' },
        { id: 'events', ic: '<i class="fas fa-calendar-alt"></i>', lbl: 'Events' },
        { id: 'contact', ic: '<i class="fas fa-phone"></i>', lbl: 'Contact Page' },
        { id: 'gallery', ic: '<i class="fas fa-image"></i>', lbl: 'Gallery' },
        { id: 'alumni_pub', ic: '<i class="fas fa-medal"></i>', lbl: 'Alumni Page' },
      ]
    },
  ],
};

function getAllowedModuleIdsForRole(role = currentRole) {
  const menuIds = (MENUS[role] || [])
    .flatMap(section => section.items.map(item => item.id));
  return new Set(['dashboard', ...menuIds]);
}

function canAccessModule(moduleId, role = currentRole) {
  return getAllowedModuleIdsForRole(role).has(moduleId);
}

function accessDeniedModule(moduleId) {
  return hdr('Access Restricted', 'This section is not available for your dashboard role', 'Access') + `
  <div class="card" style="text-align:center;padding:42px 24px">
    <div style="width:64px;height:64px;border-radius:14px;background:var(--red-xpale);color:var(--danger);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:24px"><i class="fas fa-lock"></i></div>
    <h3 style="margin:0 0 8px;color:var(--blue-dark)">You do not have access to ${escapeHtml(moduleId)}</h3>
    <p style="margin:0 0 18px;color:var(--gray-500);font-size:13px">Use the sidebar items for ${escapeHtml(currentRole)} to view your permitted records and actions.</p>
    <button class="btn btn-primary" onclick="navTo('dashboard')"><i class="fas fa-chart-pie"></i> Back to Dashboard</button>
  </div>`;
}

const AV_INIT = { Admin: 'AD', Teacher: 'TC', Student: 'ST', Parent: 'PR', Accountant: 'AC', Alumni: 'AL', Visitor: 'VI' };

// Role-specific image mapping
const ROLE_IMAGES = {
  'Teacher': 'assets/images/teacher.jpeg',
  'Student': 'assets/images/student.jpeg',
  'Parent': 'assets/images/parent.jpeg',
  'Accountant': 'assets/images/Accountant.jpeg',
  'Alumni': 'assets/images/Alumni.jpeg',
  'Visitor': null, // No login required for visitor
  'Admin': 'assets/images/admin.jpeg'
};

// -----------------------------------
// LOGIN / AUTH
// -----------------------------------
function setRole(el, role) {
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  loginRole = role;
  // Show role-specific login page if not visitor
  if (role !== 'Visitor') {
    showRoleLoginModal(role);
  } else {
    doLogin();
  }
}

function showRoleLoginModal(role) {
  closeModal();
  const roleImage = ROLE_IMAGES[role];
  const roleLoginPage = `
    <div id="role-login-page" class="role-login-page">
      <button class="role-login-back" onclick="backToRoles()"><i class="fas fa-arrow-left"></i></button>
      <div class="role-login-wrapper">
        <div class="role-login-image-section">
          <div class="role-login-image">
            <img src="${roleImage}" alt="${role}">
            <div class="role-login-logo"><img src="assets/images/Logo.png" alt="Logo"></div>
          </div>
        </div>
        <div class="role-login-form-section">
          <div class="role-login-form">
            <h2>${role} Login</h2>
            <p>Access your ${role.toLowerCase()} dashboard</p>
            <div class="form-field">
              <label>Email / Username</label>
              <input type="text" id="role-email" placeholder="Enter your email or username">
            </div>
            <div class="form-field">
              <label>Password</label>
              <div class="password-wrapper">
                <input type="password" id="role-pass" placeholder="Enter password">
                <i class="fas fa-eye toggle-password" onclick="togglePasswordVisibility('role-pass', this)"></i>
              </div>
            </div>
            <button class="login-btn" onclick="doRoleLogin('${role}')">Sign In to ${role} Dashboard <i class="fas fa-arrow-right"></i></button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Remove any existing role login page
  const existing = document.getElementById('role-login-page');
  if (existing) existing.remove();

  // Insert full page login
  document.body.insertAdjacentHTML('afterbegin', roleLoginPage);
  document.getElementById('login-page').style.display = 'none';
}

function doRoleLogin(role) {
  // Delegate to the API-backed login in api-client.js
  if (typeof doRoleLoginAPI === 'function') {
    doRoleLoginAPI(role);
  } else {
    // Fallback (dev mode without backend)
    const email = document.getElementById('role-email')?.value;
    const pass  = document.getElementById('role-pass')?.value;
    if (!email || !pass) { showToast('Please fill in all fields', 'error'); return; }
    const found = findUserByLogin(email, role);
    if (found && found.password && found.password !== pass) {
      showToast('<i class="fas fa-times-circle"></i> Incorrect password', 'error');
      return;
    }
    setSessionUser(createFallbackSessionUser(role, email, pass));
    loginRole = role;
    const roleLoginPage = document.getElementById('role-login-page');
    if (roleLoginPage) roleLoginPage.remove();
    doLogin();
  }
}

function backToRoles() {
  const roleLoginPage = document.getElementById('role-login-page');
  if (roleLoginPage) {
    roleLoginPage.style.opacity = '0';
    roleLoginPage.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => {
      if (document.getElementById('role-login-page')) roleLoginPage.remove();
      if (currentRole === 'Visitor') {
        showStaffLoginModal();
      } else {
        document.getElementById('login-page').style.display = 'flex';
      }
    }, 300);
  } else {
    if (currentRole === 'Visitor') {
      showStaffLoginModal();
    } else {
      document.getElementById('login-page').style.display = 'flex';
    }
  }
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
}

function doLogin() {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('app-shell').classList.add('active');
  document.getElementById('role-fab').style.display = getSessionUser() ? 'none' : 'flex';
  closeModal();
  switchRole(loginRole);
}
function logout() {
  if (currentRole === 'Visitor') {
    showStaffLoginModal();
  } else {
    setSessionUser(null);
    document.getElementById('app-shell').classList.remove('active');
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('role-fab').style.display = 'none';
    document.getElementById('role-switcher').classList.remove('open');
  }
}
function showStaffLoginModal() {
  let loginForm = document.getElementById('login-page').innerHTML;
  openModal(loginForm);
}
function adminLogin() {
  closeModal();
  const adminLoginPage = `
    <div id="role-login-page" class="role-login-page admin-login-page">
      <button class="role-login-back" onclick="backToRoles()"><i class="fas fa-arrow-left"></i></button>
      <div class="role-login-wrapper">
        <div class="role-login-image-section admin-image-section">
          <div class="role-login-image">
            <img src="assets/images/admin.jpeg" alt="Admin">
            <div class="role-login-logo"><img src="assets/images/Logo.png" alt="Logo"></div>
          </div>
        </div>
        <div class="role-login-form-section">
          <div class="role-login-form">
            <div class="admin-icon-wrap"><i class="fas fa-user-shield"></i></div>
            <h2>Admin Portal</h2>
            <p>Enter your credentials to access the admin dashboard</p>
            <div class="form-field">
              <label>Admin Username</label>
              <input type="text" id="admin-user" placeholder="Enter admin username" value="admin">
            </div>
            <div class="form-field">
              <label>Admin Password</label>
              <div class="password-wrapper">
                <input type="password" id="admin-pass" placeholder="Enter admin password" onkeydown="if(event.key==='Enter')doAdminLogin()">
                <i class="fas fa-eye toggle-password" onclick="togglePasswordVisibility('admin-pass', this)"></i>
              </div>
            </div>
            <button class="login-btn admin-login-btn" onclick="doAdminLogin()"><i class="fas fa-shield-halved"></i> Access Admin Dashboard <i class="fas fa-arrow-right"></i></button>
          </div>
        </div>
      </div>
    </div>
  `;

  const existing = document.getElementById('role-login-page');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('afterbegin', adminLoginPage);
  document.getElementById('login-page').style.display = 'none';

  // Focus the password field
  setTimeout(() => {
    const passField = document.getElementById('admin-pass');
    if (passField) passField.focus();
  }, 500);
}

function togglePasswordVisibility(inputId, iconElement) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    iconElement.classList.remove('fa-eye');
    iconElement.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    iconElement.classList.remove('fa-eye-slash');
    iconElement.classList.add('fa-eye');
  }
}

function doAdminLogin() {
  // Delegate to API-backed admin login in api-client.js
  if (typeof doAdminLoginAPI === 'function') {
    doAdminLoginAPI();
    return;
  }
  // Fallback
  const user = document.getElementById('admin-user')?.value;
  const pass = document.getElementById('admin-pass')?.value;
  if (!pass) { showToast('<i class="fas fa-exclamation-triangle"></i> Please enter the admin password', 'error'); return; }
  const found = findUserByLogin(user || 'admin', 'Admin');
  if (pass === '12345' || (found && found.password === pass)) {
    setSessionUser(createFallbackSessionUser('Admin', user || 'admin', pass));
    loginRole = 'Admin';
    const adminPage = document.getElementById('role-login-page');
    if (adminPage) adminPage.remove();
    doLogin();
    showToast('<i class="fas fa-shield-halved"></i> Welcome, Administrator!', 'success');
  } else {
    showToast('<i class="fas fa-times-circle"></i> Incorrect admin password', 'error');
    const passField = document.getElementById('admin-pass');
    if (passField) { passField.value = ''; passField.focus(); passField.style.borderColor = 'var(--danger)'; setTimeout(() => passField.style.borderColor = '', 2000); }
  }
}
function toggleDark() {
  darkMode = !darkMode;
  applyTheme();
  localStorage.setItem('gloryReignTheme', darkMode ? 'dark' : 'light');
  showToast(`<i class="fas fa-check-circle"></i> ${darkMode ? 'Dark' : 'Light'} mode enabled`, 'success');
}

function showStudentIDCard() {
  const studentName = 'Ama Serwaa';
  const studentID = '2024-0042';
  const studentClass = 'JHS 1';
  const studentHouse = 'Red House';
  const studentGender = 'Female';

  const idCardHTML = `
    <div class="idcard-modal-overlay">
      <div class="idcard-modal-content">
        <button class="idcard-close-btn" onclick="this.closest('.idcard-modal-overlay').remove()">&times;</button>
        <div class="idcard-container">
          <div class="idcard-actual-card">
            <div class="idcard-top-section">
              <div class="idcard-logo-section">
                <img src="assets/images/Logo.png" alt="School Logo" style="width:100%;height:100%;object-fit:contain">
              </div>
              <div class="idcard-school-name">Glory Reign Preparatory School</div>
              <div class="idcard-card-title">STUDENT ID CARD</div>
            </div>
            
            <div class="idcard-main-body">
              <div class="idcard-info-section">
                <div class="idcard-info-item">
                  <span class="idcard-info-label">Name:</span>
                  <span class="idcard-info-value">${studentName}</span>
                </div>
                <div class="idcard-info-item">
                  <span class="idcard-info-label">ID No:</span>
                  <span class="idcard-info-value">${studentID}</span>
                </div>
                <div class="idcard-info-item">
                  <span class="idcard-info-label">House:</span>
                  <span class="idcard-info-value">${studentHouse}</span>
                </div>
                <div class="idcard-info-item">
                  <span class="idcard-info-label">Gender:</span>
                  <span class="idcard-info-value">${studentGender}</span>
                </div>
              </div>
              
              <div class="idcard-photo-section">
                <div class="idcard-photo">
                  <div class="idcard-avatar av av-xl av-blue">AS</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="idcard-footer">
            <p>Personal identification details below. Identification details are locked after verification.</p>
            <button class="btn btn-gold" onclick="downloadIDCard('${studentName}', '${studentID}')"><i class="fas fa-download"></i> DOWNLOAD</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', idCardHTML);

  // Add click outside to close
  document.querySelector('.idcard-modal-overlay').addEventListener('click', function (e) {
    if (e.target === this) this.remove();
  });
}

function downloadIDCard(studentName, studentID) {
  alert('Downloading ID Card for ' + studentName + ' (ID: ' + studentID + ')...\nThis feature will be implemented with a proper file download system.');
}

let APP_NOTIFICATIONS = [
  { id: 1, icon: '<i class="fas fa-clipboard-list"></i>', title: 'New Assignment', msg: 'Math HW Ch.5 posted', time: '2m ago', read: false, fullMsg: 'Mr. Amponsah has posted a new assignment: Mathematics Chapter 5 Problems. Due date: March 22, 2026. Please complete and submit before the deadline.', action: 'View Assignment', actionLink: 'assignments' },
  { id: 2, icon: '<i class="fas fa-check-circle"></i>', title: 'Grade Posted', msg: 'Your essay - Grade A', time: '1h ago', read: false, fullMsg: 'Your essay submission for English has been graded. Grade: A (92%). Ms. Mensah left detailed feedback on your excellent arguments and structure.', action: 'View Feedback', actionLink: 'grades' },
  { id: 3, icon: '<i class="fas fa-graduation-cap"></i>', title: 'Admission Update', msg: 'New student enrolled', time: '3h ago', read: true, fullMsg: 'A new student has been successfully enrolled in Basic 1. You may need to update class lists and materials. Check Admin > Admissions for details.', action: 'View Details', actionLink: 'admissions' },
  { id: 4, icon: '<i class="fas fa-comments"></i>', title: 'New Message', msg: 'Message from Ms. Mensah', time: '5h ago', read: true, fullMsg: 'Ms. Mensah: Hi! Can you please schedule a meeting with the parents of Ama Serwaa to discuss her performance? Let me know your availability.', action: 'Reply', actionLink: 'messaging' },
  { id: 5, icon: '<i class="fas fa-exclamation-triangle"></i>', title: 'Fee Reminder', msg: '5 students pending fees', time: '1d ago', read: true, fullMsg: 'There are currently 5 students with pending fee payments. Total outstanding: GHâ‚µ4,800. Please follow up with parents or view the fees module for details.', action: 'View Fees', actionLink: 'fees' }
];

try {
  const savedNotifications = JSON.parse(localStorage.getItem('gr_app_notifications') || 'null');
  if (Array.isArray(savedNotifications)) APP_NOTIFICATIONS = savedNotifications;
} catch (e) {}

function saveAppNotifications() {
  try { localStorage.setItem('gr_app_notifications', JSON.stringify(APP_NOTIFICATIONS)); } catch (e) {}
}

function getVisibleNotifications() {
  const self = typeof getChatSelf === 'function' ? getChatSelf() : { name: '', role: String(currentRole || '').toLowerCase() };
  const role = String(self.role || currentRole || '').toLowerCase();
  return APP_NOTIFICATIONS.filter(n => {
    if (!n.recipient && !n.recipientRole) return true;
    return (n.recipient && n.recipient === self.name) || (n.recipientRole && String(n.recipientRole).toLowerCase() === role);
  });
}

function updateNotificationBadge() {
  const dot = document.querySelector('.notif-dot');
  if (!dot) return;
  const unreadCount = getVisibleNotifications().filter(n => !n.read).length;
  dot.classList.toggle('hidden', unreadCount === 0);
  dot.title = unreadCount ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : '';
}

function addAppNotification(notification) {
  APP_NOTIFICATIONS.unshift({
    id: Date.now() + Math.floor(Math.random() * 1000),
    icon: notification.icon || '<i class="fas fa-bell"></i>',
    title: notification.title || 'Notification',
    msg: notification.msg || '',
    time: notification.time || 'Just now',
    read: false,
    fullMsg: notification.fullMsg || notification.msg || '',
    action: notification.action || 'View',
    actionLink: notification.actionLink || 'dashboard',
    chatWith: notification.chatWith || '',
    recipient: notification.recipient || '',
    recipientRole: notification.recipientRole || ''
  });
  saveAppNotifications();
  updateNotificationBadge();
}

function notifyMessageRecipient(message) {
  addAppNotification({
    icon: '<i class="fas fa-comments"></i>',
    title: 'New Message',
    msg: `Message from ${message.sender}`,
    fullMsg: `${message.sender}: ${message.text}`,
    action: 'Open Chat',
    actionLink: 'messaging',
    chatWith: message.sender,
    recipient: message.recipient,
    recipientRole: message.recipientRole
  });
  saveAppNotifications();
}

function markNotificationAsRead(id, event) {
  if (event) event.stopPropagation();
  const notif = APP_NOTIFICATIONS.find(n => n.id === id);
  if (notif) {
    notif.read = true;
    saveAppNotifications();
    updateNotificationBadge();
    showNotifications();
  }
}

function clearAllNotifications() {
  const visibleIds = new Set(getVisibleNotifications().map(n => n.id));
  APP_NOTIFICATIONS = APP_NOTIFICATIONS.filter(n => !visibleIds.has(n.id));
  saveAppNotifications();
  updateNotificationBadge();
  showToast('<i class="fas fa-check-circle"></i> All notifications cleared', 'success');
  showNotifications();
}

function deleteNotification(id, event) {
  if (event) event.stopPropagation();
  APP_NOTIFICATIONS = APP_NOTIFICATIONS.filter(n => n.id !== id);
  saveAppNotifications();
  updateNotificationBadge();
  showToast('<i class="fas fa-check-circle"></i> Notification deleted', 'success');
  showNotifications();
}

function showNotifications() {
  const visibleNotifications = getVisibleNotifications();
  const unreadCount = visibleNotifications.filter(n => !n.read).length;

  let html = `<div style="max-width:460px;width:95%;background:rgba(255,255,255,0.85);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.5);border-radius:24px;overflow:hidden;box-shadow:0 24px 48px rgba(0,0,0,0.12)">
    <div style="padding:20px 24px;background:linear-gradient(135deg,var(--blue-main),#1e3a5f);color:white;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1)">
      <div>
        <h3 style="margin:0;font-size:18px;font-weight:700;display:flex;align-items:center;gap:10px">
          <i class="fas fa-bell"></i> Notifications 
          ${unreadCount > 0 ? `<span style="background:var(--danger);color:white;font-size:11px;padding:3px 10px;border-radius:12px;font-weight:700;box-shadow:0 4px 10px rgba(239,68,68,0.3)">${unreadCount} New</span>` : ''}
        </h3>
      </div>
      <div style="display:flex;gap:8px">
        ${visibleNotifications.length > 0 ? `<button onclick="clearAllNotifications()" style="background:rgba(255,255,255,0.15);color:white;border:none;border-radius:10px;padding:8px 12px;font-size:13px;cursor:pointer;transition:all 0.2s" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'" title="Clear All"><i class="fas fa-trash-alt"></i></button>` : ''}
        <button onclick="closeModal()" style="background:rgba(255,255,255,0.15);color:white;border:none;border-radius:10px;padding:8px 12px;font-size:13px;cursor:pointer;transition:all 0.2s" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'" title="Close"><i class="fas fa-times"></i></button>
      </div>
    </div>
    
    <div style="max-height:450px;overflow-y:auto;padding:16px">`;

  if (visibleNotifications.length === 0) {
    html += `<div style="padding:50px 20px;text-align:center;color:var(--gray-500)">
      <div style="font-size:54px;margin-bottom:16px;opacity:0.3;color:var(--blue-main)"><i class="fas fa-bell-slash"></i></div>
      <div style="font-size:16px;font-weight:700;color:var(--blue-dark)">No notifications</div>
      <div style="font-size:14px;margin-top:6px">You're all caught up!</div>
    </div>`;
  } else {
    visibleNotifications.forEach(notif => {
      html += `<div style="padding:16px;margin-bottom:12px;border-radius:16px;background:${notif.read ? 'rgba(255,255,255,0.7)' : 'white'};border:1px solid ${notif.read ? 'transparent' : 'rgba(59,130,246,0.3)'};box-shadow:${notif.read ? 'none' : '0 8px 24px rgba(59,130,246,0.1)'};cursor:pointer;transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);position:relative" 
        onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 12px 28px rgba(0,0,0,0.08)'" 
        onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='${notif.read ? 'none' : '0 8px 24px rgba(59,130,246,0.1)'}'" 
        onclick="viewNotificationDetail(${notif.id})">
        <div style="display:flex;gap:16px">
          <div style="font-size:22px;color:${notif.read ? 'var(--gray-400)' : 'var(--blue-main)'};background:${notif.read ? 'var(--gray-100)' : 'var(--blue-xpale)'};width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            ${notif.icon}
          </div>
          <div style="flex:1">
            <div style="font-weight:700;font-size:15px;color:${notif.read ? 'var(--gray-700)' : 'var(--blue-dark)'};margin-bottom:4px;display:flex;align-items:center;justify-content:space-between">
              <span>${notif.title} ${!notif.read ? '<span style="display:inline-block;width:8px;height:8px;background:var(--danger);border-radius:50%;margin-left:8px;vertical-align:middle;box-shadow:0 0 8px rgba(239,68,68,0.5)"></span>' : ''}</span>
              <span style="font-size:12px;font-weight:600;color:var(--gray-400)">${notif.time}</span>
            </div>
            <div style="font-size:13.5px;color:var(--gray-600);line-height:1.5">${notif.msg}</div>
          </div>
        </div>
        
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px;opacity:${notif.read ? '0.6' : '1'}">
          ${!notif.read ? `<button onclick="markNotificationAsRead(${notif.id}, event)" style="background:var(--blue-xpale);color:var(--blue-main);border:none;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.2s" onmouseover="this.style.background='var(--blue-pale)'" onmouseout="this.style.background='var(--blue-xpale)'"><i class="fas fa-check"></i> Mark Read</button>` : ''}
          <button onclick="deleteNotification(${notif.id}, event)" style="background:rgba(239,68,68,0.1);color:var(--danger);border:none;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.2s" onmouseover="this.style.background='rgba(239,68,68,0.2)'" onmouseout="this.style.background='rgba(239,68,68,0.1)'"><i class="fas fa-trash"></i> Delete</button>
        </div>
      </div>`;
    });
  }

  html += `</div></div>`;

  openModal(html, true);
}

function viewNotificationDetail(notifId) {
  const notif = APP_NOTIFICATIONS.find(n => n.id === notifId);
  if (!notif) return;

  // Mark as read when viewing details
  notif.read = true;
  saveAppNotifications();
  updateNotificationBadge();
  const actionLinkJS = escapeAttr(JSON.stringify(notif.actionLink || 'dashboard'));
  const chatWithJS = escapeAttr(JSON.stringify(notif.chatWith || ''));
  const actionClick = notif.actionLink === 'messaging' && notif.chatWith
    ? `currentChat=${chatWithJS};navTo(${actionLinkJS});closeModal()`
    : `navTo(${actionLinkJS});closeModal()`;

  let html = `<div style="max-width:500px;width:95%;background:rgba(255,255,255,0.95);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.5);border-radius:24px;overflow:hidden;box-shadow:0 24px 48px rgba(0,0,0,0.15)">
      <div style="padding:24px;background:linear-gradient(135deg,var(--blue-main),#1e3a5f);color:white;display:flex;gap:16px;align-items:center;position:relative">
        <button class="btn" style="position:absolute;top:20px;right:20px;background:rgba(255,255,255,0.2);color:white;padding:8px;width:36px;height:36px;border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s" onclick="showNotifications()"><i class="fas fa-arrow-left"></i></button>
        <div style="font-size:36px;background:rgba(255,255,255,0.2);width:64px;height:64px;border-radius:18px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(0,0,0,0.1)">
          ${notif.icon}
        </div>
        <div style="flex:1;padding-right:40px">
          <h2 style="margin:0;font-size:22px;font-weight:800;letter-spacing:-0.5px">${notif.title}</h2>
          <p style="margin:6px 0 0 0;opacity:0.8;font-size:13px;font-weight:500"><i class="far fa-clock"></i> ${notif.time}</p>
        </div>
      </div>
    
    <div style="padding:24px;background:var(--gray-50)">
      <div style="background:white;padding:20px;border-radius:16px;line-height:1.7;color:var(--gray-800);font-size:15px;margin-bottom:20px;box-shadow:0 4px 16px rgba(0,0,0,0.04);border:1px solid var(--gray-100)">
        ${notif.fullMsg}
      </div>
      
      <div style="display:flex;gap:12px">
        <button class="btn" style="flex:1;background:var(--blue-main);color:white;padding:14px;border:none;border-radius:12px;cursor:pointer;font-weight:700;font-size:14px;transition:all 0.2s;box-shadow:0 8px 20px rgba(26,86,219,0.2)" onmouseover="this.style.background='var(--blue-mid)';this.style.transform='translateY(-2px)'" onmouseout="this.style.background='var(--blue-main)';this.style.transform='translateY(0)'" onclick="${actionClick}">
          ${notif.action} <i class="fas fa-arrow-right" style="margin-left:6px"></i>
        </button>
        <button class="btn" style="flex:1;background:var(--gray-200);color:var(--gray-800);padding:14px;border:none;border-radius:12px;cursor:pointer;font-weight:700;font-size:14px;transition:all 0.2s" onmouseover="this.style.background='var(--gray-300)'" onmouseout="this.style.background='var(--gray-200)'" onclick="showNotifications()">
          Back to list
        </button>
      </div>
    </div>
  </div>`;

  openModal(html, true);
}

// -----------------------------------
// ROLE / NAVIGATION
// -----------------------------------
const NAV_STATE_KEY = 'gr_last_navigation_state';

function saveNavigationState() {
  try {
    localStorage.setItem(NAV_STATE_KEY, JSON.stringify({ role: currentRole, mod: currentMod }));
  } catch (e) {}
}

function getSavedNavigationState() {
  try {
    return JSON.parse(localStorage.getItem(NAV_STATE_KEY) || 'null');
  } catch (e) {
    return null;
  }
}

function toggleRS() { document.getElementById('role-switcher').classList.toggle('open') }
function switchRole(role, preferredMod) {
  const sessionUser = getSessionUser();
  currentRole = role;
  document.getElementById('role-switcher').classList.remove('open');
  document.getElementById('top-role').textContent = role.toUpperCase();
  const topAvatar = document.getElementById('top-av');
  if (topAvatar) topAvatar.textContent = sessionUser?.name ? getInitials(sessionUser.name, role) : (AV_INIT[role] || 'US');
  const menus = MENUS[role] || MENUS.Admin;
  const defaultMod = menus[0].items[0].id;
  currentMod = preferredMod && canAccessModule(preferredMod, role) ? preferredMod : defaultMod;

  // Show/hide sidebar and topbar based on role
  const sidebar = document.getElementById('sidebar');
  const topbar = document.querySelector('.topbar');
  const roleFab = document.getElementById('role-fab');
  const mainWrap = document.getElementById('main-content');

  if (role === 'Visitor') {
    if (sidebar) sidebar.style.display = 'none';
    if (topbar) topbar.style.display = 'none';
    if (roleFab) roleFab.style.display = 'flex';
    mainWrap.className = 'public-main-wrap';
    renderPublicNavbar();
  } else {
    if (sidebar) sidebar.style.display = 'flex';
    if (topbar) topbar.style.display = 'flex';
    if (roleFab) roleFab.style.display = 'flex';
    mainWrap.className = 'main-wrap';
    renderSidebar();
  }
  renderMain();
  saveNavigationState();
  setTimeout(initializeSelectEnhancements, 10);
}
function navTo(id, keepTopbarSearch = false) {
  if (!keepTopbarSearch) {
    const topInput = document.getElementById('topbar-search-input');
    if (topInput) topInput.value = '';
  }
  if (!canAccessModule(id)) {
    showToast('<i class="fas fa-lock"></i> This section is not available for your role', 'error');
    id = 'dashboard';
  }

  // Add to navigation history if it's different from current
  if (id !== currentMod) {
    navigationHistory.push(id);
    // Limit history to last 10 pages
    if (navigationHistory.length > 10) {
      navigationHistory.shift();
    }
  }

  currentMod = id;
  saveNavigationState();

  if (currentRole === 'Visitor') {
    renderPublicNavbar();
  } else {
    renderSidebar();
  }

  renderMain();
  setTimeout(initializeSelectEnhancements, 10);
  // Close sidebar on mobile after navigation
  closeMobileSidebar();

  document.getElementById('main-content').scrollTop = 0;
  window.scrollTo(0, 0);
}

// -----------------------------------
// MOBILE SIDEBAR TOGGLE FUNCTIONS
// -----------------------------------
function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  sidebar.classList.toggle('open');
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  sidebar.classList.remove('open');
}

function openMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  sidebar.classList.add('open');
}

function goBack() {
  // Remove current page and go to previous
  if (navigationHistory.length > 1) {
    navigationHistory.pop();  // Remove current
    const previousMod = navigationHistory[navigationHistory.length - 1];
    currentMod = previousMod;

    if (currentRole === 'Visitor') {
      renderPublicNavbar();
    } else {
      renderSidebar();
    }

    renderMain();
    document.getElementById('main-content').scrollTop = 0;
    window.scrollTo(0, 0);
  } else {
    // If no history, go to dashboard
    navTo('dashboard');
  }
}

// -----------------------------------
// RENDER PUBLIC NAVBAR
// -----------------------------------
function renderPublicNavbar() {
  const navbar = document.createElement('nav');
  navbar.className = 'public-navbar';
  navbar.innerHTML = `
    <div class="public-nav-container">
      <div class="public-brand">
        <div class="brand-mark"><img src="assets/images/Logo.png" alt="Logo" style="width:100%;height:100%;object-fit:contain"></div>
        <div class="brand-info">
          <div class="brand-name">Glory Reign Preparatory School</div>
          <div class="brand-tag">School Portal</div>
        </div>
      </div>
      <div class="public-nav-links" id="public-nav-links">
        <a class="nav-link active" onclick="publicNavToSection('home-section');closePublicMenu()"><i class="fas fa-home"></i> Home</a>
        <a class="nav-link" onclick="publicNavToSection('about-section');closePublicMenu()"><i class="fas fa-info-circle"></i> About</a>
        <a class="nav-link" onclick="publicNavToSection('admission-section');closePublicMenu()"><i class="fas fa-file-alt"></i> Admissions</a>
        <a class="nav-link" onclick="publicNavToSection('gallery-section');closePublicMenu()"><i class="fas fa-image"></i> Gallery</a>
        <a class="nav-link" onclick="publicNavToSection('news-section');closePublicMenu()"><i class="fas fa-newspaper"></i> News</a>
        <a class="nav-link" onclick="publicNavToSection('contact-section');closePublicMenu()"><i class="fas fa-phone"></i> Contact</a>
      </div>
      <div class="public-nav-right">
        <button class="hamburger-btn" id="hamburger-btn" title="Toggle Menu"><i class="fas fa-bars"></i></button>
        <button class="btn-staff-login" onclick="logout()"><i class="fas fa-lock"></i> Login</button>
      </div>
    </div>
  `;

  const existingNavbar = document.querySelector('.public-navbar');
  if (existingNavbar) existingNavbar.remove();

  const appShell = document.getElementById('app-shell');
  appShell.insertBefore(navbar, appShell.firstChild);

  // Apply public-main-wrap class to main content
  const mainWrap = document.getElementById('main-content');
  mainWrap.className = 'public-main-wrap';

  // Initialize public menu
  initializePublicMenu();
}

// Show/hide hamburger button and nav links based on window size
function updatePublicNavbarResponsive() {
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('public-nav-links');

  if (!hamburger || !navLinks) return;

  // Get current window width
  const width = window.innerWidth;

  if (width <= 768) {
    // Mobile: show hamburger button using class
    hamburger.classList.add('visible');
    // CSS handles mobile styling; just ensure display is none by default
    navLinks.style.display = 'none';
    navLinks.classList.remove('open');
  } else {
    // Desktop: hide hamburger button, show nav links
    hamburger.classList.remove('visible');
    navLinks.style.display = 'flex';
    navLinks.classList.remove('open');
  }
}

// Toggle public navigation menu on mobile
function togglePublicMenu(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const navLinks = document.getElementById('public-nav-links');
  const width = window.innerWidth;

  if (width <= 768 && navLinks) {
    if (navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navLinks.style.display = 'none';
    } else {
      navLinks.classList.add('open');
      navLinks.style.display = 'flex';
    }
  }
}

// Close public navigation menu
function closePublicMenu() {
  const navLinks = document.getElementById('public-nav-links');
  if (navLinks) {
    navLinks.classList.remove('open');
    if (window.innerWidth <= 768) {
      navLinks.style.display = 'none';
    }
  }
}

// Initialize event listeners with event delegation
function initializePublicMenu() {
  updatePublicNavbarResponsive();

  // Use event delegation for hamburger button clicks
  document.removeEventListener('click', handleDocumentClick);
  document.addEventListener('click', handleDocumentClick);
}

// Global event handler for delegated clicks
function handleDocumentClick(e) {
  const hamburgerBtn = e.target.closest('#hamburger-btn');
  const navbar = document.querySelector('.public-navbar');

  if (hamburgerBtn) {
    e.preventDefault();
    e.stopPropagation();
    togglePublicMenu(e);
  } else if (navbar && !navbar.contains(e.target)) {
    closePublicMenu();
  }
}

// Listen for window resize
window.addEventListener('resize', () => {
  updatePublicNavbarResponsive();
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initializePublicMenu();
});

// Also call it immediately if DOM is already loaded
if (document.readyState !== 'loading') {
  initializePublicMenu();
}

function handleTopbarSearch() {
  const topInput = document.getElementById('topbar-search-input');
  if (!topInput) return;
  const val = topInput.value;

  const mapping = {
    students: { id: 'student-search', fn: filterStudents },
    teachers: { id: 'teacher-search', fn: currentRole === 'Admin' ? filterTeachersManagement : filterTeachers },
    parents: { id: 'parent-search', fn: filterParents },
    classes: { id: 'class-search', fn: filterClasses },
    admissions: { id: 'adm-search', fn: filterAdmissions },
    subjects: { id: 'subject-search', fn: filterSubjects },
    users: { id: 'user-search', fn: filterUsers },
    staff: { id: 'staff-search', fn: filterStaffList },
    alumni: { id: 'alumni-search', fn: filterAlumni },
    fees: { id: 'fee-search', fn: filterFeeRecords },
    notices: { id: 'notice-search', fn: filterNotices }
  };

  const target = mapping[currentMod];
  if (target) {
    const localInput = document.getElementById(target.id);
    if (localInput) {
      localInput.value = val;
      if (typeof target.fn === 'function') {
        target.fn();
      }
    }
  }
}

function handleTopbarSearchKey(event) {
  if (event.key === 'Enter') {
    const topInput = document.getElementById('topbar-search-input');
    if (!topInput) return;
    const val = topInput.value.trim();
    if (!val) return;

    const searchable = ['students', 'teachers', 'parents', 'classes', 'admissions', 'subjects', 'users', 'staff', 'alumni', 'fees', 'notices'];
    if (!searchable.includes(currentMod)) {
      navTo('students', true);
      setTimeout(() => {
        const topInputNew = document.getElementById('topbar-search-input');
        if (topInputNew) {
          topInputNew.value = val;
          handleTopbarSearch();
        }
      }, 100);
    }
  }
}

// -----------------------------------
// RENDER SIDEBAR
// -----------------------------------
function renderSidebar() {
  const menus = MENUS[currentRole] || MENUS.Admin;
  let h = '';
  menus.forEach(sec => {
    h += `<div class="sb-section"><div class="sb-label">${sec.g}</div>`;
    sec.items.forEach(it => {
      h += `<div class="sb-item${it.id === currentMod ? ' active' : ''}" onclick="navTo('${it.id}')">
        <span class="si">${it.ic}</span>
        <span class="sl">${it.lbl}</span>
        ${it.badge ? `<span class="sb-badge">${typeof it.badge === 'function' ? it.badge() : it.badge}</span>` : ''}
      </div>`;
    });
    h += `</div><div class="sb-divider"></div>`;
  });
  document.getElementById('sidebar').innerHTML = h;
}

// -----------------------------------
// RENDER MAIN
// -----------------------------------
function renderMain() {
  const el = document.getElementById('main-content');
  const r = currentRole, m = currentMod;
  if (!canAccessModule(m, r)) {
    el.innerHTML = accessDeniedModule(m);
    return;
  }

  const map = {
    dashboard: () => ({ Admin: adminDash, Teacher: teacherDash, Student: studentDash, Parent: parentDash, Accountant: accountDash, Alumni: alumniDash, Visitor: visitorHome }[r] || adminDash)(),
    students: () => studentsModule(),
    teachers: () => currentRole === 'Admin' ? teachersManagementModule() : teachersModule(),
    parents: () => parentsModule(),
    classes: () => classesModule(),
    subjects: () => subjectsModule(),
    timetable: () => timetableModule(),
    attendance: () => attendanceModule(),
    grades: () => gradesModule(),
    exams: () => examsModule(),
    admissions: () => admissionsModule(),
    assignments: () => assignmentsModule(),
    fees: () => feesModule(),
    payments: () => paymentsModule(),
    events: () => eventsModule(),
    notices: () => noticesModule(),
    hero_slides: () => heroSlidesModule(),
    news: () => currentRole === 'Visitor' ? visitorNews() : newsModule(),
    messaging: () => messagingModule(),
    contact_messages: () => contactMessagesModule(),
    staff: () => staffModule(),
    users: () => usersModule(),
    roles: () => rolesModule(),
    reports: () => reportsModule(),
    alumni: () => alumniModule(),
    alumni_pub: () => alumniPubModule(),
    backup: () => backupModule(),
    settings: () => settingsModule(),
    profile: () => profileModule(),
    yearbook: () => yearbookModule(),
    yearbook_admin: () => adminYearbookModule(),
    reportcards: () => reportCardsModule(),
    materials: () => learningMaterialsModule(),
    sba: () => sbaModule(),
    children: () => childrenModule(),
    salary: () => salaryModule(),
    feestructure: () => feeStructModule(),
    scholarships: () => scholarshipsModule(),
    debtors: () => debtorsModule(),
    receipts: () => receiptsModule(),
    balance: () => balanceSheetModule(),
    expenses: () => expensesModule(),
    directory: () => alumniDirectory(),
    donations: () => donationsModule(),
    jobs: () => jobBoardModule(),
    certificates: () => certificatesModule(),
    about: () => visitorAbout(),
    admission: () => visitorAdmission(),
    contact: () => visitorContact(),
    gallery: () => currentRole === 'Visitor' ? visitorGallery() : galleryModule(),
    transport: () => transportModule(),
  };
  el.innerHTML = (map[m] || map.dashboard)();

  // Initialize calendar if events module
  if (m === 'events') {
    setTimeout(() => renderCalendar(currentCalendarYear, currentCalendarMonth), 100);
  }
  // Initialize materials UI when navigating to materials
  if (m === 'materials') {
    setTimeout(() => { try{ initMaterialsUI(); }catch(e){} }, 80);
  }
  // Initialize recent payments rendering when Accountant views dashboard
  if (m === 'dashboard' && r === 'Accountant') {
    setTimeout(() => { try{ renderRecentPaymentsTable(); } catch(e){} }, 80);
  }
  // Initialize parent dashboard
  if (m === 'dashboard' && r === 'Parent') {
    setTimeout(() => { try{ getParentChildren(); getParentMessages(); getParentAssignments(); } catch(e){} }, 80);
  }
  // Initialize teacher dashboard
  if (m === 'dashboard' && r === 'Teacher') {
    setTimeout(() => { try{ getAssignments(); getTeacherMessages(); } catch(e){} }, 80);
  }
  // Initialize student dashboard
  if (m === 'dashboard' && r === 'Student') {
    setTimeout(() => { try{ /* placeholder for student init */ } catch(e){} }, 80);
  }
  // Initialize admin dashboard data
  if (m === 'dashboard' && r === 'Admin') {
    setTimeout(() => { try{ if (!ADMIN_DASHBOARD_STATE.loaded) fetchAdminDashboardData(); } catch(e){} }, 80);
  }
  setTimeout(() => { if (typeof initDashboardInteractivity === 'function') initDashboardInteractivity(); }, 80);
  setTimeout(() => { if (typeof initButtonHandlers === 'function') initButtonHandlers(); }, 100);
  setTimeout(() => { if (typeof initMobileSidebarHandlers === 'function') initMobileSidebarHandlers(); }, 100);
  updateNotificationBadge();
}

// -----------------------------------
// HELPERS
// -----------------------------------
function hdr(title, sub, bc) {
  return `<div class="page-hdr">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
      <button class="back-btn" onclick="goBack()" title="Go back"><i class="fas fa-arrow-left"></i> Back</button>
      <div class="breadcrumb"><i class="fas fa-home"></i> Home â€º <span>${bc || title}</span></div>
    </div>
    <h1>${title}</h1>
    <p>${sub}</p>
  </div>`;
}
function statCard(icon, val, lbl, chg, chgType, colorCls, isClickable, onClickFunc) {
  return `<div class="stat-card" ${isClickable ? `style="cursor:pointer;transition:all 0.2s" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'" onclick="${onClickFunc}"` : ''}>
    <div class="stat-glow" style="background:var(--blue-main)"></div>
    <div class="stat-icon ${colorCls || 'si-blue'}">${icon}</div>
    <div class="stat-val">${val}</div>
    <div class="stat-lbl">${lbl}</div>
    <div class="stat-chg chg-${chgType || 'up'}">${chgType === 'dn' ? '<i class="fas fa-arrow-down"></i>' : chgType === 'flat' ? '<i class="fas fa-minus"></i>' : '<i class="fas fa-arrow-up"></i>'} ${chg}</div>
  </div>`;
}
function mini_cal() {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const today = new Date();
  const year = miniCalDate.getFullYear();
  const month = miniCalDate.getMonth();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let h = `<div class="cal-wrap">
    <div class="cal-hdr">
      <div class="cal-nav" style="cursor:pointer" onclick="miniCalPrev()">â€¹</div>
      <span class="cal-title" id="mini-cal-title" style="min-width:120px;text-align:center">${monthNames[month]} ${year}</span>
      <div class="cal-nav" style="cursor:pointer" onclick="miniCalNext()">â€º</div>
    </div>
    <div class="cal-grid">
      ${days.map(d => `<div class="cal-dname">${d}</div>`).join('')}
      ${Array.from({ length: firstDay }, () => '').map(() => `<div class="cal-day"></div>`).join('')}
      ${Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
    const cellDate = new Date(year, month, d);
    const isToday = cellDate.toDateString() === today.toDateString();
    const hasEvent = EVENTS_DATA.some(e => e.date === `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    const cls = isToday ? 'cal-today' : hasEvent ? 'cal-event' : '';
    return `<div class="cal-day ${cls}">${d}</div>`;
  }).join('')}
    </div>
    <div style="margin-top:12px;display:flex;gap:12px;font-size:10px;color:var(--gray-500)">
      <span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:50%;background:var(--blue-main);display:inline-block"></span>Today</span>
      <span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:50%;background:var(--gold);display:inline-block"></span>Events</span>
    </div>
  </div>`;
  return h;
}

function miniCalNext() {
  miniCalDate.setMonth(miniCalDate.getMonth() + 1);
  updateMiniCal();
}

function miniCalPrev() {
  miniCalDate.setMonth(miniCalDate.getMonth() - 1);
  updateMiniCal();
}

function updateMiniCal() {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const today = new Date();
  const year = miniCalDate.getFullYear();
  const month = miniCalDate.getMonth();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Update title
  const titleEl = document.getElementById('mini-cal-title');
  if (titleEl) titleEl.textContent = monthNames[month] + ' ' + year;

  // Rebuild grid
  let grid = days.map(d => `<div class="cal-dname">${d}</div>`).join('');
  grid += Array.from({ length: firstDay }, () => '').map(() => `<div class="cal-day"></div>`).join('');
  grid += Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
    const cellDate = new Date(year, month, d);
    const isToday = cellDate.toDateString() === today.toDateString();
    const hasEvent = EVENTS_DATA.some(e => e.date === `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    const cls = isToday ? 'cal-today' : hasEvent ? 'cal-event' : '';
    return `<div class="cal-day ${cls}">${d}</div>`;
  }).join('');

  const gridEl = document.querySelector('.cal-grid');
  if (gridEl) gridEl.innerHTML = grid;
}
function bars(data, cls) {
  const mx = Math.max(...data);
  return `<div class="chart-wrap">${data.map(v => `<div class="c-bar ${cls || 'pf-blue'}" style="height:${Math.round(v / mx * 140)}px;background:${cls === 'pf-gold' ? 'var(--gold)' : 'var(--blue-main)'}"></div>`).join('')}</div>`;
}
function paginationHtml() {
  const classNames = (typeof getVisibleClassesForRole === 'function' ? getVisibleClassesForRole(classesData) : classesData).map(c => c.name);
  return `<div class="class-pagination-wrap">
    <div class="class-pagination-title"><i class="fas fa-layer-group"></i> Filter students by class</div>
    <div class="class-pagination">
      ${classNames.map(className => {
        const count = getActiveStudents(enrolledStudents).filter(s => s.student_class === className).length;
        return `<button class="class-page-btn" onclick="selectStudentClassPage('${escapeAttr(className)}')"><span>${escapeHtml(className)}</span><strong>${count}</strong></button>`;
      }).join('')}
    </div>
  </div>`;
}

function selectStudentClassPage(className) {
  const filter = document.getElementById('student-class-filter');
  if (filter) filter.value = className;
  document.querySelectorAll('.class-page-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim().startsWith(className));
  });
  filterStudents();
}

// -----------------------------------

