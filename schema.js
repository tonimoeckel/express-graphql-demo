import {GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList} from "graphql";
import fetch from "node-fetch";

const BASE_URL = "http://localhost:3000";

const CommentType = new GraphQLObjectType({
	name: 'Comment',
	description: '...',

	fields: () => ({
		text: {
			type: GraphQLString,
			resolve: (res) => res.body
		}
	})

});

const PersonType = new GraphQLObjectType({
	name: 'Person',
	description: '...',

	fields: () => ({
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

const QueryType = new GraphQLObjectType({
	name: 'Query',
	description: '',

	fields: () => ({
		person: {
			type: PersonType,
			args: {id: { type: GraphQLString} },
			resolve: (root, args) => fetch(`http://localhost:3000/persons/${args.id}`)
				.then(res => res.json())
		}
	})
});

export default new GraphQLSchema({
	query: QueryType
});