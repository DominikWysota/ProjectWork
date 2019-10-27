let arrayTenLargestMeas = [];

const typesCountries = ["PL", "DE", "FR", "ES"];
const passwords = ["poland", "germany", "france", "spain"];
let selectedCountry = "";


const typesMeasurements = ["pm25", "pm10", "so2", "no2", "o3", "co", "bc"];
let measurement = "";


let activateAnimCheck = true;
let backOrOut = false;


let emptyFieldImput = false;
let emptyFieldMeasurements = false;

const animationsShowResults = () => {
    const animationCheck = () => {
        const sectionCheck = document.querySelector('.check');
        let pos = 50;
        let id = setInterval(frame, 10);

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
            item.textContent = `${arrayTenLargestMeas[index].value.toFixed(2)} ${arrayTenLargestMeas[index].unit}`
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

const checkMeasurements = () => {
    fetch(`https://api.openaq.org/v1/measurements?country=${selectedCountry}&limit=1000&parameter=${measurement}`)
        .then(resp => resp.json())
        .then(resp => {
            let arrayTenLargestCount = [];
            resp.results.sort((a, b) => {
                return b.value - a.value;
            });
            for (let i = 0; i < resp.results.length; i++) {
                arrayTenLargestCount[i] = resp.results[i];
            }

            for (let i = 0; i < arrayTenLargestCount.length; i++) {
                if (arrayTenLargestMeas.length >= 1) {
                    let g = true;
                    for (let j = 0; j < arrayTenLargestMeas.length; j++) {
                        if (arrayTenLargestMeas[j].city == arrayTenLargestCount[i].city) {
                            g = false;
                        }
                    }
                    if (g) {
                        arrayTenLargestMeas.push(arrayTenLargestCount[i]);
                    }
                } else if (arrayTenLargestMeas.length == 0) {
                    arrayTenLargestMeas.push(arrayTenLargestCount[i]);
                }
            }
            showResults();
            searchAboutCity();
        });
}

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

const submit = document.querySelector('.submit');

let click = true;

submit.addEventListener("click", () => {
    const input = document.querySelector('.field');
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

document.querySelectorAll('.measurementsContainer div:nth-child(n)').forEach(item =>
    item.addEventListener('click', () => {
        document.querySelectorAll('.measurementsContainer div:nth-child(n)').forEach((deleteColor) => {
            deleteColor.style.background = "rgba(255, 255, 255, 0.342)";
        });
        item.style.background = "white";
        document.querySelector('.measurementsContainer').style.border = "none";
        document.querySelector('.infoMeas').textContent = "";
        emptyFieldMeasurements = true;
        measurement = event.target.textContent;
    }));

accordion();