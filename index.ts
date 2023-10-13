import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';


const schema = require('./schema/schema')


const app = express();


app.use('/graphql', graphqlHTTP({

    schema,
    graphiql:true

}));

app.listen(3001, () => {

    console.log('Listening on port 3001');

});
