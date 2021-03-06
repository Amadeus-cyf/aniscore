import React, {Component} from 'react';
import axios from 'axios';
import MainMenu from '../MainMenu/mainMenu.jsx';
import {Label, Image, Button, Input, Form} from 'semantic-ui-react';
import Select from 'react-select';
import loadingGif from '../../loading.gif';
import { pageContainer,textStyle, imageStyle, pageStyle, bangumiSection, bangumiStyle, 
    hoverPart, numberlistStyle, selectStyle, selectCss} from './seasonBangumi.module.scss';
import paging from '../paging.jsx';

class SeasonBangumi extends Component {
    constructor() {
        super();
        this.state = {
            currentBangumi: [],
            selectYear: {},
            displayYear: '2018',
            selectSeason: {},
            displaySeason: 'winter',    // currentSeason
            month: '',                  // month to display
            pageNumber: 0,
            currentPage: 1,
            inputPage: '',
            yearOptions: [],
            seasonOptions: [
                {
                    label: 1,
                    value: 'winter',
                },
                {
                    label: 4,
                    value: 'spring',
                },
                {
                    label: 7,
                    value: 'summer',
                },
                {
                    label: 10,
                    value: 'fall',
                },
                {
                    label: 'All year',
                    value: 'allyear',
                }
            ]
        }
        this.toPrevious = this.toPrevious.bind(this);
        this.toNext = this.toNext.bind(this);
        this.pageHandler = this.pageHandler.bind(this);
        this.yearHandler = this.yearHandler.bind(this);
        this.seasonHandler = this.seasonHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    componentDidMount() {
        let month = 1;
        let date = new Date();
        let yearList = [];
        for (let i = date.getFullYear(); i >= 2005; i--) {
            let currYear = {
                label: i,
                value: i,
            };
            yearList.push(currYear);
        }
        this.setState({
            yearOptions: yearList,
        })
        //get first page of default season anime
        axios.get('api/bangumi/' + this.state.displayYear + '/' 
        + this.state.displaySeason + '/' + this.state.currentPage)
        .then(response => {
            this.setState({
                currentBangumi: response.data.data.bangumiList,
                month: month,
            })
        }).catch(err => {
            alert(err);
        })
        //get default season anime count
        axios.get('api/bangumi/' + this.state.displayYear + '/' + this.state.displaySeason + '/count')
        .then(response => {
            let bangumiNumber = response.data.data.bangumiNumber;
            if (bangumiNumber % 20) {
                this.setState({
                    pageNumber: (bangumiNumber - bangumiNumber%20)/20 + 1
                })
            } else {
                this.setState({
                    pageNumber: bangumiNumber/20,
                })
            }
        })
    }

    toDetailPage(bangumi) {
        this.props.history.push('/detail/' + bangumi.anime_id);
    }

    toPage(pageNumber) {
        if (pageNumber === '') {
            return;
        }
        let year = this.state.displayYear;
        let season = this.state.displaySeason;
        this.setState({
            currentBangumi: [],
        })
        axios.get('api/bangumi/' + year + '/' + season + '/' + pageNumber)
        .then(response => {
            let animelist = response.data.data.bangumiList;
            this.setState({
                currentBangumi: animelist,
                currentPage: pageNumber,
            })
        }).catch(err => {
            alert(err);
        })
    }

    toPrevious() {
        let pageNumber = this.state.currentPage-1;
        let year = this.state.displayYear;
        let season = this.state.displaySeason;
        this.setState({
            currentBangumi: [],
        })
        axios.get('api/bangumi/' + year + '/' + season + '/' + pageNumber)
        .then(response => {
            this.setState({
                currentBangumi: response.data.data.bangumiList,
                currentPage: pageNumber,
            })
        }).catch(err => {
            alert(err);
        })
    }

    toNext() {
        let pageNumber = this.state.currentPage+1;
        let year = this.state.displayYear;
        let season = this.state.displaySeason;
        this.setState({
            currentBangumi: [],
        })
        axios.get('api/bangumi/' + year + '/' + season + '/' + pageNumber)
        .then(response => {
            let animelist = response.data.data.bangumiList;
            this.setState({
                currentBangumi: animelist,
                currentPage: pageNumber,
            })
        }).catch(err => {
            alert(err);
        })
    }

    pageHandler(event) {
        for (let i = 0; i < event.target.value.length; i++) {
            if (isNaN(parseInt(event.target.value[i]))) {
                this.setState({
                    inputPage: '',
                });
                return;
            }
        }
        if (event.target.value > this.state.pageNumber || event.target.value < 1) {
            this.setState({
                inputPage: '',
            });
            return;
        }
        this.setState({
            inputPage: parseInt(event.target.value),
        })
    }

    yearHandler(selectYear) {
        this.setState({
            selectYear: selectYear,
        })
    }

    seasonHandler(selectSeason) {
        this.setState({
            selectSeason: selectSeason,
        })
    }

    submitHandler() {
        if (this.state.selectYear.value === undefined) {
            alert('Please select a year');
            return;
        }
        if (this.state.selectSeason.value === undefined) {
            alert('Please select a season');
            return;
        }
        let year = this.state.selectYear.value;
        let season = this.state.selectSeason.value;
        let month = this.state.selectSeason.label;
        let date = new Date();
        let pageNumber = 1;
        let currentYear = date.getFullYear();
        let currentMonth = date.getMonth()+1;
        // not available bangumi
        if (year === currentYear && month > currentMonth) {
            alert(year + '年' + month + '月' + '由于番剧未上映无法查看');
            return;
        } else {
            this.setState({
                currentBangumi: [],
                selectYear: {},
                selectSeason: {},
            });
            // get first page of bangumi of selected time
            axios.get('api/bangumi/' + year + '/' + season + '/' + pageNumber)
            .then(response => {
                let animelist = response.data.data.bangumiList;
                this.setState({
                    currentBangumi: animelist,
                    displayYear: year,
                    displaySeason: season,
                    month: month,
                    currentPage: 1,
                })
            }).catch(err => {
                alert(err);
            });
            // get number of bangumi
            axios.get('api/bangumi/' + year + '/' + season + '/count')
            .then(response => {
                let bangumiNumber = response.data.data.bangumiNumber;
                if (bangumiNumber % 20) {
                    this.setState({
                        pageNumber: (bangumiNumber - bangumiNumber%20)/20 + 1
                    })
                } else {
                    this.setState({
                        pageNumber: bangumiNumber/20,
                    })
                }
            })
        }
    }

    render() {
        if (this.state.displayYear === ''  || this.state.currentBangumi.length === 0) {
            return(
                <div>
                    <MainMenu current = 'season'/>
                    <div className = {pageContainer}>
                        <div>
                            <Image className = {imageStyle} src={loadingGif} alt = 'loading'/>
                        </div>
                        <p className = {textStyle}>
                            Loading ... 
                        </p>
                    </div>
                </div>
            )
        }
        let titleStyle = {
            display: 'block',
        };
        if (this.state.month === 'All year') {
            titleStyle = {
                display: 'none',
            }
        }
        let previousStyle = {
            display: 'inline',
        };
        let nextStyle = {
            display: 'inline',
        };
        if (this.state.currentPage === 1) {
            previousStyle = {
                display: 'none',
            }
        }
        if (this.state.currentPage === this.state.pageNumber) {
            nextStyle = {
                display: 'none',
            }
        }
        // process each bangumi
        let currentBangumi = this.state.currentBangumi;
        let currentList = currentBangumi.map(bangumi => {
            let labelStyle = {
                'width': '180px',
                'height': 'auto',
                background: 'white',
            }
            let imgStyle = {
                width: '150px',
                height: '190px',
            }
            return(
                <Label onClick ={this.toDetailPage.bind(this, bangumi)} style = {labelStyle}>
                    <Image className = {hoverPart} style = {imgStyle} src = {bangumi.image_url} rounded/>
                    <p className = {hoverPart}>{bangumi.title}</p>
                </Label>
            )
        })
        // set page number list 
        let pageArr = [];
        for (let i = 0; i < this.state.pageNumber; i++) {
            pageArr.push(i+1);
        }
        let pageList = [];
        // process number list
       pageList = pageArr.map(page => {
           return paging(page, this.state.currentPage, this.state.pageNumber, 
            this.toPage.bind(this, page));
       })
        return(
            <div>
                <MainMenu current = 'season'/>
                <div className = {pageStyle}>
                    <div className = {bangumiSection}>
                        <h3>{this.state.displayYear}年</h3>
                        <h3 style = {titleStyle}>{this.state.month}月</h3>
                        <div className = {bangumiStyle}>
                            {currentList}
                        </div>
                        <div className = {numberlistStyle}>
                            <Button color = 'blue' onClick = {this.toPage.bind(this, 1)}>Page</Button>
                            <Button basic color = 'blue' style = {previousStyle} 
                            onClick = {this.toPrevious}>Prev</Button>
                            {pageList}
                            <Button basic color = 'blue' style = {nextStyle} 
                            onClick = {this.toNext}>Next</Button>
                            <Form onSubmit = {this.toPage.bind(this, this.state.inputPage)}>
                                <Input style = {{'width': '150px'}} placeholder = 'Enter page number'
                                onChange = {this.pageHandler}/>
                            </Form>
                        </div>
                    </div>
                    <div className = {selectStyle}>
                        <Select className = {selectCss} placeholder="Select a Year" 
                        onChange = {this.yearHandler} options={this.state.yearOptions}/>
                        <Select placeholder='Select a Season' className = {selectCss} 
                        onChange = {this.seasonHandler} options={this.state.seasonOptions}/>
                        <Button onClick = {this.submitHandler} color = 'blue'>Select</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default SeasonBangumi;