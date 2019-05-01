import * as d3 from "d3"
import fetch from 'isomorphic-fetch';

const root = d3.select("div");

function renderCSV(csvfile) {
  const div = root.append("div")
  const h2= div.append("h2")
  h2.text(csvfile)
  const svg = div.append("svg");
  svg.attr("width", 960)
  svg.attr("height", 300)
  const margin = {top: 20, right: 20, bottom: 30, left: 40};
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;

  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  const area = d3.area()
        .curve(d3.curveMonotoneX)
        .x(function(d) { return x(d.time); })
        .y0(height)
        .y1(function(d) { return y(d.brightness); });

  svg.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);

  const g = svg.append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("/api/data/" + csvfile, function(d) {
    console.log((new Date(d.time*1000)).toISOString());
    console.log(d);
    d.time = d3.isoParse((new Date(d.time*1000)).toISOString());
    d.brightness = d.brightness;
    return d;
  }).then( data => {
    x.domain(d3.extent(data, function(d) { return d.time; }));
    const max = d3.max(data, function(d) { return d.brightness; })
//    y.domain([0, max]);
    y.domain([0, 360]);

    g.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    g.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);
  })
}

//fetch("/api/list.php")
//.then( resp => resp.json() )
//.then( data => {
//  console.log(data)
//  data.map( el => {
//    console.log(el)
//    renderCSV(el)
//  })
//})

renderCSV('_net.csv');

setTimeout("location.reload()", 10000)
