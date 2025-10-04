// Selectors
const form = document.getElementById("studentForm");
const tableBody = document.getElementById("tableBody");

// Load existing data
document.addEventListener("DOMContentLoaded", loadStudents);

// Submit form
form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const studentId = document.getElementById("studentId").value.trim();
    const email = document.getElementById("email").value.trim();
    const contact = document.getElementById("contact").value.trim();

    if (!validateInput(name, studentId, email, contact)) {
        alert("Please enter valid data.");
        return;
    }

    const student = { name, studentId, email, contact };
    addStudentToTable(student);
    saveStudent(student);
    form.reset();
});

// Validate inputs
function validateInput(name, id, email, contact) {
    const nameRegex = /^[A-Za-z\s]+$/;
    const idRegex = /^\d+$/;
    const contactRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (
        nameRegex.test(name) &&
        idRegex.test(id) &&
        emailRegex.test(email) &&
        contactRegex.test(contact)
    );
}

// Save to localStorage
function saveStudent(student) {
    let students = JSON.parse(localStorage.getItem("students")) || [];
    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));
}

// Load students from localStorage
function loadStudents() {
    let students = JSON.parse(localStorage.getItem("students")) || [];
    students.forEach(student => addStudentToTable(student));
}

// Add student row
function addStudentToTable(student) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.studentId}</td>
        <td>${student.email}</td>
        <td>${student.contact}</td>
        <td class="actions">
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </td>
    `;

    tableBody.appendChild(row);
    addActionListeners(row, student);
    updateScroll();
}

// Edit & Delete functionality
function addActionListeners(row, student) {
    const editBtn = row.querySelector(".edit");
    const deleteBtn = row.querySelector(".delete");

    editBtn.addEventListener("click", () => {
        // Populate form
        document.getElementById("name").value = student.name;
        document.getElementById("studentId").value = student.studentId;
        document.getElementById("email").value = student.email;
        document.getElementById("contact").value = student.contact;

        // Remove from table and localStorage
        row.remove();
        removeStudentFromStorage(student.studentId);
    });

    deleteBtn.addEventListener("click", () => {
        if (confirm("are you sure you want to delete this record?")) {
            row.remove();
            removeStudentFromStorage(student.studentId);
        }
    });
}

// Remove student from localStorage
function removeStudentFromStorage(id) {
    let students = JSON.parse(localStorage.getItem("students")) || [];
    students = students.filter(s => s.studentId !== id);
    localStorage.setItem("students", JSON.stringify(students));
}

// Update scrollbar visibility dynamically
function updateScroll() {
    const container = document.querySelector(".table-container");
    container.style.overflowY = tableBody.childElementCount > 5 ? "auto" : "hidden";
}
