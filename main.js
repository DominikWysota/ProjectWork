//Needed Data

let arrayTenLargestMeas = [];

//Types Countries

const typesCountries = ["PL", "DE", "FR", "ES"];
const passwords = ["poland", "germany", "france", "spain"];
let selectedCountry = "";

//Types Measurements

const typesMeasurements = ["pm25", "pm10", "so2", "no2", "o3", "co", "bc"];
let measurements = "";

//Animation variables

let activateAnimCheck = true;
let backOrOut = false;

//Validation

let emptyFieldImput = false;
let emptyFieldMeasurements = false;

//Animations for top10 cities results and check imputs
const animationsShowResults = () => {
    //Animation for chceck imputs
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
    if (activateAnimCheck === true) { //Check did this animation happen once
        animationCheck();
    }
    setTimeout(function () { //Animation top10 results div
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

const showResults = () => { //Add to 10 divs results 
    setTimeout(function () {
        document.querySelectorAll('.topDiv h2').forEach((item, index) => {
            item.textContent = arrayTenLargestMeas[index].city;
        })
        document.querySelectorAll('.topDiv p').forEach((item, index) => {
            item.textContent = `${arrayTenLargestMeas[index].value.toFixed(2)} ${arrayTenLargestMeas[index].unit}`
        })
    }, 1500);
    if (backOrOut) { //Back animation for top10 results div
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

//Check information about city in MediaWiki

const searchAboutCity = () => {
    for (let i = 0; i < 10; i++) {
        let url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${arrayTenLargestMeas[i].city}&format=json&callback=?`;
        $.ajax({
            url: url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                let item = document.querySelector(`.p${i}`);
                item.textContent = data[2][0];
            }
        })
    }
}

//***Fuction check 10 largest count and save to new array***

const checkMeasurements = () => {
    // !!!! I don't know why, if i seek out in data Latest, it works well only for Polish but other coutries's city have Name and Surname (In Germany) some people
    // In spain and france i have name lands in city or name departaments, so i seek out in Measurements data because there are some exact data city
    fetch(`https://api.openaq.org/v1/measurements?country=${selectedCountry}&limit=1000&parameter=${measurements}`)
        .then(resp => resp.json())
        .then(resp => {
            //Create temporary array
            let arrayTenLargestCount = [];
            //Sort according to value measurements
            resp.results.sort((a, b) => {
                return b.value - a.value;
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
            searchAboutCity();
        });
}

//Animation accordion

const accordion = () => {
    let acc = document.getElementsByClassName("topDiv");

    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            let panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }
}

function offAccordion() {
    document.querySelectorAll(".topDiv").forEach((e) => {
        let panel = e.nextElementSibling;
        panel.style.maxHeight = panel.scrollTop + "px";
        panel.style.maxHeight = null;
    });
}

//***Funtion check, show results and validation***

const input = document.querySelector('.field');
const submit = document.querySelector('.submit');

//**Shows results**

let click = true;

//*Check name and show results*
submit.addEventListener("click", () => {
    offAccordion();
    if (click) {
        document.querySelector('.container').classList.remove('container');
        document.querySelector('.heading').remove();
        click = false;
    }
    if (!emptyFieldMeasurements && input.value == "") {
        document.querySelector('.measurementsContainer').style.border = "1px solid red";
        document.querySelector('.infoInput').textContent = "Please enter name country (Poland, Germany, France or Spain)";
        document.querySelector('.infoMeas').textContent = "Please check parameters";
        return false;
    } else if (!emptyFieldMeasurements) {
        document.querySelector('.measurementsContainer').style.border = "1px solid red";
        document.querySelector('.infoMeas').textContent = "Please check parameters";
        return false;
    } else if (input.value == "") {
        document.querySelector('.infoInput').textContent = "Please enter name country (Poland, Germany, France or Spain)";
        return false;
    }
    let isOrIsnt = 0;
    passwords.forEach((password, index) => {
        if (password === input.value.toLowerCase()) {
            document.querySelector('.infoInput').textContent = "";
            selectedCountry = typesCountries[index];
            arrayTenLargestMeas = [];
            checkMeasurements();
            return true;
        } else {
            isOrIsnt++
        }
    })
    if (isOrIsnt == passwords.length) {
        document.querySelector('.infoInput').textContent = "Please enter name country (Poland, Germany, France or Spain)";
        return false;
    }
});

//**Check measurements**
document.querySelectorAll('.measurementsContainer div:nth-child(n)').forEach(item =>
    item.addEventListener('click', () => {
        document.querySelectorAll('.measurementsContainer div:nth-child(n)').forEach((deleteColor) => {
            deleteColor.style.background = "rgba(255, 255, 255, 0.342)";
        });
        item.style.background = "white";
        document.querySelector('.measurementsContainer').style.border = "none";
        document.querySelector('.infoMeas').textContent = "";
        emptyFieldMeasurements = true;
        measurements = event.target.textContent;
    }));

accordion();