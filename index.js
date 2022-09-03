"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.about = void 0;
const event_1 = require("bdsx/event");
const utils_1 = require("./utils");
exports.about = JSON.parse((0, utils_1.LoadFile)("", "package"));
(0, utils_1.Print)(`Iniciando`, utils_1.TypePrint.info);
event_1.events.serverOpen.on(() => {
    require("./dynamiclight");
    (0, utils_1.Print)(`v${exports.about.version}`, utils_1.TypePrint.succes);
});
event_1.events.serverClose.on(() => {
    (0, utils_1.Print)(`Cerrando`, utils_1.TypePrint.info);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxzQ0FBb0M7QUFDcEMsbUNBQW1GO0FBRXRFLFFBQUEsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBQSxnQkFBUSxFQUFDLEVBQUUsRUFBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBRXhELElBQUEsYUFBSyxFQUFDLFdBQVcsRUFBQyxpQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRWxDLGNBQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEdBQUUsRUFBRTtJQUNyQixPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUMxQixJQUFBLGFBQUssRUFBQyxJQUFJLGFBQUssQ0FBQyxPQUFPLEVBQUUsRUFBQyxpQkFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hELENBQUMsQ0FBQyxDQUFDO0FBRUgsY0FBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRSxFQUFFO0lBQ3RCLElBQUEsYUFBSyxFQUFDLFVBQVUsRUFBQyxpQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JDLENBQUMsQ0FBQyxDQUFDIn0=