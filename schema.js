import {GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID} from "graphql";
import fetch from "node-fetch";

const BASE_URL = "http://localhost:3000";

function getPersonById(id) {
    return fetch(`${BASE_URL}/persons/${id}`)
        .then(res => res.json())
}

function getEventById(id){
    return fetch(`${BASE_URL}/events/${id}`)
        .then(res => res.json())
}

function getVenueById(id){
    return fetch(`${BASE_URL}/venues/${id}`)
        .then(res => res.json())
}

function findUserByEvent(id) {
    return fetch(`${BASE_URL}/persons?event=${id}`)
        .then(res => res.json())
}

function findCommentsByEvent(id){
	return fetch(`${BASE_URL}/comments?event=${id}`)
        .then(res => res.json())
}


const CommentType = new GraphQLObjectType({
    name: 'Comment',
    description: '...',

    fields: () => ({
        text: {
            type: GraphQLString,
            resolve: (res) => res.body
        },
        author: {
            type: PersonType,
            resolve: (res) => getPersonById(res.author)
        }
    })

});

const PersonType = new GraphQLObjectType({
    name: 'Person',
    description: '...',

    fields: () => ({
		id: {
			type: GraphQLID,
			resolve: res => res.id
		},
		image: {
			type: GraphQLString,
			resolve: res => `https://randomuser.me/api/portraits/lego/${res.id % 8}.jpg`
		},
        name: {
            type: GraphQLString,
            resolve: (res) => res.name
        },
        firstName: {
            type: GraphQLString,
            resolve: (res) => res.firstName
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve: (res) => fetch(`${BASE_URL}/comments?author=${res.id}`).then(res => res.json())
        }
    })
});

const VenueType = new GraphQLObjectType({
    name: 'Venue',
    description: '...',

    fields: {
        id: {
            type: GraphQLID,
            resolve: res => res.id
        },
        title: {
            type: GraphQLString,
            resolve: res => res.title
        },
        address: {
            type: GraphQLString,
            resolve: res => res.address
        },
        city: {
            type: GraphQLString,
            resolve: res => res.city
        },
        zip: {
            type: GraphQLString,
            resolve: res => res.zip
        },
    }
})

const EventType = new GraphQLObjectType({
    name: 'Event',
    description: '...',

    fields: {
        id: {
            type: GraphQLString,
            resolve: res => res.id
        },
        title: {
            type: GraphQLString,
            resolve: res => res.title
        },
        description: {
            type: GraphQLString,
            resolve: res => res.description
        },
        date: {
            type: GraphQLString,
            resolve: res => res.date
        },
        venue: {
            type: VenueType,
            resolve: res => getVenueById(res.venue)
        },
        rsvps: {
        	type: new GraphQLList(PersonType),
			resolve: res => findUserByEvent(res.id)
		},
		comments: {
        	type: new GraphQLList(CommentType),
			resolve: res => findCommentsByEvent(res.id)
		}
    }
});

const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: '',

    fields: {
        person: {
            type: PersonType,
            args: {id: { type: GraphQLString} },
            resolve: (root, args) => getPersonById(args.id)
        },
        event: {
            type: EventType,
            args: {id: { type: GraphQLString} },
            resolve: (root, args) => getEventById(args.id)
        }
    }
});

export default new GraphQLSchema({
    query: QueryType
});