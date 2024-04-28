// Variables for default settings
var defaultSystem = "imperial";
var defaultUnitsIn = "inches";
var defaultUnitsOutPrimary = "studs";
var defaultUnitsOutSecondary = "stackedPlates";
var defaultDecimialPlaces = 2;
var defaultScalingFactor = 1;
var defaultScalingOperation = "divide";

// Define a global variables
var isFirstCall = true;
var activeUnit = defaultUnitsIn;
var numConverters = 1;

// function to convert between "code" units and "display" units
function reformatUnit(unitIn) {
  var units = {
    studs: "Studs",
    stackedBricks: "Stacked Bricks",
    stackedPlates: "Stacked Plates",
    inches: "Inches",
    feet: "Feet",
    yards: "Yards",
    miles: "Miles",
    millimeters: "Millimeters",
    centimeters: "Centimeters",
    meters: "Meters",
    kilometers: "Kilometers",
    Studs: "studs",
    "Stacked Bricks": "stackedBricks",
    "Stacked Plates": "stackedPlates",
    Inches: "inches",
    Feet: "feet",
    Yards: "yards",
    Miles: "miles",
    Millimeters: "millimeters",
    Centimeters: "centimeters",
    Meters: "meters",
    Kilometers: "kilometers"
  };
  // (unit.charAt(0).toLowerCase() + unit.slice(1)).replace(/ /g,"")
  return units[unitIn];
}

// Function to generate unit buttons based on the selected system
function generateUnitButtons(element, system, num) {
  // alert("element.id: " + element.id + "\n system: " + system + "\n num: " + num);
  // alert(element.closest('.unit-buttons').innerHTML);
  const unitButtonsContainer = element.closest('.unit-buttons').children[1];

  unitButtonsContainer.innerHTML = ""; // Clear previous buttons

  var units = [];
  if (system === "imperial") {
    units = ["Inches", "Feet", "Miles"];
  } else if (system === "metric") {
    units = ["Millimeters", "Centimeters", "Meters", "Kilometers"];
  } else if (system === "lego") {
    units = ["Studs", "Stacked Bricks", "Stacked Plates"];
  }

  var label = document.createElement("label");
  label.textContent = "Unit";
  label.setAttribute("class", "section-label" );
  // label.setAttribute("for", "unitButtonsContainer");
  unitButtonsContainer.appendChild(label);
  
  units.forEach(function(unit) {
    var button = document.createElement("input");
    var btnLabel = document.createElement("label");
    activeUnit = reformatUnit(unit);
    // alert("unit: " + unit + "\nactiveUnit: " + activeUnit)
    // button.textContent = unit;
    button.setAttribute("type", "radio"); // Set button type to prevent form submission
    button.setAttribute("id", activeUnit + num);
    button.setAttribute("class", "radioUnitsIn");
    button.setAttribute("name", "activeUnit" + num);
    button.setAttribute("value", unit);


    if( activeUnit == element.closest('.unit-buttons').querySelector('.inputValue').dataset.activeUnit ) {
      button.checked = true;
    }

    if( isFirstCall && unit == reformatUnit(defaultUnitsIn) ) {
      button.setAttribute("checked", "checked");
      // document.getElementById("inputValue").placeholder = "Dimension in " + unit;
      // unitButtonsContainer.closest('.unit-buttons').querySelector('.inputValue').placeholder = "Dimension in " + unit; replaced
      unitButtonsContainer.closest('.unit-buttons').querySelector('.input-label').textContent = "Dimension in " + unit;
      isFirstCall = false;
    }

    btnLabel.setAttribute("for", activeUnit + num)
    // btnLabel.setAttribute("class", "label")
    btnLabel.textContent = unit;

    button.addEventListener("click", function() {
      // var inputValue = document.getElementById("inputValue").value;
      // unitButtonsContainer.closest('.unit-buttons').querySelector('.inputValue').placeholder = "Dimension in " + this.value; replaced
      unitButtonsContainer.closest('.unit-buttons').querySelector('.input-label').textContent = "Dimension in " + this.value;
      
      // document.getElementById("inputValue").placeholder = "Dimension in " + this.value;
      unitConversion(this);
    });
    // unitButtonsContainer.appendChild(button);
    // unitButtonsContainer.appendChild(btnLabel);
    unitButtonsContainer.appendChild(button);
    unitButtonsContainer.appendChild(btnLabel);
  });
}

function unitConversion(element) {
  // alert("unitConversion()");
  const container = element.closest('.container');
  inputUnitInput   = container.querySelector('.radioUnitsIn:checked')
  inputValueInput  = container.querySelector('.inputValue')
  outputUnit1Select = container.querySelector('.unitsOutPrimary')
  outputValue1Input = container.querySelector('.outPrimary')
  outputUnit2Select = container.querySelector('.unitsOutSecondary')
  outputValue2Input = container.querySelector('.outSecondary')

  // inputUnit = inputUnitInput.id;
  if( inputUnitInput != null ) {
    inputUnit = inputUnitInput.id.slice(0, -1);
    inputValueInput.setAttribute("data-active-unit", inputUnitInput.id.slice(0, -1));
  }
  else {
    inputUnit = inputValueInput.dataset.activeUnit;
  }

  inputValue = inputValueInput.value;
  outputUnit1 = outputUnit1Select.value;
  outputUnit2 = outputUnit2Select.value;

  outputValue1 = outputValue1Input.value;
  outputValue2 = outputValue2Input.value;

  decimalPlacess = document.getElementById("defaultDecimialPlaces").value;
  scaler         = document.getElementById("defaultScalingFactor").value;
  if (document.getElementById("defaultScalingOperation").value == "divide") {
    scaler = 1 / scaler;
  }
  // alert(inputUnit + " " + inputValue + " " + outputUnit1 + " " + outputValue1 + " " + outputUnit2 + " " + outputValue2)

  var conversionFactors = {
    studs: 0.008,
    stackedBricks: 0.0096,
    stackedPlates: 0.0032,
    inches: 0.0254,
    feet: 0.3048,
    yards: 0.9144,
    miles: 1609.344,
    millimeters: 0.001,
    centimeters: .01,
    meters: 1,
    kilometers: 1000
  };

  var conversionUnit = {
    studs:" s",
    stackedBricks:"sb",
    stackedPlates:"sp",
    inches: "in",
    feet: "ft",
    yards: "yd",
    miles: "mi",
    millimeters: "mm",
    centimeters: "cm",
    meters: " m",
    kilometers: "km"
  };

  outputValue1 = scaler * inputValue * conversionFactors[inputUnit] / conversionFactors[outputUnit1];
  outputValue2 = scaler * (outputValue1-Math.trunc(outputValue1)) * conversionFactors[outputUnit1] / conversionFactors[outputUnit2];

  outputValue1 = outputValue1.toFixed(decimalPlacess);
  outputValue2 = outputValue2.toFixed(decimalPlacess);

  outputValue1Input.value = outputValue1 + " " + conversionUnit[outputUnit1];
  outputValue2Input.value = outputValue2 + " " + conversionUnit[outputUnit2];
  // alert(outputValue1 + " " + outputValue2)
}

function updateAllConversions() {
  // alert("updateAllConversions()");
  // Select all input elements with class "inputValue"
  var inputElements = document.querySelectorAll('.inputValue');

  // Iterate over each input element
  inputElements.forEach(function(inputElement) {
    // Call unitConversion() for each input element
    unitConversion(inputElement);
  });

}

// Function to duplicate the main container
function duplicateContainer() {
  numConverters++;
  // alert(numConverters)
  const containerWrapper = document.getElementById('containerWrapper');
  const lastContainer = containerWrapper.lastElementChild;

  // Clone the last container
  const duplicate = lastContainer.cloneNode(true);


  // i = 0;
  // Add event listeners for input fields in the duplicated container
  duplicate.querySelectorAll('select, input, label').forEach(input => {
    // alert(i + ", " + input.id)
    // i = i + 1;

    if( input.name != null ) {
      // alert("!" + input.name + ", " + input.id)
      input.setAttribute("name", input.name.slice(0,-1) + numConverters);
      // alert("done")
      // n = input
    }

    // system buttons
    if( input.id != null && input.id != "" ) {
      // alert("!! " + input.id + "\n" + input.id.slice(0,-1) + numConverters)
      input.setAttribute("id", input.id.slice(0,-1) + numConverters);
      // alert("done")
      btn = input

      if( input.id.includes("imperial") || input.id.includes("metric") || input.id.includes("lego") ) {
        input.addEventListener("click", function() {
            generateUnitButtons(this, input.id.slice(0,-1), input.id.slice(-1));
            // alert("?" + "btn: " + btn.id + ", inputHTML: " + input.htmlFor)
          });
        
        if( input.id.includes(defaultSystem) ) {
          input.checked = true;
        }
        else {
          input.checked = false;
        }
        
      }
    }

    // labels
    if( input.htmlFor != null ) {
      // alert("!" + input.htmlFor + ", " + typeof(input.htmlFor))
      input.setAttribute("for", input.htmlFor.slice(0,-1) + numConverters);
    }    

    input.addEventListener('input', function() {
      unitConversion(this)
    } );
  });


  // Append the clone to the container wrapper
  inputField = duplicate.querySelector(".inputValue")
  
  inputField.setAttribute("data-active-unit", defaultUnitsIn);
  // inputField.setAttribute("placeholder", "Dimension in " + reformatUnit(defaultUnitsIn));
  duplicate.querySelector('.input-label').textContent = "Dimension in " + reformatUnit(defaultUnitsIn);
  duplicate.querySelector('.unitsOutPrimary').value = defaultUnitsOutPrimary
  duplicate.querySelector('.unitsOutSecondary').value = defaultUnitsOutSecondary
  
  containerWrapper.appendChild(duplicate);
  generateUnitButtons(inputField, defaultSystem, numConverters);
  unitConversion(inputField)


  // Calculate the position of the button
  const button = document.getElementById('newConverter');
  const buttonTop = lastContainer.offsetTop + lastContainer.offsetHeight + 10; // Adjust 10px spacing

  // Set the top position of the button
  button.style.top = buttonTop + 'px';
}





//////// URL DATA \\\\\\\\
// Function to update URL parameters
function updateURLParams() {
  defaultUnitsIn           = document.getElementById('defaultUnitsIn').value;
  defaultUnitsOutPrimary   = document.getElementById('defaultUnitsOutPrimary').value;
  defaultUnitsOutSecondary = document.getElementById('defaultUnitsOutSecondary').value;
  defaultDecimialPlaces    = document.getElementById('defaultDecimialPlaces').value;
  defaultScalingFactor     = document.getElementById('defaultScalingFactor').value;
  defaultScalingOperation  = document.getElementById('defaultScalingOperation').value;

  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('defaultUnitsIn',           defaultUnitsIn);
  urlParams.set('defaultUnitsOutPrimary',   defaultUnitsOutPrimary);
  urlParams.set('defaultUnitsOutSecondary', defaultUnitsOutSecondary);
  urlParams.set('defaultDecimialPlaces',    defaultDecimialPlaces);
  urlParams.set('defaultScalingFactor',     defaultScalingFactor);
  urlParams.set('defaultScalingOperation',  defaultScalingOperation);

  history.replaceState(null, '', '?' + urlParams.toString());

  const unitToSystem = {
    inches: "imperial",
    feet: "imperial",
    yards: "imperial",
    miles: "imperial",
    millimeters: "metric",
    centimeters: "metric",
    meters: "metric",
    kilometers: "metric",
    studs: "lego",
    stackedPlates: "lego",
    stackedBricks: "lego"
  };

  // Set defaultSystem based on the selected unit type
  defaultSystem = unitToSystem[defaultUnitsIn] || "imperial";
}

// Function to parse URL parameters and set initial values
function parseURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  document.getElementById('defaultUnitsIn').value = urlParams.get('defaultUnitsIn') || 'inches';
  document.getElementById('defaultUnitsOutPrimary').value = urlParams.get('defaultUnitsOutPrimary') || 'studs';
  document.getElementById('defaultUnitsOutSecondary').value = urlParams.get('defaultUnitsOutSecondary') || 'stackedPlates';
  document.getElementById('defaultDecimialPlaces').value = urlParams.get('defaultDecimialPlaces') || '2';
  document.getElementById('defaultScalingFactor').value = urlParams.get('defaultScalingFactor') || '1';
  document.getElementById('defaultScalingOperation').value = urlParams.get('defaultScalingOperation') || 'divide';
  updateURLParams()
}

// Add event listeners for input change events
document.querySelectorAll('.header select, .header input[type="number"]').forEach(input => {
  input.addEventListener('change', updateURLParams);
});

// Parse URL parameters when the page loads
window.addEventListener('DOMContentLoaded', function() {
  parseURLParams()
  document.getElementById("inputValue").setAttribute("data-active-unit", defaultUnitsIn);
  // Perform initial generation of unit buttons based on the initial selection
  generateUnitButtons(document.getElementById(defaultSystem + "1"), defaultSystem, document.getElementById("imperial1").id.slice(-1));

  if( defaultSystem == "imperial" ) { document.getElementById("imperial1").checked = true; }
  if( defaultSystem == "metric"   ) { document.getElementById("metric1"  ).checked = true; }
  if( defaultSystem == "lego"     ) { document.getElementById("lego1"    ).checked = true; }

  document.getElementById('unitsOutput1').value = defaultUnitsOutPrimary;
  document.getElementById('unitsOutput2').value = defaultUnitsOutSecondary;
  updateAllConversions();

  // Add event listeners to trigger conversion whenever input changes
  document.getElementById("inputValue"  ).addEventListener("input",  function() { unitConversion(this); });
  document.getElementById("unitsOutput1").addEventListener("change", function() { unitConversion(this); });
  document.getElementById("unitsOutput2").addEventListener("change", function() { unitConversion(this); });
  document.getElementById("defaultDecimialPlaces"  ).addEventListener("input",  updateAllConversions);
  document.getElementById("defaultScalingFactor"   ).addEventListener("input",  updateAllConversions);
  document.getElementById("defaultScalingOperation").addEventListener("change", updateAllConversions);

  // listeners for changing unit systems
  // Event listener for Imperial button
  document.getElementById("imperial1").addEventListener("click", function() {
    generateUnitButtons(this, "imperial", this.id.slice(-1));
  });

  // Event listener for Metric button
  document.getElementById("metric1").addEventListener("click", function() {
    generateUnitButtons(this, "metric", this.id.slice(-1));
  });

  // Event listener for LEGO button
  document.getElementById("lego1").addEventListener("click", function() {
    generateUnitButtons(this, "lego", this.id.slice(-1));
  });
  
  // Perform initial conversion when the page loads
  // unitConversion(document.getElementById("inputValue"));
  // document.querySelector('.radio:checked')
  
  // alert(document.getElementById("imperial1") + "\n" + defaultSystem + "\n" + document.getElementById("imperial1").id.slice(-1))
});
