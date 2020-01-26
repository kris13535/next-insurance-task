import React from 'react';
import "../css/formCss.css"
import validate, {field} from './validator';
import InputErrors from "./inputErrors";
import api from "../server_api/api"

class Form extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            manufacturer:  field({name: 'manufacturer', isRequired: true}),
            make: field({name: 'make', isRequired: true}),
            model: field({name: 'model', isRequired: true}),

            manufacturerData: {},
            makeData: {},
            modelData: {},

            manufacturerOptions: [],
            makeOptions: [],
            modelOptions: [],

            fullForm: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount(){
        const data = await api.getManufacturerData();
        this.setState({manufacturerData:data});
        this.dataListOptions(this.state.manufacturerData,`Mfr_Name`,`manufacturerOptions`);
    };

    dataListOptions(state,key,setState){
        let optionsArray = [];
        state.Results.map((item , i) => {
            return optionsArray.push(item[key])
        });

        this.setState({
            [setState]: optionsArray,
        });
    }

    handleChange({target:{ name,value}}){
        const errors = validate(name, value, this.state[name].validations);
        this.setState({
            [name]: {
                ...this.state[name],
                value,
                errors
            }
        }, () => { name === "manufacturer" ? this.manufacturerChange() : this.makeChange()});

    };

    async manufacturerChange(){
        const validInput = this.state.manufacturerOptions.includes(this.state.manufacturer.value);

        if(validInput){
            const data =  await api.getMakeData(this.state.manufacturer.value);
            this.setState({makeData:data});

            if (typeof(this.state.makeData) != "string"){
                this.dataListOptions(this.state.makeData,`Make_Name`,`makeOptions`);
                document.getElementById("make").disabled = false;
            }
            else {
                this.state.manufacturer.errors = ["This manufacturer have no makes! Please select another manufacturer... "];
                this.setState({manufacturer: this.state.manufacturer});
            }
        }
    };

    async makeChange(){
        const validInput = this.state.makeOptions.includes(this.state.make.value);

        if(validInput) {
            const data = await api.getModelData(this.state.make.value);
            this.setState({modelData: data});

            if (typeof(this.state.modelData) != "string"){
                this.dataListOptions(this.state.modelData, `Model_Name`, `modelOptions`);
                document.getElementById("model").disabled = false;
            }
            else {
                this.state.make.errors = ["This make have no models! Please select another make... "];
                this.setState({make: this.state.make});
            }
        }
    };

    handleSubmit = (event)=> {
        event.preventDefault();

        let isOK = true;
        const validInputModel = this.state.modelOptions.includes(this.state.model.value);
        let obj = {manufacturer: this.state.manufacturer, make: this.state.make, model: this.state.model};

        for (let prop in obj) {
            const fa = this.state[prop];
            const errors = validate(prop, fa.value, fa.validations);
            if (errors.length) {
                isOK = false;
                this.setState({
                    [prop]: {
                        ...this.state[prop],
                        errors
                    }
                });
            }
        }
        if(isOK && validInputModel){
            this.setState({fullForm: true})

        }
    };

    render() {
        return (
            <div>
                <div className={"form_box card"} onClick={ this.props.handleChildClick()}>
                    <h1 className={"headline"}>Select your vehicle</h1>
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <div className={"inputs_div"}>
                                <div className={"form-group"}>
                                    <label htmlFor="inputManufacturer" className={"col-form-label"}>Manufacturer</label>
                                    <div className={"col-sm-10"}>
                                        <input list="manufacturer_datalist" id={"manufacturer"} className={"form-control"} type="text" name="manufacturer" placeholder="Enter manufacturer" onBlur={this.handleChange} />
                                        <datalist id="manufacturer_datalist">
                                            {this.state.manufacturerOptions.map((item, i) => {
                                                return (<option value={item}/>)})
                                            }
                                        </datalist>
                                    </div>
                                    <div className={"error"}><InputErrors errors={this.state.manufacturer.errors}></InputErrors></div>
                                </div>

                                <div className={"form-group"} >
                                    <label htmlFor="inputMake" className={"col-form-label"}>Make</label>
                                    <div className={"col-sm-10"} >
                                        <input list="make_datalist" id={"make"} className={"form-control"} type="text" name="make" placeholder="Enter make" onBlur={this.handleChange} disabled={true}/>
                                        <datalist id="make_datalist">
                                            {this.state.makeOptions.map((item, i) => {
                                                return ( <option value={item}/>)})
                                            }
                                        </datalist>
                                    </div>
                                    <div className={"error"}><InputErrors errors={this.state.make.errors}></InputErrors></div>
                                </div>

                                <div className={"form-group"}>
                                    <label htmlFor="inputModel" className={"col-form-label"}>Model</label>
                                    <div className={"col-sm-10"}>
                                        <input list="model_datalist" className={"form-control"} id={"model"} type="text" name="model" placeholder="Enter model" onBlur={this.handleChange} disabled={true}/>
                                        <datalist id="model_datalist">
                                            {this.state.modelOptions.map((item, i) => {
                                                return ( <option value={item}/>)})
                                            }
                                        </datalist>
                                    </div>
                                    <div className={"error"}><InputErrors errors={this.state.model.errors}></InputErrors></div>
                                </div>
                            </div>

                            {this.state.fullForm ?
                                <div className="alert alert-success" role="alert">
                                    Thank you for submitting the data!
                                </div>
                                :
                                <div className={"form-group"}>
                                    <div className={"submit_div col-sm-10"}>
                                        <button type="submit" className={" btn "}>submit</button>
                                    </div>
                                </div>
                            }
                        </form>
                    </div>

                </div>
            </div>
        )
    }
}

export default Form;
