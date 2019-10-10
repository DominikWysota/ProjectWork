//Need Data

let arrayTenLargestMeas = [];

//Types Countries

const typesCountries = ["PL", "DE", "FR", "ES"];
let selectedCountry = "";

//Types Measurements

const typesMeasurements = ["pm25", "pm10", "so2", "no2", "o3", "co", "bc"];
let measurements = "";

//***Fuction check 10 largest count and save to new array***

let activateAnimCheck = true;
let backOrOut = false;

//
const animationsShowResults = () => {
    const animationCheck = () => {
        const sectionCheck = document.querySelector('.check');
        var pos = 50;
        var id = setInterval(frame, 10);

        function frame() {
            if (pos == 10) {
                clearInterval(id);
            } else {
                pos--;
                sectionCheck.style.marginTop = pos + 'vh';
            }
        }
        activateAnimCheck = false;
    }
    if (activateAnimCheck === true) {
        animationCheck();
    }
    setTimeout(function () {
        document.querySelectorAll('.topDiv').forEach((item) => {
            let pos = 100;
            let id = setInterval(frame, 1);

            function frame() {
                if (pos == 0) {
                    clearInterval(id);
                } else {
                    pos--;
                    item.style.left = pos + '%';
                }
            }
        })
    }, 1500);
    backOrOut = true;
}

const showResults = () => {
    setTimeout(function () {
        document.querySelectorAll('.topDiv h2').forEach((item, index) => {
            item.textContent = arrayTenLargestMeas[index].city;
        })
        document.querySelectorAll('.topDiv p').forEach((item, index) => {
            item.textContent = `${arrayTenLargestMeas[index].measurements[0].value.toFixed(2)} ${arrayTenLargestMeas[index].measurements[0].unit}`
        })
    }, 1500);
    if (backOrOut) {
        document.querySelectorAll('.topDiv').forEach((item) => {
            let pos = 0;
            let id = setInterval(frame, 1);

            function frame() {
                if (pos == 100) {
                    clearInterval(id);
                } else {
                    pos++;
                    item.style.left = pos + '%';
                }
            }
        })
    }
    animationsShowResults();
}

const checkMeasurements = () => {
    fetch(`https://api.openaq.org/v1/latest?country=${selectedCountry}&limit=1000&parameter=${measurements}`)
        .then(resp => resp.json())
        .then(resp => {
            //Create temporary array
            let arrayTenLargestCount = [];
            //Sort according to value measurements
            resp.results.sort((a, b) => {
                return b.measurements[0].value - a.measurements[0].value;
            });
            for (let i = 0; i < resp.results.length; i++) {
                arrayTenLargestCount[i] = resp.results[i];
            }

            //Download the largest measurements with every city
            for (let i = 0; i < arrayTenLargestCount.length; i++) {
                if (arrayTenLargestMeas.length >= 1) {
                    let g = true;
                    for (let j = 0; j < arrayTenLargestMeas.length; j++) {
                        if (arrayTenLargestMeas[j].city == arrayTenLargestCount[i].city) {
                            g = false; // Check if it exist, if yes, assign false
                        }
                    }
                    if (g) { //If g = true, do it
                        arrayTenLargestMeas.push(arrayTenLargestCount[i]);
                    }
                } else if (arrayTenLargestMeas.length == 0) { // index is 0, so i assign first,becacuse it doesnt have to chceck
                    arrayTenLargestMeas.push(arrayTenLargestCount[i]);
                }
            }
            showResults();
        });
}

//***Funtion chceck what is your nationality DOKOŃCZ JEŚLI NIE MA TEGO KRAJU***

const input = document.querySelector('.field');
const submit = document.querySelector('.submit');
const passwords = ["Poland", "Germany", "France", "Spain"];

//**Shows results**

//*Check name and show results*
submit.addEventListener("click", () => {
    console.log(input.value);
    passwords.forEach((password, index) => {
        if (password === input.value) {
            selectedCountry = typesCountries[index];
            arrayTenLargestMeas = [];
            checkMeasurements();
        }
    })
});

//**Check measurements DOKOŃCZ KOLOROWANKO**
document.querySelectorAll('.measurementsContainer div:nth-child(n)').forEach(item =>
    item.addEventListener('click', () => {
        measurements = event.target.textContent;
        console.log(event.target.textContent);
    }));