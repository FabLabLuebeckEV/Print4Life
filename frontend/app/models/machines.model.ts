
export class Machine {
    constructor(
        public _id: String,
        public fablabId: String,
        public fablab: any,
        public deviceName: String,
        public type: String,
        public manufacturer: String) {
    }
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
        public comment: String
    ) { super(_id, fablabId, undefined, deviceName, type, manufacturer); }
}

export class MillingMachine extends Machine {
    constructor(
        public _id: String,
        public fablabId: String,
        public deviceName: String,
        public type: String,
        public manufacturer: String,
        public camSoftware: String,
        public workspaceX: Number,
        public workspaceY: Number,
        public workspaceZ: Number,
        public movementSpeed: Number,
        public stepSize: Number,
        public comment: String
    ) { super(_id, fablabId, undefined, deviceName, type, manufacturer); }
}

export class OtherMachine extends Machine {
    constructor(
        public _id: String,
        public fablabId: String,
        public deviceName: String,
        public type: String,
        public manufacturer: String,
        public typeOfMachine: String,
        public comment: String
    ) { super(_id, fablabId, undefined, deviceName, type, manufacturer); }
}

export class Lasercutter extends Machine {
    constructor(
        public _id: String,
        public fablabId: String,
        public deviceName: String,
        public type: String,
        public manufacturer: String,
        public laserTypes: Array<Lasertype>,
        public camSoftware: String,
        public workspaceX: Number,
        public workspaceY: Number,
        public workspaceZ: Number,
        public maxResoultion: Number,
        public laserPower: String,
        public comment: String
    ) { super(_id, fablabId, undefined, deviceName, type, manufacturer); }
}
