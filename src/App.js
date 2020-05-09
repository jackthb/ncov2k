import React from 'react';

import './App.css';

import Chart from 'chart.js';

import moment from 'moment';

export default class App extends React.Component {
    constructor(){
        super();
        this.state = {
          labels: [],
          cases: [],
          daily: []
        };
        this.daily()
    }
  async componentDidMount() {
    (await fetch('https://api.covid19api.com/dayone/country/united-kingdom')).json().then(result => {
        this.setState({
            labels : result.filter(item => item.Province === '').map(element => element.Date), 
            cases: result.filter(item => item.Province === '').map(element => element.Confirmed),
            deaths: result.filter(item => item.Province === '').map(element => element.Deaths),
          })
    })
  }
  componentDidUpdate(prevProps, prevState){
      if (prevState.cases !== this.state.cases) {
        this.daily()
        this.drawGraph2()
      } else if (prevState.daily !== this.state.daily) {
        this.drawGraph2()
      }
  }
  increase() {
    const data = this.state.cases
    const length = data.length
    return data[length-1] - data[length-2]
  }
  daily() {
    const data = this.state.cases
    let arr = [];
    for (let i = 0; i < data.length-1; i++) {
        arr.push(data[i]-data[i-1])
    }
    console.log(arr)
    this.setState({daily: arr})
    console.log(this.state.daily)
    
  }
  drawGraph2(){
    let ctx = document.getElementById('myChart2').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: this.state.labels.map(date => moment(date).format("MMMM Do")),
            datasets: [
              {
                label: 'Deaths',
                data: this.state.deaths,
                backgroundColor: "rgba(141, 12, 12, 0.5)",
                fill: true
              },
              {
                label: 'Cases',
                data: this.state.cases,
                backgroundColor: "rgba(230, 211, 255, 0.7)",
                fill: true
              },
              {
                label: 'Daily Cases',
                data: this.state.daily,
                backgroundColor: "rgba(230, 211, 255, 0.7)",
                type: 'bar',
                fill: true
              }
          ]
        },
    });
  }

  render() {
    return (
      <div className="App">
          <h1 className="title">Current total cases in the United Kingdom as of: {moment(this.state.labels[this.state.labels.length-1]).format('h:mm a, Do MMMM')}</h1>
          <div className="chart">
            <canvas id="myChart2" width="400" height="400"></canvas>
          </div>
        <p>The total increase from yesterday was + {this.increase()}.</p>
        <div>
          <h1>Cases: {this.state.cases[this.state.labels.length-1]}</h1>
        </div>
      </div>
    );
  }
}


// { DATASETS
//   label: 'Cases',
//   data: this.state.data,
//   backgroundColor: "rgba(230, 211, 255, 0.7)",
//   fill: true
// }, {
//   label: 'Deaths',
//   data: this.state.deaths,
//   backgroundColor: "rgba(141, 12, 12, 0.5)",
//   fill: true
// },