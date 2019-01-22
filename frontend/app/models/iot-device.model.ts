export class IotDevice {
    constructor(
        public _id: String,
        public clientId: String,
        public deviceId: String,
        public deviceType: String,
        public username: String,
        public password: String,
        public events: Event[]
    ) { }
}

export class Event {
    constructor(
        public format: String,
        public topic: String
    ) { }
}
