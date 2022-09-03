"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = exports.getCode = exports.Random = exports.DateFromTime = exports.Time = exports.TypePrint = exports.StringToMap = exports.MapToString = exports.SaveFile = exports.LoadFile = void 0;
const path_1 = require("path");
const _1 = require(".");
const fs = require('fs');
const _path = Dir();
function LoadFile(path, name, type = "json", default_data = "{}") {
    if (path == "")
        path = `${_path}/`;
    else if (path.indexOf("@") == 0)
        path = `${_path}/${path.replace("@", "")}/`;
    else if (path == "bedrock_server")
        path = "";
    else
        path = `${path}/`;
    if (fs.existsSync(`${path}${name}.${type}`))
        return fs.readFileSync(`${path}${name}.${type}`, 'utf8');
    return default_data;
}
exports.LoadFile = LoadFile;
function SaveFile(path, name, data, type = "json") {
    if (path == "")
        path = `${_path}/`;
    else if (path.indexOf("@") == 0)
        path = `${_path}/${path.replace("@", "")}/`;
    else if (path == "bedrock_server")
        path = "";
    else
        path = `${path}/`;
    fs.writeFileSync(`${path}${name}.${type}`, data);
}
exports.SaveFile = SaveFile;
/**
 * Convert Map to String
 * @param map Map<any,any>
 * @param key Name key
 * @returns string
 */
function MapToString(map) {
    let list = [];
    for (var data of map.values()) {
        list.push(data);
    }
    return JSON.stringify({ data: list }, null, 4);
}
exports.MapToString = MapToString;
/**
 * Return Map
 * @param data string
 * @param key string
 * @returns
 */
function StringToMap(data, key) {
    const map = new Map();
    const json = JSON.parse(data);
    for (const _data of json.data) {
        for (const _key of Object.keys(_data)) {
            if (key == _key) {
                map.set(_data[_key], _data);
                break;
            }
        }
    }
    return map;
}
exports.StringToMap = StringToMap;
var TypePrint;
(function (TypePrint) {
    TypePrint[TypePrint["info"] = 0] = "info";
    TypePrint[TypePrint["succes"] = 1] = "succes";
    TypePrint[TypePrint["error"] = 2] = "error";
    TypePrint[TypePrint["alert"] = 3] = "alert";
    TypePrint[TypePrint["default"] = 4] = "default";
})(TypePrint = exports.TypePrint || (exports.TypePrint = {}));
/**
 *
 * @param seconds add seconds in time
 * @returns
 */
function Time(seconds = 0) {
    return new Date().getTime() + (seconds * 1000);
}
exports.Time = Time;
function DateFromTime(time) {
    const date = new Date(time);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
exports.DateFromTime = DateFromTime;
/**
 * Return a random number
 * @param min Minimum number
 * @param max Maximum number
 * @returns number
 */
function Random(min, max = 0) {
    if (max == 0)
        return Math.floor(Math.random() * min);
    return min + Math.floor(Math.random() * max);
}
exports.Random = Random;
/**
 * Returns a random character string
 * @param length string max number
 * @returns string
 */
function getCode(length = 8) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.getCode = getCode;
/**
 * print to console
 * @param message Message
 * @param type Type
 */
function Print(message, type = TypePrint.default) {
    _1.about.name = _1.about.name.replace("@bdsx/", "");
    switch (type) {
        case TypePrint.info: {
            console.info(`[${_1.about.name}] `.magenta + message.blue);
            break;
        }
        case TypePrint.succes: {
            console.log(`[${_1.about.name}] `.magenta + message.green);
            break;
        }
        case TypePrint.error: {
            console.error(`[${_1.about.name}] `.magenta + message.red);
            break;
        }
        case TypePrint.alert: {
            console.warn(`[${_1.about.name}] `.magenta + message.yellow);
            break;
        }
        case TypePrint.default: {
            console.log(`[${_1.about.name}] `.magenta + message.white);
            break;
        }
    }
}
exports.Print = Print;
function Dir() {
    if (fs.existsSync(`${(0, path_1.join)(process.cwd(), '..', 'plugins', 'dynamiclight')}/package.json`))
        return (0, path_1.join)(process.cwd(), '..', 'plugins', 'dynamiclight');
    return "../node_modules/@bdsx/dynamiclight";
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBNEI7QUFDNUIsd0JBQTBCO0FBRTFCLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixNQUFNLEtBQUssR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUVwQixTQUFnQixRQUFRLENBQUMsSUFBWSxFQUFFLElBQVksRUFBRSxPQUFlLE1BQU0sRUFBRSxlQUF1QixJQUFJO0lBQ25HLElBQUcsSUFBSSxJQUFJLEVBQUU7UUFBRSxJQUFJLEdBQUcsR0FBRyxLQUFLLEdBQUcsQ0FBQztTQUM3QixJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztRQUFFLElBQUksR0FBRyxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBQyxFQUFFLENBQUMsR0FBRyxDQUFDO1NBQ3RFLElBQUcsSUFBSSxJQUFJLGdCQUFnQjtRQUFFLElBQUksR0FBRyxFQUFFLENBQUM7O1FBQ3ZDLElBQUksR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDO0lBQzFCLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxFQUFFLENBQUM7UUFDcEMsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM3RCxPQUFPLFlBQVksQ0FBQztBQUN4QixDQUFDO0FBUkQsNEJBUUM7QUFFRCxTQUFnQixRQUFRLENBQUMsSUFBWSxFQUFDLElBQVksRUFBQyxJQUFZLEVBQUUsT0FBZSxNQUFNO0lBQ2xGLElBQUcsSUFBSSxJQUFJLEVBQUU7UUFBRSxJQUFJLEdBQUcsR0FBRyxLQUFLLEdBQUcsQ0FBQztTQUM3QixJQUFHLElBQUksQ0FBQyxPQUFP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