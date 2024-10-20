import { FormListItem } from "./form-list-item.model";

export class RwwsIndexListItem extends FormListItem {
  isRWWSIndexPage: boolean;
  aircraftType: string;
  rwwsIndex: string;
  rwwsIndexDescription: string;
}
