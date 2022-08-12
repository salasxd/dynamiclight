"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_1 = require("bdsx/bds/block");
const blockpos_1 = require("bdsx/bds/blockpos");
const event_1 = require("bdsx/event");
const launcher_1 = require("bdsx/launcher");
const storage_1 = require("bdsx/storage");
const version = "v1.0.0";
console.log('[Light] Iniciando'.magenta);
const storage = storage_1.storageManager.getSync('light_coords');
const Light = new Map();
let isCheck = false;
if (storage.data == null) {
    storage.init({ light: [] });
}
if (storage.data.light.length > 0) {
    let dataobj = JSON.parse(storage.data.light);
    for (var key of dataobj) {
        Light.set(key.name, key);
    }
}
const check = setInterval(function () {
    for (const data of Light.values()) {
        if (isCheck) {
            const player = launcher_1.bedrockServer.level.getRandomPlayer();
            if (player) {
                const region = player.getRegion();
                const blockpos = blockpos_1.BlockPos.create(Math.floor(data.x), Math.floor(data.y), Math.floor(data.z));
                const light = region.getBlock(blockpos);
                if (light.getName() == "minecraft:light_block") {
                    const block = block_1.Block.create('minecraft:air');
                    if (region.setBlock(blockpos, block)) {
                        Light.delete(`${blockpos.x}_${blockpos.y}_${blockpos.z}`);
                    }
                }
            }
        }
    }
}, 500);
event_1.events.serverOpen.on(() => {
    console.log('[Light] '.magenta + version.green);
    isCheck = true;
});
event_1.events.serverClose.on(() => {
    console.log('[Light] cerrando'.magenta);
    clearInterval(check);
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
            let light = 0;
            if (name.indexOf("torch") > 0) {
                light = 15;
            }
            else if (name.indexOf("redstone") > 0) {
                light = 4;
            }
            else if (name.indexOf("campfire") > 0) {
                light = 15;
            }
            else if (name.indexOf("lantern") > 0) {
                light = 15;
            }
            else if (name.indexOf("glowstone") > 0 || name.indexOf("glow") > 0) {
                light = 12;
            }
            else if (name.indexOf("enchanting_table") > 0) {
                light = 13;
            }
            else if (name.indexOf("lit_pumpkin") > 0) {
                light = 10;
            }
            else if (name.indexOf("lava") > 0) {
                light = 15;
            }
            else if (name.indexOf("froglight") > 0) {
                light = 10;
            }
            else if (name.indexOf("candle") > 0) {
                light = 5;
            }
            else if (name.indexOf("light") > 0) {
                light = 9;
            }
            else if (name.indexOf("sea_pickle") > 0) {
                light = 4;
            }
            else if (name.indexOf("magma") > 0) {
                light = 8;
            }
            if (light > 0) {
                Light.set(`${blockpos.x}_${blockpos.y}_${blockpos.z}`, { name: `${blockpos.x}_${blockpos.y}_${blockpos.z}`, x: blockpos.x, y: blockpos.y, z: blockpos.z });
                const block = block_1.Block.create('minecraft:light_block', light);
                region.setBlock(blockpos, block);
            }
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDBDQUF1QztBQUN2QyxnREFBNkM7QUFDN0Msc0NBQW9DO0FBQ3BDLDRDQUE4QztBQUM5QywwQ0FBOEM7QUFFOUMsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDO0FBRXpCLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUM7QUFFekMsTUFBTSxPQUFPLEdBQUcsd0JBQWMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFFdkQsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQWMsQ0FBQztBQUNwQyxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFFcEIsSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRTtJQUN0QixPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFDLEVBQUUsRUFBQyxDQUFDLENBQUM7Q0FDNUI7QUFFRCxJQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUM7SUFDN0IsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdDLEtBQUksSUFBSSxHQUFHLElBQUksT0FBTyxFQUFDO1FBQ25CLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQyxHQUFHLENBQUMsQ0FBQztLQUMzQjtDQUNKO0FBRUQsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDO0lBQ3RCLEtBQUksTUFBTSxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFDO1FBQzdCLElBQUcsT0FBTyxFQUFDO1lBQ1AsTUFBTSxNQUFNLEdBQUcsd0JBQWEsQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFHLENBQUM7WUFDdEQsSUFBRyxNQUFNLEVBQUM7Z0JBQ04sTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNsQyxNQUFNLFFBQVEsR0FBRyxtQkFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3RixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBRSxDQUFDO2dCQUN6QyxJQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSx1QkFBdUIsRUFBQztvQkFDMUMsTUFBTSxLQUFLLEdBQUcsYUFBSyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUUsQ0FBQztvQkFDN0MsSUFBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBQzt3QkFDaEMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDN0Q7aUJBQ0o7YUFDSjtTQUNKO0tBQ0o7QUFDTCxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUM7QUFFUCxjQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxHQUFFLEVBQUU7SUFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoRCxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ25CLENBQUMsQ0FBQyxDQUFDO0FBRUgsY0FBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRSxFQUFFO0lBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDeEMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3pCLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsY0FBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDckIsSUFBRyxLQUFLLEdBQUcsRUFBRSxFQUFDO1FBQ1YsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2QsS0FBSSxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUM7WUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNuQjtRQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQztRQUNqRCxLQUFLLEdBQUcsQ0FBQyxDQUFDO0tBQ2I7SUFDRCxLQUFLLEVBQUUsQ0FBQztBQUNaLENBQUMsQ0FBQyxDQUFDO0FBRUgsY0FBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDckIsS0FBSSxNQUFNLE1BQU0sSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxFQUFDO1FBQ3RDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNoRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbEMsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2pDLE1BQU0sUUFBUSxHQUFHLG1CQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUYsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUUsQ0FBQztRQUN2QyxJQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxlQUFlLElBQUUsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLHVCQUF1QixFQUFDO1lBQzFFLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNkLElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUM7Z0JBQ3pCLEtBQUssR0FBRyxFQUFFLENBQUM7YUFDZDtpQkFDSSxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFDO2dCQUNqQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2FBQ2I7aUJBQ0ksSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBQztnQkFDakMsS0FBSyxHQUFHLEVBQUUsQ0FBQzthQUNkO2lCQUNJLElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUM7Z0JBQ2hDLEtBQUssR0FBRyxFQUFFLENBQUM7YUFDZDtpQkFDSSxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFDO2dCQUM5RCxLQUFLLEdBQUcsRUFBRSxDQUFDO2FBQ2Q7aUJBQ0ksSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxFQUFDO2dCQUN6QyxLQUFLLEdBQUcsRUFBRSxDQUFDO2FBQ2Q7aUJBQ0ksSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBQztnQkFDcEMsS0FBSyxHQUFHLEVBQUUsQ0FBQzthQUNkO2lCQUNJLElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUM7Z0JBQzdCLEtBQUssR0FBRyxFQUFFLENBQUM7YUFDZDtpQkFDSSxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFDO2dCQUNsQyxLQUFLLEdBQUcsRUFBRSxDQUFDO2FBQ2Q7aUJBQ0ksSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBQztnQkFDL0IsS0FBSyxHQUFHLENBQUMsQ0FBQzthQUNiO2lCQUNJLElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUM7Z0JBQzlCLEtBQUssR0FBRyxDQUFDLENBQUM7YUFDYjtpQkFDSSxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFDO2dCQUNuQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2FBQ2I7aUJBQ0ksSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBQztnQkFDOUIsS0FBSyxHQUFHLENBQUMsQ0FBQzthQUNiO1lBQ0QsSUFBRyxLQUFLLEdBQUcsQ0FBQyxFQUFDO2dCQUNULEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsRUFBRSxFQUFDLEVBQUMsSUFBSSxFQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUMsUUFBUSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsUUFBUSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsUUFBUSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7Z0JBQ2pKLE1BQU0sS0FBSyxHQUFHLGFBQUssQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUMsS0FBSyxDQUFFLENBQUM7Z0JBQzNELE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ3BDO1NBQ0o7S0FDSjtBQUNMLENBQUMsQ0FBQyxDQUFDIn0=