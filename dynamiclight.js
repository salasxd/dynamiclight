"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_1 = require("bdsx/bds/block");
const blockpos_1 = require("bdsx/bds/blockpos");
const command_1 = require("bdsx/bds/command");
const form_1 = require("bdsx/bds/form");
const command_2 = require("bdsx/command");
const event_1 = require("bdsx/event");
const launcher_1 = require("bdsx/launcher");
const serverproperties_1 = require("bdsx/serverproperties");
const utils_1 = require("./utils");
const Light = (0, utils_1.StringToMap)((0, utils_1.LoadFile)(`worlds/${serverproperties_1.serverProperties["level-name"]}`, "db", "json", '{"data":[]}'), "name");
const EItems = new Map();
let items = new Map();
function reload() {
    items = (0, utils_1.StringToMap)((0, utils_1.LoadFile)("", "items", "json", '{"data":[{"name":"minecraft:torch","light":15}]}'), "name");
    (0, utils_1.Print)(`Items (${items.size})`, utils_1.TypePrint.info);
}
async function Confirm(net, name, underwater, light) {
    if (items.has(name)) {
        const item = items.get(name);
        const form = new form_1.ModalForm(item.name);
        form.setContent("Are you sure to save the changes?");
        form.setButtonConfirm("Confirm");
        form.setButtonCancel("Cancel");
        form.sendTo(net, (form, n) => {
            if (form.response) {
                item.underwater = underwater;
                item.light = light;
                if (item.light == 0)
                    items.delete(item.name);
                else
                    items.set(item.name, item);
                (0, utils_1.SaveFile)("", "items", (0, utils_1.MapToString)(items));
                Items(n);
            }
            else
                Item(n, name);
        });
    }
    else {
        net.getActor().sendMessage(`${name} is not in the list`);
    }
}
async function Item(net, name) {
    if (items.has(name)) {
        const item = items.get(name);
        const form = new form_1.CustomForm(item.name);
        form.addComponent(new form_1.FormToggle("Underwater", item.underwater), "underwater");
        form.addComponent(new form_1.FormSlider("Light (0 is delete)", 0, 15, 1, item.light), "light");
        form.sendTo(net, (form, n) => {
            if (form.response)
                Confirm(n, name, form.response.underwater, form.response.light);
            else
                Items(n);
        });
    }
    else {
        net.getActor().sendMessage(`${name} is not in the list`);
    }
}
async function Add(net) {
    const form = new form_1.CustomForm("New Item");
    form.addComponent(new form_1.FormInput("Name", "minecraft:item", net.getActor().getMainhandSlot().getName()), "name");
    form.addComponent(new form_1.FormToggle("Underwater"), "underwater");
    form.addComponent(new form_1.FormSlider("Light (0 is delete)", 0, 15, 1), "light");
    form.sendTo(net, (form, n) => {
        if (form.response) {
            if (items.has(form.response.name)) {
                net.getActor().sendMessage(`${form.response.name} already exists`);
            }
            else {
                const item = { name: form.response.name, underwater: form.response.underwater,
                    light: form.response.light };
                items.set(item.name, item);
                (0, utils_1.SaveFile)("", "items", (0, utils_1.MapToString)(items));
                Items(n);
            }
        }
        else
            Items(n);
    });
}
async function Items(net) {
    const form = new form_1.SimpleForm("Items");
    form.addButton(new form_1.FormButton("Add"), "add");
    for (const item of items.values()) {
        form.addButton(new form_1.FormButton(item.name), item.name);
    }
    form.sendTo(net, (form, n) => {
        if (form.response == "add")
            Add(net);
        else {
            if (form.response != null)
                Item(net, form.response);
        }
    });
}
reload();
(0, utils_1.Print)(`DB size(${Light.size})`, utils_1.TypePrint.info);
command_2.command.register('dynamiclight', "permissions.command.light.info", command_1.CommandPermissionLevel.Operator).overload((param, origin, output) => {
    Items(origin.getEntity().getNetworkIdentifier());
    output.success("permissions.command.light.success");
}, {});
let _time = 0;
event_1.events.levelTick.on(ev => {
    if ((0, utils_1.Time)() > _time) {
        (0, utils_1.SaveFile)(`worlds/${serverproperties_1.serverProperties["level-name"]}`, "db", (0, utils_1.MapToString)(Light));
        _time = (0, utils_1.Time)(30);
    }
});
event_1.events.entityCreated.on(ev => {
    if (ev.entity.isItem()) {
        if (items.has(ev.entity.itemStack.getName())) {
            const code = (0, utils_1.getCode)(5);
            EItems.set(code, { code: code, runtime: ev.entity.getRuntimeID() });
        }
    }
});
const thred = setInterval(function () {
    for (const player of launcher_1.bedrockServer.level.getPlayers()) {
        const region = player.getRegion();
        const pos = player.getPosition();
        const blockpos = blockpos_1.BlockPos.create(Math.floor(pos.x), Math.floor(pos.y), Math.floor(pos.z));
        const air = region.getBlock(blockpos);
        if (air.getName() == "minecraft:air" || air.getName() == "minecraft:light_block") {
            if (items.has(player.getMainhandSlot().getName())) {
                const item = items.get(player.getMainhandSlot().getName());
                if (item.light > 0) {
                    /*if(Light.has(`${blockpos.x}_${blockpos.y}_${blockpos.z}`)){
                        if(item.light == Light.get(`${blockpos.x}_${blockpos.y}_${blockpos.z}`).light){
                            Light.get(`${blockpos.x}_${blockpos.y}_${blockpos.z}`).time = Time(0.5);
                        }
                    }*/
                    //else{
                    Light.set(`${blockpos.x}_${blockpos.y}_${blockpos.z}`, { name: `${blockpos.x}_${blockpos.y}_${blockpos.z}`, x: blockpos.x, y: blockpos.y, z: blockpos.z, time: (0, utils_1.Time)(0.5), light: item.light });
                    const block = block_1.Block.create('minecraft:light_block', item.light);
                    region.setBlock(blockpos, block, 1);
                    //}
                }
            }
        }
        else if (air.getName() == "minecraft:water") {
            if (items.has(player.getMainhandSlot().getName())) {
                const item = items.get(player.getMainhandSlot().getName());
                if (item.light > 0 && item.underwater) {
                    /*if(Light.has(`${blockpos.x}_${blockpos.y}_${blockpos.z}`)){
                        if(item.light == Light.get(`${blockpos.x}_${blockpos.y}_${blockpos.z}`).light){
                            Light.get(`${blockpos.x}_${blockpos.y}_${blockpos.z}`).time = Time(0.5);
                        }
                    }*/
                    //else{
                    Light.set(`${blockpos.x}_${blockpos.y}_${blockpos.z}`, { name: `${blockpos.x}_${blockpos.y}_${blockpos.z}`, x: blockpos.x, y: blockpos.y, z: blockpos.z, time: (0, utils_1.Time)(0.5) });
                    const block = block_1.Block.create('minecraft:light_block', item.light);
                    region.setBlock(blockpos, block, 1);
                    //}
                }
            }
        }
    }
}, 250);
const thred2 = setInterval(function () {
    for (const value of EItems.values()) {
        const entity = launcher_1.bedrockServer.level.getRuntimeEntity(value.runtime);
        if (entity && entity.isItem()) {
            const region = entity.getRegion();
            const pos = entity.getPosition();
            const blockpos = blockpos_1.BlockPos.create(Math.floor(pos.x), Math.floor(pos.y), Math.floor(pos.z));
            const air = region.getBlock(blockpos);
            if (air.getName() == "minecraft:air" || air.getName() == "minecraft:light_block") {
                if (items.has(entity.itemStack.getName())) {
                    const item = items.get(entity.itemStack.getName());
                    if (item.light > 0) {
                        /*if(Light.has(`${blockpos.x}_${blockpos.y}_${blockpos.z}`)){
                            if(item.light == Light.get(`${blockpos.x}_${blockpos.y}_${blockpos.z}`).light){
                                Light.get(`${blockpos.x}_${blockpos.y}_${blockpos.z}`).time = Time(0.5);
                            }
                        }*/
                        //else{
                        Light.set(`${blockpos.x}_${blockpos.y}_${blockpos.z}`, { name: `${blockpos.x}_${blockpos.y}_${blockpos.z}`, x: blockpos.x, y: blockpos.y, z: blockpos.z, time: (0, utils_1.Time)(0.5) });
                        const block = block_1.Block.create('minecraft:light_block', item.light);
                        region.setBlock(blockpos, block, 1);
                        //}
                    }
                }
            }
            else if (air.getName() == "minecraft:water") {
                if (items.has(entity.itemStack.getName())) {
                    const item = items.get(entity.itemStack.getName());
                    if (item.light > 0 && item.underwater) {
                        /*if(Light.has(`${blockpos.x}_${blockpos.y}_${blockpos.z}`)){
                            if(item.light == Light.get(`${blockpos.x}_${blockpos.y}_${blockpos.z}`).light){
                                Light.get(`${blockpos.x}_${blockpos.y}_${blockpos.z}`).time = Time(0.5);
                            }
                        }*/
                        //else{
                        Light.set(`${blockpos.x}_${blockpos.y}_${blockpos.z}`, { name: `${blockpos.x}_${blockpos.y}_${blockpos.z}`, x: blockpos.x, y: blockpos.y, z: blockpos.z, time: (0, utils_1.Time)(0.5) });
                        const block = block_1.Block.create('minecraft:light_block', item.light);
                        region.setBlock(blockpos, block, 1);
                        //}
                    }
                    break;
                }
            }
        }
        else {
            EItems.delete(value.code);
        }
    }
}, 250);
const thred3 = setInterval(function () {
    for (const data of Light.values()) {
        const player = launcher_1.bedrockServer.level.getRandomPlayer();
        if (player) {
            const region = player.getRegion();
            const blockpos = blockpos_1.BlockPos.create(data.x, data.y, data.z);
            const light = region.getBlock(blockpos);
            if ((0, utils_1.Time)() > (data.time + 30 * 1000)) {
                if (light.getName() == "minecraft:air") {
                    Light.delete(`${blockpos.x}_${blockpos.y}_${blockpos.z}`);
                }
            }
            else if ((0, utils_1.Time)() > data.time) {
                if (light.getName() == "minecraft:light_block") {
                    const block = block_1.Block.create('minecraft:air');
                    region.setBlock(blockpos, block, 1);
                }
            }
        }
    }
}, 250);
event_1.events.serverLeave.on(() => {
    clearInterval(thred);
    clearInterval(thred2);
    clearInterval(thred3);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pY2xpZ2h0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZHluYW1pY2xpZ2h0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMENBQXVDO0FBQ3ZDLGdEQUE2QztBQUM3Qyw4Q0FBMEQ7QUFDMUQsd0NBQWlIO0FBRWpILDBDQUF1QztBQUN2QyxzQ0FBb0M7QUFDcEMsNENBQThDO0FBQzlDLDREQUF5RDtBQUN6RCxtQ0FBd0c7QUFFeEcsTUFBTSxLQUFLLEdBQUcsSUFBQSxtQkFBVyxFQUFDLElBQUEsZ0JBQVEsRUFBQyxVQUFVLG1DQUFnQixDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUMsSUFBSSxFQUFDLE1BQU0sRUFBQyxhQUFhLENBQUMsRUFBQyxNQUFNLENBQUMsQ0FBQztBQUNqSCxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBVyxDQUFDO0FBQ2xDLElBQUksS0FBSyxHQUFHLElBQUksR0FBRyxFQUFjLENBQUM7QUFFbEMsU0FBUyxNQUFNO0lBQ1gsS0FBSyxHQUFHLElBQUEsbUJBQVcsRUFBQyxJQUFBLGdCQUFRLEVBQUMsRUFBRSxFQUFDLE9BQU8sRUFBQyxNQUFNLEVBQUMsa0RBQWtELENBQUMsRUFBQyxNQUFNLENBQUMsQ0FBQztJQUMzRyxJQUFBLGFBQUssRUFBQyxVQUFVLEtBQUssQ0FBQyxJQUFJLEdBQUcsRUFBQyxpQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xELENBQUM7QUFFRCxLQUFLLFVBQVUsT0FBTyxDQUFDLEdBQXNCLEVBQUUsSUFBWSxFQUFFLFVBQW1CLEVBQUUsS0FBYTtJQUMzRixJQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUM7UUFDZixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLE1BQU0sSUFBSSxHQUFHLElBQUksZ0JBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFD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