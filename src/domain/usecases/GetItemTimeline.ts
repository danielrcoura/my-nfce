import ItemsRepo, { ItemDataPoint } from "../interfaces/ItemsRepo"

export default class GetItemTimelineUsecase {
  constructor(private itemsRepo: ItemsRepo) { }

  exec(id: number): Promise<ItemDataPoint[]> {
    return this.itemsRepo.getItemTimeline(id)
  }
}