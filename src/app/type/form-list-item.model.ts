import { Wrapper } from "../../../app/models/Wrapper";
import { HeaderFieldListItem } from "./header-field-list-item.model";


export class FormListItemWrapper extends Wrapper<FormListItem> {
  constructor(data: FormListItem) {
    super(data);
  }

  orderHeaderFields(headerFieldIds: string[]) {
    const headerFields: HeaderFieldListItem[] = [];
    for (const fieldName of headerFieldIds) {
      const headerField = this.data.headerFields.find((item) => item.id === fieldName);

      if (headerField) {
        headerFields.push(headerField);
      } else {
        const field = new HeaderFieldListItem();
        field.id = fieldName;
        field.value = "";
        headerFields.push(field);
      }
    }

    this.data.headerFields = headerFields;
  }
}

export class FormListItem {
  id: number;
  name: string;
  type: string;
  version: string;
  status: string;
  headerFields: HeaderFieldListItem[];
  isDeletable: boolean;
}
