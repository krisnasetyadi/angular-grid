import { ModalOptions } from "ngx-bootstrap/modal";

export const MOMENT_DATE_FORMAT = "DD/MMM/YY";
export const MOMENT_DATE_FORMAT_WITH_TIME = "DD/MMM/YY HH:mm:ss";
export const MOMENT_MANUAL_REV_DATE_FORMAT = "DD MMM YYYY";
export const SIMPLE_DATE_FORMAT = "dd/MM/yyyy hh:mm a";

export const ANGULAR_DATE_FORMAT = "dd/MMM/yy";
export const MOMENT_DATE_FORMAT_MONTH_DIGITAL = "DD/MM/YY"
export const MOMENT_DATE_FORMAT_WITH_FULL_YEAR = "DD/MMM/YYYY"

export const MODAL_OPTIONS: ModalOptions = {
    backdrop: 'static',
    keyboard: false
};

export const MODAL_OPTIONS_XL: ModalOptions = {
    ...MODAL_OPTIONS,
    class: "modal-xl"
};

export const MODAL_OPTIONS_LG: ModalOptions = {
  ...MODAL_OPTIONS,
  class: "modal-lg"
};

export const MODAL_OPTIONS_MD: ModalOptions = {
  ...MODAL_OPTIONS,
  class: "modal-md"
};

export const MODAL_OPTIONS_SM: ModalOptions = {
  ...MODAL_OPTIONS,
  class: "modal-sm"
};
