document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#percentageForm');
    const generateButton = document.querySelector('#Generate');
    const addButton = document.querySelector('#Add'); // Ensure there's an "Add" button in your HTML
    let downPaymentOutput = document.querySelector('#downPaymentOutput')
    let customOutput = document.querySelector('#customOutput');
    let percentageOutput = document.querySelector('#percentageOutput');

    form.addEventListener('change', (e) => {
        const value = e.target.value;
        
        if(e.target.name === 'select'){
            downPaymentOutput.innerHTML = '';
            customOutput.innerHTML = '';
            percentageOutput.innerHTML = '';

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
        downPayment();
    });
    
    calculatePercentages();
})



/* ----------------------- */
/* ------INPUT BAR------- */
/* --------------------- */

function inputRestrictions() {
    const input = document.querySelector('.input-bar');
    const downPaymentInput = document.querySelector('#payment');
    const nameOfDownPay = document.querySelector('#name-of-payment');

    if (input && downPaymentInput) {
        [input, downPaymentInput].forEach((input) => {
            input.addEventListener('input', (e) => {
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
            input.addEventListener('paste', (e) => {
                e.preventDefault(); // Block paste
            });
    
        });
    }

    if (nameOfDownPay) {
        nameOfDownPay.addEventListener('input', (e) => {
            let value = e.target.value;
            value = value.replace(/[^A-Za-z]/g, ''); // Allow both uppercase and lowercase letters
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

function calculatePercentages(){
    const check = document.querySelector('.input-bar');

    const generateButton = document.querySelector('#Generate');
    generateButton.addEventListener('click', () => {

        // Clean the input value by removing the dollar sign and commas
        const rawValue = check.value.replace(/[^\d.-]/g, ''); // Remove non-numeric characters
        const checkValue = parseFloat(rawValue) || 0; // Convert to number and handle invalid input

        /*--------------------*/
        /*----- OPTIONS -----*/
        /*-------------------*/

        const resultHTML = document.querySelector('.result-holder');

        const selectedPreset = document.querySelector('input[name="presetInput"]:checked');
        if (selectedPreset) {
       
            const preset1 = selectedPreset.value === 'preset1';
            const preset2 = selectedPreset.value === 'preset2';
            const preset3 = selectedPreset.value === 'preset3';

            if (preset1) {
                return resultHTML.innerHTML = `
                    <div class="result-holder">
                        <h2>saving: $${(checkValue * 0.70).toFixed(2)}</h2>
                        <h2>User: $${(checkValue * 0.30).toFixed(2)}</h2>
                    </div>`;
            } else if (preset2) {
                return resultHTML.innerHTML = `
                    <div class="result-holder">
                        <h2>saving: $${(checkValue * 0.30).toFixed(2)}</h2>
                        <h2>User: $${(checkValue * 0.70).toFixed(2)}</h2>
                    </div>`;
            } else if (preset3) {
                return resultHTML.innerHTML = `
                <div class="result-holder">
                    <h2>saving: $${(checkValue * 0.50).toFixed(2)}</h2>
                    <h2>User: $${(checkValue * 0.50).toFixed(2)}</h2>
                </div>`;
            } 
        } else {
            const customSaving = document.querySelector('#customSaving');
            const customUser = document.querySelector('#customUser');
            console.log('im working')
            if (customSaving && customUser) {
                const savingValue = parseFloat(customSaving.value) || 0; // Convert to number
                const userValue = parseFloat(customUser.value) || 0; // Convert to number

                console.log('Saving Value:', savingValue);
                    console.log('User Value:', userValue);
                    console.log('Sum:', savingValue + userValue);
        
                if (savingValue + userValue === 100) {
                    const savingPercentage = savingValue / 100;
                    const userPercentage = userValue / 100;
                    resultHTML.innerHTML = `
                    <div class="result-holder">
                        <h2>saving: $${(checkValue * savingPercentage).toFixed(2)}</h2>
                        <h2>User: $${(checkValue * userPercentage).toFixed(2)}</h2>
                    </div>`;
                } else {
                    console.log('The percentages do not add up to 100.'); 
                }
            }
        }
    });
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
        input.value = `$${inputValue.toFixed(2)}`;

        // Create the new div with the down payment details
        const newDiv = document.createElement('div');
        newDiv.classList.add('down-payment-details'); // Add a class for styling if needed
        newDiv.innerHTML = `
            <p>Down Payment Name: ${nameOfDownPay.value}</p>
            <p>Down Payment Amount: $${downPaymentValue.toFixed(2)}</p>
        `;

        // Append the new div to the result container or another desired element
        resultContainer.appendChild(newDiv);

        // Optionally, reset or clear inputs if needed
        downPaymentInput.value = ''; // Clear the down payment input field after it's used
        nameOfDownPay.value = ''; // Clear the name of down payment field
    }
}

