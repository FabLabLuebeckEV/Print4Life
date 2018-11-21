export class Address {
    constructor(
        public street: String,
        public zipCode: String,
        public city: String,
        public country: String
    ) { }
    public compare(other: Address) {
        return other &&
            other.street === this.street
            && other.city === this.city
            && other.zipCode === this.zipCode
            && other.country === this.country;
    }
}
