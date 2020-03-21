import { Address } from './address.model';

export class Fablab {
  constructor(
    public _id: String,
    public name: String,
    public address: Address,
    public activated: Boolean
  ) {}
}
