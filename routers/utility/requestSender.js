function getAddresses(query) {
   
    const r2 = require("r2");
    const url = `https://apis.mapmyindia.com/advancedmaps/v1/l2dlc7zabjd6wx8ekzjo2ezzvt21i8b3/geo_code?addr=${query}`;
    const getData = async url => {
        try {
            const response = await r2(url).json;
            return response;
        } catch (error) {
            console.log(error);
            return "";
        }
    };
    return getData(url); 
}

module.exports = { getAddresses }