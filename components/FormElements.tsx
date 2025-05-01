import { TextFieldFormElement } from '@/components/fields/TextField'
import { TitleFieldFormElement } from '@/components/fields/TitleField'
import { SubTitleFieldFormElement } from '@/components/fields/SubTitleField'
import { ParagraphFieldFormElement } from '@/components/fields/ParagraphField'
import { SeparatorFieldFormElement } from '@/components/fields/SeparatorField'
import { SpacerFieldFormElement } from '@/components/fields/SpacerField'
import { NumberFieldFormElement } from '@/components/fields/NumberField'
import { TextAreaFieldFormElement } from '@/components/fields/TextAreaField'
import { DateFieldFormElement } from '@/components/fields/DateField'
import { SelectFieldFormElement } from '@/components/fields/SelectField'
import { CheckboxFieldFormElement } from '@/components/fields/CheckboxField'

export type ElementsType =
    'TextField' |
    'TitleField' |
    'SubTitleField' |
    'ParagraphField' |
    'SeparatorField' |
    'SpacerField' |
    'NumberField' |
    'TextAreaField' |
    'DateField' |
    'SelectField' |
    'CheckboxField'

export type FormElementInstance = {
    id: string
    type: ElementsType
    formId: number

    title?: string
    text?: string
    height?: number
    label?: string
    helperText?: string
    required?: boolean
    placeHolder?: string
    rows?: number
    options?: string[]

    ordering: number

    answers?: Answer[]
}


export type Answer = {
    id: number
    submissionId: number
    questionId: string
    answerText?: string
    choiceId?: number
}

export type SubmitFunction = (key: string, value: string) => void

export type FormElement = {
    type: ElementsType

    construct: (id: string, formId: number, ordering: number) => FormElementInstance

    designerButtonElement: {
        icon: React.ElementType,
        label: string
    }

    designerComponent: React.FC<{
        elementInstance: FormElementInstance
    }>
    formComponent: React.FC<{
        elementInstance: FormElementInstance
        submitValue?: (key: string, value: string) => void
        isInvalid?: boolean
        defaultValue?: string
    }>
    propertiesComponent: React.FC<{
        elementInstance: FormElementInstance
    }>

    validate: (formElement: FormElementInstance, currentValue: string) => boolean
}

type FormElementsType = {
    [key in ElementsType]: FormElement
}

export const FormElements: FormElementsType = {
    TextField: TextFieldFormElement,
    TitleField: TitleFieldFormElement,
    SubTitleField: SubTitleFieldFormElement,
    ParagraphField: ParagraphFieldFormElement,
    SeparatorField: SeparatorFieldFormElement,
    SpacerField: SpacerFieldFormElement,
    NumberField: NumberFieldFormElement,
    TextAreaField: TextAreaFieldFormElement,
    DateField: DateFieldFormElement,
    SelectField: SelectFieldFormElement,
    CheckboxField: CheckboxFieldFormElement,
}