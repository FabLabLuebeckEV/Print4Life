export class Comment {
    constructor(
        public author: String,
        public content: String,
        public timestamp: Number
    ) { }
}

export class Order {
    constructor(
        public _id: String,
        public comments: Array<Comment>,
        public editor: String,
        public owner: String,
        public files: Array<any>,
        public status: String,
        token: String
    ) { }
}

