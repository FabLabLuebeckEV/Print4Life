export class Schedule {
    public startDay: { year: number, month: number, day: number };
    public startTime: { hour: number, minute: number };
    public endDay: { year: number, month: number, day: number };
    public endTime: { hour: number, minute: number };
    constructor(
        public id: string,
        public startDate: Date,
        public endDate: Date,
        public fablabId: string,
        public machine: { type: string, id: string },
        public orderId: string
    ) { }
}
