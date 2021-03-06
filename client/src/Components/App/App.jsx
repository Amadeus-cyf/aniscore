import React, {Component} from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import HomePage from '../Home/HomePage/homepage.jsx';
import SeasonBangumi from '../Home/SeasonBangumi/seasonBangumi.jsx';
import AllBangumi from '../Home/AllBangumi/allBangumi.jsx';
import UpcomingBangumi from '../Home/UpcomingBangumi/upcomingBangumi.jsx';
import Ranking from '../Home/Ranking/ranking.jsx';
import RecentBangumi from '../RecentBangumi/recentBangumi.jsx';
import NewBangumi from '../NewBangumi/newBangumi.jsx';
import SearchResult from '../SearchResult/searchResult.jsx';
import DetailPage from '../DetailPage/detailPage.jsx';
import Login from '../Login/login.jsx';
import Signup from '../Signup/signup.jsx';
import Logout from '../Logout/logout.jsx';
import UserProfile from '../User/UserProfile/userProfile.jsx';
import Bangumi from '../User/Bangumi/bangumi.jsx';
import FollowingList from '../User/FollowingList/followingList.jsx';
import FollowerList from '../User/FollowerList/followerList.jsx';
import EditAvatar from '../User/EditAvatar/editAvatar.jsx';
import EditBackground from '../User/EditBackground/editBackground.jsx';

class App extends Component {
  render() {
    return(
        <HashRouter>
          <Switch>
            <Route exact path = '/' component = {HomePage}/>
            <Route exact path = '/bangumi' component = {AllBangumi}/>
            <Route exact path = '/bangumi/season' component = {SeasonBangumi}/>
            <Route exact path = '/bangumi/:year/:season' component = {RecentBangumi}/> 
            <Route exact path = '/newbangumi' component = {NewBangumi}/>
            <Route exact path = '/upcomingbangumi' component = {UpcomingBangumi}/> 
            <Route exact path = '/rank' component = {Ranking}/>
            <Route exact path = '/search/:keyword' component = {SearchResult}/>
            <Route exact path = '/detail/:anime_id' component = {DetailPage}/>
            <Route exact path = '/login' component = {Login}/>
            <Route exact path = '/signup' component = {Signup}/>
            <Route exact path = '/logout' component = {Logout}/>
            <Route exact path = '/user/userProfile/:user_id' component = {UserProfile}/>
            <Route exact path = '/user/scoreBangumi/:user_id' component = {Bangumi}/>
            <Route exact path = '/user/following/:user_id' component = {FollowingList}/>
            <Route exact path = '/user/follower/:user_id' component = {FollowerList}/>
            <Route exact path = '/user/editAvatar' component = {EditAvatar}/>
            <Route exact path = '/user/editBackground' component = {EditBackground}/>
          </Switch>
        </HashRouter>
    )
  }
}

export default App;