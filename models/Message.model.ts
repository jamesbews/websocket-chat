export class Message {
    author: string; // NickName
    message: string;
    timestamp: string;
    messageColor: string;

    constructor(author: string, message: string, timestamp: string, messageColor: string) {
        this.author = author;
        this.message = message;
        this.timestamp = timestamp;
        this.messageColor = messageColor;
    }
}