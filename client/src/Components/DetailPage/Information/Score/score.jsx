import React, { Component } from 'react';
import axios from 'axios';
import {Button} from 'semantic-ui-react'
import ReactApexChart from 'react-apexcharts';
import NoneditStarRating from './noneditRating.jsx';
import {scoreStyle, scoreTitle, innerButtonStyle} from './score.module.scss';

class Score extends Component {
    constructor() {
        super();
        this.state = {
            style: {
                colors: ['#123456'],
            },
            options: {
                plotOptions: {
                    bar: {
                        horizontal: true,
                    }
                },
                dataLabels: {
                    enabled: false,
                },
                yaxis: {
                    labels: {
                        style: {
                            color: '#ffffff',
                            fontSize: '12pt',
                        }
                    }
                },
                xaxis: {
                    max: 100,
                    categories: ['5 stars', '4 stars', '3 stars', '2 stars', '1 star'],
                    labels: {
                        style: {
                            colors: ['#ffffff'],
                            fontSize: '12pt',
                        }
                    }
                },
            },
            series: [
                {
                    name: 'Percentage of User(%)',
                    data: ['0', '0', '0', '0', '0'],
                }
            ],
            userNumber: 0,
            average: 'undefined',
            ratingDisplay: 'none'
        }
    }

    componentDidMount() {
        axios.get('api/bangumiScore/' + this.props.bangumiId)
        .then(response => {
            if (!response.data.data.bangumiScore) {
                this.setState({
                    average: 'none',
                })
                return;
            }
            let score = response.data.data.bangumiScore;
            let percentage = [];
            for (let i = 5; i >= 1; i--) {
                let percent = (score[i].length/score.userNumber * 100).toFixed(1);
                percentage.push(percent.toString());
            }
            this.setState({
                series: [
                    {
                        name: 'Percentage of User(%)',
                        data: percentage,
                    }, 
                ],
                userNumber: score.userNumber,
                average: score.averageScore,
            })
        })
    }

    render() {
        if (this.state.average === 'undefined') {
            return (
                <p style = {{'font-size': '15pt'}}>Fetching score...</p>
            )
        }
        if (this.state.average === 'none') {
            return <p></p>
        }
        let barStyle = {
            width: '320px',
            color: 'black',
            'margin-top': '20px',
        }
        if (this.state.userNumber !== 0) {
            return(
                <div style = {{'font-size': '17pt'}}>
                    <div className = {scoreStyle}>   
                        <Button size = 'huge' color = 'blue' animated='fade' onClick = {this.props.scoreBangumi}>
                            <Button.Content visible className = {innerButtonStyle}>
                                <div className = {scoreTitle}>{this.state.average.toFixed(1)}</div>
                                <div>
                                    <NoneditStarRating average = {this.state.average/2}/>
                                    <p>{this.state.userNumber} user(s) scored</p>
                                </div>
                            </Button.Content>
                            <Button.Content hidden>
                                <p style = {{'font-size': '14pt'}}>Rate Bangumi</p>
                            </Button.Content>
                        </Button>
                    </div>
                    <ReactApexChart style = {barStyle} options={this.state.options} series={this.state.series} type = 'bar'/>
                </div>
            )
        } else {
            return(
                <div style = {{'font-size': '17pt'}}>
                    <div className = {scoreStyle}>   
                        <Button size = 'huge' color = 'blue' animated='fade' onClick = {this.props.scoreBangumi}>
                            <Button.Content visible className = {innerButtonStyle}>
                                <div style = {{'font-size': '17pt'}}>No Rating yet</div>
                            </Button.Content>
                            <Button.Content hidden>
                                <p style = {{'font-size': '14pt'}}>Rate Bangumi</p>
                            </Button.Content>
                        </Button>
                        <h2>Be the first to rate !</h2>
                    </div>
                </div>
            )
        }
    }
}

export default Score;