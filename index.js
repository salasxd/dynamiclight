"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_1 = require("bdsx/bds/block");
const blockpos_1 = require("bdsx/bds/blockpos");
const command_1 = require("bdsx/bds/command");
const command_2 = require("bdsx/command");
const event_1 = require("bdsx/event");
const launcher_1 = require("bdsx/launcher");
const storage_1 = require("bdsx/storage");
const path_1 = require("path");
const fs = require('fs');
const path = (0, path_1.join)(process.cwd(), '..', 'plugins', 'dynamiclight');
const version = "v1.1.0";
console.log('[Light] Iniciando'.magenta);
const storage = storage_1.storageManager.getSync('light_coords');
const Light = new Map();
let isCheck = false;
let items = [{ name: "minecraft:torch", light: 15 }];
if (storage.data == null) {
    storage.init({ light: [], version: 2 });
}
if (storage.data.light.length > 0) {
    let dataobj = JSON.parse(storage.data.light);
    for (var key of dataobj) {
        Light.set(key.name, key);
    }
    if (!storage.data.version) {
        Light.clear();
        console.log(`[Dynamic Light] DB Clear`);
        storage.data.version = 2;
    }
}
function reload() {
    if (fs.existsSync(`${path}/items.json`))
        items = JSON.parse(fs.readFileSync(`${path}/items.json`));
}
reload();
const check = setInterval(function () {
    for (const data of Light.values()) {
        if (isCheck) {
            const player = launcher_1.bedrockServer.level.getRandomPlayer();
            if (player) {
                const region = player.getRegion();
                const name = player.getMainhandSlot().getName();
                const pos = player.getPosition();
                const blockpos = blockpos_1.BlockPos.create(Math.floor(data.x), Math.floor(data.y), Math.floor(data.z));
                const light = region.getBlock(blockpos);
                if (light.getName() == "minecraft:light_block" || light.getName() == "minecraft:air") {
                    let hand = false;
                    for (const item of items) {
                        if (name == item.name) {
                            if (blockpos.x == Math.floor(pos.x) && blockpos.y == Math.floor(pos.y) && blockpos.z == Math.floor(pos.z)) {
                                hand = true;
                            }
                            break;
                        }
                    }
                    if (!hand) {
                        const block = block_1.Block.create('minecraft:air');
                        if (region.setBlock(blockpos, block)) {
                            Light.delete(`${blockpos.x}_${blockpos.y}_${blockpos.z}`);
                        }
                    }
                }
            }
        }
    }
}, 150);
event_1.events.serverOpen.on(() => {
    console.log('[Light] '.magenta + version.green);
    isCheck = true;
    console.log(`[Light] DB size(${Light.size})`);
    command_2.command.register('dynamiclight', "permissions.command.light.info", command_1.CommandPermissionLevel.Operator).overload((param, origin, output) => {
        reload();
        output.success("permissions.command.light.success");
    }, {});
});
event_1.events.serverClose.on(() => {
    console.log('[Light] cerrando'.magenta);
    clearInterval(check);
    storage_1.storageManager.close('light_coords');
});
let count = 0;
event_1.events.levelTick.on(ev => {
    if (count > 20) {
        let list = [];
        for (var data of Light.values()) {
            list.push(data);
        }
        storage.data.light = JSON.stringify(list, null, 4);
        count = 0;
    }
    count++;
});
event_1.events.levelTick.on(ev => {
    for (const player of ev.level.getPlayers()) {
        const name = player.getMainhandSlot().getName();
        const region = player.getRegion();
        const pos = player.getPosition();
        const blockpos = blockpos_1.BlockPos.create(Math.floor(pos.x), Math.floor(pos.y), Math.floor(pos.z));
        const air = region.getBlock(blockpos);
        if (air.getName() == "minecraft:air" || air.getName() == "minecraft:light_block") {
            for (const item of items) {
                if (name == item.name) {
                    if (item.light > 0) {
                        if (!Light.get(`${blockpos.x}_${blockpos.y}_${blockpos.z}`)) {
                            Light.set(`${blockpos.x}_${blockpos.y}_${blockpos.z}`, { name: `${blockpos.x}_${blockpos.y}_${blockpos.z}`, x: blockpos.x, y: blockpos.y, z: blockpos.z });
                        }
                        const block = block_1.Block.create('minecraft:light_block', item.light);
                        region.setBlock(blockpos, block);
                    }
                    break;
                }
            }
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDBDQUF1QztBQUN2QyxnREFBNkM7QUFDN0MsOENBQTBEO0FBQzFELDBDQUF1QztBQUN2QyxzQ0FBb0M7QUFDcEMsNENBQThDO0FBQzlDLDBDQUE4QztBQUM5QywrQkFBNEI7QUFFNUIsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLE1BQU0sSUFBSSxHQUFHLElBQUEsV0FBSSxFQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUMsU0FBUyxFQUFDLGNBQWMsQ0FBQyxDQUFDO0FBRWhFLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQztBQUV6QixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRXpDLE1BQU0sT0FBTyxHQUFHLHdCQUFjLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBRXZELE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxFQUFjLENBQUM7QUFDcEMsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBRXBCLElBQUksS0FBSyxHQUFHLENBQUMsRUFBQyxJQUFJLEVBQUMsaUJBQWlCLEVBQUMsS0FBSyxFQUFDLEVBQUUsRUFBQyxDQUFDLENBQUM7QUFFaEQsSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRTtJQUN0QixPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztDQUN0QztBQUVELElBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBQztJQUM3QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7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