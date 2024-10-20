export function specsValidationHint(lowerInclusive: boolean, upperInclusive: boolean, minValue?: number | '', maxValue?: number | '', uom?: string): string {
    return `This value should be ${minValue && (lowerBoundString(lowerInclusive) + ' ' + minValue)} ${minValue && maxValue ? 'and' : ''} ${maxValue && (upperBoundString(upperInclusive) + ' ' + maxValue)} ${uom ?? ''} `
}

enum SpecsHintString {
    Max = "<",
    Min = ">",
    Inclusive = "="
}

const lowerBoundString = (isInclusive: boolean) => `${SpecsHintString.Min}${isInclusive ? SpecsHintString.Inclusive : ''}`
const upperBoundString = (isInclusive: boolean) => `${SpecsHintString.Max}${isInclusive ? SpecsHintString.Inclusive : ''}`