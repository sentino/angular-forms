
export interface IItemIcpc2 {
  id: number,
  chapterNumber: number | null,
  chapterName: string,
  blockNumber: string,
  blockName: string,
  code: string,
  name: string,
  shortName: string,
  isPublic: boolean
}

export interface IIcpc2 {
  data: IItemIcpc2[]
}

