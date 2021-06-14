const config = require("../config.json");

module.exports = {
	name: 'link',
	description: 'Link your wallet address to your Discord account.',
	execute(message, args, db) {
		if(message.channel.type === "dm") {
			if (args.length != 1) {
				message.reply('Proper syntax is: `'+config.PREFIX+'link <address>`');
			} else if (args[0].length == 95) {
				db.createLink(message.author.id, args[0], function(error) {
					if (error) {
						message.reply('There was an error linking your address. Please contact the bot administrator to report this problem.');
					} else {
						message.reply('Your address was successfully linked!');
					}
				});
			} else {
				message.reply('XMR Wallet Addresses should be 95 characters.');
			}
		} else {
			message.delete({ reason: 'That command can only be used in a DM.' });
			message.channel.send(message.author.toString()+' That command can only be used in a DM.');
		}
	}
};
