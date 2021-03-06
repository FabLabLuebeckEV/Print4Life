import { Address } from './address.model';

export class Comment {
    constructor(
        public author: String,
        public content: String,
        public createdAt: Date
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
        public fablabId: String,
        public projectname: String,
        public comments: Array<Comment>,
        public editor: String,
        public owner: String,
        public files: Array<any>,
        public status: String,
        public machine: SimpleMachine,
        public createdAt: Date,
        public shippingAddress: Address,
        public shared: Boolean,
        public fileCopyright: Boolean,
        public token: String,
        public thankyouText: String,
        public blueprintId: String,
        public batch: {
                number: number
                accepted: Array<any>,
                finished: Array<any>,
                acceptedCount: number
                finishedCount: number
        },
        public isBatched: Boolean
    ) { }
}

