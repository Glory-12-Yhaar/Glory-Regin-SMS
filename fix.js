const fs = require('fs');
let js = fs.readFileSync('c:/Users/OKRAH GLORIA/Desktop/SCH/script.js', 'utf8');

// 1. Remove the old timetable data
js = js.replace(/\/\/ TIMETABLES DATA[\s\S]*?\/\/ REPORT CARDS MODULE/g, '// TIMETABLES DATA\nconst timetablesData = {};\n\n// REPORT CARDS MODULE');

// 2. Fix the subjects in classesData
const primarySubjects = "['Numeracy', 'Literacy', 'Creative Art', 'Writing', 'Environmental Studies']";
const basicSubjects = "['Mathematics', 'Science', 'English', 'Dagaare', 'Computing', 'History', 'RME', 'Creative Art']";
const jhsSubjects = "['Mathematics', 'Science', 'English', 'Social Studies', 'Computing', 'Career Technology', 'RME', 'Creative Art', 'Dagaare']";

// Creche to KG2
js = js.replace(/subjects:\s*\[([^\]]+)\]/g, (match, p1) => {
  if (p1.includes('Play & Learn') || p1.includes('Environmental Science') || (p1.includes('Science') && p1.includes('Arts') && !p1.includes('Integrated Science'))) {
    return 'subjects: ' + primarySubjects;
  }
  // Basic 1 to Basic 6
  if (p1.includes('Science') && !p1.includes('Career')) {
    if (p1.includes('French Language') && !p1.includes('Social Studies') && !p1.includes('Integrated Science')) {
        // wait, let's just make it simple since we know the structure
    }
  }
  return match;
});

// Since regex is tricky, let's just replace all subjects arrays by matching the class name
js = js.replace(/(\{ class_id: '[^']+', name: '(Creche|Nursery|KG 1|KG 2)'[^}]+subjects: )\[[^\]]+\]( \})/g, `$1${primarySubjects}$3`);
js = js.replace(/(\{ class_id: '[^']+', name: 'Basic [1-6]'[^}]+subjects: )\[[^\]]+\]( \})/g, `$1${basicSubjects}$3`);
js = js.replace(/(\{ class_id: '[^']+', name: 'JHS [1-3]'[^}]+subjects: )\[[^\]]+\]( \})/g, `$1${jhsSubjects}$3`);

fs.writeFileSync('c:/Users/OKRAH GLORIA/Desktop/SCH/script.js', js, 'utf8');
console.log('Fixed successfully');
