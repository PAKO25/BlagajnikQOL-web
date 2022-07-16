import React from "react";
import menu from './menu.png';
import './menu.css';
import { getData, storeData } from './../../firebase';

class Menu extends React.Component {

    constructor(props) {
        super(props);
        this.back = this.back.bind(this);
        this.clickOnGroup = this.clickOnGroup.bind(this);
        this.clickOnList = this.clickOnList.bind(this);
        this.state = {groups: <li>Nothing here!</li>, lists: <li>Nothing here!</li>};
    }

    back() {
        //gumb za nazaj
        const whatIsDisplayed = getData('whatIsDisplayed');

        switch (whatIsDisplayed) {
            case 'groups':
                alert("Try logging out");
                break;
            case 'lists':
                window.dispatchEvent(getData('showGroups'));
                break;
            case 'seznam':
                window.dispatchEvent(getData('showLists'));
                break;
        }
    }

    componentDidMount() {
        //ko se pokaze lista dobi vse grupe in jih napise
        window.addEventListener('showLists', () => {
            
            let data = getData('groupsShown');
            let jsx = data.map((group, index) =>
                <li key={index} onClick={this.clickOnGroup} id={group}>{group}</li>
            );
            this.setState({ ...this.state, groups: jsx })

        })
        //ko se pokaze seznam dobi vse liste in jih napise
        window.addEventListener('showSeznam', () => {
            
            let data = getData('listsShown');
            let jsx = data.map((list, index) =>
                <li key={index} onClick={this.clickOnList} id={list}>{list}</li>
            );
            this.setState({ ...this.state, lists: jsx })

        })
    }

    clickOnGroup(e) {
        storeData(['groupShown', e.target.id]);
        window.dispatchEvent(getData('showLists'));
    }
    clickOnList(e) {
        storeData(['listShown', e.target.id]);
        window.dispatchEvent(getData('showSeznam'));
    }

    render() {
        return (
            <>
                <div className='imgborder'>
                    <img className='menuimg' src={menu} alt="" />
                </div>
                <br />
                <p className="textForListedBack margintop">Groups: </p>
                <ul>{this.state.groups}</ul>
                <br/>
                <p className="textForListedBack">Lists: </p>
                <ul>{this.state.lists}</ul>

                <button onClick={this.back} className="backBtn">Back</button>
            </>
        )
    }
}

export default Menu;