import { join } from "path";
import { about } from ".";

const fs = require('fs');
const _path = Dir();

export function LoadFile(path: string, name: string, type: string = "json", default_data: string = "{}"): string{
    if(path == "") path = `${_path}/`;
    else if(path.indexOf("@") == 0) path = `${_path}/${path.replace("@","")}/`;
    else if(path == "bedrock_server") path = "";
    else path = `${path}/`;
	if (fs.existsSync(`${path}${name}.${type}`))
        return fs.readFileSync(`${path}${name}.${type}`, 'utf8');
    return default_data;
}

export function SaveFile(path: string,name: string,data: string, type: string = "json"){
    if(path == "") path = `${_path}/`;
    else if(path.indexOf("@") == 0) path = `${_path}/${path.replace("@","")}/`;
    else if(path == "bedrock_server") path = "";
    else path = `${path}/`;
    fs.writeFileSync(`${path}${name}.${type}`, data);
}

/**
 * Convert Map to String
 * @param map Map<any,any>
 * @param key Name key
 * @returns string
 */
 export function MapToString(map: Map<any,any>): string{
	let list = [];
	for(var data of map.values()){
		list.push(data);
	}
    return JSON.stringify({data:list},null,4);
}

/**
 * Return Map
 * @param data string
 * @param key string
 * @returns
 */
export function StringToMap(data: string, key: string): Map<any,any>{
    const map = new Map<any,any>();
    const json = JSON.parse(data);
    for(const _data of json.data){
        for(const _key of Object.keys(_data)){
            if(key == _key){
                map.set(_data[_key], _data);
                break;
            }
        }
    }
    return map;
}

export enum TypePrint {
    info,
    succes,
    error,
    alert,
    default
}

/**
 *
 * @param seconds add seconds in time
 * @returns
 */
export function Time(seconds: number = 0): number{
    return new Date().getTime() + (seconds*1000);
}

export function DateFromTime(time: number): string{
    const date = new Date(time);
    return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

/**
 * Return a random number
 * @param min Minimum number
 * @param max Maximum number
 * @returns number
 */
 export function Random(min: number, max: number = 0): number{
    if(max == 0)
        return Math.floor(Math.random() * min);
	return min + Math.floor(Math.random() * max);
}

/**
 * Returns a random character string
 * @param length string max number
 * @returns string
 */
 export function getCode(length: number = 8): string {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

/**
 * print to console
 * @param message Message
 * @param type Type
 */
export function Print(message: string, type: TypePrint = TypePrint.default){
    about.name = about.name.replace("@bdsx/","");
    switch(type){
        case TypePrint.info:{
            console.info(`[${about.name}] `.magenta + message.blue);
            break;
        }
        case TypePrint.succes:{
            console.log(`[${about.name}] `.magenta + message.green);
            break;
        }
        case TypePrint.error:{
            console.error(`[${about.name}] `.magenta + message.red);
            break;
        }
        case TypePrint.alert:{
            console.warn(`[${about.name}] `.magenta + message.yellow);
            break;
        }
        case TypePrint.default:{
            console.log(`[${about.name}] `.magenta + message.white);
            break;
        }
    }
}

function Dir(){
    if (fs.existsSync(`${join(process.cwd(), '..','plugins','dynamiclight')}/package.json`))
        return join(process.cwd(), '..','plugins','dynamiclight');
    return "../node_modules/@bdsx/dynamiclight";
}