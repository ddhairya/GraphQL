const { buildSchema } = require('graphql')

module.exports = buildSchema(`
    input EventInput {
        name: String!
        description: String!
        price: Float!
        date: String!
    }

    input UserInput {
        email : String!
        password : String!
    }

    type Booking {
        _id: ID!
        event: Event!
        user: User!
        createdAt: String!
        UpdatedAt: String!
    }

    type Event {
        _id : ID!
        name : String!
        description : String!
        price : Float!
        date : String!
        created_by: User!
    }
    type User {
        _id : ID!
        email: String!
        password : String
        created_events: [Event]
    }
    type Auth {
        userID : ID!
        token : String!
        token_expiry : Int!
    }

    type RootQuery {
        events : [Event!]!
        bookings : [Booking!]!
        login ( email: String!, password: String!) : Auth
    }

    type RootMutation {
        createEvent ( eventInput: EventInput) : Event 
        createUser ( userInput: UserInput) : User
        createBooking ( eventID : ID!) : Booking!
        cancelBooking ( bookingID : ID!) : Event!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)