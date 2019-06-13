import * as React from "react"
import * as Chart from 'chart.js'
import * as url from 'url'

interface Location {
    hash: string;
    pathname: string;
    search: string;
    state: any;
}

interface IProps {
}

interface IState {
    graphs: string[];
}

export default
class App extends React.Component<IProps, IState> {
    uuid: string;
    chart: any;

    constructor(props: IProps) {
        super(props)
        const urlobj = url.parse(url.format(location.href), true)
        this.uuid = urlobj.query.uuid as string;
        this.chart = []
        this.state = {
            graphs: []
        }
    }

    public componentDidMount() {
        fetch(`https://tfab-connect-web-apim.azure-api.net/v1/list?uuid=${this.uuid}`)
        .then( res => res.json())
        .then( data => {
	    const graphs = data.map((v: any) => v.category)
            this.setState({
                graphs: graphs
            })
            graphs.forEach((name: string) => {
                this.renderGraph(name)
            })
        })
        this.start()
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
        fetch(`https://tfab-connect-web-apim.azure-api.net/v1/api?category=${graphName}&uuid=${this.uuid}`)
        .then( res => res.json())
        .then( json => {
		return json.map((v: any) => {return {x: v.time, y: v.value}})
		})
        .then( data => {
            const canvas = document.getElementById(graphName) as HTMLCanvasElement //.getContext('2d');
            const ctx = canvas.getContext('2d')
            const lineColor = this.randomColor()
            this.chart[graphName] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                    label: graphName,
                    backgroundColor: lineColor,
                    borderColor: lineColor,
                    fill: false,
                    data: data
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
        })
    }

    private updateGraph(graphName: string) {
        return fetch(`https://tfab-connect-web-apim.azure-api.net/v1/api?category=${graphName}&uuid=${this.uuid}`)
        .then( res => res.json())
        .then( json => json.map((v: any) => {return {x: v.time, y:v.value}} ))
        .then(data => {
            this.chart[graphName].data.datasets[0].data = data
            this.chart[graphName].update()
        })
    }

    private start() {
        this.timeout("Hoge")
        .then( _ => {Promise.all(this.state.graphs.map(graphName => this.updateGraph(graphName)))})
        .then( () => {this.start()} )
        .catch( () => {this.start()} )
    }

    private timeout(_: any) {
        const ms = 5000
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), ms)
        })
    }

    private randomColor(): string {
        const r = Math.floor(Math.random() * 256)
        const g = Math.floor(Math.random() * 256)
        const b = Math.floor(Math.random() * 256)
        return `rgb(${r}, ${g}, ${b})`
    }
}
