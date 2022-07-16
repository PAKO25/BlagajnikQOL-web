import React from 'react';
import './title.css';
import bc from './background.png';
import { auth, signInWithPopup, provider, onAuthStateChanged } from './../firebase';

class Title extends React.Component {

    constructor(props) {
        super(props);
        this.state = { shown: "shown" };
        this.login = this.login.bind(this);

        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.props.setData(['displayName', user.displayName]);
                this.setState({ shown: "hidden" });
                document.getElementById('main').className = "shown row";
            }
        });
    }

    render() {
        return (
            <div className={this.state.shown}>

                <div className='content'>
                    <h1 className='titleText'><strong>Blagajnik QOL</strong></h1>
                    <button id="loginBtn" onClick={this.login}>Login</button>
                </div>

                <img className='titleimg' src={bc} alt=""></img>

            </div>
        );
    }

    async login(e) {
        e.preventDefault();

        await signInWithPopup(auth, provider).then(result => {
            this.props.setData(['displayName', result.user.displayName]);
        })

        this.setState({ shown: "hidden" });
        document.getElementById('main').className = "shown row";
    }
}

export default Title;