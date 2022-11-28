const path = require("path")
const addPath = dir => path.join(__dirname,dir);

module.exports = {
    webpack: {
        alias:{
            "@": addPath("src")
        },
    }
};