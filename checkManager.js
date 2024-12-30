document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#percentageForm');
    const generateButton = document.querySelector('#Generate');
    const addButton = document.querySelector('#Add'); // Ensure there's an "Add" button in your HTML
    let downPaymentOutput = document.querySelector('#downPaymentOutput')
    let customOutput = document.querySelector('#customOutput');
    let percentageOutput = document.querySelector('#percentageOutput');

    const resultHTML = document.querySelector('.result-holder');

    form.addEventListener('change', (e) => {
        const value = e.target.value;
        
        if(e.target.name === 'select'){
            downPaymentOutput.innerHTML = '';
            customOutput.innerHTML = '';
            percentageOutput.innerHTML = '';
            resetResults(); // Clear any displayed results

            if(value === 'down-payment'){
                downPaymentOutput.innerHTML = financialOptions(value);
                inputRestrictions();
                
                // Hide the Generate button and show the Add button
                generateButton.style.display = 'none';
                addButton.style.display = 'inline-block'; // Show the "Add" button
            } else if(value === 'custom'){
                customOutput.innerHTML = financialOptions(value);
                customsInputRestrictions();
                
                // Hide the Add button and show the Generate button
                addButton.style.display = 'none';
                generateButton.style.display = 'inline-block'; // Show the "Generate" button
            } else if (value === 'options'){
                percentageOutput.innerHTML = financialOptions(value);
                
                // Hide the Add button and show the Generate button
                addButton.style.display = 'none';
                generateButton.style.display = 'inline-block'; // Show the "Generate" button
            }
        }
    });

    // Initially hide the "Add" button and show the "Generate" button
    generateButton.style.display = 'inline-block';
    addButton.style.display = 'none';
    
    // Add your custom button functionality here (if needed)
    addButton.addEventListener('click', () => {
        const downPaymentInput = document.querySelector('#payment');
        const nameOfDownPay = document.querySelector('#name-of-payment');
        const cautionContainer = document.querySelector('.caution-message'); // A container for caution messages
    
        // Clear any existing caution messages
        if (cautionContainer) {
            cautionContainer.textContent = '';
            cautionContainer.style.display = 'none';
        }
    
        // Check if both inputs are filled
        if (downPaymentInput.value.trim() && nameOfDownPay.value.trim()) {
            downPayment(); // Call the function if both fields are filled
        } else {
            // Show a caution message if inputs are missing
            if (cautionContainer) {
                alert("Please fill out all fields correctly.");
                cautionContainer.style.display = 'block';
            } else {
                alert('Please fill in both the payment amount and payment name.');
            }
        }
    });
    

    function resetResults() {
        if (resultHTML) {
            resultHTML.innerHTML = ''; // Clear any displayed results
        }
    }

    inputRestrictions();
    calculatePercentages();
})



/* ----------------------- */
/* ------INPUT BAR------- */
/* --------------------- */

function inputRestrictions() {
    const input = document.querySelector('.input-bar');
    const downPaymentInput = document.querySelector('#payment');
    const nameOfDownPay = document.querySelector('#name-of-payment');

        [input, downPaymentInput].forEach((inputField) => {
            if(inputField){
            inputField.addEventListener('input', (e) => {
                let value = e.target.value;
                
                let hasDollarSign = value.startsWith('$');// -----------------------Remove the dollar sign if present at the start for formatting
                if (hasDollarSign) {
                    value = value.slice(1); // -------------------------------------Remove the dollar sign for processing
                }

                value = value.replace(/[^0-9]/g, '');// ----------------------------Remove invalid characters (anything not a number)

                let integerPart = value.slice(0, -2);// ----------------------------Ensure the last two digits are always the decimal part
                let decimalPart = value.slice(-2);

                integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');// -Add commas to the integer part
                const formattedValue = `$${integerPart}.${decimalPart}`;// ---------Combine the dollar sign with the formatted number

                e.target.value = formattedValue;// ---------------------------------Update the input field with the formatted value
            });

            // Prevent pasting invalid input
            inputField.addEventListener('paste', (e) => {
                e.preventDefault(); // Block paste
            });
            }
        });

    if (nameOfDownPay) {
        nameOfDownPay.addEventListener('input', (e) => {
            let value = e.target.value;
            value = value.replace(/[^A-Za-z\s]/g, '');// Allow both uppercase and lowercase letters
            e.target.value = value; 
        });
    }
    
}

/*REVIEEEEEWWWWWW */

function customsInputRestrictions() {
    const customInputSaving = document.querySelector('#customSaving');
    const customInputUser = document.querySelector('#customUser');
    const maxDigits = 2; // Limit the input to 2 digits

    if (customInputSaving && customInputUser) {
        // Attach event listeners to both inputs
        [customInputSaving, customInputUser].forEach((input) => {
            input.addEventListener('input', (e) => {
                let value = e.target.value;
                console.log('Raw input value:', value); // Debugging: log the raw value

                // Remove any non-numeric characters (except numbers)
                value = value.replace(/[^0-9]/g, '');
                console.log('Value after removing non-numeric characters:', value); // Debugging: log value after cleaning non-numeric characters

                // Limit the value to the specified number of digits
                if (value.length > maxDigits) {
                    value = value.slice(0, maxDigits);
                    console.log('Value after applying digit limitation:', value); // Debugging: log value after digit limitation
                }

                // If value is not empty and doesn't already have '%', add it
                if (value && !value.endsWith('%')) {
                    value = `${value}%`;
                    console.log('Value with % added:', value); // Debugging: log value after adding '%'
                }

                // Update the input value with the modified value (with or without %)
                e.target.value = value;
                console.log('Final input value:', value); // Debugging: log the final value set in input
            });

            // Handle backspace behavior: only delete numbers, leave the %
            input.addEventListener('keydown', (e) => {
                let value = e.target.value;
                
                // If the backspace key is pressed and there's a '%', don't allow it to be deleted
                if (e.key === 'Backspace' && value.endsWith('%')) {
                    e.target.value = value.slice(0, -1); // Remove the % temporarily so backspace can affect the number
                    console.log('Value after backspace:', e.target.value);
                }
            });

            input.addEventListener('input', (e) => {
                let value = e.target.value;
                
                // If the user pressed backspace, handle backspacing behavior to keep '%' at the end
                if (value && !value.endsWith('%')) {
                    // Ensure the % symbol is added back to the end if removed during backspacing
                    value = `${value}%`;
                    e.target.value = value;
                }
            });
        });
    }
}

/* -------------------------------- */
/* ------FORM FUNCTIONALITY------- */
/* ------------------------------ */

function financialOptions(value) {

    if (value === 'down-payment') {
        return `
            <form>
                <div class="">
                    <input type="input" id="name-of-payment" name="name-of-payment" placeholder="EX: Gas">
                    <input type="input" id="payment" name="payment" placeholder="EX: $50">
                </div>
                
            </form>
        `;
    } else if (value === 'custom') {
        return `
            <form>
                <div class="">
                    <input type="input" id="customSaving" name="customInput" placeholder="Saving %">
                    <input type="input" id="customUser" name="customInput" placeholder="User %">
                </div>
                
            </form>
        `;
    } else if (value === 'options') {
        return `
            <form>
                <input type="radio" id="preset1" name="presetInput" value="preset1">
                <label for="preset1">savings: 70% user: 30%</label><br>
                <input type="radio" id="preset2" name="presetInput" value="preset2">
                <label for="preset2">savings: 30% user: 70%</label><br>
                <input type="radio" id="preset3" name="presetInput" value="preset3">
                <label for="preset3">savings: 50% user: 50%</label><br>
            </form>
        `;
    }
}

function calculatePercentages() {
    const check = document.querySelector('.input-bar');
    const generateButton = document.querySelector('#Generate');
    
    generateButton.addEventListener('click', () => {
      // Clean the input value by removing the dollar sign and commas
      const rawValue = check.value.replace(/[^\d.-]/g, ''); // Remove non-numeric characters
      const checkValue = parseFloat(rawValue) || 0; // Convert to number and handle invalid input
  
      const resultHTML = document.querySelector('.result-holder');
      resultHTML.innerHTML = ''; // Clear previous results
  
      const selectedPreset = document.querySelector('input[name="presetInput"]:checked');
      if (selectedPreset) {
        let savingPercentage = 0;
        let userPercentage = 0;
  
        if (selectedPreset.value === 'preset1') {
          savingPercentage = 70;
          userPercentage = 30;
        } else if (selectedPreset.value === 'preset2') {
          savingPercentage = 30;
          userPercentage = 70;
        } else if (selectedPreset.value === 'preset3') {
          savingPercentage = 50;
          userPercentage = 50;
        }
  
        displayProgressBar(resultHTML, 'Saving', savingPercentage, checkValue);
        displayProgressBar(resultHTML, 'User', userPercentage, checkValue);
      } else {
        const customSaving = document.querySelector('#customSaving');
        const customUser = document.querySelector('#customUser');
  
        if (customSaving && customUser) {
          const savingPercentage = parseFloat(customSaving.value) || 0; // Convert to number
          const userPercentage = parseFloat(customUser.value) || 0; // Convert to number
  
          if (savingPercentage + userPercentage === 100) {
            displayProgressBar(resultHTML, 'Saving', savingPercentage, checkValue);
            displayProgressBar(resultHTML, 'User', userPercentage, checkValue);
          } else {
            console.log('The percentages do not add up to 100.');
          }
        }
      }
    });
  }
  
  function displayProgressBar(container, label, percentage, total) {
    const value = (total * (percentage / 100)).toFixed(2); // Calculate the dollar amount
    const progressHTML = `
      <div class="progress-wrapper">
        <div class="progress-container">
          <div class="outer-circle">
            <div class="progress-circle" style="background: conic-gradient(
              #FCA311 0%,
              #FCA311 ${percentage}%,
              transparent ${percentage}%,
              transparent 100%
            );"></div>
          </div>
          <span class="progress-percentage">${percentage}%</span>
        </div>
        <div class="progress-label">${label}: $${formatWithCommas(value)}</div>
      </div>
    `;
  
    container.innerHTML += progressHTML;
  }

// this function will 
// subtract the downPayment from check
// then show downPayment
function downPayment() {
    const input = document.querySelector('.input-bar');
    const downPaymentInput = document.querySelector('#payment');
    const nameOfDownPay = document.querySelector('#name-of-payment');
    const resultContainer = document.querySelector('.list-of-pay'); // or create another container for the results

    if (input && downPaymentInput && nameOfDownPay) {
        // Get the current values
        let inputValue = parseFloat(input.value.replace(/[^0-9.-]+/g, "")) || 0; // Remove any non-numeric characters and convert to float
        let downPaymentValue = parseFloat(downPaymentInput.value.replace(/[^0-9.-]+/g, "")) || 0; // Same for downPaymentInput

        // Subtract downPayment from the input value
        inputValue -= downPaymentValue;

        // Update the input-bar with the new value
        input.value = `$${formatWithCommas(inputValue.toFixed(2))}`;

        // Create the new div with the down payment details
        const newDiv = document.createElement('div');
        newDiv.classList.add('down-payment-details'); // Add a class for styling if needed
        newDiv.innerHTML = `
            <p>Payment Name: ${nameOfDownPay.value}</p>
            <p>Payment Amount: -$${formatWithCommas(downPaymentValue.toFixed(2))}</p>
        `;

        // Append the new div to the result container or another desired element
        resultContainer.appendChild(newDiv);

        // Optionally, reset or clear inputs if needed
        downPaymentInput.value = ''; // Clear the down payment input field after it's used
        nameOfDownPay.value = ''; // Clear the name of down payment field
    }
}

// Helper function to format numbers with commas
function formatWithCommas(value) {
    const [integerPart, decimalPart] = value.split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}


function updateProgressBar(percentage) {
    const progressCircle = document.querySelector('.progress-circle');
    const progressPercentage = document.querySelector('.progress-percentage');
  
    // Cap the percentage at 100%
    const cappedPercentage = Math.min(percentage, 100);
  
    // Update the progress circle background using `conic-gradient`
    progressCircle.style.background = `conic-gradient(
      #4caf50 0%,
      #4caf50 ${cappedPercentage}%,
      #ddd ${cappedPercentage}%,
      #ddd 100%
    )`;
  
    // Update the displayed percentage
    progressPercentage.textContent = `${cappedPercentage}%`;
  }
  
  function animateProgressBar(progressElement, targetPercentage, duration = 2000) {
    const startPercentage = 0; // Starting percentage
    const increment = targetPercentage / (duration / 10); // Increment step based on duration
    let currentPercentage = startPercentage;

    const interval = setInterval(() => {
        currentPercentage += increment;

        // Cap the progress at the target percentage
        if (currentPercentage >= targetPercentage) {
            currentPercentage = targetPercentage;
            clearInterval(interval); // Stop the animation
        }

        // Update the progress bar
        progressElement.style.background = `conic-gradient(
            #FCA311 0%,
            #FCA311 ${currentPercentage}%,
            transparent ${currentPercentage}%,
            transparent 100%
        )`;

        // Update the displayed percentage text
        const percentageText = progressElement.parentElement.querySelector('.progress-percentage');
        if (percentageText) {
            percentageText.textContent = `${Math.round(currentPercentage)}%`;
        }
    }, 10); // Update every 10ms for smooth animation
}

