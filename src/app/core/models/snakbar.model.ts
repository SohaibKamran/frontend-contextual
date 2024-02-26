export class SnakbarModel{
    isOpen?:boolean;
    data?:any;
    id?:string;
    case:string;
    message?:string;
    type?:string;
    user?:any;
    local?:boolean;
    uniqueId?:string;

    constructor(){
        this.isOpen=false;
    }
}