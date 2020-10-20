process.env.NTBA_FIX_319 = 1;

var TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Read token from environment. If a token isn't specified, exit with error code 1.
var token;
if (!process.env.BOT_TOKEN) {
	console.log("Error! Token not specified in the BOT_TOKEN environment variable ... exiting!");
	process.exit(1);
} else token = process.env.BOT_TOKEN;

var MSG_DEFAULT;
if (!process.env.MSG_DEFAULT) {
	MSG_DEFAULT = "Please choose a menu item:"
} else MSG_DEFAULT = process.env.MSG_DEFAULT;



/* var bio = {
	user_id:"",
	bio_text:""
}; */

const os = require('os');
const fs = require('fs');
var bios = [];
var menu_level = "start";
var temp_text;

// error, info, warn prefixes for colored output on the terminal:
var MSG_TERM_ERROR_PREFIX =  "\x1b[1m\x1b[31mERROR:\x1b[0m ";
var MSG_TERM_INFO_PREFIX = "\x1b[1m\x1b[34mINFO:\x1b[0m ";
var MSG_TERM_WARN_PREFIX = "\x1b[1m\x1b[33mWARN:\x1b[0m ";

// Load package information - we'll use this to print the name and version to the terminal
var package_json = require('./package.json');

// Bot's bio
bios.push({user_id: 838319207, bio_text: "This is BioBot"});

// Print startup message
console.log(MSG_TERM_INFO_PREFIX, "Starting " + package_json.name + " version " + package_json.version + " on " + os.hostname);
console.log(MSG_TERM_INFO_PREFIX, "Running on " + os.platform + " on " + process.arch);

var bot = new TelegramBot(token, {
		polling: true, 
		// request: {
		// 	agentClass: Agent,
		// 	agentOptions: {
		// 		socksHost: init.proxy.host,
		// 		socksPort: parseInt(init.proxy.port),
		// 	   	// If authorization is needed:
		// 	   	// socksUsername: init.proxy.username,
		// 	   	// socksPassword: init.proxy.password
		// 	}
		// }
	});

start_bot();
function start_bot(){
	bot.on('message', (msg) => {
		
		// define entries in the main menu:
		const opts_main_menu = {
	    	reply_to_message_id: msg.message_id,
       		reply_markup: JSON.stringify({
    		keyboard: [ ['Store bio'], ['Lookup'], ]
    		})
		};

		// echo all typed commands to log ... if BOT_DEBUG is set to 1:
		if (process.env.BOT_DEBUG == 1) console.log(MSG_TERM_INFO_PREFIX, "User " + msg.from.first_name + " " + msg.from.last_name +
					" with ID: " + msg.from.id + " entered command: " +  msg.text);
		
		//console.log("msg.forward_from.id: " + msg.forward_from.first_name);
		
		/* get ID - only supported when running in debug mode*/
		if (msg.text == "/id" && process.env.BOT_DEBUG == 1) {
			menu_level = "identify";
			// send a message, to the same chat, with the name and ID of the sender of the attached message
			// quoting the person who triggered "/id".
			bot.sendMessage(msg.chat.id,"Name: " + msg.reply_to_message.from.first_name + "\n" +
			"ID: " + msg.reply_to_message.from.id, {reply_to_message_id: msg.message_id});
		}

		if (msg.text == "identify"){
			// lookup bio and send (or send link) to same chat
			
			/* for next version:
			see if user is subscribed to the bot
			if they are, send response directly via PM
			if they aren't, send invitation to join bot */

			// should we reply to the original message or to the person who sent "ID"?
			// the former would be more convenient, but would cause a lot of unintended pings.

			// the user ID would be msg.reply_to_message.from.id

			var index = bios.findIndex(function(bio, index){
				if (bio.user_id == msg.reply_to_message.from.id){
					bot.sendMessage(msg.chat.id,"Bio of user: " + msg.reply_to_message.from.first_name + "\n" +
									"with ID: " + msg.reply_to_message.from.id + " is: \n" +
									bio.bio_text
									, {reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
					return true;
				}
			});			
		}

		/* bot entry point - direct chat */
		if (msg.text.trim(" ") == "/start"){
			mainMenu(msg, opts_main_menu);
		}
		
		/* Start with options 
		if (msg.text.startsWith("/start")){
			menu_level = "start";
			// text = msg.text.split("/start ")[1]
			bot.sendMessage(msg.from.id, msg.text.split("/start ")[1]);
			return;
		} */

		/* Store bio */
		if (msg.text == "Store bio" && menu_level == "start"){
			menu_level = "store";
			const opts = {
	    	    reply_to_message_id: msg.message_id,
    	    	reply_markup: JSON.stringify({
        			keyboard: [
            		['Save bio'], ['Return to main menu'],
        			]
    			})
  			};
  			bot.sendMessage(msg.from.id, "Please enter bio text, then press Save Bio to save:", opts);
  			return;
		}

		/* if the user is in the "Store bio" submenu and the user has clicked Save Bio */
  		if (msg.text == "Save bio" && menu_level == "store") {
  			// TODO: delete existing bio when saving new one, delete existing bio upon request, 
  			// if there's a pre-existing bio, remove it:
  			bios.d
  			// Save bio to array
  			bios.push({user_id: msg.from.id, bio_text: temp_text });
  			// Log to console
  			console.log(MSG_TERM_INFO_PREFIX, "User with ID: " + msg.from.id + " has added a bio entry");
  			// Find and show saved bio, thank the user, then offer the option to go back to the main menu
  			bios.find(function(bio,index){
  					if (bio.user_id == msg.from.id) {
  						console.log("Bio: " + bio.bio_text);
  						bot.sendMessage(msg.from.id,
  						"Saved bio! The following is your new bio: \n" + bio.bio_text +
  						"\n\nThanks for using BioBot!", opts_main_menu);
  						menu_level = "start";
  						temp_text = "";
  						return;
  					}
  			return;
  			});
  		}
  		// if the user chose "Return to main menu" from the Save Bio menu:
  		else if (msg.text == "Return to main menu" && menu_level == "store") {
  			mainMenu(msg, opts_main_menu);
  			return;
  		} else {
  			console.log("Message: " + msg.text + " , menu_level = " + menu_level);
  			// if the user typed something other than "Return to main menu" or Save Bio, and 
  			// the user is in the "Store bio" submenu:
  			if (menu_level == "store") {
  				// if there's already a bio text, append to it.
  				if (temp_text) temp_text += "\n" + msg.text;
  				else temp_text = msg.text;
  				bot.sendMessage(msg.from.id, "Bio so far: " + temp_text + "\n" 
  					+ "Keep going, when you're done, press Save Bio", {parse_mode: 'HTML'});
  				return;
  			}
  		}
  		return;
	});
}

function mainMenu(msg, opts){
	menu_level = "start";
	bot.sendMessage(msg.from.id,MSG_DEFAULT, opts);
	return;
}