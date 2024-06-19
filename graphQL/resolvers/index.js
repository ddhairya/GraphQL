const BookingResolver = require('./bookings')
const EventResolver = require('./events')
const UserResolver = require('./users')

module.exports = {
    ...BookingResolver,
    ...EventResolver,
    ...UserResolver,
}