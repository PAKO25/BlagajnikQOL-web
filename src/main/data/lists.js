import React from "react";
import { getData, db, getDoc, doc, auth, storeData, deleteDoc, arrayRemove, updateDoc } from './../../firebase';


class Lists extends React.Component {

    constructor(props) {
        super(props);
        this.state = { jsx: "<p>No lists</p>" };
        this.clickOnList = this.clickOnList.bind(this);
        this.rightClickOnList = this.rightClickOnList.bind(this);
    }

    componentDidMount() {
        window.addEventListener('showLists', async () => {

            const groupName = getData('groupShown');

            const ref = doc(db, "Userdata", auth.currentUser.uid, groupName, 'main');

            const docSnap = await getDoc(ref);
            const lists = docSnap.data().liste;

            storeData(['listsShown', lists]);
            
            let jsx = lists.map((list, index) =>
                <button key={index} className="tileBtn" onClick={this.clickOnList} value={list} onContextMenu={this.rightClickOnList}>
                    {list}</button>
            );
            this.setState({ ...this.state, jsx: jsx })

        })
    }

    clickOnList(e) {
        storeData(['listShown', e.target.value]);
        window.dispatchEvent(getData('showSeznam'));
    }

    async rightClickOnList(e) {
        e.preventDefault();
        //delete list
        const list = e.target.value;
        const sure = window.confirm(`Do you want to remove "${list}"?`)
        if (!sure) return;

        //delete doc
        const groupName = getData('groupShown');
        let ref = doc(db, "Userdata", auth.currentUser.uid, groupName, list);
        await deleteDoc(ref);

        //delete doc v mainu
        ref = doc(db, "Userdata", auth.currentUser.uid, groupName, 'main');
        let obj = {
            liste: arrayRemove(list),
        };
        await updateDoc(ref, obj);

        window.dispatchEvent(getData('showLists'));
    }

    render() {
        return (
            <>
            <p>Tip: right click a list to delete it.</p>
                {this.state.jsx}
            </>
        )
    }
}

export default Lists;