const { createInterface } = require("readline");
const SteamUser = require("steam-user");
const { getAuthCode } = require("steam-totp");
const { username, password, sharedSecret, playing, state } = require("./config/cfg");
const client = new SteamUser();


// In order to ensure the validity of the state specified in the config file, a check will be conducted.

if (!Object.values(SteamUser.EPersonaState).includes(state)) {
  console.error(`Error: ${state} is not a valid state. \nValid States: ${Object.values(SteamUser.EPersonaState).slice(0, 8)}. \nExiting Script.`);
  process.exit();
}

// Create an instance of the readline interface for an interactive CLI.
const rl = createInterface({ input: process.stdin, output: process.stdout });
const logOnOptions = {
  accountName: username,
  password: password,
  twoFactorCode: getAuthCode(sharedSecret).toUpperCase(),
};

client.logOn(logOnOptions);
let startTime = new Date();

// When logged on

client.on("loggedOn", () => {
  timestamp();
  console.log(`Successfully logged into account: ${username}`);

  client.setPersona(SteamUser.EPersonaState.state);
  client.gamesPlayed(playing);
  timestamp();
  console.log(`Playing: ${playing}`);
});

// Add a listener to receive messages from friends.

client.on("friendMessage", (steamID, message) => {
  client.getPersonas([steamID], (err, personas) => {
    if (err) {
      timestamp();
      console.log("Error.");
    } else {
      const persona = personas[steamID.getSteamID64()];
      let name;
      if (persona) {
        name = persona.player_name;
      } else {
        name = "Unable to get Display Name";
      }
      timestamp();
      console.log(`Message Received: ${message} || From: ${name}`);
    }
  });
});

process.on("SIGINT", () => {
  logOff();
});

const logOff = () => {
  getTimeFarmed();
  timestamp();
  console.log("Logging off of Steam");
  client.logOff();
  process.exit();
};

// Display Total time farmed
const getTimeFarmed = () => {
  const endTime = new Date();

  let timeDiff = (endTime - startTime) / 1000; //in sec

  // Get seconds and minutes and format in 00:00
  const days = Math.floor(((timeDiff / 60) / 60) / 24);
  const hours = days > 0 ? Math.floor(((timeDiff / 60) / 60) % 24) : Math.floor((timeDiff / 60) / 60);
  const minutes = Math.floor((timeDiff / 60) % 60).toString().padStart(2, "0");
  const seconds = Math.floor(timeDiff % 60).toString().padStart(2, "0");
  console.log();
  timestamp();
  console.log(days > 0 ? `Time Farming: ${days}d ${hours}h ${minutes}m ${seconds}s` : `Time Farming: ${hours}:${minutes}:${seconds}`);
};

// A listener function will be implemented in order to determine if the bot has disconnected from Steam.

client.on("disconnected", (err, msg) => {
  try {
    timestamp();
    console.log("Disconnected From Steam");
    if (err != null) {
      console.log("Error Code:", err);
    }
    if (msg != null) {
      console.log("Error Message:", msg);
    }
  } catch { } //jshint ignore:line
});

const timestamp = () => {
  const currtime = new Date();
  process.stdout.write(`[${currtime.getHours().toString().padStart(2, "0") + ":" + currtime.getMinutes().toString().padStart(2, "0") + ":" + currtime.getSeconds().toString().padStart(2, "0")}] `);
};


const commands = {
  farmed: getTimeFarmed,
  exit: logOff,
  quit: logOff,
  logoff: logOff
};


// Handle user input from the command line.
rl.on("line", (input) => {
  // Check if the user is logged on
  if (client.publicIP != null) {
    // Parse the input and execute the corresponding command.
    const [command] = input.split(" ");
    const func = commands[command];
    if (func) {
      func();
    } else {
      console.log(`Unknown command: ${command}`);
    }
  }
});
