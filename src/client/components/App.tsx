import * as React from "react"
import * as Papa from 'papaparse'
import * as Chart from 'chart.js'
import * as url from 'url'
import { element } from "prop-types";

interface Location {
    hash: string;
    pathname: string;
    search: string;
    state: any;
}

interface IProps {
    location: Location;
}

interface IState {
    graphs: string[];
}

export default
class App extends React.Component<IProps, IState> {
    uuid: string;

    constructor(props: IProps) {
        super(props)
        const urlobj = url.parse(url.format(this.props.location), true)
        this.uuid = urlobj.query.uuid as string;
        this.state = {
            graphs: []
        }
    }

    public componentDidMount() {
        fetch(`/api/list?uuid=${this.uuid}`)
        .then(res => {
            return res.json()
        }).then(data => {
            this.setState({
                graphs: data
            })
            
            data.forEach((element: any) => {
                this.renderGraph(element)
                const a = document.createElement('a')
                a.text = element
                document.getElementById('leftsidenav').appendChild(a)
            });
        })

    }

    public render() {
        return (
            <div>
                <div className="chart-container">
                { this.state.graphs.map( (name, i) => 
                    <canvas id={name} key={i} className="chart"/>
                )}
                </div>
                <div id="leftsidenav" className="sidenav" />
            </div>
        )
    }

    private renderGraph(graphName: string) {
        Papa.parse(`/api/file/${graphName}?uuid=${this.uuid}`, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: (results: any, file: any) => {
               const label = results.meta.fields[1]
               const tmp = results.data.map((v: any) => {
                 return {
                     x: new Date(parseInt(v.time)),
                     y: v[label]
                 }
               })
               console.log(tmp.slice(0, -2))
               const canvas = document.getElementById(graphName) as HTMLCanvasElement //.getContext('2d');
               const ctx = canvas.getContext('2d')
               const lineColor = this.randomColor()
               var chart = new Chart(ctx, {
                   type: 'line',
                   data: {
                     labels: [],
                     datasets: [{
                       label: graphName,
                       backgroundColor: lineColor,
                       borderColor: lineColor,
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
    }

    private randomColor(): string {
        const r = Math.floor(Math.random() * 256)
        const g = Math.floor(Math.random() * 256)
        const b = Math.floor(Math.random() * 256)
        return `rgb(${r}, ${g}, ${b})`
    }
}
