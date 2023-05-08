
//variables and elements
const dayInput = window.document.querySelector("#day");
const monthInput = window.document.querySelector("#month");
const yearInput = window.document.querySelector("#year");
const inputs = window.document.querySelectorAll(".date-value");

const currentDate = new Date(); 
let currentDay = currentDate.getDate(); 
let currentMonth = currentDate.getMonth() + 1; 
let currentYear = currentDate.getFullYear();

const btnSubmit = window.document.querySelector("#btn-submit");
const displayDiv = window.document.querySelector("#display");
const form = window.document.querySelector("#form-date"); 
const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; 


//events
form.addEventListener('submit', handleSubmit); 

inputs.forEach(input => {
     input.addEventListener('blur', (e) => {
        let inputVal = input.value 
        if(isNaN(Number(inputVal)) || String(inputVal).length == 0) return ;

        if(input.getAttribute('id') == 'year') {
            input.value = formatValue(inputVal, true); 
        } else {
            input.value = formatValue(inputVal, false); 
        }
     })
}); 

//functions
function daysInTheMonth(month, year) {
    const date = new Date(year, month, 0);
    return date.getDate();
}

function isValidDate(day, month, year) {
    const daysInMonth = daysInTheMonth(month, year); 
    if(day > daysInMonth) return false; 
    return true; 
}

function isFutureDate(userDate, currentDate) {
    if(userDate > currentDate) return true; 
    return false;
}

function showErrors(input, message) {
    const parent = input.parentNode;
    const span = input.nextElementSibling; 
    parent.classList.add("error"); 
    span.style.display = 'inline';
    span.textContent = message;  
}

function hideErrors(input) {
    const parent = input.parentNode;
    const span = input.nextElementSibling; 
    parent.classList.remove("error"); 
    span.textContent = "";
    span.style.display = 'none'  
}

function formatValue(value, isYear) {
    if(isYear) {
        switch(String(value).length) {
            case 1: 
                return `000${value}`;
            case 2:
                return `00${value}`;           
            case 3: 
                return `0${value}`;
            default: 
                return value;  
        }
    } else {
        if(String(value).length < 2) return `0${value}`; 
        return value;
    }
}

function displayInfo(days, months, years) {
    displayDiv.innerHTML = ""; 
    displayDiv.innerHTML = `
    <div class="time" id="display-year">
        <span class="dash">${years}</span>years
    </div>
    <div class="time" id="display-month">
        <span class="dash">${months}</span>months
    </div>
    <div class="time" id="display-day">
        <span class="dash">${days}</span>days
    </div>
    `; 
}

function validate() {
    let validator = true; 

    inputs.forEach(input => {         
        const userDay = parseInt(dayInput.value);
        const userMonth = parseInt(monthInput.value); 
        const userYear = parseInt(yearInput.value); 
        const userString = `${userYear}-${userMonth}-${userDay}`; 
        const userDate = new Date(userString); 

        if(!input.value) {
            hideErrors(input); 
            showErrors(input, "Value is required"); 
            validator = false;
        } else if (userDay <= 0 || userDay > 31 || !isValidDate(userDay, userMonth, userYear) || isNaN(userDay)) {
            hideErrors(input); 
            showErrors(dayInput, "Day is not valid"); 
            validator = false;
        } else if (userMonth <=0 || userMonth > 12 || isNaN(userMonth)) {
            hideErrors(input); 
            showErrors(monthInput, "Month is not valid"); 
            validator = false;
        } else if (userYear > currentYear) {
            hideErrors(input); 
            showErrors(yearInput, "Must be in the past"); 
            validator = false;
        } else if (userYear <= 0 || isNaN(yearInput.value)) {
            hideErrors(input); 
            showErrors(yearInput, "Year is not valid");
            validator = false;
        } else if (isFutureDate(userDate, currentDate)) {
            hideErrors(input); 
            showErrors(input, "Date must be in the past"); 
            validator = false;
        } else {
            hideErrors(input); 
            validator = true; 
        }
    });

    return validator;
}

function handleSubmit(e) {
    e.preventDefault(); 
    currentDay = currentDate.getDate(); 
    currentMonth = currentDate.getMonth() + 1; 
    currentYear = currentDate.getFullYear();
    
    if(validate()) {
        if(dayInput.value > currentDay) {//9/4/2003
            currentDay = currentDay+months[currentMonth-1];//8+31=39
            currentMonth = currentMonth-1;  //4
        }

        if(monthInput.value > currentMonth) {
            currentMonth = currentMonth + 12; 
            currentYear = currentYear - 1; 
        }

        const d = currentDay - dayInput.value; //39-9=30
        const m = currentMonth - monthInput.value;//4-4=0
        const y = currentYear - yearInput.value;//2023-2003=20

        displayInfo(d, m, y); 
    }
}