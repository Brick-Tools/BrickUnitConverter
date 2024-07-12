// Variables for default settings
var defaultUnitsInPrimary = "millimeters";
var defaultUnitsInSecondary = "inches";
var defaultUnitsOutPrimary = "studs";
var defaultUnitsOutSecondary = "stackedPlates";
var defaultDecimialPlaces = 2;
var defaultScalingFactor = 1;
var defaultScalingOperation = "divide";

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
  return units[unitIn];
}

function getConversionFactor(unit) {
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
  return conversionFactors[unit];
}

function unitConversion(element) {
  const container = element.closest('.container');
  inputUnitInput1   = container.querySelector('.inputUnitsPrimary');
  inputUnitInput2   = container.querySelector('.inputUnitsSecondary');
  inputValueInput1  = container.querySelector('.inputValuePrimary');
  inputValueInput2  = container.querySelector('.inputValueSecondary');
  outputUnit1Select = container.querySelector('.outputUnitsPrimary');
  outputValue1Input = container.querySelector('.outputValuePrimary');
  outputUnit2Select = container.querySelector('.outputUnitsSecondary');
  outputValue2Input = container.querySelector('.outputValueSecondary');
  
  inputUnit1   = inputUnitInput1.value;
  inputUnit2   = inputUnitInput2.value;

  inputValue1 = inputValueInput1.value;
  inputValue2 = inputValueInput2.value;
  
  outputUnit1 = outputUnit1Select.value;
  outputUnit2 = outputUnit2Select.value;

  outputValue1 = outputValue1Input.value;
  outputValue2 = outputValue2Input.value;

  decimalPlacess = document.getElementById("defaultDecimialPlaces").value;
  if( decimalPlacess < 0 ) { 
    document.getElementById("defaultDecimialPlaces").value = 0;
    decimalPlacess = 0;
  }
  
  scaler = document.getElementById("defaultScalingFactor").value;
  if (document.getElementById("defaultScalingOperation").value == "divide") {
    scaler = 1 / scaler;
  }

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

  inputValue = (inputValue1 * conversionFactors[inputUnit1]) + (inputValue2 * conversionFactors[inputUnit2])

  outputValue1 = scaler * inputValue / conversionFactors[outputUnit1];
  outputValue1 = outputValue1.toFixed(decimalPlacess);
  
  outputValue2 = (outputValue1-Math.trunc(outputValue1)) * conversionFactors[outputUnit1] / conversionFactors[outputUnit2];
  outputValue2 = outputValue2.toFixed(decimalPlacess);

  outputValue1Input.value = outputValue1;
  outputValue2Input.value = outputValue2;
}

function updateAllConversions() {
  var inputElements = document.querySelectorAll('.inputValuePrimary');

  // Iterate over each input element
  inputElements.forEach(function(inputElement) {
    // Call unitConversion () for each input element
    unitConversion(inputElement);
  });

}

// Function to duplicate the main container
function duplicateContainer() {
  numConverters++;
  const containerWrapper = document.getElementById('containerWrapper');
  const lastContainer = containerWrapper.lastElementChild;

  // Clone the last container
  const duplicate = lastContainer.cloneNode(true);

  // update IDs
  duplicate.querySelectorAll('select, input').forEach(input => {
    if(input.className == 'conversionLabel') {
      input.value = 'Conversion ' + String(numConverters)
    }
    else {
      // Attach event listener to each numeric input
      input.addEventListener('input', function() { unitConversion(this); } );
    }
    
    input.id = input.id.slice(0,-1) + String(numConverters);
  });
    
  shiftScrollInput(duplicate);
  shiftScrollSelect(duplicate);

  duplicate.querySelectorAll('label').forEach(input=> {
    input.htmlFor = input.htmlFor.slice(0,-1) + String(numConverters);
  });

  // Append the clone to the container wrapper
  inputField = duplicate.querySelector(".inputValue");

  duplicate.querySelector('.inputValuePrimary').value   = 0;
  duplicate.querySelector('.inputValueSecondary').value = 0;
  
  duplicate.querySelector('.inputUnitsPrimary').value   = defaultUnitsInPrimary;
  duplicate.querySelector('.inputUnitsSecondary').value = defaultUnitsInSecondary;

  duplicate.querySelector('.outputUnitsPrimary').value   = defaultUnitsOutPrimary;
  duplicate.querySelector('.outputUnitsSecondary').value = defaultUnitsOutSecondary;

  
  containerWrapper.appendChild(duplicate);

  // Calculate the position of the button
  const button = document.getElementById('newConverter');
  const buttonTop = lastContainer.offsetTop + lastContainer.offsetHeight + 10; // Adjust 10px spacing

  // Set the top position of the button
  button.style.top = buttonTop + 'px';

  updateAllConversions()
}


//////// URL DATA \\\\\\\\
// Function to update URL parameters
function updateURLParams() {
  defaultUnitsInPrimary    = document.getElementById('defaultUnitsInPrimary').value;
  defaultUnitsInSecondary  = document.getElementById('defaultUnitsInSecondary').value;
  defaultUnitsOutPrimary   = document.getElementById('defaultUnitsOutPrimary').value;
  defaultUnitsOutSecondary = document.getElementById('defaultUnitsOutSecondary').value;
  defaultDecimialPlaces    = document.getElementById('defaultDecimialPlaces').value;
  defaultScalingFactor     = document.getElementById('defaultScalingFactor').value;
  defaultScalingOperation  = document.getElementById('defaultScalingOperation').value;

  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('defaultUnitsInPrimary',    defaultUnitsInPrimary);
  urlParams.set('defaultUnitsInSecondary',  defaultUnitsInSecondary);
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
}

// Function to parse URL parameters and set initial values
function parseURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  document.getElementById('defaultUnitsInPrimary').value = urlParams.get('defaultUnitsInPrimary') || defaultUnitsInPrimary;
  document.getElementById('defaultUnitsInSecondary').value = urlParams.get('defaultUnitsInSecondary') || defaultUnitsInSecondary;
  document.getElementById('defaultUnitsOutPrimary').value = urlParams.get('defaultUnitsOutPrimary') || defaultUnitsOutPrimary;
  document.getElementById('defaultUnitsOutSecondary').value = urlParams.get('defaultUnitsOutSecondary') || defaultUnitsOutSecondary;
  document.getElementById('defaultDecimialPlaces').value = urlParams.get('defaultDecimialPlaces') || defaultDecimialPlaces;
  document.getElementById('defaultScalingFactor').value = urlParams.get('defaultScalingFactor') || defaultScalingFactor;
  document.getElementById('defaultScalingOperation').value = urlParams.get('defaultScalingOperation') || defaultScalingOperation;
  updateURLParams()
}

// Add event listeners for input change events
document.querySelectorAll('.header select, .header input[type="number"], .overlaySettings select, .overlaySettings input[type="number"]').forEach(input => {
  input.addEventListener('input', updateURLParams);
});

// add shift scroll
function shiftScrollInput(element) {
  const numericInputs = element.querySelectorAll('input[type="number"]');
    numericInputs.forEach(input => {
      input.addEventListener('wheel', function(event) {
        if (event.shiftKey) {
          event.preventDefault(); // Prevent default scrolling behavior
          const step = 1; // Set the step value for scrolling
          if (event.deltaY > 0) {
            if(parseInt(this.value) - step >= this.min || this.min == "") {
              this.value = parseInt(this.value) - step; // Decrease value on scrolling down
            }
          } else {
            if(parseInt(this.value) + step <= this.max || this.max == "") {
              this.value = parseInt(this.value) + step; // Increase value on scrolling up
            }
          }
          updateAllConversions()
          
          var inputEvent = new Event('input');
          this.dispatchEvent(inputEvent)
        }
      });
    });
}
function shiftScrollSelect(element) {
  const selectInputs = element.querySelectorAll('select');
  selectInputs.forEach(input => {
    input.addEventListener('wheel', function(event) {
      if (event.shiftKey) {
        index = this.selectedIndex;
        length = this.length;
        if (event.deltaY > 0) {
          this.selectedIndex = Math.min((index+1)%length);
        } else {
          this.selectedIndex = Math.max((((index-1)%length)+length)%length);
        }
        updateAllConversions();
        updateURLParams();

        var inputEvent = new Event('input');
        this.dispatchEvent(inputEvent)
      }
    });
  });
}

// Parse URL parameters when the page loads
window.addEventListener('DOMContentLoaded', function() {
  parseURLParams()
  
  document.getElementById('inputUnitsPrimary1').value = defaultUnitsInPrimary;
  document.getElementById('inputUnitsSecondary1').value = defaultUnitsInSecondary;
  document.getElementById('outputUnitsPrimary1').value = defaultUnitsOutPrimary;
  document.getElementById('outputUnitsSecondary1').value = defaultUnitsOutSecondary;
  updateAllConversions();
  
  // Add event listeners to trigger conversion whenever input changes
  document.getElementById("inputValuePrimary1"     ).addEventListener("input", function() { unitConversion(this); });
  document.getElementById("inputValueSecondary1"   ).addEventListener("input", function() { unitConversion(this); });
  document.getElementById("inputUnitsPrimary1"     ).addEventListener("input", function() { unitConversion(this); });
  document.getElementById("inputUnitsSecondary1"   ).addEventListener("input", function() { unitConversion(this); });
  document.getElementById("outputUnitsPrimary1"    ).addEventListener("input", function() { unitConversion(this); });
  document.getElementById("outputUnitsSecondary1"  ).addEventListener("input", function() { unitConversion(this); });
  document.getElementById("defaultDecimialPlaces"  ).addEventListener("input",  updateAllConversions);
  document.getElementById("defaultDecimialPlaces"  ).addEventListener("input",  calcScale);
  document.getElementById("defaultScalingFactor"   ).addEventListener("input",  updateAllConversions);
  document.getElementById("defaultScalingOperation").addEventListener("input",  updateAllConversions);
      
      
  // Attach event listener to each input
  shiftScrollInput(document);
  shiftScrollSelect(document);


  calcScale();
  // document.body.classList.add("active-overlayScales");
  // document.body.classList.add("active-blur");
});

// toggle sidebar nav
sideNavView = false;
function toggleNav() {
  nav = document.getElementById("sideNav")
  if(sideNavView) {
    nav.style.width = "0px";
    sideNavView = false;
  }
  else {
    nav.style.width = "260px";
    sideNavView = true;
  }
}

// toggle sidebar nav
document.addEventListener('click', function(event) {
  var sidebar = document.getElementById('sideNav');
  var head    = document.getElementById('head');
  body = document.querySelector(".active-blur")
  // console.log(event.target.contains(document.querySelector(".active-blur")));
  // console.log(event.target);

  // Check if the click is outside the sidebar
  if (!sidebar.contains(event.target) && !head.contains(event.target)) {    
    sidebar.style.width = "0px";
    sideNavView = false;
  }

  // close any overlays
  if (event.target.contains(body)) { closeOverlays() }});

function closeOverlays() {
    document.body.classList.remove("active-blur");
    document.body.classList.remove("active-overlayScaleCalc");
    document.body.classList.remove("active-overlaySettings");
    document.body.classList.remove("active-overlayInfo");
    document.body.classList.remove("active-overlayScales");
  }
// overlays
document.querySelector("#openScaleCalc").addEventListener("click", function(){
  closeOverlays();
  document.body.classList.add("active-overlayScaleCalc");
  document.body.classList.add("active-blur");
  toggleNav()
});
document.querySelector("#openSettings").addEventListener("click", function(){
  closeOverlays();
  document.body.classList.add("active-overlaySettings");
  document.body.classList.add("active-blur");
  toggleNav()
});
document.querySelector("#openInfo").addEventListener("click", function(){
  closeOverlays();
  document.body.classList.add("active-overlayInfo");
  document.body.classList.add("active-blur");
  toggleNav()
});
document.querySelector("#openScales").addEventListener("click", function(){
  closeOverlays();
  document.body.classList.add("active-overlayScales");
  document.body.classList.add("active-blur");
  toggleNav()
});

// calculate scale
function calcScale() {
  numIn   = document.getElementById("unitValueIn").value;
  unitIn  = document.getElementById("unitsIn").value;
  numOut  = document.getElementById("unitValueOut").value;
  unitOut = document.getElementById("unitsOut").value;
  
  factor1 = getConversionFactor(unitIn) * numIn;
  factor2 = getConversionFactor(unitOut) * numOut;
  ratio = factor1 / factor2

  if(ratio > 1) {
    ratioValStr = String(ratio.toFixed(decimalPlacess));
    ratioStr = "1:" + ratioValStr;
    operation = "Divide"
  }
  else {
    ratioValStr = String((1/ratio).toFixed(decimalPlacess))
    ratioStr = ratioValStr + ":1"
    operation = "Multiply"
  }
  document.getElementById("scaleCalculation").setAttribute("scaleDec", ratio);
  document.getElementById("scaleCalculation").value = ratioStr;
  document.getElementById("scaleInstruction").textContent = operation + " by " + ratioValStr;
}

// add event listeners to calc scale inputs
document.querySelectorAll(".calcScale").forEach(element => {
  element.oninput = calcScale
});

// set scale button
document.getElementById("applyScaleBtn").addEventListener("click", function() {
  scale = Number(document.getElementById("scaleCalculation").getAttribute("scaleDec"));
  // console.log(scale);
  
  if(scale > 1) {
    defaultScalingFactor = scale;
    defaultScalingOperation = "divide"
  }
  else {
    defaultScalingFactor = 1 / scale;
    defaultScalingOperation = "multiply"
  }
  
  document.getElementById('defaultScalingFactor').value = defaultScalingFactor;
  document.getElementById('defaultScalingOperation').value = defaultScalingOperation;

  updateURLParams()
  updateAllConversions()
});

// Event listener for the 'beforeunload' event
window.addEventListener('beforeunload', function (e) {
  // Check if any of the input fields are filled
  // if (fname !== '' || lname !== '' || subject !== '') {
      // Cancel the event and show alert that
      // the unsaved changes would be lost
      e.preventDefault();
      e.returnValue = '';
  // }
})
