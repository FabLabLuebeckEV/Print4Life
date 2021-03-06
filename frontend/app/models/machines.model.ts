
export class Machine {
    constructor(
        public _id: String,
        public fablabId: String,
        public fablab: any,
        public deviceName: String,
        public type: String,
        public manufacturer: String,
        public activated: Boolean,
        public informationLink: String
    ) { }
}

export class Material {
    constructor(
        public material: String,
        public type: String
    ) { }
}

export class Lasertype {
    constructor(
        public laserType: String
    ) { }
}

export class Printer3D extends Machine {

    constructor(
        public _id: String,
        public fablabId: String,
        public deviceName: String,
        public type: String,
        public manufacturer: String,
        public activated: Boolean,
        public materials: Array<Material>,
        public camSoftware: String,
        public printVolumeX: Number,
        public printVolumeY: Number,
        public printVolumeZ: Number,
        public printResolutionX: Number,
        public printResolutionY: Number,
        public printResolutionZ: Number,
        public nozzleDiameter: String,
        public numberOfExtruders: Number,
        public comment: String,
        public informationLink: String
    ) { super(_id, fablabId, undefined, deviceName, type, manufacturer, activated, informationLink); }
}

export class MillingMachine extends Machine {
    constructor(
        public _id: String,
        public fablabId: String,
        public deviceName: String,
        public type: String,
        public manufacturer: String,
        public activated: Boolean,
        public camSoftware: String,
        public workspaceX: Number,
        public workspaceY: Number,
        public workspaceZ: Number,
        public movementSpeed: Number,
        public stepSize: Number,
        public comment: String,
        public informationLink: String
    ) { super(_id, fablabId, undefined, deviceName, type, manufacturer, activated, informationLink); }
}

export class OtherMachine extends Machine {
    constructor(
        public _id: String,
        public fablabId: String,
        public deviceName: String,
        public type: String,
        public manufacturer: String,
        public activated: Boolean,
        public typeOfMachine: String,
        public comment: String,
        public informationLink: String
    ) { super(_id, fablabId, undefined, deviceName, type, manufacturer, activated, informationLink); }
}

export class Lasercutter extends Machine {
    constructor(
        public _id: String,
        public fablabId: String,
        public deviceName: String,
        public type: String,
        public manufacturer: String,
        public activated: Boolean,
        public laserTypes: Array<Lasertype>,
        public camSoftware: String,
        public workspaceX: Number,
        public workspaceY: Number,
        public workspaceZ: Number,
        public maxResoultion: Number,
        public laserPower: String,
        public comment: String,
        public informationLink: String
    ) { super(_id, fablabId, undefined, deviceName, type, manufacturer, activated, informationLink); }
}
