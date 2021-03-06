import React, {Component} from 'react';
import {Button, Label, Image, Divider} from 'semantic-ui-react';
import axios from 'axios';
import {connect} from 'react-redux';
import StarRating from 'react-star-ratings';
import Information from './Information/information.jsx';
import Synopsis from './Synopsis/synopsis.jsx';
import Recommend from './Recommend/recommend.jsx';
import Commentlist from './Comments/commentlist.jsx';
import Navibar from '../Home/MainMenu/Navibar/navibar.jsx';
import {pageContainer,textStyle, imageStyle} from '../Home/SeasonBangumi/seasonBangumi.module.scss';
import loadingGif from '../searchloading.gif';
import {labelStyle, footerStyle} from './detailPage.module.scss';

class DetailPage extends Component {
    constructor() {
        super();
        this.state = {
            bangumi: 'undefined',
            ratingDisplay: 'none',
            loginDisplay: 'none',
            totalBrightness: 'brightness(100%)',
            rating: 0,
            currentUser: 'undefined',
        }
        this.changeRating = this.changeRating.bind(this);
        this.scoreBangumi = this.scoreBangumi.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.cancelHandler = this.cancelHandler.bind(this);
        this.okHandler = this.okHandler.bind(this);
        this.loginHandler = this.loginHandler.bind(this);
    }
    
    componentDidMount() {
        axios.get('https://api.jikan.moe/v3/anime/' + this.props.match.params.anime_id)
        .then(response => {
            this.setState({
                bangumi: response.data,
            })
        }).catch(err => {
            // api get detail failed, then get info from local database
            axios.get('api/bangumi/' + this.props.match.params.anime_id)
            .then(response => {
                let bangumi = response.data.data.bangumi;
                bangumi.mal_id = bangumi.anime_id
                this.setState({
                    bangumi: bangumi,
                })
            }).catch(err => {
                alert(err);
            })
        })
    }

    changeRating(value, prevalue, name) {
        this.setState({
            rating: value,
        });
    }

    scoreBangumi() {
        if (this.props.currentUser !== 'undefined') {
            this.setState({
                ratingDisplay: 'flex',
                loginDisplay: 'none',
                totalBrightness: 'brightness(30%)',
            })
        } else {
            this.setState({
                ratingDisplay: 'none',
                loginDisplay: 'flex',
                totalBrightness: 'brightness(30%)',
            })
        }
    }

    submitHandler() {
        axios('api/bangumiScore/' + this.props.match.params.anime_id, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
            },
            data: {
                user_id: this.props.currentUser._id,
                score: this.state.rating,
                image_url: this.state.bangumi.image_url,
                title: this.state.bangumi.title,
                synopsis: this.state.bangumi.synopsis,
            }
        }).then(() => {
            window.location.reload();
        }).catch(err => {
            alert(err);
        })
        this.setState({
            rating: 0,
            ratingDisplay: 'none',
            loginDisplay: 'none',
            totalBrightness: 'brightness(100%)',
        })
    }

    okHandler() {
        this.setState({
            rating: 0,
            ratingDisplay: 'none',
            loginDisplay: 'none',
            totalBrightness: 'brightness(100%)',
        })
    }

    cancelHandler() {
        this.setState({
            rating: 0,
            ratingDisplay: 'none',
            totalBrightness: 'brightness(100%)',
        })
    }

    loginHandler() {
        this.props.history.push('/login');
    }

    render() {
        if (this.state.bangumi === 'undefined') {
            return (
                <div>
                    <Navibar/>
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
        let ratingStyle = {
            display: this.state.ratingDisplay,
        }
        let loginStyle = {
            display: this.state.loginDisplay,
        }
        if (this.state.ratingDisplay === 'flex') {
            ratingStyle = {
                display: this.state.ratingDisplay,
                'flex-direction': 'column',
                'justify-content': 'space-around',
                width: '450px',
                height: '400px',
                background: 'white',
                'text-align': 'center',
            }
        }
        if (this.state.loginDisplay === 'flex') {
            loginStyle = {
                display: this.state.loginDisplay,
                'flex-direction': 'column',
                'justify-content': 'space-evenly',
                width: '450px',
                height: '400px',
                background: 'white',
                'text-align': 'center',
            }
        }
        let pageStyle = {
            filter: this.state.totalBrightness,
            background: 'white',
        }
        return(
            <div>
                <Navibar/>
                <div style = {pageStyle}>
                    <Information bangumi = {this.state.bangumi} scoreBangumi = {this.scoreBangumi}/>
                    <Synopsis bangumi = {this.state.bangumi}/>
                    <Recommend bangumi = {this.state.bangumi} currentUser = {this.props.currentUser}/>
                    <Commentlist bangumi = {this.state.bangumi} currentUser = {this.props.currentUser}/>
                    <div className = {footerStyle}>
                        <h2>Aniscore </h2>
                    </div>
                </div>
                <div className = {labelStyle}>
                    <Label style = {ratingStyle}>
                        <h1>Rate the Bangumi</h1>
                        <Divider style = {{'position': 'relative', 'top': '-30px'}}/>
                        <StarRating 
                            name = 'rating'
                            numberOfStars={5}
                            rating = {this.state.rating}
                            starEmptyColor = "grey"
                            starRatedColor = "#ffb440"
                            starHoverColor = "#ffb400"
                            changeRating={this.changeRating}
                            editing = {true}
                            isAggregateRating = {true}
                            starDimension="30px"
                            starSpacing="5px"
                        />
                        <div style = {{'margin-top': '10%',}}>
                            <Button style = {{'margin-right': '20px'}} onClick = {this.submitHandler} 
                            size = 'big' color = 'blue' disabled = {this.state.rating === 0}>Submit</Button>
                            <Button onClick = {this.cancelHandler} size = 'big' color = 'blue'>Cancel</Button>
                        </div>
                    </Label>
                    <Label style = {loginStyle}>
                        <h2>Log in first to rate the bangumi</h2>
                        <div style = {{'margin-top': '10%'}}>
                            <Button style = {{'margin-right': '20px'}} color = 'blue' size = 'big' 
                            onClick = {this.okHandler}>OK</Button>
                            <Button color = 'blue' size = 'big' onClick = {this.loginHandler}>Log In</Button>
                        </div>
                    </Label>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser
    }
}

export default connect(mapStateToProps)(DetailPage);