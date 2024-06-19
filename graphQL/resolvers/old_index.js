const { eventsLookUp, userLookUp, eventLookUp, transformEvent, transformDateToISO} = require('../../helpers')
const { EventModel, UserModel, BookingModel } = require('./../../models')
const bcryptjs = require('bcryptjs')


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
    bookings: async ( args, req) => {
        try {
            const getBookings = await BookingModel.find({})
            return getBookings.map( booking => {
                return { ...booking._doc, 
                    user : userLookUp.bind(this, booking._doc.user),
                    event : eventLookUp.bind(this, booking._doc.event),
                    createdAt : transformDateToISO( booking._doc.createdAt), 
                    updatedAt : transformDateToISO( booking._doc.updatedAt),
                }
            })
        } catch (error) {
            throw error
        }
    },
    createEvent: async ( agrs , req) => {
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
        
    },
    createUser: async( agrs, req) => {
        try {   
            const userExists = await UserModel.findOne({ email : agrs.userInput.email })
            if(userExists){
                throw new Error(" User Exists ")
            }
            const userPassword  = await bcryptjs.hash(agrs.userInput.password,12)
            const payload = {
                email: agrs.userInput.email,
                password: userPassword
            }
            const userCreate = await UserModel.create(payload) 
            const data = { ...userCreate._doc}
            return data
        } catch (error) {
            throw error
        }
    },
    createBooking: async( args, req) => {
        try {
            const eventExists = await EventModel.findOne({ _id : args.eventID})
            const payload = {
                event : eventExists ,
                user : "665d7dc665a932cc4537888a"
            }
            const addBooking  = await BookingModel.create(payload)
            return {...addBooking._doc,                  
                user : userLookUp.bind(this, addBooking._doc.user),
                event : eventLookUp.bind(this, addBooking._doc.event),
                createdAt : transformDateToISO( addBooking.createdAt), 
                updatedAt : transformDateToISO( addBooking.updatedAt)
            }
        } catch (error) {
            throw error
        }
    },
    cancelBooking : async ( args, req) => {
        try {
            const getBooking = await BookingModel.findById(args.bookingID).populate('event')
            const data = transformEvent(getBooking.event)
            await BookingModel.deleteOne({ _id : args.bookingID})
            return data
        } catch (error) {
            throw error
        }
    }
}