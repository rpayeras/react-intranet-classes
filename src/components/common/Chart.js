import React, { Component } from 'react';
import Chart from 'chart.js';

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            type: 'bar',
            xTooltips: '',
            yTooltips: '',
            content: '',
            data: []
        }
    }

    componentDidMount(){

    }
    
    getRevenue() {
        let that = this;

        $.ajax({
        type: 'GET',
        url: this.serverUrl+'/widget/ocup',
        beforeSend: (xhr) => {xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));}
        }).done(function(data, status){
            that.setState({
                dataChart : data.data
            }, () => {
                that.renderChart();                
            });
        }).fail(function(data, status){ Util.showAlertError(); })
    }

    getPercentTooltip(min = 0, max = 100, interval = 5){
        let percentArray = [];

        for(let i = min; i < max; i += 5){
            percentArray.push(i);
        }

        return percentArray;
    }

    renderChart() {
        var ctx = document.getElementById(this.state.id).getContext('2d');
        let xTooltips = [];
        let yTooltips = [];
        let chartContent = [];

        for(let i = 0; i < 100; i += 5){
            yTooltips.push(i);
        }

        for(let year in this.state.dataChart) {
            for(let hotel in this.state.dataChart[year]) {
                for(let data in this.state.dataChart[year][hotel]) {
                    let reg = this.state.dataChart[year][hotel][data];
                    xTooltips.push(reg.fecha);
                    chartContent.push(reg.ocu);
                }
            }
        }
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'bar',
        
            // The data for our dataset
            data: {
                labels: xTooltips,
                datasets: [{
                    label: "Primary Acapulco",
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: chartContent,
                }]
            },
        
            // Configuration options go here
            options: {}
        });
    }
    render(){
        return()
    }
}