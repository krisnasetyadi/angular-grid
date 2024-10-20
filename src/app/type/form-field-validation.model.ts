export default interface FormFieldValidationModel {
    readonly isRequired: boolean;
    readonly minLength?: number;
    readonly maxLength?: number;
    readonly minValue?: number;
    readonly maxValue?: number;
    readonly customValidation: ()=> boolean;
    readonly validationHint: string;
}