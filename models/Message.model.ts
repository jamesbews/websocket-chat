export class Message {
    author: string;
    message: string;
    timestamp: string;

    constructor(author: string, message: string, timestamp: string) {
        this.author = author;
        this.message = message;
        this.timestamp = timestamp;
    }
}