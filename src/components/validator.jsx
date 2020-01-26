export const field = ({name, value='', isRequired = false}) => {

    const settings = {
        name,
        value,
        errors: [],
        validations:{}
    };
    if(isRequired){
        settings.validations.required = true;
    }
    return settings;
};

export default (name, value, validations) => {
    const errors = [];
    if(validations.required && required(value)){
        errors.push(`${name} is required`);
    }
    return errors;
}

const required = value => !value;
