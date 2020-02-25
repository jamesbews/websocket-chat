export class User {
    id: string;
    nickName: string;
    color: string;

    constructor(id: string, nickName: string, color: string) {
        this.id = id;
        this.nickName = nickName;
        this.color = color;
    }
}