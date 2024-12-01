import "./style.scss";
import data from "./data.json"; // Import car data

document.addEventListener("DOMContentLoaded", () => {
  const yearSelect = document.getElementById("year-dropdown");
  const makeSelect = document.getElementById("make-dropdown");
  const modelSelect = document.getElementById("model-dropdown");

  const yearContainer = yearSelect.closest(".dropdown-container"); // Parent container for year dropdown
  const makeContainer = makeSelect.closest(".dropdown-container"); // Parent container for make dropdown
  const modelContainer = modelSelect.closest(".dropdown-container"); // Parent container for model dropdown

  // Helper function to get unique values from an array of objects
  function getUniqueValues(arr, key) {
    return [...new Set(arr.map((item) => item[key]))];
  }

  // Helper function to reset dropdown options
  function resetDropdown(selectElement, placeholder = "Select Option") {
    selectElement.innerHTML = ""; // Clear previous options
    const defaultOption = document.createElement("option");
    defaultOption.textContent = placeholder;
    defaultOption.value = ""; // Ensure the default option has a blank value
    selectElement.appendChild(defaultOption);
  }

  // Helper function to disable entire section
  function disableSection(container) {
    container.classList.add("disabled-section"); // Add the disabled class
  }

  // Helper function to enable entire section
  function enableSection(container) {
    container.classList.remove("disabled-section"); // Remove the disabled class
  }

  // Populate Year Dropdown and sort from newest to oldest
  function populateYearDropdown() {
    const uniqueYears = getUniqueValues(data, "year").sort((a, b) => b - a); // Sort years from newest to oldest
    uniqueYears.forEach((year) => {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    });
  }

  // Populate Make Dropdown based on selected Year
  function populateMakeDropdown(selectedYear) {
    resetDropdown(makeSelect, "Select Make");

    const manufacturersForSelectedYear = getUniqueValues(
      data.filter((car) => car.year === parseInt(selectedYear, 10)),
      "Manufacturer"
    );

    if (manufacturersForSelectedYear.length > 0) {
      manufacturersForSelectedYear.forEach((manufacturer) => {
        const option = document.createElement("option");
        option.value = manufacturer;
        option.textContent = manufacturer;
        makeSelect.appendChild(option);
      });
      enableSection(makeContainer); // Enable the make dropdown container
      makeSelect.disabled = false; // Enable the make dropdown
    } else {
      disableSection(makeContainer); // Disable the make dropdown container
      makeSelect.disabled = true; // Disable the make dropdown
    }

    // Reset model selection
    resetDropdown(modelSelect, "Select Model");
    disableSection(modelContainer); // Disable the model dropdown container
    modelSelect.disabled = true; // Disable the model dropdown
  }

  // Populate Model Dropdown based on selected Manufacturer and Year
  function populateModelDropdown(selectedManufacturer, selectedYear) {
    resetDropdown(modelSelect, "Select Model");

    const modelsForSelectedManufacturer = getUniqueValues(
      data.filter(
        (car) =>
          car.Manufacturer === selectedManufacturer &&
          car.year === parseInt(selectedYear, 10)
      ),
      "model"
    );

    if (modelsForSelectedManufacturer.length > 0) {
      modelsForSelectedManufacturer.forEach((model) => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      });
      enableSection(modelContainer); // Enable the model dropdown container
      modelSelect.disabled = false; // Enable the model dropdown
    } else {
      disableSection(modelContainer); // Disable the model dropdown container
      modelSelect.disabled = true; // Disable the model dropdown
    }
  }

  // Event listener for Year dropdown
  yearSelect.addEventListener("change", (e) => {
    const selectedYear = e.target.value;
    if (selectedYear) {
      populateMakeDropdown(selectedYear);
    } else {
      disableSection(makeContainer); // Disable make container
      makeSelect.disabled = true; // Disable make dropdown
      disableSection(modelContainer); // Disable model container
      modelSelect.disabled = true; // Disable model dropdown
    }
  });

  // Event listener for Manufacturer dropdown
  makeSelect.addEventListener("change", (e) => {
    const selectedManufacturer = e.target.value;
    const selectedYear = yearSelect.value;
    if (selectedManufacturer) {
      populateModelDropdown(selectedManufacturer, selectedYear);
    } else {
      disableSection(modelContainer); // Disable model container
      modelSelect.disabled = true; // Disable model dropdown
    }
  });

  // Event listener for Model selection
  modelSelect.addEventListener("change", (e) => {
    const selectedModel = e.target.value;
    const selectedManufacturer = makeSelect.value;
    const selectedYear = yearSelect.value;

    if (selectedModel) {
      const selectedCar = data.find(
        (car) =>
          car.model === selectedModel &&
          car.year === parseInt(selectedYear, 10) &&
          car.Manufacturer === selectedManufacturer
      );
      console.log("Selected Car Data:", selectedCar);
    }
  });

  // Initialize Year dropdown
  populateYearDropdown();
  disableSection(makeContainer); // Initially disable the Manufacturer dropdown container
  makeSelect.disabled = true; // Initially disable the Manufacturer dropdown
  disableSection(modelContainer); // Initially disable the Model dropdown container
  modelSelect.disabled = true; // Initially disable the Model dropdown
});
