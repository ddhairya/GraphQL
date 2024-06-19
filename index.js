const express  = require('express')
const graphqlHttp = require('express-graphql').graphqlHTTP
const mongoose = require('mongoose')
const rootSchema = require('./graphQL/schemas/index')
const rootValue = require('./graphQL/resolvers/index')
const isAuth = require('./middlewares/is-auth')
const app = express()
app.use( express.json())
app.use(isAuth)

app.use('/graphql', graphqlHttp({
    schema: rootSchema,
    rootValue: rootValue,
    graphiql: true

}))

app.listen(3636 , ()=> {
    console.log('Server is running on 3636 port')
    mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.uldehmy.mongodb.net/${process.env.MONGO_DB}`)
        .then( () => console.log("MongoDB connected"))
        .catch(e => {
            console.log(e)
        })
})
