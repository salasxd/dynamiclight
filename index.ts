import { CANCEL } from "bdsx/common";
import { events } from "bdsx/event";
import { DateFromTime, LoadFile, Print, SaveFile, Time, TypePrint } from "./utils";

export const about = JSON.parse(LoadFile("","package"));

Print(`Iniciando`,TypePrint.info);

events.serverOpen.on(()=>{
    require("./dynamiclight");
    Print(`v${about.version}`,TypePrint.succes);
});

events.serverClose.on(()=>{
    Print(`Cerrando`,TypePrint.info);
});
