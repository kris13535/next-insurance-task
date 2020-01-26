import axios from "axios";

const api = {
    async getManufacturerData() {
        try {
           const data = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?format=json&page=2`);
           return data.data;
        } catch (error) {
            console.log(error);
        }
    },

    async getMakeData(manufacturer) {
        try {
            const data = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/GetMakeForManufacturer/${manufacturer}?format=json`);
            return data.data;
        } catch (error) {
            console.log(error);
        }
    },

    async getModelData(make) {
        try {
            const data = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${make}?format=json`);
            return data.data;
        } catch (error) {
            console.log(error);
        }
    },
};



export default api;