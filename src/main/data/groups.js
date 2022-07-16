import React from "react";
import { getData, db, setDoc, getDoc, doc, auth, serverTimestamp, storeData, arrayRemove, updateDoc, deleteDoc } from './../../firebase';


class Groups extends React.Component {

    constructor(props) {
        super(props);
        this.clickOnGroup = this.clickOnGroup.bind(this);
        this.rightClickOnGroup = this.rightClickOnGroup.bind(this);
        this.state = { jsx: "<p>No groups</p>" }
    }

    componentDidMount() {
        window.addEventListener('showGroups', async () => {
            //logika da dobi vse groupe

            let groups = await chechIfNewUser();
            if (groups == undefined) return;

            storeData(['groupsShown', groups]);

            let jsx = groups.map((group, index) =>
                <button key={index} className="tileBtn" onClick={this.clickOnGroup} value={group} onContextMenu={this.rightClickOnGroup}>
                    {group}</button>
            );
            this.setState({ ...this.state, jsx: jsx })
        })
    }

    clickOnGroup(e) {
        //klikne na grupo

        storeData(['groupShown', e.target.value]);
        window.dispatchEvent(getData('showLists'));
    }

    async rightClickOnGroup(e) {
        e.preventDefault();
        //delete group
        const group = e.target.value;
        const sure = window.confirm(`Do you want to remove "${group}"?`)
        if (!sure) return;

        //delete all lists in group
        let ref = doc(db, "Userdata", auth.currentUser.uid, group, 'main');
        const docSnap = await getDoc(ref);
        const data = docSnap.data();
        const liste = data.liste;
        await deleteDoc(ref);

        liste.forEach(async (lista) => {
            ref = doc(db, "Userdata", auth.currentUser.uid, group, lista);
            await deleteDoc(ref);
        });

        //delete doc v user doc
        ref = doc(db, "Userdata", auth.currentUser.uid);
        let obj = {
            skupine: arrayRemove(group),
        };
        await updateDoc(ref, obj);

        window.dispatchEvent(getData('showGroups'));
    }

    render() {
        return (
            <>
            <p>Tip: right click a group to delete it.</p>
                {this.state.jsx}
            </>
        )
    }
}

async function chechIfNewUser() {
    //preveri če je novi uporabnik, če je ustvari novi file za njega

    const ref = doc(db, 'Userdata', auth.currentUser.uid);

    const docSnap = await getDoc(ref);

    if (docSnap.exists()) {
        return await docSnap.data().skupine;
    } else {

        console.log("No such document!");

        await setDoc(ref, {
            uid: auth.currentUser.uid,
            name: auth.currentUser.displayName,
            createdAt: serverTimestamp(),
            skupine: []
        });
        return undefined;
    }
}

export default Groups;