import { ReactNode } from 'react'

import { ElementsType } from '@/components/FormElements'
import { TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Checkbox } from '@/components/ui/checkbox'

export default function RowCell({ type, value }: { type: ElementsType, value: string}) {
    let node: ReactNode = value

    switch (type) {
        case 'DateField':
            if (!value) break
            const date = new Date(value)
            node = <Badge variant='outline'>{format(date, 'dd/MM/yyyy')}</Badge>
            break
        case 'CheckboxField':
            const checked = value === 'true'
            node = <Checkbox checked={checked} disabled />
            break
    }

    return (
        <TableCell>
            {node}
        </TableCell>
    )
}

