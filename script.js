//  Course Explorer Logic

/*
 * Course class encapsulating course data.
 * Uses graceful defaults for missing fields.
 */
class Course {
  constructor(raw) {
    this.id = raw.id ?? "Unknown ID";
    this.title = raw.title ?? "Untitled Course";
    this.department = raw.department ?? "Unknown";
    this.level = typeof raw.level === "number" ? raw.level : null;
    this.credits = typeof raw.credits === "number" ? raw.credits : null;
    this.instructor = raw.instructor || null; // may be null in data
    this.description = raw.description ?? "No description provided.";
    this.semester = raw.semester ?? "Unknown";
  }

  /*
   * Returns a sortable numeric key for semester.
   * Semester format assumed "Season YYYY".
   * Seasons: Winter(1), Spring(2), Summer(3), Fall(4).
   * Unknown semesters are put at the end.
   */
  getSemesterKey() {
    if (!this.semester || typeof this.semester !== "string") return Infinity;
    const parts = this.semester.split(" ");
    if (parts.length !== 2) return Infinity;

    const [season, yearStr] = parts;
    const year = parseInt(yearStr, 10);
    if (Number.isNaN(year)) return Infinity;

    const seasonOrder = { Winter: 1, Spring: 2, Summer: 3, Fall: 4 };
    const sVal = seasonOrder[season];
    if (!sVal) return Infinity;

    // e.g., 2025.1, 2025.2... encoded as integer
    return year * 10 + sVal;
  }
}

//  Global state

let allCourses = [];        // original Course[] from JSON
let filteredCourses = [];   // after filters & sorting
let selectedCourseId = null;

// DOM elements
const fileInput = document.getElementById("fileInput");
const fileError = document.getElementById("fileError");

const departmentFilter = document.getElementById("departmentFilter");
const levelFilter = document.getElementById("levelFilter");
const creditsFilter = document.getElementById("creditsFilter");
const instructorFilter = document.getElementById("instructorFilter");
const sortSelect = document.getElementById("sortSelect");

const courseListEl = document.getElementById("courseList");
const courseDetailEl = document.getElementById("courseDetail");

//  File loading & JSON parsing

fileInput.addEventListener("change", handleFileSelect);

function handleFileSelect(event) {
  fileError.textContent = "";
  const file = event.target.files[0];

  if (!file) {
    fileError.textContent = "Please select a JSON file.";
    return;
  }

  const reader = new FileReader();

  reader.onload = e => {
    try {
      const text = e.target.result;
      const data = JSON.parse(text);

      if (!Array.isArray(data)) {
        throw new Error("JSON root is not an array.");
      }

      // Create Course objects
      allCourses = data.map(obj => new Course(obj));
      // Build dropdown options
      populateFilterOptions();
      // Render with current filters (initially All / None)
      applyFiltersAndSort();

    } catch (err) {
      console.error("JSON parse error:", err);
      fileError.textContent = "Invalid JSON file format.";
      allCourses = [];
      filteredCourses = [];
      renderCourseList();
      renderCourseDetail(null);
    }
  };

  reader.onerror = () => {
    console.error("FileReader error");
    fileError.textContent = "Error reading file.";
  };

  reader.readAsText(file);
}

//  Filter option generation
//  (Using Set to get unique values)

function populateFilterOptions() {
  // Clear existing (except "All")
  resetSelect(departmentFilter);
  resetSelect(levelFilter);
  resetSelect(creditsFilter);
  resetSelect(instructorFilter);

  const deptSet = new Set();
  const levelSet = new Set();
  const creditsSet = new Set();
  const instructorSet = new Set();

  allCourses.forEach(course => {
    if (course.department) deptSet.add(course.department);
    if (course.level !== null) levelSet.add(course.level);
    if (course.credits !== null) creditsSet.add(course.credits);
    if (course.instructor) instructorSet.add(course.instructor);
  });

  addOptionsFromSet(departmentFilter, Array.from(deptSet).sort());
  addOptionsFromSet(levelFilter, Array.from(levelSet).sort((a, b) => a - b));
  addOptionsFromSet(creditsFilter, Array.from(creditsSet).sort((a, b) => a - b));
  addOptionsFromSet(instructorFilter, Array.from(instructorSet).sort());
}

function resetSelect(selectEl) {
  // Keep only the first option ("All")
  while (selectEl.options.length > 1) {
    selectEl.remove(1);
  }
}

function addOptionsFromSet(selectEl, values) {
  values.forEach(value => {
    const opt = document.createElement("option");
    opt.value = String(value);
    opt.textContent = String(value);
    selectEl.appendChild(opt);
  });
}

//  Filtering & Sorting

// When any filter or sort changes, re-apply logic.
[departmentFilter, levelFilter, creditsFilter, instructorFilter, sortSelect]
  .forEach(el => el.addEventListener("change", applyFiltersAndSort));

function applyFiltersAndSort() {
  // Start from original list
  let result = allCourses.filter(course => {
    // Department
    if (departmentFilter.value !== "All" &&
        course.department !== departmentFilter.value) {
      return false;
    }

    // Level
    if (levelFilter.value !== "All") {
      const targetLevel = Number(levelFilter.value);
      if (course.level !== targetLevel) return false;
    }

    // Credits
    if (creditsFilter.value !== "All") {
      const targetCredits = Number(creditsFilter.value);
      if (course.credits !== targetCredits) return false;
    }

    // Instructor
    if (instructorFilter.value !== "All") {
      if (course.instructor !== instructorFilter.value) return false;
    }

    return true;
  });

  // Sorting
  const sortValue = sortSelect.value;

  if (sortValue === "id-asc") {
    result.sort((a, b) => a.id.localeCompare(b.id));
  } else if (sortValue === "id-desc") {
    result.sort((a, b) => b.id.localeCompare(a.id));
  } else if (sortValue === "title-asc") {
    result.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortValue === "title-desc") {
    result.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortValue === "semester-asc") {
    result.sort((a, b) => a.getSemesterKey() - b.getSemesterKey());
  } else if (sortValue === "semester-desc") {
    result.sort((a, b) => b.getSemesterKey() - a.getSemesterKey());
  }

  filteredCourses = result;
  renderCourseList();

  // Auto-select first course if none selected
  if (filteredCourses.length > 0) {
    const initiallySelected =
      filteredCourses.find(c => c.id === selectedCourseId) || filteredCourses[0];
    showCourseDetails(initiallySelected);
  } else {
    renderCourseDetail(null);
  }
}

//  Rendering: list & detail

function renderCourseList() {
  courseListEl.innerHTML = "";

  if (filteredCourses.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No courses to display.";
    li.style.cursor = "default";
    courseListEl.appendChild(li);
    return;
  }

  filteredCourses.forEach(course => {
    const li = document.createElement("li");
    li.textContent = course.id;

    if (course.id === selectedCourseId) {
      li.classList.add("selected");
    }

    li.addEventListener("click", () => {
      showCourseDetails(course);
    });

    courseListEl.appendChild(li);
  });
}

function showCourseDetails(course) {
  if (!course) {
    courseDetailEl.innerHTML = "<p>No course selected.</p>";
    selectedCourseId = null;
    return;
  }

  selectedCourseId = course.id;

  // Re-highlight list
  Array.from(courseListEl.children).forEach(li => {
    li.classList.toggle("selected", li.textContent === course.id);
  });

  const instructorDisplay = course.instructor || "TBA";
  const levelDisplay = course.level !== null ? course.level : "N/A";
  const creditsDisplay = course.credits !== null ? course.credits : "N/A";

  courseDetailEl.innerHTML = `
    <h2>${course.id}</h2>
    <p><span class="detail-label">Title:</span> ${course.title}</p>
    <p><span class="detail-label">Department:</span> ${course.department}</p>
    <p><span class="detail-label">Level:</span> ${levelDisplay}</p>
    <p><span class="detail-label">Credits:</span> ${creditsDisplay}</p>
    <p><span class="detail-label">Instructor:</span> ${instructorDisplay}</p>
    <p><span class="detail-label">Semester:</span> ${course.semester}</p>
    <p>${course.description}</p>
  `;
}
