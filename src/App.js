import React from 'react';

import './App.css';

import Chart from 'chart.js';

import moment from 'moment';

async function fetchAsync (url) {
    const response = await fetch(url);
    return await response.json();
  }
export default class App extends React.Component {
    constructor(){
        super();
        this.state = {
            labels: [],
            data: [0, 1, 2],
        };
    }
  componentDidMount() {
    fetchAsync('https://api.covid19api.com/dayone/country/united-kingdom/status/confirmed').then(result => {
        this.setState({
            labels : result.filter(item => item.Province === '').map(element => element.Date), 
            data: result.filter(item => item.Province === '').map(element => element.Cases),
        })
    })
  }
  componentDidUpdate(prevProps, prevState){
      if (prevState.data !== this.state.data) {
        this.drawGraph2()
      }
  }
  drawGraph2(){
    var ctx = document.getElementById('myChart2').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            labels: this.state.labels.map(date => moment(date).format("MMMM Do")),
            datasets: [{
                label: 'Cases',
                data: this.state.data,
                backgroundColor: "rgba(230, 211, 255, 0.7)",
                fill: true
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
  }
  render() {
    return (
      <div className="App">
          {console.log(this.state.labels[this.state.labels.length-1])}
          <h1 className="title">Current total cases in the United Kingdom as of: {moment(this.state.labels[this.state.labels.length-1]).format('h:mm a, Do MMMM')}</h1>
          <div className="chart">
            <canvas id="myChart2" width="400" height="400"></canvas>
          </div>
      </div>
    );
  }
}
