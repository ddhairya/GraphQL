const { transformEvent} = require('../../helpers')
const { EventModel, UserModel } = require('./../../models')


module.exports = {
    events: async (agrs, req) => {
        try {            
            const getEvents = await EventModel.find({})
            const data = getEvents.map( event => { return transformEvent(event)})
            return data
        } catch (error) {
            throw error
        }
    },
    createEvent: async ( agrs , req) => {
        if(!req.isAuth){
            throw new Error(" Unauthenticated! ")
        }
        try {
            const payload = {
                name: agrs.eventInput.name,
                description: agrs.eventInput.description,
                price: +agrs.eventInput.price,
                created_by: "665d7dc665a932cc4537888a"
            }

            const eventCreate = await EventModel.create(payload)
            const data = transformEvent(eventCreate)
            await UserModel.updateMany({ _id : '665d7dc665a932cc4537888a' }, {  $push: { created_events : data._id }})
            return data
            
        } catch (error) {
            throw error
        }
        
    }
}