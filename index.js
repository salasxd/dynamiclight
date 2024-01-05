"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = require("bdsx/event");
const utils_1 = require("./utils");
console.log(`[${utils_1.plugin.name}] `.magenta + "Starting");
// before BDS launching
event_1.events.serverOpen.on(() => {
    require('./dynamiclight');
    console.log(`[${utils_1.plugin.name}] `.magenta + `v${utils_1.plugin.version} Done`.green);
    // after BDS launched
});
event_1.events.serverClose.on(() => {
    console.log(`[${utils_1.plugin.name}] `.magenta + "Closed".red);
    // after BDS closed
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFvQztBQUNwQyxtQ0FBaUM7QUFFakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLGNBQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLENBQUM7QUFDdEQsdUJBQXVCO0FBRXZCLGNBQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRTtJQUN0QixPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksY0FBTSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGNBQU0sQ0FBQyxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzRSxxQkFBcUI7QUFDekIsQ0FBQyxDQUFDLENBQUM7QUFFSCxjQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUU7SUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLGNBQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hELG1CQUFtQjtBQUN2QixDQUFDLENBQUMsQ0FBQyJ9