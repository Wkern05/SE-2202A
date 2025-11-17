/**
 * Define the Course and Assignment concepts using the constructor functions
 */

/*
 * assignment constructor function
 * creates an assignment with a title and a due date
 */
function Assignment(title, dueDate){
        //properties belong to the individual object
        this.title = title
        this.dueDate = dueDate
    }

    //add method to all assignment objects via the prototype
    Assignment.prototype.printAssignment = function(){
        console.log('   Title: ' + this.title + ' | Due Date: ' + this.dueDate);
    }

/*
 * course construction function
 * creates a course with a name, instructor, creditHours, and list of assignments
 */
function Course(courseName, instructor, creditHours, assignments){
        this.courseName = courseName
        this.instructor = instructor
        this.creditHours = creditHours
        this.assignments = assignments
    }

    //add method to all course objects via the prototype
    Course.prototype.courseInfo = function() {
    console.log('Course: ' + this.courseName + 
                ' | Instructor: ' + this.instructor + 
                ' | Credit Hours: ' + this.creditHours);

    console.log('Assignments >>>');
    
    //loop through all assignments and print them
    for (let a of this.assignments)
        a.printAssignment();
    }


// create the objects using the constructor functions

let a1 = new Assignment('Project Proposal','Jan 15');
let a2 = new Assignment('Midterm Report','Feb 20');
let a3 = new Assignment('Final Report','Mar 30');
let a4 = new Assignment('Presentation','Apr 10');

let c1 = new Course('Software Engineering', 'Dr. Pepper', 3, [a1, a2]);

let c2 = new Course('Data Science', 'Dr. Evil', 6,[a3, a4]);

c1.courseInfo();
c2.courseInfo();

