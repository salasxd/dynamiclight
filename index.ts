import { AbilitiesIndex } from "bdsx/bds/abilities";
import { Block } from "bdsx/bds/block";
import { BlockPos } from "bdsx/bds/blockpos";
import { CommandPermissionLevel } from "bdsx/bds/command";
import { command } from "bdsx/command";
import { events } from "bdsx/event";
import { bedrockServer } from "bdsx/launcher";
import { storageManager } from "bdsx/storage";
import { join } from "path";

const fs = require('fs');
const path = join(process.cwd(), '..','plugins','dynamiclight');

const version = "v1.1.0";

console.log('[Light] Iniciando'.magenta);

const storage = storageManager.getSync('light_coords');

const Light = new Map<string,any>();
let isCheck = false;

let items = [{name:"minecraft:torch",light:15}];

if (storage.data == null) {
    storage.init({light:[],version:2});
}

if(storage.data.light.length > 0){
    let dataobj = JSON.parse(storage.data.light);
    for(var key of dataobj){
        Light.set(key.name,key);
    }
    if(!storage.data.version){
        Light.clear();
        console.log(`[Dynamic Light] DB Clear`);
        storage.data.version = 2;
    }
}

function reload(){
    if (fs.existsSync(`${path}/items.json`))
        items = JSON.parse(fs.readFileSync(`${path}/items.json`));
}

reload();

const check = setInterval(function(){
    for(const data of Light.values()){
        if(isCheck){
            const player = bedrockServer.level.getRandomPlayer()!;
            if(player){
                const region = player.getRegion();
                const name = player.getMainhandSlot().getName();
                const pos = player.getPosition();
                const blockpos = BlockPos.create(Math.floor(data.x), Math.floor(data.y), Math.floor(data.z));
                const light = region.getBlock(blockpos)!;

                if(light.getName() == "minecraft:light_block"||light.getName() == "minecraft:air"){
                    let hand = false;
                    for(const item of items){
                        if(name == item.name){
                            if(blockpos.x == Math.floor(pos.x) && blockpos.y == Math.floor(pos.y) && blockpos.z == Math.floor(pos.z)){
                                hand = true;
                            }
                            break;
                        }
                    }
                    if(!hand){
                        const block = Block.create('minecraft:air')!;
                        if(region.setBlock(blockpos, block)){
                            Light.delete(`${blockpos.x}_${blockpos.y}_${blockpos.z}`);
                        }
                    }
                }
            }
        }
    }
},150);

events.serverOpen.on(()=>{
    console.log('[Light] '.magenta + version.green);
    isCheck = true;
    console.log(`[Light] DB size(${Light.size})`);
    command.register('dynamiclight', "permissions.command.light.info",CommandPermissionLevel.Operator).overload((param, origin, output)=>{
        reload();
        output.success("permissions.command.light.success");
    }, {});
});

events.serverClose.on(()=>{
    console.log('[Light] cerrando'.magenta);
    clearInterval(check);
    storageManager.close('light_coords');
});

let count = 0;
events.levelTick.on(ev => {
    if(count > 20){
        let list = [];
        for(var data of Light.values()){
            list.push(data);
        }
        storage.data.light = JSON.stringify(list,null,4);
        count = 0;
    }
    count++;
});

events.levelTick.on(ev => {
    for(const player of ev.level.getPlayers()){
        const name = player.getMainhandSlot().getName();
        const region = player.getRegion();
        const pos = player.getPosition();
        const blockpos = BlockPos.create(Math.floor(pos.x), Math.floor(pos.y), Math.floor(pos.z));
        const air = region.getBlock(blockpos)!;
        if(air.getName() == "minecraft:air"||air.getName() == "minecraft:light_block"){
            for(const item of items){
                if(name == item.name){
                    if(item.light > 0){
                        if(!Light.get(`${blockpos.x}_${blockpos.y}_${blockpos.z}`)){
                            Light.set(`${blockpos.x}_${blockpos.y}_${blockpos.z}`,{name:`${blockpos.x}_${blockpos.y}_${blockpos.z}`,x:blockpos.x,y:blockpos.y,z:blockpos.z});
                        }
                        const block = Block.create('minecraft:light_block',item.light)!;
                        region.setBlock(blockpos, block);
                    }
                    break;
                }
            }
        }
    }
});