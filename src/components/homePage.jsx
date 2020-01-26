import React from 'react';
import Form from "./form";
import "../css/homeCss.css"

class HomePage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            buttonClick: false,
        };
    }

    handleClick= () => {
        this.setState({
            buttonClick: !this.state.buttonClick,
        })
    };

    handleChildClick = (e) => {
        e.stopPropagation();
    };

    render() {
        return (
            <div>
                <button type="button" className="btn open_form_button" onClick={() => this.handleClick()}>Open Form</button>
                {this.state.buttonClick &&
                    <div className={"form_window"} onClick={() => this.handleClick()}>
                        <Form handleChildClick={() => this.handleChildClick} />
                    </div>
                }
            </div>
        )
    }
}

export default HomePage;
