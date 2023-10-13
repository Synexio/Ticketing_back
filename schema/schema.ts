import {graphql} from "graphql";

const { GraphQLObjectType, GraphQLString,
    GraphQLID, GraphQLBoolean, GraphQLSchema } = graphql;



const fakeTicketDatabase = [
    { name:"Ticket 1", isUsed:432 , id:1},
    { name: "Ticket 2", isUsed: 32, id: 2},
    { name: "Ticket 3", isUsed: 532, id: 3 }
]


const TicketType = new GraphQLObjectType({
    name: 'Ticket',
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString },
        isUsed: { type: GraphQLBoolean }
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        Ticket: {
            type: TicketType,
            //argument passed by the user while making the query
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //Here we define how to get data from a database source


                //this will return the Ticket with id passed in argument by the user
                return fakeTicketDatabase.find((item) => { return item.id == args.id});
            }
        }
    }
});

//Creating a new GraphQL Schema, with options query which defines query
//we will allow users to use it when they are making requests.
module.exports = new GraphQLSchema({
    query: RootQuery
});