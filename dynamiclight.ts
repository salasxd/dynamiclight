import { Block } from "bdsx/bds/block";
import { BlockPos } from "bdsx/bds/blockpos";
import { CommandPermissionLevel } from "bdsx/bds/command";
import { command } from "bdsx/command";
import { events } from "bdsx/event";
import { bedrockServer } from "bdsx/launcher";
import { getCode, LoadFile, MapToString, Print, Random, SaveFile, StringToMap, Time, TypePrint } from "./utils";

const Light = StringToMap(LoadFile("@","db","json","[]"),"name");
const EItems = new Map<any,any>();

let items = JSON.parse(LoadFile("@","items","json",'[{"name":"minecraft:torch","light":15}]'));

function reload(){
    items = JSON.parse(LoadFile("@","items"));
}

reload();

Print(`DB size(${Light.size})`,TypePrint.info);

command.register('dynamiclight', "permissions.command.light.info",CommandPermissionLevel.Operator).overload((param, origin, output)=>{
    reload();
    output.success("permissions.command.light.success");
}, {});

let _time = 0;
events.levelTick.on(ev => {
    if(Time() > _time){
        SaveFile("@","db",MapToString(Light));
        _time = Time() + 30000;
    }
});

events.entityCreated.on(ev => {
    if(ev.entity.isItem()){
        for(const item of items){
            if(item.name == ev.entity.itemStack.getName()){
                const code = getCode(5);
                EItems.set(code,{code:code,runtime:ev.entity.getRuntimeID()});
            }
        }
    }
});

const thred = setInterval(async function(){
    for(const player of bedrockServer.level.getPlayers()){
        const region = player.getRegion();
        const pos = player.getPosition();
        const blockpos = BlockPos.create(Math.floor(pos.x), Math.floor(pos.y), Math.floor(pos.z));
        const air = region.getBlock(blockpos)!;
        if(air.getName() == "minecraft:air"||air.getName() == "minecraft:light_block"){
            for(const item of items){
                const name = player.getMainhandSlot().getName();
                if(name == item.name){
                    if(item.light > 0){
                        Light.set(`${blockpos.x}_${blockpos.y}_${blockpos.z}`,{name:`${blockpos.x}_${blockpos.y}_${blockpos.z}`,x:blockpos.x,y:blockpos.y,z:blockpos.z,time:Time()+500});
                        const block = Block.create('minecraft:light_block',item.light)!;
                        region.setBlock(blockpos, block);
                    }
                    break;
                }
            }
        }
        else if(air.getName() == "minecraft:water"){
            for(const item of items){
                const name = player.getMainhandSlot().getName();
                if(name == item.name && item.underwater){
                    if(item.light > 0){
                        Light.set(`${blockpos.x}_${blockpos.y}_${blockpos.z}`,{name:`${blockpos.x}_${blockpos.y}_${blockpos.z}`,x:blockpos.x,y:blockpos.y,z:blockpos.z,time:Time()+500});
                        const block = Block.create('minecraft:light_block',item.light)!;
                        region.setBlock(blockpos, block);
                    }
                    break;
                }
            }
        }
    }
}, 500);
const thred2 = setInterval(async function(){
    for(const value of EItems.values()){
        const entity = bedrockServer.level.getRuntimeEntity(value.runtime);
        if(entity && entity.isItem()){
            const region = entity.getRegion();
            const pos = entity.getPosition();
            const blockpos = BlockPos.create(Math.floor(pos.x), Math.floor(pos.y), Math.floor(pos.z));
            const air = region.getBlock(blockpos)!;
            if(air.getName() == "minecraft:air"||air.getName() == "minecraft:light_block"){
                for(const item of items){
                    const name = entity.itemStack.getName();
                    if(name == item.name){
                        if(item.light > 0){
                            Light.set(`${blockpos.x}_${blockpos.y}_${blockpos.z}`,{name:`${blockpos.x}_${blockpos.y}_${blockpos.z}`,x:blockpos.x,y:blockpos.y,z:blockpos.z,time:Time()+500});
                            const block = Block.create('minecraft:light_block',item.light)!;
                            region.setBlock(blockpos, block);
                        }
                        break;
                    }
                }
            }
            else if(air.getName() == "minecraft:water"){
                for(const item of items){
                    const name = entity.itemStack.getName();
                    if(name == item.name && item.underwater){
                        if(item.light > 0){
                            Light.set(`${blockpos.x}_${blockpos.y}_${blockpos.z}`,{name:`${blockpos.x}_${blockpos.y}_${blockpos.z}`,x:blockpos.x,y:blockpos.y,z:blockpos.z,time:Time()+500});
                            const block = Block.create('minecraft:light_block',item.light)!;
                            region.setBlock(blockpos, block);
                        }
                        break;
                    }
                }
            }
        }
        else{
            EItems.delete(value.code);
        }
    }
}, 500);
const thred3 = setInterval(async function(){
    for(const data of Light.values()){
        const player = bedrockServer.level.getRandomPlayer();
        if(player){
            if(Time() > data.time){
                const region = player.getRegion();
                const blockpos = BlockPos.create(Math.floor(data.x), Math.floor(data.y), Math.floor(data.z));
                const light = region.getBlock(blockpos)!;

                if(light.getName() == "minecraft:light_block"){
                    const block = Block.create('minecraft:air')!;
                    if(region.setBlock(blockpos, block)){
                        Light.delete(`${blockpos.x}_${blockpos.y}_${blockpos.z}`);
                    }
                }
                else if(light.getName() == "minecraft:air"){
                    Light.delete(`${blockpos.x}_${blockpos.y}_${blockpos.z}`);
                }
            }
        }
    }
}, 150);


events.serverLeave.on(() => {
    clearInterval(thred);
    clearInterval(thred2);
    clearInterval(thred3);
});