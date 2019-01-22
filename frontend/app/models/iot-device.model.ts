export class IotDevice {
    constructor(
        public _id: String,
        public clientId: String,
        public deviceId: String,
        public deviceType: DeviceType,
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

export class DeviceType {
    constructor(
        public name: String
    ) { }
}
