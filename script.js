document.addEventListener("DOMContentLoaded", function () {
    const brandDropdown = document.getElementById("brand");
    const modelDropdown = document.getElementById("model");
    const yearDropdown = document.getElementById("year");
    const downloadButton = document.getElementById("downloadButton");
    const updateOptionsButton = document.getElementById("updateOptionsButton");

    // Function to construct and open the download URL
    function openDownloadLink(downloadURL) {
        // Open the URL in a new tab or window
        window.open(downloadURL, "_blank");
    }

    // Function to populate dropdown options
    function populateDropdown(dropdown, options) {
        // Clear existing options
        dropdown.innerHTML = "<option value=''>Select</option>";

        // Populate dropdown with options
        options.forEach(option => {
            const optionElement = document.createElement("option");
            optionElement.value = option;
            optionElement.textContent = option;
            dropdown.appendChild(optionElement);
        });
    }

    // Function to load custom options from JSON
    function loadCustomOptions() {
        fetch('custom-options.json')
            .then(response => response.json())
            .then(data => {
                // Populate the brand dropdown
                populateDropdown(brandDropdown, data.brands.map(brand => brand.name));
                console.log("Loaded data:", data);

                // Event listener for brand selection
                brandDropdown.addEventListener("change", function () {
                    const selectedBrand = data.brands.find(brand => brand.name === brandDropdown.value);

                    if (selectedBrand) {
                        // Populate the model dropdown based on the selected brand
                        populateDropdown(modelDropdown, selectedBrand.models.map(model => model.name));
                    }
                });

                // Event listener for model selection
                modelDropdown.addEventListener("change", function () {
                    const selectedBrand = data.brands.find(brand => brand.name === brandDropdown.value);
                    const selectedModel = selectedBrand.models.find(model => model.name === modelDropdown.value);

                    if (selectedModel) {
                        // Populate the year dropdown based on the selected model
                        populateDropdown(yearDropdown, selectedModel.years.map(year => year.year));
                    }
                });

                // Event listener for button click
                downloadButton.addEventListener("click", function () {
                    const selectedBrand = data.brands.find(brand => brand.name === brandDropdown.value);
                    const selectedModel = selectedBrand.models.find(model => model.name === modelDropdown.value);
                    const selectedYear = yearDropdown.value;

                    if (selectedBrand && selectedModel && selectedYear) {
                        const selectedYearData = selectedModel.years.find(yearData => yearData.year == selectedYear);

                        if (selectedYearData) {
                            // Call the function to open the download link
                            openDownloadLink(selectedYearData.downloadURL);
                        } else {
                            console.error('Invalid year selection.');
                        }
                    } else {
                        console.error('Invalid selection.');
                    }
                });

                // Event listener for update options button click
                updateOptionsButton.addEventListener("click", function () {
                    // Re-load custom options on button click
                    loadCustomOptions();
                });
            })
            .catch(error => console.error('Error loading custom options:', error));
    }

    // Load custom options on page load
    loadCustomOptions();
});
