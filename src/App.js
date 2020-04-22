import React from 'react';

import './App.css';

import Chart from 'chart.js';

async function fetchAsync () {
    const response = await fetch('https://api.covid19api.com/dayone/country/united-kingdom');
    return await response.json();
  }
export default class App extends React.Component {
    constructor(){
        super();
        this.state = {
            labels: [],
            data: [0, 1, 2]
        };
    }
  componentDidMount() {
    fetchAsync().then(result => {
        this.setState({
            labels : result.filter(item => item.Province === '').map(element => element.Date), 
            data: result.filter(item => item.Province === '').map(element => element.Deaths),
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
            labels: this.state.labels,
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
          <div className="chart">
            <canvas id="myChart2" width="400" height="400"></canvas>
          </div>
      </div>
    );
  }
}
