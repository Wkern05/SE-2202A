
/* 
 * The Observer receives notifications whenever an assignment
 * status changes. Different statuses print in different formats
 * depending on the specification.
 */
class Observer {

  /*
   * notify(studentName, assignmentName, status)
   * Handles all printed output related to assignment status updates.
   */
  notify(studentName, assignmentName, status) {

    // differently formatted notifications based on status
    switch(status){
    case "released":
      console.log(`Observer → ${studentName}, ${assignmentName} has been released.`);
    break;
    case "working":
      console.log(`Observer → ${studentName} is working on ${assignmentName}.`);
    break;
    case "final reminder":
      console.log(`Observer → ${studentName} has a final reminder for ${assignmentName}.`);
    break;
    // Generic final messages: submitted, passed, failed
    default:
      console.log(`Observer → ${studentName} has ${status} ${assignmentName}`);
    }
  }
}



/*
 * Represents an assignment with a name, status, and a private
 * "_grade" field per rubric. The grade should only be modified
 * through setGrade().
 */
class Assignment {

  constructor(name) {
    this.assignmentName = name;
    this.status = "released";   // default status when assignment is created
    this._grade = null;         // private-by-convention grade field
  }

  /*
   * Updates the grade and automatically updates assignment status
   * to "passed" or "failed" based on rubric threshold (50%).
   */
  setGrade(grade) {
    this._grade = grade;
    this.status = grade > 50 ? "passed" : "failed";
  }

  // Getter for grade (read-only access externally).
  getGrade() {
    return this._grade;
  }
}



/*
 * Manages assignment states, asynchronous work behavior,
 * and Observer notifications.
 */
class Student {

  constructor(fullName, email, observer) {
    this.fullName = fullName;
    this.email = email;
    this.assignmentStatuses = []; // array of Assignment objects
    this.overallGrade = null;
    this.observer = observer;
    this.timeouts = new Map();    // used to cancel auto-submit timers
  }

  setFullName(name) {
    this.fullName = name;
  }

  setEmail(email) {
    this.email = email;
  }

  // Helper: find assignment instance by name
  findAssignment(name) {
    return this.assignmentStatuses.find(a => a.assignmentName === name);
  }


  /*
   * updateAssignmentStatus(name, grade?)
   * - Creates assignment if it doesn't exist.
   * - If grade passed, updates using setGrade()
   * - Notifies observer about relevant change.
   */
  updateAssignmentStatus(name, grade = null) {
    let assignment = this.findAssignment(name);

    // If assignment does not exist, create + notify release
    if (!assignment) {
      assignment = new Assignment(name);
      this.assignmentStatuses.push(assignment);
      this.observer.notify(this.fullName, name, "released");
    }

    // If grade is provided, set grade + notify pass/fail
    if (grade !== null) {
      assignment.setGrade(grade);
      this.observer.notify(this.fullName, name, assignment.status);
    }
  }


  /*
   * getAssignmentStatus(name)
   * Returns a user-friendly readable assignment status.
   */
  getAssignmentStatus(name) {
    const assignment = this.findAssignment(name);
    if (!assignment) return "Hasn't been assigned";

    if (assignment.status === "passed") return "Pass";
    if (assignment.status === "failed") return "Fail";

    // Otherwise return the active system status ("working", "submitted", etc.)
    return assignment.status;
  }


  /*
   * startWorking(name)
   * Student begins work on an assignment. A 500ms timer schedules
   * auto-submission unless a reminder forces early submission.
   */
  startWorking(name) {
    let assignment = this.findAssignment(name);

    // If assignment wasn't released yet, implicitly release it
    if (!assignment) {
      this.updateAssignmentStatus(name);
      assignment = this.findAssignment(name);
    }

    assignment.status = "working";
    this.observer.notify(this.fullName, name, "working");

    // Asynchronous auto-submit timer
    const timeoutId = setTimeout(() => {
      this.submitAssignment(name);
    }, 500);

    this.timeouts.set(name, timeoutId);
  }


  /*
   * submitAssignment(name)
   * Cancels any pending auto-submit, marks submission,
   * and then after 500ms simulates grading.
   */
  submitAssignment(name) {
    const assignment = this.findAssignment(name);
    if (!assignment) return;

    // Cancel pending auto-submit if necessary
    const timeoutId = this.timeouts.get(name);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeouts.delete(name);
    }

    assignment.status = "submitted";
    this.observer.notify(this.fullName, name, "submitted");

    // After 500ms, assign a random grade + notify outcome
    setTimeout(() => {
      const randomGrade = Math.floor(Math.random() * 101); // must use Math.random()
      assignment.setGrade(randomGrade);

      this.observer.notify(this.fullName, name, assignment.status);

    }, 500);
  }


  /*
   * Computes average grade across all graded assignments.
   */
  getGrade() {
    const graded = this.assignmentStatuses.filter(a => a.getGrade() !== null);
    if (graded.length === 0) return 0;

    const total = graded.reduce((sum, a) => sum + a.getGrade(), 0);
    const avg = total / graded.length;

    this.overallGrade = avg;
    return avg;
  }
}



/*
 * Manages a group of students and global assignment operations.
 */
class ClassList {

  constructor(observer) {
    this.students = [];
    this.observer = observer;
  }

  addStudent(student) {
    this.students.push(student);
    console.log(`${student.fullName} has been added to the classlist.`);
  }

  removeStudent(name) {
    this.students = this.students.filter(s => s.fullName !== name);
  }

  findStudentByName(name) {
    return this.students.find(s => s.fullName === name);
  }


  /*
   * releaseAssignmentsParallel(names)
   * Uses Promise.all() to release assignments "in parallel".
   */
  async releaseAssignmentsParallel(assignmentNames) {
    const promises = this.students.map(student =>
      Promise.all(assignmentNames.map(name => student.updateAssignmentStatus(name)))
    );
    await Promise.all(promises);
  }


  /*
   * sendReminder(name)
   * Sends a reminder to all students with incomplete versions
   * of the given assignment, forcing submission.
   */
  sendReminder(name) {
    this.students.forEach(student => {
      const assignment = student.findAssignment(name);

      // Ignore completed submissions
      if (!assignment || ["submitted", "passed", "failed"].includes(assignment.status)) return;

      assignment.status = "final reminder";
      this.observer.notify(student.fullName, name, "final reminder");

      // Force submission immediately
      student.submitAssignment(name);
    });
  }


  /*
   * findOutstandingAssignments(name)
   * Returns list of student names who have NOT yet submitted
   * or graded the given assignment.
   */
  findOutstandingAssignments(name) {
    return this.students
      .filter(student => {
        const assignment = student.findAssignment(name);
        return (
          !assignment ||
          !["submitted", "passed", "failed"].includes(assignment.status)
        );
      })
      .map(s => s.fullName);
  }
}



 
// Example test case
 
const observer = new Observer();
const classList = new ClassList(observer);

const s1 = new Student("Alice Smith", "alice@example.com", observer);
const s2 = new Student("Bob Jones", "bob@example.com", observer);

classList.addStudent(s1);
classList.addStudent(s2);

classList.releaseAssignmentsParallel(["A1", "A2"]).then(() => {
  s1.startWorking("A1");
  s2.startWorking("A2");

  setTimeout(() => classList.sendReminder("A1"), 200);
});
