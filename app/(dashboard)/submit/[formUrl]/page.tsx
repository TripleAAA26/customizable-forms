import { GetFormContentByUrl } from '@/actions/form'
import { FormElementInstance } from '@/components/FormElements'
import FormSubmitComponent from '@/components/submitPage/FormSubmitComponent'

export default async function SubmitPage({ params }: { params: { formUrl: string } }) {
    const { formUrl } = await params
    const form = await GetFormContentByUrl(formUrl)

    if (!form) {
        throw new Error('form not found')
    }

    const formContent = form.questions as FormElementInstance[]

    return (
        <FormSubmitComponent formId={form.id} formUrl={formUrl} content={formContent} />
    )
}

