import React from "react";
import './addnew.css';
import { getData, auth, doc, updateDoc, arrayUnion, setDoc, db, getDoc } from './../firebase';

class AddNew extends React.Component {

    constructor(props) {
        super(props);
        this.addGroup = this.addGroup.bind(this);
        this.addList = this.addList.bind(this);
        this.addHuman = this.addHuman.bind(this);
        this.state = {
            groupsVisible: 'hidden',
            listsVisible: 'hidden',
            seznamVisible: 'hidden',
            defaultClass: ' addField'
        }
    }

    componentDidMount() {
        window.addEventListener('showGroups', () => {
            //Groups are shown
            this.setState({ ...this.state, groupsVisible: 'shown', listsVisible: 'hidden', seznamVisible: 'hidden' })
        })
        window.addEventListener('showLists', () => {
            //Lists are shown
            this.setState({ ...this.state, listsVisible: 'shown', groupsVisible: 'hidden', seznamVisible: 'hidden' })
        })
        window.addEventListener('showSeznam', () => {
            //Seznam is shown
            this.setState({ ...this.state, seznamVisible: 'shown', listsVisible: 'hidden', groupsVisible: 'hidden' })
        })
    }

    render() {
        return (
            <>
                <div id="addGroupField" className={this.state.groupsVisible + this.state.defaultClass}>
                    <h2>New group</h2>
                    <p>Group name:</p>
                    <input id="groupName" className="inputData" type="text" placeholder="Example group" />
                    <p>People in the group:</p>
                    <input id="groupPeople" className="inputData" type="text" placeholder="joe, sal, murray, brian" />
                    <p>Lists for the group:</p>
                    <input id="groupLists" className="inputData" type="text" placeholder="trip, payment1, football" />
                    <br />
                    <button onClick={this.addGroup} className="addBtn">Add</button>
                </div>

                <div id="addListField" className={this.state.listsVisible + this.state.defaultClass}>
                    <h2>New List</h2>
                    <p>List name:</p>
                    <input id="listName" className="inputData" type="text" placeholder="Example list" />
                    <br />
                    <button onClick={this.addList} className="addBtn">Add</button>
                </div>

                <div id="addHumanField" className={this.state.seznamVisible + this.state.defaultClass}>
                    <h2>New Person</h2>
                    <p>Person name:</p>
                    <input id="humanName" className="inputData" type="text" placeholder="Example name" />
                    <br />
                    <button onClick={this.addHuman} className="addBtn">Add</button>
                </div>
            </>
        )
    }

    async addGroup(e) {
        let groupName = e.target.parentElement.children.groupName.value;
        let groupPeople = e.target.parentElement.children.groupPeople.value;
        let groupLists = e.target.parentElement.children.groupLists.value;

        if ((groupName == undefined || groupName == "") || (groupPeople == undefined || groupPeople == "") || (groupLists == undefined || groupLists == "")) { alert("Please fill out all the fields!"); return; }

        //preoblikuje vse podatke
        groupName = groupName.trim();

        let groupPeopleArr = [];
        groupPeople = groupPeople.split(',');
        groupPeople.forEach(name => {
            groupPeopleArr.push(name.trim());
        })
        let groupListsArr = [];
        groupLists = groupLists.split(',');
        groupLists.forEach(list => {
            groupListsArr.push(list.trim());
        })

        //check if group already exists
        let exist = false;
        let groupsShown = getData('groupsShown');
        groupsShown.forEach(group => { if (group == groupName) exist = true; })
        if (exist) { alert("A group with this name already exists!"); return; }

        //doda skupino v dokument
        let ref = doc(db, 'Userdata', auth.currentUser.uid);
        await updateDoc(ref, {
            skupine: arrayUnion(groupName),
        })

        //ustvari main dokument in novi collection za skupino
        ref = doc(db, "Userdata", auth.currentUser.uid, groupName, 'main');
        await setDoc(ref, {
            liste: groupListsArr,
            ljudje: groupPeopleArr
        })

        //ustavri nove liste v collectionu z ljudmi iz maina
        groupListsArr.forEach(async (list) => {
            let obj = {};
            groupPeopleArr.forEach(human => {
                obj[human] = false;
            })
            ref = doc(db, "Userdata", auth.currentUser.uid, groupName, list);
            await setDoc(ref, obj);
        })

        //updata groupe
        window.dispatchEvent(getData('showGroups'));
    }


    async addList(e) {
        let listName = e.target.parentElement.children.listName.value;
        listName = listName.trim();

        //check if list already exists
        let exists = false;
        getData('listsShown').forEach(list => { if (list == listName) exists = true })
        if (exists) { alert("This list already exists!"); return; }

        //doda listo na listo v main
        let ref = doc(db, "Userdata", auth.currentUser.uid, getData('groupShown'), 'main');
        await updateDoc(ref, {
            liste: arrayUnion(listName),
        })

        //dobi vsa imena
        const docSnap = await getDoc(ref);
        const data = docSnap.data();
        const imena = data.ljudje;

        //ustvari novi doc
        let obj = {};
        imena.forEach(human => {
            obj[human] = false;
        })
        ref = doc(db, "Userdata", auth.currentUser.uid, getData('groupShown'), listName);
        await setDoc(ref, obj);

        //updata liste
        window.dispatchEvent(getData('showLists'));
    }


    async addHuman(e) {
        let humanName = e.target.parentElement.children.humanName.value;
        humanName = humanName.trim();

        //check if human already exists
        let exists = false;
        getData('humansShown').forEach(human => { if (human[0] == humanName) exists = true })
        if (exists) { alert("This person already exists!"); return; }

        //oblikuje v object
        let obj = {};
        obj[humanName] = false;

        //vpraša če želi dodat tega človeka v vse skupine ali samo to
        const addToAllLists = window.confirm("Do you want to add this person to all the lists in this group?");

        if (addToAllLists) {
            //doda v main, potem doda še v vse liste
            let ref = doc(db, "Userdata", auth.currentUser.uid, getData('groupShown'), 'main');
            updateDoc(ref, {
                ljudje: arrayUnion(humanName),
            });
            //doda v vsak dokument posebej
            let lists = getData('listsShown');
            lists.forEach(async (list) => {
                ref = doc(db, "Userdata", auth.currentUser.uid, getData('groupShown'), list);
                await updateDoc(ref, obj);
            })
        } else {
            //doda samo na to listo, ne doda v main
            let ref = doc(db, "Userdata", auth.currentUser.uid, getData('groupShown'), getData('listShown'));
            await updateDoc(ref, obj);
        }

        //updata seznam
        window.dispatchEvent(getData('showSeznam'));
    }
}

export default AddNew;