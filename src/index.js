import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Title from './title/title';
import Main from './main/main';


class Root extends React.Component {

    constructor(props) {
        super(props);
        this.state = {displayName: 'placeholder'};
        this.setData = this.setData.bind(this);
      }

    setData(data) {
        let obj = {};
        obj[data[0]] = data[1];
        this.setState(obj);
    }

    render() {
        return (
            <>
                <Title setData={this.setData} />
                <Main displayName={this.state.displayName} />
            </>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
