export class Address {
    constructor(
        public street: String,
        public zipCode: String,
        public city: String,
        public country: String
    ) { }
}

export class Role {
    constructor(
        public role: String
    ) { }
}

export class User {
    constructor(
        public _id: String,
        public username: String,
        public firstname: String,
        public secondname: String,
        public password: String,
        public passwordValidation: String,
        public email: String,
        public address: Address,
        public role: Role
    ) { }
}

