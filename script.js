document.getElementById("salaryForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Collect form data
    const employeeName = document.getElementById("employeeName").value;
    const employeeSalary = document.getElementById("employeeSalary").value;
    const yearsExperience = document.getElementById("yearsExperience").value;
    const jobDesignation = document.getElementById("jobDesignation").value;

    // Send the data to the backend
    const response = await fetch("http://localhost:3000/api/salaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: employeeName, salary: employeeSalary, experience: yearsExperience, designation: jobDesignation })
    });

    const result = await response.json();
    if (result.success) {
        alert("Salary added successfully!");
        loadSalaries();
    } else {
        alert("Failed to add salary.");
    }

    document.getElementById("salaryForm").reset();
});

// Function to load salaries from the backend
async function loadSalaries() {
    const response = await fetch("http://localhost:3000/api/salaries");
    const salaries = await response.json();

    const salaryList = document.getElementById("salaryList");
    salaryList.innerHTML = "";

    salaries.forEach(salary => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item d-flex justify-content-between align-items-center ";
        listItem.textContent = `${salary.name} - ${salary.designation} - ${salary.experience} years - $${salary.salary}`;

        const deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-danger btn-sm";
        deleteButton.textContent = "Delete";
        deleteButton.onclick = async () => {
            const deleteResponse = await fetch(`http://localhost:3000/api/salaries/${salary._id}`, { method: "DELETE" });
            const deleteResult = await deleteResponse.json();
            if (deleteResult.success) {
                alert("Salary deleted successfully!");
                loadSalaries();
            } else {
                alert("Failed to delete salary.");
            }
        };

        listItem.appendChild(deleteButton);
        salaryList.appendChild(listItem);
    });
}

// Load salaries when the page loads
loadSalaries();
document.getElementById("downloadBtn").addEventListener("click", async () => {
    const response = await fetch("http://localhost:3000/api/salaries");
    const salaries = await response.json();

    if (salaries.length > 0) {
        const csvData = convertToCSV(salaries);
        downloadCSV(csvData, "employee_salary_list.csv");
    } else {
        alert("No data available to download.");
    }
});

// Function to convert salary data to CSV format
function convertToCSV(data) {
    const header = ["Name", "Salary", "Experience", "Designation"];
    const rows = data.map(item => [
        item.name,
        item.salary,
        item.experience,
        item.designation
    ]);

    const csvContent = [header, ...rows].map(row => row.join(",")).join("\n");
    return csvContent;
}

// Function to trigger CSV file download
function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}