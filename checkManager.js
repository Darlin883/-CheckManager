document.addEventListener('DOMContentLoaded', () => {
    // finanicalOptions(value);
    inputRestrictions();
    
    const form = document.querySelector('#percentageForm');
    let customeOutput = document.querySelector('#customOutput');
    let percentageOutput = document.querySelector('#percentageOutput')

    form.addEventListener('change', (e) => {
        const value = e.target.value;
        
        if(e.target.name === 'select'){
            customeOutput.innerHTML = '';
            percentageOutput.innerHTML = '';

            if(value === 'custom'){
                customeOutput.innerHTML = finanicalOptions(value);
                customsInputRestrictions();
            } else if (value === 'options'){
                percentageOutput.innerHTML = finanicalOptions(value);
            }
        }
    });
    calculatePercentages()
})


/* ----------------------- */
/* ------INPUT BAR------- */
/* --------------------- */

function inputRestrictions() {
    const input = document.querySelector('.input-bar');

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
    
}

/* -------------------------------- */
/* ------FORM FUNCTIONALITY------- */
/* ------------------------------ */

function finanicalOptions(value) {
    if (value === 'custom') {
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

        const selectedPreset = document.querySelector('input[name="presetInput"]:checked');
        if (selectedPreset) {
       
            const preset1 = selectedPreset.value === 'preset1';
            const preset2 = selectedPreset.value === 'preset2';
            const preset3 = selectedPreset.value === 'preset3';

            if (preset1) {
                console.log(`this is 70%: ${(checkValue * 0.70).toFixed(2)} And this is 30%: ${(checkValue * 0.30).toFixed(2)}`);
            } else if (preset2) {
                console.log(`this is 30%: ${(checkValue * 0.30).toFixed(2)} And this is 70%: ${(checkValue * 0.70).toFixed(2)}`);
            } else if (preset3) {
                console.log(`this is 50%: ${(checkValue * 0.50).toFixed(2)} And this is 50%: ${(checkValue * 0.50).toFixed(2)}`);
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
                    console.log(`Savings: ${(checkValue * savingPercentage).toFixed(2)}, User: ${(checkValue * userPercentage).toFixed(2)}`);
                } else {
                    console.log('The percentages do not add up to 100.');
                    
                }
            } else {
                
                console.log('doesnt equal 100')
            }
        }
    });
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



