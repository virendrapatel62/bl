
const { State } = require('../models/city_state')
const { City } = require('../models/city_state')
const fs = require('fs');
const logger = require('debug')('startup - citystate collection : ')


async function ab() {
    let rawdata = fs.readFileSync('data');
    let state = JSON.parse(rawdata);
    logger(state.states);
    for (i in state.states) {
        let st = state.states[i].state;
        let dis = state.states[i].districts;

        await save(st, dis)

    }
}
let sttt = 1;
let ctt = 1;
async function save(name, cities) {
    const state = new State({
        name: name
    })
    var stid = await state.save();
    logger(" State :    " + sttt++);
    for (i in cities) {

        let c = cities[i];
        let city = new City({
            name: c,
            state: stid._id
        })
        r = await city.save();
        logger(" City :  " + ctt++);
    }
}
async function cheak() {
    const count = await State.find().select().count();
    logger("State count :  "+ count);
    if (count ==  0){
        logger('saving states now...');
        
        logger(' No state')
        ab();
    }
}


// checked weather city and state data is in database or not 
// if not it save the data
cheak();
