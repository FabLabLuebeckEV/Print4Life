import { Address } from './address.model';

export class Role {
    constructor(
        public role: String
    ) { }
}

export class Language {
    constructor(
        public language: String
    ) { }
}

export class User {
    constructor(
        public _id: String,
        public username: String,
        public firstname: String,
        public lastname: String,
        public password: String,
        public passwordValidation: String,
        public email: String,
        public address: Address,
        public role: Role,
        public preferredLanguage: Language,
        public activated: boolean,
        public fablabId: String
    ) { }
}

