"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.about = void 0;
const common_1 = require("bdsx/common");
const event_1 = require("bdsx/event");
const utils_1 = require("./utils");
exports.about = JSON.parse((0, utils_1.LoadFile)("", "package"));
(0, utils_1.Print)(`Iniciando`, utils_1.TypePrint.info);
event_1.events.serverOpen.on(() => {
    require("./dynamiclight");
    (0, utils_1.Print)(`v${exports.about.version}`, utils_1.TypePrint.succes);
});
event_1.events.error.on(err => {
    (0, utils_1.Print)('ERR: ' + err.message, utils_1.TypePrint.error);
    let data = `${(0, utils_1.LoadFile)("", "log", "txt", "")}\n[${(0, utils_1.DateFromTime)((0, utils_1.Time)())}] ${err.toString()}`;
    (0, utils_1.SaveFile)("", "log", data, "txt");
    return common_1.CANCEL;
});
event_1.events.serverClose.on(() => {
    (0, utils_1.Print)(`Cerrando`, utils_1.TypePrint.info);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3Q0FBcUM7QUFDckMsc0NBQW9DO0FBQ3BDLG1DQUFtRjtBQUV0RSxRQUFBLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUEsZ0JBQVEsRUFBQyxFQUFFLEVBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUV4RCxJQUFBLGFBQUssRUFBQyxXQUFXLEVBQUMsaUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUVsQyxjQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxHQUFFLEVBQUU7SUFDckIsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDMUIsSUFBQSxhQUFLLEVBQUMsSUFBSSxhQUFLLENBQUMsT0FBTyxFQUFFLEVBQUMsaUJBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRCxDQUFDLENBQUMsQ0FBQztBQUVILGNBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQSxFQUFFO0lBQ2pCLElBQUEsYUFBSyxFQUFDLE9BQU8sR0FBRSxHQUFHLENBQUMsT0FBTyxFQUFDLGlCQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUMsSUFBSSxJQUFJLEdBQUcsR0FBRyxJQUFBLGdCQUFRLEVBQUMsRUFBRSxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsRUFBRSxDQUFDLE1BQU0sSUFBQSxvQkFBWSxFQUFDLElBQUEsWUFBSSxHQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztJQUN6RixJQUFBLGdCQUFRLEVBQUMsRUFBRSxFQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsT0FBTyxlQUFNLENBQUM7QUFDbEIsQ0FBQyxDQUFDLENBQUM7QUFFSCxjQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFFLEVBQUU7SUFDdEIsSUFBQSxhQUFLLEVBQUMsVUFBVSxFQUFDLGlCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckMsQ0FBQyxDQUFDLENBQUMifQ==