import { IIcpc2, IItemIcpc2 } from '../interfaces/icpc2.interface';

export class Icpc2 {
  rawData: IIcpc2 | undefined;
  dictionaryForForm: {
    id: number | null,
    name: string
  }[] = [{ id: null, name: '' }];
  constructor(raw: IIcpc2) {
    if (!raw) {
      return
    }

    this.rawData = raw;
    this.dictionaryForForm = raw.data.map(item => {
      return {
        id: item.id,
        name: item.name
      }
    });
  }

  public getFullDataByID(id: number): IItemIcpc2 | void {
    if (!id) return;
    return this.rawData?.data.find((item: IItemIcpc2) => item.id === id);
  }
}
