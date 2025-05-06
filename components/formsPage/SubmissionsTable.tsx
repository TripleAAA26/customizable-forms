import { GetFormWithSubmissions } from '@/actions/form'
import { FormElementInstance } from '@/components/FormElements'
import { ElementsType } from '@/components/FormElements'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDistance } from 'date-fns'
import RowCell from '@/components/formsPage/RowCell'
import { getTranslations } from 'next-intl/server'


type columnsType = {
    id: string
    label: string
    required: boolean
    type: ElementsType
}[]

type Answer = {
    id: number
    formId: number
    submissionId: number
    questionId: string
    answerText: string | null
}[]
type RowType = {
    content: Answer
    submittedAt: Date
}

export default async function SubmissionsTable({ id }: { id: number } ) {
    const form = await GetFormWithSubmissions(id)
    const t = await getTranslations('FormsPage')

    if (!form) throw new Error('form not found')

    const formElements = form.questions as FormElementInstance[]

    const columns: columnsType = []

    formElements.forEach(element => {
        switch (element.type) {
            case 'TextField':
            case 'NumberField':
            case 'TextAreaField':
            case 'DateField':
            case 'SelectField':
            case 'CheckboxField':
                columns.push({
                    id: element.id,
                    label: element?.label || '',
                    required: element?.required || false,
                    type: element.type,
                })
                break
            default:
                break
        }
    })

    const rows: RowType[] = []

    form.FormSubmissions.forEach(submission => {
        const content = submission.answers

        rows.push({
            content,
            submittedAt: submission.createdAt,
        })
    })

    return (
        <div>
            <h1 className='text-2xl font-bold my-4'>{t('submissions')}</h1>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map(column =>
                                <TableHead key={column.id} className='uppercase'>
                                    {column.label}
                                </TableHead>
                            )}
                            <TableHead className='text-muted-foreground text-right uppercase'>
                                Submitted at
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row, index) =>
                            <TableRow key={index}>
                                {columns.map(column =>
                                    <RowCell
                                        key={column.id}
                                        type={column.type}
                                        value={row.content.find(answer =>
                                            answer.questionId === column.id
                                        )?.answerText as string}
                                    />
                                )}
                                <TableCell className='text-muted-foreground text-right'>
                                    {formatDistance(row.submittedAt, new Date(), { addSuffix: true })}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
