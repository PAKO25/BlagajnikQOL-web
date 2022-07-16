import React from 'react';
import './main.css';
import Menu from './menu/menu';
import Display from './data/display';
import AddNew from './addnew';
import { signOut, auth } from './../firebase';


class Main extends React.Component {

    constructor(props) {
        super(props)
        this.logOut = this.logOut.bind(this);
    }

    logOut() {
        signOut(auth);
        window.location.reload();
    }

    render() {
        return (
            <div id="main" className='hidden row'>

                <div className="column left1">
                    <Menu />
                </div>

                <div className="column right1">


                    <h1 id="nameField">{this.props.displayName}</h1>
                    <button className='logoutBtn' onClick={this.logOut}>Logout</button>
                    <hr className='line'></hr>

                    <div className='row'>
                        <div className='column left2 limitheight'>
                            <Display />
                        </div>
                        <div className='column right2 limitheight'>
                            <AddNew />
                        </div>
                    </div>


                </div>

            </div>
        );
    }
}

export default Main;