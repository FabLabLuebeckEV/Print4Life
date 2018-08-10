export class Comment {
    constructor(
        public author: String,
        public content: String,
        public timestamp: Number
    ) { }
}

export class SimpleMachine {
    constructor(
        public _id: String,
        public type: String,
    ) { }
}

export class Order {
    constructor(
        public _id: String,
        public projectname: String,
        public comments: Array<Comment>,
        public editor: String,
        public owner: String,
        public files: Array<any>,
        public status: String,
        public machine: SimpleMachine,
        token: String
    ) { }
}

