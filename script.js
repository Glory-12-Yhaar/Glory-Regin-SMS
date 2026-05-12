
// ═══════════════════════════════════
// STATE & CONFIG
// ═══════════════════════════════════
let currentRole='Visitor', currentMod='dashboard', darkMode=false, loginRole='Admin';
let navigationHistory = ['dashboard'];  // Track page history for back button
let miniCalDate = new Date();  // Track mini calendar navigation

// ═══════════════════════════════════
// DATA LAYER - STUDENTS, SUBJECTS, SCORES
// ═══════════════════════════════════

// SUBJECTS BY CLASS
const SUBJECTS_BY_CLASS = {
  'Creche': ['English', 'Mathematics', 'Social Skills', 'Creative Arts'],
  'Nursery': ['English', 'Mathematics', 'Social Studies', 'Creative Arts'],
  'KG 1': ['Literacy English', 'Literacy Writing', 'Numeracy', 'Creative Arts'],
  'KG 2': ['Literacy English', 'Literacy Writing', 'Numeracy', 'Creative Arts'],
  'Basic 1': ['English', 'Mathematics', 'Science', 'Creative Arts', 'Computing', 'Religious & Moral Education', 'History'],
  'Basic 2': ['English', 'Mathematics', 'Science', 'Creative Arts', 'Computing', 'Religious & Moral Education', 'History'],
  'Basic 3': ['English', 'Mathematics', 'Science', 'Creative Arts', 'Computing', 'Religious & Moral Education', 'History'],
  'Basic 4': ['English', 'Mathematics', 'Natural Science', 'Creative Arts', 'Computing', 'French', 'History', 'Religious & Moral Education'],
  'Basic 5': ['English', 'Mathematics', 'Natural Science', 'Creative Arts', 'Computing', 'French', 'History', 'Religious & Moral Education'],
  'Basic 6': ['English', 'Mathematics', 'Natural Science', 'Creative Arts', 'Computing', 'French', 'History', 'Religious & Moral Education'],
  'JHS 1': ['English', 'Mathematics', 'Integrated Science', 'Social Studies', 'Computing', 'French', 'Career Technolog', 'Religious & Moral Education', 'Creative Arts & Design'],
  'JHS 2': ['English', 'Mathematics', 'Integrated Science', 'Social Studies', 'Computing', 'French', 'Career Technolog', 'Religious & Moral Education', 'Creative Arts & Design'],
  'JHS 3': ['English', 'Mathematics', 'Integrated Science', 'Social Studies', 'Computing', 'French', 'Career Technolog', 'Religious & Moral Education', 'Creative Arts & Design']
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
  'ALM001': {id:'ALM001', name:'Abena Owusu', classYear:2018, profession:'Software Engineer', location:'Accra · Google Ghana', avatar:'AO', avatarColor:'purple', bio:'Working as Senior Developer at Google Ghana', email:'abena.owusu@gmail.com', phone:'+233 24 111 0001', instagram:'@abenaotech', linkedin:'linkedin.com/in/abenaowusu', twitter:'@abenaotech', facebook:'facebook.com/abena.owusu'},
  'ALM002': {id:'ALM002', name:'Kwabena Asare', classYear:2016, profession:'Medical Doctor', location:'London · NHS', avatar:'KA', avatarColor:'blue', bio:'Consultant Physician at London NHS Hospital', email:'kwabena.asare@nhs.uk', phone:'+44 7911 123456', instagram:'@kwabenadr', linkedin:'linkedin.com/in/kwabenaasare', twitter:'@kwabenaasare', facebook:'facebook.com/kwabena.asare'},
  'ALM003': {id:'ALM003', name:'Esi Mensah', classYear:2020, profession:'Teacher', location:'Kumasi · College', avatar:'EM', avatarColor:'green', bio:'Secondary School Teacher - English & Literature', email:'esi.mensah@college.edu.gh', phone:'+233 24 222 0003', instagram:'@esimenteach', linkedin:'linkedin.com/in/esimensah', twitter:'@esiteacher', facebook:'facebook.com/esi.mensah'},
  'ALM004': {id:'ALM004', name:'Yaw Boateng', classYear:2015, profession:'Lawyer', location:'Toronto · Law Firm', avatar:'YB', avatarColor:'gold', bio:'Senior Associate at Toronto Law Partnership', email:'yaw.boateng@lawfirm.ca', phone:'+1 416 987 6543', instagram:'@yawlawyer', linkedin:'linkedin.com/in/yawboateng', twitter:'@yawboatenglaw', facebook:'facebook.com/yaw.boateng'},
  'ALM005': {id:'ALM005', name:'Akua Adjei', classYear:2019, profession:'Nurse', location:'Accra · Korle Bu', avatar:'AA', avatarColor:'teal', bio:'Registered Nurse at Korle Bu Teaching Hospital', email:'akua.adjei@korlebu.org', phone:'+233 24 333 0005', instagram:'@akuanurse', linkedin:'linkedin.com/in/akuaadjei', twitter:'@akuahealth', facebook:'facebook.com/akua.adjei'},
  'ALM006': {id:'ALM006', name:'Kofi Antwi', classYear:2014, profession:'Civil Engineer', location:'Takoradi · GHA', avatar:'KA', avatarColor:'orange', bio:'Project Manager - Civil Engineering Division', email:'kofi.antwi@gha-eng.com.gh', phone:'+233 24 444 0006', instagram:'@kofieng', linkedin:'linkedin.com/in/kofiانtwi', twitter:'@kofiengineering', facebook:'facebook.com/kofi.antwi'},
  'ALM007': {id:'ALM007', name:'Nadia Hassan', classYear:2017, profession:'Business Analyst', location:'Dubai · Tech Corp', avatar:'NH', avatarColor:'purple', bio:'Business Solutions Analyst - Middle East Tech', email:'nadia.hassan@techcorp.ae', phone:'+971 50 123 4567', instagram:'@nadiabiz', linkedin:'linkedin.com/in/nadiahassan', twitter:'@nadiatech', facebook:'facebook.com/nadia.hassan'},
  'ALM008': {id:'ALM008', name:'Samuel Boadi', classYear:2013, profession:'Banking Executive', location:'Accra · Bank HQ', avatar:'SB', avatarColor:'blue', bio:'Head of Business Development - Banking Sector', email:'samuel.boadi@bank.com.gh', phone:'+233 24 555 0008', instagram:'@samuelbanks', linkedin:'linkedin.com/in/samuelboadi', twitter:'@samuelboadi', facebook:'facebook.com/samuel.boadi'},
  'ALM009': {id:'ALM009', name:'Grace Mensah', classYear:2021, profession:'Graphic Designer', location:'Accra · Creative Studio', avatar:'GM', avatarColor:'pink', bio:'UI/UX Designer at Accra Creative Studio', email:'grace.mensah@creative.com.gh', phone:'+233 24 666 0009', instagram:'@gracedesi̲gns', linkedin:'linkedin.com/in/gracemensah', twitter:'@gracedesigns', facebook:'facebook.com/grace.mensah'},
  'ALM010': {id:'ALM010', name:'David Owusu', classYear:2012, profession:'Architect', location:'Singapore · Design Firm', avatar:'DO', avatarColor:'teal', bio:'Senior Architect - International Design Projects', email:'david.owusu@designfirm.sg', phone:'+65 6789 0123', instagram:'@davidarch', linkedin:'linkedin.com/in/davidowusu', twitter:'@davidarchitect', facebook:'facebook.com/david.owusu'}
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

// ═══════════════════════════════════
// LOGIC LAYER - CALCULATIONS & GRADES
// ═══════════════════════════════════

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

// ═══════════════════════════════════
// TOAST NOTIFICATION SYSTEM
// ═══════════════════════════════════
function showToast(message, type = 'success', duration = 3000){
  const toastContainer = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = message;
  toast.style.animation = 'slideInRight 0.3s ease';
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function createToastContainer(){
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;max-width:90%';
  document.body.appendChild(container);
  return container;
}

// ═══════════════════════════════════
// MODAL SYSTEM
// ═══════════════════════════════════
function openModal(content){
  let modal = document.getElementById('global-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'global-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:10000;padding:20px';
    modal.onclick = (e) => e.target === modal && closeModal();
    document.body.appendChild(modal);
  }
  
  modal.innerHTML = `<div style="background:white;border-radius:8px;max-height:90vh;overflow-y:auto;box-shadow:0 10px 40px rgba(0,0,0,0.2);max-width:900px;width:95vw">${content}</div>`;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal(){
  const modal = document.getElementById('global-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// ═══════════════════════════════════
// ENHANCED SELECT/DROPDOWN SYSTEM
// ═══════════════════════════════════
function initializeSelectEnhancements(){
  // Add enhanced visual feedback to all selects
  const allSelects = document.querySelectorAll('select');
  allSelects.forEach(select => {
    // Add change event listener for visual feedback
    select.addEventListener('change', function(){
      this.style.color = this.value && this.value !== '-- Select --' && this.value !== '-- Select Class --' ? 'var(--blue-main)' : 'var(--gray-800)';
      this.style.fontWeight = this.value && this.value !== '-- Select --' && this.value !== '-- Select Class --' ? '600' : '500';
    });
    
    // Add focus event for better interaction
    select.addEventListener('focus', function(){
      this.style.boxShadow = '0 0 0 4px rgba(26,86,219,.12)';
    });
    
    // Add blur event
    select.addEventListener('blur', function(){
      this.style.boxShadow = '';
    });
  });
}

// Initialize select enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', function(){
  initializeSelectEnhancements();
  // Re-initialize after any page navigation
});

// Call initialization after role switch and navigation
const originalNavTo = navTo;
navTo = function(id){
  originalNavTo(id);
  setTimeout(initializeSelectEnhancements, 10);
};

const originalSwitchRole = switchRole;
switchRole = function(role){
  originalSwitchRole(role);
  setTimeout(initializeSelectEnhancements, 10);
};

// Helper function to get selected option label
function getSelectLabel(selectElement){
  if(!selectElement) return '';
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  return selectedOption ? selectedOption.text : '';
}

// Helper function to create a styled dropdown button
function createStyledDropdownButton(selectElement, label = '▼ Select'){
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
    button.innerHTML = `<span>${getSelectLabel(selectElement)}</span><span style="font-size:11px;opacity:0.6">▼</span>`;
  });
  
  return {wrapper, button, selectElement};
}

const MENUS={
  Admin:[
    {g:'Main',items:[
      {id:'dashboard',ic:'<i class="fas fa-chart-pie"></i>',lbl:'Dashboard Overview'},
      {id:'admissions',ic:'<i class="fas fa-file-alt"></i>',lbl:'Admissions',badge:'12'},
      {id:'students',ic:'<i class="fas fa-graduation-cap"></i>',lbl:'Students',badge:'842'},
      {id:'teachers',ic:'<i class="fas fa-chalkboard-user"></i>',lbl:'Teachers'},
      {id:'parents',ic:'<i class="fa-solid fa-hands-holding-child"></i>',lbl:'Parents'},
    ]},
    {g:'Academic',items:[
      {id:'classes',ic:'<i class="fas fa-building"></i>',lbl:'Classes'},
      {id:'subjects',ic:'<i class="fas fa-book"></i>',lbl:'Subjects'},
      {id:'timetable',ic:'<i class="fas fa-calendar"></i>',lbl:'Timetable'},
      {id:'attendance',ic:'<i class="fas fa-check-circle"></i>',lbl:'Attendance'},
      {id:'exams',ic:'<i class="fas fa-file-alt"></i>',lbl:'Exams & Reports'},
      {id:'assignments',ic:'<i class="fas fa-clipboard-list"></i>',lbl:'Assignments'},
    ]},
    {g:'Finance',items:[
      {id:'fees',ic:'<i class="fas fa-money-bill"></i>',lbl:'Fees / Payments'},
    ]},
    {g:'Communication',items:[
      {id:'events',ic:'<i class="fas fa-calendar-alt"></i>',lbl:'Events / Calendar'},
      {id:'notices',ic:'<i class="fas fa-bullhorn"></i>',lbl:'Notices',badge:'5'},
      {id:'news',ic:'<i class="fas fa-newspaper"></i>',lbl:'News & Blog'},
      {id:'messaging',ic:'<i class="fas fa-comments"></i>',lbl:'Messaging'},
      {id:'contact_messages',ic:'<i class="fas fa-envelope"></i>',lbl:'Contact Messages',badge:()=>contactMessages.filter(m=>!m.read).length||0},
    ]},
    {g:'Administration',items:[
      {id:'staff',ic:'<i class="fas fa-users"></i>',lbl:'Staff Management'},
      {id:'users',ic:'<i class="fas fa-key"></i>',lbl:'User Accounts'},
      {id:'roles',ic:'<i class="fas fa-shield"></i>',lbl:'Roles & Permissions'},
      {id:'reports',ic:'<i class="fas fa-chart-line"></i>',lbl:'Reports & Analytics'},
      {id:'alumni',ic:'<i class="fas fa-medal"></i>',lbl:'Alumni Module'},
      {id:'backup',ic:'<i class="fas fa-hard-drive"></i>',lbl:'Backup & Logs'},
      {id:'settings',ic:'<i class="fas fa-cog"></i>',lbl:'Settings'},
    ]},
  ],
  Teacher:[
    {g:'Main',items:[
      {id:'dashboard',ic:'<i class="fas fa-chart-pie"></i>',lbl:'Dashboard Overview'},
      {id:'classes',ic:'<i class="fas fa-building"></i>',lbl:'My Classes'},
      {id:'students',ic:'<i class="fas fa-graduation-cap"></i>',lbl:'Students List'},
    ]},
    {g:'Academic',items:[
      {id:'attendance',ic:'<i class="fas fa-check-circle"></i>',lbl:'Attendance'},
      {id:'assignments',ic:'<i class="fas fa-clipboard-list"></i>',lbl:'Assignments'},
      {id:'grades',ic:'<i class="fas fa-file-alt"></i>',lbl:'Enter Grades'},
      {id:'exams',ic:'<i class="fas fa-chart-pie"></i>',lbl:'Exams & Grading'},
      {id:'reportcards',ic:'<i class="fas fa-certificate"></i>',lbl:'Report Cards'},
      {id:'lessonnotes',ic:'<i class="fas fa-file"></i>',lbl:'Lesson Notes'},
      {id:'timetable',ic:'<i class="fas fa-calendar"></i>',lbl:'Timetable'},
    ]},
    {g:'Communication',items:[
      {id:'notices',ic:'<i class="fas fa-bullhorn"></i>',lbl:'Notices'},
      {id:'messaging',ic:'<i class="fas fa-comments"></i>',lbl:'Messaging / Chat'},
      {id:'events',ic:'<i class="fas fa-calendar-alt"></i>',lbl:'Events / Calendar'},
    ]},
    {g:'Account',items:[{id:'profile',ic:'<i class="fas fa-user"></i>',lbl:'Profile Settings'}]},
  ],
  Student:[
    {g:'Main',items:[
      {id:'dashboard',ic:'<i class="fas fa-chart-pie"></i>',lbl:'Dashboard Overview'},
      {id:'subjects',ic:'<i class="fas fa-book"></i>',lbl:'My Subjects'},
      {id:'teachers',ic:'<i class="fas fa-chalkboard-user"></i>',lbl:'My Teachers'},
      {id:'timetable',ic:'<i class="fas fa-calendar"></i>',lbl:'Timetable'},
    ]},
    {g:'Academic',items:[
      {id:'attendance',ic:'<i class="fas fa-check-circle"></i>',lbl:'Attendance'},
      {id:'assignments',ic:'<i class="fas fa-clipboard-list"></i>',lbl:'Assignments'},
      {id:'exams',ic:'<i class="fas fa-file-alt"></i>',lbl:'Exam Results'},
      {id:'reportcards',ic:'<i class="fas fa-certificate"></i>',lbl:'Report Card'},
    ]},
    {g:'Finance & Info',items:[
      {id:'fees',ic:'<i class="fas fa-money-bill"></i>',lbl:'Fees Status'},
      {id:'notices',ic:'<i class="fas fa-bullhorn"></i>',lbl:'Notices'},
      {id:'messaging',ic:'<i class="fas fa-comments"></i>',lbl:'Messages'},
      {id:'events',ic:'<i class="fas fa-calendar-alt"></i>',lbl:'Events'},
    ]},
    {g:'Account',items:[{id:'profile',ic:'<i class="fas fa-user"></i>',lbl:'Profile'}]},
  ],
  Parent:[
    {g:'Main',items:[
      {id:'dashboard',ic:'<i class="fas fa-chart-pie"></i>',lbl:'Dashboard Overview'},
      {id:'children',ic:'<i class="fas fa-baby"></i>',lbl:'My Children'},
      {id:'attendance',ic:'<i class="fas fa-check-circle"></i>',lbl:'Attendance'},
    ]},
    {g:'Academic',items:[
      {id:'reportcards',ic:'<i class="fas fa-certificate"></i>',lbl:'Report Cards'},
      {id:'assignments',ic:'<i class="fas fa-clipboard-list"></i>',lbl:'Assignments'},
    ]},
    {g:'Finance & Info',items:[
      {id:'fees',ic:'<i class="fas fa-money-bill"></i>',lbl:'Fees / Payments'},
      {id:'messaging',ic:'<i class="fas fa-comments"></i>',lbl:'Messages'},
      {id:'notices',ic:'<i class="fas fa-bullhorn"></i>',lbl:'Notices'},
      {id:'events',ic:'<i class="fas fa-calendar-alt"></i>',lbl:'Events'},
      {id:'teachers',ic:'<i class="fas fa-chalkboard-user"></i>',lbl:'Teacher Communication'},
    ]},
    {g:'Account',items:[{id:'profile',ic:'<i class="fas fa-user"></i>',lbl:'Profile'}]},
  ],
  Accountant:[
    {g:'Main',items:[
      {id:'dashboard',ic:'<i class="fas fa-chart-pie"></i>',lbl:'Dashboard Overview'},
      {id:'fees',ic:'<i class="fas fa-credit-card"></i>',lbl:'Student Fees'},
      {id:'payments',ic:'<i class="fas fa-money-bill-wave"></i>',lbl:'Payments (Cash)'},
      {id:'expenses',ic:'<i class="fas fa-chart-line"></i>',lbl:'Expenses'},
    ]},
    {g:'Payroll & Structure',items:[
      {id:'salary',ic:'<i class="fas fa-briefcase"></i>',lbl:'Salary / Payroll'},
      {id:'feestructure',ic:'<i class="fas fa-hammer"></i>',lbl:'Fee Structure'},
      {id:'receipts',ic:'<i class="fas fa-receipt"></i>',lbl:'Receipts'},
    ]},
    {g:'Reports',items:[
      {id:'reports',ic:'<i class="fas fa-chart-line"></i>',lbl:'Financial Reports'},
      {id:'balance',ic:'<i class="fas fa-balance-scale"></i>',lbl:'Balance Sheet'},
    ]},
    {g:'System',items:[
      {id:'notices',ic:'<i class="fas fa-bell"></i>',lbl:'Notifications'},
      {id:'settings',ic:'<i class="fas fa-cog"></i>',lbl:'Settings'},
    ]},
  ],
  Alumni:[
    {g:'Main',items:[
      {id:'dashboard',ic:'<i class="fas fa-chart-pie"></i>',lbl:'Dashboard Overview'},
      {id:'profile',ic:'<i class="fas fa-user"></i>',lbl:'Alumni Profile'},
      {id:'directory',ic:'<i class="fas fa-address-book"></i>',lbl:'Alumni Directory'},
    ]},
    {g:'Community',items:[
      {id:'events',ic:'<i class="fas fa-calendar-alt"></i>',lbl:'Events / Reunions'},
      {id:'donations',ic:'<i class="fas fa-handshake"></i>',lbl:'Donations'},
      {id:'messaging',ic:'<i class="fas fa-comments"></i>',lbl:'Messages'},
      {id:'notices',ic:'<i class="fas fa-bullhorn"></i>',lbl:'Notices'},
      {id:'jobs',ic:'<i class="fas fa-briefcase"></i>',lbl:'Job Board'},
      {id:'certificates',ic:'<i class="fas fa-certificate"></i>',lbl:'Certificates Request'},
    ]},
  ],
  Visitor:[
    {g:'Public Pages',items:[
      {id:'dashboard',ic:'<i class="fas fa-home"></i>',lbl:'Home Page'},
      {id:'about',ic:'<i class="fas fa-info-circle"></i>',lbl:'About School'},
      {id:'admission',ic:'<i class="fas fa-file-alt"></i>',lbl:'Admission Info'},
      {id:'news',ic:'<i class="fas fa-newspaper"></i>',lbl:'News / Blog'},
      {id:'events',ic:'<i class="fas fa-calendar-alt"></i>',lbl:'Events'},
      {id:'contact',ic:'<i class="fas fa-phone"></i>',lbl:'Contact Page'},
      {id:'gallery',ic:'<i class="fas fa-image"></i>',lbl:'Gallery'},
      {id:'alumni_pub',ic:'<i class="fas fa-medal"></i>',lbl:'Alumni Page'},
    ]},
  ],
};

const AV_INIT={Admin:'AD',Teacher:'TC',Student:'ST',Parent:'PR',Accountant:'AC',Alumni:'AL',Visitor:'VI'};

// ═══════════════════════════════════
// LOGIN / AUTH
// ═══════════════════════════════════
function setRole(el,role){
  document.querySelectorAll('.role-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  loginRole=role;
}
function doLogin(){
  document.getElementById('login-page').style.display='none';
  document.getElementById('app-shell').classList.add('active');
  document.getElementById('role-fab').style.display='flex';
  closeModal();
  switchRole(loginRole);
}
function logout(){
  if(currentRole==='Visitor'){
    showStaffLoginModal();
  }else{
    document.getElementById('app-shell').classList.remove('active');
    document.getElementById('login-page').style.display='flex';
    document.getElementById('role-fab').style.display='none';
    document.getElementById('role-switcher').classList.remove('open');
  }
}
function showStaffLoginModal(){
  let loginForm = document.getElementById('login-page').innerHTML;
  openModal(loginForm);
}
function toggleDark(){
  darkMode=!darkMode;
  document.body.classList.toggle('dark',darkMode);
}

function showStudentIDCard(){
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
                <i class="fas fa-school"></i>
              </div>
              <div class="idcard-school-name">Glory Regin Preparatory School</div>
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
  document.querySelector('.idcard-modal-overlay').addEventListener('click', function(e){
    if(e.target === this) this.remove();
  });
}

function downloadIDCard(studentName, studentID){
  alert('Downloading ID Card for ' + studentName + ' (ID: ' + studentID + ')...\nThis feature will be implemented with a proper file download system.');
}

function showNotifications(){
  const notifications = [
    { 
      id: 1, 
      icon: '<i class="fas fa-clipboard-list"></i>', 
      title: 'New Assignment', 
      msg: 'Math HW Ch.5 posted', 
      time: '2m ago', 
      read: false,
      fullMsg: 'Mr. Amponsah has posted a new assignment: Mathematics Chapter 5 Problems. Due date: March 22, 2026. Please complete and submit before the deadline.',
      action: 'View Assignment',
      actionLink: 'assignments'
    },
    { 
      id: 2, 
      icon: '<i class="fas fa-check-circle"></i>', 
      title: 'Grade Posted', 
      msg: 'Your essay - Grade A', 
      time: '1h ago', 
      read: false,
      fullMsg: 'Your essay submission for English has been graded. Grade: A (92%). Ms. Mensah left detailed feedback on your excellent arguments and structure.',
      action: 'View Feedback',
      actionLink: 'grades'
    },
    { 
      id: 3, 
      icon: '<i class="fas fa-graduation-cap"></i>', 
      title: 'Admission Update', 
      msg: 'New student enrolled', 
      time: '3h ago', 
      read: true,
      fullMsg: 'A new student has been successfully enrolled in Basic 1. You may need to update class lists and materials. Check Admin > Admissions for details.',
      action: 'View Details',
      actionLink: 'admissions'
    },
    { 
      id: 4, 
      icon: '<i class="fas fa-comments"></i>', 
      title: 'New Message', 
      msg: 'Message from Ms. Mensah', 
      time: '5h ago', 
      read: true,
      fullMsg: 'Ms. Mensah: Hi! Can you please schedule a meeting with the parents of Ama Serwaa to discuss her performance? Let me know your availability.',
      action: 'Reply',
      actionLink: 'messaging'
    },
    { 
      id: 5, 
      icon: '<i class="fas fa-exclamation-triangle"></i>', 
      title: 'Fee Reminder', 
      msg: '5 students pending fees', 
      time: '1d ago', 
      read: true,
      fullMsg: 'There are currently 5 students with pending fee payments. Total outstanding: GH₵4,800. Please follow up with parents or view the fees module for details.',
      action: 'View Fees',
      actionLink: 'fees'
    }
  ];
  
  let html = `<div style="max-width:90%;width:90%;background:white;border-radius:12px;overflow:hidden;box-shadow:var(--shadow-lg)">
    <div style="padding:16px;background:var(--blue-main);color:white;display:flex;justify-content:space-between;align-items:center">
      <h3 style="margin:0">Notifications</h3>
      <button class="btn" style="background:rgba(255,255,255,0.2);color:white;padding:4px 8px;border:none;border-radius:6px;cursor:pointer;font-weight:600" onclick="closeModal()">✕</button>
    </div>
    <div style="max-height:400px;overflow-y:auto">`;
  
  notifications.forEach(notif => {
    html += `<div style="padding:12px;border-bottom:1px solid var(--gray-100);cursor:pointer;transition:all 0.2s" onmouseover="this.style.background='var(--blue-xpale)';this.style.transform='translateX(4px)'" onmouseout="this.style.background='transparent';this.style.transform='translateX(0)'" onclick="viewNotificationDetail(${notif.id})">
      <div style="display:flex;gap:10px">
        <div style="font-size:18px;color:var(--blue-main)">${notif.icon}</div>
        <div style="flex:1">
          <div style="font-weight:600;color:var(--gray-900)">${notif.title}${!notif.read?'<span style="display:inline-block;width:6px;height:6px;background:var(--danger);border-radius:50%;margin-left:8px"></span>':''}</div>
          <div style="font-size:12px;color:var(--gray-600);margin-top:2px">${notif.msg}</div>
          <div style="font-size:10px;color:var(--gray-400);margin-top:4px">${notif.time}</div>
        </div>
        <div style="font-size:12px;color:var(--blue-main);font-weight:600">→</div>
      </div>
    </div>`;
  });
  
  html += `</div>
    <div style="padding:12px;text-align:center;border-top:1px solid var(--gray-100)">
      <a style="color:var(--blue-main);font-weight:600;cursor:pointer;font-size:13px" onclick="closeModal()">Close</a>
    </div>
  </div>`;
  
  openModal(html);
}

function viewNotificationDetail(notifId){
  const allNotifs = [
    { 
      id: 1, 
      icon: '<i class="fas fa-clipboard-list"></i>', 
      title: 'New Assignment', 
      msg: 'Math HW Ch.5 posted', 
      time: '2m ago', 
      read: false,
      fullMsg: 'Mr. Amponsah has posted a new assignment: Mathematics Chapter 5 Problems. Due date: March 22, 2026. Please complete and submit before the deadline.',
      action: 'View Assignment',
      actionLink: 'assignments'
    },
    { 
      id: 2, 
      icon: '<i class="fas fa-check-circle"></i>', 
      title: 'Grade Posted', 
      msg: 'Your essay - Grade A', 
      time: '1h ago', 
      read: false,
      fullMsg: 'Your essay submission for English has been graded. Grade: A (92%). Ms. Mensah left detailed feedback on your excellent arguments and structure.',
      action: 'View Feedback',
      actionLink: 'grades'
    },
    { 
      id: 3, 
      icon: '<i class="fas fa-graduation-cap"></i>', 
      title: 'Admission Update', 
      msg: 'New student enrolled', 
      time: '3h ago', 
      read: true,
      fullMsg: 'A new student has been successfully enrolled in Basic 1. You may need to update class lists and materials. Check Admin > Admissions for details.',
      action: 'View Details',
      actionLink: 'admissions'
    },
    { 
      id: 4, 
      icon: '<i class="fas fa-comments"></i>', 
      title: 'New Message', 
      msg: 'Message from Ms. Mensah', 
      time: '5h ago', 
      read: true,
      fullMsg: 'Ms. Mensah: Hi! Can you please schedule a meeting with the parents of Ama Serwaa to discuss her performance? Let me know your availability.',
      action: 'Reply',
      actionLink: 'messaging'
    },
    { 
      id: 5, 
      icon: '<i class="fas fa-exclamation-triangle"></i>', 
      title: 'Fee Reminder', 
      msg: '5 students pending fees', 
      time: '1d ago', 
      read: true,
      fullMsg: 'There are currently 5 students with pending fee payments. Total outstanding: GH₵4,800. Please follow up with parents or view the fees module for details.',
      action: 'View Fees',
      actionLink: 'fees'
    }
  ];
  
  const notif = allNotifs.find(n => n.id === notifId);
  if(!notif) return;
  
  let html = `<div style="max-width:90%;width:90%;background:white;border-radius:12px;overflow:hidden;box-shadow:var(--shadow-lg)">
      <div style="display:flex;gap:12px">
        <div style="font-size:32px;color:var(--blue-main)">${notif.icon}</div>
        <div>
          <h2 style="margin:0;font-size:20px">${notif.title}</h2>
          <p style="margin:6px 0 0 0;opacity:0.9;font-size:13px">${notif.time}</p>
        </div>
      </div>
      <button class="btn" style="background:rgba(255,255,255,0.3);color:white;padding:6px 12px;border:none;border-radius:6px;cursor:pointer;font-weight:600" onclick="showNotifications()">← Back</button>
    </div>
    
    <div style="padding:24px;background:var(--gray-50)">
      <div style="background:white;padding:16px;border-radius:10px;line-height:1.6;color:var(--gray-800);font-size:14px;margin-bottom:16px">
        ${notif.fullMsg}
      </div>
      
      <div style="display:flex;gap:10px">
        <button class="btn" style="flex:1;background:var(--blue-main);color:white;padding:12px;border:none;border-radius:8px;cursor:pointer;font-weight:600;transition:all 0.2s" onmouseover="this.style.background='var(--blue-mid)';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='var(--blue-main)';this.style.transform='translateY(0)'" onclick="navTo('${notif.actionLink}');closeModal()">${notif.action}</button>
        <button class="btn" style="flex:1;background:var(--gray-200);color:var(--gray-800);padding:12px;border:none;border-radius:8px;cursor:pointer;font-weight:600;transition:all 0.2s" onmouseover="this.style.background='var(--gray-300)'" onmouseout="this.style.background='var(--gray-200)'" onclick="showNotifications()">Dismiss</button>
      </div>
    </div>
  </div>`;
  
  openModal(html);
}

// ═══════════════════════════════════
// ROLE / NAVIGATION
// ═══════════════════════════════════
function toggleRS(){document.getElementById('role-switcher').classList.toggle('open')}
function switchRole(role){
  currentRole=role;
  document.getElementById('role-switcher').classList.remove('open');
  document.getElementById('top-role').textContent=role.toUpperCase();
  document.getElementById('top-av').textContent=AV_INIT[role]||'US';
  const menus=MENUS[role]||MENUS.Admin;
  currentMod=menus[0].items[0].id;
  
  // Show/hide sidebar and topbar based on role
  const sidebar = document.getElementById('sidebar');
  const topbar = document.querySelector('.topbar');
  const roleFab = document.getElementById('role-fab');
  const mainWrap = document.getElementById('main-content');
  
  if(role==='Visitor'){
    if(sidebar) sidebar.style.display='none';
    if(topbar) topbar.style.display='none';
    if(roleFab) roleFab.style.display='none';
    mainWrap.className = 'public-main-wrap';
    renderPublicNavbar();
  }else{
    if(sidebar) sidebar.style.display='flex';
    if(topbar) topbar.style.display='flex';
    if(roleFab) roleFab.style.display='flex';
    mainWrap.className = 'main-wrap';
    renderSidebar();
  }
  renderMain();
}
function navTo(id){
  // Add to navigation history if it's different from current
  if(id !== currentMod) {
    navigationHistory.push(id);
    // Limit history to last 10 pages
    if(navigationHistory.length > 10) {
      navigationHistory.shift();
    }
  }
  
  currentMod=id;
  
  if(currentRole==='Visitor'){
    renderPublicNavbar();
  }else{
    renderSidebar();
  }
  
  renderMain();  
  // Close sidebar on mobile after navigation
  closeMobileSidebar();
  
  document.getElementById('main-content').scrollTop=0;
  window.scrollTo(0,0);
}

// ═══════════════════════════════════
// MOBILE SIDEBAR TOGGLE FUNCTIONS
// ═══════════════════════════════════
function toggleMobileSidebar(){
  const sidebar = document.getElementById('sidebar');
  if(!sidebar) return;
  sidebar.classList.toggle('open');
}

function closeMobileSidebar(){
  const sidebar = document.getElementById('sidebar');
  if(!sidebar) return;
  sidebar.classList.remove('open');
}

function openMobileSidebar(){
  const sidebar = document.getElementById('sidebar');
  if(!sidebar) return;
  sidebar.classList.add('open');
}

function goBack(){
  // Remove current page and go to previous
  if(navigationHistory.length > 1) {
    navigationHistory.pop();  // Remove current
    const previousMod = navigationHistory[navigationHistory.length - 1];
    currentMod = previousMod;
    
    if(currentRole==='Visitor'){
      renderPublicNavbar();
    }else{
      renderSidebar();
    }
    
    renderMain();
    document.getElementById('main-content').scrollTop=0;
    window.scrollTo(0,0);
  } else {
    // If no history, go to dashboard
    navTo('dashboard');
  }
}

// ═══════════════════════════════════
// RENDER PUBLIC NAVBAR
// ═══════════════════════════════════
function renderPublicNavbar(){
  const navbar = document.createElement('nav');
  navbar.className = 'public-navbar';
  navbar.innerHTML = `
    <div class="public-nav-container">
      <div class="public-brand">
        <div class="brand-mark"><i class="fas fa-school"></i></div>
        <div class="brand-info">
          <div class="brand-name">Glory Regin Preparatory school</div>
          <div class="brand-tag">School Portal</div>
        </div>
      </div>
      <div class="public-nav-links" id="public-nav-links">
        <a class="nav-link${currentMod==='dashboard'?' active':''}" onclick="navTo('dashboard');closePublicMenu()"><i class="fas fa-home"></i> Home</a>
        <a class="nav-link${currentMod==='about'?' active':''}" onclick="navTo('about');closePublicMenu()"><i class="fas fa-info-circle"></i> About</a>
        <a class="nav-link${currentMod==='admission'?' active':''}" onclick="navTo('admission');closePublicMenu()"><i class="fas fa-file-alt"></i> Admissions</a>
        <a class="nav-link${currentMod==='gallery'?' active':''}" onclick="navTo('gallery');closePublicMenu()"><i class="fas fa-image"></i> Gallery</a>
        <a class="nav-link${currentMod==='news'?' active':''}" onclick="navTo('news');closePublicMenu()"><i class="fas fa-newspaper"></i> News</a>
        <a class="nav-link${currentMod==='contact'?' active':''}" onclick="navTo('contact');closePublicMenu()"><i class="fas fa-phone"></i> Contact</a>
      </div>
      <div class="public-nav-right">
        <button class="hamburger-btn" id="hamburger-btn" title="Toggle Menu"><i class="fas fa-bars"></i></button>
        <button class="btn-staff-login" onclick="logout()"><i class="fas fa-lock"></i> Login</button>
      </div>
    </div>
  `;
  
  const existingNavbar = document.querySelector('.public-navbar');
  if(existingNavbar) existingNavbar.remove();
  
  const appShell = document.getElementById('app-shell');
  appShell.insertBefore(navbar, appShell.firstChild);
  
  // Apply public-main-wrap class to main content
  const mainWrap = document.getElementById('main-content');
  mainWrap.className = 'public-main-wrap';
  
  // Initialize public menu
  initializePublicMenu();
}

// Show/hide hamburger button and nav links based on window size
function updatePublicNavbarResponsive(){
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('public-nav-links');
  
  if(!hamburger || !navLinks) return;
  
  // Get current window width
  const width = window.innerWidth;
  
  if(width <= 768){
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
function togglePublicMenu(event){
  if(event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  const navLinks = document.getElementById('public-nav-links');
  const width = window.innerWidth;
  
  if(width <= 768 && navLinks){
    if(navLinks.classList.contains('open')){
      navLinks.classList.remove('open');
      navLinks.style.display = 'none';
    } else {
      navLinks.classList.add('open');
      navLinks.style.display = 'flex';
    }
  }
}

// Close public navigation menu
function closePublicMenu(){
  const navLinks = document.getElementById('public-nav-links');
  if(navLinks){
    navLinks.classList.remove('open');
    if(window.innerWidth <= 768){
      navLinks.style.display = 'none';
    }
  }
}

// Initialize event listeners with event delegation
function initializePublicMenu(){
  updatePublicNavbarResponsive();
  
  // Use event delegation for hamburger button clicks
  document.removeEventListener('click', handleDocumentClick);
  document.addEventListener('click', handleDocumentClick);
}

// Global event handler for delegated clicks
function handleDocumentClick(e){
  const hamburgerBtn = e.target.closest('#hamburger-btn');
  const navbar = document.querySelector('.public-navbar');
  
  if(hamburgerBtn){
    e.preventDefault();
    e.stopPropagation();
    togglePublicMenu(e);
  } else if(navbar && !navbar.contains(e.target)){
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
if(document.readyState !== 'loading'){
  initializePublicMenu();
}

// ═══════════════════════════════════
// RENDER SIDEBAR
// ═══════════════════════════════════
function renderSidebar(){
  const menus=MENUS[currentRole]||MENUS.Admin;
  let h='';
  menus.forEach(sec=>{
    h+=`<div class="sb-section"><div class="sb-label">${sec.g}</div>`;
    sec.items.forEach(it=>{
      h+=`<div class="sb-item${it.id===currentMod?' active':''}" onclick="navTo('${it.id}')">
        <span class="si">${it.ic}</span>
        <span class="sl">${it.lbl}</span>
        ${it.badge?`<span class="sb-badge">${typeof it.badge === 'function' ? it.badge() : it.badge}</span>`:''}
      </div>`;
    });
    h+=`</div><div class="sb-divider"></div>`;
  });
  document.getElementById('sidebar').innerHTML=h;
}

// ═══════════════════════════════════
// RENDER MAIN
// ═══════════════════════════════════
function renderMain(){
  const el=document.getElementById('main-content');
  const r=currentRole, m=currentMod;
  const map={
    dashboard:()=>({Admin:adminDash,Teacher:teacherDash,Student:studentDash,Parent:parentDash,Accountant:accountDash,Alumni:alumniDash,Visitor:visitorHome}[r]||adminDash)(),
    students:()=>studentsModule(),
    teachers:()=>teachersModule(),
    parents:()=>parentsModule(),
    classes:()=>classesModule(),
    subjects:()=>subjectsModule(),
    timetable:()=>timetableModule(),
    attendance:()=>attendanceModule(),
    grades:()=>gradesModule(),
    exams:()=>examsModule(),
    admissions:()=>admissionsModule(),
    assignments:()=>assignmentsModule(),
    fees:()=>feesModule(),
    payments:()=>paymentsModule(),
    events:()=>eventsModule(),
    notices:()=>noticesModule(),
    news:()=>currentRole==='Visitor'?visitorNews():newsModule(),
    messaging:()=>messagingModule(),
    contact_messages:()=>contactMessagesModule(),
    staff:()=>staffModule(),
    users:()=>usersModule(),
    roles:()=>rolesModule(),
    reports:()=>reportsModule(),
    alumni:()=>alumniModule(),
    alumni_pub:()=>alumniPubModule(),
    backup:()=>backupModule(),
    settings:()=>settingsModule(),
    profile:()=>profileModule(),
    reportcards:()=>reportCardsModule(),
    lessonnotes:()=>lessonNotesModule(),
    children:()=>childrenModule(),
    salary:()=>salaryModule(),
    feestructure:()=>feeStructModule(),
    receipts:()=>receiptsModule(),
    balance:()=>balanceSheetModule(),
    expenses:()=>expensesModule(),
    directory:()=>alumniDirectory(),
    donations:()=>donationsModule(),
    jobs:()=>jobBoardModule(),
    certificates:()=>certificatesModule(),
    about:()=>visitorAbout(),
    admission:()=>visitorAdmission(),
    contact:()=>visitorContact(),
    gallery:()=>visitorGallery(),
  };
  el.innerHTML=(map[m]||map.dashboard)();
  
  // Initialize calendar if events module
  if(m === 'events') {
    setTimeout(() => renderCalendar(currentCalendarYear, currentCalendarMonth), 100);
  }
}

// ═══════════════════════════════════
// HELPERS
// ═══════════════════════════════════
function hdr(title,sub,bc){
  return `<div class="page-hdr">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
      <button class="back-btn" onclick="goBack()" title="Go back">← Back</button>
      <div class="breadcrumb"><i class="fas fa-home"></i> Home › <span>${bc||title}</span></div>
    </div>
    <h1>${title}</h1>
    <p>${sub}</p>
  </div>`;
}
function statCard(icon,val,lbl,chg,chgType,colorCls,isClickable,onClickFunc){
  return `<div class="stat-card" ${isClickable?`style="cursor:pointer;transition:all 0.2s" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'" onclick="${onClickFunc}"`:''}>
    <div class="stat-glow" style="background:var(--blue-main)"></div>
    <div class="stat-icon ${colorCls||'si-blue'}">${icon}</div>
    <div class="stat-val">${val}</div>
    <div class="stat-lbl">${lbl}</div>
    <div class="stat-chg chg-${chgType||'up'}">${chgType==='up'?'▲':'▼'} ${chg}</div>
  </div>`;
}
function mini_cal(){
  const days=['Su','Mo','Tu','We','Th','Fr','Sa'];
  const today = new Date();
  const year = miniCalDate.getFullYear();
  const month = miniCalDate.getMonth();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  let h=`<div class="cal-wrap">
    <div class="cal-hdr">
      <div class="cal-nav" style="cursor:pointer" onclick="miniCalPrev()">‹</div>
      <span class="cal-title" id="mini-cal-title" style="min-width:120px;text-align:center">${monthNames[month]} ${year}</span>
      <div class="cal-nav" style="cursor:pointer" onclick="miniCalNext()">›</div>
    </div>
    <div class="cal-grid">
      ${days.map(d=>`<div class="cal-dname">${d}</div>`).join('')}
      ${Array.from({length:firstDay},()=>'').map(()=>`<div class="cal-day"></div>`).join('')}
      ${Array.from({length:daysInMonth},(_,i)=>i+1).map(d=>{
        const cellDate = new Date(year, month, d);
        const isToday = cellDate.toDateString() === today.toDateString();
        const hasEvent = EVENTS_DATA.some(e => e.date === `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`);
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

function miniCalNext(){
  miniCalDate.setMonth(miniCalDate.getMonth() + 1);
  updateMiniCal();
}

function miniCalPrev(){
  miniCalDate.setMonth(miniCalDate.getMonth() - 1);
  updateMiniCal();
}

function updateMiniCal(){
  const days=['Su','Mo','Tu','We','Th','Fr','Sa'];
  const today = new Date();
  const year = miniCalDate.getFullYear();
  const month = miniCalDate.getMonth();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Update title
  const titleEl = document.getElementById('mini-cal-title');
  if(titleEl) titleEl.textContent = monthNames[month] + ' ' + year;
  
  // Rebuild grid
  let grid = days.map(d=>`<div class="cal-dname">${d}</div>`).join('');
  grid += Array.from({length:firstDay},()=>'').map(()=>`<div class="cal-day"></div>`).join('');
  grid += Array.from({length:daysInMonth},(_,i)=>i+1).map(d=>{
    const cellDate = new Date(year, month, d);
    const isToday = cellDate.toDateString() === today.toDateString();
    const hasEvent = EVENTS_DATA.some(e => e.date === `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`);
    const cls = isToday ? 'cal-today' : hasEvent ? 'cal-event' : '';
    return `<div class="cal-day ${cls}">${d}</div>`;
  }).join('');
  
  const gridEl = document.querySelector('.cal-grid');
  if(gridEl) gridEl.innerHTML = grid;
}
function bars(data,cls){
  const mx=Math.max(...data);
  return `<div class="chart-wrap">${data.map(v=>`<div class="c-bar ${cls||'pf-blue'}" style="height:${Math.round(v/mx*140)}px;background:${cls==='pf-gold'?'var(--gold)':'var(--blue-main)'}"></div>`).join('')}</div>`;
}
function paginationHtml(){
  return `<div style="display:flex;align-items:center;justify-content:space-between;margin-top:18px;padding-top:14px;border-top:1px solid var(--gray-200)">
    <span style="font-size:12px;color:var(--gray-500)">Showing 1–10 of many results</span>
    <div class="pagination">
      ${[1,2,3,'…',22].map(p=>`<button class="pg-btn${p===1?' active':''}" onclick="goToPage(${typeof p === 'number' ? p : '\"' + p + '\"'})">${p}</button>`).join('')}
    </div>
  </div>`;
}

// ═══════════════════════════════════
// ADMIN DASHBOARD
// ═══════════════════════════════════
function getCurrentDateString(){
  const now = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  return `${day}, ${date} ${month} ${year}`;
}

function adminDash(){
  const totalStudents = enrolledStudents.length;
  const totalTeachers = teachersData.length;
  const pendingFees = enrolledStudents.filter(s=>s.fees_status==='Pending').length;
  
  return hdr('Admin Dashboard','Welcome back, Administrator · '+getCurrentDateString())+`
  <div class="stats-row">
    ${statCard('<i class="fas fa-graduation-cap"></i>',''+totalStudents,'Total Students','12% this term','up','si-blue')}
    ${statCard('<i class="fas fa-chalkboard-user"></i>',''+totalTeachers,'Total Teachers','3 new this month','up','si-gold')}
    ${statCard('<i class="fas fa-money-bill"></i>','GH₵248K','Fees Collected','8% vs last term','up','si-green')}
    ${statCard('<i class="fas fa-exclamation-triangle"></i>',''+pendingFees,'Pending Fees','Needs attention','dn','si-red')}
  </div>
  <div class="g21 mb20">
    <div class="card">
      <div class="card-hdr">
        <span class="card-title"><i class="fas fa-chart-line"></i> Monthly Enrollment & Attendance</span>
        <span class="card-act" onclick="showMonthlyEnrollmentAttendanceReport()" style="cursor:pointer">Full Report</span>
      </div>
      <div style="display:flex;gap:4px;align-items:flex-end;height:140px">
        ${[80,65,90,75,88,72,95,85,70,92,80,60].map((h,i)=>`
        <div style="flex:1;display:flex;gap:2px;align-items:flex-end">
          <div style="flex:1;height:${Math.round(h*1.3)}px;background:var(--blue-main);border-radius:3px 3px 0 0;opacity:.85"></div>
          <div style="flex:1;height:${Math.round(h*.9)}px;background:var(--gold);border-radius:3px 3px 0 0;opacity:.75"></div>
        </div>`).join('')}
      </div>
      <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--gray-400);margin-top:6px;padding:0 2px">
        ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m=>`<span>${m}</span>`).join('')}
      </div>
      <div style="display:flex;gap:16px;margin-top:10px">
        <span style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--gray-600)"><span style="width:10px;height:10px;background:var(--blue-main);border-radius:2px;display:inline-block"></span>Enrollment</span>
        <span style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--gray-600)"><span style="width:10px;height:10px;background:var(--gold);border-radius:2px;display:inline-block"></span>Attendance</span>
      </div>
    </div>
    <div class="card">${mini_cal()}</div>
  </div>
  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-graduation-cap"></i> Recent Students</span><span class="card-act" onclick="navTo('students')">View All</span></div>
      <table class="tbl">
        <thead><tr><th>Student</th><th>Class</th><th>Status</th><th>Fees</th></tr></thead>
        <tbody>
          ${[['Ama Serwaa','JHS 1','Active','Paid','blue'],['Kwame Asante','Basic 6','Active','Pending','gold'],['Abena Mensah','Basic 1','Active','Paid','blue'],['Kofi Boateng','JHS 2','Active','Partial','purple'],['Akosua Darko','Basic 3','Active','Paid','green']].map(([n,c,s,f,av])=>`
          <tr>
            <td><div style="display:flex;align-items:center;gap:9px"><div class="av av-sm av-${av}">${n[0]}</div><strong>${n}</strong></div></td>
            <td>${c}</td>
            <td><span class="badge b-success">${s}</span></td>
            <td><span class="badge ${f==='Paid'?'b-success':f==='Pending'?'b-danger':'b-warning'}">${f}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-bell"></i> Recent Activity</span></div>
      <div class="activity">
        ${[['blue','New student enrolled — Ama Serwaa','5 min ago'],['gold','Assignment submitted by Basic 6','12 min ago'],['green','Fee payment received — GH₵800','30 min ago'],['red','3 students absent in Creche','1 hr ago'],['blue','Notice published: Sports Day','2 hrs ago'],['green','Timetable updated for JHS 1','3 hrs ago'],['purple','New teacher profile created','4 hrs ago']].map(([c,t,time])=>`
        <div class="act-item">
          <div class="act-dot" style="background:var(--${c==='blue'?'blue-main':c==='green'?'success':c==='red'?'danger':c==='purple'?'purple':'gold'})"></div>
          <div class="act-content"><div class="act-text">${t}</div><div class="act-time">${time}</div></div>
        </div>`).join('')}
      </div>
    </div>
  </div>
  <div class="g3">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-building"></i> Classes Overview</span></div>
      ${[['Primary/Basic',330,6,370],['Junior High (JHS)',215,3,250],['Early Childhood',140,4,180]].map(([f,n,c,t])=>`
      <div style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px">
          <span style="font-weight:600">${f} — ${c} classes</span>
          <span style="color:var(--gray-500)">${n}/${t}</span>
        </div>
        <div class="prog-bar"><div class="prog-fill pf-blue" style="width:${Math.round(n/t*100)}%"></div></div>
      </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-money-bill"></i> Fees Status</span></div>
      <div style="display:flex;justify-content:center;margin:10px 0">
        <svg viewBox="0 0 120 120" width="120" height="120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--gray-200)" stroke-width="14"/>
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--blue-main)" stroke-width="14"
            stroke-dasharray="${Math.PI*100*0.75} ${Math.PI*100*0.25}" stroke-linecap="round"
            transform="rotate(-90 60 60)"/>
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--gold)" stroke-width="14"
            stroke-dasharray="${Math.PI*100*0.15} ${Math.PI*100*0.85}" stroke-linecap="round"
            stroke-dashoffset="-${Math.PI*100*0.75}" transform="rotate(-90 60 60)"/>
          <text x="60" y="64" text-anchor="middle" font-size="16" font-weight="800" fill="var(--blue-dark)">75%</text>
        </svg>
      </div>
      <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
        <span style="font-size:11px;display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;background:var(--blue-main);border-radius:2px;display:inline-block"></span>Paid 75%</span>
        <span style="font-size:11px;display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;background:var(--gold);border-radius:2px;display:inline-block"></span>Partial 15%</span>
        <span style="font-size:11px;display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;background:var(--gray-200);border-radius:2px;display:inline-block"></span>Unpaid 10%</span>
      </div>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-trophy"></i> Subject Performance</span></div>
      ${[['Mathematics','92%',92],['English','88%',88],['Science','85%',85],['ICT','94%',94],['History','78%',78]].map(([s,p,v])=>`
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
          <span>${s}</span><span style="color:var(--blue-main);font-weight:700">${p}</span>
        </div>
        <div class="prog-bar"><div class="prog-fill pf-blue" style="width:${v}%"></div></div>
      </div>`).join('')}
    </div>
  </div>`;
}

// ═══════════════════════════════════
// TEACHER DASHBOARD
// ═══════════════════════════════════
function teacherDash(){
  return hdr('Teacher Dashboard','Welcome, Mr. Kweku Amponsah · Mathematics Department · JHS 1 · '+getCurrentDateString())+`
  <div class="stats-row">
    ${statCard('<i class="fas fa-graduation-cap"></i>','38','My Students','2 new this term','up','si-blue',true,'viewStatDetail("students")')}
    ${statCard('<i class="fas fa-book"></i>','5','Subjects Teaching','This semester','neu','si-gold',true,'viewStatDetail("subjects")')}
    ${statCard('<i class="fas fa-check-circle"></i>','94%','Attendance Rate','Above average','up','si-green',true,'viewStatDetail("attendance")')}
    ${statCard('<i class="fas fa-clipboard-list"></i>','8','Pending Grades','Needs grading','dn','si-red',true,'viewStatDetail("grades")')}
  </div>
  <div class="g21 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-calendar"></i> Today's Schedule</span><span class="card-act" onclick="navTo('timetable')">Full Timetable</span></div>
      <table class="tbl">
        <thead><tr><th>Time</th><th>Subject</th><th>Class</th><th>Room</th><th>Status</th></tr></thead>
        <tbody>
          ${[['7:30–8:20','Mathematics','JHS 1','Room 14','Done'],['8:20–9:10','Mathematics','Basic 6','Room 08','Done'],['10:00–10:50','Further Maths','JHS 2','Room 12','Up Next'],['11:00–11:50','Core Maths','Basic 1','Room 06','Upcoming'],['13:30–14:20','Statistics','Basic 3','Room 10','Upcoming']].map(([t,s,c,r,st])=>`
          <tr style="cursor:pointer" onclick="viewScheduleDetail('${t}', '${s}', '${c}')">
            <td style="color:var(--blue-main);font-weight:600">${t}</td>
            <td>${s}</td><td>${c}</td><td style="color:var(--gray-500)">${r}</td>
            <td><span class="badge ${st==='Done'?'b-success':st==='Up Next'?'b-warning':'b-info'}">${st}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-clipboard-list"></i> Assignments</span><span class="card-act" onclick="openAddAssignmentForm()">Add New</span></div>
      ${[['Math HW Ch.5','JHS 1','Today',12,38],['Algebra Quiz','Basic 6','Friday',8,34],['Geometry WS','Basic 1','Next Week',0,32]].map(([a,c,d,s,t])=>`
      <div style="margin-bottom:16px;cursor:pointer;padding:8px;border-radius:6px;transition:all 0.2s" onmouseover="this.style.background='var(--gray-50)'" onmouseout="this.style.background='transparent'" onclick="viewAssignmentSubmissions('${a}')">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
          <span style="font-size:13px;font-weight:600">${a}</span>
          <span class="badge ${d==='Today'?'b-warning':'b-info'}">${d}</span>
        </div>
        <div style="font-size:11px;color:var(--gray-500);margin-bottom:6px">${c} · ${s}/${t} submitted</div>
        <div class="prog-bar"><div class="prog-fill pf-gold" style="width:${Math.round(s/t*100)}%"></div></div>
      </div>`).join('')}
    </div>
  </div>
  <div class="g2">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-check-circle"></i> Mark Attendance — JHS 1</span><button class="btn btn-primary btn-sm" onclick="saveAttendance()">Save</button></div>
      <table class="tbl">
        <thead><tr><th>Student</th><th style="text-align:center">P</th><th style="text-align:center">A</th><th style="text-align:center">L</th><th>Remark</th></tr></thead>
        <tbody>
          ${[['Ama Serwaa','P'],['Kwame Asante','A'],['Abena Mensah','P'],['Kofi Boateng','L'],['Akosua Darko','P'],['Yaw Mensah','P']].map(([n,s])=>`
          <tr>
            <td><div style="display:flex;align-items:center;gap:8px"><div class="av av-sm av-blue">${n[0]}</div>${n}</div></td>
            <td style="text-align:center"><input type="radio" name="att_${n.replace(/ /g,'_')}" value="P" ${s==='P'?'checked':''}></td>
            <td style="text-align:center"><input type="radio" name="att_${n.replace(/ /g,'_')}" value="A" ${s==='A'?'checked':''}></td>
            <td style="text-align:center"><input type="radio" name="att_${n.replace(/ /g,'_')}" value="L" ${s==='L'?'checked':''}></td>
            <td><input style="border:1px solid var(--gray-200);border-radius:6px;padding:3px 8px;font-size:11px;width:90px;font-family:Poppins,sans-serif" placeholder="Note..." data-remark_${n.replace(/ /g,'_')}></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-comments"></i> Messages</span><span class="card-act" onclick="navTo('messaging')">Open Chat</span></div>
      <div class="chat-msgs">
        ${[['Admin','Staff meeting tomorrow at 3PM',false],['Parent Serwaa','Please update Ama\'s grade',false]].map(([n,m,mine])=>`
        <div class="chat-msg">
          <div class="av av-sm av-blue">${n[0]}</div>
          <div><div class="chat-bubble them">${m}</div><div class="chat-meta">${n}</div></div>
        </div>`).join('')}
      </div>
      <div class="chat-input-row">
        <input class="chat-inp" placeholder="Type reply..." onkeypress="if(event.key==='Enter') sendTeacherMessage()">
        <button class="chat-send" onclick="sendTeacherMessage()"><i class="fa-regular fa-paper-plane"></i></button>
      </div>
    </div>
  </div>`;
}

// ═══════════════════════════════════
// STUDENT DASHBOARD
// ═══════════════════════════════════

// Calculate class standing based on student performance
function calculateClassStanding(studentName) {
  const student = STUDENTS_DATA[studentName];
  if (!student) return { standing: 'Unknown', rank: '-', trend: 'neu' };
  
  // Calculate total score for the student
  function getTotalScore(scores) {
    return Object.values(scores).reduce((sum, { classScore, examScore }) => sum + classScore + examScore, 0);
  }
  
  const studentTotal = getTotalScore(student.scores);
  const studentClass = student.class;
  
  // Get all students in the same class and their scores
  const classmates = Object.entries(STUDENTS_DATA)
    .filter(([_, data]) => data.class === studentClass)
    .map(([name, data]) => ({
      name,
      total: getTotalScore(data.scores)
    }))
    .sort((a, b) => b.total - a.total); // Sort descending (highest first)
  
  // Find student's rank
  const studentRank = classmates.findIndex(c => c.name === studentName) + 1;
  const totalStudents = classmates.length;
  const percentile = Math.round((studentRank / totalStudents) * 100);
  
  // Determine standing based on percentile
  let standing = 'Average';
  let trend = 'neu';
  
  if (percentile <= 10) {
    standing = 'Top Performer';
    trend = 'up';
  } else if (percentile <= 25) {
    standing = 'High Achiever';
    trend = 'up';
  } else if (percentile <= 50) {
    standing = 'Good Performance';
    trend = 'up';
  } else if (percentile <= 75) {
    standing = 'Average';
    trend = 'neu';
  } else {
    standing = 'Needs Improvement';
    trend = 'dn';
  }
  
  return {
    standing,
    rank: `Rank ${studentRank} of ${totalStudents}`,
    trend
  };
}

// Get number of subjects for a student's class
function getStudentSubjectsCount(studentClass) {
  return SUBJECTS_BY_CLASS[studentClass] ? SUBJECTS_BY_CLASS[studentClass].length : 0;
}

// Get student's attendance percentage
function getStudentAttendance(studentName) {
  const student = STUDENTS_DATA[studentName];
  return student ? student.attendance : 0;
}

// Determine attendance trend and description
function getAttendanceTrend(percentage) {
  let trend = 'neu';
  let description = 'Average attendance';
  
  if (percentage >= 95) {
    trend = 'up';
    description = 'Excellent record';
  } else if (percentage >= 85) {
    trend = 'up';
    description = 'Good record';
  } else if (percentage >= 75) {
    trend = 'neu';
    description = 'Average attendance';
  } else {
    trend = 'dn';
    description = 'Needs improvement';
  }
  
  return { trend, description };
}

// Get pending tasks count (assignments with Pending or Not Started status)
function getPendingTasksCount() {
  const assignments = [
    ['Mathematics','Chapter 5 Problems','Today','Pending'],
    ['English','Essay on Climate','Mar 20','Submitted'],
    ['Science','Lab Report','Mar 22','Pending'],
    ['ICT','Database Project','Mar 25','In Progress'],
    ['History','WWII Essay','Mar 28','Not Started']
  ];
  return assignments.filter(([_,_2,_3,status]) => status === 'Pending' || status === 'Not Started').length;
}

function studentDash(){
  const studentName = 'Ama Serwaa';
  const studentClass = 'JHS 1';
  
  // Calculate all dynamic values
  const subjectsCount = getStudentSubjectsCount(studentClass);
  const attendance = getStudentAttendance(studentName);
  const attendanceTrend = getAttendanceTrend(attendance);
  const pendingTasks = getPendingTasksCount();
  const classStanding = calculateClassStanding(studentName);
  
  return hdr('Student Dashboard','Welcome, '+studentName+' · '+studentClass+' · Roll No: 2024-0042 · '+getCurrentDateString())+`
  <div class="student-profile-card">
    <div class="profile-left">
      <div class="profile-avatar av av-xl av-blue">AS</div>
      <div class="profile-info">
        <h3 class="profile-name">${studentName}</h3>
        <p class="profile-id">ID: 2024-0042</p>
        <p class="profile-class">${studentClass} · General</p>
      </div>
    </div>
    <button class="profile-idcard-btn" onclick="showStudentIDCard()" title="View ID Card">
      <i class="fas fa-id-card"></i>
    </button>
  </div>
  <div class="stats-row">
    ${statCard('<i class="fas fa-book"></i>',subjectsCount,'My Subjects','This semester','neu','si-blue')}
    ${statCard('<i class="fas fa-check-circle"></i>',attendance+'%','My Attendance',attendanceTrend.description,attendanceTrend.trend,'si-green')}
    ${statCard('<i class="fas fa-clipboard-list"></i>',pendingTasks,'Pending Tasks','Due this week','dn','si-red')}
    ${statCard('<i class="fas fa-star"></i>',classStanding.standing,'Class Standing',classStanding.rank,classStanding.trend,'si-gold')}
  </div>
  <div class="g21 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-file-alt"></i> My Assignments</span><span class="card-act" onclick="navTo('assignments')">All Assignments</span></div>
      <table class="tbl">
        <thead><tr><th>Subject</th><th>Assignment</th><th>Due Date</th><th>Status</th></tr></thead>
        <tbody>
          ${[['Mathematics','Chapter 5 Problems','Today','Pending'],['English','Essay on Climate','Mar 20','Submitted'],['Science','Lab Report','Mar 22','Pending'],['ICT','Database Project','Mar 25','In Progress'],['History','WWII Essay','Mar 28','Not Started']].map(([s,t,d,st])=>`
          <tr>
            <td style="font-weight:600">${s}</td><td>${t}</td>
            <td style="${d==='Today'?'color:var(--danger);font-weight:700':'color:var(--gray-600)'}">${d}</td>
            <td><span class="badge ${st==='Submitted'?'b-success':st==='Pending'?'b-warning':st==='In Progress'?'b-info':'b-gray'}">${st}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-target"></i> My Performance</span></div>
      ${[['Mathematics',88],['English',92],['Science',85],['ICT',95],['History',78],['French',72]].map(([s,v])=>`
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
          <span>${s}</span><span style="color:var(--blue-main);font-weight:700">${v}%</span>
        </div>
        <div class="prog-bar"><div class="prog-fill ${v>=90?'pf-green':v>=75?'pf-blue':'pf-gold'}" style="width:${v}%"></div></div>
      </div>`).join('')}
    </div>
  </div>
  <div class="g3">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-calendar"></i> Today's Timetable</span></div>
      ${[['7:30','Mathematics','Rm 14','Mr. Amponsah'],['8:20','English','Rm 02','Mrs. Asante'],['10:00','Science','Lab 1','Mr. Oduro'],['11:00','ICT','Lab 2','Ms. Frimpong'],['13:30','History','Rm 08','Mr. Boateng']].map(([t,s,r,tc])=>`
      <div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--gray-100)">
        <div style="font-size:11px;color:var(--blue-main);font-weight:700;min-width:42px">${t}</div>
        <div><div style="font-size:12.5px;font-weight:600">${s}</div><div style="font-size:10px;color:var(--gray-400)">${r} · ${tc}</div></div>
      </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-bullhorn"></i> Notices</span></div>
      ${[['<i class="fas fa-file-alt"></i>','Exam Schedule Released','Check portal for timetable'],['<i class="fas fa-running"></i>','Sports Day — Mar 24','All students attend'],['<i class="fas fa-book"></i>','Library Closure','March 20 only']].map(([i,t,d])=>`
      <div class="notice-item" style="padding:10px 0">
        <div class="notice-icon" style="background:var(--blue-xpale);width:38px;height:38px;border-radius:9px">${i}</div>
        <div class="notice-content"><h4>${t}</h4><p>${d}</p></div>
      </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-money-bill"></i> Fees Status</span></div>
      <div class="fee-hero" style="margin-bottom:12px">
        <h3>Term 1, 2025</h3>
        <div class="amount">GH₵ 2,400</div>
        <div class="sub">Fully Paid · March 15, 2025</div>
      </div>
      <div style="font-size:12px;color:var(--gray-600);text-align:center;padding:8px 0">
        <span class="badge b-success" style="font-size:12px;padding:6px 16px"><i class="fas fa-check-circle"></i> All Fees Cleared</span>
      </div>
    </div>
  </div>`;
}

// ═══════════════════════════════════
// PARENT DASHBOARD
// ═══════════════════════════════════
function parentDash(){
  return hdr('Parent Dashboard','Welcome, Mr. & Mrs. Serwaa · Parent of 2 students · '+getCurrentDateString())+`
  <div class="stats-row">
    ${statCard('<i class="fas fa-child"></i>','2','My Children','Both active','neu','si-blue')}
    ${statCard('<i class="fas fa-check-circle"></i>','96%','Ama\'s Attendance','Excellent','up','si-green')}
    ${statCard('<i class="fas fa-file"></i>','A','Last Report Grade','Term 2, 2024','up','si-gold')}
    ${statCard('<i class="fas fa-money-bill"></i>','Paid','Fees Status','All clear','up','si-green')}
  </div>
  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-child"></i> My Children</span></div>
      ${[['Ama Serwaa','JHS 1','2024-0042','96%','3.8','Paid','blue'],['Kweku Serwaa','Basic 3','2024-0143','91%','3.5','Paid','purple']].map(([n,c,r,att,gpa,f,av])=>`
      <div style="display:flex;gap:16px;align-items:center;padding:14px;background:var(--gray-50);border-radius:var(--radius-lg);margin-bottom:12px">
        <div class="av av-lg av-${av}">${n[0]}</div>
        <div style="flex:1">
          <div style="font-size:15px;font-weight:700;color:var(--blue-dark)">${n}</div>
          <div style="font-size:11px;color:var(--gray-500)">${c} · ${r}</div>
          <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
            <span class="badge b-success">${att} Attendance</span>
            <span class="badge b-info">GPA ${gpa}</span>
            <span class="badge b-success">Fees ${f}</span>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="navTo('reportcards')"><i class="fas fa-file"></i> Report</button>
      </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-comments"></i> Teacher Communication</span><span class="card-act" onclick="navTo('teachers')">All Teachers</span></div>
      <div class="chat-msgs">
        <div class="chat-msg">
          <div class="av av-sm av-green">A</div>
          <div><div class="chat-bubble them">Ama has shown great improvement in Mathematics this term. Excellent student!</div><div class="chat-meta">Mr. Amponsah · 9:00 AM</div></div>
        </div>
        <div class="chat-msg me">
          <div class="av av-sm av-blue">P</div>
          <div><div class="chat-bubble me-bubble">Thank you for the update. We will keep encouraging her!</div><div class="chat-meta" style="text-align:right">You · 9:15 AM</div></div>
        </div>
      </div>
      <div class="chat-input-row">
        <input class="chat-inp" placeholder="Message a teacher...">
        <button class="chat-send">➤</button>
      </div>
    </div>
  </div>
  <div class="g3">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-clipboard-list"></i> Pending Assignments</span></div>
      ${[['Math HW','Ama Serwaa','Today'],['English Essay','Ama Serwaa','Mar 20'],['ICT Project','Kweku Serwaa','Mar 25']].map(([a,c,d])=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--gray-100)">
        <div><div style="font-size:12.5px;font-weight:600">${a}</div><div style="font-size:11px;color:var(--gray-400)">${c}</div></div>
        <span class="badge ${d==='Today'?'b-danger':'b-warning'}">${d}</span>
      </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-money-bill"></i> Fees Summary</span></div>
      <div class="fee-hero" style="margin-bottom:10px">
        <h3>Ama Serwaa · JHS 1</h3>
        <div class="amount">GH₵ 2,400</div>
        <div class="sub">Fully Paid · Term 1, 2025</div>
      </div>
      <div style="padding:12px;background:var(--gray-50);border-radius:var(--radius)">
        <div style="font-size:12px;font-weight:600;margin-bottom:4px">Kweku Serwaa · Form 1B</div>
        <div style="font-size:20px;font-weight:800;color:var(--blue-dark)">GH₵ 2,200</div>
        <span class="badge b-success" style="margin-top:6px">Fully Paid</span>
      </div>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-calendar-alt"></i> Upcoming Events</span></div>
      ${[['Mar 20','PTA Meeting','3:00 PM School Hall'],['Mar 24','Sports Day','All day event'],['Apr 01','Term Exams Begin','8:00 AM daily']].map(([d,e,t])=>`
      <div style="display:flex;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid var(--gray-100)">
        <div style="min-width:46px;height:46px;background:var(--blue-xpale);border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center">
          <span style="font-size:9px;color:var(--blue-main);font-weight:700">${d.split(' ')[0]}</span>
          <span style="font-size:18px;font-weight:800;color:var(--blue-dark)">${d.split(' ')[1]}</span>
        </div>
        <div><div style="font-size:12.5px;font-weight:600">${e}</div><div style="font-size:11px;color:var(--gray-400)">${t}</div></div>
      </div>`).join('')}
    </div>
  </div>`;
}

// ═══════════════════════════════════
// ACCOUNTANT DASHBOARD
// ═══════════════════════════════════
function accountDash(){
  return hdr('Accountant Dashboard','Financial Overview · Term 1, 2025 · Glory Regin Preparatory school · '+getCurrentDateString())+`
  <div class="stats-row">
    ${statCard('<i class="fas fa-money-bill"></i>','GH₵248K','Total Collected','8% this term','up','si-blue')}
    ${statCard('<i class="fas fa-hourglass-half"></i>','GH₵32K','Outstanding Fees','37 students','dn','si-red')}
    ${statCard('<i style="transform:rotate(90deg);display:inline-block" class="fas fa-chart-line"></i>','GH₵89K','Total Expenses','Within budget','neu','si-gold')}
    ${statCard('<i class="fas fa-chart-bar"></i>','GH₵124K','Net Balance','Surplus','up','si-green')}
  </div>
  <div class="g21 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-credit-card"></i> Recent Payments</span><button class="btn btn-gold btn-sm" onclick="navTo('payments')">+ Record Payment</button></div>
      <table class="tbl">
        <thead><tr><th>Student</th><th>Amount</th><th>Date</th><th>Receipt No.</th><th>Method</th><th>Status</th></tr></thead>
        <tbody>
          ${[['Ama Serwaa','GH₵2,400','Mar 15','#R-0482','Cash','Paid'],['Kwame Asante','GH₵1,200','Mar 15','#R-0481','Cash','Partial'],['Abena Mensah','GH₵2,400','Mar 14','#R-0480','Cash','Paid'],['Kofi Boateng','—','—','—','—','Pending'],['Akosua Darko','GH₵2,400','Mar 13','#R-0479','Cash','Paid']].map(([n,a,d,r,m,s])=>`
          <tr>
            <td><div style="display:flex;align-items:center;gap:8px"><div class="av av-sm av-gold">${n[0]}</div>${n}</div></td>
            <td style="font-weight:700;color:var(--blue-dark)">${a}</td>
            <td>${d}</td>
            <td style="color:var(--blue-main)">${r}</td>
            <td>${m}</td>
            <td><span class="badge ${s==='Paid'?'b-success':s==='Pending'?'b-danger':'b-warning'}">${s}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div>
      <div class="fee-hero mb16">
        <h3>Total Collected — Term 1, 2025</h3>
        <div class="amount">GH₵ 248,000</div>
        <div class="sub">Target: GH₵280,000 · 88.6% achieved</div>
        <div style="margin-top:12px;background:rgba(255,255,255,.15);border-radius:4px;height:8px">
          <div style="width:88.6%;background:var(--gold);height:8px;border-radius:4px"></div>
        </div>
      </div>
      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-bolt"></i> Quick Actions</span></div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <button class="btn btn-primary" onclick="navTo('payments')"><i class="fas fa-money-bill"></i> Record Cash Payment</button>
          <button class="btn btn-secondary" onclick="navTo('receipts')"><i class="fas fa-receipt"></i> Issue Receipt</button>
          <button class="btn btn-gold" onclick="navTo('reports')"><i class="fas fa-chart-line"></i> Financial Report</button>
          <button class="btn btn-secondary" onclick="navTo('expenses')"><i class="fas fa-chart-line"></i> Add Expense</button>
        </div>
      </div>
    </div>
  </div>
  <div class="g3">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-bar"></i> Revenue Breakdown</span></div>
      ${[['School Fees','GH₵248,000',78],['Exam Fees','GH₵18,000',6],['Sports Levy','GH₵9,600',3],['Lab Fees','GH₵12,800',4],['Other','GH₵9,600',3]].map(([c,a,p])=>`
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
          <span>${c}</span><span style="font-weight:600">${a}</span>
        </div>
        <div class="prog-bar"><div class="prog-fill pf-blue" style="width:${p*1.2}%"></div></div>
      </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-briefcase"></i> Payroll Status</span></div>
      ${[['Teaching Staff','64 staff','Mar 28'],['Admin Staff','12 staff','Mar 28'],['Support Staff','18 staff','Mar 30']].map(([t,s,d])=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--gray-100)">
        <div><div style="font-size:12.5px;font-weight:600">${t}</div><div style="font-size:11px;color:var(--gray-400)">${s}</div></div>
        <span class="badge b-warning">Due ${d}</span>
      </div>`).join('')}
      <button class="btn btn-primary btn-sm" style="width:100%;margin-top:12px" onclick="navTo('salary')">Process Payroll</button>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-calendar-alt"></i> Calendar</span></div>
      ${mini_cal()}
    </div>
  </div>`;
}

// ═══════════════════════════════════
// ALUMNI DASHBOARD
// ═══════════════════════════════════
function alumniDash(){
  return `<div class="visitor-hero" style="margin-bottom:26px">
    <h1><i class="fas fa-graduation-cap"></i> Welcome, Alumni Network</h1>
    <p>Stay connected with your alma mater, reconnect with classmates, and give back to Glory Regin Preparatory school</p>
    <div class="hero-btns">
      <button class="hero-btn-gold" onclick="navTo('directory')">Browse Directory</button>
      <button class="hero-btn-outline" onclick="navTo('events')">Upcoming Reunions</button>
    </div>
  </div>`+`
  <div class="stats-row">
    ${statCard('<i class="fas fa-medal"></i>','1,240','Total Alumni','Network growing','up','si-blue')}
    ${statCard('<i class="fas fa-calendar-alt"></i>','3','Upcoming Events','This quarter','neu','si-gold')}
    ${statCard('<i class="fas fa-briefcase"></i>','28','Job Listings','Posted by alumni','up','si-green')}
    ${statCard('<i class="fas fa-handshake"></i>','GH₵42K','Total Donations','This year','up','si-purple')}
  </div>
  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-users"></i> Recent Alumni</span><span class="card-act" onclick="navTo('directory')">Full Directory</span></div>
      <table class="tbl">
        <thead><tr><th>Name</th><th>Class</th><th>Location</th><th>Profession</th><th>Connect</th></tr></thead>
        <tbody>
          ${[['Abena Owusu','2018','Accra','Software Engineer','purple'],['Kwabena Asare','2016','London','Medical Doctor','blue'],['Esi Mensah','2020','Kumasi','Teacher','green'],['Yaw Boateng','2015','Toronto','Lawyer','gold']].map(([n,c,l,p,av])=>`
          <tr>
            <td><div style="display:flex;align-items:center;gap:8px"><div class="av av-sm av-${av}">${n[0]}</div>${n}</div></td>
            <td><span class="badge b-info">Class of ${c}</span></td>
            <td>${l}</td><td>${p}</td>
            <td><button class="btn btn-secondary btn-xs" onclick="alert('Connection request sent!')">Connect</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-briefcase"></i> Latest Jobs</span><span class="card-act" onclick="navTo('jobs')">View All</span></div>
      ${[['Software Dev Intern','Accra · Abena Owusu (2018)','Today'],['Medical Resident','Korle Bu · Kwabena (2016)','2 days ago'],['Teaching Position','Kumasi · Esi Mensah (2020)','1 week ago']].map(([t,l,d])=>`
      <div style="padding:12px;background:var(--gray-50);border-radius:10px;margin-bottom:10px">
        <div style="font-size:13px;font-weight:700;color:var(--blue-dark)">${t}</div>
        <div style="font-size:11px;color:var(--gray-500);margin-top:4px">${l}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
          <span style="font-size:10px;color:var(--gray-400)">${d}</span>
          <button class="btn btn-primary btn-xs" onclick="alert('Job application submitted!')">Apply</button>
        </div>
      </div>`).join('')}
    </div>
  </div>`;
}

// ═══════════════════════════════════
// VISITOR HOME
// ═══════════════════════════════════
function visitorHome(){
  return `<div class="visitor-hero">
    <h1><i class="fas fa-school"></i> Glory Regin Preparatory school</h1>
    <p>Nurturing minds, building character, and shaping futures since 1985. A premier educational institution in Ghana known for academic excellence and holistic development.</p>
    <div class="hero-btns">
      <button class="hero-btn-gold" onclick="navTo('admission')">Apply for Admission</button>
      <button class="hero-btn-outline" onclick="navTo('about')">Learn More About Us</button>
      <button class="hero-btn-outline" onclick="logout()"><i class="fas fa-lock"></i> Login to Portal</button>
    </div>
  </div>
  <div class="stats-row mb24">
    ${statCard('<i class="fas fa-graduation-cap"></i>','5,200+','Alumni Worldwide','And growing','up','si-blue')}
    ${statCard('<i class="fas fa-chalkboard-user"></i>','64','Expert Teachers','Dedicated faculty','neu','si-gold')}
    ${statCard('<i class="fas fa-trophy"></i>','98%','Pass Rate','Consistent excellence','up','si-green')}
    ${statCard('<i class="fas fa-calendar-alt"></i>','40','Years of Excellence','Since 1985','neu','si-purple')}
  </div>
  <div class="g3 mb24">
    ${[['<i class="fas fa-info-circle" style="font-size:36px"></i>','About School','Our history, mission, vision and values','about'],['<i class="fas fa-file-alt" style="font-size:36px"></i>','Admissions','Requirements, process and deadlines','admission'],['<i class="fas fa-calendar-alt" style="font-size:36px"></i>','Events','Sports Day, Prize Giving, Open Day','events'],['<i class="fas fa-image" style="font-size:36px"></i>','Gallery','Photos from school life','gallery'],['<i class="fas fa-newspaper" style="font-size:36px"></i>','News & Blog','Latest school news','news'],['<i class="fas fa-phone" style="font-size:36px"></i>','Contact Us','Get in touch with us','contact']].map(([i,t,d,id])=>`
    <div class="card" style="cursor:pointer;transition:transform .2s,box-shadow .2s" onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='var(--shadow)'" onmouseout="this.style.transform='';this.style.boxShadow=''" onclick="navTo('${id}')">
      <div style="margin-bottom:14px;color:var(--blue-main)">${i}</div>
      <h3 style="font-size:14px;font-weight:700;color:var(--blue-dark);margin-bottom:6px">${t}</h3>
      <p style="font-size:12px;color:var(--gray-400)">${d}</p>
    </div>`).join('')}
  </div>`;
}


// ═══════════════════════════════════
// ADMISSIONS MODULE
// ═══════════════════════════════════
function admissionsModule(){
  const approved = admissionsData.filter(a=>a.status==='Approved').length;
  const pending = admissionsData.filter(a=>a.status==='Pending').length;
  const rejected = admissionsData.filter(a=>a.status==='Rejected').length;
  return hdr('Admissions Module','Process new student admissions and generate student IDs','Admissions')+`
  <div class="stats-row">
    ${statCard('<i class="fas fa-clipboard-list"></i>','12','Total Applications','This academic year','neu','si-blue')}
    ${statCard('<i class="fas fa-check-circle"></i>',''+approved,'Approved','Ready for enrollment','up','si-green')}
    ${statCard('<i class="fas fa-hourglass-half"></i>',''+pending,'Pending','Awaiting review','neu','si-gold')}
    ${statCard('<i class="fas fa-times-circle"></i>',''+rejected,'Rejected','Did not meet criteria','dn','si-red')}
  </div>
  <div class="toolbar">
    <button class="btn btn-primary" onclick="toggleAdmForm()"><i class="fas fa-plus"></i> New Admission Form</button>
    <button class="btn btn-secondary" onclick="showAdmissionStatistics()"><i class="fas fa-chart-bar"></i> Statistics</button>
    <button class="btn btn-secondary" onclick="exportAdmissionsToCSV()" style="cursor:pointer"><i class="fas fa-download"></i> CSV</button>
    <button class="btn btn-secondary" onclick="exportAdmissionsToExcel()" style="cursor:pointer"><i class="fas fa-chart-bar"></i> Excel</button>
    <button class="btn btn-secondary" onclick="downloadAdmissionsPDF()" style="cursor:pointer"><i class="fas fa-file-pdf"></i> PDF</button>
    <div class="search-bar"><span><i class="fas fa-magnifying-glass"></i></span><input placeholder="Search by name or ID..."></div>
  </div>
  
  <!-- FORM -->
  <div id="adm-form-wrap" style="display:none;margin-bottom:20px">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-file-alt"></i> New Admission Form</span></div>
      <div class="form-grid">
        <div style="grid-column:1/-1">
          <h3 style="color:var(--blue-dark);font-size:14px;font-weight:700;margin-bottom:12px"><i class="fas fa-user"></i> Student Personal Details</h3>
        </div>
        <div class="form-field">
          <label>Full Name *</label>
          <input type="text" id="adm-name" placeholder="Enter full name as on birth certificate">
        </div>
        <div class="form-field">
          <label>Date of Birth *</label>
          <input type="date" id="adm-dob">
        </div>
        <div class="form-field">
          <label>Gender *</label>
          <select id="adm-gender"><option>-- Select --</option><option>Male</option><option>Female</option></select>
        </div>
        <div class="form-field">
          <label>Contact Number</label>
          <input type="tel" id="adm-phone" placeholder="0244567890">
        </div>
        <div class="form-field" style="grid-column:1/-1">
          <label>Residential Address *</label>
          <input type="text" id="adm-address" placeholder="Full residential address">
        </div>
        
        <div style="grid-column:1/-1;margin-top:12px">
          <h3 style="color:var(--blue-dark);font-size:14px;font-weight:700;margin-bottom:12px"><i class="fas fa-users"></i> Parent/Guardian Details</h3>
        </div>
        <div class="form-field">
          <label>Parent/Guardian Name *</label>
          <input type="text" id="adm-parent-name" placeholder="Full name">
        </div>
        <div class="form-field">
          <label>Parent Phone *</label>
          <input type="tel" id="adm-parent-phone" placeholder="0244567890">
        </div>
        <div class="form-field">
          <label>Relationship *</label>
          <select id="adm-relationship"><option>-- Select --</option><option>Father</option><option>Mother</option><option>Guardian</option><option>Uncle</option><option>Aunt</option></select>
        </div>
        <div class="form-field">
          <label>Occupation</label>
          <input type="text" id="adm-occupation" placeholder="e.g., Teacher, Trader, Engineer">
        </div>
        
        <div style="grid-column:1/-1;margin-top:12px">
          <h3 style="color:var(--blue-dark);font-size:14px;font-weight:700;margin-bottom:12px"><i class="fas fa-book"></i> Academic Information</h3>
        </div>
        <div class="form-field">
          <label>Previous School *</label>
          <input type="text" id="adm-school" placeholder="Name of previous school">
        </div>
        <div class="form-field">
          <label>Last Class Attended</label>
          <input type="text" id="adm-last-class" placeholder="e.g., Primary 6, JHS 3">
        </div>
        <div class="form-field">
          <label>Class Applying For *</label>
          <select id="adm-class"><option>-- Select Class --</option><option>Creche</option><option>Nursery</option><option>KG 1</option><option>KG 2</option><option>Basic 1</option><option>Basic 2</option><option>Basic 3</option><option>Basic 4</option><option>Basic 5</option><option>Basic 6</option><option>JHS 1</option><option>JHS 2</option><option>JHS 3</option></select>
        </div>
        <div class="form-field">
          <label>Academic Year *</label>
          <select id="adm-year"><option>2025/2026</option><option>2024/2025</option></select>
        </div>
        <div class="form-field" style="grid-column:1/-1">
          <label><i class="fas fa-camera"></i> Passport Photo / Picture</label>
          <div style="display:flex;gap:12px;align-items:flex-start">
            <div style="flex:1">
              <input type="file" id="adm-picture" accept="image/*" onchange="previewAdmPicture(this)" style="border:1.5px solid var(--gray-200);border-radius:6px;padding:8px;width:100%;font-size:12px;cursor:pointer">
              <div style="font-size:10px;color:var(--gray-400);margin-top:4px">Supported: JPG, PNG, GIF (Max 5MB)</div>
            </div>
            <div id="adm-pic-preview" style="width:80px;height:100px;background:var(--gray-100);border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--gray-400);font-size:32px;overflow:hidden;flex-shrink:0"><i class="fas fa-camera"></i></div>
          </div>
        </div>
        <div class="form-field" style="grid-column:1/-1">
          <label>Medical Conditions / Special Needs</label>
          <textarea id="adm-medical" placeholder="Any health issues or special requirements?" style="min-height:60px;font-family:Poppins,sans-serif;border:1.5px solid var(--gray-200);border-radius:6px;padding:8px;font-size:12px"></textarea>
        </div>
        
        <div style="grid-column:1/-1;display:flex;gap:8px;margin-top:16px">
          <button class="btn btn-primary" style="flex:1" onclick="submitAdmission()"><i class="fas fa-check"></i> Submit Application</button>
          <button class="btn btn-secondary" style="flex:1" onclick="toggleAdmForm()">Cancel</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- PENDING ADMISSIONS -->
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-hourglass-half"></i> Pending Admissions</span></div>
    <table class="tbl" style="font-size:12px">
      <thead>
        <tr>
          <th>#</th>
          <th>Application No.</th>
          <th>Student Name</th>
          <th>DOB</th>
          <th>Class Applying</th>
          <th>Parent</th>
          <th>Date Applied</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${admissionsData.filter(a=>a.status==='Pending').map((a,i)=>'<tr><td style="color:var(--gray-400)">'+((i+1))+'</td><td style="font-weight:600;color:var(--blue-dark)">'+a.adm_id+'</td><td>'+a.name+'</td><td style="font-size:11px">'+a.dob+'</td><td><span class="badge b-info">'+a.class_applying+'</span></td><td style="font-size:11px">'+a.parent_name+'</td><td style="font-size:11px;color:var(--gray-500)">'+a.created+'</td><td><span class="badge b-warning"><i class=\"fas fa-hourglass-half\"></i> Pending</span></td><td><div style="display:flex;gap:4px"><button class="btn btn-primary btn-xs" onclick="approveAdmission(\''+a.adm_id+'\', \''+a.name+'\')"><i class=\"fas fa-check\"></i> Approve</button><button class="btn btn-danger btn-xs" onclick="rejectAdmission(\''+a.adm_id+'\')"><i class=\"fas fa-times\"></i> Reject</button></div></td></tr>').join('')}
      </tbody>
    </table>
  </div>
  
  <!-- APPROVED ADMISSIONS (READY FOR ENROLLMENT) -->
  <div class="card" style="margin-top:20px">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-check-circle"></i> Approved Admissions (Ready for Enrollment)</span></div>
    <table class="tbl" style="font-size:12px">
      <thead>
        <tr>
          <th>#</th>
          <th>Application No.</th>
          <th>Generated Student ID</th>
          <th>Student Name</th>
          <th>Class</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${admissionsData.filter(a=>a.status==='Approved').map((a,i)=>'<tr><td style="color:var(--gray-400)">'+((i+1))+'</td><td style="font-weight:600;color:var(--blue-dark)">'+a.adm_id+'</td><td style="font-weight:700;color:var(--success)">'+generateStudentID(a.class_applying,''+admissionsData.indexOf(a))+'</td><td>'+a.name+'</td><td><span class="badge b-info">'+a.class_applying+'</span></td><td><span class="badge b-success"><i class=\"fas fa-check-circle\"></i> Approved</span></td><td><div style="display:flex;gap:4px"><button class="btn btn-secondary btn-xs" onclick="alert(\'Printing admission slip for '+a.name+'...\')"><i class=\"fas fa-print\"></i> Print Slip</button><button class="btn btn-primary btn-xs" onclick="enrollStudent(\''+a.adm_id+'\')"><i class=\"fas fa-book\"></i> Enroll</button></div></td></tr>').join('')}
      </tbody>
    </table>
  </div>
  
  <!-- REJECTED & WITHDRAWN -->
  <div class="card" style="margin-top:20px">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-times-circle"></i> Rejected / Withdrawn</span></div>
    <table class="tbl" style="font-size:12px">
      <thead>
        <tr>
          <th>#</th>
          <th>Application No.</th>
          <th>Student Name</th>
          <th>Class Applied</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${admissionsData.filter(a=>a.status==='Rejected').map((a,i)=>'<tr><td style="color:var(--gray-400)">'+((i+1))+'</td><td style="font-weight:600;color:var(--blue-dark)">'+a.adm_id+'</td><td>'+a.name+'</td><td><span class="badge b-secondary">'+a.class_applying+'</span></td><td><span class="badge b-danger"><i class=\"fas fa-times-circle\"></i> Rejected</span></td><td style="font-size:11px;color:var(--gray-500)">'+a.created+'</td></tr>').join('')}
      </tbody>
    </table>
  </div>
  `;
}

function toggleAdmForm(){
  const form = document.getElementById('adm-form-wrap');
  if(form) form.style.display = form.style.display==='none'?'block':'none';
}

function generateStudentID(classApplying, index){
  const year = new Date().getFullYear();
  const prefix = classApplying.includes('JHS') ? 'JHS' : 'FORM';
  const seq = String(index).padStart(3, '0');
  return prefix + year + '-' + seq;
}

function submitAdmission(){
  const name = document.getElementById('adm-name').value.trim();
  const dob = document.getElementById('adm-dob').value;
  const gender = document.getElementById('adm-gender').value;
  const phone = document.getElementById('adm-phone').value;
  const address = document.getElementById('adm-address').value.trim();
  const parentName = document.getElementById('adm-parent-name').value.trim();
  const parentPhone = document.getElementById('adm-parent-phone').value;
  const relationship = document.getElementById('adm-relationship').value;
  const occupation = document.getElementById('adm-occupation').value;
  const school = document.getElementById('adm-school').value.trim();
  const lastClass = document.getElementById('adm-last-class').value;
  const classApplying = document.getElementById('adm-class').value;
  const academicYear = document.getElementById('adm-year').value;
  const picture = window.admPictureData || null;
  
  if(!name || !dob || !gender || !address || !parentName || !parentPhone || !relationship || !school || !classApplying){
    alert('Please fill in all required fields (marked with *)');
    return;
  }
  
  const today = new Date().toISOString().split('T')[0];
  const admNo = 'ADM' + today.slice(0,4) + '-' + String(admissionsData.length + 1).padStart(3, '0');
  
  const newAdmission = {
    adm_id: admNo,
    name: name,
    dob: dob,
    gender: gender,
    address: address,
    phone: phone,
    school: school,
    class_applying: classApplying,
    academic_year: academicYear,
    status: 'Pending',
    parent_name: parentName,
    parent_phone: parentPhone,
    parent_occupation: occupation,
    picture: picture,
    created: today
  };
  
  admissionsData.push(newAdmission);
  showToast('<i class="fas fa-check-circle"></i> Application submitted!<br/>Application #: ' + admNo + '<br/>Status: Pending Review', 'success', 4000);
  
  // Clear form
  document.getElementById('adm-form-wrap').style.display = 'none';
  document.getElementById('adm-name').value = '';
  document.getElementById('adm-dob').value = '';
  document.getElementById('adm-gender').value = '';
  document.getElementById('adm-phone').value = '';
  document.getElementById('adm-address').value = '';
  document.getElementById('adm-parent-name').value = '';
  document.getElementById('adm-parent-phone').value = '';
  document.getElementById('adm-relationship').value = '';
  document.getElementById('adm-occupation').value = '';
  document.getElementById('adm-school').value = '';
  document.getElementById('adm-last-class').value = '';
  document.getElementById('adm-class').value = '';
  document.getElementById('adm-picture').value = '';
  document.getElementById('adm-pic-preview').innerHTML = '<i class="fas fa-camera" style="color:var(--gray-400)"></i>';
  window.admPictureData = null;
  
  // Refresh module
  renderMain('admissions');
}

function approveAdmission(admId, studentName){
  const adm = admissionsData.find(a=>a.adm_id===admId);
  if(adm){
    adm.status = 'Approved';
    const studentID = generateStudentID(adm.class_applying, admissionsData.indexOf(adm));
    showToast('<i class="fas fa-check-circle"></i> Admission Approved!<br/>Student: ' + studentName + '<br/>Student ID: ' + studentID, 'success', 4000);
    renderMain('admissions');
  }
}

function rejectAdmission(admId){
  const adm = admissionsData.find(a=>a.adm_id===admId);
  if(adm){
    if(confirm('Are you sure you want to reject this application?')){
      adm.status = 'Rejected';
      alert('<i class="fas fa-times-circle"></i> Application has been rejected.');
      renderMain('admissions');
    }
  }
}

function enrollStudent(admissionId){
  const admission = admissionsData.find(a=>a.adm_id===admissionId);
  if(!admission){
    alert('<i class="fas fa-times-circle"></i> Admission record not found');
    return;
  }
  
  const studentID = generateStudentID(admission.class_applying, admissionsData.indexOf(admission));
  const avatarColors = ['blue','gold','purple','green','teal','orange','pink','red'];
  const randomColor = avatarColors[Math.floor(Math.random()*avatarColors.length)];
  
  const newStudent = {
    student_id: studentID,
    name: admission.name,
    student_class: admission.class_applying,
    gender: admission.gender,
    dob: admission.dob,
    attendance: '0%',
    gpa: '0.0',
    fees_status: 'Pending',
    status: 'Active',
    avatar_color: randomColor,
    gender_abbr: admission.gender[0],
    parent_name: admission.parent_name,
    parent_phone: admission.parent_phone,
    picture: admission.picture,
    enrolled_date: new Date().toISOString().split('T')[0]
  };
  
  enrolledStudents.push(newStudent);
  admission.status = 'Enrolled';
  
  showToast('<i class="fas fa-check-circle"></i> Student Enrolled Successfully!<br/>Name: '+admission.name+'<br/>ID: '+studentID+'<br/>Class: '+admission.class_applying, 'success', 4000);
  
  renderMain('admissions');
}

function showAdmissionStatistics(){
  const total = admissionsData.length;
  const approved = admissionsData.filter(a=>a.status==='Approved').length;
  const pending = admissionsData.filter(a=>a.status==='Pending').length;
  const rejected = admissionsData.filter(a=>a.status==='Rejected').length;
  const enrolled = admissionsData.filter(a=>a.status==='Enrolled').length;
  
  const byClass = {};
  admissionsData.forEach(a=>{
    byClass[a.class_applying] = (byClass[a.class_applying]||0)+1;
  });
  
  const maleCount = admissionsData.filter(a=>a.gender==='Male').length;
  const femaleCount = admissionsData.filter(a=>a.gender==='Female').length;
  
  const statusData = [
    {status:'Pending',count:pending,color:'var(--gold)',percentage:Math.round((pending/total)*100)},
    {status:'Approved',count:approved,color:'var(--success)',percentage:Math.round((approved/total)*100)},
    {status:'Enrolled',count:enrolled,color:'var(--blue-main)',percentage:Math.round((enrolled/total)*100)},
    {status:'Rejected',count:rejected,color:'var(--danger)',percentage:Math.round((rejected/total)*100)}
  ];
  
  let html = hdr('Admission Statistics Report','Comprehensive analysis of admission applications','Statistics');
  
  html += '<div class=\"stats-row\" style=\"margin-bottom:24px\">';
  html += statCard('<i class="fas fa-clipboard-list"></i>',total,'Total Applications','Academic Year 2025/2026','neu','si-blue');
  html += statCard('<i class="fas fa-hourglass-half"></i>',pending,'Pending Applications','Awaiting review','neu','si-gold');
  html += statCard('<i class="fas fa-check-circle"></i>',approved,'Approved Applications','Ready for enrollment','up','si-green');
  html += statCard('<i class="fas fa-book"></i>',enrolled,'Enrolled Students','Successfully enrolled','up','si-purple');
  html += '</div>';
  
  html += '<div class=\"g2 mb20\"><div class=\"card\"><div class=\"card-hdr\"><span class=\"card-title\"><i class=\"fas fa-chart-bar\"></i> Status Distribution</span></div><div style=\"padding:20px\">';
  statusData.forEach(s=>{
    const pct = Math.round((s.count/total)*100);
    html += '<div style=\"margin-bottom:16px\"><div style=\"display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px\"><span style=\"font-weight:600\">'+s.status+'</span><span style=\"color:var(--gray-500)\">'+s.count+' ('+pct+'%)</span></div>';
    html += '<div style=\"height:20px;background:var(--gray-100);border-radius:10px;overflow:hidden\"><div style=\"height:100%;background:'+s.color+';width:'+pct+'%;transition:width 0.3s\"></div></div></div>';
  });
  html += '</div></div>';
  
  html += '<div class=\"card\"><div class=\"card-hdr\"><span class=\"card-title\"><i class="fas fa-users"></i> Gender Breakdown</span></div><div style=\"padding:20px;text-align:center\">';
  html += '<div style=\"display:flex;gap:20px;justify-content:center;margin-bottom:16px\">';
  html += '<div><div style=\"font-size:28px;font-weight:700;color:var(--blue-main)\">'+maleCount+'</div><div style=\"font-size:12px;color:var(--gray-500);margin-top:4px\">Male Students</div><div style=\"font-size:11px;color:var(--gray-400);margin-top:4px\">'+Math.round((maleCount/total)*100)+'%</div></div>';
  html += '<div style=\"border-left:1px solid var(--gray-200)\"></div>';
  html += '<div><div style=\"font-size:28px;font-weight:700;color:var(--purple)\">'+femaleCount+'</div><div style=\"font-size:12px;color:var(--gray-500);margin-top:4px\">Female Students</div><div style=\"font-size:11px;color:var(--gray-400);margin-top:4px\">'+Math.round((femaleCount/total)*100)+'%</div></div>';
  html += '</div></div></div></div>';
  
  html += '<div class=\"card mb20\"><div class=\"card-hdr\"><span class=\"card-title\"><i class=\"fas fa-building\"></i> Applications by Class</span></div>';
  html += '<table class=\"tbl\" style=\"font-size:12px\"><thead><tr><th>Class</th><th>Applications</th><th>Percentage</th><th>Bar</th></tr></thead><tbody>';
  Object.entries(byClass).sort((a,b)=>b[1]-a[1]).forEach(([cls,count])=>{
    const pct = Math.round((count/total)*100);
    html += '<tr><td style=\"font-weight:600\">'+cls+'</td><td>'+count+'</td><td style=\"font-size:11px;color:var(--gray-500)\">'+pct+'%</td>';
    html += '<td><div style=\"height:6px;background:var(--gray-100);border-radius:3px;overflow:hidden;width:100px\"><div style=\"height:100%;background:var(--blue-main);width:'+pct+'%\"></div></div></td></tr>';
  });
  html += '</tbody></table></div>';
  
  html += '<div class=\"g2 mb20\"><div class=\"card\"><div class=\"card-hdr\"><span class=\"card-title\"><i class=\"fas fa-chart-line\"></i> Success Metrics</span></div><div style=\"padding:20px\">';
  html += '<div style=\"display:flex;align-items:center;padding:12px;background:var(--gray-50);border-radius:6px;margin-bottom:12px\"><div style=\"font-size:24px;color:var(--success)\"><i class=\"fas fa-check-circle\"></i></div><div style=\"flex:1;margin-left:12px\"><div style=\"font-size:12px;color:var(--gray-500)\">Approval Rate</div><div style=\"font-size:18px;font-weight:700;color:var(--success)\">'+Math.round((approved/total)*100)+'%</div></div></div>';
  html += '<div style=\"display:flex;align-items:center;padding:12px;background:var(--gray-50);border-radius:6px;margin-bottom:12px\"><div style=\"font-size:24px;color:var(--blue-main)\"><i class=\"fas fa-book\"></i></div><div style=\"flex:1;margin-left:12px\"><div style=\"font-size:12px;color:var(--gray-500)\">Enrollment Rate</div><div style=\"font-size:18px;font-weight:700;color:var(--blue-main)\">'+Math.round((enrolled/(approved||1))*100)+'%</div></div></div>';
  html += '<div style=\"display:flex;align-items:center;padding:12px;background:var(--gray-50);border-radius:6px;\"><div style=\"font-size:24px;color:var(--danger)\"><i class=\"fas fa-times-circle\"></i></div><div style=\"flex:1;margin-left:12px\"><div style=\"font-size:12px;color:var(--gray-500)\">Rejection Rate</div><div style=\"font-size:18px;font-weight:700;color:var(--danger)\">'+Math.round((rejected/total)*100)+'%</div></div></div>';
  html += '</div></div>';
  
  html += '<div class=\"card\"><div class=\"card-hdr\"><span class=\"card-title\"><i class=\"fas fa-calendar-alt\"></i> Academic Year</span></div><div style=\"padding:20px\"><div style=\"text-align:center;padding:20px\">';
  html += '<div style=\"font-size:32px;font-weight:700;color:var(--blue-dark)\">2025/2026</div><div style=\"font-size:12px;color:var(--gray-500);margin-top:8px\">Current Academic Year</div>';
  html += '<div style=\"display:flex;gap:8px;margin-top:16px;justify-content:center\"><span class=\"badge b-info\">'+total+' Applicants</span><span class=\"badge b-success\">'+enrolled+' Enrolled</span></div>';
  html += '</div></div></div></div>';
  
  html += '<div class=\"card\"><div class=\"card-hdr\"><span class=\"card-title\"><i class=\"fas fa-clipboard-list\"></i> Recent Activity</span></div>';
  html += '<table class=\"tbl\" style=\"font-size:11px\"><thead><tr><th>Date</th><th>Student</th><th>Status</th><th>Class</th><th>Action</th></tr></thead><tbody>';
  admissionsData.slice().reverse().slice(0,8).forEach((a)=>{
    const badgeClass = a.status==='Approved'?'b-success':(a.status==='Pending'?'b-warning':(a.status==='Enrolled'?'b-info':'b-danger'));
    html += '<tr><td style=\"color:var(--gray-500)\">'+a.created+'</td><td style=\"font-weight:600\">'+a.name+'</td><td><span class=\"badge '+badgeClass+'\">'+a.status+'</span></td><td style=\"font-size:10px\">'+a.class_applying+'</td><td><span style=\"font-size:10px;color:var(--gray-400)\">Applied on '+a.created+'</span></td></tr>';
  });
  html += '</tbody></table></div>';
  
  document.getElementById('main-content').innerHTML = html;
}

function previewAdmPicture(input){
  const preview = document.getElementById('adm-pic-preview');
  if(input.files && input.files[0]){
    const file = input.files[0];
    if(file.size > 5*1024*1024){
      alert('File size exceeds 5MB. Please choose a smaller image.');
      input.value = '';
      preview.innerHTML = '<i class="fas fa-camera" style="color:var(--gray-400)"></i>';
      return;
    }
    const reader = new FileReader();
    reader.onload = function(e){
      preview.innerHTML = '<img src="'+e.target.result+'" style="width:100%;height:100%;object-fit:cover">';
      window.admPictureData = e.target.result;
    };
    reader.readAsDataURL(file);
  }else{
    preview.innerHTML = '<i class="fas fa-camera" style="color:var(--gray-400)"></i>';
    window.admPictureData = null;
  }
}

// ═══════════════════════════════════
// REPORT GENERATION FUNCTIONS
// ═══════════════════════════════════
function printEnrollmentAttendanceReport(){
  const printWindow = window.open('', '', 'width=1000,height=800');
  const content = document.getElementById('main-content').innerHTML;
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Monthly Enrollment & Attendance Report</title>
      <style>
        body { font-family: Poppins, sans-serif; margin: 20px; color: #333; }
        .no-print { display: none; }
        @media print {
          body { margin: 0; }
          .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
          .stat-card { padding: 15px; border: 1px solid #ddd; border-radius: 8px; text-align: center; }
          .card { margin-bottom: 20px; border: 1px solid #ddd; border-radius: 8px; padding: 15px; }
          .card-hdr { font-weight: 700; margin-bottom: 12px; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
          th { background: #f5f5f5; font-weight: 700; }
          .btn { display: none; }
          .prog-bar { width: 100%; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden; }
          .prog-fill { height: 100%; }
          .g2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .g3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
          h1 { margin: 0 0 5px 0; font-size: 24px; }
          .hdr-sub { color: #666; font-size: 12px; margin-bottom: 20px; }
        }
      </style>
    </head>
    <body>
      <h1>Monthly Enrollment & Attendance Report</h1>
      <div class="hdr-sub">Generated on ${new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})} at ${new Date().toLocaleTimeString()}</div>
      ${content}
    </body>
    </html>
  `);
  printWindow.document.close();
  setTimeout(() => { printWindow.print(); }, 250);
}

function exportEnrollmentAttendanceToExcel(){
  const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const enrollmentData=[42,48,45,52,58,62,68,75,82,88,94,102];
  const attendanceData=[88,89,87,90,92,93,94,96,95,97,98,96];
  
  let csv = 'Monthly Enrollment & Attendance Report\n';
  csv += 'Generated: '+new Date().toLocaleDateString()+'\n\n';
  
  csv += 'Month,Enrollment,Attendance %,Performance\n';
  for(let i=0; i<months.length; i++){
    const perf = attendanceData[i]>=95?'Excellent':(attendanceData[i]>=90?'Very Good':'Good');
    csv += months[i]+','+enrollmentData[i]+','+attendanceData[i]+','+perf+'\n';
  }
  
  csv += '\n\nClass-wise Summary\n';
  csv += 'Class,Peak Enrollment,Average Attendance\n';
  csv += 'Form 1,35,92%\n';
  csv += 'Form 2,47,97%\n';
  csv += 'Form 3,20,98%\n';
  
  csv += '\n\nKey Metrics\n';
  csv += 'Metric,Value\n';
  csv += 'Total Enrollment Growth,42 to 102 (+142.9%)\n';
  csv += 'Attendance Improvement,88% to 96% (+9.1%)\n';
  csv += 'Monthly Average Enrollment,67.3 students\n';
  csv += 'Monthly Average Attendance,92.5%\n';
  csv += 'Highest Enrollment Month,December (102 students)\n';
  csv += 'Peak Attendance Month,October & November (97-98%)\n';
  
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'Enrollment_Attendance_Report_'+new Date().toISOString().slice(0,10)+'.csv');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> Report exported successfully!<br/>File: Enrollment_Attendance_Report_'+new Date().toISOString().slice(0,10)+'.csv', 'success', 4000);
}

function downloadEnrollmentAttendancePDF(){
  const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const enrollmentData=[42,48,45,52,58,62,68,75,82,88,94,102];
  const attendanceData=[88,89,87,90,92,93,94,96,95,97,98,96];
  
  let html = '<html><head><meta charset="UTF-8"><style>';
  html += 'body{font-family:Arial,sans-serif;margin:20px;color:#333}';
  html += 'h1{font-size:20px;margin:0 0 10px 0}h2{font-size:14px;margin:15px 0 10px 0;border-bottom:2px solid #0066cc;padding-bottom:5px}';
  html += 'table{width:100%;border-collapse:collapse;margin:10px 0}th,td{border:1px solid #ddd;padding:8px;text-align:left}';
  html += 'th{background:#0066cc;color:white;font-weight:bold}.stat{display:inline-block;width:23%;margin:1%;padding:10px;border:1px solid #ddd;text-align:center}';
  html += '.stat-val{font-size:20px;font-weight:bold;color:#0066cc}.stat-lbl{font-size:11px;color:#666}';
  html += '.page-break{page-break-after:always}';
  html += '</style></head><body>';
  
  html += '<h1><i class="fas fa-chart-bar"></i> Monthly Enrollment & Attendance Report</h1>';
  html += '<p style="color:#666;font-size:12px">Generated on '+new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})+'</p>';
  
  html += '<h2>Summary Metrics</h2>';
  html += '<div class="stat"><div class="stat-val">102</div><div class="stat-lbl">Current Enrollment</div></div>';
  html += '<div class="stat"><div class="stat-val">96%</div><div class="stat-lbl">Avg Attendance</div></div>';
  html += '<div class="stat"><div class="stat-val">3</div><div class="stat-lbl">Active Classes</div></div>';
  html += '<div class="stat"><div class="stat-val">842</div><div class="stat-lbl">Total Students</div></div>';
  
  html += '<h2>Monthly Breakdown</h2>';
  html += '<table><tr><th>Month</th><th>Enrollment</th><th>Attendance %</th><th>Performance</th></tr>';
  for(let i=0; i<months.length; i++){
    const perf = attendanceData[i]>=95?'Excellent':(attendanceData[i]>=90?'Very Good':'Good');
    html += '<tr><td>'+months[i]+'</td><td>'+enrollmentData[i]+'</td><td>'+attendanceData[i]+'%</td><td>'+perf+'</td></tr>';
  }
  html += '</table>';
  
  html += '<div class="page-break"></div>';
  html += '<h2>Class-wise Analysis</h2>';
  html += '<table><tr><th>Class</th><th>Peak Enrollment</th><th>Average Attendance</th></tr>';
  html += '<tr><td>Form 1</td><td>35 students</td><td>92%</td></tr>';
  html += '<tr><td>Form 2</td><td>47 students</td><td>97%</td></tr>';
  html += '<tr><td>Form 3</td><td>20 students</td><td>98%</td></tr>';
  html += '</table>';
  
  html += '<h2>Key Statistics</h2>';
  html += '<table>';
  html += '<tr><th>Metric</th><th>Value</th></tr>';
  html += '<tr><td>Enrollment Growth (Jan-Dec)</td><td>42 → 102 (+142.9%)</td></tr>';
  html += '<tr><td>Attendance Improvement</td><td>88% → 96% (+9.1%)</td></tr>';
  html += '<tr><td>Monthly Average Enrollment</td><td>67.3 students</td></tr>';
  html += '<tr><td>Monthly Average Attendance</td><td>92.5%</td></tr>';
  html += '</table>';
  
  html += '</body></html>';
  
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(html));
  element.setAttribute('download', 'Enrollment_Attendance_Report_'+new Date().toISOString().slice(0,10)+'.pdf.html');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> PDF generated!<br/>File: Enrollment_Attendance_Report_'+new Date().toISOString().slice(0,10)+'.pdf.html', 'success', 4000);
}

// ═══════════════════════════════════
// MONTHLY ENROLLMENT & ATTENDANCE REPORT
// ═══════════════════════════════════
function showMonthlyEnrollmentAttendanceReport(){
  const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const enrollmentData=[42,48,45,52,58,62,68,75,82,88,94,102];
  const attendanceData=[88,89,87,90,92,93,94,96,95,97,98,96];
  const classData={
    'Form 1':{enr:[12,14,13,16,18,20,22,25,28,30,32,35],att:[85,86,84,87,89,90,91,93,92,94,95,93]},
    'Form 2':{enr:[18,20,19,22,25,28,30,33,36,40,43,47],att:[88,89,87,91,93,94,95,97,96,98,99,97]},
    'Form 3':{enr:[12,14,13,14,15,14,16,17,18,18,19,20],att:[92,93,91,92,93,94,95,96,95,97,98,98]}
  };

  let html = hdr('<i class="fas fa-chart-bar"></i> Monthly Enrollment & Attendance Report','Comprehensive analysis of student enrollment and attendance trends','Report')+`
  <div class="stats-row">
    <div class="stat-card si-blue">
      <div class="stat-val">102</div>
      <div class="stat-lbl">Current Enrollment</div>
      <div class="stat-sub">+8 this month</div>
    </div>
    <div class="stat-card si-green">
      <div class="stat-val">96%</div>
      <div class="stat-lbl">Avg Attendance</div>
      <div class="stat-sub">+2% improvement</div>
    </div>
    <div class="stat-card si-gold">
      <div class="stat-val">3</div>
      <div class="stat-lbl">Active Classes</div>
      <div class="stat-sub">Forms 1–3</div>
    </div>
    <div class="stat-card si-purple">
      <div class="stat-val">842</div>
      <div class="stat-lbl">Total Students</div>
      <div class="stat-sub">All enrolled</div>
    </div>
  </div>

  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-line"></i> 12-Month Enrollment Trend</span></div>
      <div style="display:flex;gap:3px;align-items:flex-end;height:180px;padding:15px 10px;background:var(--gray-xlight);border-radius:8px">
        ${enrollmentData.map((v,i)=>`
        <div style="flex:1;display:flex;flex-direction:column;align-items:center">
          <div title="${months[i]}: ${v} students" style="width:100%;height:${v*1.5}px;background:linear-gradient(180deg,var(--blue-main),var(--blue-light));border-radius:3px 3px 0 0;opacity:.85;cursor:pointer;transition:opacity .2s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.85"></div>
          <div style="font-size:9px;color:var(--gray-500);margin-top:3px">${months[i].slice(0,3)}</div>
          <div style="font-size:9px;font-weight:600;color:var(--blue-dark)">${v}</div>
        </div>`).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-check-circle"></i> 12-Month Attendance Trend</span></div>
      <div style="display:flex;gap:3px;align-items:flex-end;height:160px;padding:15px 10px;background:var(--gray-xlight);border-radius:8px;overflow:hidden">
        ${attendanceData.map((v,i)=>`
        <div style="flex:1;display:flex;flex-direction:column;align-items:center">
          <div title="${months[i]}: ${v}% attendance" style="width:100%;height:${Math.round((v-85)*12)}px;background:linear-gradient(180deg,var(--success),var(--success-light));border-radius:3px 3px 0 0;opacity:.9;cursor:pointer;transition:opacity .2s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.9"></div>
          <div style="font-size:9px;color:var(--gray-500);margin-top:2px">${months[i].slice(0,3)}</div>
          <div style="font-size:9px;font-weight:600;color:var(--success)">${v}%</div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <div class="card mb20">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-bar"></i> Class-wise Enrollment & Attendance Breakdown</span></div>
    <div class="g3">
      ${Object.entries(classData).map(([cls,data])=>`
      <div style="padding:12px;border:1px solid var(--gray-200);border-radius:8px">
        <div style="font-weight:700;color:var(--blue-main);margin-bottom:10px">${cls}</div>
        <div style="margin-bottom:12px">
          <div style="font-size:11px;color:var(--gray-600);margin-bottom:4px">Enrollment: ${data.enr[11]} students (↑${data.enr[11]-data.enr[10]} this month)</div>
          <div class="prog-bar"><div class="prog-fill pf-blue" style="width:${(data.enr[11]/35)*100}%"></div></div>
        </div>
        <div>
          <div style="font-size:11px;color:var(--gray-600);margin-bottom:4px">Attendance: ${data.att[11]}%</div>
          <div class="prog-bar"><div class="prog-fill pf-green" style="width:${data.att[11]}%"></div></div>
        </div>
        <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--gray-100);font-size:10px;color:var(--gray-500)">
          <div>Peak: ${Math.max(...data.enr)} students</div>
          <div>Avg Att: ${Math.round(data.att.reduce((a,b)=>a+b,0)/data.att.length)}%</div>
        </div>
      </div>`).join('')}
    </div>
  </div>

  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-line"></i> Key Metrics</span></div>
      <div style="padding:12px 0">
        ${[
          ['Enrollment Growth','Jan→Dec','42 → 102 students','↑142.9%','success'],
          ['Attendance Improvement','Jan→Dec','88% → 96%','↑9.1%','success'],
          ['Monthly Avg Enrollment','2024/2025','67.3 students','Stable','info'],
          ['Monthly Avg Attendance','2024/2025','92.5%','Excellent','success'],
          ['Highest Enrollment Month','December','102 students','Peak term','gold'],
          ['Highest Attendance Month','October/Nov','97-98%','Peak performance','success']
        ].map(([label,period,value,change,color])=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--gray-100)">
          <div>
            <div style="font-weight:600;font-size:12px">${label}</div>
            <div style="font-size:10px;color:var(--gray-500)">${period}</div>
          </div>
          <div style="text-align:right">
            <div style="font-weight:700;color:var(--${color==='success'?'success':color==='danger'?'danger':'blue-main'})">${value}</div>
            <div style="font-size:10px;color:var(--${color==='success'?'success':color==='danger'?'danger':'gold'})">${change}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-clipboard-list"></i> Summary Statistics</span></div>
      <div style="padding:12px 0;font-size:12px">
        <div style="margin-bottom:14px">
          <div style="font-weight:700;color:var(--blue-main);margin-bottom:6px">Total Enrollment by Period</div>
          <table class="tbl" style="font-size:11px">
            <tr style="border-bottom:1px solid var(--gray-100)">
              <td style="padding:6px 0">Q1 (Jan-Mar)</td>
              <td style="text-align:right;font-weight:600">135 students</td>
              <td style="text-align:right;color:var(--gray-500)">44.4%</td>
            </tr>
            <tr style="border-bottom:1px solid var(--gray-100)">
              <td style="padding:6px 0">Q2 (Apr-Jun)</td>
              <td style="text-align:right;font-weight:600">172 students</td>
              <td style="text-align:right;color:var(--gray-500)">56.6%</td>
            </tr>
            <tr style="border-bottom:1px solid var(--gray-100)">
              <td style="padding:6px 0">Q3 (Jul-Sep)</td>
              <td style="text-align:right;font-weight:600">225 students</td>
              <td style="text-align:right;color:var(--gray-500)">74.0%</td>
            </tr>
            <tr>
              <td style="padding:6px 0">Q4 (Oct-Dec)</td>
              <td style="text-align:right;font-weight:600">274 students</td>
              <td style="text-align:right;color:var(--gray-500)">90.1%</td>
            </tr>
          </table>
        </div>
        <div>
          <div style="font-weight:700;color:var(--success);margin-bottom:6px">Attendance Quality</div>
          <table class="tbl" style="font-size:11px">
            <tr style="border-bottom:1px solid var(--gray-100)">
              <td style="padding:6px 0">Excellent (≥95%)</td>
              <td style="text-align:right;font-weight:600">7 months</td>
            </tr>
            <tr style="border-bottom:1px solid var(--gray-100)">
              <td style="padding:6px 0">Very Good (90-94%)</td>
              <td style="text-align:right;font-weight:600">4 months</td>
            </tr>
            <tr>
              <td style="padding:6px 0">Good (85-89%)</td>
              <td style="text-align:right;font-weight:600">1 month</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>

  <div class="card mb20">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-calendar-alt"></i> Monthly Detailed Breakdown</span></div>
    <table class="tbl">
      <thead>
        <tr style="background:var(--gray-xlight);font-weight:700">
          <th>Month</th>
          <th style="text-align:center">Enrollment</th>
          <th style="text-align:center">Monthly Change</th>
          <th style="text-align:center">Attendance %</th>
          <th style="text-align:center">Trend</th>
          <th>Performance</th>
        </tr>
      </thead>
      <tbody>
        ${enrollmentData.map((enr,i)=>{
          const prevEnr = i>0?enrollmentData[i-1]:42;
          const change = enr-prevEnr;
          const att = attendanceData[i];
          const trend = change>0?'<i class="fas fa-chart-line"></i>':change<0?'<i style="transform:rotate(90deg);display:inline-block" class="fas fa-chart-line"></i>':'<i class="fas fa-arrow-right"></i>';
          const perfColor = att>=95?'success':(att>=90?'blue-main':'warning');
          return `<tr>
            <td style="font-weight:600">${months[i]}</td>
            <td style="text-align:center;font-weight:600">${enr}</td>
            <td style="text-align:center;color:${change>0?'var(--success)':'var(--gray-500)'}">${change>0?'+'+change:change===0?'—':change}</td>
            <td style="text-align:center;font-weight:600;color:var(--${perfColor})">${att}%</td>
            <td style="text-align:center;font-size:16px">${trend}</td>
            <td><span class="badge b-${perfColor==='success'?'success':'info'}">${att>=95?'Excellent':att>=90?'Very Good':'Good'}</span></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>

  <div style="display:flex;gap:10px;padding:20px;background:var(--gray-xlight);border-radius:8px;margin-bottom:20px">
    <button class="btn btn-primary" onclick="printEnrollmentAttendanceReport()" style="cursor:pointer"><i class="fas fa-print"></i> Print Report</button>
    <button class="btn btn-secondary" onclick="exportEnrollmentAttendanceToExcel()" style="cursor:pointer"><i class="fas fa-download"></i> Export to Excel</button>
    <button class="btn btn-secondary" onclick="downloadEnrollmentAttendancePDF()" style="cursor:pointer"><i class="fas fa-file"></i> Download PDF</button>
  </div>`;

  document.getElementById('main-content').innerHTML = html;
}

// ═══════════════════════════════════
// STUDENTS MODULE
// ═══════════════════════════════════
// ═══════════════════════════════════
// STUDENT MANAGEMENT FUNCTIONS
// ═══════════════════════════════════
function showEnrollStudentForm(){
  let html = hdr('Enroll New Student','Add a student to the system','Students')+`
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-file-alt"></i> Student Enrollment Form</span></div>
    <div class="form-grid">
      <div class="form-field">
        <label>Full Name *</label>
        <input type="text" id="std-name" placeholder="Enter student full name">
      </div>
      <div class="form-field">
        <label>Date of Birth *</label>
        <input type="date" id="std-dob">
      </div>
      <div class="form-field">
        <label>Gender *</label>
        <select id="std-gender"><option>-- Select --</option><option>Male</option><option>Female</option></select>
      </div>
      <div class="form-field">
        <label>Class *</label>
        <select id="std-class"><option>-- Select Class --</option><option>Creche</option><option>Nursery</option><option>KG 1</option><option>KG 2</option><option>Basic 1</option><option>Basic 2</option><option>Basic 3</option><option>Basic 4</option><option>Basic 5</option><option>Basic 6</option><option>JHS 1</option><option>JHS 2</option><option>JHS 3</option></select>
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label>Address</label>
        <input type="text" id="std-address" placeholder="Residential address">
      </div>
      <div class="form-field">
        <label>Parent/Guardian Name</label>
        <input type="text" id="std-parent-name" placeholder="Parent or guardian name">
      </div>
      <div class="form-field">
        <label>Parent Phone</label>
        <input type="tel" id="std-parent-phone" placeholder="0244567890">
      </div>
      <div style="grid-column:1/-1;display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="submitStudentEnrollment()"><i class="fas fa-check"></i> Enroll Student</button>
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('students')">Cancel</button>
      </div>
    </div>
  </div>`;
  
  document.getElementById('main-content').innerHTML = html;
}

function submitStudentEnrollment(){
  const name = document.getElementById('std-name')?.value.trim();
  const dob = document.getElementById('std-dob')?.value;
  const gender = document.getElementById('std-gender')?.value;
  const studentClass = document.getElementById('std-class')?.value;
  const address = document.getElementById('std-address')?.value.trim();
  const parentName = document.getElementById('std-parent-name')?.value.trim();
  const parentPhone = document.getElementById('std-parent-phone')?.value.trim();
  
  if(!name || !dob || !gender || !studentClass){
    showToast('<i class=\"fas fa-times-circle\"></i> Please fill all required fields', 'error');
    return;
  }
  
  const studentId = '2024-' + String(enrolledStudents.length + 1000).slice(-4);
  const newStudent = {
    student_id: studentId,
    name: name,
    student_class: studentClass,
    gender: gender,
    dob: dob,
    attendance: '95%',
    gpa: '3.5',
    fees_status: 'Paid',
    status: 'Active',
    avatar_color: ['blue','gold','purple','green','teal'][Math.floor(Math.random()*5)],
    gender_abbr: gender==='Male'?'M':'F',
    address: address,
    parent_name: parentName,
    parent_phone: parentPhone,
    picture: null,
    enrolled_date: new Date().toISOString().split('T')[0]
  };
  
  enrolledStudents.push(newStudent);
  showToast('<i class="fas fa-check-circle"></i> Student enrolled!<br/>ID: '+studentId+'<br/>Name: '+name, 'success', 4000);
  
  setTimeout(() => {
    navTo('students');
  }, 2000);
}

function viewStudent(studentId){
  const student = enrolledStudents.find(s=>s.student_id===studentId);
  if(!student) return;
  
  let html = hdr('Student Profile','View student details and academic records','Students')+`
  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-user"></i> Personal Information</span></div>
      <div style="display:flex;gap:20px;margin-bottom:20px">
        <div class="av av-xl av-${student.avatar_color}">${student.name[0]}</div>
        <div style="flex:1">
          <div style="font-size:18px;font-weight:700;color:var(--blue-dark);margin-bottom:4px">${student.name}</div>
          <div style="font-size:12px;color:var(--gray-500);margin-bottom:12px">Student ID: <strong>${student.student_id}</strong></div>
          <div style="display:flex;gap:16px;font-size:12px;color:var(--gray-600)">
            <div><strong>Gender:</strong> ${student.gender}</div>
            <div><strong>DOB:</strong> ${student.dob}</div>
            <div><strong>Class:</strong> ${student.student_class}</div>
          </div>
        </div>
      </div>
      <hr style="border:none;border-top:1px solid var(--gray-200);margin:16px 0">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:12px">
        <div>
          <div style="color:var(--gray-500)">Address</div>
          <div style="font-weight:600;color:var(--gray-800)">${student.address || 'Not provided'}</div>
        </div>
        <div>
          <div style="color:var(--gray-500)">Enrolled Date</div>
          <div style="font-weight:600;color:var(--gray-800)">${student.enrolled_date}</div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-bar"></i> Academic Status</span></div>
      <div class="stats-row" style="grid-template-columns:repeat(2,1fr);gap:12px">
        ${[['<i class="fas fa-chart-line"></i>','GPA',student.gpa,'si-blue'],['<i class="fas fa-check-circle"></i>','Attendance',student.attendance,'si-green'],['<i class="fas fa-money-bill"></i>','Fees',student.fees_status,'si-'+({Paid:'green',Pending:'warning',Partial:'gold'}[student.fees_status]||'gray')],['<i class="fas fa-graduation-cap"></i>','Status',student.status,'si-info']].map(([ic,lbl,val,cls])=>'<div class="stat-card '+cls+'"><div class="stat-val">'+val+'</div><div class="stat-lbl">'+lbl+'</div></div>').join('')}
      </div>
    </div>
  </div>
  
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-users"></i> Parent/Guardian Information</span></div>
    <div style="display:flex;justify-content:space-between;font-size:12px">
      <div>
        <div style="color:var(--gray-500);margin-bottom:4px">Name</div>
        <div style="font-weight:600">${student.parent_name || 'Not provided'}</div>
      </div>
      <div>
        <div style="color:var(--gray-500);margin-bottom:4px">Phone</div>
        <div style="font-weight:600">${student.parent_phone || 'Not provided'}</div>
      </div>
    </div>
  </div>
  
  <div style="display:flex;gap:8px;margin-top:20px">
    <button class="btn btn-primary" onclick="editStudent('${studentId}')"><i class="fas fa-edit"></i> Edit</button>
    <button class="btn btn-secondary" onclick="navTo('students')">Back to Students</button>
  </div>`;
  
  document.getElementById('main-content').innerHTML = html;
}

function editStudent(studentId){
  const student = enrolledStudents.find(s=>s.student_id===studentId);
  if(!student) return;
  
  let html = hdr('Edit Student','Update student information','Students')+`
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-edit"></i> Edit Student Details</span></div>
    <div class="form-grid">
      <div class="form-field">
        <label>Full Name</label>
        <input type="text" id="edit-std-name" value="${student.name}">
      </div>
      <div class="form-field">
        <label>Class</label>
        <select id="edit-std-class">
          <option value="${student.student_class}" selected>${student.student_class}</option>
          <option>Form 1</option><option>Form 2</option><option>Form 3</option>
          <option>JHS 1</option><option>JHS 2</option><option>JHS 3</option>
        </select>
      </div>
      <div class="form-field">
        <label>Fees Status</label>
        <select id="edit-std-fees">
          <option value="${student.fees_status}" selected>${student.fees_status}</option>
          <option>Paid</option><option>Pending</option><option>Partial</option>
        </select>
      </div>
      <div class="form-field">
        <label>Status</label>
        <select id="edit-std-status">
          <option value="${student.status}" selected>${student.status}</option>
          <option>Active</option><option>Inactive</option><option>Suspended</option>
        </select>
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label>Address</label>
        <input type="text" id="edit-std-address" value="${student.address || ''}">
      </div>
      <div class="form-field">
        <label>Parent Name</label>
        <input type="text" id="edit-std-parent-name" value="${student.parent_name || ''}">
      </div>
      <div class="form-field">
        <label>Parent Phone</label>
        <input type="tel" id="edit-std-parent-phone" value="${student.parent_phone || ''}">
      </div>
      <div style="grid-column:1/-1;display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="saveStudentChanges('${studentId}')"><i class="fas fa-save"></i> Save Changes</button>
        <button class="btn btn-secondary" style="flex:1" onclick="viewStudent('${studentId}')">Cancel</button>
      </div>
    </div>
  </div>`;
  
  document.getElementById('main-content').innerHTML = html;
}

function saveStudentChanges(studentId){
  const student = enrolledStudents.find(s=>s.student_id===studentId);
  if(!student) return;
  
  student.name = document.getElementById('edit-std-name')?.value || student.name;
  student.student_class = document.getElementById('edit-std-class')?.value || student.student_class;
  student.fees_status = document.getElementById('edit-std-fees')?.value || student.fees_status;
  student.status = document.getElementById('edit-std-status')?.value || student.status;
  student.address = document.getElementById('edit-std-address')?.value || '';
  student.parent_name = document.getElementById('edit-std-parent-name')?.value || '';
  student.parent_phone = document.getElementById('edit-std-parent-phone')?.value || '';
  
  showToast('<i class="fas fa-check-circle"></i> Student details updated!<br/>Name: '+student.name, 'success', 3000);
  
  setTimeout(() => {
    viewStudent(studentId);
  }, 1500);
}

function importStudentsCSV(){
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if(file){
      showToast('<i class="fas fa-check-circle"></i> CSV imported!<br/>' + file.name, 'success');
      navTo('students');
    }
  };
  input.click();
}

function exportStudentsData(){
  let csv = 'Student ID,Name,Class,Gender,DOB,Attendance,GPA,Fees,Status,Address,Parent,Phone,Enrolled Date\n';
  enrolledStudents.forEach((s)=>{
    csv += s.student_id+','+s.name+','+s.student_class+','+s.gender+','+s.dob+','+s.attendance+','+s.gpa+','+s.fees_status+','+s.status+','+s.address+','+s.parent_name+','+s.parent_phone+','+s.enrolled_date+'\n';
  });
  
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'Students_Data_'+new Date().toISOString().slice(0,10)+'.csv');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> Students data exported!<br/>File: Students_Data_' + new Date().toISOString().slice(0, 10) + '.csv', 'success', 3000);
}

// ═══════════════════════════════════
// STUDENTS MODULE
// ═══════════════════════════════════
// ═══════════════════════════════════
// STUDENT FILTERING & SEARCH
// ═══════════════════════════════════
function filterStudents(){
  const searchInput = document.getElementById('student-search');
  const searchText = (searchInput ? searchInput.value : '').toLowerCase();
  const classFilter = document.getElementById('student-class-filter');
  const selectedClass = classFilter ? classFilter.value : 'All Classes';
  const statusFilter = document.getElementById('student-status-filter');
  const selectedStatus = statusFilter ? statusFilter.value : 'All Status';
  
  let filtered = enrolledStudents.filter((s)=>{
    const matchSearch = !searchText || s.name.toLowerCase().includes(searchText) || 
                        s.student_id.toLowerCase().includes(searchText) ||
                        (s.parent_name && s.parent_name.toLowerCase().includes(searchText));
    const matchClass = selectedClass === 'All Classes' || s.student_class === selectedClass;
    const matchStatus = selectedStatus === 'All Status' || s.status === selectedStatus;
    
    return matchSearch && matchClass && matchStatus;
  });
  
  updateStudentTable(filtered);
}

function updateStudentTable(students){
  const tbody = document.querySelector('table.tbl tbody');
  if(!tbody) return;
  
  if(students.length === 0){
    tbody.innerHTML = '<tr><td colspan="11" style="text-align:center;padding:30px;color:var(--gray-400)">No students found</td></tr>';
    return;
  }
  
  tbody.innerHTML = students.map((s,i)=>'<tr><td style="color:var(--gray-400);font-size:11px">'+(i+1)+'</td><td><div style="display:flex;align-items:center;gap:9px"><div class="av av-sm av-'+s.avatar_color+'">'+s.name[0]+'</div><span style="font-weight:600">'+s.name+'</span></div></td><td style="font-size:11px;color:var(--gray-400)">'+s.student_id+'</td><td>'+s.student_class+'</td><td><span class="badge '+((s.gender_abbr==='F')?'b-purple':'b-info')+'">'+s.gender+'</span></td><td style="font-size:11px;color:var(--gray-500)">'+s.dob+'</td><td style="font-weight:600;color:'+(parseFloat(s.attendance)>=90?'var(--success)':'var(--warning)')+'">'+(s.attendance)+'</td><td style="font-weight:700;color:var(--blue-dark)">'+s.gpa+'</td><td><span class="badge '+(s.fees_status==='Paid'?'b-success':(s.fees_status==='Pending'?'b-danger':'b-warning'))+'">'+s.fees_status+'</span></td><td><span class="badge b-success">'+s.status+'</span></td><td><div style="display:flex;gap:4px"><button class="btn btn-secondary btn-xs" onclick="viewStudent(\''+s.student_id+'\')">View</button><button class="btn btn-primary btn-xs" onclick="editStudent(\''+s.student_id+'\')">Edit</button><button class="btn btn-danger btn-xs" onclick="deleteRecord(\''+s.student_id+'\', \'Student\')">Del</button></div></td></tr>').join('');
}

// ═══════════════════════════════════
// STUDENTS MODULE
// ═══════════════════════════════════
function studentsModule(){
  const html = hdr('Students Module','Manage all student records, enrollment and academic data','Students')+`
  <div class="toolbar">
    <button class="btn btn-secondary" onclick="importStudentsCSV()" style="cursor:pointer"><i class="fas fa-upload"></i> Import CSV</button>
    <button class="btn btn-secondary" onclick="exportStudentsData()" style="cursor:pointer"><i class="fas fa-download"></i> Export</button>
    <div class="search-bar"><span><i class="fas fa-search"></i></span><input id="student-search" placeholder="Search students..." onkeyup="filterStudents()" style="cursor:text"></div>
    <select id="student-class-filter" class="select-sm" onchange="filterStudents()"><option value="All Classes">All Classes</option><option>Creche</option><option>Nursery</option><option>KG 1</option><option>KG 2</option><option>Basic 1</option><option>Basic 2</option><option>Basic 3</option><option>Basic 4</option><option>Basic 5</option><option>Basic 6</option><option>JHS 1</option><option>JHS 2</option><option>JHS 3</option></select>
    <select id="student-status-filter" class="select-sm" onchange="filterStudents()"><option value="All Status">All Status</option><option>Active</option><option>Inactive</option><option>Suspended</option></select>
  </div>
  <div class="card">
    <table class="tbl">
      <thead><tr><th>#</th><th>Student</th><th>Roll No.</th><th>Class</th><th>Gender</th><th>DOB</th><th>Attendance</th><th>GPA</th><th>Fees</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${enrolledStudents.map((s,i)=>'<tr><td style="color:var(--gray-400);font-size:11px">'+(i+1)+'</td><td><div style="display:flex;align-items:center;gap:9px"><div class="av av-sm av-'+s.avatar_color+'">'+s.name[0]+'</div><span style="font-weight:600">'+s.name+'</span></div></td><td style="font-size:11px;color:var(--gray-400)">'+s.student_id+'</td><td>'+s.student_class+'</td><td><span class="badge '+((s.gender_abbr==='F')?'b-purple':'b-info')+'">'+s.gender+'</span></td><td style="font-size:11px;color:var(--gray-500)">'+s.dob+'</td><td style="font-weight:600;color:'+(parseFloat(s.attendance)>=90?'var(--success)':'var(--warning)')+'">'+(s.attendance)+'</td><td style="font-weight:700;color:var(--blue-dark)">'+s.gpa+'</td><td><span class="badge '+(s.fees_status==='Paid'?'b-success':(s.fees_status==='Pending'?'b-danger':'b-warning'))+'">'+s.fees_status+'</span></td><td><span class="badge b-success">'+s.status+'</span></td><td><div style="display:flex;gap:4px"><button class="btn btn-secondary btn-xs" onclick="viewStudent(\''+s.student_id+'\')">View</button><button class="btn btn-primary btn-xs" onclick="editStudent(\''+s.student_id+'\')">Edit</button><button class="btn btn-danger btn-xs" onclick="deleteRecord(\''+s.student_id+'\', \'Student\')">Del</button></div></td></tr>').join('')}
      </tbody>
    </table>
    ${paginationHtml()}
  </div>`;
  
  return html;
}

// ═══════════════════════════════════
// TEACHER MANAGEMENT FUNCTIONS
// ═══════════════════════════════════
function showAddTeacherForm(){
  let html = hdr('Add New Teacher','Register a new teacher in the system','Teachers')+`
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-file-alt"></i> Teacher Registration Form</span></div>
    <div class="form-grid">
      <div class="form-field">
        <label>Full Name *</label>
        <input type="text" id="tchr-name" placeholder="Enter full name">
      </div>
      <div class="form-field">
        <label>Gender *</label>
        <select id="tchr-gender"><option>-- Select --</option><option>Male</option><option>Female</option></select>
      </div>
      <div class="form-field">
        <label>Date of Birth *</label>
        <input type="date" id="tchr-dob">
      </div>
      <div class="form-field">
        <label>Email *</label>
        <input type="email" id="tchr-email" placeholder="teacher@school.edu.gh">
      </div>
      <div class="form-field">
        <label>Phone *</label>
        <input type="tel" id="tchr-phone" placeholder="+233 24 000 0000">
      </div>
      <div class="form-field">
        <label>Subject/Stream *</label>
        <input type="text" id="tchr-subject" placeholder="e.g., Mathematics, English Language">
      </div>
      <div class="form-field">
        <label>Department *</label>
        <select id="tchr-department"><option>-- Select --</option><option>Mathematics</option><option>Sciences</option><option>Languages</option></select>
      </div>
      <div class="form-field">
        <label>Years of Experience *</label>
        <input type="number" id="tchr-experience" placeholder="e.g., 5">
      </div>
      <div class="form-field">
        <label>Class Assignment</label>
        <select id="tchr-class"><option>Not Assigned</option><option>Creche</option><option>Nursery</option><option>KG 1</option><option>KG 2</option><option>Basic 1</option><option>Basic 2</option><option>Basic 3</option><option>Basic 4</option><option>Basic 5</option><option>Basic 6</option><option>JHS 1</option><option>JHS 2</option><option>JHS 3</option></select>
      </div>
      <div class="form-field">
        <label>Hiring Date</label>
        <input type="date" id="tchr-hiring-date">
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label><i class="fas fa-camera"></i> Profile Picture (Optional)</label>
        <input type="file" id="tchr-picture" accept="image/*" placeholder="Upload teacher picture" onchange="previewTeacherPicture(this)">
        <div id="tchr-picture-preview" style="margin-top:12px;display:none">
          <img id="tchr-pic-img" style="max-width:150px;max-height:150px;border-radius:8px;border:2px solid var(--blue-pale)">
          <p style="font-size:11px;color:var(--gray-500);margin-top:8px">Picture selected ✓</p>
        </div>
      </div>
      <div style="grid-column:1/-1;display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="submitTeacherForm()"><i class="fas fa-check-circle"></i> Register Teacher</button>
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('teachers')">Cancel</button>
      </div>
    </div>
  </div>`;
  
  document.getElementById('main-content').innerHTML = html;
}

function previewTeacherPicture(input){
  const preview = document.getElementById('tchr-picture-preview');
  const img = document.getElementById('tchr-pic-img');
  
  if(input.files && input.files[0]){
    const file = input.files[0];
    
    if(file.size > 5242880){
      showToast('<i class=\"fas fa-times-circle\"></i> Picture must be less than 5MB', 'error');
      input.value = '';
      preview.style.display = 'none';
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
      preview.style.display = 'block';
      input.dataset.base64 = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function submitTeacherForm(){
  const name = document.getElementById('tchr-name')?.value.trim();
  const gender = document.getElementById('tchr-gender')?.value;
  const dob = document.getElementById('tchr-dob')?.value;
  const email = document.getElementById('tchr-email')?.value.trim();
  const phone = document.getElementById('tchr-phone')?.value.trim();
  const subject = document.getElementById('tchr-subject')?.value.trim();
  const department = document.getElementById('tchr-department')?.value;
  const experience = document.getElementById('tchr-experience')?.value.trim();
  const classAssignment = document.getElementById('tchr-class')?.value;
  const hireDate = document.getElementById('tchr-hiring-date')?.value;
  const pictureInput = document.getElementById('tchr-picture');
  const picture = pictureInput?.dataset.base64 || null;
  
  if(!name || !gender || !dob || !email || !phone || !subject || !department || !experience){
    showToast('<i class="fas fa-times-circle"></i> Please fill all required fields', 'error');
    return;
  }
  
  const teacherId = 'T' + String(teachersData.length + 1).padStart(3, '0');
  const newTeacher = {
    teacher_id: teacherId,
    name: name,
    subject: subject,
    department: department,
    experience: experience,
    class_assigned: classAssignment || 'Not Assigned',
    gender: gender,
    avatar_color: ['blue','gold','purple','green','teal'][Math.floor(Math.random()*5)],
    phone: phone,
    email: email,
    dob: dob,
    schedule: 'To be assigned',
    hiring_date: hireDate || new Date().toISOString().split('T')[0],
    status: 'Active',
    picture: picture
  };
  
  teachersData.push(newTeacher);
  showToast('<i class="fas fa-check-circle"></i> Teacher registered!<br/>ID: ' + teacherId + '<br/>Name: ' + name, 'success', 4000);
  
  setTimeout(() => {
    navTo('teachers');
  }, 2000);
}

function viewTeacherProfile(teacherId){
  const teacher = teachersData.find(t=>t.teacher_id===teacherId);
  if(!teacher) return;
  
  let html = hdr('Teacher Profile','View teacher details and assignments','Teachers')+`
  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-user"></i> Personal Information</span></div>
      <div style="display:flex;gap:20px;margin-bottom:20px">
        ${teacher.picture ? '<img src="'+teacher.picture+'" style="width:120px;height:120px;border-radius:8px;object-fit:cover;border:2px solid var(--blue-pale)">' : '<div class="av av-xl av-'+teacher.avatar_color+'">'+(teacher.gender==='Female'?'<i class="fas fa-user"></i>':'<i class="fas fa-user"></i>')+'</div>'}
        <div style="flex:1">
          <div style="font-size:18px;font-weight:700;color:var(--blue-dark);margin-bottom:4px">${teacher.name}</div>
          <div style="font-size:12px;color:var(--gray-500);margin-bottom:12px">Teacher ID: <strong>${teacher.teacher_id}</strong></div>
          <div style="display:flex;gap:16px;font-size:12px;color:var(--gray-600)">
            <div><strong>Gender:</strong> ${teacher.gender}</div>
            <div><strong>DOB:</strong> ${teacher.dob}</div>
          </div>
        </div>
      </div>
      <hr style="border:none;border-top:1px solid var(--gray-200);margin:16px 0">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:12px">
        <div>
          <div style="color:var(--gray-500)">Phone</div>
          <div style="font-weight:600;color:var(--gray-800)">${teacher.phone}</div>
        </div>
        <div>
          <div style="color:var(--gray-500)">Email</div>
          <div style="font-weight:600;color:var(--gray-800)">${teacher.email}</div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-bar"></i> Professional Information</span></div>
      <div class="stats-row" style="grid-template-columns:repeat(2,1fr);gap:12px">
        ${[['<i class="fas fa-book"></i>','Subject',teacher.subject,'si-blue'],['<i class="fas fa-building"></i>','Department',teacher.department,'si-green'],['<i class="fas fa-hourglass-half"></i>','Experience',teacher.experience+' years','si-gold'],['<i class="fas fa-graduation-cap"></i>','Class',teacher.class_assigned,'si-purple']].map(([ic,lbl,val,cls])=>'<div class="stat-card '+cls+'"><div class="stat-val">'+val+'</div><div class="stat-lbl">'+lbl+'</div></div>').join('')}
      </div>
    </div>
  </div>
  
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-calendar-alt"></i> Work Schedule & Status</span></div>
    <div style="display:flex;justify-content:space-between;font-size:12px">
      <div>
        <div style="color:var(--gray-500);margin-bottom:4px">Schedule</div>
        <div style="font-weight:600">${teacher.schedule}</div>
      </div>
      <div>
        <div style="color:var(--gray-500);margin-bottom:4px">Hired</div>
        <div style="font-weight:600">${teacher.hiring_date}</div>
      </div>
      <div>
        <div style="color:var(--gray-500);margin-bottom:4px">Status</div>
        <span class="badge b-success">${teacher.status}</span>
      </div>
    </div>
  </div>
  
  <div style="display:flex;gap:8px;margin-top:20px">
    <button class="btn btn-primary" onclick="editTeacher('${teacherId}')"><i class="fas fa-edit"></i> Edit</button>
    <button class="btn btn-danger" onclick="deleteRecord('${teacherId}', 'Teacher')"><i class="fas fa-trash"></i> Delete</button>
    <button class="btn btn-secondary" onclick="navTo('teachers')">Back</button>
  </div>`;
  
  document.getElementById('main-content').innerHTML = html;
}

function editTeacher(teacherId){
  const teacher = teachersData.find(t=>t.teacher_id===teacherId);
  if(!teacher) return;
  
  let html = hdr('Edit Teacher','Update teacher information','Teachers')+`
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-edit"></i> Edit Teacher Details</span></div>
    <div class="form-grid">
      <div class="form-field">
        <label>Full Name *</label>
        <input type="text" id="edit-tchr-name" value="${teacher.name}">
      </div>
      <div class="form-field">
        <label>Gender *</label>
        <select id="edit-tchr-gender"><option value="Male" ${teacher.gender==='Male'?'selected':''}>Male</option><option value="Female" ${teacher.gender==='Female'?'selected':''}>Female</option></select>
      </div>
      <div class="form-field">
        <label>Date of Birth *</label>
        <input type="date" id="edit-tchr-dob" value="${teacher.dob}">
      </div>
      <div class="form-field">
        <label>Email *</label>
        <input type="email" id="edit-tchr-email" value="${teacher.email}">
      </div>
      <div class="form-field">
        <label>Phone *</label>
        <input type="tel" id="edit-tchr-phone" value="${teacher.phone}">
      </div>
      <div class="form-field">
        <label>Subject/Stream *</label>
        <input type="text" id="edit-tchr-subject" value="${teacher.subject}">
      </div>
      <div class="form-field">
        <label>Department *</label>
        <select id="edit-tchr-department"><option value="Mathematics" ${teacher.department==='Mathematics'?'selected':''}>Mathematics</option><option value="Sciences" ${teacher.department==='Sciences'?'selected':''}>Sciences</option><option value="Languages" ${teacher.department==='Languages'?'selected':''}>Languages</option></select>
      </div>
      <div class="form-field">
        <label>Years of Experience *</label>
        <input type="number" id="edit-tchr-experience" value="${teacher.experience}">
      </div>
      <div class="form-field">
        <label>Class Assignment</label>
        <select id="edit-tchr-class"><option value="Not Assigned" ${teacher.class_assigned==='Not Assigned'?'selected':''}>Not Assigned</option><option value="Creche" ${teacher.class_assigned==='Creche'?'selected':''}>Creche</option><option value="Nursery" ${teacher.class_assigned==='Nursery'?'selected':''}>Nursery</option><option value="KG 1" ${teacher.class_assigned==='KG 1'?'selected':''}>KG 1</option><option value="KG 2" ${teacher.class_assigned==='KG 2'?'selected':''}>KG 2</option><option value="Basic 1" ${teacher.class_assigned==='Basic 1'?'selected':''}>Basic 1</option><option value="Basic 2" ${teacher.class_assigned==='Basic 2'?'selected':''}>Basic 2</option><option value="Basic 3" ${teacher.class_assigned==='Basic 3'?'selected':''}>Basic 3</option><option value="Basic 4" ${teacher.class_assigned==='Basic 4'?'selected':''}>Basic 4</option><option value="Basic 5" ${teacher.class_assigned==='Basic 5'?'selected':''}>Basic 5</option><option value="Basic 6" ${teacher.class_assigned==='Basic 6'?'selected':''}>Basic 6</option><option value="JHS 1" ${teacher.class_assigned==='JHS 1'?'selected':''}>JHS 1</option><option value="JHS 2" ${teacher.class_assigned==='JHS 2'?'selected':''}>JHS 2</option><option value="JHS 3" ${teacher.class_assigned==='JHS 3'?'selected':''}>JHS 3</option></select>
      </div>
      <div class="form-field">
        <label>Hiring Date</label>
        <input type="date" id="edit-tchr-hiring-date" value="${teacher.hiring_date}">
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label><i class="fas fa-camera"></i> Profile Picture (Optional)</label>
        <input type="file" id="edit-tchr-picture" accept="image/*" onchange="previewEditTeacherPicture(this)">
        ${teacher.picture ? '<div style="margin-top:12px"><img src="'+teacher.picture+'" style="max-width:150px;max-height:150px;border-radius:8px;border:2px solid var(--blue-pale)"><p style="font-size:11px;color:var(--gray-500);margin-top:8px">Current picture</p></div>' : '<p style="font-size:11px;color:var(--gray-400);margin-top:4px">No picture yet</p>'}
        <div id="edit-tchr-picture-preview" style="margin-top:12px;display:none">
          <img id="edit-tchr-pic-img" style="max-width:150px;max-height:150px;border-radius:8px;border:2px solid var(--blue-pale)">
          <p style="font-size:11px;color:var(--gray-500);margin-top:8px">New picture selected ✓</p>
        </div>
      </div>
      <div style="grid-column:1/-1;display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="saveTeacherChanges('${teacherId}')"><i class="fas fa-save"></i> Save Changes</button>
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('teachers')">Cancel</button>
      </div>
    </div>
  </div>`;
  
  document.getElementById('main-content').innerHTML = html;
}

function previewEditTeacherPicture(input){
  const preview = document.getElementById('edit-tchr-picture-preview');
  const img = document.getElementById('edit-tchr-pic-img');
  
  if(input.files && input.files[0]){
    const file = input.files[0];
    
    if(file.size > 5242880){
      showToast('<i class="fas fa-times-circle"></i> Picture must be less than 5MB', 'error');
      input.value = '';
      preview.style.display = 'none';
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
      preview.style.display = 'block';
      input.dataset.base64 = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function saveTeacherChanges(teacherId){
  const teacher = teachersData.find(t=>t.teacher_id===teacherId);
  if(!teacher) return;
  
  const name = document.getElementById('edit-tchr-name')?.value.trim();
  const gender = document.getElementById('edit-tchr-gender')?.value;
  const dob = document.getElementById('edit-tchr-dob')?.value;
  const email = document.getElementById('edit-tchr-email')?.value.trim();
  const phone = document.getElementById('edit-tchr-phone')?.value.trim();
  const subject = document.getElementById('edit-tchr-subject')?.value.trim();
  const department = document.getElementById('edit-tchr-department')?.value;
  const experience = document.getElementById('edit-tchr-experience')?.value.trim();
  const classAssignment = document.getElementById('edit-tchr-class')?.value;
  const hireDate = document.getElementById('edit-tchr-hiring-date')?.value;
  const pictureInput = document.getElementById('edit-tchr-picture');
  const newPicture = pictureInput?.dataset.base64;
  
  if(!name || !gender || !dob || !email || !phone || !subject || !department || !experience){
    showToast('<i class="fas fa-times-circle"></i> Please fill all required fields', 'error');
    return;
  }
  
  teacher.name = name;
  teacher.gender = gender;
  teacher.dob = dob;
  teacher.email = email;
  teacher.phone = phone;
  teacher.subject = subject;
  teacher.department = department;
  teacher.experience = experience;
  teacher.class_assigned = classAssignment;
  teacher.hiring_date = hireDate;
  if(newPicture) teacher.picture = newPicture;
  
  showToast('<i class="fas fa-check-circle"></i> Teacher updated!<br/>Name: '+name, 'success', 3000);
  
  setTimeout(() => {
    navTo('teachers');
  }, 2000);
}

function importTeachersCSV(){
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv';
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target.result;
      const lines = csv.split('\n');
      let imported = 0;
      
      for(let i=1; i<lines.length; i++) {
        if(!lines[i].trim()) continue;
        const [name,subject,dept,exp,classAsg,phone,email] = lines[i].split(',').map(x=>x.trim());
        
        if(name && subject && dept && exp) {
          const teacherId = 'T' + String(teachersData.length + 1).padStart(3, '0');
          teachersData.push({
            teacher_id: teacherId,
            name: name,
            subject: subject,
            department: dept,
            experience: exp,
            class_assigned: classAsg || 'Not Assigned',
            gender: 'Not specified',
            avatar_color: 'blue',
            phone: phone || 'N/A',
            email: email || 'N/A',
            dob: '2000-01-01',
            schedule: 'To be assigned',
            hiring_date: new Date().toISOString().split('T')[0],
            status: 'Active'
          });
          imported++;
        }
      }
      
      showToast('<i class="fas fa-check-circle"></i> Imported '+imported+' teachers from CSV!', 'success', 3000);
      navTo('teachers');
    };
    reader.readAsText(file);
  };
  input.click();
}

function exportTeachersData(){
  let csv = 'Teacher ID,Name,Subject,Department,Experience,Class,Gender,Phone,Email,DOB,Hired Date,Status\n';
  
  teachersData.forEach((t) => {
    csv += `${t.teacher_id},"${t.name}",${t.subject},${t.department},${t.experience},${t.class_assigned},${t.gender},${t.phone},${t.email},${t.dob},${t.hiring_date},${t.status}\n`;
  });
  
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'Teachers_Data_'+new Date().toISOString().slice(0,10)+'.csv');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> Teachers data exported!<br/>File: Teachers_Data_'+new Date().toISOString().slice(0,10)+'.csv', 'success', 3000);
}

// Message a teacher (for students only)
function messageTeacher(teacherId, teacherName){
  const teacher = teachersData.find(t=>t.teacher_id===teacherId);
  if(!teacher) return;
  
  let html = hdr('Message '+teacherName,'Send a message to your teacher','Teachers')+`
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-envelope"></i> Send Message to ${teacherName}</span></div>
    <div style="margin-bottom:16px;padding:12px;background:var(--blue-xpale);border-radius:var(--radius);border:1px solid var(--blue-light)">
      <div style="font-size:11px;color:var(--gray-600);margin-bottom:4px"><i class="fas fa-info-circle"></i> Teacher Info</div>
      <div style="font-size:12px;color:var(--blue-dark)">
        <strong>${teacher.name}</strong> · ${teacher.subject}<br>
        <small>Email: ${teacher.email} | Phone: ${teacher.phone}</small>
      </div>
    </div>
    <div class="form-grid">
      <div class="form-field" style="grid-column:1/-1">
        <label>Subject *</label>
        <input type="text" id="msg-subject" placeholder="e.g., Question about Mathematics assignment">
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label>Message *</label>
        <textarea id="msg-content" placeholder="Type your message here..." style="min-height:200px;resize:vertical"></textarea>
      </div>
      <div style="grid-column:1/-1;display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="sendTeacherMessage('${teacherId}', '${teacherName}')"><i class="fas fa-paper-plane"></i> Send Message</button>
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('teachers')">Cancel</button>
      </div>
    </div>
  </div>`;
  
  document.getElementById('main-content').innerHTML = html;
}

// Send message to teacher (placeholder function)
function sendTeacherMessage(teacherId, teacherName){
  const subject = document.getElementById('msg-subject').value.trim();
  const content = document.getElementById('msg-content').value.trim();
  
  if(!subject || !content){
    showToast('<i class="fas fa-exclamation-circle"></i> Please fill in all fields', 'error', 3000);
    return;
  }
  
  showToast('<i class="fas fa-check-circle"></i> Message sent to '+teacherName+'!<br/>Your teacher will respond soon.', 'success', 3000);
  setTimeout(() => navTo('teachers'), 1500);
}

function filterTeachers(){
  const searchInput = document.getElementById('teacher-search');
  const searchText = (searchInput ? searchInput.value : '').toLowerCase();
  const deptFilter = document.getElementById('teacher-dept-filter');
  const selectedDept = deptFilter ? deptFilter.value : 'All Departments';
  
  let filtered = teachersData.filter((t)=>{
    const matchSearch = !searchText || t.name.toLowerCase().includes(searchText) || 
                        t.subject.toLowerCase().includes(searchText) ||
                        t.email.toLowerCase().includes(searchText);
    const matchDept = selectedDept === 'All Departments' || t.department === selectedDept;
    
    return matchSearch && matchDept;
  });
  
  updateTeacherCards(filtered);
}

function updateTeacherCards(teachers){
  const container = document.querySelector('.g3');
  if(!container) return;
  
  if(teachers.length === 0){
    container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray-400)">No teachers found</div>';
    return;
  }
  
  container.innerHTML = teachers.map((t)=>`
    <div class="card" style="cursor:pointer">
      <div style="display:flex;gap:14px;margin-bottom:14px">
        <div class="av av-lg av-${t.avatar_color}">${t.gender==='Female'?'<i class="fas fa-user"></i>':'<i class="fas fa-user"></i>'}</div>
        <div>
          <div style="font-size:14px;font-weight:700;color:var(--blue-dark)">${t.name}</div>
          <div style="font-size:11px;color:var(--gray-500)">${t.subject}</div>
          <span class="badge b-info" style="margin-top:6px;font-size:9px">${t.experience} yrs exp</span>
        </div>
      </div>
      <div style="font-size:11px;color:var(--gray-500);margin-bottom:8px"><i class="fas fa-users"></i> ${t.class_assigned} Class Teacher</div>
      <div style="font-size:10px;color:var(--gray-400);margin-bottom:12px"><i class="fas fa-calendar-alt"></i> ${t.schedule}</div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-secondary btn-xs" style="flex:1" onclick="viewTeacherProfile('${t.teacher_id}')">View Profile</button>
        <button class="btn btn-primary btn-xs" style="flex:1" onclick="editTeacher('${t.teacher_id}')">Edit</button>
      </div>
    </div>`).join('');
}

// TEACHERS MODULE
// ═══════════════════════════════════
function teachersModule(){
  const isStudent = currentRole === 'Student';
  const studentClass = isStudent ? 'JHS 1' : null;
  
  // For students, filter teachers to only show:
  // 1. Teachers of subjects they're taking
  // 2. Their form class teacher
  let filteredTeachers = teachersData;
  if (isStudent) {
    // Find the class teacher for student's class using classesData
    const classInfo = classesData.find(c => c.name === studentClass);
    const classTeacherId = classInfo ? classInfo.teacher_id : null;
    
    // Find subject teacher IDs for classes that match student's class
    const subjectTeacherIds = new Set();
    subjectsData.forEach(s => {
      if (s.teacher_id && s.classes) {
        // Check if class is compatible (handles "All Forms", "JHS 1-3", etc.)
        const classes = s.classes.toLowerCase();
        const classNum = parseInt(studentClass.split(' ')[1]) || 0;
        
        let isMatch = false;
        if (classes === 'all forms') {
          isMatch = true;
        } else if (classes.includes('jhs') && classNum >= 1 && classNum <= 3) {
          if (classes.includes('-')) {
            const matches = classes.match(/\d+/g) || [];
            if (matches.length >= 2) {
              const start = parseInt(matches[0]);
              const end = parseInt(matches[1]);
              isMatch = classNum >= start && classNum <= end;
            }
          } else {
            isMatch = classes.includes(`${classNum}`);
          }
        }
        
        if (isMatch) {
          subjectTeacherIds.add(s.teacher_id);
        }
      }
    });
    
    filteredTeachers = teachersData.filter(t => {
      // Check if teacher is the class teacher for student's class
      const isClassTeacher = classTeacherId && t.teacher_id === classTeacherId;
      
      // Check if teacher teaches a subject in student's class
      const teachesSubject = subjectTeacherIds.has(t.teacher_id);
      
      return isClassTeacher || teachesSubject;
    });
  }
  
  return hdr('Teachers Module','Manage all teacher profiles and subject assignments','Teachers')+`
  ${!isStudent ? `
  <div class="toolbar">
    <button class="btn btn-primary" onclick="showAddTeacherForm()" style="cursor:pointer">+ Add Teacher</button>
    <button class="btn btn-secondary" onclick="importTeachersCSV()" style="cursor:pointer"><i class="fas fa-upload"></i> Import</button>
    <button class="btn btn-secondary" onclick="exportTeachersData()" style="cursor:pointer"><i class="fas fa-download"></i> Export</button>
    <div class="search-bar"><span><i class="fas fa-search"></i></span><input id="teacher-search" placeholder="Search teachers..." onkeyup="filterTeachers()" style="cursor:text"></div>
    <select id="teacher-dept-filter" class="select-sm" onchange="filterTeachers()"><option value="All Departments">All Departments</option><option>Mathematics</option><option>Sciences</option><option>Languages</option></select>
  </div>
  ` : `
  <div style="margin-bottom:18px;padding:14px;background:var(--blue-xpale);border:1px solid var(--blue-light);border-radius:var(--radius);color:var(--blue-dark);font-size:12px">
    <i class="fas fa-info-circle"></i> Viewing teachers who teach your subjects and your form class teacher
  </div>
  `}
  <div class="g3">
    ${filteredTeachers.map((t)=>`
    <div class="card" style="cursor:pointer">
      <div style="display:flex;gap:14px;margin-bottom:14px">
        <div class="av av-lg av-${t.avatar_color}">${t.gender==='Female'?'<i class="fas fa-user"></i>':'<i class="fas fa-user"></i>'}</div>
        <div>
          <div style="font-size:14px;font-weight:700;color:var(--blue-dark)">${t.name}</div>
          <div style="font-size:11px;color:var(--gray-500)">${t.subject}</div>
          <span class="badge b-info" style="margin-top:6px;font-size:9px">${t.experience} yrs exp</span>
        </div>
      </div>
      <div style="font-size:11px;color:var(--gray-500);margin-bottom:8px"><i class="fas fa-users"></i> ${t.class_assigned} Class Teacher</div>
      <div style="font-size:10px;color:var(--gray-400);margin-bottom:12px"><i class="fas fa-calendar-alt"></i> ${t.schedule}</div>
      <div style="display:flex;gap:6px">
        ${!isStudent ? `<button class="btn btn-secondary btn-xs" style="flex:1" onclick="viewTeacherProfile('${t.teacher_id}')">View Profile</button>` : ''}
        ${!isStudent ? `<button class="btn btn-primary btn-xs" style="flex:1" onclick="editTeacher('${t.teacher_id}')">Edit</button>` : `<button class="btn btn-primary btn-xs" style="flex:1" onclick="messageTeacher('${t.teacher_id}', '${t.name}')"><i class="fas fa-envelope"></i> Message</button>`}
      </div>
    </div>`).join('')}
  </div>`;
}

// ═══════════════════════════════════
// PARENT MANAGEMENT FUNCTIONS
// ═══════════════════════════════════
function showAddParentForm(){
  let html = hdr('Add Parent/Guardian','Register a new parent/guardian in the system','Parents')+`
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-users"></i> Parent/Guardian Registration Form</span></div>
    <div class="form-grid">
      <div class="form-field">
        <label>Parent/Guardian Name *</label>
        <input type="text" id="parent-name" placeholder="e.g., Mr. & Mrs. Serwaa">
      </div>
      <div class="form-field">
        <label>Primary Contact Person *</label>
        <input type="text" id="parent-contact-person" placeholder="e.g., Mr. Joseph Serwaa">
      </div>
      <div class="form-field">
        <label>Gender *</label>
        <select id="parent-gender"><option>-- Select --</option><option>Male</option><option>Female</option></select>
      </div>
      <div class="form-field">
        <label>Phone *</label>
        <input type="tel" id="parent-phone" placeholder="+233 24 000 0000">
      </div>
      <div class="form-field">
        <label>Email *</label>
        <input type="email" id="parent-email" placeholder="parent@email.com">
      </div>
      <div class="form-field">
        <label>Occupation</label>
        <input type="text" id="parent-occupation" placeholder="e.g., Engineer, Teacher">
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label>Address</label>
        <input type="text" id="parent-address" placeholder="Residential address">
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label>Children (Comma-separated) *</label>
        <input type="text" id="parent-children" placeholder="e.g., Ama (JHS 1), Kweku (Basic 3)">
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label>Fees Status *</label>
        <select id="parent-fees-status"><option>-- Select --</option><option>All Paid</option><option>Pending</option><option>Partial</option></select>
      </div>
      <div style="grid-column:1/-1;display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="submitParentForm()"><i class="fas fa-check-circle"></i> Register Parent</button>
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('parents')">Cancel</button>
      </div>
    </div>
  </div>`;
  
  document.getElementById('main-content').innerHTML = html;
}

function submitParentForm(){
  const name = document.getElementById('parent-name')?.value.trim();
  const contactPerson = document.getElementById('parent-contact-person')?.value.trim();
  const gender = document.getElementById('parent-gender')?.value;
  const phone = document.getElementById('parent-phone')?.value.trim();
  const email = document.getElementById('parent-email')?.value.trim();
  const occupation = document.getElementById('parent-occupation')?.value.trim();
  const address = document.getElementById('parent-address')?.value.trim();
  const children = document.getElementById('parent-children')?.value.trim();
  const feesStatus = document.getElementById('parent-fees-status')?.value;
  
  if(!name || !contactPerson || !gender || !phone || !email || !children || !feesStatus){
    showToast('<i class="fas fa-times-circle"></i> Please fill all required fields', 'error');
    return;
  }
  
  const parentId = 'P' + String(parentsData.length + 1).padStart(3, '0');
  const newParent = {
    parent_id: parentId,
    name: name,
    contact_person: contactPerson,
    gender: gender,
    avatar_color: ['blue','gold','purple','green','teal'][Math.floor(Math.random()*5)],
    phone: phone,
    email: email,
    occupation: occupation || 'Not specified',
    address: address || 'Not provided',
    children: children,
    fees_status: feesStatus,
    picture: null
  };
  
  parentsData.push(newParent);
  showToast('<i class="fas fa-check-circle"></i> Parent registered!<br/>ID: '+parentId+'<br/>Name: '+name, 'success', 4000);
  
  setTimeout(() => {
    navTo('parents');
  }, 2000);
}

function viewParentProfile(parentId){
  const parent = parentsData.find(p=>p.parent_id===parentId);
  if(!parent) return;
  
  let html = hdr('Parent Profile','View parent/guardian details','Parents')+`
  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-user"></i> Personal Information</span></div>
      <div style="display:flex;gap:20px;margin-bottom:20px">
        <div class="av av-xl av-${parent.avatar_color}">${parent.gender==='Female'?'<i class="fas fa-user"></i>':'<i class="fas fa-user"></i>'}</div>
        <div style="flex:1">
          <div style="font-size:18px;font-weight:700;color:var(--blue-dark);margin-bottom:4px">${parent.name}</div>
          <div style="font-size:12px;color:var(--gray-500);margin-bottom:12px">Parent ID: <strong>${parent.parent_id}</strong></div>
          <div style="display:flex;gap:16px;font-size:12px;color:var(--gray-600)">
            <div><strong>Contact Person:</strong> ${parent.contact_person}</div>
            <div><strong>Gender:</strong> ${parent.gender}</div>
          </div>
        </div>
      </div>
      <hr style="border:none;border-top:1px solid var(--gray-200);margin:16px 0">
      <div style="display:flex;justify-content:space-between;font-size:12px">
        <div>
          <div style="color:var(--gray-500);margin-bottom:4px">Phone</div>
          <div style="font-weight:600;color:var(--gray-800)">${parent.phone}</div>
        </div>
        <div>
          <div style="color:var(--gray-500);margin-bottom:4px">Email</div>
          <div style="font-weight:600;color:var(--gray-800)">${parent.email}</div>
        </div>
        <div>
          <div style="color:var(--gray-500);margin-bottom:4px">Occupation</div>
          <div style="font-weight:600;color:var(--gray-800)">${parent.occupation}</div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-graduation-cap"></i> Children</span></div>
      <div style="display:grid;gap:10px">
        ${parent.children.split(',').map(child=>'<div style="padding:10px;background:var(--blue-xpale);border-radius:var(--radius);font-size:12px;color:var(--gray-800)"><strong><i class="fas fa-book"></i></strong> '+child.trim()+'</div>').join('')}
      </div>
    </div>
  </div>
  
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-money-bill"></i> Fees & Address</span></div>
    <div style="display:flex;justify-content:space-between;font-size:12px">
      <div>
        <div style="color:var(--gray-500);margin-bottom:4px">Fees Status</div>
        <span class="badge ${parent.fees_status==='All Paid'?'b-success':parent.fees_status==='Pending'?'b-danger':'b-warning'}">${parent.fees_status}</span>
      </div>
      <div style="flex:1;margin-left:20px">
        <div style="color:var(--gray-500);margin-bottom:4px">Address</div>
        <div style="font-weight:600;color:var(--gray-800)">${parent.address}</div>
      </div>
    </div>
  </div>
  
  <div style="display:flex;gap:8px;margin-top:20px">
    <button class="btn btn-primary" onclick="editParent('${parentId}')"><i class="fas fa-edit"></i> Edit</button>
    <button class="btn btn-danger" onclick="deleteRecord('${parentId}', 'Parent')"><i class="fas fa-trash"></i> Delete</button>
    <button class="btn btn-secondary" onclick="navTo('parents')">Back</button>
  </div>`;
  
  document.getElementById('main-content').innerHTML = html;
}

function editParent(parentId){
  const parent = parentsData.find(p=>p.parent_id===parentId);
  if(!parent) return;
  
  let html = hdr('Edit Parent','Update parent/guardian information','Parents')+`
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-edit"></i> Edit Parent Details</span></div>
    <div class="form-grid">
      <div class="form-field">
        <label>Parent/Guardian Name *</label>
        <input type="text" id="edit-parent-name" value="${parent.name}">
      </div>
      <div class="form-field">
        <label>Primary Contact Person *</label>
        <input type="text" id="edit-parent-contact-person" value="${parent.contact_person}">
      </div>
      <div class="form-field">
        <label>Gender *</label>
        <select id="edit-parent-gender"><option value="Male" ${parent.gender==='Male'?'selected':''}>Male</option><option value="Female" ${parent.gender==='Female'?'selected':''}>Female</option></select>
      </div>
      <div class="form-field">
        <label>Phone *</label>
        <input type="tel" id="edit-parent-phone" value="${parent.phone}">
      </div>
      <div class="form-field">
        <label>Email *</label>
        <input type="email" id="edit-parent-email" value="${parent.email}">
      </div>
      <div class="form-field">
        <label>Occupation</label>
        <input type="text" id="edit-parent-occupation" value="${parent.occupation}">
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label>Address</label>
        <input type="text" id="edit-parent-address" value="${parent.address}">
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label>Children (Comma-separated) *</label>
        <input type="text" id="edit-parent-children" value="${parent.children}">
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label>Fees Status *</label>
        <select id="edit-parent-fees-status"><option value="All Paid" ${parent.fees_status==='All Paid'?'selected':''}>All Paid</option><option value="Pending" ${parent.fees_status==='Pending'?'selected':''}>Pending</option><option value="Partial" ${parent.fees_status==='Partial'?'selected':''}>Partial</option></select>
      </div>
      <div style="grid-column:1/-1;display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="saveParentChanges('${parentId}')"><i class="fas fa-save"></i> Save Changes</button>
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('parents')">Cancel</button>
      </div>
    </div>
  </div>`;
  
  document.getElementById('main-content').innerHTML = html;
}

function saveParentChanges(parentId){
  const parent = parentsData.find(p=>p.parent_id===parentId);
  if(!parent) return;
  
  const name = document.getElementById('edit-parent-name')?.value.trim();
  const contactPerson = document.getElementById('edit-parent-contact-person')?.value.trim();
  const gender = document.getElementById('edit-parent-gender')?.value;
  const phone = document.getElementById('edit-parent-phone')?.value.trim();
  const email = document.getElementById('edit-parent-email')?.value.trim();
  const occupation = document.getElementById('edit-parent-occupation')?.value.trim();
  const address = document.getElementById('edit-parent-address')?.value.trim();
  const children = document.getElementById('edit-parent-children')?.value.trim();
  const feesStatus = document.getElementById('edit-parent-fees-status')?.value;
  
  if(!name || !contactPerson || !gender || !phone || !email || !children || !feesStatus){
    showToast('<i class="fas fa-times-circle"></i> Please fill all required fields', 'error');
    return;
  }
  
  parent.name = name;
  parent.contact_person = contactPerson;
  parent.gender = gender;
  parent.phone = phone;
  parent.email = email;
  parent.occupation = occupation || 'Not specified';
  parent.address = address || 'Not provided';
  parent.children = children;
  parent.fees_status = feesStatus;
  
  showToast('<i class="fas fa-check-circle"></i> Parent updated!<br/>Name: '+name, 'success', 3000);
  
  setTimeout(() => {
    navTo('parents');
  }, 2000);
}

function filterParents(){
  const searchInput = document.getElementById('parent-search');
  const searchText = (searchInput ? searchInput.value : '').toLowerCase();
  
  let filtered = parentsData.filter((p)=>{
    const matchSearch = !searchText || p.name.toLowerCase().includes(searchText) || 
                        p.email.toLowerCase().includes(searchText) ||
                        p.phone.toLowerCase().includes(searchText) ||
                        p.contact_person.toLowerCase().includes(searchText);
    
    return matchSearch;
  });
  
  updateParentTable(filtered);
}

function updateParentTable(parents){
  const tbody = document.querySelector('table.tbl tbody');
  if(!tbody) return;
  
  if(parents.length === 0){
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--gray-400)">No parents found</td></tr>';
    return;
  }
  
  tbody.innerHTML = parents.map((p,i)=>'<tr><td style="color:var(--gray-400);font-size:11px">'+(i+1)+'</td><td><div style="display:flex;align-items:center;gap:8px"><div class="av av-sm av-'+p.avatar_color+'">'+p.name[0]+'</div><strong>'+p.name+'</strong></div></td><td style="font-size:11px">'+p.children+'</td><td style="font-size:11px">'+p.phone+'</td><td style="color:var(--blue-main);font-size:11px">'+p.email+'</td><td><span class="badge '+(p.fees_status==='All Paid'?'b-success':(p.fees_status==='Pending'?'b-danger':'b-warning'))+'">'+p.fees_status+'</span></td><td><div style="display:flex;gap:4px"><button class="btn btn-secondary btn-xs" onclick="viewParentProfile(\''+p.parent_id+'\')">View</button><button class="btn btn-primary btn-xs" onclick="navTo(\'messaging\')">Message</button></div></td></tr>').join('');
}

// PARENTS MODULE
// ═══════════════════════════════════
function parentsModule(){
  return hdr('Parents Module','Parent/Guardian records and communication','Parents')+`
  <div class="toolbar">
    <button class="btn btn-primary" onclick="showAddParentForm()" style="cursor:pointer">+ Add Parent</button>
    <div class="search-bar"><span><i class="fas fa-search"></i></span><input id="parent-search" placeholder="Search parents..." onkeyup="filterParents()" style="cursor:text"></div>
  </div>
  <div class="card">
    <table class="tbl">
      <thead><tr><th>#</th><th>Parent/Guardian</th><th>Children</th><th>Contact</th><th>Email</th><th>Fees Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${parentsData.map((p,i)=>'<tr><td style="color:var(--gray-400);font-size:11px">'+(i+1)+'</td><td><div style="display:flex;align-items:center;gap:8px"><div class="av av-sm av-'+p.avatar_color+'">'+p.name[0]+'</div><strong>'+p.name+'</strong></div></td><td style="font-size:11px">'+p.children+'</td><td style="font-size:11px">'+p.phone+'</td><td style="color:var(--blue-main);font-size:11px">'+p.email+'</td><td><span class="badge '+(p.fees_status==='All Paid'?'b-success':(p.fees_status==='Pending'?'b-danger':'b-warning'))+'">'+p.fees_status+'</span></td><td><div style="display:flex;gap:4px"><button class="btn btn-secondary btn-xs" onclick="viewParentProfile(\''+p.parent_id+'\')">View</button><button class="btn btn-primary btn-xs" onclick="navTo(\'messaging\')">Message</button></div></td></tr>').join('')}
      </tbody>
    </table>
  </div>`;
}

// ═══════════════════════════════════
// CLASS MANAGEMENT FUNCTIONS
// ═══════════════════════════════════
function viewClassStudents(classId){
  const classData = classesData.find(c=>c.class_id===classId);
  if(!classData) return;
  
  // Get students in this class
  const classStudents = enrolledStudents.filter(s=>s.student_class===classData.name);
  
  let html = hdr('Class Students','View all students in '+classData.name,'Classes')+`
  <div class="card mb20">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-book"></i> Class: ${classData.name}</span></div>
    <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:16px">
      <div>
        <div style="color:var(--gray-500);margin-bottom:4px">Stream</div>
        <span class="badge b-info">${classData.stream}</span>
      </div>
      <div>
        <div style="color:var(--gray-500);margin-bottom:4px">Class Teacher</div>
        <div style="font-weight:600;color:var(--gray-800)">${classData.teacher}</div>
      </div>
      <div>
        <div style="color:var(--gray-500);margin-bottom:4px">Total Students</div>
        <div style="font-weight:600;color:var(--gray-800)">${classStudents.length}</div>
      </div>
      <div>
        <div style="color:var(--gray-500);margin-bottom:4px">Attendance</div>
        <div style="font-weight:600;color:var(--success)">${classData.attendance}</div>
      </div>
    </div>
  </div>
  
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-users"></i> Enrolled Students (${classStudents.length})</span></div>
    <table class="tbl">
      <thead><tr><th>#</th><th>Student</th><th>Roll No.</th><th>Gender</th><th>DOB</th><th>Attendance</th><th>GPA</th><th>Fees</th><th>Status</th></tr></thead>
      <tbody>
        ${classStudents.length === 0 ? '<tr><td colspan="9" style="text-align:center;padding:20px;color:var(--gray-400)">No students in this class yet</td></tr>' : classStudents.map((s,i)=>'<tr><td style="color:var(--gray-400);font-size:11px">'+(i+1)+'</td><td><div style="display:flex;align-items:center;gap:9px"><div class="av av-sm av-'+s.avatar_color+'">'+s.name[0]+'</div><strong>'+s.name+'</strong></div></td><td style="font-size:11px;color:var(--gray-400)">'+s.student_id+'</td><td><span class="badge '+((s.gender_abbr==='F')?'b-purple':'b-info')+'">'+s.gender+'</span></td><td style="font-size:11px;color:var(--gray-500)">'+s.dob+'</td><td style="font-weight:600;color:'+(parseFloat(s.attendance)>=90?'var(--success)':'var(--warning)')+'">'+(s.attendance)+'</td><td style="font-weight:700;color:var(--blue-dark)">'+s.gpa+'</td><td><span class="badge '+(s.fees_status==='Paid'?'b-success':(s.fees_status==='Pending'?'b-danger':'b-warning'))+'">'+s.fees_status+'</span></td><td><span class="badge b-success">'+s.status+'</span></td></tr>').join('')}
      </tbody>
    </table>
  </div>
  
  <div style="display:flex;gap:8px;margin-top:20px">
    <button class="btn btn-primary" onclick="manageClass('${classId}')"><i class="fas fa-cog"></i> Manage Class</button>
    <button class="btn btn-secondary" onclick="navTo('classes')">Back</button>
  </div>`;
  
  document.getElementById('main-content').innerHTML = html;
}

function manageClass(classId){
  const classData = classesData.find(c=>c.class_id===classId);
  if(!classData) return;
  
  let html = hdr('Manage Class','Update class information and settings','Classes')+`
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-cog"></i> Class Settings</span></div>
    <div class="form-grid">
      <div class="form-field">
        <label>Class Name *</label>
        <input type="text" id="manage-class-name" value="${classData.name}">
      </div>
      <div class="form-field">
        <label>Class Level *</label>
        <select id="manage-class-level"><option value="Creche" ${classData.level==='Creche'?'selected':''}>Creche</option><option value="Nursery" ${classData.level==='Nursery'?'selected':''}>Nursery</option><option value="KG 1" ${classData.level==='KG 1'?'selected':''}>KG 1</option><option value="KG 2" ${classData.level==='KG 2'?'selected':''}>KG 2</option><option value="Basic" ${classData.level==='Basic'?'selected':''}>Basic</option><option value="JHS" ${classData.level==='JHS'?'selected':''}>JHS</option></select>
      </div>
      <div class="form-field">
        <label>Stream *</label>
        <select id="manage-class-stream"><option value="General" ${classData.stream==='General'?'selected':''}>General</option><option value="Mixed" ${classData.stream==='Mixed'?'selected':''}>Mixed</option></select>
      </div>
      <div class="form-field">
        <label>Class Teacher *</label>
        <select id="manage-class-teacher">
          <option>-- Select Teacher --</option>
          ${teachersData.map(t=>'<option value="'+t.teacher_id+'" '+((t.teacher_id===classData.teacher_id)?'selected':'')+'> '+t.name+'</option>').join('')}
        </select>
      </div>
      <div class="form-field">
        <label>Current Students *</label>
        <input type="number" id="manage-class-students" value="${classData.students}">
      </div>
      <div class="form-field">
        <label>Class Capacity *</label>
        <input type="number" id="manage-class-capacity" value="${classData.capacity}">
      </div>
      <div style="grid-column:1/-1">
        <label>Subjects (Comma-separated) *</label>
        <input type="text" id="manage-class-subjects" value="${classData.subjects.join(', ')}">
      </div>
      <div style="grid-column:1/-1;display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="saveClassChanges('${classId}')"><i class="fas fa-save"></i> Save Changes</button>
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('classes')">Cancel</button>
      </div>
    </div>
  </div>`;
  
  document.getElementById('main-content').innerHTML = html;
}

function saveClassChanges(classId){
  const classData = classesData.find(c=>c.class_id===classId);
  if(!classData) return;
  
  const name = document.getElementById('manage-class-name')?.value.trim();
  const level = document.getElementById('manage-class-level')?.value;
  const stream = document.getElementById('manage-class-stream')?.value;
  const teacherId = document.getElementById('manage-class-teacher')?.value;
  const students = document.getElementById('manage-class-students')?.value;
  const capacity = document.getElementById('manage-class-capacity')?.value;
  const subjectsStr = document.getElementById('manage-class-subjects')?.value.trim();
  
  if(!name || !level || !stream || !teacherId || !students || !capacity || !subjectsStr){
    showToast('<i class="fas fa-times-circle"></i> Please fill all required fields', 'error');
    return;
  }
  
  const teacher = teachersData.find(t=>t.teacher_id===teacherId);
  
  classData.name = name;
  classData.level = level;
  classData.stream = stream;
  classData.teacher_id = teacherId;
  classData.teacher = teacher?.name || 'Not assigned';
  classData.students = parseInt(students);
  classData.capacity = parseInt(capacity);
  classData.subjects = subjectsStr.split(',').map(s=>s.trim());
  
  showToast('<i class="fas fa-check-circle"></i> Class updated!<br/>Name: '+name, 'success', 3000);
  
  setTimeout(() => {
    navTo('classes');
  }, 2000);
}

function filterClasses(){
  const streamFilter = document.getElementById('class-stream-filter');
  const selectedStream = streamFilter ? streamFilter.value : 'All Streams';
  
  let filtered = classesData.filter((c)=>{
    const matchStream = selectedStream === 'All Streams' || c.stream === selectedStream;
    return matchStream;
  });
  
  updateClassCards(filtered);
}

function updateClassCards(classes){
  const container = document.querySelector('.g3');
  if(!container) return;
  
  if(classes.length === 0){
    container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray-400)">No classes found</div>';
    return;
  }
  
  container.innerHTML = classes.map((c)=>`
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div style="font-size:18px;font-weight:800;color:var(--blue-dark)">${c.name}</div>
        <span class="badge b-info">${c.stream}</span>
      </div>
      <div style="font-size:11px;color:var(--gray-500);margin-bottom:4px"><i class="fas fa-chalkboard-user"></i> ${c.teacher}</div>
      <div style="display:flex;justify-content:space-between;font-size:12px;margin:10px 0">
        <span><i class="fas fa-users"></i> <strong>${c.students}</strong> students</span>
        <span style="color:var(--success);font-weight:700">${c.attendance}</span>
      </div>
      <div class="prog-bar mb16"><div class="prog-fill pf-blue" style="width:${c.attendance}"></div></div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-secondary btn-xs" style="flex:1" onclick="viewClassStudents('${c.class_id}')">View Students</button>
        <button class="btn btn-primary btn-xs" style="flex:1" onclick="manageClass('${c.class_id}')">Manage</button>
      </div>
    </div>`).join('');
}

// CLASSES MODULE
// ═══════════════════════════════════
function classesModule(){
  const totalStudents = classesData.reduce((sum, c) => sum + c.students, 0);
  const avgClassSize = Math.round(totalStudents / classesData.length);
  
  return hdr('Classes Module','Manage classes, streams and assignments','Classes')+`
  <div class="stats-row">
    ${statCard('<i class="fas fa-building"></i>',classesData.length,'Total Classes',classesData.filter(c=>c.level==='Form 1').length+' forms','neu','si-blue')}
    ${statCard('<i class="fas fa-graduation-cap"></i>',totalStudents,'Total Students','All classes','neu','si-gold')}
    ${statCard('<i class="fas fa-chalkboard-user"></i>',classesData.length,'Class Teachers','One per class','neu','si-green')}
    ${statCard('<i class="fas fa-chart-bar"></i>',avgClassSize,'Avg Class Size','Balanced','neu','si-purple')}
  </div>
  <div style="margin-bottom:18px">
    <label style="font-size:11px;font-weight:600;color:var(--gray-600);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px;display:block">Filter by Stream</label>
    <select id="class-stream-filter" class="select-sm" onchange="filterClasses()"><option value="All Streams">All Streams</option><option>General</option><option>Mixed</option></select>
  </div>
  <div class="g3 mb20">
    ${classesData.map((c)=>`
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div style="font-size:18px;font-weight:800;color:var(--blue-dark)">${c.name}</div>
        <span class="badge b-info">${c.stream}</span>
      </div>
      <div style="font-size:11px;color:var(--gray-500);margin-bottom:4px"><i class="fas fa-chalkboard-user"></i> ${c.teacher}</div>
      <div style="display:flex;justify-content:space-between;font-size:12px;margin:10px 0">
        <span><i class="fas fa-users"></i> <strong>${c.students}</strong> students</span>
        <span style="color:var(--success);font-weight:700">${c.attendance}</span>
      </div>
      <div class="prog-bar mb16"><div class="prog-fill pf-blue" style="width:${c.attendance}"></div></div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-secondary btn-xs" style="flex:1" onclick="viewClassStudents('${c.class_id}')">View Students</button>
        <button class="btn btn-secondary btn-xs" style="flex:1" onclick="viewClassTimetable('${c.name}')">Timetable</button>
        <button class="btn btn-primary btn-xs" style="flex:1" onclick="manageClass('${c.class_id}')">Manage</button>
      </div>
    </div>`).join('')}
  </div>`;
}

// SUBJECTS MODULE
function subjectsModule(){
  const filteredSubjects = updateSubjectCards(subjectsData);
  const isStudent = currentRole === 'Student';
  
  return hdr('Subjects Module','Curriculum management and subject assignments','Subjects')+`
  ${!isStudent ? `
  <div class="toolbar">
    <input type="text" id="subject-search" class="input-search" placeholder="<i class="fas fa-search"></i> Search subjects..." onkeyup="filterSubjects()">
    <button class="btn btn-primary" onclick="showAddSubjectForm()">+ Add Subject</button>
  </div>
  <div style="margin-bottom:18px">
    <label style="font-size:11px;font-weight:600;color:var(--gray-600);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px;display:block">Filter by Type</label>
    <div class="mod-tabs">
      ${['All Subjects','Core','Elective','Extracurricular'].map((t,i)=>`<div class="mod-tab ${i===0?'active':''}" onclick="filterSubjectsByType('${t==='All Subjects'?'All':t}')">${t}</div>`).join('')}
    </div>
  </div>
  ` : `
  <div style="margin-bottom:18px;padding:14px;background:var(--blue-xpale);border:1px solid var(--blue-light);border-radius:var(--radius);color:var(--blue-dark);font-size:12px">
    <i class="fas fa-info-circle"></i> You are viewing your enrolled subjects for this term
  </div>
  `}
  <div class="g4">
    ${filteredSubjects.map(s=>`
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div style="font-size:32px">${s.icon}</div>
        ${!isStudent ? `
        <div class="subject-menu-wrapper">
          <button class="subject-menu-btn" onclick="toggleSubjectMenu(event)">☰</button>
          <div class="subject-menu">
            <button class="subject-menu-item" onclick="viewSubject('${s.subject_id}')">View</button>
            <button class="subject-menu-item" onclick="editSubject('${s.subject_id}')">Edit</button>
            <button class="subject-menu-item danger" onclick="deleteSubject('${s.subject_id}')">Delete</button>
          </div>
        </div>
        ` : ''}
      </div>
      <div style="font-size:14px;font-weight:700;color:var(--blue-dark);margin-bottom:4px">${s.name}</div>
      <div style="font-size:11px;color:var(--gray-400);margin-bottom:8px"><i class="fas fa-chalkboard-user"></i> ${s.teacher}</div>
      <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">
        <span class="badge ${s.type==='Core'?'b-success':s.type==='Elective'?'b-warning':'b-info'}">${s.type}</span>
        <span class="badge b-gray">${s.classes}</span>
      </div>
      <div style="font-size:11px;color:var(--gray-500)">${s.hours}</div>
    </div>`).join('')}
  </div>`;
}

// SUBJECTS MODULE HELPER FUNCTIONS
let currentSubjectType = 'All';

function toggleSubjectMenu(event){
  event.stopPropagation();
  const wrapper = event.target.closest('.subject-menu-wrapper');
  if (!wrapper) return;
  
  // Close any other open menus
  document.querySelectorAll('.subject-menu-wrapper').forEach(w => {
    if (w !== wrapper) {
      w.classList.remove('active');
    }
  });
  
  wrapper.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', () => {
  document.querySelectorAll('.subject-menu-wrapper').forEach(w => {
    w.classList.remove('active');
  });
});

function updateSubjectCards(subjects){
  const searchTerm = document.getElementById('subject-search')?.value.toLowerCase() || '';
  return subjects.filter(s => {
    const matchesType = currentSubjectType === 'All' || s.type === currentSubjectType;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm) || s.teacher.toLowerCase().includes(searchTerm);
    return matchesType && matchesSearch;
  });
}

function filterSubjectsByType(type){
  currentSubjectType = type;
  document.querySelectorAll('.mod-tab').forEach((tab, i) => {
    const tabName = i === 0 ? 'All' : ['Core','Elective','Extracurricular'][i-1];
    tab.classList.toggle('active', tabName === type);
  });
  
  const searchTerm = document.getElementById('subject-search')?.value.toLowerCase() || '';
  const filteredSubjects = subjectsData.filter(s => {
    const matchesType = currentSubjectType === 'All' || s.type === currentSubjectType;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm) || s.teacher.toLowerCase().includes(searchTerm);
    return matchesType && matchesSearch;
  });
  updateSubjectDisplay(filteredSubjects);
}

function filterSubjects(){
  const searchTerm = document.getElementById('subject-search')?.value.toLowerCase() || '';
  const filteredSubjects = subjectsData.filter(s => {
    const matchesType = currentSubjectType === 'All' || s.type === currentSubjectType;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm) || s.teacher.toLowerCase().includes(searchTerm);
    return matchesType && matchesSearch;
  });
  updateSubjectDisplay(filteredSubjects);
}

function updateSubjectDisplay(filteredSubjects){
  const gridContainer = document.querySelector('.g4');
  if (!gridContainer) return;
  
  if (filteredSubjects.length === 0) {
    gridContainer.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray-400)">No subjects found</div>';
    return;
  }
  
  gridContainer.innerHTML = filteredSubjects.map(s=>`
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div style="font-size:32px">${s.icon}</div>
        <div class="subject-menu-wrapper">
          <button class="subject-menu-btn" onclick="toggleSubjectMenu(event)">☰</button>
          <div class="subject-menu">
            <button class="subject-menu-item" onclick="viewSubject('${s.subject_id}')">View</button>
            <button class="subject-menu-item" onclick="editSubject('${s.subject_id}')">Edit</button>
            <button class="subject-menu-item danger" onclick="deleteSubject('${s.subject_id}')">Delete</button>
          </div>
        </div>
      </div>
      <div style="font-size:14px;font-weight:700;color:var(--blue-dark);margin-bottom:4px">${s.name}</div>
      <div style="font-size:11px;color:var(--gray-400);margin-bottom:8px"><i class="fas fa-chalkboard-user"></i> ${s.teacher}</div>
      <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">
        <span class="badge ${s.type==='Core'?'b-success':s.type==='Elective'?'b-warning':'b-info'}">${s.type}</span>
        <span class="badge b-gray">${s.classes}</span>
      </div>
      <div style="font-size:11px;color:var(--gray-500)">${s.hours}</div>
    </div>`).join('');
}

function showAddSubjectForm(){
  const form = `
  <div style="background:white;border-radius:8px;padding:20px;max-width:500px">
    <h3 style="margin:0 0 20px;color:var(--blue-dark)"><i class="fas fa-plus"></i> Add New Subject</h3>
    <div class="form-grid">
      <div class="form-field">
        <label>Subject Icon (Emoji)</label>
        <input type="text" id="add-subject-icon" placeholder="e.g., <i class="fas fa-ruler-combined"></i>" maxlength="2" style="font-size:24px">
      </div>
      <div class="form-field">
        <label>Subject Name</label>
        <input type="text" id="add-subject-name" placeholder="e.g., Physics">
      </div>
      <div class="form-field">
        <label>Subject Type</label>
        <select id="add-subject-type">
          <option value="Core">Core</option>
          <option value="Elective">Elective</option>
          <option value="Extracurricular">Extracurricular</option>
        </select>
      </div>
      <div class="form-field">
        <label>Teacher</label>
        <select id="add-subject-teacher">
          ${teachersData.map(t => `<option value="${t.teacher_id}" data-name="${t.name}">${t.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-field">
        <label>Applicable Classes</label>
        <input type="text" id="add-subject-classes" placeholder="e.g., JHS 1-3 or All Forms">
      </div>
      <div class="form-field">
        <label>Hours Per Week</label>
        <input type="text" id="add-subject-hours" placeholder="e.g., 4 hrs/wk">
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label>Description</label>
        <textarea id="add-subject-desc" placeholder="Brief description..." style="resize:vertical;min-height:80px"></textarea>
      </div>
      <div style="grid-column:1/-1;display:flex;gap:10px;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="submitSubjectForm()">Add Subject</button>
      </div>
    </div>
  </div>`;
  openModal(form);
}

function submitSubjectForm(){
  const icon = document.getElementById('add-subject-icon').value.trim() || '<i class="fas fa-book"></i>';
  const name = document.getElementById('add-subject-name').value.trim();
  const type = document.getElementById('add-subject-type').value;
  const teacherId = document.getElementById('add-subject-teacher').value;
  const teacherName = document.querySelector('#add-subject-teacher option:checked').textContent;
  const classes = document.getElementById('add-subject-classes').value.trim();
  const hours = document.getElementById('add-subject-hours').value.trim();
  const desc = document.getElementById('add-subject-desc').value.trim();

  if (!name || !classes || !hours) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  const newSubject = {
    subject_id: 'SUB' + String(subjectsData.length + 1).padStart(3, '0'),
    icon, name, type, teacher: teacherName, teacher_id: teacherId, 
    classes, hours, description: desc
  };

  subjectsData.push(newSubject);
  closeModal();
  showToast(`Subject "${name}" added successfully`, 'success');
  
  const searchTerm = document.getElementById('subject-search')?.value.toLowerCase() || '';
  const filteredSubjects = subjectsData.filter(s => {
    const matchesType = currentSubjectType === 'All' || s.type === currentSubjectType;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm) || s.teacher.toLowerCase().includes(searchTerm);
    return matchesType && matchesSearch;
  });
  updateSubjectDisplay(filteredSubjects);
}

function viewSubject(subjectId){
  const subject = subjectsData.find(s => s.subject_id === subjectId);
  if (!subject) return;

  const view = `
  <div style="background:white;border-radius:8px;padding:20px;max-width:600px">
    <div style="display:flex;align-items:center;gap:15px;margin-bottom:20px">
      <div style="font-size:48px">${subject.icon}</div>
      <div>
        <h3 style="margin:0;color:var(--blue-dark)">${subject.name}</h3>
        <div style="font-size:13px;color:var(--gray-500)">ID: ${subject.subject_id}</div>
      </div>
    </div>
    <div style="background:var(--gray-50);padding:15px;border-radius:6px;margin-bottom:20px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px">
        <div>
          <div style="font-size:11px;color:var(--gray-500);margin-bottom:4px">TYPE</div>
          <span class="badge ${subject.type==='Core'?'b-success':subject.type==='Elective'?'b-warning':'b-info'}">${subject.type}</span>
        </div>
        <div>
          <div style="font-size:11px;color:var(--gray-500);margin-bottom:4px">HOURS</div>
          <div style="font-weight:600">${subject.hours}</div>
        </div>
        <div>
          <div style="font-size:11px;color:var(--gray-500);margin-bottom:4px">TEACHER</div>
          <div style="font-weight:600">${subject.teacher}</div>
        </div>
        <div>
          <div style="font-size:11px;color:var(--gray-500);margin-bottom:4px">CLASSES</div>
          <div style="font-weight:600">${subject.classes}</div>
        </div>
      </div>
    </div>
    <div>
      <div style="font-size:12px;font-weight:600;color:var(--gray-600);margin-bottom:8px">DESCRIPTION</div>
      <div style="font-size:13px;color:var(--gray-700);line-height:1.6">${subject.description}</div>
    </div>
    <div style="margin-top:20px;display:flex;gap:10px;justify-content:flex-end">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="editSubject('${subject.subject_id}')">Edit</button>
    </div>
  </div>`;
  openModal(view);
}

function editSubject(subjectId){
  const subject = subjectsData.find(s => s.subject_id === subjectId);
  if (!subject) return;

  const form = `
  <div style="background:white;border-radius:8px;padding:20px;max-width:500px">
    <h3 style="margin:0 0 20px;color:var(--blue-dark)"><i class="fas fa-edit"></i> Edit Subject</h3>
    <div class="form-grid">
      <div class="form-field">
        <label>Subject Icon (Emoji)</label>
        <input type="text" id="edit-subject-icon" placeholder="e.g., <i class="fas fa-ruler-combined"></i>" maxlength="2" value="${subject.icon}" style="font-size:24px">
      </div>
      <div class="form-field">
        <label>Subject Name</label>
        <input type="text" id="edit-subject-name" value="${subject.name}">
      </div>
      <div class="form-field">
        <label>Subject Type</label>
        <select id="edit-subject-type">
          <option value="Core" ${subject.type==='Core'?'selected':''}>Core</option>
          <option value="Elective" ${subject.type==='Elective'?'selected':''}>Elective</option>
          <option value="Extracurricular" ${subject.type==='Extracurricular'?'selected':''}>Extracurricular</option>
        </select>
      </div>
      <div class="form-field">
        <label>Teacher</label>
        <select id="edit-subject-teacher">
          ${teachersData.map(t => `<option value="${t.teacher_id}" ${t.teacher_id===subject.teacher_id?'selected':''}>${t.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-field">
        <label>Applicable Classes</label>
        <input type="text" id="edit-subject-classes" value="${subject.classes}">
      </div>
      <div class="form-field">
        <label>Hours Per Week</label>
        <input type="text" id="edit-subject-hours" value="${subject.hours}">
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label>Description</label>
        <textarea id="edit-subject-desc" style="resize:vertical;min-height:80px">${subject.description}</textarea>
      </div>
      <div style="grid-column:1/-1;display:flex;gap:10px;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveSubjectChanges('${subject.subject_id}')">Save Changes</button>
      </div>
    </div>
  </div>`;
  openModal(form);
}

function saveSubjectChanges(subjectId){
  const subject = subjectsData.find(s => s.subject_id === subjectId);
  if (!subject) return;

  const icon = document.getElementById('edit-subject-icon').value.trim() || '<i class="fas fa-book"></i>';
  const name = document.getElementById('edit-subject-name').value.trim();
  const type = document.getElementById('edit-subject-type').value;
  const teacherId = document.getElementById('edit-subject-teacher').value;
  const teacherName = document.querySelector('#edit-subject-teacher option:checked').textContent;
  const classes = document.getElementById('edit-subject-classes').value.trim();
  const hours = document.getElementById('edit-subject-hours').value.trim();
  const desc = document.getElementById('edit-subject-desc').value.trim();

  if (!name || !classes || !hours) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  subject.icon = icon;
  subject.name = name;
  subject.type = type;
  subject.teacher = teacherName;
  subject.teacher_id = teacherId;
  subject.classes = classes;
  subject.hours = hours;
  subject.description = desc;

  closeModal();
  showToast('Subject updated successfully', 'success');
  
  const searchTerm = document.getElementById('subject-search')?.value.toLowerCase() || '';
  const filteredSubjects = subjectsData.filter(s => {
    const matchesType = currentSubjectType === 'All' || s.type === currentSubjectType;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm) || s.teacher.toLowerCase().includes(searchTerm);
    return matchesType && matchesSearch;
  });
  updateSubjectDisplay(filteredSubjects);
}

function deleteSubject(subjectId){
  if (!confirm('Are you sure you want to delete this subject?')) return;
  
  const subject = subjectsData.find(s => s.subject_id === subjectId);
  if (!subject) return;

  const index = subjectsData.indexOf(subject);
  subjectsData.splice(index, 1);
  
  showToast(`Subject "${subject.name}" deleted`, 'success');
  
  const searchTerm = document.getElementById('subject-search')?.value.toLowerCase() || '';
  const filteredSubjects = subjectsData.filter(s => {
    const matchesType = currentSubjectType === 'All' || s.type === currentSubjectType;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm) || s.teacher.toLowerCase().includes(searchTerm);
    return matchesType && matchesSearch;
  });
  updateSubjectDisplay(filteredSubjects);
}


// TIMETABLE MODULE
function timetableModule(){
  const classOptions = classesData.map(c=>`<option value="${c.name}">${c.name}</option>`).join('');
  const selectedClass = localStorage.getItem('tt-selected-class') || classesData[0].name;
  const selectedTerm = localStorage.getItem('tt-selected-term') || 'Term 1, 2025';
  
  const timetableHtml = getTimetableDisplay(selectedClass, selectedTerm);
  
  return hdr('Timetable Module','Class schedules and period management','Timetable')+`
  <div class="toolbar">
    <select id="tt-class-select" class="select-sm" onchange="saveTimetableSelection(); updateTimetableDisplay();">
      ${classOptions}
    </select>
    <select id="tt-term-select" class="select-sm" onchange="saveTimetableSelection(); updateTimetableDisplay();">
      <option value="Term 1, 2025">Term 1, 2025</option>
      <option value="Term 2, 2025">Term 2, 2025</option>
    </select>
    <button class="btn btn-primary" onclick="openCreateTimetableForm()">+ Create Timetable</button>
    <button class="btn btn-primary" onclick="openEditTimetableForm()">+ Edit Timetable</button>
    <button class="btn btn-secondary" onclick="printDocument()">Print</button>
    <button class="btn btn-secondary" onclick="exportTimetablePDF()">Export PDF</button>
  </div>
  ${timetableHtml}
  <script>
    setTimeout(() => {
      const classSelect = document.getElementById('tt-class-select');
      const termSelect = document.getElementById('tt-term-select');
      if (classSelect) classSelect.value = '${selectedClass}';
      if (termSelect) termSelect.value = '${selectedTerm}';
    }, 0);
  </script>`;
}

function getTimetableDisplay(className, term) {
  const schedule = timetablesData[className] && timetablesData[className][term];
  
  if (!schedule) {
    return `<div class="card"><div style="padding:20px;color:var(--gray-500);">No timetable available for ${className} · ${term}</div></div>`;
  }
  
  return `<div class="card">
    <div class="card-hdr"><span class="card-title">Weekly Timetable — ${className} · ${term}</span></div>
    <table class="tt" style="width:100%">
      <thead><tr><th>Period / Time</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th></tr></thead>
      <tbody>
        ${schedule.map(([period, subjects])=>`
        <tr>
          <td class="period">${period}</td>
          ${subjects.map(s=>`<td class="${s==='—'?'break':'sub-cell'}">${s}</td>`).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
    <div style="margin-top:14px;display:flex;gap:16px;font-size:11px">
      <span style="display:flex;align-items:center;gap:5px"><span style="width:12px;height:12px;background:var(--blue-xpale);border-radius:3px;display:inline-block;border:1px solid var(--blue-pale)"></span>Periods</span>
      <span style="display:flex;align-items:center;gap:5px"><span style="width:12px;height:12px;background:var(--gray-100);border-radius:3px;display:inline-block"></span>Break / Lunch</span>
    </div>
  </div>`;
}

function updateTimetableDisplay() {
  const classSelect = document.getElementById('tt-class-select');
  const termSelect = document.getElementById('tt-term-select');
  
  if (!classSelect || !termSelect) return;
  
  const selectedClass = classSelect.value;
  const selectedTerm = termSelect.value;
  
  const timetableDisplay = getTimetableDisplay(selectedClass, selectedTerm);
  const cardContainer = document.querySelector('.card');
  
  if (cardContainer) {
    cardContainer.outerHTML = timetableDisplay;
  }
}

function saveTimetableSelection() {
  const classSelect = document.getElementById('tt-class-select');
  const termSelect = document.getElementById('tt-term-select');
  
  if (classSelect) localStorage.setItem('tt-selected-class', classSelect.value);
  if (termSelect) localStorage.setItem('tt-selected-term', termSelect.value);
}

function openCreateTimetableForm() {
  const classOptions = classesData.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
  
  const form = `
  <div style="padding:30px;width:100%;max-width:100vw;height:100vh;overflow-y:auto;display:flex;flex-direction:column">
    <div style="margin-bottom:25px">
      <h2 style="margin:0 0 15px 0;color:var(--gray-800);font-size:24px">Create New Timetable</h2>
      <div style="display:grid;grid-template-columns:200px 200px 1fr;gap:20px">
        <div>
          <label style="font-weight:600;margin-bottom:8px;display:block;font-size:13px">Class</label>
          <select id="create-tt-class" class="input-base" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;font-size:13px">
            ${classOptions}
          </select>
        </div>
        <div>
          <label style="font-weight:600;margin-bottom:8px;display:block;font-size:13px">Term</label>
          <select id="create-tt-term" class="input-base" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;font-size:13px">
            <option value="Term 1, 2025">Term 1, 2025</option>
            <option value="Term 2, 2025">Term 2, 2025</option>
          </select>
        </div>
      </div>
    </div>
    
    <div style="flex:1;display:flex;flex-direction:column;margin-bottom:20px">
      <label style="font-weight:600;margin-bottom:15px;display:block;font-size:14px">Weekly Timetable Schedule</label>
      <div id="periods-container" style="overflow-y:auto;flex:1;padding-right:10px;border:1px solid var(--gray-200);border-radius:8px;background:white">
        <table style="width:100%;border-collapse:collapse">
          <thead style="position:sticky;top:0;background:var(--blue-light);z-index:10">
            <tr>
              <th style="padding:12px;border-bottom:2px solid var(--blue-main);text-align:left;font-weight:600;font-size:12px;min-width:130px">Period / Time</th>
              <th style="padding:12px;border-bottom:2px solid var(--blue-main);text-align:center;font-weight:600;font-size:12px;width:14%">Monday</th>
              <th style="padding:12px;border-bottom:2px solid var(--blue-main);text-align:center;font-weight:600;font-size:12px;width:14%">Tuesday</th>
              <th style="padding:12px;border-bottom:2px solid var(--blue-main);text-align:center;font-weight:600;font-size:12px;width:14%">Wednesday</th>
              <th style="padding:12px;border-bottom:2px solid var(--blue-main);text-align:center;font-weight:600;font-size:12px;width:14%">Thursday</th>
              <th style="padding:12px;border-bottom:2px solid var(--blue-main);text-align:center;font-weight:600;font-size:12px;width:14%">Friday</th>
            </tr>
          </thead>
          <tbody>
            ${['P1 · 7:30–8:20','P2 · 8:20–9:10','Break · 9:10–9:30','P3 · 9:30–10:20','P4 · 10:20–11:10','Lunch · 11:10–12:00','P5 · 12:00–12:50','P6 · 12:50–13:40'].map((period, idx) => {
              const isBreak = period.includes('—');
              return `<tr style="border-bottom:1px solid var(--gray-200)">
                <td style="padding:12px;font-weight:500;font-size:12px;background:var(--gray-50);min-width:130px">${period}</td>
                ${'Monday,Tuesday,Wednesday,Thursday,Friday'.split(',').map((day, dayIdx) => {
                  return `<td style="padding:6px;text-align:center"><input type="text" id="create-period-${idx}-${dayIdx}" value="${isBreak ? '—' : ''}" placeholder="${isBreak ? '—' : 'Subject'}" ${isBreak ? 'readonly' : ''} style="width:100%;padding:8px;border:1.5px solid ${isBreak ? 'var(--gray-300)' : 'var(--gray-200)'};border-radius:4px;font-family:Poppins,sans-serif;font-size:12px;background:${isBreak ? 'var(--gray-100)' : 'white'};text-align:center" />` + '</td>';
                }).join('')}
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
    
    <div style="display:flex;gap:12px;justify-content:flex-end;border-top:1px solid var(--gray-200);padding-top:20px">
      <button class="btn btn-secondary" onclick="closeModal()" style="padding:10px 20px">Cancel</button>
      <button class="btn btn-primary" onclick="saveNewTimetable()" style="padding:10px 20px">Create Timetable</button>
    </div>
  </div>
  `;
  
  openModal(form);
}

function removePeriodRow(btn) {
  btn.closest('.period-row').remove();
}

function saveNewTimetable() {
  const classSelect = document.getElementById('create-tt-class');
  const termSelect = document.getElementById('create-tt-term');
  
  if (!classSelect || !termSelect) {
    showToast('Class and term not found', 'error');
    return;
  }
  
  const selectedClass = classSelect.value;
  const selectedTerm = termSelect.value;
  
  if (!selectedClass || !selectedTerm) {
    showToast('Please select both class and term', 'error');
    return;
  }
  
  if (timetablesData[selectedClass]?.[selectedTerm]) {
    showToast(`Timetable already exists for ${selectedClass} · ${selectedTerm}`, 'warning');
    return;
  }
  
  const periods = document.querySelectorAll('.period-row');
  const newSchedule = [];
  
  periods.forEach((row, idx) => {
    if (idx === 0) return; // Skip header row
    
    const periodLabel = row.querySelector('div:nth-child(1)').textContent.trim();
    const subjects = [];
    
    for (let dayIdx = 0; dayIdx < 5; dayIdx++) {
      const input = document.getElementById(`create-period-${idx - 1}-${dayIdx}`);
      subjects.push(input?.value?.trim() || '');
    }
    
    if (periodLabel) {
      newSchedule.push([periodLabel, subjects]);
    }
  });
  
  if (newSchedule.length === 0) {
    showToast('Please add at least one period', 'error');
    return;
  }
  
  // Create the timetable
  if (!timetablesData[selectedClass]) {
    timetablesData[selectedClass] = {};
  }
  
  timetablesData[selectedClass][selectedTerm] = newSchedule;
  
  closeModal();
  
  // Update display
  const classSelect2 = document.getElementById('tt-class-select');
  const termSelect2 = document.getElementById('tt-term-select');
  if (classSelect2) classSelect2.value = selectedClass;
  if (termSelect2) termSelect2.value = selectedTerm;
  
  updateTimetableDisplay();
  showToast(`Timetable created for ${selectedClass} · ${selectedTerm}`, 'success');
}


function openEditTimetableForm() {
  const classSelect = document.getElementById('tt-class-select');
  const termSelect = document.getElementById('tt-term-select');
  
  if (!classSelect || !termSelect) {
    showToast('Please select a class and term first', 'error');
    return;
  }
  
  const selectedClass = classSelect.value;
  const selectedTerm = termSelect.value;
  const schedule = timetablesData[selectedClass]?.[selectedTerm] || [];
  
  if (schedule.length === 0) {
    showToast('No timetable found for this class and term', 'error');
    return;
  }
  
  const periodOptions = schedule.map(([p], idx) => `<option value="${idx}">${p}</option>`).join('');
  const daysOfWeek = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
  const firstPeriodSubjects = schedule[0]?.[1] || [];
  
  const form = `
  <div style="padding:20px;width:100%;max-width:600px">
    <h3 style="margin:0 0 20px 0;color:var(--gray-800)">Edit Timetable — ${selectedClass} · ${selectedTerm}</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
      <div style="grid-column:1/-1">
        <label style="font-weight:600;margin-bottom:6px;display:block;font-size:13px">Select Period to Edit</label>
        <select id="edit-tt-period" class="input-base" onchange="updatePeriodInputs(this.value)" style="width:100%;padding:8px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif">
          ${periodOptions}
        </select>
      </div>
      <div style="grid-column:1/-1;height:1px;background:var(--gray-200);margin:8px 0"></div>
      ${daysOfWeek.map((day, idx)=>`
      <div>
        <label style="font-size:12px;font-weight:500">${day}</label>
        <input type="text" id="edit-tt-${day.toLowerCase()}" value="${firstPeriodSubjects[idx] || ''}" placeholder="Subject name" style="width:100%;padding:8px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;box-sizing:border-box" />
      </div>`).join('')}
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveTimetableChanges('${selectedClass}', '${selectedTerm}')">Save Changes</button>
    </div>
  </div>
  `;
  
  window.currentEditTimetableData = {
    selectedClass,
    selectedTerm,
    schedule,
    daysOfWeek
  };
  
  openModal(form);
}

function updatePeriodInputs(periodIndex) {
  if (!window.currentEditTimetableData) return;
  
  const { schedule } = window.currentEditTimetableData;
  const periodSubjects = schedule[parseInt(periodIndex)]?.[1] || [];
  const daysOfWeek = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
  
  daysOfWeek.forEach((day, idx) => {
    const input = document.getElementById(`edit-tt-${day.toLowerCase()}`);
    if (input) input.value = periodSubjects[idx] || '';
  });
}

function saveTimetableChanges(className, term) {
  const periodSelect = document.getElementById('edit-tt-period');
  const periodIndex = parseInt(periodSelect?.value) || 0;
  
  if (!timetablesData[className]?.[term]?.[periodIndex]) {
    showToast('Error saving timetable changes', 'error');
    return;
  }
  
  const daysOfWeek = ['monday','tuesday','wednesday','thursday','friday'];
  const newSubjects = daysOfWeek.map(day => {
    const input = document.getElementById(`edit-tt-${day}`);
    return input?.value?.trim() || timetablesData[className][term][periodIndex][1][daysOfWeek.indexOf(day)];
  });
  
  timetablesData[className][term][periodIndex][1] = newSubjects;
  
  closeModal();
  setTimeout(() => {
    updateTimetableDisplay();
    showToast(`Timetable updated for ${className} · ${term}`, 'success');
  }, 100);
}

function exportTimetablePDF() {
  const classSelect = document.getElementById('tt-class-select');
  const termSelect = document.getElementById('tt-term-select');
  
  if (!classSelect || !termSelect) {
    showToast('Please select a class and term first', 'error');
    return;
  }
  
  const selectedClass = classSelect.value;
  const selectedTerm = termSelect.value;
  
  const table = document.querySelector('.tt');
  if (!table) {
    showToast('Timetable not found. Please reload and try again.', 'error');
    return;
  }
  
  const printWindow = window.open('', '', 'width=900,height=700');
  if (!printWindow) {
    showToast('Pop-up blocked. Please allow pop-ups and try again.', 'error');
    return;
  }
  
  const tableHtml = table.outerHTML;
  
  printWindow.document.write(`
    <html>
      <head>
        <title>${selectedClass} Timetable - ${selectedTerm}</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { text-align: center; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 10px; text-align: center; }
          th { background: #4a5bce; color: white; font-weight: bold; }
          .break { background: #f0f0f0; }
        </style>
      </head>
      <body>
        <h1>${selectedClass} Timetable</h1>
        <p style="text-align:center">${selectedTerm}</p>
        ${tableHtml}
        <p style="margin-top:30px;font-size:12px;color:#999;">Generated on ${new Date().toLocaleString()}</p>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.print();
  
  showToast(`Timetable PDF exported for ${selectedClass}`, 'success');
}

// ATTENDANCE MODULE
function attendanceModule(){
  // Check if user is a teacher (only teachers can mark attendance)
  const canMarkAttendance = currentRole === 'Teacher';
  
  return hdr('Attendance Module','Daily attendance tracking and management','Attendance')+`
  <div class="stats-row">
    ${statCard('<i class="fas fa-check-circle"></i>','798','Present Today','94.8%','up','si-green')}
    ${statCard('<i class="fas fa-times-circle"></i>','37','Absent Today','4.4%','dn','si-red')}
    ${statCard('<i class="fas fa-clock"></i>','7','Late Today','0.8%','dn','si-gold')}
    ${statCard('<i class="fas fa-chart-bar"></i>','94.2%','Monthly Average','On track','up','si-blue')}
  </div>
  <div class="g2">
    <div class="card">
      ${!canMarkAttendance ? `
        <div style="padding:20px;text-align:center;background:var(--warning-light);border-radius:var(--radius);border-left:4px solid var(--warning)">
          <div style="font-size:14px;font-weight:600;color:var(--gold-dark);margin-bottom:8px"><i class="fas fa-exclamation-triangle"></i> Permission Denied</div>
          <div style="font-size:12px;color:var(--gray-600)">Only class teachers can mark attendance. Contact your class teacher to update attendance records.</div>
        </div>
      ` : `
        <div class="card-hdr">
          <span class="card-title"><i class="fas fa-clipboard-list"></i> Mark Attendance — Form 2A</span>
          <div style="display:flex;gap:8px">
            <select class="select-sm"><option>Form 2A</option><option>Form 2B</option><option>Form 3A</option></select>
            <button class="btn btn-primary btn-sm" onclick="saveAttendance()">Save</button>
          </div>
        </div>
        <table class="tbl">
          <thead><tr><th>Student</th><th style="text-align:center">Present</th><th style="text-align:center">Absent</th><th style="text-align:center">Late</th><th>Remark</th></tr></thead>
          <tbody>
            ${[['Ama Serwaa','P'],['Kwame Asante','A'],['Abena Mensah','P'],['Kofi Boateng','L'],['Akosua Darko','P'],['Yaw Mensah','P'],['Adwoa Frimpong','P']].map(([n,s])=>`
            <tr>
              <td><div style="display:flex;align-items:center;gap:8px"><div class="av av-sm av-blue">${n[0]}</div>${n}</div></td>
              <td style="text-align:center"><input type="radio" name="att_${n.replace(/ /g,'')}" ${s==='P'?'checked':''}></td>
              <td style="text-align:center"><input type="radio" name="att_${n.replace(/ /g,'')}" ${s==='A'?'checked':''}></td>
              <td style="text-align:center"><input type="radio" name="att_${n.replace(/ /g,'')}" ${s==='L'?'checked':''}></td>
              <td><input style="border:1px solid var(--gray-200);border-radius:6px;padding:3px 8px;font-size:11px;width:90px;font-family:Poppins,sans-serif" placeholder="Note..."></td>
            </tr>`).join('')}
          </tbody>
        </table>
      `}
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-bar"></i> Attendance by Class — Today</span><button class="btn btn-primary btn-sm" onclick="generateAttendanceReport()"><i class="fas fa-file"></i> Generate Report</button></div>
      ${[['Creche',28,26,2],['Nursery',32,31,1],['KG 1',35,33,2],['KG 2',36,35,1],['Basic 1',38,36,2],['Basic 2',40,38,2],['Basic 3',42,40,2],['Basic 4',38,35,3],['Basic 5',40,39,1],['Basic 6',36,34,2],['JHS 1',42,40,2],['JHS 2',40,37,3],['JHS 3',39,37,2]].map(([c,t,p,a])=>`
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px">
          <span style="font-weight:600">${c}</span>
          <span>${p}/${t} present · <span style="color:var(--danger)">${a} absent</span></span>
        </div>
        <div class="prog-bar"><div class="prog-fill pf-green" style="width:${Math.round(p/t*100)}%"></div></div>
      </div>`).join('')}
      <div style="margin-top:16px;padding:12px;background:var(--blue-xpale);border-radius:var(--radius)">
        <div style="font-size:12px;font-weight:700;color:var(--blue-dark);margin-bottom:4px">Daily Summary</div>
        <div style="font-size:11px;color:var(--blue-main)">Total: 842 students · Present: 798 · Absent: 37 · Late: 7</div>
      </div>
    </div>
  </div>`;
}

// EXAMS MODULE
function examsModule(){
  return hdr('Exams & Report Cards','Manage examinations, grading and report generation','Exams')+`
  <div class="mod-tabs">
    ${['Exam Schedule','Report Cards','Results Analysis'].map((t,i)=>`<div class="mod-tab ${i===0?'active':''}" onclick="switchExamTab(${i})">${t}</div>`).join('')}
  </div>
  
  <!-- TAB 1: EXAM SCHEDULE -->
  <div id="exam-tab-0" class="exam-tab-content" style="display:block">
    <div class="card">
      <div class="card-hdr">
        <span class="card-title"><i class="fas fa-calendar-alt"></i> Upcoming Examinations</span>
        <div style="display:flex;gap:8px;align-items:center">
          <input type="text" id="exam-search" placeholder="Search by subject or class..." style="padding:8px 12px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;width:250px" onkeyup="filterExamTable()">
          <button class="btn btn-primary btn-sm" onclick="openScheduleExamForm()">+ Schedule Exam</button>
        </div>
      </div>
      <table class="tbl">
        <thead><tr><th>Subject</th><th>Class</th><th>Date</th><th>Duration</th><th>Venue</th><th>Invigilator</th><th>Actions</th></tr></thead>
        <tbody id="exam-table-body">
          ${[['Mathematics','JHS 3','Apr 1','2 hrs','Hall A','Mr. Amponsah'],['English Language','JHS 3','Apr 2','2 hrs','Hall A','Mrs. Asante'],['Integrated Science','JHS 3','Apr 3','1.5 hrs','Hall B','Mr. Oduro'],['ICT','JHS 3','Apr 4','1 hr','Lab 1','Ms. Frimpong'],['Social Studies','JHS 3','Apr 5','1.5 hrs','Hall B','Mr. Boateng']].map(([s,c,d,du,v,inv])=>`
          <tr class="exam-row" data-subject="${s.toLowerCase()}" data-class="${c.toLowerCase()}">
            <td style="font-weight:600">${s}</td>
            <td>${c}</td>
            <td style="color:var(--blue-main);font-weight:600">${d}</td>
            <td>${du}</td>
            <td>${v}</td>
            <td style="font-size:11px">${inv}</td>
            <td style="font-size:11px"><button class="btn btn-sm" style="padding:4px 8px;background:var(--info);color:white;border:none;border-radius:4px;cursor:pointer" onclick="editExam('${s}','${c}')">Edit</button> <button class="btn btn-sm" style="padding:4px 8px;background:var(--danger);color:white;border:none;border-radius:4px;cursor:pointer" onclick="deleteExam('${s}')">Delete</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
  
  <!-- TAB 2: REPORT CARDS -->
  <div id="exam-tab-1" class="exam-tab-content" style="display:none">
    <div class="card mb20">
      <div class="card-hdr">
        <span class="card-title"><i class="fas fa-clipboard-list"></i> Select Student Report Card</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px;padding:15px">
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Select Student</label>
          <select id="report-student-selector" onchange="onStudentSelected()" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;cursor:pointer">
            <option value="">-- Choose a student --</option>
            <option value="Ama Serwaa">Ama Serwaa (JHS 1)</option>
            <option value="Kwame Asante">Kwame Asante (Basic 6)</option>
            <option value="Abena Mensah">Abena Mensah (Basic 6)</option>
            <option value="Kofi Boateng">Kofi Boateng (Basic 6)</option>
            <option value="Akosua Darko">Akosua Darko (JHS 1)</option>
            <option value="Yaw Mensah">Yaw Mensah (Basic 5)</option>
            <option value="Adwoa Frimpong">Adwoa Frimpong (Basic 5)</option>
            <option value="Kweku Ofori">Kweku Ofori (JHS 2)</option>
          </select>
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Term</label>
          <select id="report-term-selector" onchange="onStudentSelected()" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;cursor:pointer">
            <option value="1st Term">1st Term</option>
            <option value="2nd Term">2nd Term</option>
            <option value="3rd Term">3rd Term</option>
          </select>
        </div>
      </div>
      <div id="selected-report-preview" style="padding:15px;background:var(--gray-50);border-radius:8px;border:1px solid var(--gray-200);text-align:center;color:var(--gray-600);font-size:13px">
        <i class="fas fa-thumbtack"></i> Tip: Select a student above to view their complete report card with all subjects, scores, grades, and remarks.
      </div>
    </div>

    <div class="card mb20" id="report-summary-section" style="display:none">
      <div class="card-hdr">
        <span class="card-title"><i class="fas fa-chart-bar"></i> Student Report Summary</span>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:15px;padding:15px">
        <input type="text" id="report-student-search" placeholder="Search student..." style="padding:8px 12px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;flex:1" onkeyup="filterReportCards()">
        <select id="report-class-filter" style="padding:8px 12px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;cursor:pointer" onchange="filterReportCards()">
          <option value="">All Classes</option><option value="Creche">Creche</option><option value="Nursery">Nursery</option><option value="KG 1">KG 1</option><option value="KG 2">KG 2</option><option value="Basic 1">Basic 1</option><option value="Basic 2">Basic 2</option><option value="Basic 3">Basic 3</option><option value="Basic 4">Basic 4</option><option value="Basic 5">Basic 5</option><option value="Basic 6">Basic 6</option><option value="JHS 1">JHS 1</option><option value="JHS 2">JHS 2</option><option value="JHS 3">JHS 3</option>
        </select>
      </div>
      <table class="tbl">
        <thead><tr><th style="width:25%">Student Name</th><th style="width:15%">Class</th><th style="width:15%">Total Marks</th><th style="width:15%">Average</th><th style="width:12%">Grade</th><th style="width:12%">Position</th><th style="width:15%">Action</th></tr></thead>
        <tbody id="report-cards-body">
          ${[['Ama Serwaa','JHS 1','590','84%','B','8th'],['Kwame Asante','Basic 6','455','76%','C','8th'],['Abena Mensah','Basic 6','546','91%','A','2nd'],['Kofi Boateng','Basic 6','384','64%','C','18th'],['Akosua Darko','JHS 1','570','95%','A','1st'],['Yaw Mensah','Basic 5','492','82%','B','5th'],['Adwoa Frimpong','Basic 5','522','87%','A','3rd'],['Kweku Ofori','JHS 2','378','63%','C','22nd']].map(([name,cls,total,avg,grade,pos])=>'<tr class="report-row" data-student="'+name.toLowerCase()+'" data-class="'+cls+'"><td style="font-weight:600">'+name+'</td><td>'+cls+'</td><td style="color:var(--blue-main);font-weight:600">'+total+'</td><td>'+avg+'</td><td><span style="display:inline-block;padding:4px 10px;border-radius:4px;font-weight:700;color:white;background:'+(grade==='A'?'var(--success)':grade==='B'?'var(--info)':grade==='C'?'var(--warning)':'var(--danger)')+'">'+grade+'</span></td><td>'+pos+'</td><td><button class="btn btn-sm" style="padding:4px 8px;background:var(--blue-main);color:white;border:none;border-radius:4px;cursor:pointer" onclick="viewReportCard(\''+name+'\')"><i class="fas fa-file"></i> View Report</button></td></tr>').join('')}
        </tbody>
      </table>
    </div>
  </div>
  
  <!-- TAB 3: RESULTS ANALYSIS -->
  <div id="exam-tab-2" class="exam-tab-content" style="display:none">
    <div class="card mb20">
      <div class="card-hdr">
        <span class="card-title"><i class="fas fa-chart-bar"></i> Results Analysis & Statistics</span>
        <div style="display:flex;gap:8px">
          <select id="analysis-subject" style="padding:8px 12px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;cursor:pointer" onchange="updateAnalysis()">
            <option>All Subjects</option><option>Mathematics</option><option>English Language</option><option>Integrated Science</option><option>ICT & Computing</option><option>Social Studies</option>
          </select>
          <select id="analysis-class" style="padding:8px 12px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;cursor:pointer" onchange="updateAnalysis()">
            <option value="">All Classes</option><option>Creche</option><option>Nursery</option><option>KG 1</option><option>KG 2</option><option>Basic 1</option><option>Basic 2</option><option>Basic 3</option><option>Basic 4</option><option>Basic 5</option><option>Basic 6</option><option>JHS 1</option><option>JHS 2</option><option>JHS 3</option>
          </select>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:16px;margin-bottom:20px">
        <div style="padding:15px;background:var(--blue-xpale);border-radius:8px;text-align:center">
          <div style="font-size:24px;font-weight:bold;color:var(--blue-dark)">92.5%</div>
          <div style="font-size:11px;color:var(--gray-600);margin-top:5px">Class Average</div>
        </div>
        <div style="padding:15px;background:var(--success-light);border-radius:8px;text-align:center">
          <div style="font-size:24px;font-weight:bold;color:var(--success)">78%</div>
          <div style="font-size:11px;color:var(--gray-600);margin-top:5px">Pass Rate</div>
        </div>
        <div style="padding:15px;background:var(--warning-light);border-radius:8px;text-align:center">
          <div style="font-size:24px;font-weight:bold;color:var(--warning)">45</div>
          <div style="font-size:11px;color:var(--gray-600);margin-top:5px">A Grade Count</div>
        </div>
        <div style="padding:15px;background:var(--info-light);border-radius:8px;text-align:center">
          <div style="font-size:24px;font-weight:bold;color:var(--info)">62</div>
          <div style="font-size:11px;color:var(--gray-600);margin-top:5px">B Grade Count</div>
        </div>
        <div style="padding:15px;background:var(--danger-light);border-radius:8px;text-align:center">
          <div style="font-size:24px;font-weight:bold;color:var(--danger)">22%</div>
          <div style="font-size:11px;color:var(--gray-600);margin-top:5px">Below Average</div>
        </div>
      </div>
      <div style="padding:15px;background:var(--gray-50);border-radius:8px;border-left:4px solid var(--blue-main)">
        <div style="font-weight:600;color:var(--blue-dark);margin-bottom:10px"><i class="fas fa-chart-line"></i> Performance Insight</div>
        <ul style="margin:0;padding:0;list-style:none;font-size:12px;color:var(--gray-600);line-height:1.8">
          <li>✓ Strong performance in Mathematics with 94% average</li>
          <li>✓ English Language shows consistent improvement</li>
          <li><i class="fas fa-exclamation-triangle"></i> 15 students require remedial support in Science</li>
          <li>→ Recommend extra tuition for bottom 20% in ICT</li>
        </ul>
      </div>
    </div>
  </div>
  `;
}

// GRADES ENTRY MODULE
function gradesModule(){
  return hdr('Enter Student Grades','Record class and exam scores for all students','Grade Entry')+`
  <div class="card mb20">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-file-alt"></i> Grade Entry Form</span></div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:14px;margin-bottom:16px">
      <div class="f-field">
        <label>Class</label>
        <select style="padding:10px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;width:100%">
          <option>Form 1A</option>
          <option>Form 1B</option>
          <3: RESULTS ANALYSIS -->
  <div id="exam-tab-2m 2B</option>
          <option>Form 3A</option>
          <option>Form 3B</option>
        </select>
      </div>
      <div class="f-field">
        <label>Subject</label>
        <select style="padding:10px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;width:100%">
          <option>Mathematics</option>
          <option>English Language</option>
          <option>Integrated Science</option>
          <option>ICT & Computing</option>
          <option>Social Studies</option>
          <option>French Language</option>
        </select>
      </div>
      <div class="f-field">
        <label>Term</label>
        <select style="padding:10px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;width:100%">
          <option>1st Term 2024/2025</option>
          <option>2nd Term 2024/2025</option>
          <option>3rd Term 2024/2025</option>
        </select>
      </div>
      <div class="f-field">
        <label>Type</label>
        <select style="padding:10px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;width:100%">
          <option>Class Score</option>
          <option>Exam Score</option>
          <option>Both</option>
        </select>
      </div>
    </div>
  </div>
  <div class="card mb20">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-users"></i> Enter Scores for All Students</span></div>
    <table class="tbl">
      <thead>
        <tr>
          <th>#</th>
          <th>Student Name</th>
          <th>Class Score (/50)</th>
          <th>Exam Score (/50)</th>
          <th>Total (/100)</th>
          <th>Grade</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${[['1','Ama Serwaa','45','43','88','A','Complete'],['2','Kwame Asante','38','34','72','B','Complete'],['3','Abena Mensah','48','43','91','A','Complete'],['4','Kofi Boateng','32','32','64','C','Pending'],['5','Akosua Darko','48','47','95','A','Complete'],['6','Yaw Mensah','42','40','82','B','Complete'],['7','Adwoa Frimpong','45','42','87','A','Complete'],['8','Kweku Ofori','35','28','63','C','Pending']].map(([idx,name,cls,exam,total,grade,status])=>'<tr><td style="text-align:center;color:var(--gray-400)">'+idx+'</td><td style="font-weight:600">'+name+'</td><td><input type="number" value="'+cls+'" min="0" max="50" style="width:70px;border:1.5px solid var(--gray-200);border-radius:6px;padding:6px;text-align:center;font-family:Poppins,sans-serif"></td><td><input type="number" value="'+exam+'" min="0" max="50" style="width:70px;border:1.5px solid var(--gray-200);border-radius:6px;padding:6px;text-align:center;font-family:Poppins,sans-serif"></td><td style="font-weight:700;color:var(--blue-dark)">'+total+'</td><td><span style="display:inline-block;padding:4px 10px;border-radius:4px;font-weight:700;color:white;background:'+(grade==='A'?'var(--success)':grade==='B'?'var(--info)':'var(--warning)')+'">'+grade+'</span></td><td><span class="badge '+(status==='Complete'?'b-success':'b-warning')+'">'+status+'</span></td></tr>').join('')}
      </tbody>
    </table>
    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="btn btn-primary" onclick="showToast('<i class="fas fa-check-circle"></i> Grades saved! You can now generate report cards.', 'success')" style="flex:1"><i class="fas fa-check-circle"></i> Save All Grades</button>
      <button class="btn btn-secondary" onclick="alert('Draft saved')" style="flex:1"><i class="fas fa-clipboard-list"></i> Save as Draft</button>
      <button class="btn btn-secondary" onclick="navTo('reportcards')" style="flex:1"><i class="fas fa-file"></i> View Report Cards</button>
    </div>
  </div>
  `;
}

function viewClassTimetable(className) {
  localStorage.setItem('tt-selected-class', className);
  localStorage.setItem('tt-selected-term', 'Term 1, 2025');
  navTo('timetable');
}

// TIMETABLES DATA
const timetablesData = {
  'Creche': {
    'Term 1, 2025': [
      ['P1 · 7:30–8:20',['Play Time','English','Arts','Play Time','Assembly']],
      ['Break · 8:20–9:00',['—','—','—','—','—']],
      ['P2 · 9:00–10:20',['Numeracy','Play Time','Numeracy','Arts','Numeracy']],
      ['P3 · 10:20–11:00',['English','Numeracy','Play Time','Numeracy','English']],
      ['Lunch · 11:00–12:00',['—','—','—','—','—']],
      ['P4 · 12:00–13:00',['Arts','English','English','Play Time','Play Time']],
    ],
    'Term 2, 2025': [
      ['P1 · 7:30–8:20',['Numeracy','Arts','Play Time','English','Assembly']],
      ['Break · 8:20–9:00',['—','—','—','—','—']],
      ['P2 · 9:00–10:20',['English','Numeracy','Arts','Play Time','English']],
      ['P3 · 10:20–11:00',['Play Time','English','Numeracy','Arts','Numeracy']],
      ['Lunch · 11:00–12:00',['—','—','—','—','—']],
      ['P4 · 12:00–13:00',['Arts','Play Time','English','Numeracy','Play Time']],
    ]
  },
  'Nursery': {
    'Term 1, 2025': [
      ['P1 · 7:30–8:20',['English','Numeracy','Science','English','Assembly']],
      ['Break · 8:20–9:00',['—','—','—','—','—']],
      ['P2 · 9:00–10:20',['Numeracy','English','Arts','Science','English']],
      ['P3 · 10:20–11:00',['Science','Arts','Numeracy','Arts','Science']],
      ['Lunch · 11:00–12:00',['—','—','—','—','—']],
      ['P4 · 12:00–13:00',['Arts','Science','English','Numeracy','Social Studies']],
    ],
    'Term 2, 2025': [
      ['P1 · 7:30–8:20',['Science','English','Numeracy','Arts','Assembly']],
      ['Break · 8:20–9:00',['—','—','—','—','—']],
      ['P2 · 9:00–10:20',['English','Science','Arts','Numeracy','Science']],
      ['P3 · 10:20–11:00',['Arts','Numeracy','English','Science','Numeracy']],
      ['Lunch · 11:00–12:00',['—','—','—','—','—']],
      ['P4 · 12:00–13:00',['Numeracy','Arts','Science','English','Arts']],
    ]
  },
  'KG 1': {
    'Term 1, 2025': [
      ['P1 · 7:30–8:20',['English Language','Mathematics','Environmental Science','English','Assembly']],
      ['P2 · 8:20–9:10',['Mathematics','English','Arts & Crafts','Environmental Science','Mathematics']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Environmental Science','Music','Mathematics','English','Environmental Science']],
      ['P4 · 10:20–11:10',['Music','Arts & Crafts','English','Music','English']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['Arts & Crafts','Environmental Science','English','Mathematics','Mathematics']],
    ],
    'Term 2, 2025': [
      ['P1 · 7:30–8:20',['Mathematics','English','Music','Mathematics','Assembly']],
      ['P2 · 8:20–9:10',['English','Mathematics','Environmental Science','Arts & Crafts','English']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Music','Arts & Crafts','Mathematics','English','Music']],
      ['P4 · 10:20–11:10',['Environmental Science','English','Arts & Crafts','Music','Environmental Science']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['English','Music','Environmental Science','English','Mathematics']],
    ]
  },
  'KG 2': {
    'Term 1, 2025': [
      ['P1 · 7:30–8:20',['English Language','Mathematics','Science','English','Assembly']],
      ['P2 · 8:20–9:10',['Mathematics','English','Physical Education','Science','Mathematics']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Science','Physical Education','Mathematics','English','Science']],
      ['P4 · 10:20–11:10',['Physical Education','English','Social Studies','Physical Education','English']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['Social Studies','Science','English','Mathematics','Social Studies']],
    ],
    'Term 2, 2025': [
      ['P1 · 7:30–8:20',['Mathematics','English','Physical Education','Mathematics','Assembly']],
      ['P2 · 8:20–9:10',['English','Mathematics','Science','Physical Education','English']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Science','Social Studies','Mathematics','English','Science']],
      ['P4 · 10:20–11:10',['Physical Education','English','English','Science','Physical Education']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['Social Studies','Mathematics','Science','English','Mathematics']],
    ]
  },
  'Basic 1': {
    'Term 1, 2025': [
      ['P1 · 7:30–8:20',['English Language','Mathematics','Science','English','Assembly']],
      ['P2 · 8:20–9:10',['Mathematics','English','ICT','Science','Mathematics']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Science','ICT','Social Studies','English','Science']],
      ['P4 · 10:20–11:10',['ICT','Science','Mathematics','Social Studies','English']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['Social Studies','English','English','ICT','Social Studies']],
      ['P6 · 12:50–13:40',['Physical Education','Science','Social Studies','Physical Education','Physical Education']],
    ],
    'Term 2, 2025': [
      ['P1 · 7:30–8:20',['Mathematics','English','Physics','Mathematics','Assembly']],
      ['P2 · 8:20–9:10',['English','Mathematics','Chemistry','Physics','English']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Physics','Chemistry','Biology','English','Physics']],
      ['P4 · 10:20–11:10',['Chemistry','English','Mathematics','Biology','English']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['Biology','ICT','English','Mathematics','Biology']],
      ['P6 · 12:50–13:40',['Physical Education','Biology','ICT','Physical Education','Physical Education']],
    ]
  },
  'Basic 2': {
    'Term 1, 2025': [
      ['P1 · 7:30–8:20',['English Language','Mathematics','Integrated Science','English','Assembly']],
      ['P2 · 8:20–9:10',['Mathematics','English','Physical Education','Science','Mathematics']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Science','Social Studies','Mathematics','English','Science']],
      ['P4 · 10:20–11:10',['Social Studies','English','English','Science','English']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['ICT','Science','Social Studies','Mathematics','Social Studies']],
      ['P6 · 12:50–13:40',['Physical Education','Social Studies','ICT','Physical Education','ICT']],
    ],
    'Term 2, 2025': [
      ['P1 · 7:30–8:20',['Mathematics','English','Science','Mathematics','Assembly']],
      ['P2 · 8:20–9:10',['English','Mathematics','ICT','Science','English']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Science','Social Studies','Mathematics','ICT','Science']],
      ['P4 · 10:20–11:10',['Social Studies','English','English','Science','English']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['ICT','Science','Social Studies','English','Social Studies']],
      ['P6 · 12:50–13:40',['Physical Education','ICT','Science','Physical Education','Physical Education']],
    ]
  },
  'Basic 3': {
    'Term 1, 2025': [
      ['P1 · 7:30–8:20',['English Language','Mathematics','Science','English','Assembly']],
      ['P2 · 8:20–9:10',['Mathematics','English','ICT','Science','Mathematics']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Science','ICT','French Language','English','Science']],
      ['P4 · 10:20–11:10',['French Language','Science','Mathematics','French Language','English']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['Social Studies','English','English','ICT','Social Studies']],
      ['P6 · 12:50–13:40',['ICT','French Language','Social Studies','Physical Education','French Language']],
    ],
    'Term 2, 2025': [
      ['P1 · 7:30–8:20',['Mathematics','English','French Language','Mathematics','Assembly']],
      ['P2 · 8:20–9:10',['English','Mathematics','Science','French Language','English']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Science','Social Studies','Mathematics','English','Science']],
      ['P4 · 10:20–11:10',['Social Studies','English','English','Science','English']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['ICT','Science','Social Studies','Mathematics','Social Studies']],
      ['P6 · 12:50–13:40',['French Language','ICT','French Language','Physical Education','ICT']],
    ]
  },
  'Basic 4': {
    'Term 1, 2025': [
      ['P1 · 7:30–8:20',['English Language','Mathematics','Integrated Science','English','Assembly']],
      ['P2 · 8:20–9:10',['Mathematics','English','Physical Education','Science','Mathematics']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Science','Social Studies','Mathematics','English','Science']],
      ['P4 · 10:20–11:10',['Social Studies','English','English','Science','English']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['ICT','Science','Social Studies','Mathematics','Social Studies']],
      ['P6 · 12:50–13:40',['Physical Education','ICT','ICT','Physical Education','Physical Education']],
    ],
    'Term 2, 2025': [
      ['P1 · 7:30–8:20',['Mathematics','English','Science','Mathematics','Assembly']],
      ['P2 · 8:20–9:10',['English','Mathematics','ICT','Science','English']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Science','Social Studies','Mathematics','ICT','Science']],
      ['P4 · 10:20–11:10',['Social Studies','English','English','Science','English']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['ICT','Science','Social Studies','English','Social Studies']],
      ['P6 · 12:50–13:40',['Physical Education','ICT','Science','Physical Education','Physical Education']],
    ]
  },
  'Basic 5': {
    'Term 1, 2025': [
      ['P1 · 7:30–8:20',['English Language','Mathematics','Integrated Science','English','Assembly']],
      ['P2 · 8:20–9:10',['Mathematics','English','ICT','Science','Mathematics']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Science','French Language','Mathematics','English','Science']],
      ['P4 · 10:20–11:10',['French Language','Science','English','French Language','English']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['Social Studies','English','Social Studies','ICT','Social Studies']],
      ['P6 · 12:50–13:40',['ICT','French Language','ICT','Physical Education','French Language']],
    ],
    'Term 2, 2025': [
      ['P1 · 7:30–8:20',['Mathematics','English','French Language','Mathematics','Assembly']],
      ['P2 · 8:20–9:10',['English','Mathematics','Science','French Language','English']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Science','Social Studies','Mathematics','English','Science']],
      ['P4 · 10:20–11:10',['Social Studies','English','English','Science','English']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['ICT','Science','Social Studies','Mathematics','Social Studies']],
      ['P6 · 12:50–13:40',['French Language','ICT','French Language','Physical Education','ICT']],
    ]
  },
  'Basic 6': {
    'Term 1, 2025': [
      ['P1 · 7:30–8:20',['English Language','Mathematics','Science','English','Assembly']],
      ['P2 · 8:20–9:10',['Mathematics','English','ICT','Science','Mathematics']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Science','Geography','Mathematics','English','Science']],
      ['P4 · 10:20–11:10',['History','Science','English','History','English']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['Geography','English','Social Studies','ICT','Geography']],
      ['P6 · 12:50–13:40',['ICT','History','Geography','Physical Education','History']],
    ],
    'Term 2, 2025': [
      ['P1 · 7:30–8:20',['Mathematics','English','History','Mathematics','Assembly']],
      ['P2 · 8:20–9:10',['English','Mathematics','Geography','History','English']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Science','Geography','Mathematics','English','Science']],
      ['P4 · 10:20–11:10',['History','English','English','Science','English']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['ICT','Science','Social Studies','Mathematics','Geography']],
      ['P6 · 12:50–13:40',['Geography','ICT','History','Physical Education','ICT']],
    ]
  },
  'JHS 1': {
    'Term 1, 2025': [
      ['P1 · 7:30–8:20',['English Language','Mathematics','Integrated Science','English','Assembly']],
      ['P2 · 8:20–9:10',['Mathematics','English','ICT','Science','Mathematics']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Science','ICT','Social Studies','English','Science']],
      ['P4 · 10:20–11:10',['ICT','Science','Mathematics','Social Studies','English']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['Social Studies','English','English','ICT','Social Studies']],
      ['P6 · 12:50–13:40',['French Language','Science','Social Studies','Physical Education','French Language']],
    ],
    'Term 2, 2025': [
      ['P1 · 7:30–8:20',['Mathematics','English','French Language','Mathematics','Assembly']],
      ['P2 · 8:20–9:10',['English','Mathematics','Science','French Language','English']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Science','Social Studies','Mathematics','English','Science']],
      ['P4 · 10:20–11:10',['Social Studies','English','English','Science','English']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['ICT','Science','Social Studies','Mathematics','Social Studies']],
      ['P6 · 12:50–13:40',['French Language','ICT','French Language','Physical Education','ICT']],
    ]
  },
  'JHS 2': {
    'Term 1, 2025': [
      ['P1 · 7:30–8:20',['English Language','Mathematics','History & Social Studies','English','Assembly']],
      ['P2 · 8:20–9:10',['Mathematics','English','ICT','History & Social Studies','Mathematics']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Integrated Science','ICT','Mathematics','English','Integrated Science']],
      ['P4 · 10:20–11:10',['ICT','Integrated Science','English','French Language','English']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['History & Social Studies','English','English','ICT','History & Social Studies']],
      ['P6 · 12:50–13:40',['Physical Education','History & Social Studies','French Language','Physical Education','French Language']],
    ],
    'Term 2, 2025': [
      ['P1 · 7:30–8:20',['Mathematics','English','French Language','Mathematics','Assembly']],
      ['P2 · 8:20–9:10',['English','Mathematics','Integrated Science','French Language','English']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Integrated Science','History & Social Studies','Mathematics','English','Integrated Science']],
      ['P4 · 10:20–11:10',['History & Social Studies','English','English','Integrated Science','English']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['ICT','Integrated Science','History & Social Studies','Mathematics','History & Social Studies']],
      ['P6 · 12:50–13:40',['French Language','ICT','French Language','Physical Education','ICT']],
    ]
  },
  'JHS 3': {
    'Term 1, 2025': [
      ['P1 · 7:30–8:20',['English Language','Mathematics','Integrated Science','English','Assembly']],
      ['P2 · 8:20–9:10',['Mathematics','English','ICT','Science','Mathematics']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Science','ICT','Social Studies','English','Science']],
      ['P4 · 10:20–11:10',['ICT','Science','Mathematics','Social Studies','English']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['Social Studies','English','English','ICT','Social Studies']],
      ['P6 · 12:50–13:40',['Elective Mathematics','Science','French Language','Physical Education','French Language']],
    ],
    'Term 2, 2025': [
      ['P1 · 7:30–8:20',['Mathematics','English','French Language','Mathematics','Assembly']],
      ['P2 · 8:20–9:10',['English','Mathematics','Science','French Language','English']],
      ['Break · 9:10–9:30',['—','—','—','—','—']],
      ['P3 · 9:30–10:20',['Science','Social Studies','Elective Mathematics','English','Science']],
      ['P4 · 10:20–11:10',['Social Studies','English','English','Science','English']],
      ['Lunch · 11:10–12:00',['—','—','—','—','—']],
      ['P5 · 12:00–12:50',['ICT','Science','Social Studies','Elective Mathematics','Social Studies']],
      ['P6 · 12:50–13:40',['French Language','ICT','French Language','Physical Education','ICT']],
    ]
  },
};

// REPORT CARDS MODULE
// ═══════════════════════════════════
// REPORT CARD DATA & CALCULATIONS
// ═══════════════════════════════════

// Admissions data
const admissionsData = [
  {adm_id:'ADM2025-001',name:'Kofi Mensah',dob:'2014-03-15',gender:'Male',address:'Accra',phone:'0244567890',school:'Presec JHS',class_applying:'JHS 1',academic_year:'2025/2026',status:'Pending',parent_name:'Mr. Mensah',parent_phone:'0244567890',parent_occupation:'Trader',picture:null,created:'2025-03-20'},
  {adm_id:'ADM2025-002',name:'Ama Boateng',dob:'2014-06-22',gender:'Female',address:'Tema',phone:'0245678901',school:'Achimota JHS',class_applying:'JHS 1',academic_year:'2025/2026',status:'Approved',parent_name:'Mrs. Boateng',parent_phone:'0245678901',parent_occupation:'Teacher',picture:null,created:'2025-03-18'},
  {adm_id:'ADM2025-003',name:'Yaw Osei',dob:'2014-01-10',gender:'Male',address:'Kumasi',phone:'0246789012',school:'Adum JHS',class_applying:'JHS 2',academic_year:'2025/2026',status:'Pending',parent_name:'Mr. Osei',parent_phone:'0246789012',parent_occupation:'Engineer',picture:null,created:'2025-03-19'},
  {adm_id:'ADM2025-004',name:'Abena Nyarko',dob:'2013-11-05',gender:'Female',address:'Cape Coast',phone:'0247890123',school:'Aggrey JHS',class_applying:'JHS 2',academic_year:'2025/2026',status:'Rejected',parent_name:'Mrs. Nyarko',parent_phone:'0247890123',parent_occupation:'Nurse',picture:null,created:'2025-03-15'},
  {adm_id:'ADM2025-005',name:'Kwame Asare',dob:'2014-08-30',gender:'Male',address:'Accra',phone:'0248901234',school:'Osu JHS',class_applying:'JHS 1',academic_year:'2025/2026',status:'Approved',parent_name:'Mr. Asare',parent_phone:'0248901234',parent_occupation:'Banker',picture:null,created:'2025-03-17'},
];

// Enrolled Students Data
const enrolledStudents = [
  {student_id:'2024-0042',name:'Ama Serwaa',student_class:'Form 3A',gender:'Female',dob:'2008-04-15',attendance:'96%',gpa:'3.8',fees_status:'Paid',status:'Active',avatar_color:'blue',gender_abbr:'F'},
  {student_id:'2024-0043',name:'Kwame Asante',student_class:'Form 2B',gender:'Male',dob:'2009-06-10',attendance:'88%',gpa:'3.2',fees_status:'Pending',status:'Active',avatar_color:'gold',gender_abbr:'M'},
  {student_id:'2024-0044',name:'Abena Mensah',student_class:'Form 1C',gender:'Female',dob:'2010-01-05',attendance:'93%',gpa:'3.5',fees_status:'Paid',status:'Active',avatar_color:'purple',gender_abbr:'F'},
  {student_id:'2024-0045',name:'Kofi Boateng',student_class:'JHS 3',gender:'Male',dob:'2007-09-20',attendance:'81%',gpa:'3.0',fees_status:'Partial',status:'Active',avatar_color:'blue',gender_abbr:'M'},
  {student_id:'2024-0046',name:'Akosua Darko',student_class:'JHS 2',gender:'Female',dob:'2009-03-08',attendance:'97%',gpa:'3.9',fees_status:'Paid',status:'Active',avatar_color:'green',gender_abbr:'F'},
  {student_id:'2024-0047',name:'Yaw Mensah',student_class:'Form 1A',gender:'Male',dob:'2010-07-03',attendance:'85%',gpa:'3.3',fees_status:'Paid',status:'Active',avatar_color:'blue',gender_abbr:'M'},
  {student_id:'2024-0048',name:'Adwoa Frimpong',student_class:'Form 3A',gender:'Female',dob:'2007-12-12',attendance:'94%',gpa:'3.7',fees_status:'Paid',status:'Active',avatar_color:'purple',gender_abbr:'F'},
  {student_id:'2024-0049',name:'Kweku Ofori',student_class:'Form 2B',gender:'Male',dob:'2009-02-28',attendance:'79%',gpa:'2.9',fees_status:'Pending',status:'Active',avatar_color:'gold',gender_abbr:'M'},
];

// TEACHERS DATA
const teachersData = [
  {teacher_id:'T001',name:'Mr. Kweku Amponsah',subject:'Mathematics',department:'Science',experience:'12',class_assigned:'JHS 2',gender:'Male',avatar_color:'blue',phone:'+233 24 111 0001',email:'amponsah@school.edu.gh',dob:'1985-03-15',schedule:'Mon/Tue/Thu',hiring_date:'2012-08-01',status:'Active'},
  {teacher_id:'T002',name:'Mrs. Akua Asante',subject:'English Language',department:'Languages',experience:'8',class_assigned:'JHS 3',gender:'Female',avatar_color:'purple',phone:'+233 24 111 0002',email:'asante@school.edu.gh',dob:'1990-07-22',schedule:'Mon/Wed/Fri',hiring_date:'2016-01-15',status:'Active'},
  {teacher_id:'T003',name:'Mr. Samuel Oduro',subject:'Integrated Science',department:'Science',experience:'6',class_assigned:'JHS 1',gender:'Male',avatar_color:'blue',phone:'+233 24 111 0003',email:'oduro@school.edu.gh',dob:'1992-11-10',schedule:'Tue/Thu/Fri',hiring_date:'2018-06-01',status:'Active'},
  {teacher_id:'T004',name:'Ms. Grace Frimpong',subject:'ICT & Computing',department:'Science',experience:'4',class_assigned:'Not Assigned',gender:'Female',avatar_color:'green',phone:'+233 24 111 0004',email:'frimpong@school.edu.gh',dob:'1994-05-03',schedule:'Mon/Wed/Fri',hiring_date:'2020-08-01',status:'Active'},
  {teacher_id:'T005',name:'Mr. Kofi Boateng Sr.',subject:'History & Social Studies',department:'Languages',experience:'15',class_assigned:'Not Assigned',gender:'Male',avatar_color:'gold',phone:'+233 24 111 0005',email:'boateng@school.edu.gh',dob:'1982-09-17',schedule:'Mon-Fri',hiring_date:'2009-01-01',status:'Active'},
  {teacher_id:'T006',name:'Mrs. Esi Aidoo',subject:'French Language',department:'Languages',experience:'10',class_assigned:'Not Assigned',gender:'Female',avatar_color:'teal',phone:'+233 24 111 0006',email:'aidoo@school.edu.gh',dob:'1988-02-08',schedule:'Tue/Thu',hiring_date:'2014-03-15',status:'Active'},
];

// CLASSES DATA
const classesData = [
  {class_id:'C001',name:'Creche',level:'Creche',stream:'General',teacher:'Mrs. Esi Aidoo',teacher_id:'T006',students:25,attendance:'88%',capacity:30,subjects:['Play & Learn','Basic English','Basic Numeracy','Arts']},
  {class_id:'C002',name:'Nursery',level:'Nursery',stream:'General',teacher:'Mr. Samuel Oduro',teacher_id:'T003',students:28,attendance:'90%',capacity:35,subjects:['English','Numeracy','Science','Social Studies','Arts']},
  {class_id:'C003',name:'KG 1',level:'KG 1',stream:'General',teacher:'Ms. Grace Frimpong',teacher_id:'T004',students:32,attendance:'92%',capacity:40,subjects:['English Language','Mathematics','Environmental Science','Arts & Crafts','Music']},
  {class_id:'C004',name:'KG 2',level:'KG 2',stream:'General',teacher:'Mr. Kofi Boateng Sr.',teacher_id:'T005',students:35,attendance:'94%',capacity:40,subjects:['English Language','Mathematics','Science','Social Studies','Physical Education']},
  {class_id:'C005',name:'Basic 1',level:'Basic',stream:'General',teacher:'Mrs. Akua Asante',teacher_id:'T002',students:38,attendance:'93%',capacity:45,subjects:['English Language','Mathematics','Science','Social Studies','ICT']},
  {class_id:'C006',name:'Basic 2',level:'Basic',stream:'General',teacher:'Mr. Amponsah',teacher_id:'T001',students:40,attendance:'95%',capacity:45,subjects:['English Language','Mathematics','Integrated Science','Social Studies','Physical Education']},
  {class_id:'C007',name:'Basic 3',level:'Basic',stream:'General',teacher:'Mrs. Esi Aidoo',teacher_id:'T006',students:42,attendance:'92%',capacity:45,subjects:['English Language','Mathematics','Science','Social Studies','ICT','French Language']},
  {class_id:'C008',name:'Basic 4',level:'Basic',stream:'General',teacher:'Mr. Oduro',teacher_id:'T003',students:38,attendance:'90%',capacity:45,subjects:['English Language','Mathematics','Integrated Science','Social Studies','Physical Education','ICT']},
  {class_id:'C009',name:'Basic 5',level:'Basic',stream:'General',teacher:'Ms. Frimpong',teacher_id:'T004',students:40,attendance:'91%',capacity:45,subjects:['English Language','Mathematics','Integrated Science','Social Studies','ICT','French Language']},
  {class_id:'C010',name:'Basic 6',level:'Basic',stream:'General',teacher:'Mr. Boateng Sr.',teacher_id:'T005',students:36,attendance:'89%',capacity:45,subjects:['English Language','Mathematics','Science','Geography','History','ICT']},
  {class_id:'C011',name:'JHS 1',level:'JHS',stream:'Mixed',teacher:'Mr. Amponsah',teacher_id:'T001',students:42,attendance:'87%',capacity:50,subjects:['English Language','Mathematics','Integrated Science','Social Studies','ICT','Physical Education','French Language']},
  {class_id:'C012',name:'JHS 2',level:'JHS',stream:'Mixed',teacher:'Mrs. Asante',teacher_id:'T002',students:40,attendance:'89%',capacity:50,subjects:['English Language','Mathematics','Integrated Science','History & Social Studies','ICT','Physical Education','French Language']},
  {class_id:'C013',name:'JHS 3',level:'JHS',stream:'Mixed',teacher:'Mr. Oduro',teacher_id:'T003',students:38,attendance:'91%',capacity:50,subjects:['English Language','Mathematics','Integrated Science','Social Studies','ICT','Physical Education','French Language','Elective Mathematics']},
];

// SUBJECTS DATA
let subjectsData = [
  {subject_id:'SUB001',icon:'<i class="fas fa-ruler-combined"></i>',name:'Mathematics',teacher:'Mr. Amponsah',teacher_id:'T001',type:'Core',classes:'All Forms',hours:'8 hrs/wk',description:'Core mathematics covering algebra, geometry, and calculus'},
  {subject_id:'SUB002',icon:'<i class="fas fa-book-open"></i>',name:'English Language',teacher:'Mrs. Asante',teacher_id:'T002',type:'Core',classes:'All Forms',hours:'8 hrs/wk',description:'English language skills including grammar, comprehension, and composition'},
  {subject_id:'SUB003',icon:'<i class="fas fa-flask-vial"></i>',name:'Integrated Science',teacher:'Mr. Oduro',teacher_id:'T003',type:'Core',classes:'All Forms',hours:'6 hrs/wk',description:'Science covering biology, chemistry, and physics'},
  {subject_id:'SUB004',icon:'<i class="fas fa-laptop"></i>',name:'ICT & Computing',teacher:'Ms. Frimpong',teacher_id:'T004',type:'Core',classes:'All Forms',hours:'4 hrs/wk',description:'Information and Communication Technology skills'},
  {subject_id:'SUB005',icon:'<i class="fas fa-scroll"></i>',name:'Social Studies',teacher:'Mr. Boateng',teacher_id:'T005',type:'Core',classes:'All Forms',hours:'4 hrs/wk',description:'History, geography, and social science studies'},
  {subject_id:'SUB006',icon:'<i class="fas fa-flag"></i>',name:'French Language',teacher:'Mrs. Aidoo',teacher_id:'T006',type:'Elective',classes:'JHS 1-3',hours:'4 hrs/wk',description:'French language proficiency for advanced learners'},
  {subject_id:'SUB007',icon:'<i class="fas fa-masks"></i>',name:'Literature-in-English',teacher:'Mrs. Asante',teacher_id:'T002',type:'Elective',classes:'JHS 2-3',hours:'3 hrs/wk',description:'Analysis of literary works and creative writing'},
  {subject_id:'SUB008',icon:'<i class="fas fa-calculator"></i>',name:'Elective Mathematics',teacher:'Mr. Amponsah',teacher_id:'T001',type:'Elective',classes:'JHS 3',hours:'5 hrs/wk',description:'Advanced mathematics for science stream students'},
  {subject_id:'SUB009',icon:'<i class="fas fa-palette"></i>',name:'Visual Arts',teacher:'Mr. Boateng',teacher_id:'T005',type:'Extracurricular',classes:'All Forms',hours:'2 hrs/wk',description:'Art and design including painting and sculpture'},
  {subject_id:'SUB010',icon:'<i class="fas fa-music"></i>',name:'Music',teacher:'Mrs. Aidoo',teacher_id:'T006',type:'Extracurricular',classes:'All Forms',hours:'2 hrs/wk',description:'Music theory and practical skills'},
];


// PARENTS DATA
const parentsData = [
  {parent_id:'P001',name:'Mr. & Mrs. Serwaa',contact_person:'Mr. Joseph Serwaa',gender:'Male',avatar_color:'gold',phone:'+233 24 000 0001',email:'serwaa@email.com',address:'Accra, Ghana',children:'Ama Serwaa (JHS 1), Kweku Serwaa (Basic 3)',fees_status:'All Paid',occupation:'Businessman',picture:null},
  {parent_id:'P002',name:'Mr. Asante',contact_person:'Mr. David Asante',gender:'Male',avatar_color:'blue',phone:'+233 24 000 0002',email:'asante@email.com',address:'Kumasi, Ghana',children:'Kwame Asante (Basic 6)',fees_status:'Pending',occupation:'Teacher',picture:null},
  {parent_id:'P003',name:'Mrs. Mensah',contact_person:'Mrs. Ama Mensah',gender:'Female',avatar_color:'purple',phone:'+233 24 000 0003',email:'mensah@email.com',address:'Takoradi, Ghana',children:'Abena Mensah (Basic 1)',fees_status:'All Paid',occupation:'Healthcare Worker',picture:null},
  {parent_id:'P004',name:'Mr. Boateng',contact_person:'Mr. Eric Boateng',gender:'Male',avatar_color:'green',phone:'+233 24 000 0004',email:'boateng@email.com',address:'Cape Coast, Ghana',children:'Kofi Boateng (JHS 2)',fees_status:'Partial',occupation:'Engineer',picture:null},
];

// Student scores data
const studentScores = {
  '2024-0042': {
    name: 'Ama Serwaa',
    class: 'JHS 1',
    classTeacher: 'Mr. Kweku Amponsah',
    stream: 'Mixed',
    picture: 'A',
    attendance: 96,
    term: '1st',
    year: '2024/2025',
    scores: [
      {subject: 'Mathematics', classScore: 45, examScore: 43, totalMarks: 100},
      {subject: 'English Language', classScore: 48, examScore: 44, totalMarks: 100},
      {subject: 'Integrated Science', classScore: 42, examScore: 43, totalMarks: 100},
      {subject: 'ICT & Computing', classScore: 48, examScore: 47, totalMarks: 100},
      {subject: 'Social Studies', classScore: 40, examScore: 38, totalMarks: 100},
      {subject: 'French Language', classScore: 38, examScore: 34, totalMarks: 100},
      {subject: 'Religious Studies', classScore: 42, examScore: 38, totalMarks: 100}
    ]
  },
  '2024-0043': {
    name: 'Kwame Asante',
    class: 'Basic 6',
    classTeacher: 'Mr. Boateng Sr.',
    stream: 'General',
    picture: 'K',
    attendance: 88,
    term: '1st',
    year: '2024/2025',
    scores: [
      {subject: 'Mathematics', classScore: 35, examScore: 32, totalMarks: 100},
      {subject: 'English Language', classScore: 42, examScore: 40, totalMarks: 100},
      {subject: 'History', classScore: 44, examScore: 42, totalMarks: 100},
      {subject: 'Geography', classScore: 40, examScore: 38, totalMarks: 100},
      {subject: 'ICT', classScore: 38, examScore: 36, totalMarks: 100},
      {subject: 'French Language', classScore: 35, examScore: 33, totalMarks: 100}
    ]
  }
};

// Calculate grade based on score
function calculateGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  if (score >= 50) return 'E';
  return 'F';
}

// Generate remark based on average
function generateRemark(average) {
  if (average >= 85) return 'Excellent work! Outstanding performance across all subjects.';
  if (average >= 75) return 'Very good performance. Keep up the excellent effort!';
  if (average >= 65) return 'Good performance. Maintain consistency in studies.';
  if (average >= 55) return 'Satisfactory performance. More effort needed in some areas.';
  if (average >= 45) return 'Fair performance. Requires improvement and focused study.';
  return 'Needs improvement. Seek help from teachers and peers.';
}

// Calculate position (placeholder - would sort all students in real system)
function calculatePosition(average) {
  if (average >= 85) return { position: '3rd', total: 40 };
  if (average >= 75) return { position: '8th', total: 40 };
  if (average >= 65) return { position: '15th', total: 40 };
  return { position: '28th', total: 40 };
}

// Process student scores
function processStudentScores(studentId) {
  const student = studentScores[studentId];
  if (!student) return null;

  const processed = {
    ...student,
    processedScores: student.scores.map(score => ({
      ...score,
      total: score.classScore + score.examScore,
      grade: calculateGrade(score.classScore + score.examScore)
    }))
  };

  const totalMarks = processed.processedScores.reduce((sum, s) => sum + s.total, 0);
  const average = Math.round((totalMarks / (processed.processedScores.length * 100)) * 100);
  const posData = calculatePosition(average);

  processed.totalMarks = totalMarks;
  processed.average = average;
  processed.position = posData.position;
  processed.totalStudents = posData.total;
  processed.grade = calculateGrade(average);
  processed.remark = generateRemark(average);

  return processed;
}

// Generate report card HTML
function generateReportCard(studentId) {
  const student = processStudentScores(studentId);
  if (!student) return '<div class="card"><p>Student not found</p></div>';

  const maxMarks = student.processedScores.length * 100;

  return `
  <style>
    @media print {
      body { margin: 0; padding: 0; }
      .main-wrap, .sidebar, .topbar, .footer { display: none !important; }
      .report-card-container { margin: 0; padding: 20px; }
      .btn { display: none !important; }
      .rc-wrap { box-shadow: none; border: none; }
    }
  </style>
  <div class="report-card-container" style="background:white;padding:30px;border-radius:var(--radius);margin:20px 0">
    <div class="rc-wrap">
      <!-- HEADER -->
      <div class="rc-header" style="text-align:center;border-bottom:3px solid var(--blue-main);padding-bottom:20px;margin-bottom:30px">
        <div style="font-size:48px;margin-bottom:8px"><i class="fas fa-school"></i></div>
        <h1 style="font-size:28px;font-weight:800;color:var(--blue-dark);margin:0 0 8px 0">Glory Regin Preparatory school</h1>
        <p style="color:var(--gray-500);margin:0 0 4px 0">Nurturing Excellence Since 1985</p>
        <p style="color:var(--gray-400);margin:0;font-size:12px">P.O. Box AN 1234, Main School Street, Accra North</p>
      </div>

      <!-- STUDENT INFO -->
      <div class="rc-student" style="display:flex;gap:24px;margin-bottom:30px;padding:20px;background:var(--blue-xpale);border-radius:var(--radius)">
        <div class="av av-xl av-blue" style="font-size:36px;width:80px;height:80px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:var(--blue-light);color:white;font-weight:800">${student.picture}</div>
        <div style="flex:1">
          <table style="width:100%;font-size:13px;color:var(--gray-700)">
            <tr style="border-bottom:1px solid rgba(0,0,0,.1)">
              <td style="padding:8px;font-weight:600;width:30%">Student Name</td>
              <td style="padding:8px;font-weight:700;color:var(--blue-dark)">${student.name}</td>
              <td style="padding:8px;font-weight:600">Student ID</td>
              <td style="padding:8px;font-weight:700">2024-${Object.keys(studentScores).indexOf(student.name.replace(/\s/g, '')) + 42}</td>
            </tr>
            <tr style="border-bottom:1px solid rgba(0,0,0,.1)">
              <td style="padding:8px;font-weight:600">Class</td>
              <td style="padding:8px">${student.class}</td>
              <td style="padding:8px;font-weight:600">Stream</td>
              <td style="padding:8px">${student.stream}</td>
            </tr>
            <tr style="border-bottom:1px solid rgba(0,0,0,.1)">
              <td style="padding:8px;font-weight:600">Term</td>
              <td style="padding:8px">${student.term} Term</td>
              <td style="padding:8px;font-weight:600">Academic Year</td>
              <td style="padding:8px">${student.year}</td>
            </tr>
            <tr>
              <td style="padding:8px;font-weight:600">Class Teacher</td>
              <td style="padding:8px;color:var(--blue-main)">${student.classTeacher}</td>
              <td style="padding:8px;font-weight:600">Attendance</td>
              <td style="padding:8px;font-weight:700;color:${student.attendance >= 90 ? 'var(--success)' : 'var(--warning)'}">${student.attendance}%</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- SUBJECTS TABLE -->
      <div style="margin-bottom:30px">
        <h3 style="font-size:16px;font-weight:700;color:var(--blue-dark);margin-bottom:12px;border-bottom:2px solid var(--blue-main);padding-bottom:8px">Academic Performance</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
          <thead>
            <tr style="background:var(--blue-xpale);border-bottom:2px solid var(--blue-main)">
              <th style="padding:12px;text-align:left;font-weight:700;color:var(--blue-dark)">Subject</th>
              <th style="padding:12px;text-align:center;font-weight:700;color:var(--blue-dark)">Class Score</th>
              <th style="padding:12px;text-align:center;font-weight:700;color:var(--blue-dark)">Exam Score</th>
              <th style="padding:12px;text-align:center;font-weight:700;color:var(--blue-dark)">Total (/100)</th>
              <th style="padding:12px;text-align:center;font-weight:700;color:var(--blue-dark)">Grade</th>
            </tr>
          </thead>
          <tbody>
            ${student.processedScores.map((s, i) => `
            <tr style="border-bottom:1px solid var(--gray-200);background:${i % 2 === 0 ? 'white' : 'var(--gray-50)'}">
              <td style="padding:12px;font-weight:600;color:var(--gray-800)">${s.subject}</td>
              <td style="padding:12px;text-align:center;color:var(--gray-600)">${s.classScore}</td>
              <td style="padding:12px;text-align:center;color:var(--gray-600)">${s.examScore}</td>
              <td style="padding:12px;text-align:center;font-weight:700;color:var(--blue-dark);font-size:14px">${s.total}</td>
              <td style="padding:12px;text-align:center">
                <span style="display:inline-block;padding:4px 12px;border-radius:6px;font-weight:700;color:white;background:${
                  s.grade === 'A' ? 'var(--success)' : 
                  s.grade === 'B' ? 'var(--info)' : 
                  s.grade === 'C' ? 'var(--warning)' : 
                  'var(--danger)'
                }">${s.grade}</span>
              </td>
            </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- SUMMARY CARD -->
      <div style="display:grid;grid-template-columns:repeat(5, 1fr);gap:16px;margin-bottom:30px">
        <div style="padding:16px;background:var(--blue-xpale);border-radius:var(--radius);text-align:center">
          <div style="font-size:11px;color:var(--blue-main);font-weight:700;text-transform:uppercase;margin-bottom:8px">Total Marks</div>
          <div style="font-size:24px;font-weight:800;color:var(--blue-dark)">${student.totalMarks}</div>
          <div style="font-size:10px;color:var(--gray-500)">of ${maxMarks}</div>
        </div>
        <div style="padding:16px;background:var(--gold-xlight);border-radius:var(--radius);text-align:center">
          <div style="font-size:11px;color:var(--gold-dark);font-weight:700;text-transform:uppercase;margin-bottom:8px">Average</div>
          <div style="font-size:24px;font-weight:800;color:var(--gold-dark)">${student.average}%</div>
          <div style="font-size:10px;color:var(--gray-500)">Overall</div>
        </div>
        <div style="padding:16px;background:var(--purple-light);border-radius:var(--radius);text-align:center">
          <div style="font-size:11px;color:var(--purple);font-weight:700;text-transform:uppercase;margin-bottom:8px">Grade</div>
          <div style="font-size:24px;font-weight:800;color:var(--purple)">${student.grade}</div>
          <div style="font-size:10px;color:var(--gray-500)">${calculateGrade(student.average) === 'A' ? 'Excellent' : 'Very Good'}</div>
        </div>
        <div style="padding:16px;background:var(--success-light);border-radius:var(--radius);text-align:center">
          <div style="font-size:11px;color:var(--success);font-weight:700;text-transform:uppercase;margin-bottom:8px">Position</div>
          <div style="font-size:24px;font-weight:800;color:var(--success)">${student.position}</div>
          <div style="font-size:10px;color:var(--gray-500)">of ${student.totalStudents}</div>
        </div>
        <div style="padding:16px;background:var(--info-light);border-radius:var(--radius);text-align:center">
          <div style="font-size:11px;color:var(--info);font-weight:700;text-transform:uppercase;margin-bottom:8px">Attendance</div>
          <div style="font-size:24px;font-weight:800;color:var(--info)">${student.attendance}%</div>
          <div style="font-size:10px;color:var(--gray-500)">Present</div>
        </div>
      </div>

      <!-- TEACHER'S REMARK -->
      <div style="padding:16px;background:var(--gray-50);border-left:4px solid var(--blue-main);border-radius:var(--radius);margin-bottom:30px">
        <h4 style="margin:0 0 8px 0;color:var(--blue-dark);font-weight:700">Class Teacher's Remark</h4>
        <p style="margin:0;color:var(--gray-700);line-height:1.6">${student.remark}</p>
      </div>

      <!-- SIGNATURE SECTION -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:40px;margin-bottom:30px">
        <div style="text-align:center;border-top:2px solid var(--gray-300);padding-top:12px">
          <div style="font-size:12px;font-weight:700;color:var(--gray-700)">Class Teacher</div>
          <div style="font-size:10px;color:var(--gray-500);margin-top:4px">${student.classTeacher}</div>
        </div>
        <div style="text-align:center;border-top:2px solid var(--gray-300);padding-top:12px">
          <div style="font-size:12px;font-weight:700;color:var(--gray-700)">School Administrator</div>
          <div style="font-size:10px;color:var(--gray-500);margin-top:4px">Authorized Officer</div>
        </div>
        <div style="text-align:center;border-top:2px solid var(--gray-300);padding-top:12px">
          <div style="font-size:12px;font-weight:700;color:var(--gray-700)">Headteacher</div>
          <div style="font-size:10px;color:var(--gray-500);margin-top:4px">Glory Regin Preparatory school</div>
        </div>
      </div>

      <!-- FOOTER -->
      <div style="text-align:center;padding-top:16px;border-top:1px solid var(--gray-200);color:var(--gray-400);font-size:10px">
        <p style="margin:4px 0">Generated on ${new Date().toLocaleDateString()}</p>
        <p style="margin:0">This is an official document of Glory Regin Preparatory school</p>
      </div>

      <!-- ACTION BUTTONS -->
      <div style="display:flex;justify-content:center;gap:12px;margin-top:24px;print:display:none">
        <button class="btn btn-secondary btn-sm" onclick="window.print()" style="cursor:pointer"><i class="fas fa-print"></i> Print</button>
        <button class="btn btn-primary btn-sm" onclick="downloadReportCardPDF('${studentId}')" style="cursor:pointer"><i class="fas fa-download"></i> Download PDF</button>
        <button class="btn btn-secondary btn-sm" onclick="history.back()" style="cursor:pointer">Back</button>
      </div>
    </div>
  </div>`;
}

// Download report card as PDF (using print-to-PDF functionality)
function downloadReportCardPDF(studentId) {
  alert('PDF download would be generated using server-side conversion or client libraries.');
  // In production, use libraries like jsPDF or html2pdf
  window.print();
}

function reportCardsModule(){
  return hdr('Report Cards','View and generate student report cards','Report Cards')+`
  <div class="g21 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-clipboard-list"></i> Select Student Report Card</span></div>
      <div class="f-row">
        <div class="f-field">
          <label>Select Student</label>
          <select id="student-select" onchange="if(this.value) { document.getElementById('student-report-container').innerHTML = generateReportCard(this.value); document.querySelector('.main-wrap').scrollTop = 800; }" style="padding:10px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;width:100%">
            <option value="">Choose a student...</option>
            ${Object.entries(studentScores).map(([id, data]) => `<option value="${id}">${data.name} (${data.class})</option>`).join('')}
          </select>
        </div>
        <div class="f-field">
          <label>Term</label>
          <select style="padding:10px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif">
            <option>1st Term</option>
            <option>2nd Term</option>
            <option>3rd Term</option>
          </select>
        </div>
      </div>
      <div style="padding:14px;background:var(--blue-xpale);border-radius:6px;margin-top:12px">
        <p style="margin:0;font-size:12px;color:var(--blue-dark)">
          <strong><i class="fas fa-thumbtack"></i> Tip:</strong> Select a student above to view their complete report card with all subjects, scores, grades, and remarks.
        </p>
      </div>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-bar"></i> Student Report Summary</span></div>
      <table class="tbl">
        <thead><tr><th>Student</th><th>Class</th><th>Total Marks</th><th>Average</th><th>Grade</th><th>Position</th><th>Action</th></tr></thead>
        <tbody>
          ${Object.entries(studentScores).map(([id, student]) => {
            const processed = processStudentScores(id);
            return `
            <tr>
              <td><div style="display:flex;align-items:center;gap:8px"><div class="av av-sm av-blue">${student.picture}</div><strong>${student.name}</strong></div></td>
              <td>${student.class}</td>
              <td><strong>${processed.totalMarks}</strong></td>
              <td><strong>${processed.average}%</strong></td>
              <td><span style="display:inline-block;padding:4px 10px;border-radius:4px;font-weight:700;color:white;background:${processed.grade === 'A' ? 'var(--success)' : processed.grade === 'B' ? 'var(--info)' : 'var(--warning)'}">${processed.grade}</span></td>
              <td><strong>${processed.position}</strong></td>
              <td><button class="btn btn-primary btn-xs" onclick="document.getElementById('student-report-container').innerHTML = generateReportCard('${id}'); document.querySelector('.main-wrap').scrollTop = 800;"><i class="fas fa-file"></i> View Report</button></td>
            </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>
  <div id="student-report-container" style="margin-top:30px"></div>`;
}

// ASSIGNMENTS MODULE
function assignmentsModule(){
  const isTeacher = currentRole === 'Teacher';
  const isAdmin = currentRole === 'Admin';
  
  let assignmentsList = Object.values(ASSIGNMENTS_DATA);
  
  const submitCount = (assignment) => Object.keys(assignment.submissions).length;
  const totalStudents = 38; // Average class size
  
  const createButtonHTML = isTeacher ? `<button class="btn btn-primary btn-sm" onclick="openCreateAssignmentForm()">+ New Assignment</button>` : '';
  
  let html = hdr('Assignments Module','Create and manage class assignments','Assignments')+`
  <div class="g21">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-clipboard-list"></i> All Assignments</span>${createButtonHTML}</div>
      <table class="tbl">
        <thead><tr><th>Title</th><th>Subject</th><th>Class</th><th>Due Date</th><th>Submitted</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>`;
  
  assignmentsList.forEach(assignment => {
    const submittedCount = submitCount(assignment);
    const dueDate = new Date(assignment.dueDate).toLocaleDateString('en-GB', {day: '2-digit', month: 'short'});
    const statusBadge = assignment.status === 'Active' ? 'b-success' : 'b-info';
    
    html += `
      <tr>
        <td style="font-weight:600">${assignment.title}</td>
        <td>${assignment.subject}</td>
        <td>${assignment.class}</td>
        <td style="color:var(--blue-main);font-weight:600">${dueDate}</td>
        <td>${submittedCount}/${totalStudents}</td>
        <td><span class="badge ${statusBadge}">${assignment.status}</span></td>
        <td><div style="display:flex;gap:4px">
          <button class="btn btn-secondary btn-xs" onclick="viewAssignment('${assignment.id}')">View</button>
          ${isTeacher ? `<button class="btn btn-primary btn-xs" onclick="gradeAssignment('${assignment.id}')">Grade</button>` : ''}
        </div></td>
      </tr>`;
  });
  
  html += `</tbody></table></div>`;
  
  // Create Assignment Form (only for Teachers)
  if(isTeacher) {
    html += `
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-plus"></i> Create New Assignment</span></div>
      <form id="create-assignment-form" onsubmit="createAssignment(event)">
        <div class="f-field" style="margin-bottom:12px">
          <label>Assignment Title</label>
          <input type="text" id="asg-title" placeholder="e.g. Chapter 5 Problems" required>
        </div>
        <div class="f-row">
          <div class="f-field">
            <label>Subject</label>
            <select id="asg-subject" required>
              <option>Mathematics</option>
              <option>English</option>
              <option>Science</option>
              <option>ICT</option>
              <option>History</option>
              <option>French</option>
              <option>Physical Education</option>
            </select>
          </div>
          <div class="f-field">
            <label>Class</label>
            <select id="asg-class" required>
              <option>Basic 4</option>
              <option>Basic 5</option>
              <option>Basic 6</option>
              <option>JHS 1</option>
              <option>JHS 2</option>
              <option>JHS 3</option>
            </select>
          </div>
        </div>
        <div class="f-row">
          <div class="f-field">
            <label>Due Date</label>
            <input type="date" id="asg-duedate" required>
          </div>
          <div class="f-field">
            <label>Max Score</label>
            <input type="number" id="asg-maxscore" value="50" min="10" max="100" required>
          </div>
        </div>
        <div class="f-field" style="margin-bottom:14px">
          <label>Instructions</label>
          <textarea id="asg-instructions" placeholder="Describe the assignment, requirements, and submission guidelines..." style="min-height:100px"></textarea>
        </div>
        <div class="f-field" style="margin-bottom:14px">
          <label>Attachment (Optional)</label>
          <input type="file" id="asg-attachment">
          <div style="font-size:11px;color:var(--gray-500);margin-top:4px"><i class="fas fa-paperclip"></i> Supported: PDF, DOC, DOCX, PNG, JPG (Max 10MB)</div>
        </div>
        <div style="display:flex;gap:8px">
          <button type="submit" class="btn btn-primary">Publish Assignment</button>
          <button type="button" class="btn btn-secondary" onclick="saveDraftAssignment()">Save as Draft</button>
        </div>
      </form>
    </div>`;
  }
  
  html += `</div>`;
  return html;
}

function openCreateAssignmentForm() {
  const form = document.getElementById('create-assignment-form');
  if(form) {
    form.scrollIntoView({behavior: 'smooth'});
  } else {
    showToast('<i class="fas fa-times-circle"></i> Form not available', 'error');
  }
}

function viewAssignment(assignmentId) {
  const assignment = ASSIGNMENTS_DATA[assignmentId];
  if(!assignment) {
    showToast('<i class="fas fa-times-circle"></i> Assignment not found', 'error');
    return;
  }
  
  const submittedCount = Object.keys(assignment.submissions).length;
  const totalCount = 38;
  const submissionList = Object.entries(assignment.submissions).map(([student, data]) => `
    <div style="padding:12px;background:var(--gray-50);border-radius:6px;margin-bottom:8px;border-left:4px solid ${data.score >= assignment.maxScore * 0.8 ? 'var(--success)' : data.score >= assignment.maxScore * 0.6 ? 'var(--warning)' : 'var(--danger)'}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <strong style="color:var(--gray-800)">${student}</strong>
        <span style="padding:4px 10px;background:${data.score >= assignment.maxScore * 0.8 ? 'var(--success)' : data.score >= assignment.maxScore * 0.6 ? 'var(--warning)' : 'var(--danger)'};color:white;border-radius:4px;font-weight:700;font-size:11px">${data.score}/${assignment.maxScore}</span>
      </div>
      <div style="font-size:12px;color:var(--gray-600);margin-bottom:4px"><i class="fas fa-upload"></i> Submitted: ${new Date(data.submitted).toLocaleDateString()}</div>
      <div style="font-size:11px;color:var(--gray-700);padding:8px;background:white;border-radius:4px">${data.feedback || 'No feedback yet'}</div>
    </div>
  `).join('');
  
  const notSubmittedList = submittedCount < totalCount ? `<div style="padding:12px;background:var(--gray-50);border-radius:6px;color:var(--gray-600);font-size:12px"><i class="fas fa-file-alt"></i> ${totalCount - submittedCount} students have not yet submitted.</div>` : '';
  
  const modalHTML = `
    <div style="max-width:800px;background:white;border-radius:12px;overflow:hidden">
      <div style="padding:24px;background:var(--blue-main);color:white">
        <h2 style="margin:0 0 4px 0">${assignment.title}</h2>
        <p style="margin:4px 0;font-size:13px;opacity:0.9">${assignment.subject} • ${assignment.class}</p>
      </div>
      
      <div style="padding:24px">
        <div style="margin-bottom:20px;padding:16px;background:var(--blue-xpale);border-radius:8px;border-left:4px solid var(--blue-main)">
          <h4 style="margin:0 0 10px 0;color:var(--blue-dark);font-size:13px;font-weight:700"><i class="fas fa-clipboard-list"></i> Assignment Details</h4>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px">
            <div><span style="color:var(--gray-600)">Due Date:</span> <strong>${new Date(assignment.dueDate).toLocaleDateString()}</strong></div>
            <div><span style="color:var(--gray-600)">Max Score:</span> <strong>${assignment.maxScore}</strong></div>
            <div><span style="color:var(--gray-600)">Created:</span> <strong>${new Date(assignment.createdDate).toLocaleDateString()}</strong></div>
            <div><span style="color:var(--gray-600)">Status:</span> <span style="padding:2px 8px;background:${assignment.status === 'Active' ? 'var(--success)' : 'var(--info)'};color:white;border-radius:4px;font-weight:700;font-size:10px">${assignment.status}</span></div>
          </div>
        </div>
        
        <div style="margin-bottom:20px;padding:16px;background:var(--gray-50);border-radius:8px">
          <h4 style="margin:0 0 10px 0;color:var(--gray-800);font-size:13px;font-weight:700"><i class="fas fa-file-alt"></i> Instructions</h4>
          <p style="margin:0;font-size:12px;line-height:1.6;color:var(--gray-700)">${assignment.instructions}</p>
          ${assignment.attachment ? `<div style="margin-top:10px;padding:10px;background:white;border-radius:6px;border-left:3px solid var(--blue-main);font-size:11px"><strong><i class="fas fa-paperclip"></i> Attachment:</strong> ${assignment.attachment}</div>` : ''}
        </div>
        
        <div style="margin-bottom:20px">
          <h4 style="margin:0 0 15px 0;color:var(--gray-800);font-size:13px;font-weight:700"><i class="fas fa-upload"></i> Submissions (${submittedCount}/${totalCount})</h4>
          <div style="width:100%;height:8px;background:var(--gray-200);border-radius:4px;overflow:hidden;margin-bottom:12px">
            <div style="width:${Math.round(submittedCount/totalCount*100)}%;height:100%;background:var(--success)"></div>
          </div>
          ${submissionList}
          ${notSubmittedList}
        </div>
      </div>
      
      <div style="padding:20px;background:var(--gray-50);border-top:1px solid var(--gray-200);text-align:right">
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
        ${currentRole === 'Teacher' ? `<button class="btn btn-primary" style="margin-left:8px" onclick="closeModal();gradeAssignment('${assignmentId}')">Grade Submissions</button>` : ''}
      </div>
    </div>
  `;
  
  openModal(modalHTML);
}

function gradeAssignment(assignmentId) {
  const assignment = ASSIGNMENTS_DATA[assignmentId];
  if(!assignment) {
    showToast('<i class="fas fa-times-circle"></i> Assignment not found', 'error');
    return;
  }
  
  // Check if user is teacher
  if(currentRole !== 'Teacher') {
    showToast('<i class="fas fa-times-circle"></i> Only teachers can grade assignments', 'error');
    return;
  }
  
  const ungraded = [
    { student: 'Kofi Boateng', submitted: '2025-03-16' },
    { student: 'Theresa Mensah', submitted: '2025-03-15' }
  ];
  
  let gradingHTML = `
    <div style="max-width:900px;background:white;border-radius:12px">
      <div style="padding:20px;background:var(--blue-main);color:white">
        <h2 style="margin:0">${assignment.title} - Grading Interface</h2>
        <p style="margin:4px 0;font-size:13px;opacity:0.9">${assignment.class}</p>
      </div>
      
      <div style="padding:20px">
        <div style="margin-bottom:20px;padding:12px;background:var(--gold-light);border-radius:6px">
          <span style="font-size:12px;color:var(--gray-700)"><strong><i class="fas fa-book"></i> Max Score:</strong> ${assignment.maxScore} | <strong>Submitted:</strong> ${Object.keys(assignment.submissions).length} | <strong>Pending:</strong> ${ungraded.length}</span>
        </div>
        
        <h3 style="margin:20px 0 12px 0;color:var(--gray-800);font-size:13px;font-weight:700"><i class="fas fa-check-circle"></i> Already Graded</h3>
        <div style="margin-bottom:20px">
          ${Object.entries(assignment.submissions).map(([student, data]) => `
            <div style="padding:12px;background:var(--gray-50);border-radius:6px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">
              <div>
                <strong>${student}</strong>
                <div style="font-size:11px;color:var(--gray-500);margin-top:2px">Scored: ${data.score}/${assignment.maxScore}</div>
              </div>
              <button class="btn btn-secondary btn-xs" onclick="editGrade('${assignmentId}', '${student}')">Edit</button>
            </div>
          `).join('')}
        </div>
        
        ${ungraded.length > 0 ? `
        <h3 style="margin:20px 0 12px 0;color:var(--gray-800);font-size:13px;font-weight:700"><i class="fas fa-file-alt"></i> Pending Grading (${ungraded.length})</h3>
        <div style="margin-bottom:20px">
          ${ungraded.map((sub, idx) => `
            <div style="padding:12px;background:var(--warning-light);border-radius:6px;margin-bottom:8px;border-left:4px solid var(--warning)">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <div>
                  <strong>${sub.student}</strong>
                  <div style="font-size:11px;color:var(--gray-600);margin-top:2px">Submitted: ${new Date(sub.submitted).toLocaleDateString()}</div>
                </div>
                <button class="btn btn-primary btn-xs" onclick="openGradeSubmissionForm('${assignmentId}', '${sub.student}', ${idx})">Grade Now</button>
              </div>
            </div>
          `).join('')}
        </div>` : ''}
      </div>
      
      <div style="padding:16px;background:var(--gray-50);border-top:1px solid var(--gray-200);text-align:right">
        <button class="btn btn-secondary" onclick="closeModal()">Done Grading</button>
      </div>
    </div>
  `;
  
  openModal(gradingHTML);
}

function createAssignment(event) {
  event.preventDefault();
  
  if(currentRole !== 'Teacher') {
    showToast('<i class="fas fa-times-circle"></i> Only teachers can create assignments', 'error');
    return;
  }
  
  const title = document.getElementById('asg-title').value;
  const subject = document.getElementById('asg-subject').value;
  const classVal = document.getElementById('asg-class').value;
  const dueDate = document.getElementById('asg-duedate').value;
  const maxScore = document.getElementById('asg-maxscore').value;
  const instructions = document.getElementById('asg-instructions').value;
  
  if(!title || !subject || !classVal || !dueDate || !maxScore || !instructions) {
    showToast('<i class="fas fa-times-circle"></i> Please fill in all required fields', 'error');
    return;
  }
  
  const newId = String(Math.max(...Object.keys(ASSIGNMENTS_DATA).map(Number)) + 1);
  ASSIGNMENTS_DATA[newId] = {
    id: newId,
    title,
    subject,
    class: classVal,
    teacher: 'Current Teacher', // In real system, get from session
    dueDate,
    createdDate: new Date().toISOString().split('T')[0],
    maxScore: parseInt(maxScore),
    status: 'Active',
    instructions,
    attachment: document.getElementById('asg-attachment').files.length > 0 ? document.getElementById('asg-attachment').files[0].name : null,
    submissions: {}
  };
  
  // Clear form
  document.getElementById('create-assignment-form').reset();
  
  showToast('<i class="fas fa-check-circle"></i> Assignment created and published successfully!', 'success');
  
  // Refresh the page  
  setTimeout(() => {
    renderMain();
  }, 1500);
}

function saveDraftAssignment() {
  showToast('<i class="fas fa-save"></i> Assignment saved as draft. You can continue editing later.', 'info');
}

function editGrade(assignmentId, student) {
  showToast('<i class="fas fa-file-alt"></i> Edit grade feature coming soon', 'info');
}

function openGradeSubmissionForm(assignmentId, student, index) {
  const assignment = ASSIGNMENTS_DATA[assignmentId];
  
  const formHTML = `
    <div style="max-width:600px;background:white;border-radius:12px;overflow:hidden">
      <div style="padding:20px;background:var(--blue-main);color:white">
        <h2 style="margin:0">Grade Submission</h2>
        <p style="margin:8px 0 0 0;font-size:13px;opacity:0.9">${student}</p>
      </div>
      
      <form onsubmit="submitGrade(event, '${assignmentId}', '${student}')">
        <div style="padding:20px">
          <div class="f-field" style="margin-bottom:16px">
            <label>Raw Score</label>
            <div style="position:relative">
              <input type="number" id="grade-score" min="0" max="${assignment.maxScore}" placeholder="0" required style="font-size:24px;padding:12px;text-align:center;font-weight:700">
              <div style="position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--gray-500)">/ ${assignment.maxScore}</div>
            </div>
          </div>
          
          <div class="f-field" style="margin-bottom:16px">
            <label>Feedback for Student</label>
            <textarea id="grade-feedback" placeholder="Provide constructive feedback..." style="min-height:100px"></textarea>
          </div>
          
          <div style="padding:12px;background:var(--blue-xpale);border-radius:6px;border-left:4px solid var(--blue-main);margin-bottom:16px;font-size:12px;color:var(--blue-dark)">
            <strong><i class="fas fa-lightbulb"></i> Tip:</strong> Be specific and encouraging in your feedback. Students value comments on what they did well and what to improve.
          </div>
        </div>
        
        <div style="padding:16px;background:var(--gray-50);border-top:1px solid var(--gray-200);display:flex;gap:8px;justify-content:flex-end">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Submit Grade</button>
        </div>
      </form>
    </div>
  `;
  
  openModal(formHTML);
}

function submitGrade(event, assignmentId, student) {
  event.preventDefault();
  
  const score = parseInt(document.getElementById('grade-score').value);
  const feedback = document.getElementById('grade-feedback').value;
  const assignment = ASSIGNMENTS_DATA[assignmentId];
  
  if(score < 0 || score > assignment.maxScore) {
    showToast('<i class="fas fa-times-circle"></i> Score must be between 0 and ' + assignment.maxScore, 'error');
    return;
  }
  
  // Update submission
  assignment.submissions[student] = {
    submitted: new Date().toISOString().split('T')[0],
    score,
    feedback
  };
  
  closeModal();
  showToast('<i class="fas fa-check-circle"></i> Grade submitted and feedback sent to student!', 'success');
  
  setTimeout(() => {
    gradeAssignment(assignmentId);
  }, 1500);
}

// FEES MODULE
function feesModule(){
  const isAdmin = currentRole === 'Admin';
  const recordPaymentBtn = isAdmin ? '' : `<button class="btn btn-gold btn-sm" onclick="navTo('payments')">+ Record Payment</button>`;
  
  let html = hdr('Fees & Payments','Student fee management and payment records','Fees')+`
  <div class="stats-row">
    ${statCard('<i class="fas fa-money-bill"></i>','GH₵248K','Total Collected','88.6% of target','up','si-blue')}
    ${statCard('<i class="fas fa-hourglass-half"></i>','GH₵32K','Outstanding','37 students','dn','si-red')}
    ${statCard('<i class="fas fa-check-circle"></i>','805','Paid Students','95.6%','up','si-green')}
    ${statCard('<i class="fas fa-exclamation-triangle"></i>','37','Defaulters','Action needed','dn','si-gold')}
  </div>
  <div class="g21">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-credit-card"></i> Payment Records</span>
        <div style="display:flex;gap:8px">
          ${recordPaymentBtn}
          <button class="btn btn-secondary btn-sm" onclick="exportPaymentData()"><i class="fas fa-download"></i> Export</button>
        </div>
      </div>
      <div class="toolbar">
        <div class="search-bar"><span><i class="fas fa-search"></i></span><input id="fee-search" placeholder="Search student..." onkeyup="filterFeeRecords()"></div>
        <select id="fee-class-filter" class="select-sm" onchange="filterFeeRecords()">
          <option value="">All Classes</option>
          <option value="Basic 4">Basic 4</option>
          <option value="Basic 5">Basic 5</option>
          <option value="Basic 6">Basic 6</option>
          <option value="JHS 1">JHS 1</option>
          <option value="JHS 2">JHS 2</option>
          <option value="JHS 3">JHS 3</option>
        </select>
        <select id="fee-status-filter" class="select-sm" onchange="filterFeeRecords()">
          <option value="">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
      <table class="tbl">
        <thead><tr><th>Student</th><th>Class</th><th>Term Fee</th><th>Paid</th><th>Balance</th><th>Date</th><th>Receipt</th><th>Status</th></tr></thead>
        <tbody id="fee-records-table">`;
  
  // Fee records data
  const feeRecords = [
    { name: 'Ama Serwaa', class: 'JHS 1', termFee: 'GH₵2,500', paid: 'GH₵2,500', balance: 'GH₵0', date: 'Mar 15', receipt: '#R-0482', status: 'Paid' },
    { name: 'Kwame Asante', class: 'Basic 6', termFee: 'GH₵2,400', paid: 'GH₵1,200', balance: 'GH₵1,200', date: 'Mar 15', receipt: '#R-0481', status: 'Partial' },
    { name: 'Abena Mensah', class: 'Basic 6', termFee: 'GH₵2,400', paid: 'GH₵2,400', balance: 'GH₵0', date: 'Mar 14', receipt: '#R-0480', status: 'Paid' },
    { name: 'Kofi Boateng', class: 'JHS 2', termFee: 'GH₵2,600', paid: 'GH₵0', balance: 'GH₵2,600', date: '—', receipt: '—', status: 'Pending' },
    { name: 'Akosua Darko', class: 'JHS 1', termFee: 'GH₵2,500', paid: 'GH₵2,500', balance: 'GH₵0', date: 'Mar 13', receipt: '#R-0479', status: 'Paid' },
    { name: 'Yaw Mensah', class: 'Basic 5', termFee: 'GH₵2,350', paid: 'GH₵2,350', balance: 'GH₵0', date: 'Mar 12', receipt: '#R-0478', status: 'Paid' },
    { name: 'Adwoa Frimpong', class: 'Basic 5', termFee: 'GH₵2,350', paid: 'GH₵1,175', balance: 'GH₵1,175', date: 'Mar 11', receipt: '#R-0477', status: 'Partial' },
    { name: 'Kweku Ofori', class: 'JHS 3', termFee: 'GH₵2,700', paid: 'GH₵0', balance: 'GH₵2,700', date: '—', receipt: '—', status: 'Pending' },
    { name: 'Theresa Mensah', class: 'Basic 4', termFee: 'GH₵2,300', paid: 'GH₵2,300', balance: 'GH₵0', date: 'Mar 10', receipt: '#R-0476', status: 'Paid' },
    { name: 'Samuel Boateng', class: 'JHS 2', termFee: 'GH₵2,600', paid: 'GH₵1,300', balance: 'GH₵1,300', date: 'Mar 9', receipt: '#R-0475', status: 'Partial' }
  ];
  
  feeRecords.forEach((record, idx) => {
    const statusColor = record.status === 'Paid' ? 'b-success' : record.status === 'Pending' ? 'b-danger' : 'b-warning';
    html += `
      <tr class="fee-row" data-student="${record.name.toLowerCase()}" data-class="${record.class}" data-status="${record.status}">
        <td><div style="display:flex;align-items:center;gap:8px"><div class="av av-sm av-blue">${record.name[0]}</div>${record.name}</div></td>
        <td>${record.class}</td>
        <td>${record.termFee}</td>
        <td style="color:var(--success);font-weight:700">${record.paid}</td>
        <td style="color:${record.balance === 'GH₵0' ? 'var(--success)' : 'var(--danger)'};font-weight:700">${record.balance}</td>
        <td>${record.date}</td>
        <td style="color:var(--blue-main)">${record.receipt}</td>
        <td><span class="badge ${statusColor}">${record.status}</span></td>
      </tr>`;
  });
  
  html += `</tbody>
      </table>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:18px;padding-top:14px;border-top:1px solid var(--gray-200)">
        <span style="font-size:12px;color:var(--gray-500)">Showing 1–10 of ${feeRecords.length} results</span>
        <div class="pagination">
          <button class="pg-btn active" onclick="goToPage(1)">1</button>
          <button class="pg-btn" onclick="goToPage(2)">2</button>
          <button class="pg-btn" onclick="goToPage(3)">3</button>
          <button class="pg-btn" onclick="goToPage('...')">…</button>
          <button class="pg-btn" onclick="goToPage(22)">22</button>
        </div>
      </div>
    </div>
    <div>
      <div class="fee-hero mb16">
        <h3>Collected This Term</h3>
        <div class="amount">GH₵ 248,000</div>
        <div class="sub">Target: GH₵280,000</div>
        <div style="margin-top:12px;background:rgba(255,255,255,.15);border-radius:4px;height:8px">
          <div style="width:88.6%;background:var(--gold);height:8px;border-radius:4px"></div>
        </div>
        <div style="font-size:11px;opacity:.65;margin-top:6px">88.6% of annual target achieved</div>
      </div>
      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-building"></i> Fee Structure</span><span class="card-act" onclick="navTo('feestructure')">Edit</span></div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--gray-100)">
          <span style="font-size:13px;font-weight:600">Basic 4</span>
          <span style="font-size:16px;font-weight:800;color:var(--blue-dark)">GH₵2,300</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--gray-100)">
          <span style="font-size:13px;font-weight:600">Basic 5</span>
          <span style="font-size:16px;font-weight:800;color:var(--blue-dark)">GH₵2,350</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--gray-100)">
          <span style="font-size:13px;font-weight:600">Basic 6</span>
          <span style="font-size:16px;font-weight:800;color:var(--blue-dark)">GH₵2,400</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--gray-100)">
          <span style="font-size:13px;font-weight:600">JHS 1</span>
          <span style="font-size:16px;font-weight:800;color:var(--blue-dark)">GH₵2,500</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--gray-100)">
          <span style="font-size:13px;font-weight:600">JHS 2</span>
          <span style="font-size:16px;font-weight:800;color:var(--blue-dark)">GH₵2,600</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0">
          <span style="font-size:13px;font-weight:600">JHS 3</span>
          <span style="font-size:16px;font-weight:800;color:var(--blue-dark)">GH₵2,700</span>
        </div>
        <button class="btn btn-primary" style="width:100%;margin-top:14px" onclick="navTo('feestructure')">View Full Structure</button>
      </div>
    </div>
  </div>`;
  return html;
}

function filterFeeRecords() {
  const searchVal = document.getElementById('fee-search').value.toLowerCase();
  const classVal = document.getElementById('fee-class-filter').value.toLowerCase();
  const statusVal = document.getElementById('fee-status-filter').value.toLowerCase();
  
  document.querySelectorAll('.fee-row').forEach(row => {
    const student = row.getAttribute('data-student');
    const feeClass = row.getAttribute('data-class').toLowerCase();
    const status = row.getAttribute('data-status').toLowerCase();
    
    const matchesSearch = student.includes(searchVal);
    const matchesClass = !classVal || feeClass === classVal;
    const matchesStatus = !statusVal || status === statusVal;
    
    row.style.display = (matchesSearch && matchesClass && matchesStatus) ? '' : 'none';
  });
  
  showToast('<i class="fas fa-check-circle"></i> Records filtered', 'success');
}

function exportPaymentData() {
  const records = document.querySelectorAll('.fee-row');
  let csv = 'Student,Class,Term Fee,Paid,Balance,Date,Receipt,Status\n';
  
  records.forEach(row => {
    if(row.style.display !== 'none') {
      const cells = row.querySelectorAll('td');
      const data = [
        cells[0].textContent.trim(),
        cells[1].textContent.trim(),
        cells[2].textContent.trim(),
        cells[3].textContent.trim(),
        cells[4].textContent.trim(),
        cells[5].textContent.trim(),
        cells[6].textContent.trim(),
        cells[7].textContent.trim()
      ];
      csv += data.map(d => `"${d}"`).join(',') + '\n';
    }
  });
  
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'payment-records-' + new Date().toISOString().slice(0, 10) + '.csv');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  
  showToast('<i class="fas fa-check-circle"></i> Payment records exported as CSV', 'success');
}

function goToPage(page) {
  showToast('<i class="fas fa-file"></i> Loading page ' + page, 'info');
}

// PAYMENTS MODULE (Accountant)
function paymentsModule(){
  return hdr('Cash Payments','Record and manage cash fee payments','Payments')+`
  <div class="g21">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-dollar-sign"></i> Record Cash Payment</span></div>
      <form onsubmit="recordPayment(event)">
        <div class="f-row">
          <div class="f-field"><label>Student Name / Roll No.</label><input id="pay-student" placeholder="Search student..." required></div>
          <div class="f-field">
            <label>Class</label>
            <select id="pay-class" required>
              <option>Basic 4</option>
              <option>Basic 5</option>
              <option>Basic 6</option>
              <option>JHS 1</option>
              <option>JHS 2</option>
              <option>JHS 3</option>
            </select>
          </div>
        </div>
        <div class="f-row">
          <div class="f-field"><label>Amount Paying (GH₵)</label><input type="number" id="pay-amount" placeholder="0.00" required></div>
          <div class="f-field"><label>Term</label><select id="pay-term" required><option>Term 1, 2025</option><option>Term 2, 2025</option><option>Term 3, 2025</option></select></div>
        </div>
        <div class="f-row">
          <div class="f-field"><label>Payment Date</label><input type="date" id="pay-date" value="2025-03-17" required></div>
          <div class="f-field"><label>Received By</label><input value="Accountant" readonly></div>
        </div>
        <div class="f-field" style="margin-bottom:14px"><label>Remarks / Notes</label><textarea id="pay-remarks" placeholder="Optional notes..."></textarea></div>
        <div style="padding:14px;background:var(--gold-xlight);border-radius:var(--radius);border:1px solid var(--gold-light);margin-bottom:14px">
          <div style="font-size:12px;color:var(--gray-600);margin-bottom:6px"><i class="fas fa-exclamation-triangle"></i> Cash payments only. All receipts must be issued immediately.</div>
          <div style="font-size:12px;color:var(--gray-600)">Receipts are auto-generated and logged in the system.</div>
        </div>
        <div style="display:flex;gap:8px">
          <button type="submit" class="btn btn-gold"><i class="fas fa-dollar-sign"></i> Record & Issue Receipt</button>
          <button type="button" class="btn btn-secondary" onclick="navTo('fees')">Cancel</button>
        </div>
      </form>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-bar"></i> Today's Collections</span></div>
      <div class="fee-hero" style="margin-bottom:16px">
        <h3>Today — March 17, 2025</h3>
        <div class="amount">GH₵ 12,800</div>
        <div class="sub">14 payments processed today</div>
      </div>
      ${[['8:30 AM','Ama Serwaa','GH₵2,400','#R-0482'],['9:15 AM','Kwame Asante','GH₵1,200','#R-0481'],['10:00 AM','Theresa Mensah','GH₵2,400','#R-0480'],['11:30 AM','Abena Mensah','GH₵2,200','#R-0479']].map(([t,n,a,r])=>`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--gray-100)">
        <div style="font-size:11px;color:var(--gray-400);min-width:55px">${t}</div>
        <div style="flex:1"><div style="font-size:12.5px;font-weight:600">${n}</div><div style="font-size:10px;color:var(--gray-400)">${r}</div></div>
        <div style="font-size:13px;font-weight:700;color:var(--success)">${a}</div>
      </div>`).join('')}
    </div>
  </div>`;
}

function recordPayment(event) {
  event.preventDefault();
  
  const student = document.getElementById('pay-student').value;
  const classVal = document.getElementById('pay-class').value;
  const amount = document.getElementById('pay-amount').value;
  const term = document.getElementById('pay-term').value;
  const date = document.getElementById('pay-date').value;
  const remarks = document.getElementById('pay-remarks').value;
  
  if(!student || !amount || amount <= 0) {
    showToast('<i class="fas fa-times-circle"></i> Please fill in all required fields correctly', 'error');
    return;
  }
  
  const receiptNum = '#R-' + String(Math.floor(Math.random() * 9999)).padStart(4, '0');
  
  showToast(`<i class="fas fa-check-circle"></i> Payment processed! Receipt ${receiptNum} issued`, 'success');
  
  // Clear form
  event.target.reset();
  document.getElementById('pay-date').value = '2025-03-17';
  
  setTimeout(() => {
    navTo('fees');
  }, 1500);
}

// EVENTS MODULE
function eventsModule(){
  return hdr('Events & Calendar','School events, holidays and important dates','Events')+`
  <div class="g21">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-calendar-alt"></i> Upcoming Events</span>${currentRole==='Visitor'?'':`<button class="btn btn-primary btn-sm" onclick="alert('Opening event creation form...')">+ Add Event</button>`}</div>
      ${[['<i class="fas fa-running"></i>','Sports Day','March 24, 2025','All Students & Staff','Full-day sports competition. Students must wear house colors. Attendance compulsory. Parents welcome.','All Day','success'],['<i class="fas fa-users"></i>','PTA Meeting','March 20, 2025','Parents & Teachers','End-of-term PTA meeting in the school hall. All parents are strongly encouraged to attend.','3:00 PM','info'],['<i class="fas fa-file-alt"></i>','Term 1 Exams Begin','April 1, 2025','Form 1–3','Final examinations for Term 1. Detailed timetable available on the portal.','7:30 AM','warning'],['<i class="fas fa-graduation-cap"></i>','Prize Giving Ceremony','April 15, 2025','All','Annual prize-giving and graduation ceremony. Smart attire required for all.','10:00 AM','success'],['<i class="fas fa-school"></i>','Open Day','April 20, 2025','Prospective Parents','School open day for prospective students and parents. Tours from 9AM.','9:00 AM','info']].map(([i,t,d,aud,desc,time,type])=>`
      <div style="display:flex;gap:16px;padding:16px 0;border-bottom:1px solid var(--gray-100)">
        <div style="width:54px;background:var(--blue-xpale);border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;padding:8px">${i}</div>
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <h4 style="font-size:14px;font-weight:700;color:var(--blue-dark)">${t}</h4>
            <span class="badge b-${type}">${time}</span>
          </div>
          <div style="font-size:11px;color:var(--blue-main);margin:4px 0;font-weight:500">${d} · ${aud}</div>
          <p style="font-size:12px;color:var(--gray-500);line-height:1.5">${desc}</p>
        </div>
      </div>`).join('')}
    </div>
    <div>
      <div class="card mb16">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-calendar-alt"></i> Calendar</span></div>
        ${mini_cal()}
      </div>
      ${currentRole==='Visitor'?'':`<div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-plus"></i> Add Event</span></div>
        <div class="f-field" style="margin-bottom:10px"><label>Event Title</label><input placeholder="Event name..."></div>
        <div class="f-row">
          <div class="f-field"><label>Date</label><input type="date"></div>
          <div class="f-field"><label>Time</label><input type="time"></div>
        </div>
        <div class="f-field" style="margin-bottom:10px"><label>Audience</label><select><option>All</option><option>Students</option><option>Teachers</option><option>Parents</option></select></div>
        <div class="f-field" style="margin-bottom:12px"><label>Description</label><textarea placeholder="Event description..."></textarea></div>
        <button class="btn btn-primary" style="width:100%" onclick="showToast('<i class="fas fa-check-circle"></i> Event created!', 'success')">Create Event</button>
      </div>`}
    </div>
  </div>`;
}

// NOTICES MODULE
// NOTICES DATA
const NOTICES_DATA = [
  { id: 1, icon: '<i class="fas fa-clipboard-list"></i>', title: 'Important: Term Exams Schedule Released', audience: 'All', postedBy: 'Admin', date: '2026-03-15', message: 'The Term 1, 2025 examination timetable has been released. Students are required to adhere strictly to the schedule. Extra classes will run during break times.', priority: 'Important', attachment: null },
  { id: 2, icon: '<i class="fas fa-running"></i>', title: 'Annual Sports Day — March 24, 2025', audience: 'All', postedBy: 'Admin', date: '2026-03-12', message: 'Our Annual Sports Day will be held on Monday, March 24. All students must attend wearing their respective house colors. Parents are warmly welcome to observe.', priority: 'Normal', attachment: null },
  { id: 3, icon: '<i class="fas fa-book"></i>', title: 'Library Closure Notice', audience: 'Students', postedBy: 'Librarian', date: '2026-03-10', message: 'The school library will be closed from March 20–21 for annual stock-taking. Please return all borrowed books before this date.', priority: 'Normal', attachment: null },
  { id: 4, icon: '<i class="fas fa-chalkboard-user"></i>', title: 'Mandatory Staff Meeting — March 18', audience: 'Staff', postedBy: 'Admin', date: '2026-03-09', message: 'There will be a mandatory staff meeting on Tuesday, March 18 at 3:00 PM in the staffroom. Agenda will be circulated via email by Monday.', priority: 'Important', attachment: null },
  { id: 5, icon: '<i class="fas fa-graduation-cap"></i>', title: 'WASSCE Registration Open', audience: 'Form 3', postedBy: 'Academic Director', date: '2026-03-08', message: 'WASSCE registration is now open for Form 3 students. Please submit all required documents to the Academic Office before March 25.', priority: 'Urgent', attachment: null }
];

// NOTICES MODULE
function noticesModule(){
  const isAdmin = currentRole === 'Admin';
  const isTeacher = currentRole === 'Teacher';
  const canPost = isAdmin || isTeacher;
  
  let html = hdr('Notices & Announcements','Post and manage school-wide notices','Notices')+`
  <div class="g21">
    <div>
    
      <!-- SEARCH & FILTER BAR -->

      <div style="margin-bottom:16px;display:flex;gap:8px;flex-wrap:wrap">
        <div style="flex:1;min-width:200px;position:relative">
          <i class="fas fa-search" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--gray-400);pointer-events:none;font-size:13px"></i>
          <input type="text" id="notice-search" placeholder="Search notices..." class="input" 
            onkeyup="filterNotices()" style="width:100%;padding:10px;padding-left:32px;border:2px solid var(--gray-300);border-radius:8px;font-size:13px;box-shadow:0 0 0 1px var(--gray-200)">
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn btn-secondary btn-sm filter-btn" onclick="filterByAudience('All')" data-audience="All">All</button>
          <button class="btn btn-secondary btn-sm filter-btn" onclick="filterByAudience('Students')" data-audience="Students">Students</button>
          <button class="btn btn-secondary btn-sm filter-btn" onclick="filterByAudience('Staff')" data-audience="Staff">Staff</button>
          <button class="btn btn-secondary btn-sm filter-btn" onclick="filterByAudience('Form 3')" data-audience="Form 3">Form 3</button>
        </div>
      </div>
      
      <!-- NOTICES LIST -->
      <div id="notices-list">`;
  
  NOTICES_DATA.forEach(notice => {
    const priorityColor = notice.priority === 'Urgent' ? 'danger' : notice.priority === 'Important' ? 'warning' : 'info';
    const noticeDate = new Date(notice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    html += `
      <div class="card mb16 notice-item" data-audience="${notice.audience}" data-title="${notice.title.toLowerCase()}">
        <div style="display:flex;gap:14px">
          <div class="notice-icon" style="background:var(--blue-xpale);font-size:28px;display:flex;align-items:center;justify-content:center;width:50px;height:50px;border-radius:8px">${notice.icon}</div>
          <div style="flex:1">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
              <h3 style="font-size:14px;font-weight:700;color:var(--blue-dark);margin:0">${notice.title}</h3>
              <span class="badge b-${priorityColor}">${notice.audience}</span>
            </div>
            <div style="font-size:11px;color:var(--gray-400);margin-bottom:8px">${notice.postedBy} · ${noticeDate}</div>
            <p style="font-size:12.5px;color:var(--gray-600);line-height:1.6;margin:0 0 10px 0">${notice.message}</p>
            ${canPost ? `<div style="display:flex;gap:6px;margin-top:10px">
              <button class="btn btn-secondary btn-xs" onclick="editNotice(${notice.id})">Edit</button>
              <button class="btn btn-danger btn-xs" onclick="deleteNotice(${notice.id})">Delete</button>
            </div>` : ''}
          </div>
        </div>
      </div>`;
  });
  
  html += `</div>
    </div>
    
    ${canPost ? `<div class="card" style="height:fit-content">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-bullhorn"></i> Post New Notice</span></div>
      <form onsubmit="publishNotice(event)">
        <div class="f-field" style="margin-bottom:12px">
          <label>Notice Title</label>
          <input type="text" id="notice-title" placeholder="Enter title..." required>
        </div>
        <div class="f-field" style="margin-bottom:12px">
          <label>Target Audience</label>
          <select id="notice-audience" required>
            <option value="All">All</option>
            <option value="Students">Students</option>
            <option value="Staff">Staff</option>
            <option value="Teachers">Teachers</option>
            <option value="Parents">Parents</option>
            <option value="Form 3">Form 3 Only</option>
          </select>
        </div>
        <div class="f-field" style="margin-bottom:12px">
          <label>Priority</label>
          <select id="notice-priority" required>
            <option value="Normal">Normal</option>
            <option value="Important">Important</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <div class="f-field" style="margin-bottom:12px">
          <label>Message</label>
          <textarea id="notice-message" placeholder="Write notice content here..." style="min-height:120px" required></textarea>
        </div>
        <div class="f-field" style="margin-bottom:14px">
          <label>Attachment (optional)</label>
          <input type="file" id="notice-attachment">
        </div>
        <div style="display:flex;gap:8px">
          <button type="submit" class="btn btn-primary" style="flex:1"><i class="fas fa-bullhorn"></i> Publish</button>
          <button type="button" class="btn btn-secondary" onclick="draftNotice()">Draft</button>
        </div>
      </form>
    </div>` : ''}
  </div>`;
  
  return html;
}

function filterNotices() {
  const searchTerm = document.getElementById('notice-search').value.toLowerCase();
  const noticeItems = document.querySelectorAll('.notice-item');
  
  noticeItems.forEach(item => {
    const title = item.dataset.title;
    const audience = item.dataset.audience;
    const activeFilter = document.querySelector('.filter-btn.active');
    const audienceFilter = activeFilter ? activeFilter.dataset.audience : 'All';
    
    const matchesSearch = title.includes(searchTerm);
    const matchesAudience = audienceFilter === 'All' || audience === audienceFilter;
    
    item.style.display = matchesSearch && matchesAudience ? 'block' : 'none';
  });
}

function filterByAudience(audience) {
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  if(audience !== 'All') {
    event.target.classList.add('active');
  }
  filterNotices();
}

function publishNotice(event) {
  event.preventDefault();
  
  const title = document.getElementById('notice-title').value;
  const audience = document.getElementById('notice-audience').value;
  const priority = document.getElementById('notice-priority').value;
  const message = document.getElementById('notice-message').value;
  
  if(!title || !message) {
    showToast('<i class="fas fa-times-circle"></i> Please fill all required fields', 'error');
    return;
  }
  
  const newId = Math.max(...NOTICES_DATA.map(n => n.id), 0) + 1;
  const today = new Date().toISOString().split('T')[0];
  
  NOTICES_DATA.unshift({
    id: newId,
    icon: '<i class="fas fa-thumbtack"></i>',
    title,
    audience,
    postedBy: currentRole === 'Teacher' ? 'Teacher' : 'Admin',
    date: today,
    message,
    priority,
    attachment: null
  });
  
  // Reset form
  event.target.reset();
  
  showToast(`<i class="fas fa-check-circle"></i> Notice "${title}" published successfully!`, 'success');
  
  setTimeout(() => {
    renderMain();
  }, 1500);
}

function draftNotice() {
  const title = document.getElementById('notice-title').value;
  
  if(!title) {
    showToast('<i class="fas fa-times-circle"></i> Please enter a title for your draft', 'error');
    return;
  }
  
  showToast(`<i class="fas fa-file-alt"></i> Draft "${title}" saved to your account`, 'info');
  document.querySelector('form[onsubmit="publishNotice(event)"]').reset();
}

function editNotice(noticeId) {
  const notice = NOTICES_DATA.find(n => n.id === noticeId);
  if(!notice) {
    showToast('<i class="fas fa-times-circle"></i> Notice not found', 'error');
    return;
  }
  
  const formHTML = `
    <div style="max-width:850px;background:white;border-radius:12px;overflow:hidden">
      <div style="padding:20px;background:var(--blue-main);color:white">
        <h2 style="margin:0">Edit Notice</h2>
        <p style="margin:8px 0 0 0;font-size:13px;opacity:0.9">${notice.title}</p>
      </div>
      
      <form onsubmit="saveEditNotice(event, ${noticeId})" style="padding:20px">
        <div class="f-field" style="margin-bottom:12px">
          <label>Notice Title</label>
          <input type="text" id="edit-notice-title" value="${notice.title}" required>
        </div>
        
        <div class="f-field" style="margin-bottom:12px">
          <label>Target Audience</label>
          <select id="edit-notice-audience" required>
            <option value="All" ${notice.audience === 'All' ? 'selected' : ''}>All</option>
            <option value="Students" ${notice.audience === 'Students' ? 'selected' : ''}>Students</option>
            <option value="Staff" ${notice.audience === 'Staff' ? 'selected' : ''}>Staff</option>
            <option value="Teachers" ${notice.audience === 'Teachers' ? 'selected' : ''}>Teachers</option>
            <option value="Parents" ${notice.audience === 'Parents' ? 'selected' : ''}>Parents</option>
            <option value="Form 3" ${notice.audience === 'Form 3' ? 'selected' : ''}>Form 3 Only</option>
          </select>
        </div>
        
        <div class="f-field" style="margin-bottom:12px">
          <label>Priority</label>
          <select id="edit-notice-priority" required>
            <option value="Normal" ${notice.priority === 'Normal' ? 'selected' : ''}>Normal</option>
            <option value="Important" ${notice.priority === 'Important' ? 'selected' : ''}>Important</option>
            <option value="Urgent" ${notice.priority === 'Urgent' ? 'selected' : ''}>Urgent</option>
          </select>
        </div>
        
        <div class="f-field" style="margin-bottom:12px">
          <label>Message</label>
          <textarea id="edit-notice-message" style="min-height:120px" required>${notice.message}</textarea>
        </div>
        
        <div style="display:flex;gap:8px;margin-top:20px;justify-content:flex-end">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  `;
  
  openModal(formHTML);
}

function saveEditNotice(event, noticeId) {
  event.preventDefault();
  
  const notice = NOTICES_DATA.find(n => n.id === noticeId);
  if(!notice) {
    showToast('<i class="fas fa-times-circle"></i> Notice not found', 'error');
    return;
  }
  
  notice.title = document.getElementById('edit-notice-title').value;
  notice.audience = document.getElementById('edit-notice-audience').value;
  notice.priority = document.getElementById('edit-notice-priority').value;
  notice.message = document.getElementById('edit-notice-message').value;
  
  closeModal();
  showToast('<i class="fas fa-check-circle"></i> Notice updated successfully!', 'success');
  
  setTimeout(() => {
    renderMain();
  }, 1500);
}

function deleteNotice(noticeId) {
  const notice = NOTICES_DATA.find(n => n.id === noticeId);
  if(!notice) {
    showToast('<i class="fas fa-times-circle"></i> Notice not found', 'error');
    return;
  }
  
  if(confirm(`Are you sure you want to delete "${notice.title}"? This action cannot be undone.`)) {
    NOTICES_DATA.splice(NOTICES_DATA.indexOf(notice), 1);
    showToast('<i class="fas fa-check-circle"></i> Notice deleted successfully!', 'success');
    
    setTimeout(() => {
      renderMain();
    }, 1500);
  }
}

// MESSAGING MODULE
function messagingModule(){
  // Route to role-specific messaging interface
  if(currentRole === 'Student') return studentMessagingModule();
  if(currentRole === 'Parent') return parentMessagingModule();
  if(currentRole === 'Teacher') return teacherMessagingModule();
  if(currentRole === 'Admin') return adminMessagingModule();
  
  // Default fallback
  return defaultMessagingModule();
}

// GET CONTACT INFO 
const contactInfo = {
  'Ama Osei': {name: 'Ama Osei', role: 'Student', avatar: 'purple', status: 'Online'},
  'Mr. Amponsah': {name: 'Mr. Kweku Amponsah', role: 'Teacher', avatar: 'blue', status: 'Online'},
  'Mrs. Asante': {name: 'Mrs. Adwoa Asante', role: 'Teacher', avatar: 'purple', status: 'Away'},
  'Mr. Oduro': {name: 'Mr. Samuel Oduro', role: 'Teacher', avatar: 'green', status: 'Offline'},
  'Parent Serwaa': {name: 'Parent Serwaa', role: 'Parent', avatar: 'gold', status: 'Offline'},
  'Admin Office': {name: 'Admin Office', role: 'Admin', avatar: 'blue', status: 'Online'}
};

// STUDENT MESSAGING MODULE
function studentMessagingModule(){
  // Students can only see messages from teachers
  const relevantMsgs = allMessages.filter(m => 
    (m.sender === 'Ama Osei' && m.recipient !== 'Ama Osei') ||
    (m.recipient === 'Ama Osei')
  );
  
  // Get unique conversations
  const conversations = {};
  relevantMsgs.forEach(msg => {
    const otherPerson = msg.sender === 'Ama Osei' ? msg.recipient : msg.sender;
    if(!conversations[otherPerson]) {
      conversations[otherPerson] = {
        name: otherPerson,
        info: contactInfo[otherPerson],
        lastMsg: msg.text,
        time: msg.time
      };
    } else {
      conversations[otherPerson].lastMsg = msg.text;
      conversations[otherPerson].time = msg.time;
    }
  });
  
  if(!currentChat) currentChat = Object.keys(conversations)[0];
  
  const chatMessages = relevantMsgs.filter(m => 
    (m.sender === 'Ama Osei' && m.recipient === currentChat) ||
    (m.sender === currentChat && m.recipient === 'Ama Osei')
  ).sort((a,b) => a.id - b.id);
  
  const conversationsList = Object.entries(conversations).map(([name, conv]) => {
    const isActive = name === currentChat;
    return `
      <div class="sb-item" style="padding:10px 8px;border-radius:10px;cursor:pointer;background:${isActive?'var(--blue-main)':'transparent'};margin-bottom:3px;transition:all .2s" 
           onclick="currentChat='${name}';renderMain()">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
          <div class="av av-sm av-${conv.info.avatar}">${name[0]}</div>
          <span style="font-size:12px;font-weight:600;flex:1;color:${isActive?'white':'var(--gray-700)'}">${name}</span>
          <span style="font-size:10px;color:${isActive?'rgba(255,255,255,.7)':'var(--gray-400)'}">${conv.time}</span>
        </div>
        <div style="font-size:11px;color:${isActive?'rgba(255,255,255,.8)':'var(--gray-400)'};padding-left:34px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${conv.lastMsg}</div>
      </div>
    `;
  }).join('');
  
  const currentContact = contactInfo[currentChat];
  const messagesHTML = chatMessages.map(msg => {
    const isSender = msg.sender === 'Ama Osei';
    return `
      <div class="chat-msg${isSender ? ' me' : ''}">
        <div class="av av-sm av-${isSender ? 'purple' : currentContact.avatar}">${msg.sender.charAt(0)}</div>
        <div>
          <div class="chat-bubble${isSender ? ' me-bubble' : ' them'}">${msg.text}</div>
          <div class="chat-meta${isSender ? ' me' : ''}" style="${isSender ? 'text-align:right' : ''}">
            ${isSender ? 'You' : msg.sender} · ${msg.time}
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  return hdr('Messages','Internal school communication system','Messages')+`
  <div class="g21">
    <div class="card">
      <div style="display:flex;gap:0;height:440px">
        <div style="width:190px;border-right:1px solid var(--gray-200);padding-right:14px;overflow-y:auto;flex-shrink:0">
          <div style="font-size:10px;font-weight:700;color:var(--gray-400);text-transform:uppercase;margin-bottom:10px;letter-spacing:.6px">Teachers</div>
          ${conversationsList || '<div style="color:var(--gray-400);font-size:12px;padding:10px">No messages yet</div>'}
        </div>
        <div style="flex:1;padding-left:16px;display:flex;flex-direction:column;min-width:0">
          ${currentChat && currentContact ? `
          <div style="display:flex;align-items:center;gap:10px;padding-bottom:12px;border-bottom:1px solid var(--gray-200);margin-bottom:12px">
            <div class="av av-sm av-${currentContact.avatar}">${currentChat[0]}</div>
            <div>
              <div style="font-size:13px;font-weight:700">${currentContact.name}</div>
              <div style="font-size:11px;color:var(--gray-400)">${currentContact.role} · ${currentContact.status}</div>
            </div>
          </div>
          <div class="chat-msgs" style="flex:1;overflow-y:auto;padding-right:8px">
            ${messagesHTML}
          </div>
          <div class="chat-input-row">
            <input class="chat-inp" placeholder="Type your message..." onkeypress="if(event.key==='Enter') sendChatMessage('Ama Osei', '${currentChat}', this.value); this.value='';">
            <button class="chat-send" onclick="const inp = this.previousElementSibling; sendChatMessage('Ama Osei', '${currentChat}', inp.value); inp.value='';">➤</button>
          </div>
          ` : '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--gray-400)">No conversations yet</div>'}
        </div>
      </div>
    </div>
  </div>`;
}

// PARENT MESSAGING MODULE
function parentMessagingModule(){
  // Parents can message Admin and Teachers about their children
  const relevantMsgs = allMessages.filter(m => 
    (m.sender === 'Parent Serwaa') || (m.recipient === 'Parent Serwaa')
  );
  
  const conversations = {};
  relevantMsgs.forEach(msg => {
    const otherPerson = msg.sender === 'Parent Serwaa' ? msg.recipient : msg.sender;
    if(!conversations[otherPerson]) {
      conversations[otherPerson] = {
        name: otherPerson,
        info: contactInfo[otherPerson],
        lastMsg: msg.text,
        time: msg.time
      };
    } else {
      conversations[otherPerson].lastMsg = msg.text;
      conversations[otherPerson].time = msg.time;
    }
  });
  
  if(!currentChat) currentChat = Object.keys(conversations)[0];
  
  const chatMessages = relevantMsgs.filter(m => 
    (m.sender === 'Parent Serwaa' && m.recipient === currentChat) ||
    (m.sender === currentChat && m.recipient === 'Parent Serwaa')
  ).sort((a,b) => a.id - b.id);
  
  const conversationsList = Object.entries(conversations).map(([name, conv]) => {
    const isActive = name === currentChat;
    return `
      <div class="sb-item" style="padding:10px 8px;border-radius:10px;cursor:pointer;background:${isActive?'var(--blue-main)':'transparent'};margin-bottom:3px" 
           onclick="currentChat='${name}';renderMain()">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
          <div class="av av-sm av-${conv.info.avatar}">${name[0]}</div>
          <span style="font-size:12px;flex:1;color:${isActive?'white':'var(--gray-700)'}">${name}</span>
        </div>
        <div style="font-size:11px;color:${isActive?'rgba(255,255,255,.8)':'var(--gray-400)'};padding-left:34px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${conv.lastMsg}</div>
      </div>
    `;
  }).join('');
  
  const currentContact = contactInfo[currentChat];
  const messagesHTML = chatMessages.map(msg => {
    const isSender = msg.sender === 'Parent Serwaa';
    return `
      <div class="chat-msg${isSender ? ' me' : ''}">
        <div class="av av-sm av-${isSender ? 'gold' : currentContact.avatar}">${msg.sender.charAt(0)}</div>
        <div>
          <div class="chat-bubble${isSender ? ' me-bubble' : ' them'}">${msg.text}</div>
          <div class="chat-meta${isSender ? ' me' : ''}" style="${isSender ? 'text-align:right' : ''}">
            ${isSender ? 'You' : msg.sender} · ${msg.time}
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  return hdr('Messages','Connect with teachers and administration','Messages')+`
  <div class="g21">
    <div class="card">
      <div style="display:flex;gap:0;height:440px">
        <div style="width:190px;border-right:1px solid var(--gray-200);padding-right:14px;overflow-y:auto;flex-shrink:0">
          <div style="font-size:10px;font-weight:700;color:var(--gray-400);text-transform:uppercase;margin-bottom:10px;letter-spacing:.6px">Contacts</div>
          ${conversationsList || '<div style="color:var(--gray-400);font-size:12px;padding:10px">No messages yet</div>'}
        </div>
        <div style="flex:1;padding-left:16px;display:flex;flex-direction:column;min-width:0">
          ${currentChat && currentContact ? `
          <div style="display:flex;align-items:center;gap:10px;padding-bottom:12px;border-bottom:1px solid var(--gray-200);margin-bottom:12px">
            <div class="av av-sm av-${currentContact.avatar}">${currentChat[0]}</div>
            <div>
              <div style="font-size:13px;font-weight:700">${currentContact.name}</div>
              <div style="font-size:11px;color:var(--gray-400)">${currentContact.role} · ${currentContact.status}</div>
            </div>
          </div>
          <div class="chat-msgs" style="flex:1;overflow-y:auto;padding-right:8px">
            ${messagesHTML}
          </div>
          <div class="chat-input-row">
            <input class="chat-inp" placeholder="Type your message..." onkeypress="if(event.key==='Enter') sendChatMessage('Parent Serwaa', '${currentChat}', this.value); this.value='';">
            <button class="chat-send" onclick="const inp = this.previousElementSibling; sendChatMessage('Parent Serwaa', '${currentChat}', inp.value); inp.value='';">➤</button>
          </div>
          ` : '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--gray-400)">No conversations yet</div>'}
        </div>
      </div>
    </div>
  </div>`;
}

// TEACHER MESSAGING MODULE
function teacherMessagingModule(){
  // Teachers can see messages from students and parents
  const relevantMsgs = allMessages.filter(m => 
    m.recipient === 'Mr. Amponsah' || m.sender === 'Mr. Amponsah'
  );
  
  const conversations = {};
  relevantMsgs.forEach(msg => {
    const otherPerson = msg.sender === 'Mr. Amponsah' ? msg.recipient : msg.sender;
    if(!conversations[otherPerson]) {
      conversations[otherPerson] = {
        name: otherPerson,
        info: contactInfo[otherPerson],
        lastMsg: msg.text,
        time: msg.time
      };
    } else {
      conversations[otherPerson].lastMsg = msg.text;
      conversations[otherPerson].time = msg.time;
    }
  });
  
  if(!currentChat) currentChat = Object.keys(conversations)[0];
  
  const chatMessages = relevantMsgs.filter(m => 
    (m.sender === 'Mr. Amponsah' && m.recipient === currentChat) ||
    (m.sender === currentChat && m.recipient === 'Mr. Amponsah')
  ).sort((a,b) => a.id - b.id);
  
  const conversationsList = Object.entries(conversations).map(([name, conv]) => {
    const isActive = name === currentChat;
    return `
      <div class="sb-item" style="padding:10px 8px;border-radius:10px;cursor:pointer;background:${isActive?'var(--blue-main)':'transparent'};margin-bottom:3px" 
           onclick="currentChat='${name}';renderMain()">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
          <div class="av av-sm av-${conv.info.avatar}">${name[0]}</div>
          <span style="font-size:12px;flex:1;color:${isActive?'white':'var(--gray-700)'}">${name}</span>
        </div>
        <div style="font-size:11px;color:${isActive?'rgba(255,255,255,.8)':'var(--gray-400)'};padding-left:34px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${conv.lastMsg}</div>
      </div>
    `;
  }).join('');
  
  const currentContact = contactInfo[currentChat];
  const messagesHTML = chatMessages.map(msg => {
    const isSender = msg.sender === 'Mr. Amponsah';
    return `
      <div class="chat-msg${isSender ? ' me' : ''}">
        <div class="av av-sm av-${isSender ? 'blue' : currentContact.avatar}">${msg.sender.charAt(0)}</div>
        <div>
          <div class="chat-bubble${isSender ? ' me-bubble' : ' them'}">${msg.text}</div>
          <div class="chat-meta${isSender ? ' me' : ''}" style="${isSender ? 'text-align:right' : ''}">
            ${isSender ? 'You' : msg.sender} · ${msg.time}
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  return hdr('Messages','Communicate with students and parents','Messages')+`
  <div class="g21">
    <div class="card">
      <div style="display:flex;gap:0;height:440px">
        <div style="width:190px;border-right:1px solid var(--gray-200);padding-right:14px;overflow-y:auto;flex-shrink:0">
          <div style="font-size:10px;font-weight:700;color:var(--gray-400);text-transform:uppercase;margin-bottom:10px;letter-spacing:.6px">Conversations</div>
          ${conversationsList || '<div style="color:var(--gray-400);font-size:12px;padding:10px">No messages yet</div>'}
        </div>
        <div style="flex:1;padding-left:16px;display:flex;flex-direction:column;min-width:0">
          ${currentChat && currentContact ? `
          <div style="display:flex;align-items:center;gap:10px;padding-bottom:12px;border-bottom:1px solid var(--gray-200);margin-bottom:12px">
            <div class="av av-sm av-${currentContact.avatar}">${currentChat[0]}</div>
            <div>
              <div style="font-size:13px;font-weight:700">${currentContact.name}</div>
              <div style="font-size:11px;color:var(--gray-400)">${currentContact.role} · ${currentContact.status}</div>
            </div>
          </div>
          <div class="chat-msgs" style="flex:1;overflow-y:auto;padding-right:8px">
            ${messagesHTML}
          </div>
          <div class="chat-input-row">
            <input class="chat-inp" placeholder="Type your message..." onkeypress="if(event.key==='Enter') sendChatMessage('Mr. Amponsah', '${currentChat}', this.value); this.value='';">
            <button class="chat-send" onclick="const inp = this.previousElementSibling; sendChatMessage('Mr. Amponsah', '${currentChat}', inp.value); inp.value='';">➤</button>
          </div>
          ` : '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--gray-400)">No conversations yet</div>'}
        </div>
      </div>
    </div>
  </div>`;
}

// ADMIN MESSAGING MODULE
function adminMessagingModule(){
  // Admin sees all messages
  const allConversations = {};
  allMessages.forEach(msg => {
    const key = [msg.sender, msg.recipient].sort().join('|');
    const otherPerson = msg.sender === 'Admin Office' ? msg.recipient : msg.sender;
    
    if(!allConversations[key]) {
      allConversations[key] = {
        name: otherPerson,
        info: contactInfo[otherPerson],
        lastMsg: msg.text,
        time: msg.time,
        unread: true
      };
    }
  });
  
  if(!currentChat) currentChat = Object.values(allConversations)[0]?.name;
  
  const chatMessages = allMessages.filter(m => 
    (m.sender === 'Admin Office' && m.recipient === currentChat) ||
    (m.sender === currentChat && m.recipient === 'Admin Office')
  ).sort((a,b) => a.id - b.id);
  
  const conversationsList = Object.entries(allConversations).map(([key, conv]) => {
    const isActive = conv.name === currentChat;
    return `
      <div class="sb-item" style="padding:10px 8px;border-radius:10px;cursor:pointer;background:${isActive?'var(--blue-main)':'transparent'};margin-bottom:3px" 
           onclick="currentChat='${conv.name}';renderMain()">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
          <div class="av av-sm av-${conv.info.avatar}">${conv.name[0]}</div>
          <span style="font-size:12px;flex:1;color:${isActive?'white':'var(--gray-700)'}">${conv.name}</span>
          ${conv.unread ? '<span style="background:var(--danger);color:#fff;border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700">1</span>' : ''}
        </div>
        <div style="font-size:11px;color:${isActive?'rgba(255,255,255,.8)':'var(--gray-400)'};padding-left:34px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${conv.lastMsg}</div>
      </div>
    `;
  }).join('');
  
  const currentContact = contactInfo[currentChat];
  const messagesHTML = chatMessages.map(msg => {
    const isSender = msg.sender === 'Admin Office';
    return `
      <div class="chat-msg${isSender ? ' me' : ''}">
        <div class="av av-sm av-${isSender ? 'blue' : currentContact.avatar}">${msg.sender.charAt(0)}</div>
        <div>
          <div class="chat-bubble${isSender ? ' me-bubble' : ' them'}">${msg.text}</div>
          <div class="chat-meta${isSender ? ' me' : ''}" style="${isSender ? 'text-align:right' : ''}">
            ${isSender ? 'Admin' : msg.sender} · ${msg.time}
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  return hdr('Messages','Manage all school communications','Messages')+`
  <div class="g21">
    <div class="card">
      <div style="display:flex;gap:0;height:440px">
        <div style="width:220px;border-right:1px solid var(--gray-200);padding-right:14px;overflow-y:auto;flex-shrink:0">
          <div style="font-size:10px;font-weight:700;color:var(--gray-400);text-transform:uppercase;margin-bottom:10px;letter-spacing:.6px">All Conversations</div>
          ${conversationsList || '<div style="color:var(--gray-400);font-size:12px;padding:10px">No messages</div>'}
        </div>
        <div style="flex:1;padding-left:16px;display:flex;flex-direction:column;min-width:0">
          ${currentChat && currentContact ? `
          <div style="display:flex;align-items:center;gap:10px;padding-bottom:12px;border-bottom:1px solid var(--gray-200);margin-bottom:12px">
            <div class="av av-sm av-${currentContact.avatar}">${currentChat[0]}</div>
            <div>
              <div style="font-size:13px;font-weight:700">${currentContact.name}</div>
              <div style="font-size:11px;color:var(--gray-400)">${currentContact.role} · ${currentContact.status}</div>
            </div>
          </div>
          <div class="chat-msgs" style="flex:1;overflow-y:auto;padding-right:8px">
            ${messagesHTML}
          </div>
          <div class="chat-input-row">
            <input class="chat-inp" placeholder="Type your message..." onkeypress="if(event.key==='Enter') sendChatMessage('Admin Office', '${currentChat}', this.value); this.value='';">
            <button class="chat-send" onclick="const inp = this.previousElementSibling; sendChatMessage('Admin Office', '${currentChat}', inp.value); inp.value='';">➤</button>
          </div>
          ` : '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--gray-400)">No conversations</div>'}
        </div>
      </div>
    </div>
  </div>`;
}

// DEFAULT MESSAGING MODULE
function defaultMessagingModule(){
  return hdr('Messages','Communication system','Messages')+`
  <div class="card" style="text-align:center;padding:40px">
    <div style="font-size:48px;margin-bottom:16px"><i class="fas fa-inbox" style="color:var(--gray-300)"></i></div>
    <p style="color:var(--gray-400);font-size:14px">Messaging module is not available for your role.</p>
  </div>`;
}

// SEND CHAT MESSAGE
function sendChatMessage(sender, recipient, message){
  if(!message.trim()){
    showToast('<i class="fas fa-times-circle"></i> Please type a message','error');
    return;
  }
  
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'});
  
  allMessages.push({
    id: allMessages.length + 1,
    sender: sender,
    senderRole: currentRole,
    recipient: recipient,
    recipientRole: contactInfo[recipient].role,
    subject: 'Message',
    text: message,
    time: timeStr,
    date: now.toLocaleDateString()
  });
  
  showToast('<i class="fas fa-check-circle"></i> Message sent!','success');
  renderMain();
}

// SWITCH BETWEEN CONVERSATIONS
function switchChat(chatName){
  currentChat = chatName;
  renderMain();
}

// SEND MESSAGE IN CURRENT CONVERSATION - LEGACY (kept for compatibility)
function sendMessage(btn) {
  const input = btn.previousElementSibling;
  const message = input.value.trim();
  
  if (!message) {
    showToast('<i class="fas fa-times-circle"></i> Please type a message', 'error');
    return;
  }
  
  sendChatMessage(currentRole, currentChat, message);
  input.value = '';
  input.focus();
}

// CONTACT MESSAGES MODULE
function contactMessagesModule(){
  const unreadCount = contactMessages.filter(m => !m.read).length;
  const messagesHTML = contactMessages.length === 0 ? `
    <div style="text-align:center;padding:40px 20px;color:var(--gray-400)">
      <div style="font-size:48px;margin-bottom:12px"><i class="fas fa-envelope" style="color:var(--gray-300)"></i></div>
      <p style="font-size:14px">No messages yet. When visitors contact you, they'll appear here.</p>
    </div>
  ` : contactMessages.slice().reverse().map(msg => `
    <div class="card mb12" style="border-left:3px solid ${msg.read ? 'var(--gray-200)' : 'var(--blue-main)'};background:${msg.read ? 'var(--gray-50)' : 'var(--blue-xpale)'}">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px">
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <h4 style="font-size:13px;font-weight:700;color:var(--gray-800)">${msg.name}</h4>
            ${msg.read ? '' : '<span class="badge b-success" style="font-size:10px">New</span>'}
          </div>
          <div style="font-size:11px;color:var(--gray-500)"><strong>${msg.email}</strong> · ${msg.date} at ${msg.time}</div>
        </div>
        <button class="btn btn-icon danger" onclick="deleteContactMessage(${msg.id})"><i class="fas fa-trash"></i></button>
      </div>
      <div style="margin-bottom:8px">
        <div style="font-size:12px;font-weight:600;color:var(--blue-dark);margin-bottom:4px">Subject: ${msg.subject}</div>
        <div style="font-size:12.5px;color:var(--gray-700);line-height:1.6;background:white;padding:10px 12px;border-radius:6px;border:1px solid var(--gray-200)">${msg.message}</div>
      </div>
      <div style="display:flex;gap:6px">
        <button class="btn ${msg.read ? 'btn-secondary' : 'btn-primary'} btn-xs" onclick="markMessageAs(${msg.id}, ${!msg.read})">${msg.read ? '<i class="fas fa-book-open"></i> Mark Unread' : '✓ Mark Read'}</button>
        <button class="btn btn-secondary btn-xs" onclick="replyToMessage(${msg.id})"><i class="fas fa-reply"></i> Reply</button>
      </div>
    </div>
  `).join('');
  
  return hdr('Contact Messages', `${contactMessages.length} total • ${unreadCount} unread`, 'Contact Messages') + `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
    <div style="display:flex;gap:8px">
      <button class="btn btn-secondary btn-sm" onclick="markAllAsRead()">Mark All Read</button>
      <button class="btn btn-secondary btn-sm" onclick="deleteAllMessages()" style="color:var(--danger)">Delete All</button>
    </div>
    <div style="font-size:12px;color:var(--gray-500)">${contactMessages.length} messages · ${unreadCount} unread</div>
  </div>
  ${messagesHTML}`;
}

function markMessageAs(id, read){
  const msg = contactMessages.find(m => m.id === id);
  if(msg) {
    msg.read = read;
    renderSidebar();
    renderMain();
    showToast(`<i class="fas fa-check-circle"></i> Message marked as ${read ? 'read' : 'unread'}`, 'success');
  }
}

function markAllAsRead(){
  contactMessages.forEach(m => m.read = true);
  renderSidebar();
  renderMain();
  showToast('<i class="fas fa-check-circle"></i> All messages marked as read', 'success');
}

function deleteContactMessage(id){
  if(confirm('Delete this message?')){
    contactMessages = contactMessages.filter(m => m.id !== id);
    renderSidebar();
    renderMain();
    showToast('<i class="fas fa-check-circle"></i> Message deleted', 'success');
  }
}

function deleteAllMessages(){
  if(contactMessages.length === 0) {
    showToast('<i class="fas fa-times-circle"></i> No messages to delete', 'warning');
    return;
  }
  if(confirm(`Delete all ${contactMessages.length} messages? This cannot be undone.`)){
    contactMessages = [];
    renderSidebar();
    renderMain();
    showToast('<i class="fas fa-check-circle"></i> All messages deleted', 'success');
  }
}

function replyToMessage(id){
  const msg = contactMessages.find(m => m.id === id);
  if(!msg) return;
  
  openModal(`
    <div style="padding:20px;min-width:500px">
      <div style="font-size:16px;font-weight:700;margin-bottom:16px">Reply to ${msg.name}</div>
      <div style="background:var(--gray-50);padding:12px;border-radius:6px;margin-bottom:16px;border-left:3px solid var(--blue-main)">
        <div style="font-size:11px;color:var(--gray-500);margin-bottom:4px"><strong>${msg.email}</strong></div>
        <div style="font-size:12px;color:var(--gray-700)"><strong>Re: ${msg.subject}</strong></div>
        <div style="font-size:12px;color:var(--gray-600);margin-top:8px;font-style:italic">"${msg.message}"</div>
      </div>
      <div class="f-field" style="margin-bottom:12px">
        <label>Your Reply</label>
        <textarea class="reply-textarea" placeholder="Type your reply..." style="min-height:140px"></textarea>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-primary" onclick="sendReply('${msg.id}', '${msg.email}')">Send Reply</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

function sendReply(msgId, recipientEmail){
  const textarea = document.querySelector('.reply-textarea');
  const reply = textarea?.value.trim();
  
  if(!reply) {
    showToast('<i class="fas fa-times-circle"></i> Please type a reply', 'error');
    return;
  }
  
  showToast(`<i class="fas fa-check-circle"></i> Reply sent to ${recipientEmail}!`, 'success');
  closeModal();
  
  // Mark original message as read
  const msg = contactMessages.find(m => m.id == msgId);
  if(msg) msg.read = true;
  renderSidebar();
  renderMain();
}

// REPORTS MODULE
function reportsModule(){
  return hdr('Reports & Analytics','School performance data and comprehensive reports','Reports')+`
  <div class="stats-row">
    ${statCard('<i class="fas fa-chart-bar"></i>','88.7%','Avg Pass Rate','This term','up','si-blue')}
    ${statCard('<i class="fas fa-check-circle"></i>','94.2%','Avg Attendance','Monthly','up','si-green')}
    ${statCard('<i class="fas fa-money-bill"></i>','88.6%','Fees Collection','Of target','up','si-gold')}
    ${statCard('<i class="fas fa-trophy"></i>','3.6','Average GPA','All students','up','si-purple')}
  </div>
  <div class="mod-tabs" id="report-tabs">
    ${['Overview','Academic','Attendance','Financial','Enrollment'].map((t,i)=>`<div class="mod-tab ${i===0?'active':''}" onclick="switchReportTab(this,${i})">${t}</div>`).join('')}
  </div>

  <!-- OVERVIEW TAB -->
  <div class="report-tab-content active" data-tab="0">
    <div class="g2 mb20">
      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-line"></i> 12-Month Performance Trend</span></div>
        <div style="display:flex;gap:5px;align-items:flex-end;height:150px;padding:10px 0">
          ${[[70,80],[72,82],[68,79],[75,85],[78,88],[80,90],[82,88],[85,91],[83,89],[86,92],[88,93],[87,92]].map(([t,e])=>`
          <div style="flex:1;display:flex;gap:2px;align-items:flex-end">
            <div style="flex:1;background:var(--blue-main);opacity:.8;border-radius:3px 3px 0 0;height:${t*1.4}px"></div>
            <div style="flex:1;background:var(--gold);opacity:.75;border-radius:3px 3px 0 0;height:${e*1.4}px"></div>
          </div>`).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--gray-400);padding:0 2px">
          ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m=>`<span>${m}</span>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-clipboard-list"></i> Quick Reports</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${[['Academic','<i class="fas fa-chart-bar"></i>'],['Attendance','<i class="fas fa-check-circle"></i>'],['Financial','<i class="fas fa-money-bill"></i>'],['Enrollment','<i class="fas fa-graduation-cap"></i>'],['Exam Results','<i class="fas fa-chart-line"></i>'],['Top Performers','<i class="fas fa-trophy"></i>']].map(([name,icon])=>`
          <button class="btn btn-secondary" style="font-size:11px;padding:12px" onclick="generateReportPDF('${name}')"><span style="font-size:14px;margin-right:4px">${icon}</span>${name}</button>`).join('')}
        </div>
      </div>
    </div>
  </div>

  <!-- ACADEMIC TAB -->
  <div class="report-tab-content" data-tab="1">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-bar"></i> Academic Performance Report</span></div>
      <div style="display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap">
        <div class="search-bar" style="flex:1;min-width:200px"><span><i class="fas fa-search"></i></span><input placeholder="Search by class or subject..." id="academic-search" onkeyup="filterReportTab('academic')"></div>
        <select id="academic-filter" class="select-sm" onchange="filterReportTab('academic')"><option value="">All Classes</option><option value="JHS 1">JHS 1</option><option value="JHS 2">JHS 2</option><option value="JHS 3">JHS 3</option></select>
        <button class="btn btn-primary" onclick="generateReportPDF('Academic')"><i class="fas fa-download"></i> Export PDF</button>
      </div>
      <table class="tbl" id="academic-table">
        <thead><tr><th>Class</th><th>Subject</th><th>Pass Rate</th><th>Avg Score</th><th>Grade A</th><th>Grade B</th><th>Grade C</th></tr></thead>
        <tbody id="academic-tbody">
          <tr class="academic-row" data-class="JHS 1" data-search="jhs 1 mathematics"><td>JHS 1</td><td>Mathematics</td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">92%</span></td><td>78</td><td>18</td><td>22</td><td>10</td></tr>
          <tr class="academic-row" data-class="JHS 1" data-search="jhs 1 english"><td>JHS 1</td><td>English</td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">88%</span></td><td>75</td><td>15</td><td>24</td><td>11</td></tr>
          <tr class="academic-row" data-class="JHS 2" data-search="jhs 2 mathematics"><td>JHS 2</td><td>Mathematics</td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">85%</span></td><td>72</td><td>12</td><td>28</td><td>14</td></tr>
          <tr class="academic-row" data-class="JHS 2" data-search="jhs 2 science"><td>JHS 2</td><td>Science</td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">90%</span></td><td>76</td><td>20</td><td>20</td><td>6</td></tr>
          <tr class="academic-row" data-class="JHS 3" data-search="jhs 3 mathematics"><td>JHS 3</td><td>Mathematics</td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">88%</span></td><td>74</td><td>16</td><td>26</td><td>12</td></tr>
          <tr class="academic-row" data-class="JHS 3" data-search="jhs 3 english"><td>JHS 3</td><td>English</td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">85%</span></td><td>71</td><td>14</td><td>24</td><td>16</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ATTENDANCE TAB -->
  <div class="report-tab-content" data-tab="2">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-check-circle"></i> Attendance Summary Report</span></div>
      <div style="display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap">
        <div class="search-bar" style="flex:1;min-width:200px"><span><i class="fas fa-search"></i></span><input placeholder="Search by student name..." id="attendance-search" onkeyup="filterReportTab('attendance')"></div>
        <select id="attendance-filter" class="select-sm" onchange="filterReportTab('attendance')"><option value="">All Periods</option><option value="First">First Term</option><option value="Second">Second Term</option><option value="Third">Third Term</option></select>
        <button class="btn btn-primary" onclick="generateReportPDF('Attendance')"><i class="fas fa-download"></i> Export PDF</button>
      </div>
      <table class="tbl" id="attendance-table">
        <thead><tr><th>Student</th><th>Class</th><th>Present</th><th>Absent</th><th>Late</th><th>Attendance %</th><th>Status</th></tr></thead>
        <tbody id="attendance-tbody">
          <tr class="attendance-row" data-student="ama serwaa" data-period="First"><td>Ama Serwaa</td><td>JHS 1</td><td>168</td><td>2</td><td>0</td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">98%</span></td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">Excellent</span></td></tr>
          <tr class="attendance-row" data-student="kwame mensah" data-period="First"><td>Kwame Mensah</td><td>JHS 1</td><td>165</td><td>4</td><td>1</td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">96%</span></td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">Very Good</span></td></tr>
          <tr class="attendance-row" data-student="nana yaa" data-period="First"><td>Nana Yaa</td><td>JHS 2</td><td>162</td><td>6</td><td>2</td><td><span class="badge b-warning" style="background:#fef3c7;color:#92400e">94%</span></td><td><span class="badge b-warning" style="background:#fef3c7;color:#92400e">Good</span></td></tr>
          <tr class="attendance-row" data-student="kofi asante" data-period="First"><td>Kofi Asante</td><td>JHS 2</td><td>170</td><td>0</td><td>0</td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">98%</span></td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">Excellent</span></td></tr>
          <tr class="attendance-row" data-student="afua owusu" data-period="First"><td>Afua Owusu</td><td>JHS 3</td><td>168</td><td>3</td><td>1</td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">97%</span></td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">Excellent</span></td></tr>
          <tr class="attendance-row" data-student="yaw boateng" data-period="First"><td>Yaw Boateng</td><td>JHS 3</td><td>165</td><td>5</td><td>2</td><td><span class="badge b-warning" style="background:#fef3c7;color:#92400e">95%</span></td><td><span class="badge b-warning" style="background:#fef3c7;color:#92400e">Good</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- FINANCIAL TAB -->
  <div class="report-tab-content" data-tab="3">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-money-bill"></i> Financial Summary Report</span></div>
      <div style="display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap">
        <select id="financial-filter" class="select-sm" onchange="filterReportTab('financial')"><option value="">All Months</option><option value="January">January</option><option value="February">February</option><option value="March">March</option><option value="April">April</option></select>
        <button class="btn btn-primary" onclick="generateReportPDF('Financial')"><i class="fas fa-download"></i> Export PDF</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:20px">
        <div class="card" style="background:linear-gradient(135deg,var(--blue-main),#2563eb)">
          <div style="color:#fff;padding:15px">
            <div style="font-size:11px;opacity:.8;margin-bottom:5px">TOTAL INCOME</div>
            <div style="font-size:24px;font-weight:700">GHS 245,800</div>
            <div style="font-size:10px;opacity:.7;margin-top:8px">↑ 12% from last month</div>
          </div>
        </div>
        <div class="card" style="background:linear-gradient(135deg,var(--danger),#dc2626)">
          <div style="color:#fff;padding:15px">
            <div style="font-size:11px;opacity:.8;margin-bottom:5px">TOTAL EXPENDITURE</div>
            <div style="font-size:24px;font-weight:700">GHS 156,400</div>
            <div style="font-size:10px;opacity:.7;margin-top:8px">↑ 8% from last month</div>
          </div>
        </div>
        <div class="card" style="background:linear-gradient(135deg,var(--success),#10b981)">
          <div style="color:#fff;padding:15px">
            <div style="font-size:11px;opacity:.8;margin-bottom:5px">NET SURPLUS</div>
            <div style="font-size:24px;font-weight:700">GHS 89,400</div>
            <div style="font-size:10px;opacity:.7;margin-top:8px">↑ 16% improvement</div>
          </div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px">
        <div>
          <div style="font-weight:600;margin-bottom:10px;font-size:13px">Income Breakdown</div>
          <table class="tbl" style="font-size:12px">
            <thead><tr><th>Source</th><th>Amount</th><th>%</th></tr></thead>
            <tbody>
              <tr><td>Tuition Fees</td><td>GHS 188,500</td><td>76.8%</td></tr>
              <tr><td>Donations</td><td>GHS 57,300</td><td>23.2%</td></tr>
            </tbody>
          </table>
        </div>
        <div>
          <div style="font-weight:600;margin-bottom:10px;font-size:13px">Expenditure Breakdown</div>
          <table class="tbl" style="font-size:12px">
            <thead><tr><th>Category</th><th>Amount</th><th>%</th></tr></thead>
            <tbody>
              <tr><td>Staff Salaries</td><td>GHS 98,500</td><td>63.0%</td></tr>
              <tr><td>Supplies & Materials</td><td>GHS 57,900</td><td>37.0%</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- ENROLLMENT TAB -->
  <div class="report-tab-content" data-tab="4">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-graduation-cap"></i> Enrollment Statistics Report</span></div>
      <div style="display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap">
        <select id="enrollment-class-filter" class="select-sm" onchange="filterReportTab('enrollment')"><option value="">All Classes</option><option value="JHS 1">JHS 1</option><option value="JHS 2">JHS 2</option><option value="JHS 3">JHS 3</option></select>
        <select id="enrollment-gender-filter" class="select-sm" onchange="filterReportTab('enrollment')"><option value="">All Genders</option><option value="Male">Male</option><option value="Female">Female</option></select>
        <button class="btn btn-primary" onclick="generateReportPDF('Enrollment')"><i class="fas fa-download"></i> Export PDF</button>
      </div>
      <table class="tbl" id="enrollment-table">
        <thead><tr><th>Class</th><th>Total</th><th>Male</th><th>Female</th><th>New Students</th><th>Returning</th><th>Avg Age</th></tr></thead>
        <tbody id="enrollment-tbody">
          <tr class="enrollment-row" data-class="JHS 1" data-gender=""><td>JHS 1</td><td>140</td><td><span style="color:var(--blue-main);font-weight:600">68</span></td><td><span style="color:var(--purple);font-weight:600">72</span></td><td>28</td><td>112</td><td>13.2</td></tr>
          <tr class="enrollment-row" data-class="JHS 2" data-gender=""><td>JHS 2</td><td>135</td><td><span style="color:var(--blue-main);font-weight:600">64</span></td><td><span style="color:var(--purple);font-weight:600">71</span></td><td>15</td><td>120</td><td>14.1</td></tr>
          <tr class="enrollment-row" data-class="JHS 3" data-gender=""><td>JHS 3</td><td>125</td><td><span style="color:var(--blue-main);font-weight:600">61</span></td><td><span style="color:var(--purple);font-weight:600">64</span></td><td>8</td><td>117</td><td>15.3</td></tr>
        </tbody>
      </table>
    </div>
  </div>`;
}

// REPORT TAB SWITCHING
function switchReportTab(element, tabIndex){
  document.querySelectorAll('#report-tabs .mod-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.report-tab-content').forEach(c => c.classList.remove('active'));
  element.classList.add('active');
  document.querySelector(`.report-tab-content[data-tab="${tabIndex}"]`).classList.add('active');
}

// FILTER REPORTS
function filterReportTab(tabType){
  if(tabType === 'academic'){
    const search = document.getElementById('academic-search').value.toLowerCase();
    const filter = document.getElementById('academic-filter').value;
    document.querySelectorAll('.academic-row').forEach(row => {
      const matches = (!search || row.getAttribute('data-search').includes(search)) && (!filter || row.getAttribute('data-class') === filter);
      row.style.display = matches ? '' : 'none';
    });
  }
  else if(tabType === 'attendance'){
    const search = document.getElementById('attendance-search').value.toLowerCase();
    const filter = document.getElementById('attendance-filter').value;
    document.querySelectorAll('.attendance-row').forEach(row => {
      const matches = (!search || row.getAttribute('data-student').includes(search)) && (!filter || row.getAttribute('data-period') === filter);
      row.style.display = matches ? '' : 'none';
    });
  }
  else if(tabType === 'enrollment'){
    const classFilter = document.getElementById('enrollment-class-filter').value;
    const genderFilter = document.getElementById('enrollment-gender-filter').value;
    document.querySelectorAll('.enrollment-row').forEach(row => {
      const matches = (!classFilter || row.getAttribute('data-class') === classFilter);
      row.style.display = matches ? '' : 'none';
    });
  }
}

// GENERATE REPORT PDF
function generateReportPDF(reportType){
  showToast('Generating ' + reportType + ' Report...', 'info');
  
  let html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + reportType + ' Report</title><style>';
  html += 'body{font-family:Arial,sans-serif;margin:20px;background:#f5f5f5}';
  html += '.header{text-align:center;margin-bottom:30px;border-bottom:3px solid #1a56db;padding-bottom:15px}';
  html += '.header h1{color:#1a56db;margin:0;font-size:24px}';
  html += '.header p{color:#666;margin:5px 0;font-size:12px}';
  html += '.content{background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)}';
  html += '.section{margin-bottom:25px}';
  html += '.section-title{font-size:16px;font-weight:700;color:#1a56db;margin-bottom:12px;border-left:4px solid #1a56db;padding-left:10px}';
  html += 'table{width:100%;border-collapse:collapse;margin-top:10px}';
  html += 'th{background:#1a56db;color:#fff;padding:10px;text-align:left;font-size:12px;font-weight:700}';
  html += 'td{padding:10px;border-bottom:1px solid #ddd;font-size:12px}';
  html += 'tr:nth-child(even){background:#f9f9f9}';
  html += '.stat{display:inline-block;margin:10px 20px 10px 0}';
  html += '.stat-value{font-size:24px;font-weight:700;color:#1a56db}';
  html += '.stat-label{font-size:12px;color:#666;margin-top:5px}';
  html += '.badge{display:inline-block;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:700;background:#d1fae5;color:#065f46}';
  html += '.footer{margin-top:30px;text-align:center;color:#999;font-size:11px;border-top:1px solid #ddd;padding-top:15px}';
  html += '@media print{body{margin:0;background:#fff}}';
  html += '</style></head><body>';
  html += '<div class="header"><h1><i class="fas fa-school" style="color:#1a56db"></i> Glory Regin Preparatory School</h1><p>' + reportType + ' Report</p><p>Generated: ' + new Date().toLocaleString() + '</p></div>';
  html += '<div class="content">';
  
  if(reportType === 'Academic'){
    html += '<div class="section"><div class="section-title"><i class="fas fa-chart-bar"></i> Academic Performance Report</div>';
    html += '<div class="stat"><div class="stat-value">88.7%</div><div class="stat-label">Pass Rate</div></div>';
    html += '<div class="stat"><div class="stat-value">75.3</div><div class="stat-label">Avg Score</div></div>';
    html += '<div class="stat"><div class="stat-value">92%</div><div class="stat-label">Top Subject</div></div></div>';
    html += '<div class="section"><div class="section-title">Performance by Class & Subject</div><table>';
    html += '<tr><th>Class</th><th>Subject</th><th>Pass Rate</th><th>Avg Score</th><th>Grade A</th><th>Grade B</th></tr>';
    document.querySelectorAll('.academic-row:not([style*="display: none"])').forEach(row => {
      const cells = row.querySelectorAll('td');
      html += '<tr>';
      cells.forEach(cell => html += '<td>' + cell.innerText + '</td>');
      html += '</tr>';
    });
    html += '</table></div>';
  }
  else if(reportType === 'Attendance'){
    html += '<div class="section"><div class="section-title"><i class="fas fa-clipboard-list"></i> Attendance Summary Report</div>';
    html += '<div class="stat"><div class="stat-value">94.2%</div><div class="stat-label">Avg Attendance</div></div>';
    html += '<div class="stat"><div class="stat-value">4,856</div><div class="stat-label">Present Days</div></div></div>';
    html += '<div class="section"><div class="section-title">Student Attendance Records</div><table>';
    html += '<tr><th>Student</th><th>Class</th><th>Present</th><th>Absent</th><th>Late</th><th>Attendance %</th></tr>';
    document.querySelectorAll('.attendance-row:not([style*="display: none"])').forEach(row => {
      const cells = row.querySelectorAll('td');
      html += '<tr>';
      cells.forEach(cell => html += '<td>' + cell.innerText + '</td>');
      html += '</tr>';
    });
    html += '</table></div>';
  }
  else if(reportType === 'Financial'){
    html += '<div class="section"><div class="section-title"><i class="fas fa-money-bill"></i> Financial Summary Report</div>';
    html += '<div class="stat"><div class="stat-value">GHS 245,800</div><div class="stat-label">Total Income</div></div>';
    html += '<div class="stat"><div class="stat-value">GHS 156,400</div><div class="stat-label">Expenditure</div></div>';
    html += '<div class="stat"><div class="stat-value">GHS 89,400</div><div class="stat-label">Surplus</div></div></div>';
    html += '<div class="section"><div class="section-title">Income Sources</div><table>';
    html += '<tr><th>Source</th><th>Amount</th><th>Percentage</th></tr>';
    html += '<tr><td>Tuition Fees</td><td>GHS 188,500</td><td>76.8%</td></tr>';
    html += '<tr><td>Donations</td><td>GHS 57,300</td><td>23.2%</td></tr>';
    html += '</table></div>';
  }
  else if(reportType === 'Enrollment'){
    html += '<div class="section"><div class="section-title"><i class="fas fa-users"></i> Enrollment Statistics Report</div>';
    html += '<div class="stat"><div class="stat-value">400</div><div class="stat-label">Total Students</div></div>';
    html += '<div class="stat"><div class="stat-value">193</div><div class="stat-label">Male</div></div>';
    html += '<div class="stat"><div class="stat-value">207</div><div class="stat-label">Female</div></div></div>';
    html += '<div class="section"><div class="section-title">Enrollment by Class</div><table>';
    html += '<tr><th>Class</th><th>Total</th><th>Male</th><th>Female</th><th>New</th><th>Returning</th></tr>';
    document.querySelectorAll('.enrollment-row:not([style*="display: none"])').forEach(row => {
      const cells = row.querySelectorAll('td');
      html += '<tr>';
      for(let i=0; i<Math.min(6, cells.length); i++) html += '<td>' + cells[i].innerText + '</td>';
      html += '</tr>';
    });
    html += '</table></div>';
  }
  
  html += '</div><div class="footer"><p>This report was automatically generated by Glory Regin School Management System</p>';
  html += '<p>© 2026 Glory Regin Preparatory School. All rights reserved.</p></div></body></html>';
  
  const blob = new Blob([html], {type: 'text/html;charset=utf-8'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = reportType.replace(/ /g, '_') + '_Report_' + new Date().toISOString().split('T')[0] + '.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Report downloaded! Open the file in your browser to view or print as PDF.', 'success');
}

// SETTINGS MODULE
// SETTINGS DATA
const SETTINGS_DATA = {
  schoolInfo: {
    schoolName: 'Glory Regin Preparatory School',
    schoolCode: 'SCH-0024',
    schoolMotto: 'Excellence, Integrity & Service',
    schoolLogo: null,
    region: 'Greater Accra',
    district: 'Accra Metropolitan',
    phone: '+233 302 000 000',
    email: 'info@excellence.edu.gh',
    address: 'P.O. Box AN 1234, Main School Street, Accra North, Greater Accra Region, Ghana',
    website: 'www.excellence.edu.gh'
  },
  academic: {
    academicYear: '2024/2025',
    currentTerm: 'Term 1',
    termStartDate: '2025-01-13',
    termEndDate: '2025-04-11'
  },
  system: {
    maintenanceMode: false,
    backupFrequency: 'Daily',
    maxUploadSize: '50MB',
    language: 'English'
  },
  security: {
    passwordPolicy: 'Strong',
    sessionTimeout: '30 minutes',
    twoFactorAuth: true,
    apiKeyRotation: '90 days'
  },
  appearance: {
    theme: 'Light',
    accentColor: 'Blue',
    fontSize: 'Normal',
    compactMode: false
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    dailyDigest: true
  }
};

function settingsModule(){
  return hdr('System Settings','Configure school information and system preferences','Settings')+`
  <div class="mod-tabs" id="settings-tabs">
    ${['School Info','Academic','System','Security','Appearance','Notifications'].map((t,i)=>`<div class="mod-tab ${i===0?'active':''}" onclick="switchSettingsTab(${i})">${t}</div>`).join('')}
  </div>

  <!-- SCHOOL INFO TAB -->
  <div class="settings-tab-content active" data-tab="0">
    <div class="g2">
      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-school"></i> School Logo & Motto</span></div>
        <div style="display:grid;grid-template-columns:auto 1fr;gap:20px;align-items:center;padding-bottom:20px;border-bottom:1.5px solid var(--gray-200);margin-bottom:20px">
          <div class="school-logo-container" id="school-logo-display" style="width:120px;height:120px;background:var(--gray-100);border-radius:10px;display:flex;align-items:center;justify-content:center;overflow:hidden">
            <div style="text-align:center">
              <div style="font-size:40px"><i class="fas fa-image"></i></div>
              <div style="font-size:10px;color:var(--gray-400);margin-top:6px">No logo</div>
            </div>
          </div>
          <div style="flex:1">
            <div class="f-field"><label>School Logo (Image)</label><input type="file" id="school-logo-input" accept="image/*" onchange="previewSchoolLogo()"></div>
            <div style="font-size:11px;color:var(--gray-500);margin-top:6px">Recommended: PNG/JPG, 500x500px, max 2MB</div>
          </div>
        </div>
        <div class="f-field" style="margin-bottom:16px"><label>School Motto</label><input id="school-motto" placeholder="e.g., Excellence, Integrity & Service" value="${SETTINGS_DATA.schoolInfo.schoolMotto}"></div>
        <div style="display:flex;gap:8px"><button class="btn btn-primary" onclick="saveSchoolBrand()"><i class="fas fa-check"></i> Save Logo & Motto</button><button class="btn btn-secondary" onclick="resetBrandForm()">Reset</button></div>
      </div>

      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-building"></i> School Information</span></div>
        <div class="f-row"><div class="f-field"><label>School Name</label><input id="school-name" value="${SETTINGS_DATA.schoolInfo.schoolName}"></div><div class="f-field"><label>School Code</label><input id="school-code" value="${SETTINGS_DATA.schoolInfo.schoolCode}" readonly></div></div>
        <div class="f-row"><div class="f-field"><label>Region</label><select id="school-region"><option>Greater Accra</option><option>Ashanti</option><option>Western</option><option>Northern</option></select></div><div class="f-field"><label>District</label><input id="school-district" value="${SETTINGS_DATA.schoolInfo.district}"></div></div>
        <div class="f-row"><div class="f-field"><label>Phone Number</label><input id="school-phone" value="${SETTINGS_DATA.schoolInfo.phone}"></div><div class="f-field"><label>Email Address</label><input id="school-email" value="${SETTINGS_DATA.schoolInfo.email}"></div></div>
        <div class="f-field" style="margin-bottom:14px"><label>Physical Address</label><textarea id="school-address" style="min-height:60px">${SETTINGS_DATA.schoolInfo.address}</textarea></div>
        <div class="f-field" style="margin-bottom:14px"><label>School Website</label><input id="school-website" value="${SETTINGS_DATA.schoolInfo.website}"></div>
        <div style="display:flex;gap:8px"><button class="btn btn-primary" onclick="saveSchoolInfo()"><i class="fas fa-check"></i> Save Changes</button><button class="btn btn-secondary" onclick="resetSchoolForm()">Reset</button></div>
      </div>

      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-calendar-alt"></i> Academic Calendar</span></div>
        <div class="f-row"><div class="f-field"><label>Academic Year</label><select id="academic-year"><option>2024/2025</option><option>2025/2026</option><option>2026/2027</option></select></div><div class="f-field"><label>Current Term</label><select id="current-term"><option>Term 1</option><option>Term 2</option><option>Term 3</option></select></div></div>
        <div class="f-row"><div class="f-field"><label>Term Start Date</label><input type="date" id="term-start-date" value="2025-01-13"></div><div class="f-field"><label>Term End Date</label><input type="date" id="term-end-date" value="2025-04-11"></div></div>
        <div style="margin-bottom:14px">
          <label style="font-size:11px;font-weight:600;color:var(--gray-600);display:block;margin-bottom:8px;text-transform:uppercase;letter-spacing:.4px">Grading Scale</label>
          ${[['A','80–100','Excellent'],['B','70–79','Very Good'],['C','60–69','Good'],['D','50–59','Average'],['F','0–49','Fail']].map(([g,r,l])=>`
          <div style="display:flex;gap:12px;align-items:center;padding:6px 0;border-bottom:1px solid var(--gray-100)">
            <div class="grade-pill g${g}">${g}</div>
            <span style="font-size:12px;flex:1">${r}</span>
            <span style="font-size:11px;color:var(--gray-400)">${l}</span>
          </div>`).join('')}
        </div>
        <div style="display:flex;gap:8px"><button class="btn btn-primary" onclick="saveAcademicCalendar()"><i class="fas fa-check"></i> Update Calendar</button><button class="btn btn-secondary" onclick="resetAcademicForm()">Reset</button></div>
      </div>
    </div>
  </div>

  <!-- SYSTEM TAB -->
  <div class="settings-tab-content" data-tab="1">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-cogs"></i> System Settings</span></div>
      <div class="f-row">
        <div class="f-field"><label>Maintenance Mode</label>
          <select id="maintenance-mode">
            <option value="false">Disabled</option>
            <option value="true">Enabled</option>
          </select>
        </div>
        <div class="f-field"><label>Backup Frequency</label>
          <select id="backup-frequency">
            <option>Hourly</option>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>
      </div>
      <div class="f-row">
        <div class="f-field"><label>Max Upload Size</label>
          <select id="max-upload">
            <option>10MB</option>
            <option>50MB</option>
            <option>100MB</option>
            <option>500MB</option>
          </select>
        </div>
        <div class="f-field"><label>System Language</label>
          <select id="system-language">
            <option>English</option>
            <option>Twi</option>
            <option>Ga</option>
            <option>French</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:8px"><button class="btn btn-primary" onclick="saveSystemSettings()"><i class="fas fa-check"></i> Save System Settings</button><button class="btn btn-secondary" onclick="resetSystemForm()">Reset</button></div>
    </div>
  </div>

  <!-- SECURITY TAB -->
  <div class="settings-tab-content" data-tab="2">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-lock"></i> Security Settings</span></div>
      <div class="f-row">
        <div class="f-field"><label>Password Policy</label>
          <select id="password-policy">
            <option>Weak</option>
            <option>Medium</option>
            <option>Strong</option>
            <option>Very Strong</option>
          </select>
        </div>
        <div class="f-field"><label>Session Timeout</label>
          <select id="session-timeout">
            <option>15 minutes</option>
            <option>30 minutes</option>
            <option>1 hour</option>
            <option>2 hours</option>
          </select>
        </div>
      </div>
      <div class="f-row">
        <div class="f-field"><label>Two-Factor Authentication</label>
          <select id="two-factor">
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        </div>
        <div class="f-field"><label>API Key Rotation</label>
          <select id="api-rotation">
            <option>30 days</option>
            <option>60 days</option>
            <option>90 days</option>
            <option>180 days</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:8px"><button class="btn btn-primary" onclick="saveSecuritySettings()"><i class="fas fa-check"></i> Save Security Settings</button><button class="btn btn-secondary" onclick="resetSecurityForm()">Reset</button></div>
    </div>
  </div>

  <!-- APPEARANCE TAB -->
  <div class="settings-tab-content" data-tab="3">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-palette"></i> Appearance Settings</span></div>
      <div class="f-row">
        <div class="f-field"><label>Theme</label>
          <select id="theme-select">
            <option>Light</option>
            <option>Dark</option>
            <option>Auto</option>
          </select>
        </div>
        <div class="f-field"><label>Accent Color</label>
          <select id="accent-color">
            <option>Blue</option>
            <option>Purple</option>
            <option>Green</option>
            <option>Orange</option>
          </select>
        </div>
      </div>
      <div class="f-row">
        <div class="f-field"><label>Font Size</label>
          <select id="font-size">
            <option>Small</option>
            <option>Normal</option>
            <option>Large</option>
            <option>Extra Large</option>
          </select>
        </div>
        <div class="f-field"><label>Compact Mode</label>
          <select id="compact-mode">
            <option value="false">Disabled</option>
            <option value="true">Enabled</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:8px"><button class="btn btn-primary" onclick="saveAppearanceSettings()"><i class="fas fa-check"></i> Save Appearance Settings</button><button class="btn btn-secondary" onclick="resetAppearanceForm()">Reset</button></div>
    </div>
  </div>

  <!-- NOTIFICATIONS TAB -->
  <div class="settings-tab-content" data-tab="4">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-bell"></i> Notification Preferences</span></div>
      <div style="display:grid;gap:12px">
        <div style="display:flex;align-items:center;padding:12px;background:var(--gray-50);border-radius:8px">
          <input type="checkbox" id="email-notif" checked style="width:20px;height:20px;cursor:pointer">
          <label style="flex:1;margin-left:12px;cursor:pointer">Email Notifications</label>
        </div>
        <div style="display:flex;align-items:center;padding:12px;background:var(--gray-50);border-radius:8px">
          <input type="checkbox" id="sms-notif" style="width:20px;height:20px;cursor:pointer">
          <label style="flex:1;margin-left:12px;cursor:pointer">SMS Notifications</label>
        </div>
        <div style="display:flex;align-items:center;padding:12px;background:var(--gray-50);border-radius:8px">
          <input type="checkbox" id="push-notif" checked style="width:20px;height:20px;cursor:pointer">
          <label style="flex:1;margin-left:12px;cursor:pointer">Push Notifications</label>
        </div>
        <div style="display:flex;align-items:center;padding:12px;background:var(--gray-50);border-radius:8px">
          <input type="checkbox" id="daily-digest" checked style="width:20px;height:20px;cursor:pointer">
          <label style="flex:1;margin-left:12px;cursor:pointer">Daily Digest Email</label>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:20px"><button class="btn btn-primary" onclick="saveNotificationSettings()"><i class="fas fa-check"></i> Save Notification Settings</button><button class="btn btn-secondary" onclick="resetNotificationForm()">Reset</button></div>
    </div>
  </div>`;
}

// SETTINGS FUNCTIONS
function switchSettingsTab(tabIndex){
  document.querySelectorAll('#settings-tabs .mod-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.settings-tab-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('#settings-tabs .mod-tab')[tabIndex].classList.add('active');
  document.querySelector(`.settings-tab-content[data-tab="${tabIndex}"]`).classList.add('active');
}

function previewSchoolLogo(){
  const input = document.getElementById('school-logo-input');
  if(!input.files[0]) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const display = document.getElementById('school-logo-display');
    display.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover">`;
    SETTINGS_DATA.schoolInfo.schoolLogo = e.target.result;
  };
  reader.readAsDataURL(input.files[0]);
}

function saveSchoolBrand(){
  SETTINGS_DATA.schoolInfo.schoolMotto = document.getElementById('school-motto').value;
  showToast('✓ School logo and motto saved successfully!', 'success');
}

function resetBrandForm(){
  document.getElementById('school-motto').value = SETTINGS_DATA.schoolInfo.schoolMotto;
  if(SETTINGS_DATA.schoolInfo.schoolLogo){
    document.getElementById('school-logo-display').innerHTML = `<img src="${SETTINGS_DATA.schoolInfo.schoolLogo}" style="width:100%;height:100%;object-fit:cover">`;
  } else {
    document.getElementById('school-logo-display').innerHTML = `<div style="text-align:center"><div style="font-size:40px"><i class="fas fa-image"></i></div><div style="font-size:10px;color:var(--gray-400);margin-top:6px">No logo</div></div>`;
  }
  document.getElementById('school-logo-input').value = '';
  showToast('Form reset to saved values', 'info');
}

function saveSchoolInfo(){
  SETTINGS_DATA.schoolInfo = {
    schoolName: document.getElementById('school-name').value,
    schoolCode: document.getElementById('school-code').value,
    region: document.getElementById('school-region').value,
    district: document.getElementById('school-district').value,
    phone: document.getElementById('school-phone').value,
    email: document.getElementById('school-email').value,
    address: document.getElementById('school-address').value,
    website: document.getElementById('school-website').value
  };
  showToast('✓ School information saved successfully!', 'success');
}

function resetSchoolForm(){
  document.getElementById('school-name').value = SETTINGS_DATA.schoolInfo.schoolName;
  document.getElementById('school-district').value = SETTINGS_DATA.schoolInfo.district;
  document.getElementById('school-phone').value = SETTINGS_DATA.schoolInfo.phone;
  document.getElementById('school-email').value = SETTINGS_DATA.schoolInfo.email;
  document.getElementById('school-address').value = SETTINGS_DATA.schoolInfo.address;
  document.getElementById('school-website').value = SETTINGS_DATA.schoolInfo.website;
  showToast('Form reset to saved values', 'info');
}

function saveAcademicCalendar(){
  SETTINGS_DATA.academic = {
    academicYear: document.getElementById('academic-year').value,
    currentTerm: document.getElementById('current-term').value,
    termStartDate: document.getElementById('term-start-date').value,
    termEndDate: document.getElementById('term-end-date').value
  };
  showToast('✓ Academic calendar updated successfully!', 'success');
}

function resetAcademicForm(){
  document.getElementById('academic-year').value = SETTINGS_DATA.academic.academicYear;
  document.getElementById('current-term').value = SETTINGS_DATA.academic.currentTerm;
  document.getElementById('term-start-date').value = SETTINGS_DATA.academic.termStartDate;
  document.getElementById('term-end-date').value = SETTINGS_DATA.academic.termEndDate;
  showToast('Form reset to saved values', 'info');
}

function saveSystemSettings(){
  SETTINGS_DATA.system = {
    maintenanceMode: document.getElementById('maintenance-mode').value === 'true',
    backupFrequency: document.getElementById('backup-frequency').value,
    maxUploadSize: document.getElementById('max-upload').value,
    language: document.getElementById('system-language').value
  };
  showToast('✓ System settings saved successfully!', 'success');
}

function resetSystemForm(){
  document.getElementById('maintenance-mode').value = SETTINGS_DATA.system.maintenanceMode;
  document.getElementById('backup-frequency').value = SETTINGS_DATA.system.backupFrequency;
  document.getElementById('max-upload').value = SETTINGS_DATA.system.maxUploadSize;
  document.getElementById('system-language').value = SETTINGS_DATA.system.language;
  showToast('Form reset to saved values', 'info');
}

function saveSecuritySettings(){
  SETTINGS_DATA.security = {
    passwordPolicy: document.getElementById('password-policy').value,
    sessionTimeout: document.getElementById('session-timeout').value,
    twoFactorAuth: document.getElementById('two-factor').value === 'true',
    apiKeyRotation: document.getElementById('api-rotation').value
  };
  showToast('✓ Security settings saved successfully!', 'success');
}

function resetSecurityForm(){
  document.getElementById('password-policy').value = SETTINGS_DATA.security.passwordPolicy;
  document.getElementById('session-timeout').value = SETTINGS_DATA.security.sessionTimeout;
  document.getElementById('two-factor').value = SETTINGS_DATA.security.twoFactorAuth;
  document.getElementById('api-rotation').value = SETTINGS_DATA.security.apiKeyRotation;
  showToast('Form reset to saved values', 'info');
}

function saveAppearanceSettings(){
  SETTINGS_DATA.appearance = {
    theme: document.getElementById('theme-select').value,
    accentColor: document.getElementById('accent-color').value,
    fontSize: document.getElementById('font-size').value,
    compactMode: document.getElementById('compact-mode').value === 'true'
  };
  showToast('✓ Appearance settings saved! Refresh page to apply theme changes.', 'success');
}

function resetAppearanceForm(){
  document.getElementById('theme-select').value = SETTINGS_DATA.appearance.theme;
  document.getElementById('accent-color').value = SETTINGS_DATA.appearance.accentColor;
  document.getElementById('font-size').value = SETTINGS_DATA.appearance.fontSize;
  document.getElementById('compact-mode').value = SETTINGS_DATA.appearance.compactMode;
  showToast('Form reset to saved values', 'info');
}

function saveNotificationSettings(){
  SETTINGS_DATA.notifications = {
    emailNotifications: document.getElementById('email-notif').checked,
    smsNotifications: document.getElementById('sms-notif').checked,
    pushNotifications: document.getElementById('push-notif').checked,
    dailyDigest: document.getElementById('daily-digest').checked
  };
  showToast('✓ Notification preferences saved successfully!', 'success');
}

function resetNotificationForm(){
  document.getElementById('email-notif').checked = SETTINGS_DATA.notifications.emailNotifications;
  document.getElementById('sms-notif').checked = SETTINGS_DATA.notifications.smsNotifications;
  document.getElementById('push-notif').checked = SETTINGS_DATA.notifications.pushNotifications;
  document.getElementById('daily-digest').checked = SETTINGS_DATA.notifications.dailyDigest;
  showToast('Form reset to saved values', 'info');
}

// ROLES MODULE
function rolesModule(){
  return hdr('Roles & Permissions','Manage user roles and access control','Roles')+`
  <div class="g2">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-shield"></i> System Roles</span><button class="btn btn-primary btn-sm" onclick="alert('Opening role creation form...')">+ Add Role</button></div>
      <table class="tbl">
        <thead><tr><th>Role</th><th>Users</th><th>Access Level</th><th>Dashboard</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${[['Admin','3','Full System Access','Admin','Active','danger'],['Accountant','2','Financial Modules','Accountant','Active','warning'],['Teacher','64','Academic Modules','Teacher','Active','info'],['Student','842','Student View Only','Student','Active','success'],['Parent','520','Parent View Only','Parent','Active','info'],['Alumni','1,240','Alumni Portal','Alumni','Active','purple'],['Visitor','–','Public Pages Only','Visitor','Active','gray']].map(([r,u,a,d,s,c])=>`
          <tr>
            <td style="font-weight:700">${r}</td>
            <td>${u}</td>
            <td><span class="badge b-${c}">${a}</span></td>
            <td><span class="badge b-gray">${d}</span></td>
            <td><span class="badge b-success">${s}</span></td>
            <td><div style="display:flex;gap:4px"><button class="btn btn-secondary btn-xs" onclick="alert('Editing role')">Edit</button><button class="btn btn-primary btn-xs" onclick="alert('Managing permissions')">Perms</button></div></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-key"></i> Permission Matrix — Admin Role</span></div>
      <table class="tbl">
        <thead><tr><th>Module</th><th style="text-align:center">View</th><th style="text-align:center">Create</th><th style="text-align:center">Edit</th><th style="text-align:center">Delete</th></tr></thead>
        <tbody>
          ${['Students','Teachers','Classes','Fees','Reports','Settings','Users','Notices','Events'].map(m=>`
          <tr>
            <td style="font-weight:600">${m}</td>
            ${[true,true,true,m!=='Settings'&&m!=='Reports'].map(p=>`<td style="text-align:center;font-size:16px;color:${p?'var(--success)':'var(--danger)'}">${p?'✓':'✗'}</td>`).join('')}
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

// USERS MODULE
function usersModule(){
  return hdr('User Accounts','Manage all system user accounts','User Accounts')+`
  <div class="toolbar">
    <button class="btn btn-primary" onclick="alert('Opening user account creation form...')">+ Create Account</button>
    <div class="search-bar"><span><i class="fas fa-search"></i></span><input placeholder="Search users..."></div>
    <select class="select-sm"><option>All Roles</option><option>Admin</option><option>Teacher</option><option>Student</option></select>
  </div>
  <div class="card">
    <table class="tbl">
      <thead><tr><th>#</th><th>User</th><th>Username</th><th>Email</th><th>Role</th><th>Last Login</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${[['System Admin','admin','admin@excellence.edu.gh','Admin','Today 8:00 AM','Active','blue'],['Mr. Amponsah','k.amponsah','k.amponsah@excellence.edu.gh','Teacher','Today 7:30 AM','Active','green'],['Ama Serwaa','ama.serwaa','ama@student.edu.gh','Student','Yesterday','Active','purple'],['Mr. Kojo (Acct)','k.accountant','accountant@excellence.edu.gh','Accountant','Today 9:00 AM','Active','gold'],['Mr. Serwaa (Parent)','serwaa.parent','parent@email.com','Parent','2 days ago','Active','teal']].map(([n,un,em,r,ll,s,av],i)=>`
        <tr>
          <td style="color:var(--gray-400)">${i+1}</td>
          <td><div style="display:flex;align-items:center;gap:8px"><div class="av av-sm av-${av}">${n[0]}</div>${n}</div></td>
          <td style="color:var(--blue-main)">@${un}</td>
          <td style="font-size:11px">${em}</td>
          <td><span class="badge b-info">${r}</span></td>
          <td style="font-size:11px;color:var(--gray-400)">${ll}</td>
          <td><span class="badge b-success">${s}</span></td>
          <td><div style="display:flex;gap:4px"><button class="btn btn-secondary btn-xs" onclick="alert('Editing user')">Edit</button><button class="btn btn-danger btn-xs" onclick="deleteRecord('', 'User')">Disable</button></div></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

// STAFF MODULE
function staffModule(){
  // Calculate statistics
  const totalStaff = Object.keys(STAFF_DATA).length;
  const teachingStaff = Object.values(STAFF_DATA).filter(s=>s.category==='Teaching').length;
  const adminStaff = Object.values(STAFF_DATA).filter(s=>s.category==='Admin').length;
  const supportStaff = Object.values(STAFF_DATA).filter(s=>s.category==='Support').length;
  const activeStaff = Object.values(STAFF_DATA).filter(s=>s.status==='Active').length;

  return hdr('Staff Management','Manage school staff - teaching, admin and support personnel','Staff')+`
  <div class="stats-row">
    ${statCard('<i class="fas fa-users"></i>',''+totalStaff,'Total Staff','All categories','neu','si-blue')}
    ${statCard('<i class="fas fa-chalkboard-user"></i>',''+teachingStaff,'Teaching Staff','Academic staff','neu','si-gold')}
    ${statCard('<i class="fas fa-building"></i>',''+adminStaff,'Admin Staff','Administrative team','neu','si-green')}
    ${statCard('<i class="fas fa-wrench"></i>',''+supportStaff,'Support Staff','Support services','neu','si-purple')}
  </div>
  
  <div class="toolbar" style="margin-bottom:20px;display:flex;gap:10px;flex-wrap:wrap">
    <button class="btn btn-primary" onclick="toggleStaffForm()"><i class="fas fa-plus"></i> Add Staff Member</button>
    <button class="btn btn-secondary" onclick="showStaffStatistics()"><i class="fas fa-chart-bar"></i> Statistics</button>
    <button class="btn btn-secondary" onclick="exportStaffToCSV()"><i class="fas fa-download"></i> Export CSV</button>
    <button class="btn btn-secondary" onclick="exportStaffToExcel()"><i class="fas fa-table"></i> Export Excel</button>
    <div class="search-bar" style="flex:1;min-width:200px"><span><i class="fas fa-search"></i></span><input id="staff-search" placeholder="Search staff by name or ID..." onkeyup="filterStaffList()"></div>
    <select id="staff-category-filter" class="select-sm" onchange="filterStaffList()"><option value="">All Categories</option><option value="Teaching">Teaching</option><option value="Admin">Admin</option><option value="Support">Support</option></select>
  </div>
  
  <!-- ADD STAFF FORM -->
  <div id="staff-form-wrap" style="display:none;margin-bottom:20px">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-user-plus"></i> Add New Staff Member</span></div>
      <div class="form-grid">
        <div class="form-field">
          <label>Full Name *</label>
          <input type="text" id="staff-name" placeholder="Full name">
        </div>
        <div class="form-field">
          <label>Email Address *</label>
          <input type="email" id="staff-email" placeholder="email@school.edu.gh">
        </div>
        <div class="form-field">
          <label>Phone Number *</label>
          <input type="tel" id="staff-phone" placeholder="+233 XXX XXX XXXX">
        </div>
        <div class="form-field">
          <label>Gender *</label>
          <select id="staff-gender"><option>-- Select --</option><option>Male</option><option>Female</option></select>
        </div>
        <div class="form-field">
          <label>Date of Birth *</label>
          <input type="date" id="staff-dob">
        </div>
        <div class="form-field">
          <label>Category *</label>
          <select id="staff-category"><option>-- Select --</option><option>Teaching</option><option>Admin</option><option>Support</option></select>
        </div>
        <div class="form-field">
          <label>Department *</label>
          <input type="text" id="staff-department" placeholder="e.g., Mathematics, Finance, Security">
        </div>
        <div class="form-field">
          <label>Position/Title *</label>
          <input type="text" id="staff-position" placeholder="e.g., Senior Teacher, Accountant">
        </div>
        <div class="form-field" style="grid-column:1/-1">
          <label>Qualifications *</label>
          <textarea id="staff-qualifications" placeholder="Education and certifications..." style="min-height:60px;font-family:Poppins,sans-serif;border:1.5px solid var(--gray-200);border-radius:6px;padding:8px;font-size:12px"></textarea>
        </div>
        <div class="form-field">
          <label>Salary Grade *</label>
          <input type="text" id="staff-salary-grade" placeholder="e.g., Grade 8, Admin A">
        </div>
        <div class="form-field">
          <label>Join Date *</label>
          <input type="date" id="staff-join-date">
        </div>
        <div class="form-field">
          <label>Address</label>
          <input type="text" id="staff-address" placeholder="Residential address">
        </div>
        <div class="form-field">
          <label>Emergency Contact Name</label>
          <input type="text" id="staff-emergency-contact" placeholder="Name">
        </div>
        <div class="form-field">
          <label>Emergency Contact Phone</label>
          <input type="tel" id="staff-emergency-phone" placeholder="+233 XXX XXX XXXX">
        </div>
        <div class="form-field" style="grid-column:1/-1">
          <label>Assignments/Roles (comma-separated)</label>
          <input type="text" id="staff-assignments" placeholder="e.g., JHS 1 Math, Math Coordinator, Form Tutor">
        </div>
        <div style="grid-column:1/-1;display:flex;gap:8px">
          <button class="btn btn-primary" style="flex:1" onclick="submitStaffForm()"><i class="fas fa-check"></i> Add Staff</button>
          <button class="btn btn-secondary" style="flex:1" onclick="toggleStaffForm()">Cancel</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- STAFF LIST TABLE -->
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-list"></i> Staff Directory</span></div>
    <table class="tbl">
      <thead>
        <tr>
          <th>#</th>
          <th>Staff Name</th>
          <th>Category</th>
          <th>Department</th>
          <th>Position</th>
          <th>Phone</th>
          <th>Join Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="staff-list-body">
        ${Object.values(STAFF_DATA).map((staff,i)=>`
        <tr class="staff-row" data-category="${staff.category}" data-name="${staff.name.toLowerCase()}">
          <td style="color:var(--gray-400);font-size:11px">${i+1}</td>
          <td>
            <div style="display:flex;align-items:center;gap:8px">
              <div class="av av-sm av-${['blue','purple','gold','green','teal'][i%5]}">${staff.avatar}</div>
              <div>
                <div style="font-weight:600;font-size:12px">${staff.name}</div>
                <div style="font-size:10px;color:var(--gray-500)">${staff.id}</div>
              </div>
            </div>
          </td>
          <td><span class="badge ${staff.category==='Teaching'?'b-info':(staff.category==='Admin'?'b-success':'b-warning')}">${staff.category}</span></td>
          <td style="font-size:11px">${staff.department}</td>
          <td style="font-size:11px;color:var(--gray-600)">${staff.position}</td>
          <td style="font-size:10px">${staff.phone}</td>
          <td style="font-size:10px;color:var(--gray-500)">${new Date(staff.joinDate).toLocaleDateString()}</td>
          <td><span class="badge ${staff.status==='Active'?'b-success':'b-danger'}">${staff.status}</span></td>
          <td>
            <div style="display:flex;gap:3px;justify-content:center">
              <button class="btn btn-secondary btn-xs" onclick="viewStaffDetail('${staff.id}')" title="View details"><i class="fas fa-eye"></i></button>
              <button class="btn btn-primary btn-xs" onclick="editStaff('${staff.id}')" title="Edit"><i class="fas fa-edit"></i></button>
              <button class="btn btn-danger btn-xs" onclick="deleteStaff('${staff.id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

// STAFF MANAGEMENT FUNCTIONS
function toggleStaffForm(){
  const form = document.getElementById('staff-form-wrap');
  if(form) form.style.display = form.style.display==='none'?'block':'none';
}

function submitStaffForm(){
  const name = document.getElementById('staff-name')?.value.trim();
  const email = document.getElementById('staff-email')?.value.trim();
  const phone = document.getElementById('staff-phone')?.value.trim();
  const gender = document.getElementById('staff-gender')?.value;
  const dob = document.getElementById('staff-dob')?.value;
  const category = document.getElementById('staff-category')?.value;
  const department = document.getElementById('staff-department')?.value.trim();
  const position = document.getElementById('staff-position')?.value.trim();
  const qualifications = document.getElementById('staff-qualifications')?.value.trim();
  const salaryGrade = document.getElementById('staff-salary-grade')?.value.trim();
  const joinDate = document.getElementById('staff-join-date')?.value;
  const address = document.getElementById('staff-address')?.value.trim();
  const emergencyContact = document.getElementById('staff-emergency-contact')?.value.trim();
  const emergencyPhone = document.getElementById('staff-emergency-phone')?.value.trim();
  const assignments = document.getElementById('staff-assignments')?.value.split(',').map(s=>s.trim()).filter(s=>s) || [];
  
  if(!name || !email || !phone || !gender || !dob || !category || !department || !position || !qualifications || !salaryGrade || !joinDate){
    showToast('<i class="fas fa-times-circle"></i> Please fill in all required fields (marked with *)', 'error');
    return;
  }
  
  // Generate staff ID
  const categoryPrefix = category.slice(0,3).toUpperCase();
  const staffId = categoryPrefix + String(Object.keys(STAFF_DATA).length + 1).padStart(3,'0');
  
  const newStaff = {
    id: staffId,
    name: name,
    email: email,
    phone: phone,
    gender: gender,
    dob: dob,
    category: category,
    department: department,
    position: position,
    qualifications: qualifications,
    salaryGrade: salaryGrade,
    joinDate: joinDate,
    address: address,
    emergencyContact: emergencyContact,
    emergencyPhone: emergencyPhone,
    assignments: assignments,
    status: 'Active',
    performance: '4.0/5',
    avatar: name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()
  };
  
  STAFF_DATA[staffId] = newStaff;
  
  showToast('<i class="fas fa-check-circle"></i> Staff member added successfully!<br/>Name: '+name+'<br/>ID: '+staffId, 'success', 4000);
  
  // Clear form
  document.getElementById('staff-form-wrap').style.display = 'none';
  document.getElementById('staff-name').value = '';
  document.getElementById('staff-email').value = '';
  document.getElementById('staff-phone').value = '';
  document.getElementById('staff-gender').value = '';
  document.getElementById('staff-dob').value = '';
  document.getElementById('staff-category').value = '';
  document.getElementById('staff-department').value = '';
  document.getElementById('staff-position').value = '';
  document.getElementById('staff-qualifications').value = '';
  document.getElementById('staff-salary-grade').value = '';
  document.getElementById('staff-join-date').value = '';
  document.getElementById('staff-address').value = '';
  document.getElementById('staff-emergency-contact').value = '';
  document.getElementById('staff-emergency-phone').value = '';
  document.getElementById('staff-assignments').value = '';
  
  // Refresh
  renderMain();
}

function viewStaffDetail(staffId){
  const staff = STAFF_DATA[staffId];
  if(!staff) return;
  
  let html = hdr('Staff Profile','View complete staff member details','Staff')+`
  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-user"></i> Personal Information</span></div>
      <div style="display:flex;gap:20px;align-items:center;margin-bottom:20px">
        <div class="av av-xl av-blue">${staff.avatar}</div>
        <div>
          <div style="font-size:16px;font-weight:700;color:var(--blue-dark)">${staff.name}</div>
          <div style="font-size:12px;color:var(--gray-500);margin-top:4px">ID: ${staff.id}</div>
          <div style="margin-top:8px;display:flex;gap:8px">
            <span class="badge ${staff.category==='Teaching'?'b-info':(staff.category==='Admin'?'b-success':'b-warning')}">${staff.category}</span>
            <span class="badge b-success">${staff.status}</span>
          </div>
        </div>
      </div>
      <div style="border-top:1px solid var(--gray-200);padding-top:12px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px">
          <div>
            <div style="color:var(--gray-500);font-size:11px">Gender</div>
            <div style="font-weight:600;margin-top:4px">${staff.gender}</div>
          </div>
          <div>
            <div style="color:var(--gray-500);font-size:11px">Date of Birth</div>
            <div style="font-weight:600;margin-top:4px">${new Date(staff.dob).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</div>
          </div>
          <div>
            <div style="color:var(--gray-500);font-size:11px">Email Address</div>
            <div style="font-weight:600;margin-top:4px;color:var(--blue-main)">${staff.email}</div>
          </div>
          <div>
            <div style="color:var(--gray-500);font-size:11px">Phone Number</div>
            <div style="font-weight:600;margin-top:4px">${staff.phone}</div>
          </div>
          <div style="grid-column:1/-1">
            <div style="color:var(--gray-500);font-size:11px">Residential Address</div>
            <div style="font-weight:600;margin-top:4px">${staff.address}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-briefcase"></i> Employment Information</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px">
        <div>
          <div style="color:var(--gray-500);font-size:11px">Category</div>
          <div style="font-weight:600;margin-top:4px">${staff.category}</div>
        </div>
        <div>
          <div style="color:var(--gray-500);font-size:11px">Department</div>
          <div style="font-weight:600;margin-top:4px">${staff.department}</div>
        </div>
        <div>
          <div style="color:var(--gray-500);font-size:11px">Position/Title</div>
          <div style="font-weight:600;margin-top:4px">${staff.position}</div>
        </div>
        <div>
          <div style="color:var(--gray-500);font-size:11px">Salary Grade</div>
          <div style="font-weight:600;margin-top:4px">${staff.salaryGrade}</div>
        </div>
        <div>
          <div style="color:var(--gray-500);font-size:11px">Join Date</div>
          <div style="font-weight:600;margin-top:4px">${new Date(staff.joinDate).toLocaleDateString()}</div>
        </div>
        <div>
          <div style="color:var(--gray-500);font-size:11px">Tenure</div>
          <div style="font-weight:600;margin-top:4px">${Math.floor((new Date()-new Date(staff.joinDate))/(365*24*60*60*1000))} years</div>
        </div>
        <div style="grid-column:1/-1">
          <div style="color:var(--gray-500);font-size:11px">Qualifications</div>
          <div style="font-weight:600;margin-top:4px">${staff.qualifications}</div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-phone"></i> Emergency Contact</span></div>
      <div style="font-size:12px">
        <div style="margin-bottom:12px">
          <div style="color:var(--gray-500);font-size:11px">Contact Person</div>
          <div style="font-weight:600;margin-top:4px">${staff.emergencyContact}</div>
        </div>
        <div>
          <div style="color:var(--gray-500);font-size:11px">Phone Number</div>
          <div style="font-weight:600;margin-top:4px">${staff.emergencyPhone}</div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-star"></i> Performance & Assignments</span></div>
      <div style="font-size:12px;margin-bottom:12px">
        <div style="color:var(--gray-500);font-size:11px;margin-bottom:4px">Performance Rating</div>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="flex:1">
            <div class="prog-bar"><div class="prog-fill pf-blue" style="width:${parseFloat(staff.performance)*20}%"></div></div>
          </div>
          <div style="font-weight:700;color:var(--blue-main)">${staff.performance}</div>
        </div>
      </div>
      <div style="border-top:1px solid var(--gray-200);padding-top:12px">
        <div style="color:var(--gray-500);font-size:11px;margin-bottom:8px">Current Assignments/Roles</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${staff.assignments.map(a=>'<span class="badge b-info" style="font-size:11px">'+a+'</span>').join('')}
        </div>
      </div>
    </div>
  </div>
  
  <div style="display:flex;gap:10px">
    <button class="btn btn-primary" onclick="editStaff('${staff.id}')"><i class="fas fa-edit"></i> Edit Staff</button>
    <button class="btn btn-secondary" onclick="navTo('staff')"><i class="fas fa-arrow-left"></i> Back to List</button>
  </div>`;
  
  document.getElementById('main-content').innerHTML = html;
}

function editStaff(staffId){
  const staff = STAFF_DATA[staffId];
  if(!staff) return;
  
  let html = hdr('Edit Staff Member','Update staff information','Staff')+`
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-edit"></i> Edit Staff Details</span></div>
    <div class="form-grid">
      <div class="form-field">
        <label>Full Name *</label>
        <input type="text" id="edit-staff-name" placeholder="Full name" value="${staff.name}">
      </div>
      <div class="form-field">
        <label>Email Address *</label>
        <input type="email" id="edit-staff-email" placeholder="email@school.edu.gh" value="${staff.email}">
      </div>
      <div class="form-field">
        <label>Phone Number *</label>
        <input type="tel" id="edit-staff-phone" placeholder="+233 XXX XXX XXXX" value="${staff.phone}">
      </div>
      <div class="form-field">
        <label>Category *</label>
        <select id="edit-staff-category"><option value="Teaching" ${staff.category==='Teaching'?'selected':''}>Teaching</option><option value="Admin" ${staff.category==='Admin'?'selected':''}>Admin</option><option value="Support" ${staff.category==='Support'?'selected':''}>Support</option></select>
      </div>
      <div class="form-field">
        <label>Department *</label>
        <input type="text" id="edit-staff-department" placeholder="Department" value="${staff.department}">
      </div>
      <div class="form-field">
        <label>Position/Title *</label>
        <input type="text" id="edit-staff-position" placeholder="Position" value="${staff.position}">
      </div>
      <div class="form-field">
        <label>Salary Grade *</label>
        <input type="text" id="edit-staff-salary-grade" placeholder="Salary Grade" value="${staff.salaryGrade}">
      </div>
      <div class="form-field">
        <label>Status</label>
        <select id="edit-staff-status"><option value="Active" ${staff.status==='Active'?'selected':''}>Active</option><option value="On Leave">On Leave</option><option value="Retired">Retired</option></select>
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label>Assignments/Roles (comma-separated)</label>
        <input type="text" id="edit-staff-assignments" placeholder="Assignments" value="${staff.assignments.join(', ')}">
      </div>
      <div style="grid-column:1/-1;display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="submitEditStaff('${staff.id}')"><i class="fas fa-check"></i> Save Changes</button>
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('staff')">Cancel</button>
      </div>
    </div>
  </div>`;
  
  document.getElementById('main-content').innerHTML = html;
}

function submitEditStaff(staffId){
  const staff = STAFF_DATA[staffId];
  if(!staff) return;
  
  staff.name = document.getElementById('edit-staff-name')?.value.trim();
  staff.email = document.getElementById('edit-staff-email')?.value.trim();
  staff.phone = document.getElementById('edit-staff-phone')?.value.trim();
  staff.category = document.getElementById('edit-staff-category')?.value;
  staff.department = document.getElementById('edit-staff-department')?.value.trim();
  staff.position = document.getElementById('edit-staff-position')?.value.trim();
  staff.salaryGrade = document.getElementById('edit-staff-salary-grade')?.value.trim();
  staff.status = document.getElementById('edit-staff-status')?.value;
  staff.assignments = document.getElementById('edit-staff-assignments')?.value.split(',').map(s=>s.trim()).filter(s=>s);
  
  showToast('<i class="fas fa-check-circle"></i> Staff information updated!<br/>Name: '+staff.name, 'success', 4000);
  
  setTimeout(() => { navTo('staff'); }, 2000);
}

function deleteStaff(staffId){
  const staff = STAFF_DATA[staffId];
  if(!staff) return;
  
  if(confirm('Are you sure you want to delete '+staff.name+'? This action cannot be undone.')){
    delete STAFF_DATA[staffId];
    showToast('<i class="fas fa-check-circle"></i> Staff member deleted successfully', 'success', 3000);
    renderMain();
  }
}

function filterStaffList(){
  const searchTerm = document.getElementById('staff-search')?.value.toLowerCase() || '';
  const categoryFilter = document.getElementById('staff-category-filter')?.value || '';
  
  const rows = document.querySelectorAll('.staff-row');
  rows.forEach(row=>{
    const name = row.dataset.name || '';
    const category = row.dataset.category || '';
    
    const matchesSearch = name.includes(searchTerm);
    const matchesCategory = !categoryFilter || category === categoryFilter;
    
    row.style.display = (matchesSearch && matchesCategory) ? '' : 'none';
  });
}

function showStaffStatistics(){
  const totalStaff = Object.keys(STAFF_DATA).length;
  const teachingStaff = Object.values(STAFF_DATA).filter(s=>s.category==='Teaching').length;
  const adminStaff = Object.values(STAFF_DATA).filter(s=>s.category==='Admin').length;
  const supportStaff = Object.values(STAFF_DATA).filter(s=>s.category==='Support').length;
  const activeStaff = Object.values(STAFF_DATA).filter(s=>s.status==='Active').length;
  
  // Calculate average performance
  const avgPerformance = (Object.values(STAFF_DATA).reduce((sum,s)=>sum+parseFloat(s.performance),0)/totalStaff).toFixed(1);
  
  // Get departments
  const depts = {};
  Object.values(STAFF_DATA).forEach(s=>{
    depts[s.department] = (depts[s.department]||0)+1;
  });
  
  let html = hdr('Staff Statistics & Reports','Comprehensive staff analysis','Staff')+`
  <div class="stats-row">
    ${statCard('<i class="fas fa-users"></i>',''+totalStaff,'Total Staff','All staff','neu','si-blue')}
    ${statCard('<i class="fas fa-check-circle"></i>',''+activeStaff,'Active Staff','Currently employed','neu','si-green')}
    ${statCard('<i class="fas fa-star"></i>',''+avgPerformance,'Avg Performance','Overall rating','neu','si-gold')}
    ${statCard('<i class="fas fa-building"></i>',''+Object.keys(depts).length,'Departments','Total categories','neu','si-purple')}
  </div>
  
  <div class="g3 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-pie"></i> Staff by Category</span></div>
      <div style="padding:20px;text-align:center">
        <div style="margin-bottom:20px">
          <div style="font-size:24px;font-weight:700;color:var(--blue-main)">${teachingStaff}</div>
          <div style="font-size:12px;color:var(--gray-500);margin-top:4px">Teaching Staff</div>
          <div style="font-size:11px;color:var(--gray-400)">'+((teachingStaff/totalStaff)*100).toFixed(0)+'%</div>
        </div>
      </div>
      <div class="prog-bar" style="margin-bottom:12px"><div class="prog-fill pf-blue" style="width:'+((teachingStaff/totalStaff)*100)+'%"></div></div>
      <div style="padding:0 12px;padding-bottom:12px;border-bottom:1px solid var(--gray-200)">
        <div style="font-size:11px;color:var(--gray-500)">Total: '+teachingStaff+' of '+totalStaff+'</div>
      </div>
      <div style="padding-top:12px">
        <div style="margin-bottom:12px">
          <div style="font-size:14px;font-weight:700;color:var(--blue-main)">${adminStaff}</div>
          <div style="font-size:12px;color:var(--gray-500);margin-top:2px">Admin Staff ('+((adminStaff/totalStaff)*100).toFixed(0)+'%)</div>
        </div>
        <div class="prog-bar" style="margin-bottom:12px"><div class="prog-fill pf-green" style="width:'+((adminStaff/totalStaff)*100)+'%"></div></div>
        <div style="margin-bottom:12px">
          <div style="font-size:14px;font-weight:700;color:var(--gold)">${supportStaff}</div>
          <div style="font-size:12px;color:var(--gray-500);margin-top:2px">Support Staff ('+((supportStaff/totalStaff)*100).toFixed(0)+'%)</div>
        </div>
        <div class="prog-bar"><div class="prog-fill pf-gold" style="width:'+((supportStaff/totalStaff)*100)+'%"></div></div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-building"></i> Staff by Department</span></div>
      <div style="font-size:12px">
        ${Object.entries(depts).sort((a,b)=>b[1]-a[1]).map(([dept,count])=>`
        <div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px">
            <span style="font-weight:600">${dept}</span>
            <span style="color:var(--blue-main);font-weight:700">${count}</span>
          </div>
          <div class="prog-bar"><div class="prog-fill pf-blue" style="width:${(count/totalStaff)*100}%"></div></div>
        </div>`).join('')}
      </div>
    </div>
    
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-rankings"></i> Salary Grades Distribution</span></div>
      ${(() => {
        const salaryGrades = {};
        Object.values(STAFF_DATA).forEach(s=>{
          salaryGrades[s.salaryGrade] = (salaryGrades[s.salaryGrade]||0)+1;
        });
        return Object.entries(salaryGrades).sort((a,b)=>b[1]-a[1]).map(([grade,count])=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--gray-100);font-size:12px">
          <span style="font-weight:600">${grade}</span>
          <span style="padding:4px 10px;background:var(--blue-main);color:white;border-radius:12px;font-size:11px">${count}</span>
        </div>`).join('');
      })()}
    </div>
  </div>
  
  <div class="card mb20">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-table"></i> All Staff Summary</span></div>
    <table class="tbl" style="font-size:11px">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Department</th>
          <th>Position</th>
          <th>Salary Grade</th>
          <th>Join Date</th>
          <th>Tenure</th>
          <th>Performance</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${Object.values(STAFF_DATA).map(s=>`
        <tr>
          <td style="font-weight:600">${s.name}</td>
          <td><span class="badge ${s.category==='Teaching'?'b-info':(s.category==='Admin'?'b-success':'b-warning')}">${s.category}</span></td>
          <td>${s.department}</td>
          <td>${s.position}</td>
          <td>${s.salaryGrade}</td>
          <td>${new Date(s.joinDate).toLocaleDateString()}</td>
          <td>${Math.floor((new Date()-new Date(s.joinDate))/(365*24*60*60*1000))} yrs</td>
          <td>
            <div style="display:flex;align-items:center;gap:4px">
              <div style="flex:1;height:6px;background:var(--gray-200);border-radius:3px"><div style="width:${parseFloat(s.performance)*20}%;height:100%;background:var(--blue-main);border-radius:3px"></div></div>
              <span style="font-weight:600;font-size:10px;color:var(--blue-main)">${s.performance}</span>
            </div>
          </td>
          <td><span class="badge ${s.status==='Active'?'b-success':'b-danger'}">${s.status}</span></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
  
  <div style="display:flex;gap:10px">
    <button class="btn btn-secondary" onclick="navTo('staff')"><i class="fas fa-arrow-left"></i> Back to Staff List</button>
  </div>`;
  
  document.getElementById('main-content').innerHTML = html;
}

function exportStaffToCSV(){
  let csv = 'Staff Directory Export\n';
  csv += 'Generated: '+new Date().toLocaleDateString()+'\n\n';
  
  csv += 'ID,Name,Category,Department,Position,Email,Phone,Salary Grade,Join Date,Status,Performance\n';
  Object.values(STAFF_DATA).forEach(s=>{
    csv += `"${s.id}","${s.name}","${s.category}","${s.department}","${s.position}","${s.email}","${s.phone}","${s.salaryGrade}","${s.joinDate}","${s.status}","${s.performance}"\n`;
  });
  
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'Staff_Directory_'+new Date().toISOString().slice(0,10)+'.csv');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> Staff directory exported to CSV', 'success', 3000);
}

function exportStaffToExcel(){
  let html = '<table border="1"><tr><th>ID</th><th>Name</th><th>Category</th><th>Department</th><th>Position</th><th>Email</th><th>Phone</th><th>Salary Grade</th><th>Join Date</th><th>Status</th><th>Performance</th></tr>';
  Object.values(STAFF_DATA).forEach(s=>{
    html += '<tr><td>'+s.id+'</td><td>'+s.name+'</td><td>'+s.category+'</td><td>'+s.department+'</td><td>'+s.position+'</td><td>'+s.email+'</td><td>'+s.phone+'</td><td>'+s.salaryGrade+'</td><td>'+s.joinDate+'</td><td>'+s.status+'</td><td>'+s.performance+'</td></tr>';
  });
  html += '</table>';
  
  const element = document.createElement('a');
  element.setAttribute('href', 'data:application/vnd.ms-excel,' + encodeURIComponent(html));
  element.setAttribute('download', 'Staff_Directory_'+new Date().toISOString().slice(0,10)+'.xls');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> Staff directory exported to Excel', 'success', 3000);
}

// ALUMNI MODULE (Admin view)
function alumniModule(){
  return hdr('Alumni Module','Manage alumni records and engagement','Alumni')+`
  <div class="stats-row">
    ${statCard('<i class="fas fa-medal"></i>','1,240','Total Alumni','Class 1985–2024','neu','si-blue')}
    ${statCard('<i class="fas fa-globe"></i>','48','Countries','Alumni worldwide','neu','si-gold')}
    ${statCard('<i class="fas fa-handshake"></i>','GH₵42K','Donations','This year','up','si-green')}
    ${statCard('<i class="fas fa-file-alt"></i>','14','Pending Requests','Certificates etc','dn','si-red')}
  </div>
  ${alumniDirectory()}`;
}

// ALUMNI MODULE FUNCTIONS
function toggleAddAlumniForm(){
  const form = document.getElementById('alumni-form-wrap');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function submitAlumni(){
  const name = document.getElementById('alumni-name').value;
  const year = document.getElementById('alumni-year').value;
  const profession = document.getElementById('alumni-profession').value;
  const location = document.getElementById('alumni-location').value;
  const email = document.getElementById('alumni-email').value;
  const phone = document.getElementById('alumni-phone').value;
  
  if(!name || !year || !profession || !location || !email || !phone){
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  const id = 'ALM' + String(Object.keys(ALUMNI_DATA).length + 1).padStart(3, '0');
  ALUMNI_DATA[id] = {
    id, name, classYear: parseInt(year), profession, location, avatar: name.substring(0,2).toUpperCase(),
    avatarColor: ['purple','blue','green','gold','teal','orange','pink'][Object.keys(ALUMNI_DATA).length % 7],
    bio: document.getElementById('alumni-bio').value || 'Alumni member',
    email, phone,
    instagram: document.getElementById('alumni-instagram').value,
    linkedin: document.getElementById('alumni-linkedin').value,
    twitter: document.getElementById('alumni-twitter').value,
    facebook: document.getElementById('alumni-facebook').value
  };
  
  showToast('Alumni member added successfully!', 'success');
  toggleAddAlumniForm();
  navTo('alumni');
}

function filterAlumni(){
  const search = document.getElementById('alumni-search').value.toLowerCase();
  const yearFilter = document.getElementById('alumni-year-filter').value;
  const profFilter = document.getElementById('alumni-profession-filter').value.toLowerCase();
  
  document.querySelectorAll('.alumni-card').forEach(card => {
    const name = card.getAttribute('data-name');
    const year = card.getAttribute('data-year');
    const prof = card.getAttribute('data-profession');
    
    const matchesSearch = name.includes(search);
    const matchesYear = !yearFilter || year === yearFilter;
    const matchesProf = !profFilter || prof.includes(profFilter);
    
    card.style.display = (matchesSearch && matchesYear && matchesProf) ? '' : 'none';
  });
}

function showAlumniProfile(alumniId){
  const alumni = ALUMNI_DATA[alumniId];
  if(!alumni) return;
  
  const modalHtml = `
    <div class="modal-overlay" onclick="document.querySelector('.modal-overlay')?.remove()">
      <div class="card" style="max-width:600px;margin:auto" onclick="event.stopPropagation()">
        <div class="card-hdr" style="display:flex;justify-content:space-between;align-items:center">
          <span class="card-title"><i class="fas fa-user"></i> Alumni Profile</span>
          <button class="btn btn-icon" onclick="document.querySelector('.modal-overlay')?.remove()"><i class="fas fa-times"></i></button>
        </div>
        <div style="padding:20px">
          <div style="display:flex;gap:20px;margin-bottom:20px">
            <div class="av av-xl av-${alumni.avatarColor}">${alumni.avatar}</div>
            <div style="flex:1">
              <div style="font-size:18px;font-weight:700;margin-bottom:4px">${alumni.name}</div>
              <span class="badge b-info" style="margin-bottom:12px;display:block">Class of ${alumni.classYear}</span>
              <div style="font-size:13px;font-weight:600;color:var(--blue-main);margin-bottom:8px">${alumni.profession}</div>
              <div style="font-size:11px;color:var(--gray-500)"><i class="fas fa-map-pin"></i> ${alumni.location}</div>
            </div>
          </div>
          <div style="background:var(--blue-xpale);padding:15px;border-radius:8px;margin-bottom:20px">
            <div style="font-size:12px;font-weight:600;margin-bottom:8px">Bio</div>
            <div style="font-size:12px;color:var(--gray-700)">${alumni.bio}</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px">
            <div><div style="font-size:11px;color:var(--gray-500);margin-bottom:4px">Email</div><div style="font-size:12px;color:var(--blue-main)">${alumni.email}</div></div>
            <div><div style="font-size:11px;color:var(--gray-500);margin-bottom:4px">Phone</div><div style="font-size:12px">${alumni.phone}</div></div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-primary" style="flex:1" onclick="showConnectModal('${alumniId}');document.querySelector('.modal-overlay')?.remove()"><i class="fas fa-paper-plane"></i> Connect</button>
            <button class="btn btn-secondary" onclick="document.querySelector('.modal-overlay')?.remove()">Close</button>
          </div>
        </div>
      </div>
    </div>`;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function showConnectModal(alumniId){
  const alumni = ALUMNI_DATA[alumniId];
  if(!alumni) return;
  
  const modalHtml = `
    <div class="modal-overlay" onclick="document.querySelector('.modal-overlay')?.remove()">
      <div class="card" style="max-width:600px;margin:auto" onclick="event.stopPropagation()">
        <div class="card-hdr" style="display:flex;justify-content:space-between;align-items:center">
          <span class="card-title"><i class="fas fa-share-alt"></i> Connect with ${alumni.name}</span>
          <button class="btn btn-icon" onclick="document.querySelector('.modal-overlay')?.remove()"><i class="fas fa-times"></i></button>
        </div>
        <div style="padding:20px">
          <div style="margin-bottom:20px">
            <div style="font-size:12px;font-weight:600;color:var(--gray-600);margin-bottom:12px;text-transform:uppercase;letter-spacing:.5px">Social Media Handles</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              ${alumni.instagram ? `<a href="https://instagram.com/${alumni.instagram.replace('@','')}" target="_blank" class="btn btn-secondary" style="text-align:center"><i class="fab fa-instagram"></i> ${alumni.instagram}</a>` : ''}
              ${alumni.twitter ? `<a href="https://twitter.com/${alumni.twitter.replace('@','')}" target="_blank" class="btn btn-secondary" style="text-align:center"><i class="fab fa-twitter"></i> ${alumni.twitter}</a>` : ''}
              ${alumni.linkedin ? `<a href="https://${alumni.linkedin}" target="_blank" class="btn btn-secondary" style="text-align:center"><i class="fab fa-linkedin"></i> LinkedIn</a>` : ''}
              ${alumni.facebook ? `<a href="https://${alumni.facebook}" target="_blank" class="btn btn-secondary" style="text-align:center"><i class="fab fa-facebook"></i> Facebook</a>` : ''}
            </div>
          </div>
          
          <div style="background:var(--gray-50);padding:15px;border-radius:8px;margin-bottom:20px">
            <div style="font-size:12px;font-weight:600;color:var(--gray-600);margin-bottom:12px">Send Message to Alumni</div>
            <textarea id="alumni-message" placeholder="Type your message..." style="width:100%;min-height:100px;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;font-size:12px;resize:vertical"></textarea>
          </div>
          
          <div style="display:flex;gap:8px">
            <button class="btn btn-primary" style="flex:1" onclick="sendMessageToAlumni('${alumniId}')"><i class="fas fa-paper-plane"></i> Send Message</button>
            <button class="btn btn-secondary" onclick="document.querySelector('.modal-overlay')?.remove()">Cancel</button>
          </div>
        </div>
      </div>
    </div>`;
  
  const existing = document.querySelector('.modal-overlay');
  if(existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function sendMessageToAlumni(alumniId){
  const alumni = ALUMNI_DATA[alumniId];
  const message = document.getElementById('alumni-message').value;
  
  if(!message.trim()){
    showToast('Please type a message', 'error');
    return;
  }
  
  showToast('Message sent to ' + alumni.name + '!', 'success');
  
  // Store message in messaging system (would connect to backend in real app)
  const msgId = 'MSG' + Date.now();
  const timestamp = new Date().toLocaleString();
  
  console.log('Message sent to:', alumni.name);
  console.log('Message:', message);
  console.log('Time:', timestamp);
  
  document.querySelector('.modal-overlay')?.remove();
}

// VISITOR MANAGEMENT MODULE
// BACKUP MODULE
// BACKUPS DATA
const BACKUPS_DATA = [
  {date: 'Mar 17, 2025 2:00 AM', size: '2.4 GB', type: 'Auto', status: 'Success', id: 'BK001'},
  {date: 'Mar 16, 2025 2:00 AM', size: '2.3 GB', type: 'Auto', status: 'Success', id: 'BK002'},
  {date: 'Mar 15, 2025 2:00 AM', size: '2.3 GB', type: 'Manual', status: 'Success', id: 'BK003'},
  {date: 'Mar 14, 2025 2:00 AM', size: '2.2 GB', type: 'Auto', status: 'Success', id: 'BK004'},
  {date: 'Mar 13, 2025 2:00 AM', size: '2.2 GB', type: 'Auto', status: 'Success', id: 'BK005'},
  {date: 'Mar 12, 2025 2:00 AM', size: '2.1 GB', type: 'Auto', status: 'Success', id: 'BK006'}
];

const SYSTEM_LOGS = [
  {level: 'INFO', message: 'User admin logged in', time: '2025-03-17 08:00:12', type: 'login'},
  {level: 'INFO', message: 'Student enrollment: Ama Serwaa', time: '2025-03-17 08:05:33', type: 'enrollment'},
  {level: 'WARNING', message: 'Failed login attempt', time: '2025-03-17 08:10:45', type: 'security'},
  {level: 'INFO', message: 'Fee payment recorded - GHS 5,000', time: '2025-03-17 08:30:12', type: 'payment'},
  {level: 'INFO', message: 'Notice published: School Holiday', time: '2025-03-17 09:00:00', type: 'admin'},
  {level: 'ERROR', message: 'Backup storage 80% full', time: '2025-03-17 09:15:22', type: 'system'},
  {level: 'INFO', message: 'Timetable updated for Form 3', time: '2025-03-17 10:00:00', type: 'academic'},
  {level: 'INFO', message: 'Academic Report generated', time: '2025-03-17 10:30:00', type: 'report'},
  {level: 'WARNING', message: 'Database query slow - 5.2s', time: '2025-03-17 11:00:00', type: 'performance'},
  {level: 'INFO', message: 'User Teacher logged in', time: '2025-03-17 11:15:00', type: 'login'}
];

function backupModule(){
  return hdr('Backup & System Logs','Data backup management and activity logs','Backup & Logs')+`
  <div class="g2">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-save"></i> Database Backup</span></div>
      <div style="padding:20px;background:var(--blue-xpale);border-radius:var(--radius);text-align:center;margin-bottom:16px">
        <div style="font-size:40px;margin-bottom:10px"><i class="fas fa-save"></i></div>
        <div style="font-size:13px;font-weight:700;color:var(--blue-dark)">Last Backup: ${BACKUPS_DATA[0].date}</div>
        <div style="font-size:11px;color:var(--gray-500);margin-top:4px">All data backed up successfully · Size: ${BACKUPS_DATA[0].size}</div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
        <button class="btn btn-primary" style="flex:1;min-width:120px" onclick="performBackup()"><i class="fas fa-sync"></i> Backup Now</button>
        <button class="btn btn-secondary" style="flex:1;min-width:120px" onclick="downloadLatestBackup()"><i class="fas fa-download"></i> Download</button>
        <button class="btn btn-secondary" style="flex:1;min-width:120px" onclick="syncToCloud()"><i class="fas fa-cloud"></i> Cloud</button>
      </div>
      
      <div style="margin-bottom:15px">
        <input id="backup-search" type="text" placeholder="Search backups by date or size..." style="width:100%;padding:8px 12px;border:1.5px solid var(--gray-200);border-radius:6px;font-size:12px" onkeyup="filterBackups()">
      </div>
      
      <table class="tbl" id="backups-table">
        <thead><tr><th>Date</th><th>Size</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody id="backups-tbody">
          ${BACKUPS_DATA.map(b=>`
          <tr class="backup-row" data-date="${b.date.toLowerCase()}" data-size="${b.size.toLowerCase()}">
            <td>${b.date}</td>
            <td>${b.size}</td>
            <td><span class="badge ${b.type==='Auto'?'b-info':'b-warning'}">${b.type}</span></td>
            <td><span class="badge b-success">${b.status}</span></td>
            <td><div style="display:flex;gap:4px"><button class="btn btn-secondary btn-xs" onclick="downloadBackup('${b.id}')"><i class="fas fa-download"></i> Download</button></div></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-clipboard-list"></i> System Logs</span></div>
      <div style="display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap">
        <input id="logs-search" type="text" placeholder="Search logs..." style="flex:1;min-width:200px;padding:8px 12px;border:1.5px solid var(--gray-200);border-radius:6px;font-size:12px" onkeyup="filterLogs()">
        <select id="logs-filter" class="select-sm" onchange="filterLogs()">
          <option value="">All Levels</option>
          <option value="INFO">INFO</option>
          <option value="WARNING">WARNING</option>
          <option value="ERROR">ERROR</option>
        </select>
        <select id="logs-type-filter" class="select-sm" onchange="filterLogs()">
          <option value="">All Types</option>
          <option value="login">Login</option>
          <option value="enrollment">Enrollment</option>
          <option value="security">Security</option>
          <option value="payment">Payment</option>
          <option value="admin">Admin</option>
          <option value="system">System</option>
          <option value="academic">Academic</option>
          <option value="report">Report</option>
        </select>
        <button class="btn btn-secondary" onclick="exportLogs()"><i class="fas fa-download"></i> Export</button>
      </div>
      
      <div style="max-height:400px;overflow-y:auto" id="logs-container">
        ${SYSTEM_LOGS.map((log,i)=>{
          const color = log.level === 'INFO' ? 'b-info' : (log.level === 'WARNING' ? 'b-warning' : 'b-danger');
          return `<div class="system-log" data-level="${log.level}" data-type="${log.type}" data-message="${log.message.toLowerCase()}" style="display:flex;gap:10px;padding:10px;border-bottom:1px solid var(--gray-100);font-size:11px;align-items:flex-start">
            <span class="badge ${color}" style="font-size:9px;height:fit-content;white-space:nowrap">${log.level}</span>
            <div style="flex:1">
              <div style="font-weight:600;color:var(--gray-700);margin-bottom:4px">${log.message}</div>
              <div style="color:var(--gray-400)">${log.time}</div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>`;
}

// BACKUP FUNCTIONS
function performBackup(){
  showToast('Starting backup process...', 'info');
  const loader = setTimeout(() => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', {year: 'numeric', month: 'short', day: '2-digit'}) + ', ' + now.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
    
    BACKUPS_DATA.unshift({
      date: dateStr + ' AM',
      size: Math.random() > 0.5 ? '2.5 GB' : '2.4 GB',
      type: 'Manual',
      status: 'Success',
      id: 'BK' + String(Math.random()).slice(2,5)
    });
    
    showToast('✓ Backup completed successfully!', 'success');
    navTo('backup');
  }, 2000);
}

function downloadLatestBackup(){
  const latest = BACKUPS_DATA[0];
  if(!latest) return;
  downloadBackup(latest.id);
}

function downloadBackup(backupId){
  const backup = BACKUPS_DATA.find(b => b.id === backupId);
  if(!backup) return;
  
  showToast('Downloading backup: ' + backup.date, 'info');
  setTimeout(() => {
    const link = document.createElement('a');
    link.href = 'data:application/zip;base64,UEsDBAoAAAAAAM8EwFYAAAAAAAAAAAAAAAAJAAAAZGF0YS9QSwECLQAKAAAAAA==';
    link.download = 'backup_' + backup.id + '.zip';
    link.click();
    showToast('Backup downloaded successfully!', 'success');
  }, 1000);
}

function syncToCloud(){
  showToast('Syncing to cloud...', 'info');
  setTimeout(() => {
    showToast('✓ Cloud sync completed! All backups synced to cloud storage.', 'success');
  }, 2000);
}

function filterBackups(){
  const search = document.getElementById('backup-search').value.toLowerCase();
  document.querySelectorAll('.backup-row').forEach(row => {
    const date = row.getAttribute('data-date');
    const size = row.getAttribute('data-size');
    const matches = date.includes(search) || size.includes(search);
    row.style.display = matches ? '' : 'none';
  });
}

function filterLogs(){
  const search = document.getElementById('logs-search').value.toLowerCase();
  const levelFilter = document.getElementById('logs-filter').value;
  const typeFilter = document.getElementById('logs-type-filter').value;
  
  document.querySelectorAll('.system-log').forEach(log => {
    const level = log.getAttribute('data-level');
    const type = log.getAttribute('data-type');
    const message = log.getAttribute('data-message');
    
    const matchesSearch = message.includes(search);
    const matchesLevel = !levelFilter || level === levelFilter;
    const matchesType = !typeFilter || type === typeFilter;
    
    log.style.display = (matchesSearch && matchesLevel && matchesType) ? '' : 'none';
  });
}

function exportLogs(){
  const logs = SYSTEM_LOGS.map(l => `[${l.time}] ${l.level}: ${l.message}`).join('\n');
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(logs));
  element.setAttribute('download', 'system_logs_' + new Date().toISOString().split('T')[0] + '.txt');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('System logs exported successfully!', 'success');
}

// PROFILE MODULE
function profileModule(){
  return hdr('My Profile','View and update your personal information','Profile')+`
  <div class="g21">
    <div class="card">
      <div style="display:flex;gap:20px;align-items:flex-start;margin-bottom:22px;padding-bottom:18px;border-bottom:1.5px solid var(--gray-200)">
        <div class="av av-xl av-blue" style="font-size:30px">A</div>
        <div style="flex:1">
          <div style="font-size:20px;font-weight:800;color:var(--blue-dark)">Ama Serwaa</div>
          <div style="font-size:12px;color:var(--gray-400)">Student · Form 3A · Roll No: 2024-0042</div>
          <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
            <span class="badge b-success">Active Student</span>
            <span class="badge b-info">2024/2025</span>
            <span class="badge b-purple">Science Stream</span>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="alert('Opening photo upload...')"><i class="fas fa-edit"></i> Change Photo</button>
      </div>
      <div class="f-row"><div class="f-field"><label>First Name</label><input value="Ama"></div><div class="f-field"><label>Last Name</label><input value="Serwaa"></div></div>
      <div class="f-row"><div class="f-field"><label>Date of Birth</label><input type="date" value="2008-04-15"></div><div class="f-field"><label>Gender</label><select><option>Female</option><option>Male</option></select></div></div>
      <div class="f-row"><div class="f-field"><label>Phone</label><input value="+233 24 000 0000"></div><div class="f-field"><label>Email</label><input value="ama.serwaa@student.edu.gh"></div></div>
      <div class="f-field" style="margin-bottom:16px"><label>Address</label><textarea style="min-height:60px">123 Main Street, Accra, Ghana</textarea></div>
      <div style="display:flex;gap:8px"><button class="btn btn-primary" onclick="updateProfile()">Save Profile</button><button class="btn btn-secondary" onclick="location.reload()">Cancel</button></div>
    </div>
    <div>
      <div class="card mb16">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-lock"></i> Change Password</span></div>
        <div class="f-field" style="margin-bottom:10px"><label>Current Password</label><input type="password" placeholder="••••••••"></div>
        <div class="f-field" style="margin-bottom:10px"><label>New Password</label><input type="password" placeholder="••••••••"></div>
        <div class="f-field" style="margin-bottom:14px"><label>Confirm Password</label><input type="password" placeholder="••••••••"></div>
        <button class="btn btn-primary" style="width:100%">Update Password</button>
      </div>
      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-bar"></i> Academic Summary</span></div>
        ${[['GPA','3.8 / 4.0','↑'],['Attendance','96%','↑'],['Class Rank','3 / 40','↑'],['Current Term','Term 1, 2025','—']].map(([l,v,t])=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:var(--gray-50);border-radius:var(--radius);margin-bottom:8px">
          <span style="font-size:12px;color:var(--gray-600)">${l}</span>
          <span style="font-size:14px;font-weight:800;color:var(--blue-dark)">${v} <span style="color:var(--success);font-size:11px">${t}</span></span>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}

// LESSON NOTES MODULE
function lessonNotesModule(){
  return hdr('Lesson Notes Upload','Upload and manage lesson resources','Lesson Notes')+`
  <div class="g21">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-file"></i> My Lesson Notes</span></div>
      <table class="tbl">
        <thead><tr><th>Title</th><th>Subject</th><th>Class</th><th>Date</th><th>Type</th><th>Downloads</th><th>Actions</th></tr></thead>
        <tbody>
          ${[['Chapter 5: Quadratic Equations','Mathematics','JHS 2','Mar 15','PDF',24],['English Essay Writing Guide','English','Form 3A','Mar 12','DOCX',18],['Science Lab Safety Rules','Science','Form 1C','Mar 10','PDF',32],['ICT Database Notes','ICT','Form 2B','Mar 8','PPTX',15]].map(([t,s,c,d,ty,dl])=>`
          <tr>
            <td style="font-weight:600">${t}</td><td>${s}</td><td>${c}</td><td>${d}</td>
            <td><span class="badge b-info">${ty}</span></td>
            <td>${dl}</td>
            <td><div style="display:flex;gap:4px"><button class="btn btn-secondary btn-xs">Edit</button><button class="btn btn-danger btn-xs">Del</button></div></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-upload"></i> Upload Lesson Note</span></div>
      <div class="f-field" style="margin-bottom:12px"><label>Title</label><input placeholder="Lesson note title..."></div>
      <div class="f-row">
        <div class="f-field"><label>Subject</label><select><option>Mathematics</option><option>English</option><option>Science</option></select></div>
        <div class="f-field"><label>Class</label><select><option>Form 2A</option><option>Form 3A</option></select></div>
      </div>
      <div class="f-field" style="margin-bottom:12px"><label>Description</label><textarea placeholder="Brief description..."></textarea></div>
      <div class="f-field" style="margin-bottom:14px">
        <label>Upload File</label>
        <div style="border:2px dashed var(--gray-200);border-radius:var(--radius);padding:30px;text-align:center;cursor:pointer;background:var(--gray-50)">
          <div style="font-size:32px;margin-bottom:8px"><i class="fas fa-folder"></i></div>
          <div style="font-size:13px;font-weight:600;color:var(--blue-main)">Drop file here or click to browse</div>
          <div style="font-size:11px;color:var(--gray-400);margin-top:4px">PDF, DOCX, PPTX — Max 10MB</div>
          <input type="file" style="display:none">
        </div>
      </div>
      <button class="btn btn-primary" style="width:100%" onclick="showToast('<i class="fas fa-check-circle"></i> File uploaded!', 'success')"><i class="fas fa-upload"></i> Upload</button>
    </div>
  </div>`;
}

// CHILDREN MODULE (Parent)
function childrenModule(){
  return hdr('My Children','Monitor your children\'s school activities','My Children')+`
  <div class="g2">
    ${[['Ama Serwaa','Form 3A','2024-0042',['96% Attendance','GPA 3.8','Fees: Paid','Rank: 3/40'],'blue','Science Stream'],['Kweku Serwaa','Form 1B','2024-0143',['91% Attendance','GPA 3.5','Fees: Paid','Rank: 8/38'],'purple','General Stream']].map(([n,c,r,stats,av,st])=>`
    <div class="card">
      <div style="display:flex;gap:16px;margin-bottom:18px;padding-bottom:16px;border-bottom:1.5px solid var(--gray-200)">
        <div class="av av-xl av-${av}">${n[0]}</div>
        <div>
          <div style="font-size:18px;font-weight:800;color:var(--blue-dark)">${n}</div>
          <div style="font-size:12px;color:var(--gray-400)">${c} · Roll: ${r}</div>
          <span class="badge b-info" style="margin-top:6px">${st}</span>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">
        ${stats.map(s=>`<div style="padding:10px;background:var(--gray-50);border-radius:var(--radius);font-size:12px;font-weight:600;text-align:center;color:var(--blue-dark)">${s}</div>`).join('')}
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-secondary btn-sm" style="flex:1" onclick="navTo('reportcards')"><i class="fas fa-scroll"></i> Report Card</button>
        <button class="btn btn-primary btn-sm" style="flex:1" onclick="navTo('attendance')"><i class="fas fa-check-circle"></i> Attendance</button>
        <button class="btn btn-secondary btn-sm" style="flex:1" onclick="navTo('assignments')"><i class="fas fa-clipboard-list"></i> Assignments</button>
      </div>
    </div>`).join('')}
  </div>`;
}

// SALARY MODULE
function salaryModule(){
  return hdr('Salary & Payroll','Staff salary management and payroll processing','Payroll')+`
  <div class="stats-row">
    ${statCard('<i class="fas fa-briefcase"></i>','94','Total Staff','For payroll','neu','si-blue')}
    ${statCard('<i class="fas fa-money-bill"></i>','GH₵148K','Monthly Payroll','Total outgoing','neu','si-gold')}
    ${statCard('<i class="fas fa-check-circle"></i>','0','Pending','All current','up','si-green')}
    ${statCard('<i class="fas fa-calendar-alt"></i>','Mar 28','Next Pay Date','In 11 days','neu','si-purple')}
  </div>
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-users"></i> Staff Payroll — March 2025</span>
      <div style="display:flex;gap:8px">
        <button class="btn btn-gold" onclick="alert('Processing payroll for all staff...')">Process All</button>
        <button class="btn btn-secondary btn-sm" onclick="exportData('CSV')"><i class="fas fa-download"></i> Export</button>
      </div>
    </div>
    <table class="tbl">
      <thead><tr><th>Staff Member</th><th>Role</th><th>Grade</th><th>Basic (GH₵)</th><th>Allowances</th><th>Deductions</th><th>Net Pay</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${[['Mr. Amponsah','Teacher','Grade 8','3,200','800','320','3,680','Paid'],['Mrs. Asante','Teacher','Grade 7','3,000','750','300','3,450','Paid'],['Ms. Frimpong','Teacher','Grade 6','2,800','700','280','3,220','Pending'],['Mr. Kojo','Accountant','Admin A','4,500','1,000','450','5,050','Paid'],['Mrs. Ofori','Secretary','Admin B','2,200','500','220','2,480','Paid']].map(([n,r,g,b,al,d,net,s])=>`
        <tr>
          <td><div style="display:flex;align-items:center;gap:8px"><div class="av av-sm av-blue">${n[0]}</div>${n}</div></td>
          <td>${r}</td><td><span class="badge b-gray">${g}</span></td>
          <td>GH₵${b}</td>
          <td style="color:var(--success);font-weight:600">+GH₵${al}</td>
          <td style="color:var(--danger);font-weight:600">-GH₵${d}</td>
          <td style="font-weight:800;color:var(--blue-dark)">GH₵${net}</td>
          <td><span class="badge ${s==='Paid'?'b-success':'b-warning'}">${s}</span></td>
          <td><button class="btn btn-secondary btn-xs" onclick="alert('Generating payslip...')">🧾 Slip</button></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

// FEE STRUCTURE DATA
const FEE_STRUCTURE_DATA = {
  items: [
    { id: 1, name: 'Tuition Fee', basic4: 1200, basic5: 1250, basic6: 1300, jhs1: 1400, jhs2: 1450, jhs3: 1500, frequency: 'Per Term', mandatory: true },
    { id: 2, name: 'Examination Fee', basic4: 200, basic5: 200, basic6: 200, jhs1: 200, jhs2: 200, jhs3: 200, frequency: 'Per Term', mandatory: true },
    { id: 3, name: 'Sports Levy', basic4: 80, basic5: 80, basic6: 80, jhs1: 80, jhs2: 80, jhs3: 80, frequency: 'Per Term', mandatory: true },
    { id: 4, name: 'Laboratory Fee', basic4: 100, basic5: 100, basic6: 120, jhs1: 120, jhs2: 120, jhs3: 120, frequency: 'Per Term', mandatory: false },
    { id: 5, name: 'Textbook/Stationery', basic4: 280, basic5: 300, basic6: 320, jhs1: 350, jhs2: 350, jhs3: 400, frequency: 'Annually', mandatory: true },
    { id: 6, name: 'ICT Fee', basic4: 80, basic5: 80, basic6: 80, jhs1: 80, jhs2: 80, jhs3: 80, frequency: 'Per Term', mandatory: false },
    { id: 7, name: 'NHIS / Insurance', basic4: 50, basic5: 50, basic6: 50, jhs1: 50, jhs2: 50, jhs3: 50, frequency: 'Annually', mandatory: false },
    { id: 8, name: 'PTA Levy', basic4: 80, basic5: 80, basic6: 80, jhs1: 80, jhs2: 80, jhs3: 80, frequency: 'Annually', mandatory: true },
    { id: 9, name: 'WASSCE Registration', basic4: 0, basic5: 0, basic6: 0, jhs1: 0, jhs2: 0, jhs3: 220, frequency: 'Once', mandatory: false }
  ]
};

// FEE STRUCTURE MODULE
function feeStructModule(){
  const isAdmin = currentRole === 'Admin';
  const addItemBtn = isAdmin ? `<button class="btn btn-primary btn-sm" onclick="openAddFeeItemForm()">+ Add Item</button>` : '';
  
  let html = hdr('Fee Structure','Configure and manage school fee schedules','Fee Structure')+`
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-building"></i> Fee Schedule — Academic Year 2024/2025</span>
      <div style="display:flex;gap:8px">
        ${addItemBtn}
        <button class="btn btn-secondary btn-sm" onclick="exportFeeStructure()"><i class="fas fa-download"></i> Export</button>
      </div>
    </div>
    <div style="overflow-x:auto">
      <table class="tbl">
        <thead><tr><th>Fee Item</th><th>Basic 4 (GH₵)</th><th>Basic 5 (GH₵)</th><th>Basic 6 (GH₵)</th><th>JHS 1 (GH₵)</th><th>JHS 2 (GH₵)</th><th>JHS 3 (GH₵)</th><th>Frequency</th><th>Mandatory</th><th>Actions</th></tr></thead>
        <tbody id="fee-items-table">`;
  
  FEE_STRUCTURE_DATA.items.forEach(item => {
    html += `
      <tr class="fee-item-row" data-id="${item.id}">
        <td style="font-weight:600">${item.name}</td>
        <td>${item.basic4 > 0 ? item.basic4.toLocaleString() : '—'}</td>
        <td>${item.basic5 > 0 ? item.basic5.toLocaleString() : '—'}</td>
        <td>${item.basic6 > 0 ? item.basic6.toLocaleString() : '—'}</td>
        <td>${item.jhs1 > 0 ? item.jhs1.toLocaleString() : '—'}</td>
        <td>${item.jhs2 > 0 ? item.jhs2.toLocaleString() : '—'}</td>
        <td>${item.jhs3 > 0 ? item.jhs3.toLocaleString() : '—'}</td>
        <td><span class="badge b-info">${item.frequency}</span></td>
        <td><span class="badge ${item.mandatory ? 'b-success' : 'b-gray'}">${item.mandatory ? 'Yes' : 'No'}</span></td>
        <td><div style="display:flex;gap:4px">
          ${isAdmin ? `<button class="btn btn-secondary btn-xs" onclick="editFeeItem(${item.id})">Edit</button>
          <button class="btn btn-danger btn-xs" onclick="deleteFeeItem(${item.id})">Del</button>` : '<span style="font-size:10px;color:var(--gray-500)">View only</span>'}
        </div></td>
      </tr>`;
  });
  
  // Calculate totals for per-term items
  const termItems = FEE_STRUCTURE_DATA.items.filter(i => i.frequency === 'Per Term');
  const totalBasic4 = termItems.reduce((sum, item) => sum + item.basic4, 0);
  const totalBasic5 = termItems.reduce((sum, item) => sum + item.basic5, 0);
  const totalBasic6 = termItems.reduce((sum, item) => sum + item.basic6, 0);
  const totalJHS1 = termItems.reduce((sum, item) => sum + item.jhs1, 0);
  const totalJHS2 = termItems.reduce((sum, item) => sum + item.jhs2, 0);
  const totalJHS3 = termItems.reduce((sum, item) => sum + item.jhs3, 0);
  
  html += `
        <tr style="background:var(--blue-xpale)">
          <td style="font-weight:800">Total (Per Term)</td>
          <td style="font-weight:800;color:var(--blue-dark)">GH₵${totalBasic4.toLocaleString()}</td>
          <td style="font-weight:800;color:var(--blue-dark)">GH₵${totalBasic5.toLocaleString()}</td>
          <td style="font-weight:800;color:var(--blue-dark)">GH₵${totalBasic6.toLocaleString()}</td>
          <td style="font-weight:800;color:var(--blue-dark)">GH₵${totalJHS1.toLocaleString()}</td>
          <td style="font-weight:800;color:var(--blue-dark)">GH₵${totalJHS2.toLocaleString()}</td>
          <td style="font-weight:800;color:var(--blue-dark)">GH₵${totalJHS3.toLocaleString()}</td>
          <td colspan="3"></td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>`;
  
  // Add form for admins only
  if(isAdmin) {
    html += `
    <div class="card" style="margin-top:20px">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-plus"></i> Add New Fee Item</span></div>
      <form onsubmit="addNewFeeItem(event)">
        <div class="f-field" style="margin-bottom:12px">
          <label>Fee Item Name</label>
          <input type="text" id="fee-item-name" placeholder="e.g., Library Fee" required>
        </div>
        <div class="f-row">
          <div class="f-field"><label>Basic 4 (GH₵)</label><input type="number" id="fee-basic4" value="0" min="0"></div>
          <div class="f-field"><label>Basic 5 (GH₵)</label><input type="number" id="fee-basic5" value="0" min="0"></div>
          <div class="f-field"><label>Basic 6 (GH₵)</label><input type="number" id="fee-basic6" value="0" min="0"></div>
        </div>
        <div class="f-row">
          <div class="f-field"><label>JHS 1 (GH₵)</label><input type="number" id="fee-jhs1" value="0" min="0"></div>
          <div class="f-field"><label>JHS 2 (GH₵)</label><input type="number" id="fee-jhs2" value="0" min="0"></div>
          <div class="f-field"><label>JHS 3 (GH₵)</label><input type="number" id="fee-jhs3" value="0" min="0"></div>
        </div>
        <div class="f-row">
          <div class="f-field">
            <label>Frequency</label>
            <select id="fee-frequency" required>
              <option>Per Term</option>
              <option>Annually</option>
              <option>Once</option>
            </select>
          </div>
          <div class="f-field">
            <label>Mandatory</label>
            <select id="fee-mandatory" required>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
        <div style="display:flex;gap:8px">
          <button type="submit" class="btn btn-primary">Add Fee Item</button>
          <button type="button" class="btn btn-secondary" onclick="resetFeeForm()">Clear</button>
        </div>
      </form>
    </div>`;
  }
  
  return html;
}

function openAddFeeItemForm() {
  const form = document.querySelector('form[onsubmit="addNewFeeItem(event)"]');
  if(form) {
    form.scrollIntoView({behavior: 'smooth'});
  } else {
    showToast('<i class="fas fa-times-circle"></i> Form not available', 'error');
  }
}

function addNewFeeItem(event) {
  event.preventDefault();
  
  const name = document.getElementById('fee-item-name').value;
  const basic4 = parseInt(document.getElementById('fee-basic4').value) || 0;
  const basic5 = parseInt(document.getElementById('fee-basic5').value) || 0;
  const basic6 = parseInt(document.getElementById('fee-basic6').value) || 0;
  const jhs1 = parseInt(document.getElementById('fee-jhs1').value) || 0;
  const jhs2 = parseInt(document.getElementById('fee-jhs2').value) || 0;
  const jhs3 = parseInt(document.getElementById('fee-jhs3').value) || 0;
  const frequency = document.getElementById('fee-frequency').value;
  const mandatory = document.getElementById('fee-mandatory').value === 'true';
  
  if(!name) {
    showToast('<i class="fas fa-times-circle"></i> Please enter fee item name', 'error');
    return;
  }
  
  const newId = Math.max(...FEE_STRUCTURE_DATA.items.map(i => i.id)) + 1;
  
  FEE_STRUCTURE_DATA.items.push({
    id: newId,
    name,
    basic4,
    basic5,
    basic6,
    jhs1,
    jhs2,
    jhs3,
    frequency,
    mandatory
  });
  
  showToast(`<i class="fas fa-check-circle"></i> Fee item "${name}" added successfully!`, 'success');
  
  // Clear form
  event.target.reset();
  
  // Refresh page
  setTimeout(() => {
    renderMain();
  }, 1500);
}

function resetFeeForm() {
  document.querySelector('form[onsubmit="addNewFeeItem(event)"]').reset();
  showToast('<i class="fas fa-sync"></i> Form cleared', 'info');
}

function editFeeItem(itemId) {
  const item = FEE_STRUCTURE_DATA.items.find(i => i.id === itemId);
  if(!item) {
    showToast('<i class="fas fa-times-circle"></i> Item not found', 'error');
    return;
  }
  
  const formHTML = `
    <div style="max-width:850px;background:white;border-radius:12px;overflow:hidden">
      <div style="padding:20px;background:var(--blue-main);color:white">
        <h2 style="margin:0">Edit Fee Item</h2>
        <p style="margin:8px 0 0 0;font-size:13px;opacity:0.9">${item.name}</p>
      </div>
      
      <form onsubmit="saveEditedFeeItem(event, ${itemId})" style="padding:20px">
        <div class="f-field" style="margin-bottom:12px">
          <label>Fee Item Name</label>
          <input type="text" id="edit-fee-name" value="${item.name}" required>
        </div>
        
        <div style="margin-bottom:16px">
          <h4 style="margin:0 0 12px 0;color:var(--gray-800);font-size:13px;font-weight:700">Amounts by Class</h4>
          <div class="f-row">
            <div class="f-field"><label>Basic 4</label><input type="number" id="edit-basic4" value="${item.basic4}" min="0"></div>
            <div class="f-field"><label>Basic 5</label><input type="number" id="edit-basic5" value="${item.basic5}" min="0"></div>
            <div class="f-field"><label>Basic 6</label><input type="number" id="edit-basic6" value="${item.basic6}" min="0"></div>
          </div>
          <div class="f-row">
            <div class="f-field"><label>JHS 1</label><input type="number" id="edit-jhs1" value="${item.jhs1}" min="0"></div>
            <div class="f-field"><label>JHS 2</label><input type="number" id="edit-jhs2" value="${item.jhs2}" min="0"></div>
            <div class="f-field"><label>JHS 3</label><input type="number" id="edit-jhs3" value="${item.jhs3}" min="0"></div>
          </div>
        </div>
        
        <div class="f-row">
          <div class="f-field">
            <label>Frequency</label>
            <select id="edit-frequency">
              <option ${item.frequency === 'Per Term' ? 'selected' : ''}>Per Term</option>
              <option ${item.frequency === 'Annually' ? 'selected' : ''}>Annually</option>
              <option ${item.frequency === 'Once' ? 'selected' : ''}>Once</option>
            </select>
          </div>
          <div class="f-field">
            <label>Mandatory</label>
            <select id="edit-mandatory">
              <option value="true" ${item.mandatory ? 'selected' : ''}>Yes</option>
              <option value="false" ${!item.mandatory ? 'selected' : ''}>No</option>
            </select>
          </div>
        </div>
        
        <div style="display:flex;gap:8px;margin-top:20px;justify-content:flex-end">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  `;
  
  openModal(formHTML);
}

function saveEditedFeeItem(event, itemId) {
  event.preventDefault();
  
  const item = FEE_STRUCTURE_DATA.items.find(i => i.id === itemId);
  if(!item) return;
  
  item.name = document.getElementById('edit-fee-name').value;
  item.basic4 = parseInt(document.getElementById('edit-basic4').value) || 0;
  item.basic5 = parseInt(document.getElementById('edit-basic5').value) || 0;
  item.basic6 = parseInt(document.getElementById('edit-basic6').value) || 0;
  item.jhs1 = parseInt(document.getElementById('edit-jhs1').value) || 0;
  item.jhs2 = parseInt(document.getElementById('edit-jhs2').value) || 0;
  item.jhs3 = parseInt(document.getElementById('edit-jhs3').value) || 0;
  item.frequency = document.getElementById('edit-frequency').value;
  item.mandatory = document.getElementById('edit-mandatory').value === 'true';
  
  closeModal();
  showToast('<i class="fas fa-check-circle"></i> Fee item updated successfully!', 'success');
  
  setTimeout(() => {
    renderMain();
  }, 1500);
}

function deleteFeeItem(itemId) {
  const item = FEE_STRUCTURE_DATA.items.find(i => i.id === itemId);
  if(!item) {
    showToast('<i class="fas fa-times-circle"></i> Item not found', 'error');
    return;
  }
  
  if(confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
    FEE_STRUCTURE_DATA.items = FEE_STRUCTURE_DATA.items.filter(i => i.id !== itemId);
    showToast('<i class="fas fa-check-circle"></i> Fee item deleted successfully!', 'success');
    
    setTimeout(() => {
      renderMain();
    }, 1500);
  }
}

function exportFeeStructure() {
  let csv = 'Fee Item,Basic 4 (GH₵),Basic 5 (GH₵),Basic 6 (GH₵),JHS 1 (GH₵),JHS 2 (GH₵),JHS 3 (GH₵),Frequency,Mandatory\n';
  
  FEE_STRUCTURE_DATA.items.forEach(item => {
    csv += `"${item.name}",${item.basic4},${item.basic5},${item.basic6},${item.jhs1},${item.jhs2},${item.jhs3},"${item.frequency}","${item.mandatory ? 'Yes' : 'No'}"\n`;
  });
  
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'fee-structure-' + new Date().toISOString().slice(0, 10) + '.csv');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  
  showToast('<i class="fas fa-check-circle"></i> Fee structure exported as CSV', 'success');
}

// EVENTS & CALENDAR DATA
const EVENTS_DATA = [
  { id: 1, title: '<i class="fas fa-running"></i> Sports Day', date: '2026-03-24', time: '08:00', allDay: true, audience: 'All Students & Staff', description: 'Full-day sports competition. Students must wear house colors. Attendance compulsory. Parents welcome.' },
  { id: 2, title: '<i class="fas fa-users"></i> PTA Meeting', date: '2026-03-20', time: '15:00', allDay: false, audience: 'Parents & Teachers', description: 'End-of-term PTA meeting in the school hall. All parents are strongly encouraged to attend.' },
  { id: 3, title: '<i class="fas fa-file-alt"></i> Term 1 Exams Begin', date: '2026-04-01', time: '07:30', allDay: false, audience: 'Basic 4–6, JHS 1–3', description: 'Final examinations for Term 1. Detailed timetable available on the portal.' },
  { id: 4, title: '<i class="fas fa-graduation-cap"></i> Prize Giving Ceremony', date: '2026-04-15', time: '10:00', allDay: false, audience: 'All', description: 'Annual prize-giving and graduation ceremony. Smart attire required for all.' },
  { id: 5, title: '<i class="fas fa-school"></i> Open Day', date: '2026-04-20', time: '09:00', allDay: false, audience: 'Prospective Parents', description: 'School open day for prospective students and parents. Tours from 9AM.' }
];

// EVENTS MODULE
function eventsModule(){
  const isTeacherOrAdmin = ['Teacher','Admin'].includes(currentRole);
  const addEventBtn = isTeacherOrAdmin ? `<button class="btn btn-primary btn-sm" onclick="openAddEventForm()">+ Add Event</button>` : '';
  
  // Sort events by date
  const sortedEvents = [...EVENTS_DATA].sort((a,b) => new Date(a.date) - new Date(b.date));
  
  let html = hdr('Events & Calendar','School events, holidays and important dates','Events & Calendar')+`
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-calendar-alt"></i> Upcoming Events</span>
      <div style="display:flex;gap:8px">
        ${addEventBtn}
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr;gap:12px" id="upcoming-events">`;
  
  sortedEvents.forEach(event => {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = event.allDay ? 'All Day' : new Date(`${event.date}T${event.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    
    html += `
      <div style="border:1px solid var(--border);border-radius:12px;padding:16px;background:rgba(26,86,219,0.03)" onclick="viewEvent(${event.id})">
        <div style="display:flex;justify-content:space-between;align-items:start">
          <div>
            <h3 style="margin:0 0 8px 0;font-size:16px;font-weight:600">${event.title}</h3>
            <p style="margin:0 0 6px 0;font-size:14px;color:var(--gray-600)"><strong>${timeStr}</strong></p>
            <p style="margin:0 0 8px 0;font-size:13px;color:var(--gray-600)"><i class="fas fa-map-pin"></i> ${formattedDate} · ${event.audience}</p>
            <p style="margin:0;font-size:13px;color:var(--gray-700)">${event.description}</p>
          </div>
          ${isTeacherOrAdmin ? `<div style="display:flex;gap:4px;min-width:fit-content">
            <button class="btn btn-secondary btn-xs" onclick="event.stopPropagation();editEvent(${event.id})">Edit</button>
            <button class="btn btn-danger btn-xs" onclick="event.stopPropagation();deleteEvent(${event.id})">Del</button>
          </div>` : ''}
        </div>
      </div>`;
  });
  
  html += `</div>
  </div>
  
  <div class="card" style="margin-top:20px">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-calendar-alt"></i> Calendar</span>
      <div id="calendar-nav" style="display:flex;gap:8px;align-items:center">
        <button class="btn btn-secondary btn-xs" onclick="prevMonth()" style="padding:6px 10px">‹</button>
        <span id="calendar-month" style="font-weight:600;min-width:150px;text-align:center"></span>
        <button class="btn btn-secondary btn-xs" onclick="nextMonth()" style="padding:6px 10px">›</button>
      </div>
    </div>
    <div style="padding:16px">
      <div id="calendar-grid" style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px"></div>
    </div>
  </div>`;
  
  return html;
}

function renderCalendar(year = 2026, month = 2) { // month is 0-indexed, so 2 = March
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('calendar-month').textContent = monthNames[month] + ' ' + year;
  
  let grid = '';
  const dayLabels = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  
  // Day labels
  dayLabels.forEach(label => {
    grid += `<div style="text-align:center;font-weight:600;padding:8px;font-size:12px;color:var(--gray-600)">${label}</div>`;
  });
  
  // Empty cells before first day
  for(let i=0;i<firstDay;i++) {
    grid += `<div></div>`;
  }
  
  // Days of month
  const today = new Date();
  for(let day=1;day<=daysInMonth;day++) {
    const cellDate = new Date(year, month, day);
    const hasEvent = EVENTS_DATA.some(e => e.date === `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`);
    const isToday = cellDate.toDateString() === today.toDateString();
    
    let cellStyle = 'padding:8px;border-radius:8px;text-align:center;cursor:pointer;border:1px solid transparent;font-weight:500;';
    if(hasEvent) cellStyle += 'background:var(--blue-xpale);border-color:var(--blue-main);color:var(--blue-dark);font-weight:700;';
    if(isToday) cellStyle += 'background:var(--blue-main);color:white;';
    
    grid += `<div style="${cellStyle};">${day}</div>`;
  }
  
  document.getElementById('calendar-grid').innerHTML = grid;
}

let currentCalendarYear = 2026, currentCalendarMonth = 2; // Start at March 2026

function nextMonth(){
  currentCalendarMonth++;
  if(currentCalendarMonth > 11) {
    currentCalendarMonth = 0;
    currentCalendarYear++;
  }
  renderCalendar(currentCalendarYear, currentCalendarMonth);
}

function prevMonth(){
  currentCalendarMonth--;
  if(currentCalendarMonth < 0) {
    currentCalendarMonth = 11;
    currentCalendarYear--;
  }
  renderCalendar(currentCalendarYear, currentCalendarMonth);
}

function openAddEventForm() {
  const formHTML = `
    <div style="max-width:850px;background:white;border-radius:12px;overflow:hidden">
      <div style="padding:20px;background:var(--blue-main);color:white">
        <h2 style="margin:0">Add New Event</h2>
        <p style="margin:8px 0 0 0;font-size:13px;opacity:0.9">Create a new school event</p>
      </div>
      
      <form onsubmit="addNewEvent(event)" style="padding:20px">
        <div class="f-field" style="margin-bottom:12px">
          <label>Event Title</label>
          <input type="text" id="event-title" placeholder="e.g., Sports Day" required>
        </div>
        
        <div class="f-row">
          <div class="f-field">
            <label>Date</label>
            <input type="date" id="event-date" required>
          </div>
          <div class="f-field">
            <label>Time</label>
            <input type="time" id="event-time" required>
          </div>
          <div class="f-field">
            <label>All Day Event</label>
            <input type="checkbox" id="event-allday" style="width:auto;margin-top:8px">
          </div>
        </div>
        
        <div class="f-field" style="margin-bottom:12px">
          <label>Audience</label>
          <input type="text" id="event-audience" placeholder="e.g., All Students & Staff" required>
        </div>
        
        <div class="f-field" style="margin-bottom:12px">
          <label>Description</label>
          <textarea id="event-description" placeholder="Event details..." rows="4" required></textarea>
        </div>
        
        <div style="display:flex;gap:8px;margin-top:20px;justify-content:flex-end">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Create Event</button>
        </div>
      </form>
    </div>
  `;
  
  openModal(formHTML);
}

function addNewEvent(event) {
  event.preventDefault();
  
  const title = document.getElementById('event-title').value;
  const date = document.getElementById('event-date').value;
  const time = document.getElementById('event-time').value;
  const allDay = document.getElementById('event-allday').checked;
  const audience = document.getElementById('event-audience').value;
  const description = document.getElementById('event-description').value;
  
  if(!title || !date || !time || !audience || !description) {
    showToast('<i class="fas fa-times-circle"></i> Please fill all fields', 'error');
    return;
  }
  
  const newId = Math.max(...EVENTS_DATA.map(e => e.id), 0) + 1;
  
  EVENTS_DATA.push({
    id: newId,
    title,
    date,
    time,
    allDay,
    audience,
    description
  });
  
  closeModal();
  showToast(`<i class="fas fa-check-circle"></i> Event "${title}" created successfully!`, 'success');
  
  setTimeout(() => {
    renderMain();
    renderCalendar(currentCalendarYear, currentCalendarMonth);
  }, 1500);
}

function viewEvent(eventId) {
  const event = EVENTS_DATA.find(e => e.id === eventId);
  if(!event) {
    showToast('<i class="fas fa-times-circle"></i> Event not found', 'error');
    return;
  }
  
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = event.allDay ? 'All Day' : new Date(`${event.date}T${event.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  
  const detailHTML = `
    <div style="max-width:850px;background:white;border-radius:12px;overflow:hidden">
      <div style="padding:20px;background:var(--blue-main);color:white">
        <h2 style="margin:0">${event.title}</h2>
      </div>
      
      <div style="padding:20px">
        <div style="margin-bottom:16px">
          <h4 style="margin:0 0 8px 0;font-size:12px;font-weight:700;color:var(--gray-600);text-transform:uppercase">Date & Time</h4>
          <p style="margin:0;font-size:15px">${formattedDate} · ${timeStr}</p>
        </div>
        
        <div style="margin-bottom:16px">
          <h4 style="margin:0 0 8px 0;font-size:12px;font-weight:700;color:var(--gray-600);text-transform:uppercase">Audience</h4>
          <p style="margin:0;font-size:15px">${event.audience}</p>
        </div>
        
        <div style="margin-bottom:16px">
          <h4 style="margin:0 0 8px 0;font-size:12px;font-weight:700;color:var(--gray-600);text-transform:uppercase">Description</h4>
          <p style="margin:0;font-size:14px;line-height:1.6">${event.description}</p>
        </div>
        
        <div style="display:flex;gap:8px;margin-top:24px;justify-content:flex-end">
          ${['Teacher','Admin'].includes(currentRole) ? `
            <button class="btn btn-secondary" onclick="closeModal();editEvent(${event.id})">Edit</button>
            <button class="btn btn-danger" onclick="closeModal();deleteEvent(${event.id})">Delete</button>
          ` : ''}
          <button class="btn btn-primary" onclick="closeModal()">Close</button>
        </div>
      </div>
    </div>
  `;
  
  openModal(detailHTML);
}

function editEvent(eventId) {
  const event = EVENTS_DATA.find(e => e.id === eventId);
  if(!event) {
    showToast('<i class="fas fa-times-circle"></i> Event not found', 'error');
    return;
  }
  
  const formHTML = `
    <div style="max-width:850px;background:white;border-radius:12px;overflow:hidden">
      <div style="padding:20px;background:var(--blue-main);color:white">
        <h2 style="margin:0">Edit Event</h2>
        <p style="margin:8px 0 0 0;font-size:13px;opacity:0.9">${event.title}</p>
      </div>
      
      <form onsubmit="saveEditEvent(event, ${eventId})" style="padding:20px">
        <div class="f-field" style="margin-bottom:12px">
          <label>Event Title</label>
          <input type="text" id="edit-event-title" value="${event.title}" required>
        </div>
        
        <div class="f-row">
          <div class="f-field">
            <label>Date</label>
            <input type="date" id="edit-event-date" value="${event.date}" required>
          </div>
          <div class="f-field">
            <label>Time</label>
            <input type="time" id="edit-event-time" value="${event.time}" required>
          </div>
          <div class="f-field">
            <label>All Day Event</label>
            <input type="checkbox" id="edit-event-allday" ${event.allDay ? 'checked' : ''} style="width:auto;margin-top:8px">
          </div>
        </div>
        
        <div class="f-field" style="margin-bottom:12px">
          <label>Audience</label>
          <input type="text" id="edit-event-audience" value="${event.audience}" required>
        </div>
        
        <div class="f-field" style="margin-bottom:12px">
          <label>Description</label>
          <textarea id="edit-event-description" rows="4" required>${event.description}</textarea>
        </div>
        
        <div style="display:flex;gap:8px;margin-top:20px;justify-content:flex-end">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  `;
  
  openModal(formHTML);
}

function saveEditEvent(eventElement, eventId) {
  if(eventElement && eventElement.preventDefault) {
    eventElement.preventDefault();
  }
  
  const event = EVENTS_DATA.find(e => e.id === eventId);
  if(!event) {
    showToast('<i class="fas fa-times-circle"></i> Event not found', 'error');
    return;
  }
  
  event.title = document.getElementById('edit-event-title').value;
  event.date = document.getElementById('edit-event-date').value;
  event.time = document.getElementById('edit-event-time').value;
  event.allDay = document.getElementById('edit-event-allday').checked;
  event.audience = document.getElementById('edit-event-audience').value;
  event.description = document.getElementById('edit-event-description').value;
  
  closeModal();
  showToast('<i class="fas fa-check-circle"></i> Event updated successfully!', 'success');
  
  setTimeout(() => {
    renderMain();
    renderCalendar(currentCalendarYear, currentCalendarMonth);
  }, 1500);
}

function deleteEvent(eventId) {
  const event = EVENTS_DATA.find(e => e.id === eventId);
  if(!event) {
    showToast('<i class="fas fa-times-circle"></i> Event not found', 'error');
    return;
  }
  
  if(confirm(`Are you sure you want to delete "${event.title}"? This action cannot be undone.`)) {
    EVENTS_DATA.splice(EVENTS_DATA.indexOf(event), 1);
    closeModal();
    showToast('<i class="fas fa-check-circle"></i> Event deleted successfully!', 'success');
    
    setTimeout(() => {
      renderMain();
      renderCalendar(currentCalendarYear, currentCalendarMonth);
    }, 1500);
  }
}

// RECEIPTS MODULE
function receiptsModule(){
  return hdr('Receipts','Generate and manage payment receipts','Receipts')+`
  <div class="card">
    <div class="toolbar">
      <button class="btn btn-gold" onclick="alert('Opening receipt issuance form...')">+ Issue New Receipt</button>
      <div class="search-bar"><span><i class="fas fa-search"></i></span><input placeholder="Search receipt no. or student..."></div>
    </div>
    <table class="tbl">
      <thead><tr><th>Receipt No.</th><th>Student</th><th>Class</th><th>Amount</th><th>Term</th><th>Date</th><th>Issued By</th><th>Actions</th></tr></thead>
      <tbody>
        ${[['#R-0482','Ama Serwaa','Form 3A','GH₵2,400','Term 1','Mar 15','Mr. Kojo'],['#R-0481','Kwame Asante','Form 2B','GH₵1,200','Term 1','Mar 15','Mr. Kojo'],['#R-0480','Abena Mensah','Form 1C','GH₵2,200','Term 1','Mar 14','Mr. Kojo'],['#R-0479','Akosua Darko','JHS 2','GH₵2,300','Term 1','Mar 13','Mr. Kojo']].map(([r,n,c,a,t,d,ib])=>`
        <tr>
          <td style="color:var(--blue-main);font-weight:700">${r}</td>
          <td>${n}</td><td>${c}</td>
          <td style="font-weight:700;color:var(--success)">${a}</td>
          <td>${t}</td><td>${d}</td><td>${ib}</td>
          <td><div style="display:flex;gap:4px"><button class="btn btn-secondary btn-xs"><i class="fas fa-print"></i> Print</button><button class="btn btn-primary btn-xs"><i class="fas fa-download"></i> PDF</button></div></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

// EXPENSES MODULE
function expensesModule(){
  return hdr('Expenses','Record and manage school expenditure','Expenses')+`
  <div class="stats-row">
    ${statCard('<i class="fas fa-chart-line"></i>','GH₵89K','Total Expenses','This term','neu','si-red')}
    ${statCard('<i class="fas fa-briefcase"></i>','GH₵59K','Staff Salaries','63% of expenses','neu','si-blue')}
    ${statCard('<i class="fas fa-wrench"></i>','GH₵18K','Operations','20%','neu','si-gold')}
    ${statCard('<i class="fas fa-chart-bar"></i>','GH₵12K','Other','13%','neu','si-green')}
  </div>
  <div class="g21">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-line"></i> Expense Records</span><button class="btn btn-primary btn-sm">+ Add Expense</button></div>
      <table class="tbl">
        <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th>Approved By</th><th>Status</th></tr></thead>
        <tbody>
          ${[['Mar 17','Electricity Bill — March','Utilities','GH₵4,200','Principal','Paid'],['Mar 15','Stationery Supplies','Admin','GH₵1,800','Accountant','Paid'],['Mar 12','Sports Equipment','Athletics','GH₵3,500','HOD Sports','Paid'],['Mar 10','Lab Chemicals Restock','Science','GH₵2,100','HOD Science','Pending'],['Mar 8','Maintenance Repair','Facilities','GH₵850','Admin','Paid']].map(([d,desc,c,a,ap,s])=>`
          <tr>
            <td>${d}</td><td>${desc}</td>
            <td><span class="badge b-info">${c}</span></td>
            <td style="font-weight:700;color:var(--danger)">${a}</td>
            <td>${ap}</td>
            <td><span class="badge ${s==='Paid'?'b-success':'b-warning'}">${s}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-plus"></i> Add Expense</span></div>
      <div class="f-field" style="margin-bottom:12px"><label>Description</label><input placeholder="Expense description..."></div>
      <div class="f-row">
        <div class="f-field"><label>Category</label><select><option>Utilities</option><option>Admin</option><option>Salaries</option><option>Facilities</option></select></div>
        <div class="f-field"><label>Amount (GH₵)</label><input type="number" placeholder="0.00"></div>
      </div>
      <div class="f-row">
        <div class="f-field"><label>Date</label><input type="date"></div>
        <div class="f-field"><label>Approved By</label><input placeholder="Approver name..."></div>
      </div>
      <div class="f-field" style="margin-bottom:14px"><label>Notes</label><textarea placeholder="Additional notes..."></textarea></div>
      <button class="btn btn-primary" style="width:100%">Record Expense</button>
    </div>
  </div>`;
}

// BALANCE SHEET
function balanceSheetModule(){
  return hdr('Balance Sheet','Financial position of the school','Balance Sheet')+`
  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-money-bill"></i> Income — Term 1, 2025</span></div>
      <table class="tbl">
        <thead><tr><th>Source</th><th>Amount (GH₵)</th><th>%</th></tr></thead>
        <tbody>
          ${[['School Fees','248,000','82%'],['Examination Fees','18,000','6%'],['Sports Levy','9,600','3%'],['Lab Fees','12,800','4%'],['Donations','5,000','2%'],['Other Income','3,600','1%']].map(([s,a,p])=>`
          <tr><td>${s}</td><td style="font-weight:700;color:var(--success)">GH₵${a}</td><td><span class="badge b-info">${p}</span></td></tr>`).join('')}
          <tr style="background:var(--blue-xpale)"><td style="font-weight:800">TOTAL INCOME</td><td style="font-weight:800;color:var(--blue-dark)">GH₵297,000</td><td>100%</td></tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-line"></i> Expenditure — Term 1, 2025</span></div>
      <table class="tbl">
        <thead><tr><th>Category</th><th>Amount (GH₵)</th><th>%</th></tr></thead>
        <tbody>
          ${[['Staff Salaries','148,000','66%'],['Utilities','12,000','5%'],['Maintenance','8,500','4%'],['Stationery','5,200','2%'],['Sports Equipment','4,800','2%'],['Other Expenses','9,500','4%']].map(([c,a,p])=>`
          <tr><td>${c}</td><td style="font-weight:700;color:var(--danger)">GH₵${a}</td><td><span class="badge b-gray">${p}</span></td></tr>`).join('')}
          <tr style="background:#fff1f2"><td style="font-weight:800">TOTAL EXPENDITURE</td><td style="font-weight:800;color:var(--danger)">GH₵188,000</td><td>100%</td></tr>
        </tbody>
      </table>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
    <div class="fee-hero">
      <h3>Total Income</h3>
      <div class="amount">GH₵ 297,000</div>
      <div class="sub">Term 1, 2025</div>
    </div>
    <div class="fee-hero" style="background:linear-gradient(135deg,#991b1b,var(--danger))">
      <h3>Total Expenditure</h3>
      <div class="amount">GH₵ 188,000</div>
      <div class="sub">Term 1, 2025</div>
    </div>
    <div class="fee-hero" style="background:linear-gradient(135deg,#065f46,var(--success))">
      <h3>Net Surplus</h3>
      <div class="amount">GH₵ 109,000</div>
      <div class="sub">After all expenses</div>
    </div>
  </div>`;
}

// ALUMNI DIRECTORY
function alumniDirectory(){
  return `<div class="toolbar">
    <button class="btn btn-primary" onclick="toggleAddAlumniForm()"><i class="fas fa-plus"></i> Add Alumni</button>
    <div class="search-bar" style="flex:1;min-width:200px"><span><i class="fas fa-search"></i></span><input id="alumni-search" placeholder="Search alumni..." onkeyup="filterAlumni()"></div>
    <select id="alumni-year-filter" class="select-sm" onchange="filterAlumni()"><option value="">All Years</option><option value="2021">Class of 2021</option><option value="2020">Class of 2020</option><option value="2019">Class of 2019</option><option value="2018">Class of 2018</option><option value="2017">Class of 2017</option><option value="2016">Class of 2016</option><option value="2015">Class of 2015</option><option value="2014">Class of 2014</option><option value="2013">Class of 2013</option><option value="2012">Class of 2012</option></select>
    <select id="alumni-profession-filter" class="select-sm" onchange="filterAlumni()"><option value="">All Professions</option><option value="Software Engineer">Engineering</option><option value="Medical Doctor">Medicine</option><option value="Lawyer">Law</option><option value="Teacher">Education</option><option value="Nurse">Healthcare</option><option value="Business">Business</option></select>
  </div>

  <!-- ADD ALUMNI FORM -->
  <div id="alumni-form-wrap" style="display:none;margin-bottom:20px">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-user-plus"></i> Add New Alumni</span></div>
      <div class="form-grid">
        <div class="form-field"><label>Full Name *</label><input type="text" id="alumni-name" placeholder="Full name"></div>
        <div class="form-field"><label>Class Year *</label><input type="number" id="alumni-year" placeholder="2020" min="1985" max="2024"></div>
        <div class="form-field"><label>Profession *</label><input type="text" id="alumni-profession" placeholder="e.g., Software Engineer"></div>
        <div class="form-field"><label>Location *</label><input type="text" id="alumni-location" placeholder="City · Organization"></div>
        <div class="form-field"><label>Email *</label><input type="email" id="alumni-email" placeholder="email@example.com"></div>
        <div class="form-field"><label>Phone *</label><input type="tel" id="alumni-phone" placeholder="+233 XXX XXX XXXX"></div>
        <div class="form-field"><label>Instagram Handle</label><input type="text" id="alumni-instagram" placeholder="@username"></div>
        <div class="form-field"><label>LinkedIn Profile</label><input type="text" id="alumni-linkedin" placeholder="linkedin.com/in/username"></div>
        <div class="form-field"><label>Twitter Handle</label><input type="text" id="alumni-twitter" placeholder="@username"></div>
        <div class="form-field"><label>Facebook URL</label><input type="text" id="alumni-facebook" placeholder="facebook.com/username"></div>
        <div class="form-field" style="grid-column:1/-1"><label>Bio</label><textarea id="alumni-bio" placeholder="Brief biography..." style="min-height:60px;font-family:Poppins,sans-serif;border:1.5px solid var(--gray-200);border-radius:6px;padding:8px;font-size:12px"></textarea></div>
        <div style="grid-column:1/-1;display:flex;gap:8px">
          <button class="btn btn-primary" style="flex:1" onclick="submitAlumni()"><i class="fas fa-check"></i> Add Alumni Member</button>
          <button class="btn btn-secondary" style="flex:1" onclick="toggleAddAlumniForm()">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <div class="g3" id="alumni-grid">
    ${Object.values(ALUMNI_DATA).map(a=>`
    <div class="card alumni-card" data-name="${a.name.toLowerCase()}" data-year="${a.classYear}" data-profession="${a.profession.toLowerCase()}">
      <div style="display:flex;gap:12px;margin-bottom:14px">
        <div class="av av-lg av-${a.avatarColor}">${a.avatar}</div>
        <div><div style="font-size:14px;font-weight:700;color:var(--blue-dark)">${a.name}</div>
        <span class="badge b-info" style="margin-top:4px">Class of ${a.classYear}</span></div>
      </div>
      <div style="font-size:13px;font-weight:600;margin-bottom:4px">${a.profession}</div>
      <div style="font-size:11px;color:var(--gray-400);margin-bottom:14px"><i class="fas fa-map-pin"></i> ${a.location}</div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-secondary btn-xs" style="flex:1" onclick="showAlumniProfile('${a.id}')">Profile</button>
        <button class="btn btn-primary btn-xs" style="flex:1" onclick="showConnectModal('${a.id}')">Connect</button>
      </div>
    </div>`).join('')}
  </div>`;
}

// DONATIONS MODULE
function donationsModule(){
  return hdr('Donations','Alumni and external donations to the school','Donations')+`
  <div class="stats-row">
    ${statCard('<i class="fas fa-handshake"></i>','GH₵42K','Total Donations','This year','up','si-blue')}
    ${statCard('<i class="fas fa-users"></i>','48','Total Donors','Alumni donors','up','si-gold')}
    ${statCard('<i class="fas fa-target"></i>','GH₵100K','Annual Target','42% achieved','neu','si-green')}
    ${statCard('<i class="fas fa-calendar-alt"></i>','3','Active Campaigns','Current drives','neu','si-purple')}
  </div>
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-handshake"></i> Donation Records</span><button class="btn btn-primary btn-sm">+ Record Donation</button></div>
    <table class="tbl">
      <thead><tr><th>Donor</th><th>Class</th><th>Amount</th><th>Campaign</th><th>Date</th><th>Status</th></tr></thead>
      <tbody>
        ${[['Abena Owusu','Class 2018','GH₵5,000','Library Fund','Mar 10','Received'],['Kwabena Asare','Class 2016','GH₵10,000','Scholarship Fund','Mar 5','Received'],['Anonymous Alumni','—','GH₵2,000','General Fund','Feb 28','Received'],['Kofi Antwi','Class 2014','GH₵3,500','ICT Lab','Feb 20','Received']].map(([n,c,a,camp,d,s])=>`
        <tr>
          <td><strong>${n}</strong></td>
          <td><span class="badge b-info">${c}</span></td>
          <td style="font-weight:700;color:var(--success)">${a}</td>
          <td>${camp}</td><td>${d}</td>
          <td><span class="badge b-success">${s}</span></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

// JOB BOARD
function jobBoardModule(){
  return hdr('Job Board','Career opportunities from the alumni network','Job Board')+`
  <div class="toolbar">
    <button class="btn btn-primary">+ Post Job</button>
    <div class="search-bar"><span><i class="fas fa-search"></i></span><input placeholder="Search jobs..."></div>
    <select class="select-sm"><option>All Industries</option><option>Tech</option><option>Health</option><option>Education</option></select>
  </div>
  <div style="display:flex;flex-direction:column;gap:14px">
    ${[['Software Developer Intern','Accra · Remote possible','0–2 years','Technology','GH₵1,500/mo','Today','Abena Owusu (Class 2018)'],['Medical Resident','Korle Bu Teaching Hospital, Accra','Graduate','Healthcare','Competitive','2 days ago','Kwabena Asare (Class 2016)'],['Junior Secondary School Teacher','Kumasi · Full Time','PGDE required','Education','GH₵2,800/mo','1 week ago','Esi Mensah (Class 2020)'],['Civil Engineering Graduate Trainee','Takoradi · Full Time','0–2 years','Engineering','GH₵4,000/mo','2 weeks ago','Kofi Antwi (Class 2014)']].map(([t,l,exp,ind,sal,d,poster])=>`
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px">
        <div style="flex:1">
          <div style="font-size:15px;font-weight:800;color:var(--blue-dark);margin-bottom:8px">${t}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">
            <span class="badge b-info"><i class="fas fa-map-pin"></i> ${l}</span>
            <span class="badge b-gray"><i class="fas fa-stopwatch"></i> ${exp}</span>
            <span class="badge b-success"><i class="fas fa-money-bill"></i> ${sal}</span>
            <span class="badge b-warning">${ind}</span>
          </div>
          <div style="font-size:11px;color:var(--gray-400)">Posted by ${poster} · ${d}</div>
        </div>
        <div style="display:flex;gap:6px;flex-shrink:0">
          <button class="btn btn-secondary btn-sm">Details</button>
          <button class="btn btn-primary btn-sm">Apply</button>
        </div>
      </div>
    </div>`).join('')}
  </div>`;
}

// CERTIFICATES MODULE
function certificatesModule(){
  return hdr('Certificate Requests','Request and track official school certificates','Certificates')+`
  <div class="g21">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-scroll"></i> My Requests</span></div>
      <table class="tbl">
        <thead><tr><th>Certificate Type</th><th>Purpose</th><th>Date Requested</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${[['WASSCE Result Slip','Job Application','Mar 10, 2025','Ready','download'],['Transcript','University Admission','Mar 5, 2025','Processing','—'],['Character Reference','Visa Application','Feb 28, 2025','Ready','download']].map(([t,p,d,s,a])=>`
          <tr>
            <td style="font-weight:600">${t}</td><td>${p}</td><td>${d}</td>
            <td><span class="badge ${s==='Ready'?'b-success':'b-warning'}">${s}</span></td>
            <td>${a==='download'?`<button class="btn btn-primary btn-xs"><i class="fas fa-download"></i> Download</button>`:'Awaiting'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-plus"></i> New Request</span></div>
      <div class="f-field" style="margin-bottom:12px"><label>Certificate Type</label><select><option>WASSCE Result Slip</option><option>Transcript</option><option>Character Reference</option><option>Graduation Certificate</option></select></div>
      <div class="f-field" style="margin-bottom:12px"><label>Purpose / Reason</label><input placeholder="e.g. Job application, University admission..."></div>
      <div class="f-field" style="margin-bottom:12px"><label>Urgency</label><select><option>Normal (5-7 business days)</option><option>Urgent (2-3 business days)</option></select></div>
      <div class="f-field" style="margin-bottom:14px"><label>Additional Notes</label><textarea placeholder="Any special instructions..."></textarea></div>
      <button class="btn btn-primary" style="width:100%">Submit Request</button>
    </div>
  </div>`;
}

// ALUMNI PUBLIC MODULE
function alumniPubModule(){
  return `<div class="visitor-hero" style="margin-bottom:26px">
    <h1><i class="fas fa-medal"></i> Our Distinguished Alumni</h1>
    <p>Glory Regin Preparatory school alumni are making their mark across Ghana and around the world. Join our growing network of over 5,200 graduates.</p>
    <div class="hero-btns">
      <button class="hero-btn-gold">Connect with Alumni</button>
      <button class="hero-btn-outline">Alumni Association</button>
    </div>
  </div>`+alumniDirectory();
}

// VISITOR PAGES
function visitorAbout(){
  return `<div class="visitor-hero" style="margin-bottom:26px">
    <h1>About Glory Regin Preparatory school</h1>
    <p>Established in 1985, nurturing leaders for over 40 years</p>
  </div>
  <div class="g3 mb24">
    ${[['<i class="fas fa-target"></i>','Our Mission','To provide holistic, quality education that develops critical thinking, character and lifelong learning in every student.'],['<i class="fas fa-eye"></i>','Our Vision','To be the leading secondary school in Ghana, producing graduates who are globally competitive and community-driven.'],['<i class="fas fa-gem"></i>','Our Values','Excellence, Integrity, Innovation, Teamwork, Service and Respect for diversity and human dignity.']].map(([i,t,d])=>`
    <div class="card" style="text-align:center">
      <div style="font-size:40px;margin-bottom:14px">${i}</div>
      <h3 style="font-size:15px;font-weight:700;color:var(--blue-dark);margin-bottom:8px">${t}</h3>
      <p style="font-size:12.5px;color:var(--gray-500);line-height:1.7">${d}</p>
    </div>`).join('')}
  </div>
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-scroll"></i> Our History</span></div>
    <p style="font-size:13.5px;color:var(--gray-600);line-height:1.8">Glory Regin Preparatory school was founded in 1985 by the Ghanaian Ministry of Education as a model secondary school for the Greater Accra Region. Starting with just 200 students and 12 teachers, we have grown to over 842 students across 8 classes today. Our alumni span across every continent and include politicians, doctors, engineers, artists and academics. We have consistently maintained a pass rate above 95% and have produced national champions in sports, academics and civic leadership. Today, we continue to invest in world-class facilities, exceptional teaching staff, and an enriching learning environment for every student.</p>
  </div>`;
}

function visitorAdmission(){
  return `<div class="visitor-hero" style="margin-bottom:26px">
    <h1>Admissions 2025/2026</h1>
    <p>Applications for the new academic year are now open. Join a legacy of excellence.</p>
    <div class="hero-btns"><button class="hero-btn-gold">Apply Online Now</button></div>
  </div>
  <div class="g2">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-clipboard-list"></i> Entry Requirements</span></div>
      ${[['Age Requirement','Not more than 18 years at time of admission'],['Medical Certificate','Current health status from a certified physician'],['Character Reference','Letter from primary school headteacher'],['Passport Photographs','2 recent passport-sized photographs'],['Birth Certificate','Original and photocopy']].map(([t,d])=>`
      <div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--gray-100)">
        <span style="color:var(--success);font-weight:800;font-size:16px;flex-shrink:0">✓</span>
        <div><div style="font-size:13px;font-weight:600">${t}</div><div style="font-size:11px;color:var(--gray-400);margin-top:2px">${d}</div></div>
      </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-file-alt"></i> Application Form</span></div>
      <div class="f-row"><div class="f-field"><label>First Name</label><input placeholder="First name"></div><div class="f-field"><label>Last Name</label><input placeholder="Last name"></div></div>
      <div class="f-row"><div class="f-field"><label>Date of Birth</label><input type="date"></div><div class="f-field"><label>Gender</label><select><option>Female</option><option>Male</option></select></div></div>
      <div class="f-row"><div class="f-field"><label>Parent/Guardian Name</label><input placeholder="Full name"></div><div class="f-field"><label>Contact Number</label><input placeholder="+233..."></div></div>
      <div class="f-field" style="margin-bottom:12px"><label>Email Address</label><input placeholder="email@example.com"></div>
      <div class="f-field" style="margin-bottom:14px"><label>BECE Aggregate Score</label><input type="number" placeholder="e.g. 12"></div>
      <button class="btn btn-primary" style="width:100%">Submit Application</button>
    </div>
  </div>`;
}

function visitorNews(){
  const articlesHTML = newsArticles
    .filter(article => article.status === 'Published')
    .map(article => `
    <div class="card">
      <div style="width:100%;height:100px;background:var(--blue-xpale);border-radius:var(--radius);display:flex;align-items:center;justify-content:center;font-size:42px;margin-bottom:14px">${article.icon}</div>
      <h3 style="font-size:14px;font-weight:700;color:var(--blue-dark);margin-bottom:8px">${article.title}</h3>
      <p style="font-size:12px;color:var(--gray-400);line-height:1.6;margin-bottom:10px">${article.desc}</p>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:10px;color:var(--gray-400)">${article.date}</span>
        <button class="btn btn-secondary btn-xs" onclick="showNewsArticle('${article.title.replace(/'/g, "\\'")}', '${article.content.replace(/'/g, "\\'")}')">Read More</button>
      </div>
    </div>`).join('');

  return `${hdr('News & Blog', 'Latest news, events and stories from Glory Regin Preparatory school', 'News')}
  <div class="g3">
    ${articlesHTML}
  </div>`;
}

function showNewsArticle(title, content){
  const modal = `
    <div style="padding:30px;max-width:600px">
      <h2 style="font-size:20px;font-weight:700;color:var(--blue-dark);margin-bottom:16px">${title}</h2>
      <p style="font-size:13px;color:var(--gray-600);line-height:1.8;margin-bottom:20px">${content}</p>
      <button class="btn btn-primary" onclick="closeModal()" style="width:100%">Close</button>
    </div>
  `;
  openModal(modal);
}

// ═══════════════════════════════════
// MESSAGING & CHAT DATA STORAGE
// ═══════════════════════════════════
let currentChat = null;  // Track current conversation
let allMessages = [];    // Global messages array

// Sample messages for different scenarios
allMessages = [
  // Student -> Teacher conversations
  {id:1, sender:'Ama Osei', senderRole:'student', recipient:'Mr. Amponsah', recipientRole:'teacher', subject:'Test Score', text:'Ama, great work on your last test! You scored 88/100.', time:'9:00 AM', date:'Mar 20'},
  {id:2, sender:'Ama Osei', senderRole:'student', recipient:'Mr. Amponsah', recipientRole:'teacher', subject:'Test Score', text:'Thank you sir! I will work harder for the next exam.', time:'9:15 AM', date:'Mar 20'},
  {id:3, sender:'Mr. Amponsah', senderRole:'teacher', recipient:'Ama Osei', recipientRole:'student', subject:'Test Score', text:'That\'s the spirit! Focus on Chapter 6 for the next exam.', time:'9:17 AM', date:'Mar 20'},
  
  // Parent -> Teacher conversations
  {id:4, sender:'Parent Serwaa', senderRole:'parent', recipient:'Mr. Amponsah', recipientRole:'teacher', subject:'Progress Update', text:'Hello Sir, how is Ama doing in your class?', time:'2:30 PM', date:'Mar 19'},
  {id:5, sender:'Mr. Amponsah', senderRole:'teacher', recipient:'Parent Serwaa', recipientRole:'parent', subject:'Progress Update', text:'She is doing very well! Her test scores are excellent.', time:'3:45 PM', date:'Mar 19'},
  {id:6, sender:'Parent Serwaa', senderRole:'parent', recipient:'Mr. Amponsah', recipientRole:'teacher', subject:'Progress Update', text:'Thank you for the update! We really appreciate your support.', time:'4:00 PM', date:'Mar 19'},
  
  // Parent -> Admin
  {id:7, sender:'Parent Serwaa', senderRole:'parent', recipient:'Admin Office', recipientRole:'admin', subject:'Fee Payment', text:'Good morning, I want to inquire about the school fees payment.', time:'8:15 AM', date:'Mar 20'},
  {id:8, sender:'Admin Office', senderRole:'admin', recipient:'Parent Serwaa', recipientRole:'parent', subject:'Fee Payment', text:'The fees are due by the end of this month. Please visit the office with your receipt.', time:'9:30 AM', date:'Mar 20'},
  
  // Teacher -> Admin
  {id:9, sender:'Mrs. Asante', senderRole:'teacher', recipient:'Admin Office', recipientRole:'admin', subject:'Exam Schedule', text:'When will the final exams start?', time:'10:00 AM', date:'Mar 20'},
  {id:10, sender:'Admin Office', senderRole:'admin', recipient:'Mrs. Asante', recipientRole:'teacher', subject:'Exam Schedule', text:'Exams start on April 5th. Detailed schedule will be shared by Friday.', time:'10:45 AM', date:'Mar 20'}
];

let messageChats = {};  // Dynamic - will be populated based on current user conversations

// CONTACT MESSAGES STORAGE
let contactMessages = [];


// NEWS & BLOG ARTICLES STORAGE

let newsArticles = [
  {id:1,icon:'<i class="fas fa-trophy"></i>',title:'Students Win National Science Competition',date:'Mar 15, 2025',desc:'Our students achieved outstanding results at the national competition.',content:'Our brilliant students from Forms 2 and 3 participated in the National Science Competition held in Accra last week. They demonstrated exceptional knowledge and critical thinking skills, winning three awards across different categories. Congratulations to the Science Department and all participating students!',category:'Student Achievement',status:'Published'},
  {id:2,icon:'<i class="fas fa-book"></i>',title:'New Library Wing Inaugurated',date:'Mar 10, 2025',desc:'State-of-the-art library facility now open to all students.',content:'Our brand new library wing, featuring over 5,000 new volumes and modern study spaces, was officially inaugurated by the Minister of Education. The facility includes computer labs, reading rooms, and a digital archive. Students now have access to one of the most comprehensive library systems in the region.',category:'Infrastructure',status:'Published'},
  {id:3,icon:'<i class="fas fa-graduation-cap"></i>',title:'Top WASSCE Results 2024',date:'Feb 28, 2025',desc:'Excellence Academy secures best results in the region.',content:'We are proud to announce that our students achieved the highest WASSCE pass rate in the region for 2024. With a 98% pass rate and over 60 distinctions, our students have set a new benchmark for academic excellence. Special recognition goes to the teaching staff and parents for their unwavering support.',category:'Academic',status:'Published'},
  {id:4,icon:'<i class="fas fa-leaf"></i>',title:'Tree Planting Initiative',date:'Feb 20, 2025',desc:'School launches environmental conservation program.',content:'In celebration of Environment Day, Glory Regin Preparatory school launched a tree-planting initiative with students and staff planting over 500 trees around the campus. This initiative is part of our commitment to environmental sustainability and creating a greener campus for future generations.',category:'Community',status:'Published'},
  {id:5,icon:'<i class="fas fa-theater-masks"></i>',title:'Annual Cultural Day Celebrated',date:'Feb 14, 2025',desc:'Students showcase diverse talents at packed auditorium.',content:'The annual cultural day was a spectacular showcase of the diverse talents within our school community. Students performed traditional dances, musical pieces, and theatrical performances representing different cultures. Parents and staff filled the auditorium to capacity, celebrating our rich cultural heritage.',category:'Events',status:'Published'},
  {id:6,icon:'<i class="fas fa-laptop"></i>',title:'ICT Lab Upgrade Complete',date:'Jan 30, 2025',desc:'New computers and software installed in Information Technology lab.',content:'Our Information Technology laboratory has been upgraded with 40 new computers, high-speed internet connectivity, and the latest software packages. This upgrade will enable students to gain practical skills in coding, graphic design, and digital media production. The lab is now equipped to meet international standards.',category:'Infrastructure',status:'Published'}
];

// NEWS MANAGEMENT MODULE
function newsModule(){
  const articlesHTML = newsArticles.map(article => `
    <div class="card mb16">
      <div style="display:flex;gap:14px">
        <div style="font-size:40px;flex-shrink:0">${article.icon}</div>
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px">
            <h4 style="font-size:13px;font-weight:700;color:var(--blue-dark)">${article.title}</h4>
            <span class="badge b-${article.status==='Published'?'success':'warning'}">${article.status}</span>
          </div>
          <div style="font-size:11px;color:var(--gray-400);margin-bottom:8px">${article.date} · ${article.category}</div>
          <p style="font-size:12px;color:var(--gray-600);line-height:1.6;margin-bottom:10px">${article.desc}</p>
          <div style="display:flex;gap:6px">
            <button class="btn btn-secondary btn-xs" onclick="editArticleModal(${article.id})"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-danger btn-xs" onclick="deleteArticle(${article.id})"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  return hdr('News & Blog Management', 'Create, edit and publish school news and blog posts', 'News')+`
  <div class="g21">
    <div>
      <div style="font-size:14px;font-weight:700;color:var(--blue-dark);margin-bottom:16px"><i class="fas fa-newspaper"></i> Published Articles (${newsArticles.length})</div>
      ${articlesHTML}
    </div>
    <div class="card" style="height:fit-content;position:sticky;top:100px">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-pen"></i> Create New Article</span></div>
      <div class="f-field" style="margin-bottom:12px">
        <label>Article Title *</label>
        <input placeholder="Enter article title..." id="blogTitle">
      </div>
      <div class="f-field" style="margin-bottom:12px">
        <label>Icon/Emoji *</label>
        <input placeholder="e.g., 📰 or fa-newspaper" id="blogIcon" value="📰" maxlength="2">
      </div>
      <div class="f-row">
        <div class="f-field">
          <label>Publish Date *</label>
          <input type="date" id="blogDate">
        </div>
        <div class="f-field">
          <label>Category *</label>
          <select id="blogCategory">
            <option value="">Select Category</option>
            <option>Academic</option>
            <option>Events</option>
            <option>Infrastructure</option>
            <option>Student Achievement</option>
            <option>Community</option>
          </select>
        </div>
      </div>
      <div class="f-field" style="margin-bottom:12px">
        <label>Short Description *</label>
        <input placeholder="Brief summary for listing..." id="blogDesc" maxlength="120">
      </div>
      <div class="f-field" style="margin-bottom:12px">
        <label>Full Content *</label>
        <textarea placeholder="Write the complete article here..." style="min-height:120px;resize:vertical" id="blogContent"></textarea>
      </div>
      <div class="f-field" style="margin-bottom:12px">
        <label>Status</label>
        <select id="blogStatus">
          <option>Draft</option>
          <option selected>Published</option>
        </select>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="publishNews()"><i class="fas fa-upload"></i> Publish Article</button>
        <button class="btn btn-secondary" onclick="clearNewsForm()"><i class="fas fa-sync"></i> Clear</button>
      </div>
    </div>
  </div>`;
}

function publishNews(){
  const title = document.getElementById('blogTitle')?.value?.trim() || '';
  const icon = document.getElementById('blogIcon')?.value?.trim() || '';
  const date = document.getElementById('blogDate')?.value || '';
  const category = document.getElementById('blogCategory')?.value || '';
  const desc = document.getElementById('blogDesc')?.value?.trim() || '';
  const content = document.getElementById('blogContent')?.value?.trim() || '';
  const status = document.getElementById('blogStatus')?.value || 'Published';

  if(!title || !icon || !date || !category || !desc || !content) {
    showToast('<i class="fas fa-exclamation-triangle"></i> Please fill in all required fields (*)', 'warning');
    return;
  }

  if(desc.length < 20) {
    showToast('<i class="fas fa-exclamation-triangle"></i> Description must be at least 20 characters', 'warning');
    return;
  }

  const newArticle = {
    id: Math.max(...newsArticles.map(a => a.id), 0) + 1,
    icon: icon,
    title: title,
    date: date,
    desc: desc,
    content: content,
    category: category,
    status: status
  };

  newsArticles.unshift(newArticle);
  showToast('<i class="fas fa-check-circle"></i> Article published successfully!', 'success');
  clearNewsForm();
  renderMain('news');
}

function clearNewsForm(){
  document.getElementById('blogTitle').value = '';
  document.getElementById('blogIcon').value = '<i class="fas fa-newspaper"></i>';
  document.getElementById('blogDate').value = '';
  document.getElementById('blogCategory').value = '';
  document.getElementById('blogDesc').value = '';
  document.getElementById('blogContent').value = '';
  document.getElementById('blogStatus').value = 'Published';
}

function editArticleModal(articleId){
  const article = newsArticles.find(a => a.id === articleId);
  if(!article) return;

  const modal = `
    <div style="padding:30px;max-width:850px;max-height:90vh;overflow-y:auto">
      <h2 style="font-size:18px;font-weight:700;color:var(--blue-dark);margin-bottom:20px"><i class="fas fa-edit"></i> Edit Article</h2>
      
      <div class="f-field" style="margin-bottom:12px">
        <label>Article Title</label>
        <input id="editTitle" placeholder="Enter article title..." value="${article.title}">
      </div>
      
      <div class="f-field" style="margin-bottom:12px">
        <label>Icon/Emoji</label>
        <input id="editIcon" placeholder="Choose icon..." value="${article.icon}" maxlength="2">
      </div>
      
      <div class="f-row">
        <div class="f-field">
          <label>Date</label>
          <input type="date" id="editDate" value="${article.date}">
        </div>
        <div class="f-field">
          <label>Category</label>
          <select id="editCategory">
            <option ${article.category==='Academic'?'selected':''}>Academic</option>
            <option ${article.category==='Events'?'selected':''}>Events</option>
            <option ${article.category==='Infrastructure'?'selected':''}>Infrastructure</option>
            <option ${article.category==='Student Achievement'?'selected':''}>Student Achievement</option>
            <option ${article.category==='Community'?'selected':''}>Community</option>
          </select>
        </div>
      </div>
      
      <div class="f-field" style="margin-bottom:12px">
        <label>Short Description</label>
        <input id="editDesc" placeholder="Brief summary..." value="${article.desc}" maxlength="120">
      </div>
      
      <div class="f-field" style="margin-bottom:12px">
        <label>Full Content</label>
        <textarea id="editContent" style="min-height:150px;resize:vertical">${article.content}</textarea>
      </div>
      
      <div class="f-field" style="margin-bottom:16px">
        <label>Status</label>
        <select id="editStatus">
          <option ${article.status==='Draft'?'selected':''}>Draft</option>
          <option ${article.status==='Published'?'selected':''}>Published</option>
        </select>
      </div>
      
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="saveArticleChanges(${articleId})"><i class="fas fa-save"></i> Save Changes</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `;
  openModal(modal);
}

function saveArticleChanges(articleId){
  const article = newsArticles.find(a => a.id === articleId);
  if(!article) return;

  const title = document.getElementById('editTitle')?.value?.trim() || '';
  const icon = document.getElementById('editIcon')?.value?.trim() || '';
  const date = document.getElementById('editDate')?.value || '';
  const category = document.getElementById('editCategory')?.value || '';
  const desc = document.getElementById('editDesc')?.value?.trim() || '';
  const content = document.getElementById('editContent')?.value?.trim() || '';
  const status = document.getElementById('editStatus')?.value || 'Published';

  if(!title || !icon || !date || !category || !desc || !content) {
    showToast('<i class="fas fa-exclamation-triangle"></i> Please fill in all required fields', 'warning');
    return;
  }

  article.title = title;
  article.icon = icon;
  article.date = date;
  article.category = category;
  article.desc = desc;
  article.content = content;
  article.status = status;

  showToast('<i class="fas fa-check-circle"></i> Article updated successfully!', 'success');
  closeModal();
  renderMain('news');
}

function deleteArticle(articleId){
  if(!confirm('<i class="fas fa-trash"></i> Are you sure you want to delete this article? This action cannot be undone.')) return;
  
  const index = newsArticles.findIndex(a => a.id === articleId);
  if(index > -1) {
    const deletedTitle = newsArticles[index].title;
    newsArticles.splice(index, 1);
    showToast('<i class="fas fa-check-circle"></i> Article deleted successfully!', 'success');
    renderMain('news');
  }
}

function saveDraft(){
  const title = document.getElementById('blogTitle')?.value || '';
  if(!title) {
    showToast('<i class="fas fa-exclamation-triangle"></i> Please enter a title', 'warning');
    return;
  }
  showToast('<i class="fas fa-save"></i> Draft saved successfully!', 'success');
}

function sendContactMessage(){
  const nameInput = document.querySelector('.contact-form input[placeholder="Full name"]');
  const emailInput = document.querySelector('.contact-form input[placeholder="your@email.com"]');
  const subjectInput = document.querySelector('.contact-form input[placeholder="What is this about?"]');
  const messageInput = document.querySelector('.contact-form textarea');
  
  const name = nameInput?.value.trim();
  const email = emailInput?.value.trim();
  const subject = subjectInput?.value.trim();
  const message = messageInput?.value.trim();
  
  // Validation
  if(!name){showToast('<i class="fas fa-times-circle"></i> Please enter your name','error');return;}
  if(!email || !email.includes('@')){showToast('<i class="fas fa-times-circle"></i> Please enter a valid email','error');return;}
  if(!subject){showToast('<i class="fas fa-times-circle"></i> Please enter a subject','error');return;}
  if(!message){showToast('<i class="fas fa-times-circle"></i> Please enter your message','error');return;}
  
  // Create message object
  const newMessage = {
    id: Date.now(),
    name,
    email,
    subject,
    message,
    date: new Date().toLocaleDateString('en-US', {year:'numeric',month:'short',day:'numeric'}),
    time: new Date().toLocaleTimeString('en-US', {hour:'2-digit',minute:'2-digit'}),
    status: 'New',
    read: false
  };
  
  // Store message
  contactMessages.push(newMessage);
  
  // Clear form
  nameInput.value = '';
  emailInput.value = '';
  subjectInput.value = '';
  messageInput.value = '';
  
  // Notify admin
  showToast('<i class="fas fa-check-circle"></i> Message sent successfully! The admin will respond soon.','success');
  
  // Update admin notification
  const newMessagesCount = contactMessages.filter(m => !m.read).length;
  const badge = document.querySelector('[data-contact-badge]');
  if(badge) badge.textContent = newMessagesCount;
}

function visitorContact(){
  return `<div class="visitor-hero" style="margin-bottom:26px">
    <h1>Contact Us</h1>
    <p>We would love to hear from you. Get in touch with Glory Regin Preparatory school.</p>
  </div>
  <div class="g2">
    <div>
      ${[['<i class="fas fa-map-pin"></i>','Address','P.O. Box 42, Jirapa\nUpper West Region, Ghana'],
        ['<i class="fas fa-phone"></i>','Phone','0243611971 /\n0205096091'],
        ['<i class="fas fa-envelope"></i>','Email','info@excellence.edu.gh\nadmissions@excellence.edu.gh'],
        ['<i class="fas fa-clock"></i>','Office Hours','Monday–Friday: 7:00 AM – 5:00 PM\nSaturday: 8:00 AM – 12:00 PM']].map(([i,l,v])=>`
      <div class="card mb16" style="display:flex;gap:16px;align-items:flex-start">
        <div class="notice-icon" style="background:var(--blue-xpale)">${i}</div>
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--blue-dark);margin-bottom:6px">${l}</div>
          <div style="font-size:12.5px;color:var(--gray-600);line-height:1.7">${v}</div>
        </div>
      </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-envelope"></i> Send Us a Message</span></div>
      <div class="contact-form">
        <div class="f-row"><div class="f-field"><label>Your Name</label><input placeholder="Full name"></div><div class="f-field"><label>Email</label><input placeholder="your@email.com"></div></div>
        <div class="f-field" style="margin-bottom:12px"><label>Subject</label><input placeholder="What is this about?"></div>
        <div class="f-field" style="margin-bottom:14px"><label>Message</label><textarea placeholder="Your message..." style="min-height:140px"></textarea></div>
        <button class="btn btn-primary" style="width:100%" onclick="sendContactMessage()">Send Message <i class="fas fa-paper-plane"></i></button>
      </div>
    </div>
  </div>`;
}

function visitorGallery(){
  return hdr('School Gallery','A visual journey through life at Glory Regin Preparatory school','Gallery')+`
  <div class="gal-grid">
    ${[['<i class="fas fa-running"></i>','Sports Day 2024','#dbeafe'],
      ['<i class="fas fa-graduation-cap"></i>','Prize Giving Ceremony','#fef3c7'],
      ['<i class="fas fa-flask-vial"></i>','Science Laboratory','#d1fae5'],
      ['<i class="fas fa-book"></i>','School Library','#ede9fe'],
      ['<i class="fas fa-building"></i>','Main School Hall','#fee2e2'],
      ['<i class="fas fa-theater-masks"></i>','Drama & Arts Club','#e0f2fe'],
      ['<i class="fas fa-leaf"></i>','Beautiful Campus','#d1fae5'],
      ['<i class="fas fa-user"></i>‍<i class="fas fa-laptop"></i>','ICT Laboratory','#dbeafe'],
      ['<i class="fas fa-palette"></i>','Art Exhibition','#fef3c7'],
      ['<i class="fas fa-trophy"></i>','Champions Cup 2024','#fef3c7'],
      ['<i class="fas fa-music"></i>','School Choir','#ede9fe'],
      ['<i class="fas fa-globe"></i>','Geography Field Trip','#d1fae5']].map(([icon,label,bg])=>`
    <div class="gal-item" style="background:${bg}">
      <div class="gi-icon">${icon}</div>
      <div class="gi-label">${label}</div>
    </div>`).join('')}
  </div>`;
}

// ═══════════════════════════════════
// BUTTON HANDLERS & UTILITIES
// ═══════════════════════════════════

// Generic form save handler
function saveForm(message = 'Saved successfully!') {
  alert(message);
}

// Save attendance
function saveAttendance() {
  // Only teachers can save attendance
  if (currentRole !== 'Teacher') {
    showToast('<i class="fas fa-times-circle"></i> Only class teachers can mark attendance', 'error');
    return;
  }
  
  const data = {};
  let count = 0;
  document.querySelectorAll('input[type="radio"]:checked').forEach(input => {
    data[input.name] = input.value;
    count++;
  });
  
  if(count === 0) {
    showToast('<i class="fas fa-times-circle"></i> Please mark attendance for at least one student', 'error');
    return;
  }
  
  console.log('Attendance saved:', data);
  showToast('<i class="fas fa-check-circle"></i> Attendance for ' + count + ' students saved!', 'success');
}

// TEACHER DASHBOARD INTERACTIVE FUNCTIONS
function viewScheduleDetail(time, subject, className) {
  const modal = `
    <div style="padding:20px;max-width:600px">
      <h2 style="color:var(--blue-dark);margin-bottom:16px"><i class="fas fa-calendar"></i> Class Details</h2>
      <div style="background:var(--blue-xpale);padding:16px;border-radius:8px;margin-bottom:16px;border-left:4px solid var(--blue-main)">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;font-size:13px">
          <div><div style="color:var(--gray-500);font-size:11px;margin-bottom:4px">TIME</div><div style="font-weight:700;font-size:16px">${time}</div></div>
          <div><div style="color:var(--gray-500);font-size:11px;margin-bottom:4px">SUBJECT</div><div style="font-weight:700;font-size:16px">${subject}</div></div>
          <div><div style="color:var(--gray-500);font-size:11px;margin-bottom:4px">CLASS</div><div style="font-weight:700">${className}</div></div>
          <div><div style="color:var(--gray-500);font-size:11px;margin-bottom:4px">ROOM</div><div style="font-weight:700">Room 14</div></div>
        </div>
      </div>
      <div style="margin-bottom:16px">
        <label style="font-weight:600;margin-bottom:8px;display:block">Quick Notes</label>
        <textarea placeholder="Add notes for this class..." style="width:100%;padding:10px;border:1px solid var(--border);border-radius:6px;font-family:Poppins,sans-serif;min-height:100px"></textarea>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
        <button class="btn btn-primary" onclick="saveClassNotes('${subject}', '${className}'); closeModal();">Save Notes</button>
      </div>
    </div>
  `;
  openModal(modal);
}

function saveClassNotes(subject, className) {
  showToast('<i class="fas fa-check-circle"></i> Notes saved for ' + subject + ' - ' + className, 'success');
}

function viewStatDetail(statType) {
  let content = '';
  if(statType === 'students') {
    content = '<h3>My Students (38)</h3><p>2 new students joined this term</p><button class="btn btn-primary" style="margin-top:10px">View All Students</button>';
  } else if(statType === 'subjects') {
    content = '<h3>Subjects Teaching (5)</h3><p>This semester</p><ul style="list-style:none;padding:0"><li>✓ Mathematics</li><li>✓ Further Maths</li><li>✓ Core Maths</li><li>✓ Statistics</li><li>✓ Algebra</li></ul>';
  } else if(statType === 'attendance') {
    content = '<h3>Attendance Rate (94%)</h3><p>Above average performance</p><div class="prog-bar"><div class="prog-fill pf-green" style="width:94%"></div></div>';
  } else if(statType === 'grades') {
    content = '<h3>Pending Grades (8)</h3><p>Need grading this week</p><button class="btn btn-warning" style="margin-top:10px">Grade Now</button>';
  }
  
  openModal(`<div style="padding:20px;text-align:center">${content}</div>`);
}

function viewAssignmentSubmissions(assignmentName) {
  const modal = `
    <div style="padding:20px;max-width:700px;max-height:80vh;overflow-y:auto">
      <h2 style="color:var(--blue-dark);margin-bottom:16px"><i class="fas fa-file-upload"></i> ${assignmentName} - Submissions</h2>
      <table class="tbl" style="font-size:12px">
        <thead><tr><th>Student</th><th>Status</th><th>Submitted</th><th>Grade</th><th>Action</th></tr></thead>
        <tbody>
          ${[['Ama Serwaa','Submitted','Mar 15','A','Review'],['Kwame Asante','Submitted','Mar 15','B+','Review'],['Abena Mensah','Pending','-','-','N/A'],['Kofi Boateng','Submitted','Mar 14','A-','Review']].map(([s,st,d,g,a]) => `
          <tr>
            <td style="font-weight:600">${s}</td>
            <td><span class="badge ${st==='Submitted'?'b-success':'b-warning'}">${st}</span></td>
            <td>${d}</td>
            <td>${g}</td>
            <td><button class="btn btn-secondary btn-xs" onclick="gradeAssignmentSubmission('${s}', '${assignmentName}')">${a}</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
      <div style="margin-top:16px;display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      </div>
    </div>
  `;
  openModal(modal);
}

function gradeAssignmentSubmission(studentName, assignmentName) {
  const modal = `
    <div style="padding:20px;max-width:500px">
      <h2 style="color:var(--blue-dark);margin-bottom:16px"><i class="fas fa-star"></i> Grade ${studentName}</h2>
      <div style="background:var(--gray-50);padding:12px;border-radius:6px;margin-bottom:16px">
        <div style="font-size:12px;color:var(--gray-600)">Assignment: <strong>${assignmentName}</strong></div>
      </div>
      <div style="margin-bottom:12px">
        <label style="font-weight:600;display:block;margin-bottom:6px">Grade (A-F)</label>
        <select id="grade-select" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:6px;font-family:Poppins,sans-serif">
          <option value="">Select Grade</option>
          <option value="A">A (90-100)</option>
          <option value="B+">B+ (85-89)</option>
          <option value="B">B (80-84)</option>
          <option value="C+">C+ (75-79)</option>
          <option value="C">C (70-74)</option>
          <option value="D">D (60-69)</option>
          <option value="F">F (Below 60)</option>
        </select>
      </div>
      <div style="margin-bottom:16px">
        <label style="font-weight:600;display:block;margin-bottom:6px">Feedback</label>
        <textarea placeholder="Add feedback for the student..." style="width:100%;padding:10px;border:1px solid var(--border);border-radius:6px;font-family:Poppins,sans-serif;min-height:100px"></textarea>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="submitGradeForStudent('${studentName}'); closeModal();">Submit Grade</button>
      </div>
    </div>
  `;
  openModal(modal);
}

function submitGradeForStudent(studentName) {
  const gradeSelect = document.getElementById('grade-select');
  const grade = gradeSelect?.value;
  
  if(!grade) {
    showToast('<i class="fas fa-times-circle"></i> Please select a grade', 'error');
    return;
  }
  
  showToast(`<i class="fas fa-check-circle"></i> Grade ${grade} submitted for ${studentName}`, 'success');
  renderMain();
}

function openAddAssignmentForm() {
  const modal = `
    <div style="padding:20px;max-width:600px">
      <h2 style="color:var(--blue-dark);margin-bottom:16px"><i class="fas fa-clipboard-list"></i> Create New Assignment</h2>
      <div class="f-field" style="margin-bottom:12px">
        <label>Assignment Title *</label>
        <input id="assign-title" placeholder="e.g., Chapter 5 Homework" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:6px;font-family:Poppins,sans-serif">
      </div>
      <div class="f-field" style="margin-bottom:12px">
        <label>Class *</label>
        <select id="assign-class" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:6px;font-family:Poppins,sans-serif">
          <option value="">Select Class</option>
          <option value="JHS 1">JHS 1</option>
          <option value="JHS 2">JHS 2</option>
          <option value="Basic 6">Basic 6</option>
        </select>
      </div>
      <div class="f-row" style="gap:12px;margin-bottom:12px">
        <div class="f-field" style="flex:1">
          <label>Due Date *</label>
          <input type="date" id="assign-duedate" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:6px;font-family:Poppins,sans-serif">
        </div>
        <div class="f-field" style="flex:1">
          <label>Total Points</label>
          <input type="number" id="assign-points" value="100" min="10" max="200" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:6px;font-family:Poppins,sans-serif">
        </div>
      </div>
      <div class="f-field" style="margin-bottom:16px">
        <label>Description *</label>
        <textarea id="assign-desc" placeholder="Assignment details and instructions..." style="width:100%;padding:10px;border:1px solid var(--border);border-radius:6px;font-family:Poppins,sans-serif;min-height:100px"></textarea>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="createNewAssignment()">Create Assignment</button>
      </div>
    </div>
  `;
  openModal(modal);
}

function createNewAssignment() {
  const title = document.getElementById('assign-title')?.value.trim();
  const className = document.getElementById('assign-class')?.value;
  const dueDate = document.getElementById('assign-duedate')?.value;
  const points = document.getElementById('assign-points')?.value;
  const desc = document.getElementById('assign-desc')?.value.trim();
  
  if(!title || !className || !dueDate || !desc) {
    showToast('<i class="fas fa-times-circle"></i> Please fill in all required fields', 'error');
    return;
  }
  
  showToast(`<i class="fas fa-check-circle"></i> Assignment "${title}" created for ${className}!`, 'success');
  closeModal();
  renderMain();
}

function sendChatMessage() {
  const input = document.querySelector('.chat-inp');
  const message = input?.value.trim();
  
  if(!message) {
    showToast('<i class="fas fa-times-circle"></i> Please type a message', 'error');
    return;
  }
  
  showToast('<i class="fas fa-check-circle"></i> Message sent!', 'success');
  input.value = '';
  renderMain();
}

// ═══════════════════════════════════
// EXAMS MODULE FUNCTIONS
// ═══════════════════════════════════
function switchExamTab(tabIndex) {
  // Hide all tabs
  document.querySelectorAll('.exam-tab-content').forEach(tab => tab.style.display = 'none');
  // Show selected tab
  document.getElementById('exam-tab-' + tabIndex).style.display = 'block';
  // Update active tab indicator
  document.querySelectorAll('.mod-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === tabIndex);
  });
}

function filterExamTable() {
  const searchValue = document.getElementById('exam-search').value.toLowerCase();
  document.querySelectorAll('.exam-row').forEach(row => {
    const subject = row.getAttribute('data-subject');
    const classVal = row.getAttribute('data-class');
    const matches = subject.includes(searchValue) || classVal.includes(searchValue);
    row.style.display = matches ? '' : 'none';
  });
}

function openScheduleExamForm() {
  const formContent = `
    <div style="padding:20px;width:100%;max-width:900px">
      <h2 style="margin:0 0 20px 0;color:var(--blue-dark);font-size:22px"><i class="fas fa-clipboard-list"></i> Exam Timetable Scheduler</h2>
      
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;margin-bottom:20px">
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Class</label>
          <select id="exam-tt-class" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;cursor:pointer;font-size:13px">
            <option>Creche</option><option>Nursery</option><option>KG 1</option><option>KG 2</option><option>Basic 1</option><option>Basic 2</option><option>Basic 3</option><option>Basic 4</option><option>Basic 5</option><option>Basic 6</option><option>JHS 1</option><option>JHS 2</option><option>JHS 3</option>
          </select>
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Start Date</label>
          <input type="date" id="exam-tt-start-date" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;font-size:13px">
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Duration (Days)</label>
          <input type="number" id="exam-tt-duration" value="5" min="1" max="20" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;font-size:13px">
        </div>
      </div>
      
      <div style="background:var(--gray-50);padding:15px;border-radius:8px;margin-bottom:20px;border:1px solid var(--gray-200)">
        <div style="font-weight:600;color:var(--gray-800);margin-bottom:12px;font-size:13px"><i class="fas fa-calendar-alt"></i> Exam Schedule (Two Papers Per Day)</div>
        
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          <thead>
            <tr style="background:var(--blue-main);color:white">
              <th style="padding:12px;text-align:left;border:1px solid var(--blue-dark)">Day</th>
              <th style="padding:12px;text-align:left;border:1px solid var(--blue-dark)"><i class="fas fa-map-pin"></i> Paper 1 (Morning)</th>
              <th style="padding:12px;text-align:left;border:1px solid var(--blue-dark)">Paper 1 Details</th>
              <th style="padding:12px;text-align:left;border:1px solid var(--blue-dark)"><i class="fas fa-map-pin"></i> Paper 2 (Afternoon)</th>
              <th style="padding:12px;text-align:left;border:1px solid var(--blue-dark)">Paper 2 Details</th>
            </tr>
          </thead>
          <tbody>
            ${['Monday','Tuesday','Wednesday','Thursday','Friday'].map((day,i)=>'<tr style="border:1px solid var(--gray-200)"><td style="padding:10px;border-right:1px solid var(--gray-200);font-weight:600;background:var(--gray-100)">'+day+'</td><td style="padding:10px;border-right:1px solid var(--gray-200)"><select class="exam-paper-select" style="width:100%;padding:6px;border:1px solid var(--gray-300);border-radius:4px;font-family:Poppins,sans-serif;font-size:11px"><option>Mathematics</option><option>English</option><option>Science</option><option>ICT</option><option>Social Studies</option></select></td><td style="padding:10px;border-right:1px solid var(--gray-200)"><input type="text" placeholder="Venue, Time" style="width:100%;padding:6px 8px;border:1px solid var(--gray-300);border-radius:4px;font-family:Poppins,sans-serif;font-size:11px"></td><td style="padding:10px;border-right:1px solid var(--gray-200)"><select class="exam-paper-select" style="width:100%;padding:6px;border:1px solid var(--gray-300);border-radius:4px;font-family:Poppins,sans-serif;font-size:11px"><option>French</option><option>CRK/Islamic</option><option>Physical Ed</option><option>Arts</option><option>Music</option></select></td><td style="padding:10px"><input type="text" placeholder="Venue, Time" style="width:100%;padding:6px 8px;border:1px solid var(--gray-300);border-radius:4px;font-family:Poppins,sans-serif;font-size:11px"></td></tr>').join('')}
          </tbody>
        </table>
      </div>
      
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-primary btn-sm" onclick="saveExamTimetable()"><i class="fas fa-check-circle"></i> Create Exam Schedule</button>
        <button class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `;
  openModal(formContent);
}

function saveNewExam() {
  const subject = document.getElementById('new-exam-subject').value;
  const classVal = document.getElementById('new-exam-class').value;
  const date = document.getElementById('new-exam-date').value;
  const duration = document.getElementById('new-exam-duration').value;
  const venue = document.getElementById('new-exam-venue').value;
  const invigilator = document.getElementById('new-exam-invigilator').value;
  
  if (!date || !duration || !venue || !invigilator) {
    showToast('<i class="fas fa-exclamation-triangle"></i> Please fill all fields', 'warning');
    return;
  }
  
  closeModal();
  showToast('<i class="fas fa-check-circle"></i> Exam scheduled: '+subject+' on '+date, 'success');
}

function saveExamTimetable() {
  const classVal = document.getElementById('exam-tt-class').value;
  const startDate = document.getElementById('exam-tt-start-date').value;
  const duration = document.getElementById('exam-tt-duration').value;
  
  if (!classVal || !startDate || !duration) {
    showToast('<i class="fas fa-exclamation-triangle"></i> Please fill all fields', 'warning');
    return;
  }
  
  closeModal();
  showToast('<i class="fas fa-check-circle"></i> Exam timetable created for '+classVal+' starting '+startDate+' ('+duration+' days)', 'success');
}

function editExam(subject, classVal) {
  const formContent = `
    <div style="padding:20px;width:100%;max-width:850px">
      <h2 style="margin:0 0 20px 0;color:var(--blue-dark);font-size:22px"><i class="fas fa-edit"></i> Edit Exam: ${subject}</h2>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px">
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Subject</label>
          <input type="text" value="${subject}" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif">
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Class</label>
          <select style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;cursor:pointer">
            <option selected>${classVal}</option>
            <option>Creche</option><option>Nursery</option><option>KG 1</option><option>KG 2</option>
            <option>Basic 1</option><option>Basic 2</option><option>Basic 3</option><option>Basic 4</option>
            <option>Basic 5</option><option>Basic 6</option><option>JHS 1</option><option>JHS 2</option><option>JHS 3</option>
          </select>
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Date</label>
          <input type="date" value="2025-04-01" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif">
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Duration</label>
          <input type="text" value="2 hrs" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif">
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Venue</label>
          <input type="text" value="Hall A" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif">
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Invigilator</label>
          <input type="text" value="Mr. Amponsah" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif">
        </div>
      </div>
      
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-primary btn-sm" onclick="saveEditedExam('${subject}')" style="padding:10px 20px"><i class="fas fa-check-circle"></i> Save Changes</button>
        <button class="btn btn-secondary btn-sm" onclick="closeModal()" style="padding:10px 20px">Cancel</button>
      </div>
    </div>
  `;
  openModal(formContent);
}

function saveEditedExam(subject) {
  closeModal();
  showToast('<i class="fas fa-check-circle"></i> Exam updated: '+subject, 'success');
}

function deleteExam(subject) {
  if (confirm('Are you sure you want to delete the exam: '+subject+'? This action cannot be undone.')) {
    showToast('<i class="fas fa-check-circle"></i> Exam deleted: '+subject, 'success');
  }
}

function loadStudentsForGrades() {
  const selectedClass = document.getElementById('grades-class').value;
  showToast('<i class="fas fa-book"></i> Loaded students from '+selectedClass, 'info');
}

function saveExamGrades() {
  if (currentRole !== 'Teacher') {
    showToast('<i class="fas fa-times-circle"></i> Only teachers can save grades', 'error');
    return;
  }
  
  const subject = document.getElementById('grades-subject').value;
  const classVal = document.getElementById('grades-class').value;
  const scores = [];
  
  document.querySelectorAll('.score-input').forEach(input => {
    scores.push(input.value);
  });
  
  // Send to class teacher for review
  showToast('<i class="fas fa-upload"></i> Submitting '+subject+' scores for '+classVal+' to class teacher...', 'info');
  
  setTimeout(() => {
    showToast('<i class="fas fa-check-circle"></i> Scores submitted! Class teacher will review and generate report cards', 'success');
  }, 1500);
}

function generateExamsReport(type) {
  const reportContent = `
    <div style="padding:20px;max-width:900px">
      <div style="text-align:center;margin-bottom:20px">
        <h2 style="margin:0;color:var(--blue-dark)"><i class="fas fa-chart-bar"></i> '+type+' Report</h2>
        <p style="margin:5px 0;color:var(--gray-600);font-size:12px">${new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</p>
      </div>
      
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px">
        <div style="padding:12px;background:var(--success-light);border-radius:8px;text-align:center">
          <div style="font-size:20px;font-weight:bold;color:var(--success)">92.5%</div>
          <div style="font-size:11px;color:var(--gray-600)">Average Score</div>
        </div>
        <div style="padding:12px;background:var(--info-light);border-radius:8px;text-align:center">
          <div style="font-size:20px;font-weight:bold;color:var(--info)">123</div>
          <div style="font-size:11px;color:var(--gray-600)">Total Students</div>
        </div>
        <div style="padding:12px;background:var(--warning-light);border-radius:8px;text-align:center">
          <div style="font-size:20px;font-weight:bold;color:var(--warning)">18</div>
          <div style="font-size:11px;color:var(--gray-600)">Excellent (A)</div>
        </div>
        <div style="padding:12px;background:var(--danger-light);border-radius:8px;text-align:center">
          <div style="font-size:20px;font-weight:bold;color:var(--danger)">8</div>
          <div style="font-size:11px;color:var(--gray-600)">Below Average</div>
        </div>
      </div>
      
      <div style="text-align:center;gap:8px;display:flex;justify-content:center">
        <button class="btn btn-primary btn-sm" onclick="window.print()"><i class="fas fa-print"></i> Print</button>
        <button class="btn btn-secondary btn-sm" onclick="downloadGradesCSV()"><i class="fas fa-download"></i> Download CSV</button>
        <button class="btn btn-secondary btn-sm" onclick="closeModal()">Close</button>
      </div>
    </div>
  `;
  openModal(reportContent);
}

function downloadGradesCSV() {
  let csv = 'Grades Report\n';
  csv += 'Generated: '+new Date().toLocaleDateString()+'\n\n';
  csv += 'Student Name,Subject,Score,Grade\n';
  csv += 'Ama Serwaa,Mathematics,88,A\n';
  csv += 'Kwame Asante,Mathematics,72,B\n';
  csv += 'Abena Mensah,Mathematics,91,A\n';
  csv += 'Kofi Boateng,Mathematics,64,C\n';
  csv += 'Akosua Darko,Mathematics,95,A\n';
  
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'grades_report_'+new Date().toISOString().slice(0,10)+'.csv');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> Report downloaded!', 'success');
}

function exportGradesData() {
  showToast('<i class="fas fa-download"></i> Exporting grades data...', 'info');
  setTimeout(() => showToast('<i class="fas fa-check-circle"></i> Export completed!', 'success'), 1500);
}

function filterReportCards() {
  const classFilter = document.getElementById('report-class-filter').value.toLowerCase();
  const searchValue = document.getElementById('report-student-search').value.toLowerCase();
  
  document.querySelectorAll('.report-row').forEach(row => {
    const student = row.getAttribute('data-student');
    const classVal = row.getAttribute('data-class').toLowerCase();
    
    const matchesClass = !classFilter || classVal.includes(classFilter);
    const matchesStudent = student.includes(searchValue);
    
    row.style.display = (matchesClass && matchesStudent) ? '' : 'none';
  });
}

function viewReportCard(studentName) {
  const student = STUDENTS_DATA[studentName];
  if (!student) {
    showToast('<i class="fas fa-times-circle"></i> Student not found', 'error');
    return;
  }

  const term = document.getElementById('report-term-selector')?.value || student.term;
  const subjectScores = getStudentScoresWithGrades(studentName);
  const totalMarks = calculateTotalMarks(student.scores);
  const average = calculateAverage(student.scores);
  const overallGrade = calculateGrade(average);
  const { position, totalInClass } = calculateClassPosition(studentName, student.class);
  const remark = generateRemark(average);

  const subjectsHTML = Object.entries(subjectScores).map(([subject, scores]) => `
    <tr>
      <td style="padding:6px;border-bottom:1px solid var(--gray-300);color:var(--gray-700);font-size:11px">${subject}</td>
      <td style="padding:6px;text-align:center;border-bottom:1px solid var(--gray-300);color:var(--gray-700);font-weight:600;font-size:11px">${scores.classScore}</td>
      <td style="padding:6px;text-align:center;border-bottom:1px solid var(--gray-300);color:var(--gray-700);font-weight:600;font-size:11px">${scores.examScore}</td>
      <td style="padding:6px;text-align:center;border-bottom:1px solid var(--gray-300);color:var(--blue-main);font-weight:700;font-size:12px">${scores.total}</td>
      <td style="padding:6px;text-align:center;border-bottom:1px solid var(--gray-300)"><span style="padding:2px 6px;background:${scores.grade==='A'?'var(--success)':scores.grade==='B'?'var(--info)':scores.grade==='C'?'var(--warning)':'var(--danger)'};color:white;border-radius:4px;font-weight:700;font-size:10px">${scores.grade}</span></td>
    </tr>
  `).join('');

  const reportContent = `
    <div id="report-card-content" style="padding:15px;max-width:900px;background:white;font-family:Poppins,sans-serif;line-height:1.4">
      
      <!-- TOP HEADER LAYOUT: Logo (Left) | School Info (Center) | Student Pic (Right) -->
      <div style="display:grid;grid-template-columns:1fr 2fr 1fr;gap:10px;align-items:start;margin-bottom:12px;padding-bottom:10px;border-bottom:4px solid var(--blue-main)">
        
        <!-- LEFT: SCHOOL LOGO -->
        <div style="text-align:center">
          <div style="font-size:35px;margin-bottom:4px"><i class="fas fa-school"></i></div>
          <p style="margin:0;font-size:9px;color:var(--gray-600);font-weight:600">LOGO</p>
        </div>

        <!-- CENTER: SCHOOL INFORMATION -->
        <div style="text-align:center">
          <h1 style="margin:0 0 2px 0;color:var(--blue-dark);font-size:18px;font-weight:700">Glory Regin Preparatory School</h1>
          <p style="margin:2px 0;font-size:9px;color:var(--gray-600)">Nurturing Excellence Since 1985</p>
          <p style="margin:2px 0;font-size:9px;color:var(--gray-500)">P.O. Box AN 1234, Main School Street</p>
          <p style="margin:2px 0;font-size:9px;color:var(--gray-500)">Accra North | Tel: +233-123-456-789</p>
          <div style="margin-top:4px;font-size:13px;font-weight:700;color:var(--blue-main)"><i class="fas fa-clipboard-list"></i> REPORT CARD</div>
        </div>

        <!-- RIGHT: STUDENT PICTURE -->
        <div style="text-align:center">
          <div style="width:90px;height:110px;margin:0 auto 4px;padding:6px;background:var(--gray-100);border:2px dashed var(--gray-300);border-radius:6px;display:flex;align-items:center;justify-content:center">
            <div style="font-size:35px"><i class="fas fa-camera"></i></div>
          </div>
          <p style="margin:2px 0;font-size:9px;color:var(--gray-600);font-weight:600">Student Photograph</p>
          <p style="margin:2px 0;font-size:8px;color:var(--gray-500)">(Attached during registration)</p>
        </div>

      </div>

      <!-- STUDENT INFO SECTION -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
        <!-- Left Column: Student Details -->
        <div>
          <h3 style="margin:0 0 8px 0;color:var(--blue-dark);font-size:12px;font-weight:700;border-bottom:2px solid var(--blue-main);padding-bottom:4px">Student Information</h3>
          <table style="width:100%;font-size:11px">
            <tbody>
              <tr><td style="padding:4px;font-weight:600;color:var(--gray-600);width:40%">Name:</td><td style="padding:4px;color:var(--blue-dark);font-weight:700">${studentName}</td></tr>
              <tr><td style="padding:4px;font-weight:600;color:var(--gray-600)">Student ID:</td><td style="padding:4px;color:var(--blue-dark);font-weight:700">${student.id}</td></tr>
              <tr><td style="padding:4px;font-weight:600;color:var(--gray-600)">Class:</td><td style="padding:4px;color:var(--blue-dark);font-weight:700">${student.class}</td></tr>
            </tbody>
          </table>
        </div>
        
        <!-- Right Column: Period Info -->
        <div>
          <h3 style="margin:0 0 8px 0;color:var(--blue-dark);font-size:12px;font-weight:700;border-bottom:2px solid var(--blue-main);padding-bottom:4px">Term Details</h3>
          <table style="width:100%;font-size:11px">
            <tbody>
              <tr><td style="padding:4px;font-weight:600;color:var(--gray-600);width:40%">Term:</td><td style="padding:4px;color:var(--blue-dark);font-weight:700">${term}</td></tr>
              <tr><td style="padding:4px;font-weight:600;color:var(--gray-600)">Academic Year:</td><td style="padding:4px;color:var(--blue-dark);font-weight:700">${student.academicYear}</td></tr>
              <tr><td style="padding:4px;font-weight:600;color:var(--gray-600)">Attendance:</td><td style="padding:4px;color:${student.attendance>=90?'var(--success)':student.attendance>=80?'var(--info)':'var(--warning)'};font-weight:700">${student.attendance}%</td></tr>
              <tr><td style="padding:4px;font-weight:600;color:var(--gray-600)">Status:</td><td style="padding:4px;color:var(--success);font-weight:700">✓ Promoted</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ACADEMIC PERFORMANCE TABLE -->
      <h3 style="margin:0 0 8px 0;color:var(--blue-dark);font-size:12px;font-weight:700;border-bottom:2px solid var(--blue-main);padding-bottom:4px">Academic Performance</h3>
      <table style="width:100%;border-collapse:collapse;border:1px solid var(--gray-300);margin-bottom:12px;font-size:11px">
        <thead>
          <tr style="background:var(--blue-main);color:white">
            <th style="padding:6px;text-align:left;border-right:1px solid var(--blue-dark);font-weight:700">Subject</th>
            <th style="padding:6px;text-align:center;border-right:1px solid var(--blue-dark);font-weight:700">Class (50)</th>
            <th style="padding:6px;text-align:center;border-right:1px solid var(--blue-dark);font-weight:700">Exam (50)</th>
            <th style="padding:6px;text-align:center;border-right:1px solid var(--blue-dark);font-weight:700">Total (100)</th>
            <th style="padding:6px;text-align:center;font-weight:700">Grade</th>
          </tr>
        </thead>
        <tbody>
          ${subjectsHTML}
        </tbody>
      </table>

      <!-- PERFORMANCE SUMMARY CARDS -->
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:12px;font-size:10px">
        <div style="padding:10px;background:var(--blue-xpale);border-radius:8px;border-left:4px solid var(--blue-main);text-align:center">
          <div style="font-size:9px;color:var(--gray-600);margin-bottom:3px;font-weight:600">TOTAL MARKS</div>
          <div style="font-size:18px;font-weight:700;color:var(--blue-dark)">${totalMarks}</div>
          <div style="font-size:8px;color:var(--gray-600);margin-top:2px">out of ${Object.keys(subjectScores).length * 100}</div>
        </div>
        <div style="padding:10px;background:var(--info-light);border-radius:8px;border-left:4px solid var(--info);text-align:center">
          <div style="font-size:9px;color:var(--gray-600);margin-bottom:3px;font-weight:600">AVERAGE</div>
          <div style="font-size:18px;font-weight:700;color:var(--info)">${average}%</div>
          <div style="font-size:8px;color:var(--gray-600);margin-top:2px">Class Performance</div>
        </div>
        <div style="padding:10px;background:${overallGrade==='A'?'var(--success-light)':overallGrade==='B'?'var(--info-light)':overallGrade==='C'?'var(--warning-light)':'var(--danger-light)'};border-radius:8px;border-left:4px solid ${overallGrade==='A'?'var(--success)':overallGrade==='B'?'var(--info)':overallGrade==='C'?'var(--warning)':'var(--danger)'};text-align:center">
          <div style="font-size:9px;color:var(--gray-600);margin-bottom:3px;font-weight:600">GRADE</div>
          <div style="font-size:22px;font-weight:700;color:${overallGrade==='A'?'var(--success)':overallGrade==='B'?'var(--info)':overallGrade==='C'?'var(--warning)':'var(--danger)'}">${overallGrade}</div>
          <div style="font-size:8px;color:var(--gray-600);margin-top:2px">Overall Grade</div>
        </div>
        <div style="padding:10px;background:var(--warning-light);border-radius:8px;border-left:4px solid var(--warning);text-align:center">
          <div style="font-size:9px;color:var(--gray-600);margin-bottom:3px;font-weight:600">POSITION</div>
          <div style="font-size:18px;font-weight:700;color:var(--warning)">${position}</div>
          <div style="font-size:8px;color:var(--gray-600);margin-top:2px">of ${totalInClass}</div>
        </div>
        <div style="padding:10px;background:var(--success-light);border-radius:8px;border-left:4px solid var(--success);text-align:center">
          <div style="font-size:9px;color:var(--gray-600);margin-bottom:3px;font-weight:600">ATTENDANCE</div>
          <div style="font-size:18px;font-weight:700;color:var(--success)">${student.attendance}%</div>
          <div style="font-size:8px;color:var(--gray-600);margin-top:2px">Present</div>
        </div>
      </div>

      <!-- TEACHER'S REMARK -->
      <div style="padding:10px;background:var(--blue-xpale);border-radius:8px;border-left:5px solid var(--blue-main);margin-bottom:12px">
        <h4 style="margin:0 0 6px 0;color:var(--blue-dark);font-size:11px;font-weight:700"><i class="fas fa-chalkboard-user"></i> Class Teacher's Remark</h4>
        <p style="margin:0;font-size:10px;color:var(--gray-700);line-height:1.5">${remark}</p>
      </div>

      <!-- SIGNATURES SECTION -->
      <div style="margin-bottom:10px;padding-top:10px;border-top:2px solid var(--gray-300)">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;font-size:10px">
          <div style="text-align:center">
            <div style="height:35px;border-bottom:1px solid var(--gray-700);margin-bottom:4px"></div>
            <div style="font-weight:700;color:var(--gray-800);font-size:10px">Class Teacher</div>
            <div style="color:var(--gray-600);font-size:9px">${student.classTeacher}</div>
          </div>
          <div style="text-align:center">
            <div style="height:35px;border-bottom:1px solid var(--gray-700);margin-bottom:4px"></div>
            <div style="font-weight:700;color:var(--gray-800);font-size:10px">School Administrator</div>
            <div style="color:var(--gray-600);font-size:9px">Authorized Officer</div>
          </div>
          <div style="text-align:center">
            <div style="height:35px;border-bottom:1px solid var(--gray-700);margin-bottom:4px"></div>
            <div style="font-weight:700;color:var(--gray-800);font-size:10px">Headteacher</div>
            <div style="color:var(--gray-600);font-size:9px">School Principal</div>
          </div>
        </div>
      </div>


    </div>

    <!-- ACTION BUTTONS -->
    <div style="display:flex;gap:10px;justify-content:center;margin-top:10px;padding:12px;background:var(--gray-50);border-top:1px solid var(--gray-200);border-radius:0 0 8px 8px">
      <button class="btn btn-primary" onclick="printReportCard('${studentName}')" style="padding:8px 16px;font-weight:600;font-size:11px"><i class="fas fa-print"></i> Print Report Card</button>
      <button class="btn btn-primary" onclick="downloadReportCardPDF('${studentName}')" style="padding:8px 16px;font-weight:600;font-size:11px"><i class="fas fa-download"></i> Download as PDF</button>
      <button class="btn btn-secondary" onclick="closeModal()" style="padding:8px 16px;font-weight:600;font-size:11px">Close</button>
    </div>
  `;
  
  openModal(reportContent);
}

function onStudentSelected() {
  const studentName = document.getElementById('report-student-selector').value;
  const previewSection = document.getElementById('selected-report-preview');
  const summarySection = document.getElementById('report-summary-section');
  
  if (studentName && STUDENTS_DATA[studentName]) {
    const student = STUDENTS_DATA[studentName];
    const average = calculateAverage(student.scores);
    const { position, totalInClass } = calculateClassPosition(studentName, student.class);
    
    previewSection.innerHTML = `
      <div style="display:flex;gap:20px;align-items:center;padding:15px;background:var(--blue-xpale);border-radius:8px">
        <div style="flex:1">
          <h4 style="margin:0 0 10px 0;color:var(--blue-dark);font-weight:700">${studentName}</h4>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;font-size:12px">
            <div><span style="color:var(--gray-600)">Class:</span> <span style="font-weight:600;color:var(--blue-dark)">${student.class}</span></div>
            <div><span style="color:var(--gray-600)">Average:</span> <span style="font-weight:600;color:var(--info)">${average}%</span></div>
            <div><span style="color:var(--gray-600)">Position:</span> <span style="font-weight:600;color:var(--warning)">${position} of ${totalInClass}</span></div>
            <div><span style="color:var(--gray-600)">Attendance:</span> <span style="font-weight:600;color:var(--success)">${student.attendance}%</span></div>
          </div>
        </div>
        <button class="btn btn-primary" onclick="viewReportCard('${studentName}')" style="padding:12px 24px;white-space:nowrap"><i class="fas fa-file"></i> View Full Report</button>
      </div>
    `;
    summarySection.style.display = 'block';
    filterReportCards();
  } else {
    previewSection.innerHTML = '<i class="fas fa-thumbtack"></i> Tip: Select a student above to view their complete report card with all subjects, scores, grades, and remarks.';
    summarySection.style.display = 'none';
  }
}

function printReportCard(studentName) {
  const reportContent = document.getElementById('report-card-content');
  
  if (!reportContent) {
    showToast('<i class="fas fa-times-circle"></i> Report card not found', 'error');
    return;
  }

  // Create a new window for printing
  const printWindow = window.open('', '', 'height=900,width=1200');
  
  // Add print styles
  const printStyles = `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Poppins', sans-serif; line-height: 1.6; }
      @media print {
        body { margin: 0; padding: 20px; }
        .no-print { display: none !important; }
        table { page-break-inside: avoid; }
        tr { page-break-inside: avoid; }
      }
      :root {
        --blue-dark: #1a56db;
        --blue-main: #1a56db;
        --blue-xpale: #e0e7ff;
        --success: #30b981;
        --success-light: #d1fae5;
        --info: #3b82f6;
        --info-light: #dbeafe;
        --warning: #f59e0b;
        --warning-light: #fef3c7;
        --danger: #ef4444;
        --gray-50: #f9fafb;
        --gray-100: #f3f4f6;
        --gray-200: #e5e7eb;
        --gray-300: #d1d5db;
        --gray-500: #6b7280;
        --gray-600: #4b5563;
        --gray-700: #374151;
        --gray-800: #1f2937;
      }
    </style>
  `;

  printWindow.document.write('<!DOCTYPE html>');
  printWindow.document.write('<html>');
  printWindow.document.write('<head>');
  printWindow.document.write('<meta charset="UTF-8">');
  printWindow.document.write('<title>Report Card - ' + studentName + '</title>');
  printWindow.document.write(printStyles);
  printWindow.document.write('</head>');
  printWindow.document.write('<body>');
  printWindow.document.write(reportContent.innerHTML);
  printWindow.document.write('</body>');
  printWindow.document.write('</html>');
  printWindow.document.close();

  // Wait for content to load then print
  setTimeout(() => {
    printWindow.print();
    showToast('<i class="fas fa-print"></i> Opening print dialog...', 'info');
  }, 250);
}

function downloadReportCardPDF(studentName) {
  const reportContent = document.getElementById('report-card-content');
  
  if (!reportContent) {
    showToast('<i class="fas fa-times-circle"></i> Report card not found', 'error');
    return;
  }

  // Create a new window for PDF-ready format
  const pdfWindow = window.open('', '', 'height=900,width=1200');
  
  const pdfStyles = `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; background: white; }
      @page { size: A4; margin: 20mm; }
      @media print {
        body { margin: 0; padding: 0; }
      }
      :root {
        --blue-dark: #1a56db;
        --blue-main: #1a56db;
        --blue-xpale: #e0e7ff;
        --success: #30b981;
        --success-light: #d1fae5;
        --info: #3b82f6;
        --info-light: #dbeafe;
        --warning: #f59e0b;
        --warning-light: #fef3c7;
        --danger: #ef4444;
        --gray-50: #f9fafb;
        --gray-100: #f3f4f6;
        --gray-200: #e5e7eb;
        --gray-300: #d1d5db;
        --gray-500: #6b7280;
        --gray-600: #4b5563;
        --gray-700: #374151;
        --gray-800: #1f2937;
      }
    </style>
  `;

  pdfWindow.document.write('<!DOCTYPE html>');
  pdfWindow.document.write('<html>');
  pdfWindow.document.write('<head>');
  pdfWindow.document.write('<meta charset="UTF-8">');
  pdfWindow.document.write('<title>Report Card PDF - ' + studentName + '</title>');
  pdfWindow.document.write(pdfStyles);
  pdfWindow.document.write('</head>');
  pdfWindow.document.write('<body>');
  pdfWindow.document.write(reportContent.innerHTML);
  pdfWindow.document.write('</body>');
  pdfWindow.document.write('</html>');
  pdfWindow.document.close();

  setTimeout(() => {
    const filename = studentName.toLowerCase().replace(/\s+/g, '-') + '-report-card-' + new Date().toISOString().slice(0, 10) + '.pdf';
    showToast('<i class="fas fa-download"></i> Open browser Print → Save as PDF with filename: ' + filename, 'info');
  }, 250);
}

function updateAnalysis() {
  const subject = document.getElementById('analysis-subject').value;
  const classVal = document.getElementById('analysis-class').value || 'All Classes';
  
  // Update statistics based on selection
  const stats = {
    average: subject === 'All Subjects' || subject === 'Mathematics' ? '92.5%' : subject === 'English Language' ? '88.3%' : '85.6%',
    passRate: subject === 'All Subjects' || subject === 'Mathematics' ? '78%' : '75%',
    aGrades: subject === 'All Subjects' || subject === 'Mathematics' ? '45' : '38',
    bGrades: subject === 'All Subjects' || subject === 'Mathematics' ? '62' : '55',
    belowAvg: subject === 'All Subjects' || subject === 'Mathematics' ? '22%' : '25%'
  };

  showToast('<i class="fas fa-chart-bar"></i> Analysis updated for '+subject+' - '+classVal, 'info');
}

// Generate attendance report
function generateAttendanceReport() {
  const reportContent = `
    <div style="padding:20px;max-width:800px">
      <div style="text-align:center;margin-bottom:20px">
        <h2 style="margin:0;color:var(--blue-dark)"><i class="fas fa-chart-bar"></i> Daily Attendance Report</h2>
        <p style="margin:5px 0;color:var(--gray-600);font-size:12px">${new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</p>
      </div>
      
      <div style="background:var(--blue-xpale);padding:15px;border-radius:8px;margin-bottom:20px">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:15px">
          <div style="text-align:center">
            <div style="font-size:24px;font-weight:bold;color:var(--success)">798</div>
            <div style="font-size:12px;color:var(--gray-600)">Present</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:24px;font-weight:bold;color:var(--danger)">37</div>
            <div style="font-size:12px;color:var(--gray-600)">Absent</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:24px;font-weight:bold;color:var(--warning)">7</div>
            <div style="font-size:12px;color:var(--gray-600)">Late</div>
          </div>
        </div>
      </div>
      
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <thead>
          <tr style="background:var(--blue-main);color:white">
            <th style="padding:10px;text-align:left">Class</th>
            <th style="padding:10px;text-align:center">Present</th>
            <th style="padding:10px;text-align:center">Total</th>
            <th style="padding:10px;text-align:center">Absent</th>
            <th style="padding:10px;text-align:center">%</th>
          </tr>
        </thead>
        <tbody>
          ${[['Creche',26,28,2],['Nursery',31,32,1],['KG 1',33,35,2],['KG 2',35,36,1],['Basic 1',36,38,2],['Basic 2',38,40,2],['Basic 3',40,42,2],['Basic 4',35,38,3],['Basic 5',39,40,1],['Basic 6',34,36,2],['JHS 1',40,42,2],['JHS 2',37,40,3],['JHS 3',37,39,2]].map(([c,p,t,a])=>{
            const pct = Math.round(p/t*100);
            return '<tr style="border-bottom:1px solid var(--gray-200)"><td style="padding:10px">'+c+'</td><td style="padding:10px;text-align:center;font-weight:600;color:var(--success)">'+p+'</td><td style="padding:10px;text-align:center">'+t+'</td><td style="padding:10px;text-align:center;color:var(--danger)">'+a+'</td><td style="padding:10px;text-align:center;font-weight:600">'+pct+'%</td></tr>';
          }).join('')}
        </tbody>
      </table>
      
      <div style="text-align:center;gap:8px;display:flex;justify-content:center">
        <button class="btn btn-primary btn-sm" onclick="window.print()"><i class="fas fa-print"></i> Print Report</button>
        <button class="btn btn-secondary btn-sm" onclick="downloadAttendanceReportCSV()"><i class="fas fa-download"></i> Download CSV</button>
        <button class="btn btn-secondary btn-sm" onclick="closeModal()">Close</button>
      </div>
    </div>
  `;
  openModal(reportContent);
}

// Download attendance report as CSV
function downloadAttendanceReportCSV() {
  let csv = 'Attendance Report\n';
  csv += 'Generated: '+new Date().toLocaleDateString()+'\n\n';
  csv += 'Class,Present,Total,Absent,Percentage\n';
  
  const classData = [['Creche',26,28,2],['Nursery',31,32,1],['KG 1',33,35,2],['KG 2',35,36,1],['Basic 1',36,38,2],['Basic 2',38,40,2],['Basic 3',40,42,2],['Basic 4',35,38,3],['Basic 5',39,40,1],['Basic 6',34,36,2],['JHS 1',40,42,2],['JHS 2',37,40,3],['JHS 3',37,39,2]];
  
  classData.forEach(([c,p,t,a]) => {
    const pct = Math.round(p/t*100);
    csv += c+','+p+','+t+','+a+','+pct+'%\n';
  });
  
  csv += '\n\nSummary\n';
  csv += 'Total Students,842\n';
  csv += 'Present,798\n';
  csv += 'Absent,37\n';
  csv += 'Late,7\n';
  csv += 'Average Attendance,94.2%\n';
  
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'attendance_report_'+new Date().toISOString().slice(0,10)+'.csv');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> Report downloaded!', 'success');
}

// Save grades
function saveGrades() {
  showToast('<i class="fas fa-check-circle"></i> Grades saved!', 'success');
}

// Update profile
function updateProfile() {
  showToast('<i class="fas fa-check-circle"></i> Profile updated!', 'success');
}

// Update password
function updatePassword() {
  const currentPass = document.querySelector('input[placeholder="Current password"]')?.value;
  const newPass = document.querySelector('input[placeholder="••••••••"]')?.value;
  const confirmPass = document.querySelectorAll('input[placeholder="••••••••"]')[1]?.value;
  
  if (!currentPass || !newPass || !confirmPass) {
    alert('Please fill all password fields');
    return;
  }
  if (newPass !== confirmPass) {
    showToast('<i class="fas fa-times-circle"></i> New passwords do not match', 'error');
    return;
  }
  showToast('<i class="fas fa-check-circle"></i> Password updated!', 'success');
}

// Send chat message

// Create/Edit record
function createRecord(type) {
  const title = type.charAt(0).toUpperCase() + type.slice(1);
  const confirmed = prompt(`Enter details for new ${type}:`, '');
  if (confirmed !== null) {
    showToast(`<i class="fas fa-check-circle"></i> ${title} created!`, 'success');
    location.reload();
  }
}

// Edit record
function editRecord(id, type) {
  const currentValue = prompt(`Edit ${type}:`, '');
  if (currentValue !== null) {
    showToast(`<i class="fas fa-check-circle"></i> ${type} updated!`, 'success');
    location.reload();
  }
}

// Delete record with confirmation
function deleteRecord(id, type) {
  if (confirm(`Are you sure you want to delete this ${type}?`)) {
    if(type === 'Teacher') {
      const index = teachersData.findIndex(t=>t.teacher_id===id);
      if(index !== -1) teachersData.splice(index, 1);
      showToast('<i class="fas fa-check-circle"></i> Teacher deleted!', 'success', 3000);
    } else if(type === 'Student') {
      const index = enrolledStudents.findIndex(s=>s.student_id===id);
      if(index !== -1) enrolledStudents.splice(index, 1);
      showToast('<i class="fas fa-check-circle"></i> Student deleted!', 'success', 3000);
    } else if(type === 'Parent') {
      const index = parentsData.findIndex(p=>p.parent_id===id);
      if(index !== -1) parentsData.splice(index, 1);
      showToast('<i class="fas fa-check-circle"></i> Parent deleted!', 'success', 3000);
    } else if(type === 'Admission') {
      const index = admissionsData.findIndex(a=>a.adm_id===id);
      if(index !== -1) admissionsData.splice(index, 1);
      showToast('<i class="fas fa-check-circle"></i> Admission record deleted!', 'success', 3000);
    } else {
      showToast('<i class="fas fa-check-circle"></i> Record deleted!', 'success', 3000);
    }
    
    setTimeout(() => {
      navTo(type.toLowerCase() + 's');
    }, 1500);
  }
}


// Generate report
function generateReport(type) {
  alert(`Generating ${type} report...`);
}

// Export data
// ═══════════════════════════════════
// ADMISSIONS EXPORT FUNCTIONS
// ═══════════════════════════════════
function exportAdmissionsToCSV(){
  let csv = 'Admissions Data Report\n';
  csv += 'Generated: '+new Date().toLocaleDateString()+'\n\n';
  
  csv += 'Application ID,Student Name,DOB,Gender,Phone,Address,School,Class Applying,Academic Year,Status,Parent Name,Parent Phone,Occupation,Applied Date\n';
  admissionsData.forEach((a)=>{
    csv += a.adm_id+','+a.name+','+a.dob+','+a.gender+','+a.phone+','+a.address+','+a.school+','+a.class_applying+','+a.academic_year+','+a.status+','+a.parent_name+','+a.parent_phone+','+a.parent_occupation+','+a.created+'\n';
  });
  
  csv += '\n\nSummary\n';
  csv += 'Total Applications,'+(admissionsData.length)+'\n';
  csv += 'Pending,'+(admissionsData.filter(a=>a.status==='Pending').length)+'\n';
  csv += 'Approved,'+(admissionsData.filter(a=>a.status==='Approved').length)+'\n';
  csv += 'Rejected,'+(admissionsData.filter(a=>a.status==='Rejected').length)+'\n';
  
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'Admissions_Data_'+new Date().toISOString().slice(0,10)+'.csv');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> Admissions data exported to CSV!', 'success', 3000);
}

function exportAdmissionsToExcel(){
  let csv = 'Application ID\tStudent Name\tDOB\tGender\tPhone\tAddress\tSchool\tClass Applying\tAcademic Year\tStatus\tParent Name\tParent Phone\tOccupation\tApplied Date\n';
  admissionsData.forEach((a)=>{
    csv += a.adm_id+'\t'+a.name+'\t'+a.dob+'\t'+a.gender+'\t'+a.phone+'\t'+a.address+'\t'+a.school+'\t'+a.class_applying+'\t'+a.academic_year+'\t'+a.status+'\t'+a.parent_name+'\t'+a.parent_phone+'\t'+a.parent_occupation+'\t'+a.created+'\n';
  });
  
  const element = document.createElement('a');
  element.setAttribute('href', 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'Admissions_Data_'+new Date().toISOString().slice(0,10)+'.xls');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> Admissions data exported to Excel!', 'success', 3000);
}

function downloadAdmissionsPDF(){
  let html = '<html><head><meta charset="UTF-8"><style>';
  html += 'body{font-family:Arial,sans-serif;margin:15px;color:#333;font-size:12px}';
  html += 'h1{font-size:18px;margin:0 0 8px 0;color:#0066cc}h2{font-size:13px;margin:12px 0 8px 0;border-bottom:2px solid #0066cc;padding-bottom:4px}';
  html += 'table{width:100%;border-collapse:collapse;margin:10px 0}th,td{border:1px solid #ddd;padding:6px;text-align:left;font-size:11px}';
  html += 'th{background:#0066cc;color:white;font-weight:bold}.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:15px 0}';
  html += '.stat-box{padding:10px;border:1px solid #ddd;text-align:center;border-radius:4px}.stat-num{font-size:18px;font-weight:bold;color:#0066cc}';
  html += '.page-break{page-break-after:always;margin:20px 0}';
  html += '</style></head><body>';
  
  html += '<h1><i class="fas fa-clipboard-list"></i> Admissions Data Report</h1>';
  html += '<div style="color:#666;font-size:10px;margin-bottom:15px">Generated on '+new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})+'</div>';
  
  const pending = admissionsData.filter(a=>a.status==='Pending').length;
  const approved = admissionsData.filter(a=>a.status==='Approved').length;
  const rejected = admissionsData.filter(a=>a.status==='Rejected').length;
  const enrolled = admissionsData.filter(a=>a.status==='Enrolled').length;
  
  html += '<div class="summary">';
  html += '<div class="stat-box"><div class="stat-num">'+admissionsData.length+'</div><div>Total Applications</div></div>';
  html += '<div class="stat-box"><div class="stat-num">'+pending+'</div><div>Pending</div></div>';
  html += '<div class="stat-box"><div class="stat-num">'+approved+'</div><div>Approved</div></div>';
  html += '<div class="stat-box"><div class="stat-num">'+rejected+'</div><div>Rejected</div></div>';
  html += '</div>';
  
  html += '<h2>All Applications</h2>';
  html += '<table>';
  html += '<tr><th>App No.</th><th>Student Name</th><th>DOB</th><th>Gender</th><th>Class</th><th>School</th><th>Parent</th><th>Status</th><th>Date</th></tr>';
  admissionsData.forEach((a)=>{
    const statusColor = a.status==='Pending'?'#f59e0b':(a.status==='Approved'?'#10b981':(a.status==='Enrolled'?'#3b82f6':'#ef4444'));
    html += '<tr><td><strong>'+a.adm_id+'</strong></td><td>'+a.name+'</td><td>'+a.dob+'</td><td>'+a.gender+'</td><td>'+a.class_applying+'</td><td>'+a.school+'</td><td>'+a.parent_name+'</td><td style="color:white;background:'+statusColor+';font-weight:bold;text-align:center;padding:4px">'+a.status+'</td><td>'+a.created+'</td></tr>';
  });
  html += '</table>';
  
  html += '<div class="page-break"></div>';
  html += '<h2>Pending Applications</h2>';
  html += '<table>';
  html += '<tr><th>App No.</th><th>Student</th><th>Class</th><th>Parent</th><th>Phone</th><th>Applied</th></tr>';
  admissionsData.filter(a=>a.status==='Pending').forEach((a)=>{
    html += '<tr><td>'+a.adm_id+'</td><td>'+a.name+'</td><td>'+a.class_applying+'</td><td>'+a.parent_name+'</td><td>'+a.parent_phone+'</td><td>'+a.created+'</td></tr>';
  });
  html += '</table>';
  
  html += '<div class="page-break"></div>';
  html += '<h2>Approved Applications</h2>';
  html += '<table>';
  html += '<tr><th>App No.</th><th>Student</th><th>Class</th><th>Parent</th><th>Phone</th><th>Status</th></tr>';
  admissionsData.filter(a=>a.status==='Approved').forEach((a)=>{
    html += '<tr><td>'+a.adm_id+'</td><td>'+a.name+'</td><td>'+a.class_applying+'</td><td>'+a.parent_name+'</td><td>'+a.parent_phone+'</td><td>Ready for Enrollment</td></tr>';
  });
  html += '</table>';
  
  html += '</body></html>';
  
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(html));
  element.setAttribute('download', 'Admissions_Data_'+new Date().toISOString().slice(0,10)+'.pdf.html');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> PDF generated!<br/>File: Admissions_Data_'+new Date().toISOString().slice(0,10)+'.pdf.html', 'success', 3000);
}

function exportData(type = 'admissions') {
  if(type === 'admissions'){
    if(confirm('How would you like to export admissions data?\n\nOK = CSV\nCancel = Show menu')){
      exportAdmissionsToCSV();
    } else {
      alert('Export options:\n1. Click Export again for CSV\n2. Use admissions statistics for detailed analysis');
    }
  }
}

// Print document
function printDocument() {
  window.print();
}

// Process action
function processAction(action) {
  if (confirm(`Process ${action}?`)) {
    showToast(`<i class="fas fa-check-circle"></i> ${action} processed!`, 'success');
  }
}

// Handle pagination
function goToPage(page) {
  if (page === '…') return;
  alert(`Load page ${page}`);
  console.log(`Navigate to page: ${page}`);
}

// Initialize button handlers dynamically
function initButtonHandlers() {
  // Save attendance buttons
  document.querySelectorAll('.card-hdr').forEach(hdr => {
    if (hdr.innerHTML.includes('Attendance')) {
      const btn = hdr.querySelector('button');
      if (btn && btn.innerHTML.includes('Save')) {
        btn.onclick = saveAttendance;
      }
    }
  });

  // Chat send buttons
  document.querySelectorAll('.chat-send').forEach(btn => {
    btn.onclick = function() { sendMessage(this); };
  });

  // Generic save buttons
  document.querySelectorAll('.btn').forEach(btn => {
    const text = btn.innerHTML;
    if (text.includes('Save') && !btn.onclick && !btn.parentElement.innerHTML.includes('onclick')) {
      btn.onclick = function() { 
        if (text.includes('Attendance')) saveAttendance();
        else if (text.includes('Grades')) saveGrades();
        else if (text.includes('Profile')) updateProfile();
        else saveForm();
      };
    }
    if (text.includes('Publish') && !btn.onclick) {
      btn.onclick = function() { showToast('<i class="fas fa-check-circle"></i> Published!', 'success'); };
    }
    if (text.includes('Cancel') && !btn.onclick) {
      btn.onclick = function() { location.reload(); };
    }
    if (text.includes('Update') && text.includes('Password') && !btn.onclick) {
      btn.onclick = updatePassword;
    }
    if (text.includes('<i class="fas fa-print"></i>') && !btn.onclick) {
      btn.onclick = printDocument;
    }
    if (text.includes('Upload') && !btn.onclick) {
      btn.onclick = function() { showToast('<i class="fas fa-check-circle"></i> File uploaded!', 'success'); };
    }
    if (text.includes('Create') && !btn.onclick) {
      btn.onclick = function() { showToast('<i class="fas fa-check-circle"></i> Record created!', 'success'); };
    }
  });

  // Pagination buttons
  document.querySelectorAll('.pg-btn').forEach(btn => {
    if (!btn.onclick) {
      btn.onclick = function() { goToPage(this.innerHTML); };
    }
  });

  // View/Edit/Delete buttons on tables
  document.querySelectorAll('.btn.btn-secondary.btn-xs, .btn.btn-primary.btn-xs, .btn.btn-danger.btn-xs').forEach(btn => {
    if (!btn.onclick && !btn.parentElement.innerHTML.includes('onclick')) {
      const text = btn.innerHTML;
      if (text.includes('View')) {
        btn.onclick = function() { alert('Viewing record...'); };
      }
      if (text.includes('Edit')) {
        btn.onclick = function() { alert('Editing record...'); };
      }
      if (text.includes('Delete') || text.includes('Del')) {
        btn.onclick = function() { deleteRecord(1, 'Record'); };
      }
      if (text.includes('Message')) {
        btn.onclick = function() { navTo('messaging'); };
      }
      if (text.includes('Grade')) {
        btn.onclick = function() { alert('Opening grading interface...'); };
      }
      if (text.includes('Connect')) {
        btn.onclick = function() { alert('Connection request sent!'); };
      }
      if (text.includes('Apply')) {
        btn.onclick = function() { alert('Application submitted!'); };
      }
      if (text.includes('Profile')) {
        btn.onclick = function() { alert('Opening profile...'); };
      }
      if (text.includes('Call')) {
        btn.onclick = function() { alert('Initiating call...'); };
      }
      if (text.includes('Slip')) {
        btn.onclick = function() { alert('Generating slip...'); };
      }
      if (text.includes('Perms')) {
        btn.onclick = function() { alert('Managing permissions...'); };
      }
      if (text.includes('Disable')) {
        btn.onclick = function() { alert('Account disabled'); };
      }
      if (text.includes('Generate')) {
        btn.onclick = function() { alert('Generating...'); };
      }
      if (text.includes('Print') || text.includes('<i class="fas fa-download"></i>')) {
        btn.onclick = printDocument;
      }
    }
  });

  // Toolbar buttons without onclick
  document.querySelectorAll('.toolbar .btn').forEach(btn => {
    if (!btn.onclick && !btn.parentElement.innerHTML.includes('onclick')) {
      const text = btn.innerHTML;
      if (text.includes('Enroll') || text.includes('Add')) {
        btn.onclick = function() { createRecord(text.split(/\s+/)[1] || 'Record'); };
      }
      if (text.includes('Import')) {
        btn.onclick = function() { alert('Importing data...'); };
      }
      if (text.includes('Export')) {
        btn.onclick = function() { exportData(); };
      }
      if (text.includes('Print')) {
        btn.onclick = printDocument;
      }
      if (text.includes('Edit')) {
        btn.onclick = function() { alert('Opening editor...'); };
      }
    }
  });

  // Hero buttons
  document.querySelectorAll('.hero-btn-gold, .hero-btn-outline').forEach(btn => {
    if (!btn.onclick && !btn.parentElement.innerHTML.includes('onclick')) {
      const text = btn.innerHTML;
      if (text.includes('Browse')) {
        btn.onclick = function() { navTo('directory'); };
      }
      if (text.includes('Admission')) {
        btn.onclick = function() { navTo('admission'); };
      }
      if (text.includes('Learn')) {
        btn.onclick = function() { navTo('about'); };
      }
    }
  });

  // Send message buttons
  document.querySelectorAll('.btn').forEach(btn => {
    if (btn.innerHTML.includes('Send Message') && !btn.onclick) {
      btn.onclick = function() { showToast('<i class="fas fa-check-circle"></i> Message sent!', 'success'); };
    }
  });

  // Process/Backup buttons
  document.querySelectorAll('.btn').forEach(btn => {
    if ((btn.innerHTML.includes('Backup') || btn.innerHTML.includes('Process') || 
         btn.innerHTML.includes('Download') || btn.innerHTML.includes('Cloud')) && !btn.onclick) {
      btn.onclick = function() { alert(this.innerHTML + ' initiated...'); };
    }
  });
}

// ═══════════════════════════════════
// INIT
// ═══════════════════════════════════
document.getElementById('role-fab').style.display='none';

// Initialize page
document.addEventListener('DOMContentLoaded', function(){
  // Initialize Visitor home page on load
  switchRole('Visitor');
  initButtonHandlers();
  initMobileSidebarHandlers();
});

// Re-initialize button handlers after rendering new content
const originalRenderMain = renderMain;
renderMain = function() {
  originalRenderMain.call(this);
  setTimeout(initButtonHandlers, 100);
  setTimeout(initMobileSidebarHandlers, 100);
};

// ═══════════════════════════════════
// MOBILE SIDEBAR EVENT HANDLERS
// ═══════════════════════════════════
function initMobileSidebarHandlers(){
  const sidebar = document.getElementById('sidebar');
  const sidebarItems = document.querySelectorAll('.sb-item');
  
  if(!sidebar) return;
  
  // Close sidebar when clicking on any sidebar item
  sidebarItems.forEach(item => {
    item.addEventListener('click', closeMobileSidebar);
  });
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', function(event){
    const isMobile = window.innerWidth <= 768;
    if(!isMobile) return;
    
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebar-toggle');
    
    if(!sidebar || !toggle) return;
    
    const isClickInSidebar = sidebar.contains(event.target);
    const isClickOnToggle = toggle.contains(event.target);
    
    if(!isClickInSidebar && !isClickOnToggle && sidebar.classList.contains('open')){
      closeMobileSidebar();
    }
  });
  
  // Handle window resize - close sidebar if resizing to desktop
  window.addEventListener('resize', function(){
    if(window.innerWidth > 768){
      closeMobileSidebar();
    }
  });
  
  // Wrap all tables with responsive wrapper
  wrapTablesForResponsiveness();
}

// ═══════════════════════════════════
// RESPONSIVE TABLE WRAPPER
// ═══════════════════════════════════
function wrapTablesForResponsiveness(){
  const tables = document.querySelectorAll('.card .tbl, .main-wrap .tbl');
  tables.forEach(table => {
    // Check if table is already wrapped
    if(table.parentElement && table.parentElement.classList.contains('table-wrapper')){
      return;
    }
    
    // Create wrapper div
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    
    // Wrap the table
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
}
