async function post(parent, args, context, info){
	const userId = getUserId(context);

	const newLink = await context.prisma.link.create({
		data: {
			url: args.url,
			description: args.description,
			postedby: { connect: { id: userId }},
		}
	})

	context.pubsub.publish("NEW_LINK", newLink);
	return newLink;
}