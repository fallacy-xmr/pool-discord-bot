module.exports = {
	name: 'unlink',
	description: 'Unlink your wallet address from your Discord account.',
	execute(message, args, db) {
		if(message.channel.type === "dm") {
			db.removeLink(message.author.id, function(error) {
				if (error) {
					message.reply('There was an error unlinking your address. Please contact the bot administrator to report this problem.');
				} else {
					message.reply('Your address was successfully unlinked.');
				}
			});
		} else {
			message.channel.send(message.author.toString()+' That command can only be used in a DM.');
		}
	}
};
