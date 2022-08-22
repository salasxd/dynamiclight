"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_1 = require("bdsx/bds/block");
const blockpos_1 = require("bdsx/bds/blockpos");
const command_1 = require("bdsx/bds/command");
const command_2 = require("bdsx/command");
const event_1 = require("bdsx/event");
const launcher_1 = require("bdsx/launcher");
const utils_1 = require("./utils");
const Light = (0, utils_1.StringToMap)((0, utils_1.LoadFile)("@", "db", "json", "[]"), "name");
const EItems = new Map();
let items = JSON.parse((0, utils_1.LoadFile)("@", "items", "json", '[{"name":"minecraft:torch","light":15}]'));
function reload() {
    items = JSON.parse((0, utils_1.LoadFile)("@", "items"));
}
reload();
(0, utils_1.Print)(`DB size(${Light.size})`, utils_1.TypePrint.info);
command_2.command.register('dynamiclight', "permissions.command.light.info", command_1.CommandPermissionLevel.Operator).overload((param, origin, output) => {
    reload();
    output.success("permissions.command.light.success");
}, {});
let _time = 0;
event_1.events.levelTick.on(ev => {
    if ((0, utils_1.Time)() > _time) {
        (0, utils_1.SaveFile)("@", "db", (0, utils_1.MapToString)(Light));
        _time = (0, utils_1.Time)() + 30000;
    }
});
event_1.events.entityCreated.on(ev => {
    if (ev.entity.isItem()) {
        for (const item of items) {
            if (item.name == ev.entity.itemStack.getName()) {
                const code = (0, utils_1.getCode)(5);
                EItems.set(code, { code: code, runtime: ev.entity.getRuntimeID() });
            }
        }
    }
});
const thred = setInterval(async function () {
    for (const player of launcher_1.bedrockServer.level.getPlayers()) {
        const region = player.getRegion();
        const pos = player.getPosition();
        const blockpos = blockpos_1.BlockPos.create(Math.floor(pos.x), Math.floor(pos.y), Math.floor(pos.z));
        const air = region.getBlock(blockpos);
        if (air.getName() == "minecraft:air" || air.getName() == "minecraft:light_block") {
            for (const item of items) {
                const name = player.getMainhandSlot().getName();
                if (name == item.name) {
                    if (item.light > 0) {
                        Light.set(`${blockpos.x}_${blockpos.y}_${blockpos.z}`, { name: `${blockpos.x}_${blockpos.y}_${blockpos.z}`, x: blockpos.x, y: blockpos.y, z: blockpos.z, time: (0, utils_1.Time)() + 500 });
                        const block = block_1.Block.create('minecraft:light_block', item.light);
                        region.setBlock(blockpos, block);
                    }
                    break;
                }
            }
        }
        else if (air.getName() == "minecraft:water") {
            for (const item of items) {
                const name = player.getMainhandSlot().getName();
                if (name == item.name && item.underwater) {
                    if (item.light > 0) {
                        Light.set(`${blockpos.x}_${blockpos.y}_${blockpos.z}`, { name: `${blockpos.x}_${blockpos.y}_${blockpos.z}`, x: blockpos.x, y: blockpos.y, z: blockpos.z, time: (0, utils_1.Time)() + 500 });
                        const block = block_1.Block.create('minecraft:light_block', item.light);
                        region.setBlock(blockpos, block);
                    }
                    break;
                }
            }
        }
    }
}, 500);
const thred2 = setInterval(async function () {
    for (const value of EItems.values()) {
        const entity = launcher_1.bedrockServer.level.getRuntimeEntity(value.runtime);
        if (entity && entity.isItem()) {
            const region = entity.getRegion();
            const pos = entity.getPosition();
            const blockpos = blockpos_1.BlockPos.create(Math.floor(pos.x), Math.floor(pos.y), Math.floor(pos.z));
            const air = region.getBlock(blockpos);
            if (air.getName() == "minecraft:air" || air.getName() == "minecraft:light_block") {
                for (const item of items) {
                    const name = entity.itemStack.getName();
                    if (name == item.name) {
                        if (item.light > 0) {
                            Light.set(`${blockpos.x}_${blockpos.y}_${blockpos.z}`, { name: `${blockpos.x}_${blockpos.y}_${blockpos.z}`, x: blockpos.x, y: blockpos.y, z: blockpos.z, time: (0, utils_1.Time)() + 500 });
                            const block = block_1.Block.create('minecraft:light_block', item.light);
                            region.setBlock(blockpos, block);
                        }
                        break;
                    }
                }
            }
            else if (air.getName() == "minecraft:water") {
                for (const item of items) {
                    const name = entity.itemStack.getName();
                    if (name == item.name && item.underwater) {
                        if (item.light > 0) {
                            Light.set(`${blockpos.x}_${blockpos.y}_${blockpos.z}`, { name: `${blockpos.x}_${blockpos.y}_${blockpos.z}`, x: blockpos.x, y: blockpos.y, z: blockpos.z, time: (0, utils_1.Time)() + 500 });
                            const block = block_1.Block.create('minecraft:light_block', item.light);
                            region.setBlock(blockpos, block);
                        }
                        break;
                    }
                }
            }
        }
        else {
            EItems.delete(value.code);
        }
    }
}, 500);
const thred3 = setInterval(async function () {
    for (const data of Light.values()) {
        const player = launcher_1.bedrockServer.level.getRandomPlayer();
        if (player) {
            if ((0, utils_1.Time)() > data.time) {
                const region = player.getRegion();
                const blockpos = blockpos_1.BlockPos.create(Math.floor(data.x), Math.floor(data.y), Math.floor(data.z));
                const light = region.getBlock(blockpos);
                if (light.getName() == "minecraft:light_block") {
                    const block = block_1.Block.create('minecraft:air');
                    if (region.setBlock(blockpos, block)) {
                        Light.delete(`${blockpos.x}_${blockpos.y}_${blockpos.z}`);
                    }
                }
                else if (light.getName() == "minecraft:air") {
                    Light.delete(`${blockpos.x}_${blockpos.y}_${blockpos.z}`);
                }
            }
        }
    }
}, 150);
event_1.events.serverLeave.on(() => {
    clearInterval(thred);
    clearInterval(thred2);
    clearInterval(thred3);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pY2xpZ2h0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZHluYW1pY2xpZ2h0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMENBQXVDO0FBQ3ZDLGdEQUE2QztBQUM3Qyw4Q0FBMEQ7QUFDMUQsMENBQXVDO0FBQ3ZDLHNDQUFvQztBQUNwQyw0Q0FBOEM7QUFDOUMsbUNBQWdIO0FBRWhILE1BQU0sS0FBSyxHQUFHLElBQUEsbUJBQVcsRUFBQyxJQUFBLGdCQUFRLEVBQUMsR0FBRyxFQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsSUFBSSxDQUFDLEVBQUMsTUFBTSxDQUFDLENBQUM7QUFDakUsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLEVBQVcsQ0FBQztBQUVsQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUEsZ0JBQVEsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLE1BQU0sRUFBQyx5Q0FBeUMsQ0FBQyxDQUFDLENBQUM7QUFFL0YsU0FBUyxNQUFNO0lBQ1gsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBQSxnQkFBUSxFQUFDLEdBQUcsRUFBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQzlDLENBQUM7QUFFRCxNQUFNLEVBQUUsQ0FBQztBQUVULElBQUEsYUFBSyxFQUFDLFdBQVcsS0FBSyxDQUFDLElBQUksR0FBRyxFQUFDLGlCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFL0MsaUJBQU8sQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLGdDQUFnQyxFQUFDLGdDQUFzQixDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFDLEVBQUU7SUFDakksTUFBTSxFQUFFLENBQUM7SUFDVCxNQUFNLENBQUMsT0FBTyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7QUFDeEQsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBRVAsSUFBSSxLQUFL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