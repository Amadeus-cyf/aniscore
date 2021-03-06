import React, {Component} from 'react';
import axios from 'axios';
import Navibar from '../Home/MainMenu/Navibar/navibar.jsx';
import {Button, Form} from 'semantic-ui-react';
import {container, title, subtitle, imageStyle, textStyle} from './signup.module.scss';

class Signup extends Component {
     constructor() {
         super();
         this.state = {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            messageDisplay: 'none',
            emailExistError: 'none',
            emailInvalidError: 'none',
            usernameExistsError: 'none',
            passwordInvalidError: 'none',
            passwordSameError: 'none',
            usernameStyle: {
                display: 'none',
            },
            emailExistStyle: {
                display: 'none',
            },
            emailInvalidStyle: {
                display: 'none',
            },
            passwordInvalidStyle: {
                display: 'none',
            },
            passwordSameStyle: {
                display: 'none',
            }
         }
         this.usernameHandler = this.usernameHandler.bind(this);
         this.emailHandler = this.emailHandler.bind(this);
         this.passwordHandler = this.passwordHandler.bind(this);
         this.confirmHandler = this.confirmHandler.bind(this);
         this.submitHandler = this.submitHandler.bind(this);
         this.cancelHandler = this.cancelHandler.bind(this);
     }

    usernameHandler(event) {
        this.setState({
        username: event.target.value,
        usernameStyle: {
            display: 'none',
        },
        usernameExistsError: 'none',
        })
    }

    emailHandler(event) {
        this.setState({
            email: event.target.value,
            emailExistStyle: {
                display: 'none',
            },
            emailInvalidStyle: {
                display: 'none',
            },
            emailExistError: 'none',
            emailInvalidError: 'none',
        })
    }

    passwordHandler(event) {
        this.setState({
            password: event.target.value,
            passwordInvalidStyle: {
                display: 'none',
            },
            passwordInvalidError: 'none',
        })
    }

    confirmHandler(event) {
        this.setState({
            confirmPassword: event.target.value,
            passwordSameStyle: {
                display: 'none',
            },
            passwordSameError: 'none',
        })
    }

    submitHandler() {
        if (!this.state.email.includes('@')) {
            this.setState({
                emailInvalidError: 'error',
                emailInvalidStyle: {
                    display: 'block',
                }
            })
            return;
        }
        if (this.state.password.length < 8) {
            this.setState({
                passwordInvalidError: 'error',
                passwordInvalidStyle: {
                    display: 'block',
                }
            })
            return;
        }
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({
                passwordSameError: 'error',
                passwordSameStyle: {
                    display: 'block',
                }
            })
            return;
        }
        axios('api/auth/signup', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            data: {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password, 
            }
        }).then(response => {
            if (response.data.message === 'Username already exists') {
                this.setState({
                    usernameExistsError: 'error',
                    usernameStyle: {
                        display: 'block',
                    }
                })
            } else if (response.data.message === 'Email already exists') {
                this.setState({
                    emailExistError: 'error',
                    emailExistStyle: {
                        display: 'block',
                    }
                })
            } else {
                alert('Account created');
                this.props.history.push('/login');
            }
        }).catch(err => {
            alert(err);
        })
    }

    cancelHandler() {
        this.props.history.push('/login');
    }

    render() {
        let formStyle = {
            'font-family': "'PT Sans Caption', sans-serif",
            'font-size': '15pt',
            'text-align': 'center',
            background: 'white',
            margin: '5% 17% 5% 0.5%',
        }
        let buttonStyle = {
            'font-family': "'PT Sans Caption', sans-serif",
            'font-size': '13pt',
            margin: '20px 25px 20px 25px',
        }
        let isvalid = (this.state.username === '' || this.state.email === '' 
        || this.state.password === '' || this.state.confirmPassword === '');
        return(
            <div>
                <Navibar history = {this.props.history}/>
                <div className = {container}>
                    <div className = {imageStyle}>
                    </div>
                    <Form onSubmit = {this.submitHandler} style = {formStyle}>
                        <h3 className = {title}>Sign Up</h3>
                        <Form.Field>
                            <div className = {subtitle}>
                                Username
                            </div>
                            <p style = {this.state.usernameStyle} className = {textStyle}>Username already exists</p>
                            <Form.Input size = 'big' name = 'username' value = {this.state.username}
                                onChange = {this.usernameHandler} type = 'text' placeholder = 'please enter your username'
                                error = {this.state.usernameExistsError === 'error'}/>
                            <div className = {subtitle}>
                                Email
                            </div>
                            <p style = {this.state.emailExistStyle} className = {textStyle}>Email address already exists</p>
                            <p style = {this.state.emailInvalidStyle} className = {textStyle}>Invalid email address</p>
                            <Form.Input size = 'big' name = 'email' value = {this.state.email}
                            onChange = {this.emailHandler} type = 'text' placeholder = 'please enter your email address'
                            error = {this.state.emailExistError === 'error' || this.state.emailInvalidError === 'error'}/>
                            <div className = {subtitle}>
                                Password
                            </div>
                            <p style = {this.state.passwordInvalidStyle} className = {textStyle}>Password must have at least 8 characters</p>
                            <Form.Input size = 'big' name = "password" value = {this.state.password}
                            onChange = {this.passwordHandler} type = 'password' placeholder = 'password must be at least 8 characters'
                            error = {this.state.passwordInvalidError === 'error'}/>
                            <div className = {subtitle}>
                                Confirm your Password
                            </div>
                            <p style = {this.state.passwordSameStyle} className = {textStyle}>Passwords are not the same</p>
                            <Form.Input size = 'big' name = "confirm password" value = {this.state.confirmPassword}
                            onChange = {this.confirmHandler} type = 'password' placeholder = 'enter password again'
                            error = {this.state.passwordSameError === 'error'}/>
                        </Form.Field>
                        <Button type = 'submit' style = {buttonStyle} disabled={isvalid} color = 'blue'>Create Account</Button>
                        <Button style = {buttonStyle} onClick = {this.cancelHandler} color = 'blue'>Cancel</Button>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Signup;