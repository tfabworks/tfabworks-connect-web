const Papa = require("papaparse")
const Chart = require("chart.js")
const fetch = require('isomorphic-fetch')

let tmp
Papa.parse("/api/file/_akarusa?uuid=25d30a89-ba19-481a-9e9d-a3a25febc12a", {
   download: true,
   header: true,
   complete: (results, file) => {
      console.log(results)
      const label = results.meta.fields[1]
      tmp = results.data.map(v => {
        return {
            x: new Date(v.time * 1000),
            y: Math.floor(Math.random() * Math.floor(100))
        }
      })
      console.log(tmp.slice(0, -2))
      var ctx = document.getElementById('myChart').getContext('2d');
      var chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: [],
            datasets: [{
              label: "hoge",
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              fill: false,
              data: tmp.slice(0, -2)
            }]
          },
          options: {
            scales: {
              xAxes: [{
                  type: 'time'
              }]
            }
          }
      })
   }
})

fetch("/api/list?uuid=25d30a89-ba19-481a-9e9d-a3a25febc12a")
.then(res => {
    return res.json()
}).then(data => {
  console.log(data)
  data.forEach(element => {
    const a = document.createElement('a')
    a.text = element
    a.setAttribute('href', )
    document.getElementById('leftsidenav').appendChild(a)
  });
})
