"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_1 = require("bdsx/bds/block");
const blockpos_1 = require("bdsx/bds/blockpos");
const command_1 = require("bdsx/bds/command");
const command_2 = require("bdsx/command");
const event_1 = require("bdsx/event");
const launcher_1 = require("bdsx/launcher");
const serverproperties_1 = require("bdsx/serverproperties");
const utils_1 = require("./utils");
const Light = (0, utils_1.StringToMap)((0, utils_1.LoadFile)(`worlds/${serverproperties_1.serverProperties["level-name"]}`, "db", "json", "[]"), "name");
const EItems = new Map();
let items = JSON.parse((0, utils_1.LoadFile)("", "items", "json", '[{"name":"minecraft:torch","light":15}]'));
function reload() {
    items = JSON.parse((0, utils_1.LoadFile)("", "items", "json", '[{"name":"minecraft:torch","light":15}]'));
    (0, utils_1.Print)(`Items (${items.length})`, utils_1.TypePrint.info);
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
        (0, utils_1.SaveFile)(`worlds/${serverproperties_1.serverProperties["level-name"]}`, "db", (0, utils_1.MapToString)(Light));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pY2xpZ2h0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZHluYW1pY2xpZ2h0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMENBQXVDO0FBQ3ZDLGdEQUE2QztBQUM3Qyw4Q0FBMEQ7QUFDMUQsMENBQXVDO0FBQ3ZDLHNDQUFvQztBQUNwQyw0Q0FBOEM7QUFDOUMsNERBQXlEO0FBQ3pELG1DQUFnSDtBQUVoSCxNQUFNLEtBQUssR0FBRyxJQUFBLG1CQUFXLEVBQUMsSUFBQSxnQkFBUSxFQUFDLFVBQVUsbUNBQWdCLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUMsTUFBTSxFQUFDLElBQUksQ0FBQyxFQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hHLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxFQUFXLENBQUM7QUFFbEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFBLGdCQUFRLEVBQUMsRUFBRSxFQUFDLE9BQU8sRUFBQyxNQUFNLEVBQUMseUNBQXlDLENBQUMsQ0FBQyxDQUFDO0FBRTlGLFNBQVMsTUFBTTtJQUNYLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUEsZ0JBQVEsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLE1BQU0sRUFBQyx5Q0FBeUMsQ0FBQyxDQUFDLENBQUM7SUFDMUYsSUFBQSxhQUFLLEVBQUMsVUFBVSxLQUFLLENBQUMsTUFBTSxHQUFHLEVBQUMsaUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBRUQsTUFBTSxFQUFFLENBQUM7QUFFVCxJQUFBLGFBQUssRUFBQyxXQUFXLEtBQUssQ0FBQyxJQUFJLEdBQUcsRUFBQyxpQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRS9DLGlCQUFPLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxnQ0FBZ0MsRUFBQyxnQ0FBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBQyxFQUFFO0lBQ2pJLE1BQU0sRUFBRSxDQUFDO0lBQ1QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0FBQ3hELENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUVQLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNkLGNBQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3JCLElBQUcsSUFBQSxZQUFJLEdBQUUsR0FBRyxLQUFLLEVBQUM7UUFDZCxJQUFBLGdCQUFRLEVBQUMsVUFBVSxtQ0FBZ0IsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFDLElBQUksRUFBQyxJQUFBLG1CQUFXLEVBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM3RSxLQUFLLEdBQUcsSUFBQSxZQUFJLEdBQUUsR0FBRyxLQUFLLENBQUM7S0FDMUI7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILGNBQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3pCLElBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBQztRQUNsQixLQUFJLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBQztZQUNwQixJQUFHLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEVBQUM7Z0JBQzFDLE1BQU0sSUFBSSxHQUFHLElBQUEsZUFBTyxFQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQyxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsT0FBTyxFQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLEVBQUMsQ0FBQyxDQUFDO2FBQ2pFO1NBQ0o7S0FDSjtBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLEtBQUs7SUFDM0IsS0FBSSxNQUFNLE1BQU0sSUFBSSx3QkFBYSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsRUFBQztRQUNqRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2pDLE1BQU0sUUFBUSxHQUFHLG1CQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUYsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUUsQ0FBQztRQUN2QyxJQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxlQUFlLElBQUUsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLHVCQUF1QixFQUFDO1lBQzFFLEtBQUksTUFBTSxJQUFJLElBQUksS0FBSyxFQUFDO2dCQUNwQixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2hELElBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUM7b0JBQ2pCLElBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUM7d0JBQ2QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUMsRUFBQyxJQUFJLEVBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxRQUFRLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxRQUFRLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxRQUFRLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBQyxJQUFBLFlBQUksR0FBRSxHQUFDLEdBQUcsRUFBQyxDQUFDLENBQUM7d0JBQ2pLLE1BQU0sS0FBSyxHQUFHLGFBQUssQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUMsSUFBSSxDQUFDLEtBQUssQ0FBRSxDQUFDO3dCQUNoRSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztxQkFDcEM7b0JBQ0QsTUFBTTtpQkFDVDthQUNKO1NBQ0o7YUFDSSxJQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxpQkFBaUIsRUFBQztZQUN2QyxLQUFJLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBQztnQkFDcEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNoRCxJQUFHLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUM7b0JBQ3BDLElBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUM7d0JBQ2QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUMsRUFBQyxJQUFJLEVBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxRQUFRLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxRQUFRLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxRQUFRLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBQyxJQUFBLFlBQUksR0FBRSxHQUFDLEdBQUcsRUFBQyxDQUFDLENBQUM7d0JBQ2pLLE1BQU0sS0FBSyxHQUFHLGFBQUssQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUMsSUFBSSxDQUFDLEtBQUssQ0FBRSxDQUFDO3dCQUNoRSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztxQkFDcEM7b0JBQ0QsTUFBTTtpQkFDVDthQUNKO1NBQ0o7S0FDSjtBQUNMLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNSLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxLQUFLO0lBQzVCLEtBQUksTUFBTSxLQUFLLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFDO1FBQy9CLE1BQU0sTUFBTSxHQUFHLHdCQUFhLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRSxJQUFHLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUM7WUFDekIsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2xDLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNqQyxNQUFNLFFBQVEsR0FBRyxtQkFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFGLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFFLENBQUM7WUFDdkMsSUFBRyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksZUFBZSxJQUFFLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSx1QkFBdUIsRUFBQztnQkFDMUUsS0FBSSxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUM7b0JBQ3BCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ3hDLElBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUM7d0JBQ2pCLElBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUM7NEJBQ2QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUMsRUFBQyxJQUFJLEVBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxRQUFRLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxRQUFRLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxRQUFRLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBQyxJQUFBLFlBQUksR0FBRSxHQUFDLEdBQUcsRUFBQyxDQUFDLENBQUM7NEJBQ2pLLE1BQU0sS0FBSyxHQUFHLGFBQUssQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUMsSUFBSSxDQUFDLEtBQUssQ0FBRSxDQUFDOzRCQUNoRSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQzt5QkFDcEM7d0JBQ0QsTUFBTTtxQkFDVDtpQkFDSjthQUNKO2lCQUNJLElBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLGlCQUFpQixFQUFDO2dCQUN2QyxLQUFJLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBQztvQkFDcEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDeEMsSUFBRyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFDO3dCQUNwQyxJQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFDOzRCQUNkLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsRUFBRSxFQUFDLEVBQUMsSUFBSSxFQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUMsUUFBUSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsUUFBUSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsUUFBUSxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUMsSUFBQSxZQUFJLEdBQUUsR0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDOzRCQUNqSyxNQUFNLEtBQUssR0FBRyxhQUFLLENBQUMsTUFBTSxDQUFDLHVCQUF1QixFQUFDLElBQUksQ0FBQyxLQUFLLENBQUUsQ0FBQzs0QkFDaEUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7eUJBQ3BDO3dCQUNELE1BQU07cUJBQ1Q7aUJBQ0o7YUFDSjtTQUNKO2FBQ0c7WUFDQSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM3QjtLQUNKO0FBQ0wsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ1IsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLEtBQUs7SUFDNUIsS0FBSSxNQUFNLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUM7UUFDN0IsTUFBTSxNQUFNLEdBQUcsd0JBQWEsQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDckQsSUFBRyxNQUFNLEVBQUM7WUFDTixJQUFHLElBQUEsWUFBSSxHQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBQztnQkFDbEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNsQyxNQUFNLFFBQVEsR0FBRyxtQkFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3RixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBRSxDQUFDO2dCQUV6QyxJQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSx1QkFBdUIsRUFBQztvQkFDMUMsTUFBTSxLQUFLLEdBQUcsYUFBSyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUUsQ0FBQztvQkFDN0MsSUFBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBQzt3QkFDaEMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDN0Q7aUJBQ0o7cUJBQ0ksSUFBRyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksZUFBZSxFQUFDO29CQUN2QyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2lCQUM3RDthQUNKO1NBQ0o7S0FDSjtBQUNMLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUdSLGNBQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRTtJQUN2QixhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckIsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RCLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxQixDQUFDLENBQUMsQ0FBQyJ9