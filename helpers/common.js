const { EventModel, UserModel } = require('./../models')

const userLookUp = async userId => {
    try {
        const user = await UserModel.findById(userId)
        return { ...user._doc, created_events : eventsLookUp.bind( this, user._doc.created_events)}
    } catch (error) {
        throw error
    }
}

const eventsLookUp = async eventIds => {
    try {
        const events = await EventModel.find({ _id: { $in: eventIds } })
        return events.map(event => {return transformEvent(event)})
    } catch (error) {
        throw error
    }
}

const eventLookUp = async eventID => {
    try {
        const event = await EventModel.findById(eventID)
        return transformEvent(event)
    } catch (error) {
        throw error
    }
}

const transformEvent = event => {
    return { ...event._doc, date: new Date(event.date).toISOString(), created_by: userLookUp.bind( this, event._doc.created_by)}
}

const transformDateToISO = date => new Date(date).toISOString()

module.exports = {
    userLookUp,
    eventsLookUp,
    eventLookUp,
    transformEvent,
    transformDateToISO,
}