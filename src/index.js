const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let links = [
{
	id: 'link-0',
	url: 'www.howtographql.com',
	description: 'Fullstack tutorial for GraphQL'
}];


let idCount = links.length;
const resolvers = {
	// Query: {
	// 	info: () => `This is the API of a Hackernews Clone`,
	// 	feed: () => links,
	// },
	Query: {
		info: () => `This is the API of a Hackernews Clone`,
		feed: () => async (parent, args, context) => {
			return context.prisma.link.findMany()
		},
	},
	Link: {
		id: (parent) => parent.id,
		description: (parent) => parent.description,
		url: (parent) => parent.url
	},

	Mutation: {
		// post: (parent, args) => {
		// 	const link = {
		// 		id: `link-${idCount++}`,
		// 		description: args.description,
		// 		url: args.url
		// 	}
		// 	links.push(link);
		// 	return link;
		// },
		post: (parent, args, context, info) => {
			const newLink = context.prisma.link.create({
				data: {
					url: args.url,
					description: args.description,
				},
			})
			return newLink;
		},
		updateLink(parent, args){
			let indexOfLink = -1;
			let updateLinks = links.map((link, index) => {
				if(args.id == link.id){
					link.description = args.description;
					link.url = args.url;
					indexOfLink = index;
				}
				return link;
			});
			if(indexOfLink == -1) return 'error';
			return links[indexOfLink];
		},
		deleteLink(parent, args){
			let updateLinks = links.map((link, index) => {
				if(args.id == link.id){
					links.splice(index, 1);
				}
				return link;
			});
		}

	}
}

const server = new ApolloServer({
	typeDefs: fs.readFileSync(
		path.join(__dirname, 'schema.graphql'), 'utf8'),
	resolvers,
	context: {
		prisma,
	}
})

server.listen().then( ({url}) => {
	console.log(`Server is running on ${url}`);
}).catch(err => console.log(err));