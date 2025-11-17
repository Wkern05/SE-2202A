function courseInfo() {
    console.log('Course: ' + this.courseName + 
                ' | Instructor: ' + this.instructor + 
                ' | Credit Hours: ' + this.creditHours);
    console.log('Assignments >>>');
    for (let a of this.assignments)
        a.printAssignment();
}

function printAssignment() {
    console.log('   Title: ' + this.title + ' | Due Date: ' + this.dueDate);
}

// Assignment objects
let a1 = { title: 'Project Proposal', dueDate: 'Jan 15', printAssignment };
let a2 = { title: 'Midterm Report', dueDate: 'Feb 20', printAssignment };
let a3 = { title: 'Final Report', dueDate: 'Mar 30', printAssignment };
let a4 = { title: 'Presentation', dueDate: 'Apr 10', printAssignment };

// Course objects
let c1 = { 
    courseName: 'Software Engineering', 
    instructor: 'Dr. Pepper', 
    creditHours: 3,
    assignments: [a1, a2], 
    courseInfo 
};

let c2 = { 
    courseName: 'Data Science', 
    instructor: 'Dr. Evil', 
    creditHours: 6,
    assignments: [a3, a4], 
    courseInfo 
};

// Display info
c1.courseInfo();
c2.courseInfo();
