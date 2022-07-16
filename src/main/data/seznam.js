import React from "react";
import './seznam.css';
import { getData, db, getDoc, doc, auth, updateDoc, storeData, deleteField } from './../../firebase';


class Seznam extends React.Component {

    constructor(props) {
        super(props);
        this.state = { jsx: '<p>No humans</p>' }
        this.onChecked = this.onChecked.bind(this);
        this.removePerson = this.removePerson.bind(this);
    }

    componentDidMount() {
        window.addEventListener('showSeznam', async () => {

            const listName = getData('listShown');
            const groupName = getData('groupShown');

            const ref = doc(db, "Userdata", auth.currentUser.uid, groupName, listName);
            const docSnap = await getDoc(ref);
            const data = docSnap.data();
            
            let seznam = Object.keys(data)
            Object.values(data).forEach((value, i) => {
                seznam[i] = [seznam[i], value]
            })

            seznam.sort();

            //  [ ['name', false],['name2', true],['name3', true] ]
            storeData(['humansShown', seznam]);

            let jsx = seznam.map((list, index) =>

                <div className="clovek" key={index}>
                    <p className="clovekTxt" onClick={this.removePerson}>{list[0]}</p>
                    <label className="switch">
                        <input type="checkbox" id={list[0]} checked={list[1]} onChange={this.onChecked} />
                        <span className="slider round"></span>
                    </label>
                </div>

            );
            this.setState({ ...this.state, jsx: jsx })

        })
    }

    async onChecked(e) {
        //updatedoc ne dela nwm zakaj
        const listName = getData('listShown');
        const groupName = getData('groupShown');
        let checked = e.target.checked;

        const ref = doc(db, "Userdata", auth.currentUser.uid, groupName, listName);
        let obj = {};
        obj[e.target.id] = checked;

        if (!checked) {
            //off
            setTimeout(() => { e.target.checked = false; }, 30);
        } else {
            //on
            setTimeout(() => { e.target.checked = true; }, 30);
        }
        await updateDoc(ref, obj);
    }

    async removePerson(e) {
        //delete person
        const human = e.target.innerText;
        const sure = window.confirm(`Do you want to remove "${human}"?`)
        if (!sure) return;

        const listName = getData('listShown');
        const groupName = getData('groupShown');
        const ref = doc(db, "Userdata", auth.currentUser.uid, groupName, listName);
        let obj = {};
        obj[human] = deleteField();
        await updateDoc(ref, obj);

        window.dispatchEvent(getData('showSeznam'));
    }

    render() {
        return (
            <>
            <p>Tip: click on a person to remove him</p>
                {this.state.jsx}
            </>
        )
    }
}

export default Seznam;