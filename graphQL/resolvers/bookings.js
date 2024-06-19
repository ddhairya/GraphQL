const { userLookUp,  eventLookUp, transformEvent, transformDateToISO} = require('../../helpers')
const { EventModel,  BookingModel } = require('./../../models')


module.exports = {
   
    bookings: async ( args, req) => {
        if(!req.isAuth){
            throw new Error(" Unauthenticated! ")
        }
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
    createBooking: async( args, req) => {
        if(!req.isAuth){
            throw new Error(" Unauthenticated! ")
        }
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
        if(!req.isAuth){
            throw new Error(" Unauthenticated! ")
        }
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