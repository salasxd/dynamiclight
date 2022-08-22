"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = exports.getCode = exports.Random = exports.DateFromTime = exports.Time = exports.TypePrint = exports.StringToMap = exports.MapToString = exports.SaveFile = exports.LoadFile = void 0;
const path_1 = require("path");
const _1 = require(".");
const fs = require('fs');
const _path = (0, path_1.join)(process.cwd(), '..', 'plugins', 'dynamiclight');
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
    for (const [_key, _value] of Object.entries(data)) {
        if (key == _key)
            map.set(_key, _value);
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
function Time() {
    return new Date().getTime();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBNEI7QUFDNUIsd0JBQTBCO0FBRTFCLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixNQUFNLEtBQUssR0FBRyxJQUFBLFdBQUksRUFBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxFQUFDLFNBQVMsRUFBQyxjQUFjLENBQUMsQ0FBQztBQUVqRSxTQUFnQixRQUFRLENBQUMsSUFBWSxFQUFFLElBQVksRUFBRSxPQUFlLE1BQU0sRUFBRSxlQUF1QixJQUFJO0lBQ25HLElBQUcsSUFBSSxJQUFJLEVBQUU7UUFBRSxJQUFJLEdBQUcsR0FBRyxLQUFLLEdBQUcsQ0FBQztTQUM3QixJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztRQUFFLElBQUksR0FBRyxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBQyxFQUFFLENBQUMsR0FBRyxDQUFDO1NBQ3RFLElBQUcsSUFBSSxJQUFJLGdCQUFnQjtRQUFFLElBQUksR0FBRyxFQUFFLENBQUM7O1FBQ3ZDLElBQUksR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDO0lBQzFCLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxFQUFFLENBQUM7UUFDcEMsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM3RCxPQUFPLFlBQVksQ0FBQztBQUN4QixDQUFDO0FBUkQsNEJBUUM7QUFFRCxTQUFnQixRQUFRLENBQUMsSUFBWSxFQUFDLElBQVksRUFBQyxJQUFZLEVBQUUsT0FBZSxNQUFNO0lBQ2xGLElBQUcsSUFBSSxJQUFJLEVBQUU7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