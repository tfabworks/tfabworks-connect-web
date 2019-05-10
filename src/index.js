const Papa = require("papaparse")
const Chart = require("chart.js")

console.log("hot")
Papa.parse("/test.csv", {
   download: true,
   header: false,
   complete: (results, file) => {
       console.log(results)
       console.log("fuga")
   }
})
var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    type: 'line',

    // The data for our dataset
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45]
        }]
    },

    // Configuration options go here
    options: {}
});
