// Variables for default settings
var defaultSystem = "imperial";
var defaultUnits = "inches";
var scaler = 1;

// Define a global variable to store the active unit
var activeUnit = defaultUnits;

// Function to generate unit buttons based on the selected system
function generateUnitButtons(system) {
    var unitButtonsContainer = document.getElementById("unitButtonsContainer");
    unitButtonsContainer.innerHTML = ""; // Clear previous buttons

    var units = [];
    if (system === "imperial") {
        units = ["Inches", "Feet", "Miles"];
    } else if (system === "metric") {
        units = ["Millimeters", "Centimeters", "Meters", "Kilometers"];
    } else if (system === "lego") {
        units = ["Studs", "Stacked Bricks", "Stacked Plates"];
    }

    units.forEach(function(unit) {
        var button = document.createElement("button");
        button.textContent = unit;
        button.setAttribute("type", "button"); // Set button type to prevent form submission
        button.addEventListener("click", function() {
            activeUnit = (unit.charAt(0).toLowerCase() + unit.slice(1)).replace(/ /g,"");
            // var inputValue = document.getElementById("inputValue").value;
            document.getElementById("inputValue").placeholder = "Dimension in " + this.textContent;
            convertUnits(); // Perform conversion immediately after setting the input value

            // Remove 'active' class from all buttons
            var allButtons = document.querySelectorAll("#unitButtonsContainer button");
            allButtons.forEach(function(btn) {
                btn.classList.remove("active");
            });
            // Add 'active' class to the clicked button
            this.classList.add("active");
        });
        unitButtonsContainer.appendChild(button);
    });
}
// Perform initial generation of unit buttons based on the initial selection
generateUnitButtons(defaultSystem);

// Event listener for Imperial button
document.getElementById("imperialButton").addEventListener("click", function() {
  generateUnitButtons("imperial");
  
  this.classList.add("active");
  document.getElementById("metricButton").classList.remove("active");
  document.getElementById("legoButton").classList.remove("active");
});

// Event listener for Metric button
document.getElementById("metricButton").addEventListener("click", function() {
  generateUnitButtons("metric");

  this.classList.add("active");
  document.getElementById("imperialButton").classList.remove("active");
  document.getElementById("legoButton").classList.remove("active");
});

// Event listener for LEGO button
document.getElementById("legoButton").addEventListener("click", function() {
  generateUnitButtons("lego");

  this.classList.add("active");
  document.getElementById("imperialButton").classList.remove("active");
  document.getElementById("metricButton").classList.remove("active");
});




// Function to perform conversion
function convertUnits() {
  // Get input value and units
  var inputValue = parseFloat(document.getElementById("inputValue").value);
  decimalPlacess = document.getElementById("decimalPlaces").value;
  if (isNaN(inputValue)) {
    // If input value is empty or not a number, set conversion results to blank
    document.getElementById("conversion1").value = (0).toFixed(decimalPlacess);
    document.getElementById("conversion2").value = (0).toFixed(decimalPlacess);
    return;
  }
  var inputValue = parseFloat(document.getElementById("inputValue").value);
  var inputUnits = activeUnit;

  // Get output units
  var outputUnits1 = document.getElementById("unitsOutput1").value;
  var outputUnits2 = document.getElementById("unitsOutput2").value;
  var scaler       = document.getElementById("scalingFactor").value;
  if (document.getElementById("scalingOperation").value == "divide") {
    scaler = 1 / scaler;
  }

  // Define conversion factors
  var conversionFactors = {
    studs: 8,
    stackedBricks: 9.6,
    stackedPlates: 3.2,
    inches: 25.4,
    feet: 304.8,
    miles: 1609344,
    millimeters: 1,
    centimeters: 10,
    meters: 1000,
    kilometers: 1000000
  };

  // Perform conversion
  var conversion1 = scaler * inputValue * conversionFactors[inputUnits] / conversionFactors[outputUnits1];
  var conversion2 = (conversion1-Math.trunc(conversion1)) * conversionFactors[outputUnits1] / conversionFactors[outputUnits2];
    // alert("1: " + conversion1 + "\n" + "2: " + conversion2);

    // Update conversion fields
    document.getElementById("conversion1").value = conversion1.toFixed(decimalPlacess);
    document.getElementById("conversion2").value = conversion2.toFixed(decimalPlacess);
}

function convert(valueIn, unitsIn, unitsOut) {
  // Define conversion factors
  var conversionFactors = {
    studs: 8,
    stackedBricks: 9.6,
    stackedPlates: 3.2,
    inches: 25.4,
    feet: 304.8,
    miles: 1609344,
    millimeters: 1,
    centimeters: 10,
    meters: 1000,
    kilometers: 1000000
  };

  valueOut = scaler * valueIn * conversionFactors[unitsIn] / conversionFactors[unitsOut];
  return valueOut;
}

// Add event listeners to trigger conversion whenever input changes
document.getElementById("inputValue"      ).addEventListener("input",  convertUnits);
document.getElementById("unitsOutput1"    ).addEventListener("change", convertUnits);
document.getElementById("unitsOutput2"    ).addEventListener("change", convertUnits);
document.getElementById("decimalPlaces"   ).addEventListener("input",  convertUnits);
document.getElementById("scalingFactor"   ).addEventListener("input",  convertUnits);
document.getElementById("scalingOperation").addEventListener("change", convertUnits);

// Perform initial conversion when the page loads
convertUnits();







// Function to duplicate the main container
function duplicateContainer() {
  const containerWrapper = document.getElementById('containerWrapper');
  const lastContainer = containerWrapper.lastElementChild;

  // Clone the last container
  const duplicate = lastContainer.cloneNode(true);

  // Append the clone to the container wrapper
  containerWrapper.appendChild(duplicate);

  // Add event listeners for input fields in the duplicated container
  duplicate.querySelectorAll('select, input[type="number"]').forEach(input => {
      input.addEventListener('change', function() {
        // Get the container of the changed input field
        const container = this.closest('.container');

        // Get the input value from the changed input field
        const inputValue = parseFloat(this.value);
        const unitsIn = container.querySelector('.unitsIn').value;
        const unitsOutPrimary = container.querySelector('.unitsOutPrimary').value;
        const unitsOutSecondary = container.querySelector('.unitsOutSecondary').value;
        alert(unitsIn)

        // Perform the conversion within the container
        value1 = convert(inputValue, unitsIn, unitsOutPrimary);
        value2 = convert((value1-Math.trunc(value1)), unitsOutPrimary, unitsOutSecondary);
        const conversion1 = inputValue * 2.54; // Example conversion: inches to centimeters
        const conversion2 = conversion1 / 10;  // Convert centimeters to millimeters

        // Update the output fields within the container

        // Call the function with your container element
        // const containerr = document.getElementById('yourContainerId');
        // logContainerElements(container);
      
        container.querySelector('.outPrimary').value = conversion1.toFixed(2);
        container.querySelector('.outSecondary').value = conversion2.toFixed(2);
      });
  });

  // Calculate the position of the button
  const button = document.getElementById('newConverter');
  const buttonTop = lastContainer.offsetTop + lastContainer.offsetHeight + 10; // Adjust 10px spacing

  // Set the top position of the button
  button.style.top = buttonTop + 'px';
}



// Add event listener for the duplicate container button
document.getElementById('newConverter').addEventListener('click', duplicateContainer);




// Function to update URL parameters
function updateURLParams() {
    console.log('Input value changed');
    const inputValue = this.value; // Log the value of the input field
    console.log('Input value:', inputValue);

    // Your conversion logic
    // ...
}











// Function to update URL parameters
function updateURLParams() {
  const defaultUnitsIn = document.getElementById('defaultUnitsIn').value;
  const defaultUnitsPrimaryOut = document.getElementById('defaultUnitsPrimaryOut').value;
  const defaultUnitsSecondaryOut = document.getElementById('defaultUnitsSecondaryOut').value;
  const decimalPlaces = document.getElementById('decimalPlaces').value;
  const scalingFactor = document.getElementById('scalingFactor').value;
  const scalingOperation = document.getElementById('scalingOperation').value;

  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('defaultUnitsIn', defaultUnitsIn);
  urlParams.set('defaultUnitsPrimaryOut', defaultUnitsPrimaryOut);
  urlParams.set('defaultUnitsSecondaryOut', defaultUnitsSecondaryOut);
  urlParams.set('decimalPlaces', decimalPlaces);
  urlParams.set('scalingFactor', scalingFactor);
  urlParams.set('scalingOperation', scalingOperation);

  history.replaceState(null, '', '?' + urlParams.toString());
}

// Function to parse URL parameters and set initial values
function parseURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  document.getElementById('defaultUnitsIn').value = urlParams.get('defaultUnitsIn') || 'inches';
  document.getElementById('defaultUnitsPrimaryOut').value = urlParams.get('defaultUnitsPrimaryOut') || 'studs';
  document.getElementById('defaultUnitsSecondaryOut').value = urlParams.get('defaultUnitsSecondaryOut') || 'stackedPlates';
  document.getElementById('decimalPlaces').value = urlParams.get('decimalPlaces') || '2';
  document.getElementById('scalingFactor').value = urlParams.get('scalingFactor') || '1';
  document.getElementById('scalingOperation').value = urlParams.get('scalingOperation') || 'divide';
}

// Add event listeners for input change events
document.querySelectorAll('.header select, .header input[type="number"]').forEach(input => {
  input.addEventListener('change', updateURLParams);
});

// Parse URL parameters when the page loads
window.addEventListener('DOMContentLoaded', parseURLParams);
