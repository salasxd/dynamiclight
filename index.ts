import { AbilitiesIndex } from "bdsx/bds/abilities";
import { Block } from "bdsx/bds/block";
import { BlockPos } from "bdsx/bds/blockpos";
import { events } from "bdsx/event";
import { bedrockServer } from "bdsx/launcher";
import { storageManager } from "bdsx/storage";

const version = "v1.0.0";

console.log('[Light] Iniciando'.magenta);

const storage = storageManager.getSync('light_coords');

const Light = new Map<string,any>();
let isCheck = false;

if (storage.data == null) {
    storage.init({light:[]});
}

if(storage.data.light.length > 0){
    let dataobj = JSON.parse(storage.data.light);
    for(var key of dataobj){
        Light.set(key.name,key);
    }
}

const check = setInterval(function(){
    for(const data of Light.values()){
        if(isCheck){
            const player = bedrockServer.level.getRandomPlayer()!;
            if(player){
                const region = player.getRegion();
                const blockpos = BlockPos.create(Math.floor(data.x), Math.floor(data.y), Math.floor(data.z));
                const light = region.getBlock(blockpos)!;
                if(light.getName() == "minecraft:light_block"){
                    const block = Block.create('minecraft:air')!;
                    if(region.setBlock(blockpos, block)){
                        Light.delete(`${blockpos.x}_${blockpos.y}_${blockpos.z}`);
                    }
                }
            }
        }
    }
},500);

events.serverOpen.on(()=>{
    console.log('[Light] '.magenta + version.green);
    isCheck = true;
});

events.serverClose.on(()=>{
    console.log('[Light] cerrando'.magenta);
    clearInterval(check);
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
            let light = 0;
            if(name.indexOf("torch") > 0){
                light = 15;
            }
            else if(name.indexOf("redstone") > 0){
                light = 4;
            }
            else if(name.indexOf("campfire") > 0){
                light = 15;
            }
            else if(name.indexOf("lantern") > 0){
                light = 15;
            }
            else if(name.indexOf("glowstone") > 0 || name.indexOf("glow") > 0){
                light = 12;
            }
            else if(name.indexOf("enchanting_table") > 0){
                light = 13;
            }
            else if(name.indexOf("lit_pumpkin") > 0){
                light = 10;
            }
            else if(name.indexOf("lava") > 0){
                light = 15;
            }
            else if(name.indexOf("froglight") > 0){
                light = 10;
            }
            else if(name.indexOf("candle") > 0){
                light = 5;
            }
            else if(name.indexOf("light") > 0){
                light = 9;
            }
            else if(name.indexOf("sea_pickle") > 0){
                light = 4;
            }
            else if(name.indexOf("magma") > 0){
                light = 8;
            }
            if(light > 0){
                Light.set(`${blockpos.x}_${blockpos.y}_${blockpos.z}`,{name:`${blockpos.x}_${blockpos.y}_${blockpos.z}`,x:blockpos.x,y:blockpos.y,z:blockpos.z});
                const block = Block.create('minecraft:light_block',light)!;
                region.setBlock(blockpos, block);
            }
        }
    }
});