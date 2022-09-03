import { Block } from "bdsx/bds/block";
import { BlockPos } from "bdsx/bds/blockpos";
import { CommandPermissionLevel } from "bdsx/bds/command";
import { CustomForm, FormButton, FormInput, FormSlider, FormToggle, ModalForm, SimpleForm } from "bdsx/bds/form";
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { command } from "bdsx/command";
import { events } from "bdsx/event";
import { bedrockServer } from "bdsx/launcher";
import { serverProperties } from "bdsx/serverproperties";
import { getCode, LoadFile, MapToString, Print, SaveFile, StringToMap, Time, TypePrint } from "./utils";

const Light = StringToMap(LoadFile(`worlds/${serverProperties["level-name"]}`,"db","json",'{"data":[]}'),"name");
const EItems = new Map<any,any>();
let items = new Map<string,any>();

function reload(){
    items = StringToMap(LoadFile("","items","json",'{"data":[{"name":"minecraft:torch","light":15}]}'),"name");
    Print(`Items (${items.size})`,TypePrint.info);
}

async function Confirm(net: NetworkIdentifier, name: string, underwater: boolean, light: number) {
    if(items.has(name)){
        const item = items.get(name);
        const form = new ModalForm(item.name);
        form.setContent("Are you sure to save the changes?");
        form.setButtonConfirm("Confirm");
        form.setButtonCancel("Cancel");
        form.sendTo(net, (form, n) => {
            if(form.response){
                item.underwater = underwater;
                item.light = light;
                if(item.light == 0)
                    items.delete(item.name);
                else
                    items.set(item.name,item);
                SaveFile("","items",MapToString(items));
                Items(n);
            }
            else
                Item(n, name);
        });
    }
    else{
        net!.getActor()!.sendMessage(`${name} is not in the list`);
    }
}

async function Item(net: NetworkIdentifier, name: string) {
    if(items.has(name)){
        const item = items.get(name);
        const form = new CustomForm(item.name);
        form.addComponent(new FormToggle("Underwater",item.underwater),"underwater");
        form.addComponent(new FormSlider("Light (0 is delete)",0,15,1,item.light),"light");
        form.sendTo(net, (form, n) => {
            if(form.response)
                Confirm(n, name, form.response.underwater, form.response.light);
            else
                Items(n);
        });
    }
    else{
        net!.getActor()!.sendMessage(`${name} is not in the list`);
    }
}

async function Add(net: NetworkIdentifier) {
    const form = new CustomForm("New Item");
    form.addComponent(new FormInput("Name","minecraft:item",net!.getActor()!.getMainhandSlot().getName()),"name");
    form.addComponent(new FormToggle("Underwater"),"underwater");
    form.addComponent(new FormSlider("Light (0 is delete)",0,15,1),"light");
    form.sendTo(net, (form, n) => {
        if(form.response){
            if(items.has(form.response.name)){
                net!.getActor()!.sendMessage(`${form.response.name} already exists`);
            }
            else{
                const item = {name:form.response.name,underwater:form.response.underwater,
                light:form.response.light};
                items.set(item.name,item);
                SaveFile("","items",MapToString(items));
                Items(n);
            }
        }
        else
            Items(n);
    });
}

async function Items(net: NetworkIdentifier){
    const form = new SimpleForm("Items");
    form.addButton(new FormButton("Add"),"add");
    for(const item of items.values()){
        form.addButton(new FormButton(item.name),item.name);
    }
    form.sendTo(net, (form, n) => {
        if(form.response == "add")
            Add(net);
        else{
            if(form.response != null)
                Item(net,form.response);
        }
    });
}

reload();

Print(`DB size(${Light.size})`,TypePrint.info);

command.register('dynamiclight', "permissions.command.light.info",CommandPermissionLevel.Operator).overload((param, origin, output)=>{
    Items(origin.getEntity()!.getNetworkIdentifier());
    output.success("permissions.command.light.success");
}, {});

let _time = 0;
events.levelTick.on(ev => {
    if(Time() > _time){
        SaveFile(`worlds/${serverProperties["level-name"]}`,"db",MapToString(Light));
        _time = Time(30);
    }
});

events.entityCreated.on(ev => {
    if(ev.entity.isItem()){
        if(items.has(ev.entity.itemStack.getName())){
            const code = getCode(5);
            EItems.set(code,{code:code,runtime:ev.entity.getRuntimeID()});
        }
    }
});

const thred = setInterval(function(){
    for(const player of bedrockServer.level.getPlayers()){
        const region = player.getRegion();
        const pos = player.getPosition();
        const blockpos = BlockPos.create(Math.floor(pos.x), Math.floor(pos.y), Math.floor(pos.z));
        const air = region.getBlock(blockpos)!;
        if(air.getName() == "minecraft:air"||air.getName() == "minecraft:light_block"){
            if(items.has(player.getMainhandSlot().getName())){
                const item = items.get(player.getMainhandSlot().getName());
                if(item.light > 0){
                    /*if(Light.has(`${blockpos.x}_${blockpos.y}_${blockpos.z}`)){
                        if(item.light == Light.get(`${blockpos.x}_${blockpos.y}_${blockpos.z}`).light){
                            Light.get(`${blockpos.x}_${blockpos.y}_${blockpos.z}`).time = Time(0.5);
                        }
                    }*/
                    //else{
                    Light.set(`${blockpos.x}_${blockpos.y}_${blockpos.z}`,{name:`${blockpos.x}_${blockpos.y}_${blockpos.z}`,x:blockpos.x,y:blockpos.y,z:blockpos.z,time:Time(0.5),light:item.light});
                    const block = Block.create('minecraft:light_block',item.light)!;
                    region.setBlock(blockpos, block, 1);
                    //}
                }
            }
        }
        else if(air.getName() == "minecraft:water"){
            if(items.has(player.getMainhandSlot().getName())){
                const item = items.get(player.getMainhandSlot().getName());
                if(item.light > 0 && item.underwater){
                    /*if(Light.has(`${blockpos.x}_${blockpos.y}_${blockpos.z}`)){
                        if(item.light == Light.get(`${blockpos.x}_${blockpos.y}_${blockpos.z}`).light){
                            Light.get(`${blockpos.x}_${blockpos.y}_${blockpos.z}`).time = Time(0.5);
                        }
                    }*/
                    //else{
                    Light.set(`${blockpos.x}_${blockpos.y}_${blockpos.z}`,{name:`${blockpos.x}_${blockpos.y}_${blockpos.z}`,x:blockpos.x,y:blockpos.y,z:blockpos.z,time:Time(0.5)});
                    const block = Block.create('minecraft:light_block',item.light)!;
                    region.setBlock(blockpos, block, 1);
                    //}
                }
            }
        }
    }
}, 250);
const thred2 = setInterval(function(){
    for(const value of EItems.values()){
        const entity = bedrockServer.level.getRuntimeEntity(value.runtime);
        if(entity && entity.isItem()){
            const region = entity.getRegion();
            const pos = entity.getPosition();
            const blockpos = BlockPos.create(Math.floor(pos.x), Math.floor(pos.y), Math.floor(pos.z));
            const air = region.getBlock(blockpos)!;
            if(air.getName() == "minecraft:air"||air.getName() == "minecraft:light_block"){
                if(items.has(entity.itemStack.getName())){
                    const item = items.get(entity.itemStack.getName());
                    if(item.light > 0){
                        /*if(Light.has(`${blockpos.x}_${blockpos.y}_${blockpos.z}`)){
                            if(item.light == Light.get(`${blockpos.x}_${blockpos.y}_${blockpos.z}`).light){
                                Light.get(`${blockpos.x}_${blockpos.y}_${blockpos.z}`).time = Time(0.5);
                            }
                        }*/
                        //else{
                        Light.set(`${blockpos.x}_${blockpos.y}_${blockpos.z}`,{name:`${blockpos.x}_${blockpos.y}_${blockpos.z}`,x:blockpos.x,y:blockpos.y,z:blockpos.z,time:Time(0.5)});
                        const block = Block.create('minecraft:light_block',item.light)!;
                        region.setBlock(blockpos, block, 1);
                        //}
                    }
                }
            }
            else if(air.getName() == "minecraft:water"){
                if(items.has(entity.itemStack.getName())){
                    const item = items.get(entity.itemStack.getName());
                    if(item.light > 0 && item.underwater){
                        /*if(Light.has(`${blockpos.x}_${blockpos.y}_${blockpos.z}`)){
                            if(item.light == Light.get(`${blockpos.x}_${blockpos.y}_${blockpos.z}`).light){
                                Light.get(`${blockpos.x}_${blockpos.y}_${blockpos.z}`).time = Time(0.5);
                            }
                        }*/
                        //else{
                        Light.set(`${blockpos.x}_${blockpos.y}_${blockpos.z}`,{name:`${blockpos.x}_${blockpos.y}_${blockpos.z}`,x:blockpos.x,y:blockpos.y,z:blockpos.z,time:Time(0.5)});
                        const block = Block.create('minecraft:light_block',item.light)!;
                        region.setBlock(blockpos, block, 1);
                        //}
                    }
                    break;
                }
            }
        }
        else{
            EItems.delete(value.code);
        }
    }
}, 250);
const thred3 = setInterval(function(){
    for(const data of Light.values()){
        const player = bedrockServer.level.getRandomPlayer();
        if(player){
            const region = player.getRegion();
            const blockpos = BlockPos.create(data.x, data.y, data.z);
            const light = region.getBlock(blockpos)!;
            if(Time() > (data.time + 30*1000)){
                if(light.getName() == "minecraft:air"){
                    Light.delete(`${blockpos.x}_${blockpos.y}_${blockpos.z}`);
                }
            }
            else if(Time() > data.time){
                if(light.getName() == "minecraft:light_block"){
                    const block = Block.create('minecraft:air')!;
                    region.setBlock(blockpos, block, 1);
                }
            }
        }
    }
}, 250);


events.serverLeave.on(() => {
    clearInterval(thred);
    clearInterval(thred2);
    clearInterval(thred3);
});