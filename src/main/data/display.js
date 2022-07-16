import React from "react";
import './display.css';
import Groups from "./groups";
import Lists from "./lists";
import Seznam from "./seznam";
import { storeData, getData, onAuthStateChanged, auth } from './../../firebase';

class Display extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            groupsVisible: 'hidden',
            listsVisible: 'hidden',
            seznamVisible: 'hidden'
        }
    }

    componentDidMount() {
        onAuthStateChanged(auth, (user) => {
            if (user) {

                storeData(['showGroups', new Event('showGroups')]);
                storeData(['showLists', new Event('showLists')]);
                storeData(['showSeznam', new Event('showSeznam')]);

                window.addEventListener('showGroups', () => {
                    //Groups are shown
                    this.setState({ ...this.state, groupsVisible: 'shown', listsVisible: 'hidden', seznamVisible: 'hidden'})
                    storeData(['whatIsDisplayed', 'groups']);
                })
                window.addEventListener('showLists', () => {
                    //Lists are shown
                    this.setState({ ...this.state, listsVisible: 'shown', groupsVisible: 'hidden', seznamVisible: 'hidden'})
                    storeData(['whatIsDisplayed', 'lists']);
                })
                window.addEventListener('showSeznam', () => {
                    //Seznam is shown
                    this.setState({ ...this.state, seznamVisible: 'shown', listsVisible: 'hidden', groupsVisible: 'hidden'})
                    storeData(['whatIsDisplayed', 'seznam']);
                })

                window.dispatchEvent(getData('showGroups'));

            }
        })
    }

    render() {
        return (
            <>
                <div id="groups" className={this.state.groupsVisible}>
                    <Groups />
                </div>

                <div id="lists" className={this.state.listsVisible}>
                    <Lists />
                </div>

                <div id="seznam" className={this.state.seznamVisible}>
                    <Seznam />
                </div>
            </>
        )
    }
}

export default Display;