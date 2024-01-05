"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCode = exports.Random = exports.DateFromTime = exports.Time = exports.StringToMap = exports.MapToString = exports.SaveFile = exports.LoadFile = exports.TypeFile = exports.TypePath = exports.plugin = void 0;
const serverproperties_1 = require("bdsx/serverproperties");
const path_1 = require("path");
exports.plugin = { name: "DynamicLight", version: "3.0.0" };
const fs = require('fs');
//console.log(`[${plugin.name}] `.magenta + "");
var TypePath;
(function (TypePath) {
    TypePath[TypePath["world"] = 0] = "world";
    TypePath[TypePath["server"] = 1] = "server";
    TypePath[TypePath["plugin"] = 2] = "plugin";
})(TypePath || (exports.TypePath = TypePath = {}));
var TypeFile;
(function (TypeFile) {
    TypeFile[TypeFile["txt"] = 0] = "txt";
    TypeFile[TypeFile["json"] = 1] = "json";
    TypeFile[TypeFile["dat"] = 2] = "dat";
    TypeFile[TypeFile["data_old"] = 3] = "data_old";
    TypeFile[TypeFile["data"] = 4] = "data";
    TypeFile[TypeFile["sql"] = 5] = "sql";
    TypeFile[TypeFile["ini"] = 6] = "ini";
    TypeFile[TypeFile["properties"] = 7] = "properties";
    TypeFile[TypeFile["lang"] = 8] = "lang";
})(TypeFile || (exports.TypeFile = TypeFile = {}));
function LoadFile(type_path, path, name, type = TypeFile.json, default_data = "{}") {
    let dir = undefined;
    switch (type_path) {
        case TypePath.plugin:
            dir = (0, path_1.join)(process.cwd(), '..', 'plugins', `${exports.plugin.name}`) + "/";
            break;
        case TypePath.world:
            dir = `worlds/${serverproperties_1.serverProperties["level-name"]}/`;
            break;
        case TypePath.server:
            dir = "";
            break;
    }
    if (fs.existsSync(`${dir}${path}${name}.${TypeFile[type]}`))
        return fs.readFileSync(`${dir}${path}${name}.${TypeFile[type]}`, 'utf8');
    return default_data;
}
exports.LoadFile = LoadFile;
function SaveFile(type_path, path, name, data, type = TypeFile.json) {
    let dir = undefined;
    switch (type_path) {
        case TypePath.plugin:
            dir = (0, path_1.join)(process.cwd(), '..', 'plugins', `${exports.plugin.name}`) + "/";
            break;
        case TypePath.world:
            dir = `worlds/${serverproperties_1.serverProperties["level-name"]}/`;
            break;
        case TypePath.server:
            dir = "";
            break;
    }
    fs.writeFileSync(`${dir}${path}${name}.${TypeFile[type]}`, data);
}
exports.SaveFile = SaveFile;
function MapToString(map) {
    let list = [];
    for (var data of map.values()) {
        list.push(data);
    }
    return JSON.stringify({ type: "map", data: list }, null, 4);
}
exports.MapToString = MapToString;
function StringToMap(data, key_main) {
    const map = new Map();
    const json = JSON.parse(data);
    if (json.type && json.type == "map") {
        for (const _data of json.data) {
            for (const key of Object.keys(_data)) {
                if (key_main == key) {
                    map.set(_data[key_main], _data);
                    break;
                }
            }
        }
    }
    return map;
}
exports.StringToMap = StringToMap;
function Time(seconds = 0) {
    return new Date().getTime() + (seconds * 1000);
}
exports.Time = Time;
function DateFromTime(time) {
    const date = new Date(time);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
exports.DateFromTime = DateFromTime;
function Random(min, max = 0) {
    if (max == 0)
        return Math.floor(Math.random() * min);
    return min + Math.floor(Math.random() * max);
}
exports.Random = Random;
function getCode(length = 8) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.getCode = getCode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw0REFBeUQ7QUFDekQsK0JBQTRCO0FBRWYsUUFBQSxNQUFNLEdBQUcsRUFBQyxJQUFJLEVBQUMsY0FBYyxFQUFDLE9BQU8sRUFBQyxPQUFPLEVBQUMsQ0FBQztBQUM1RCxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFekIsZ0RBQWdEO0FBRWhELElBQVksUUFJWDtBQUpELFdBQVksUUFBUTtJQUNoQix5Q0FBSyxDQUFBO0lBQ0wsMkNBQU0sQ0FBQTtJQUNOLDJDQUFNLENBQUE7QUFDVixDQUFDLEVBSlcsUUFBUSx3QkFBUixRQUFRLFFBSW5CO0FBRUQsSUFBWSxRQVVYO0FBVkQsV0FBWSxRQUFRO0lBQ2hCLHFDQUFHLENBQUE7SUFDSCx1Q0FBSSxDQUFBO0lBQ0oscUNBQUcsQ0FBQTtJQUNILCtDQUFRLENBQUE7SUFDUix1Q0FBSSxDQUFBO0lBQ0oscUNBQUcsQ0FBQTtJQUNILHFDQUFHLENBQUE7SUFDSCxtREFBVSxDQUFBO0lBQ1YsdUNBQUksQ0FBQTtBQUNSLENBQUMsRUFWVyxRQUFRLHdCQUFSLFFBQVEsUUFVbkI7QUFFRCxTQUFnQixRQUFRLENBQUMsU0FBbUIsRUFBRSxJQUFZLEVBQUUsSUFBWSxFQUFFLE9BQWlCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsZUFBdUIsSUFBSTtJQUNqSSxJQUFJLEdBQUcsR0FBRyxTQUFTLENBQUM7SUFDcEIsUUFBTyxTQUFTLEVBQUM7UUFDYixLQUFLLFFBQVEsQ0FBQyxNQUFNO1lBQ2hCLEdBQUcsR0FBRyxJQUFBLFdBQUksRUFBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxFQUFDLFNBQVMsRUFBQyxHQUFHLGNBQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUNyRSxNQUFNO1FBQ04sS0FBSyxRQUFRLENBQUMsS0FB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