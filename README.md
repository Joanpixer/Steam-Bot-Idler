# Description
This script is designed to log a bot into a Steam account and set the bot's persona and game status. It also includes features for receiving and responding to friend messages, tracking the time the bot has been farming, and detecting and handling disconnections from Steam.  

A Steam Bot Idler is a tool that can be used to accumulate virtual playing time on various Steam games. This process, known as "farming hours," allows users to boost their in-game achievements or to simply increase the amount of time they have spent playing a particular game.

# Required Libraries
__*readline*__: Provides an interface for interacting with the command-line interface (CLI).  
__*steam-user*__: Enables interaction with the Steam network and API.  
__*steam-totp*__: Generates time-based one-time passwords (TOTPs) for use with Steam's two-factor authentication (2FA) system.

# Configuration
The following values must be specified in the config/cfg.js file:

__*username*__: The bot's Steam username (Not display name).  
__*password*__: The bot's Steam password.  
__*sharedSecret*__: The shared secret for the bot's Steam 2FA (If present).  
__*playing*__: The games that the bot will be marked as playing (APPIDs sepparated by commas).  
__*state*__: The bot's persona state. Must be one of the following values: Offline, Online, Busy, Away, Snooze, Looking to trade, Looking to play, Invisible.

# Installation
To install the bot, you will need to clone or download the repository and then run the following command inside the folder:

<b>npm i</b>

This will install the required libraries for the bot to work (You will need to have __*node.js*__ installed for this to work).

# Usage
To start the bot, run the following command:

<b>node bot.js</b>

The script has a CLI implemented for user input.  
### Commands:
To exit the script, enter one of the following commands: __*quit*__, __*exit*__ or __*logoff*__.  
To check the total time farmed enter the following command: __*farmed*__.

# Functionality
Upon successful authentication, the bot will set its persona state and game status as specified in the configuration file.  
When a friend message is received, the bot will retrieve the sender's display name and log the message to the console.  
If the bot is disconnected from Steam, a message will be logged to the console with the __*Error Code*__ and __*Message*__. It will __*auto-reconnect*__.  
When the script is exited, the total time that the bot was farming will be displayed.  

# Further Reading
[Steam User API Documentation](https://github.com/DoctorMcKay/node-steam-user#readme)  
[Steam TOTP API Documentation](https://github.com/DoctorMcKay/node-steam-totp#readme)
