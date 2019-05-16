import * as React from "react";
import * as Papa from 'papaparse'
import * as Chart from 'chart.js'

interface AppProps {}

export default
class App extends React.Component<AppProps> {
    public componentDidMount() {
        Papa.parse("/api/file/_akarusa?uuid=25d30a89-ba19-481a-9e9d-a3a25febc12a", {
            download: true,
            header: true,
            complete: (results: any, file: any) => {
               console.log(results)
               const label = results.meta.fields[1]
               const tmp = results.data.map((v: any) => {
                 return {
                     x: new Date(v.time * 1000),
                     y: Math.floor(Math.random() * Math.floor(100))
                 }
               })
               console.log(tmp.slice(0, -2))
               const ctx = document.getElementById('myChart') //.getContext('2d');
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
        data.forEach((element: any) => {
            const a = document.createElement('a')
            a.text = element
            document.getElementById('leftsidenav').appendChild(a)
        });
        })

    }

    public render() {
        return (
            <div className="chart-container">
                <canvas id="myChart"/>
            </div>
        )
    }
}
