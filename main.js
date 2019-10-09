//Need Data

let arrayTenLargestMeas = [];

//Types Countries

const typesCountries = ["PL", "DE", "FR", "ES"];

//Types Measurements

const typesMeasurements = ["pm25", "pm10", "so2", "no2", "o3", "co", "bc"];

fetch(`https://api.openaq.org/v1/latest?country=${typesCountries[0]}&limit=1000&parameter=${ typesMeasurements[0]}`)
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
    });