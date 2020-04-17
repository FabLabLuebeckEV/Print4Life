import { Address } from './address.model';

export class Hospital {
    constructor(
        public _id: String,
        public name: String,
        public address: Address,
        public activated: Boolean,
        public owner: String,
        public hospitalNumber: String
    ) { }
}
