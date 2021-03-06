import React, {Component} from 'react';
import {Button} from 'semantic-ui-react';
import {boxStyle, disableBoxStyle, buttonStyle} from './commentBox.module.scss';

class CommentBox extends Component {
    render() {
        if (this.props.currentUser !== 'undefined') {
            return (
                <div>
                    <textarea className = {boxStyle} value = {this.props.newComment}
                    onChange = {this.props.inputComment} placeholder = 'Add a comment'></textarea>
                    <div className = {buttonStyle}>
                        <Button content='Add Comment' labelPosition='left' icon='edit' color = 'blue' size = 'big'
                        onClick = {this.props.submitComment} disabled = {this.props.newComment === ''}/>
                        <Button style = {{'margin-left': '20px'}} onClick = {this.props.cancelComment} color = 'blue' 
                        size = 'big'>Cancel</Button>
                    </div>
                </div>
            )
        } else {
            return(
                <div className = {disableBoxStyle}>
                    You need to log in to comment
                </div>
            )
        }
    }
}

export default CommentBox;