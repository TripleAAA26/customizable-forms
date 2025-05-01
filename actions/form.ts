'use server'

import { currentUser } from '@clerk/nextjs/server'
import prismadb from '@/lib/prismadb'
import { formSchema, formSchemaType } from '@/schemas/form'
import { FormElementInstance } from '@/components/FormElements'
import { Question } from '@prisma/client'

class CustomError extends Error {}

export async function GetFormStats() {
    const user = await currentUser()
    if (!user) {
        throw new CustomError('User not found')
    }

    const stats = await prismadb.form.aggregate({
        where: {
            userId: user.id,
        },
        _sum: {
            visits: true,
            submissions: true
        }
    })

    const visits = stats._sum.visits || 0
    const submissions = stats._sum.submissions || 0

    let submissionRate = 0

    if (visits > 0) {
        submissionRate = (submissions / visits) * 100
    }

    const bounceRate = 100 - submissionRate

    return {
        visits, submissions, submissionRate, bounceRate
    }
}

export async function CreateForm(data: formSchemaType) {
    const  validation = formSchema.safeParse(data)
    if (!validation.success) {
        throw new Error('form not valid')
    }
    const user = await currentUser()
    if (!user) {
        throw new CustomError('User not found')
    }

    const form = await prismadb.form.create({
        data: {
            userId: user.id,
            name: data.name,
            description: data.description,
        }
    })

    if (!form) {
        throw new Error('Something went wrong')
    }

    return form.id
}

export async function GetForms() {
    const user = await currentUser()
    if (!user) {
        throw new CustomError('User not found')
    }

    return await prismadb.form.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

}

export async function GetFormById(id: number) {
    const user = await currentUser()
    if (!user) {
        throw new CustomError('User not found')
    }

    return await prismadb.form.findUnique({
        where: {
            userId: user.id,
            id
        },
        include: {
            questions: true
        }
    })
}


export async function UpdateFormContent(id: number, elements: FormElementInstance[]) {
    const user = await currentUser()
    if (!user) {
        throw new CustomError('User not found')
    }

    return await Promise.all(
        elements.map(element =>
            prismadb.question.upsert({
                where: {
                    id: element.id
                },
                update: element as Question,
                create: element as Question,
            })
        )
    )
}

export async function PublishForm(id: number) {
    const user = await currentUser()
    if (!user) {
        throw new CustomError('User not found')
    }

    return await prismadb.form.update({
        where: {
            userId: user.id,
            id,
        },
        data: {
            published: true,
        }
    })
}

export async function GetFormContentByUrl(formUrl: string) {
    const user = await currentUser()
    if (!user) {
        throw new CustomError('User not found')
    }

    return await prismadb.form.update({
        select: {
            id: true,
            questions: true,
        },
        data: {
            visits: {
                increment: 1,
            }
        },
        where: {
            shareURL: formUrl
        }
    })
}

export async function SubmitForm(formId: number, formUrl: string, content: [string, string][] ) {
    const user = await currentUser()
    if (!user) {
        throw new CustomError('User not found')
    }

    const answers = content.map(answer => {
        return {
            questionId: answer[0],
            answerText: answer[1],
        }
    })

    return await prismadb.form.update({
        where: {
            shareURL: formUrl,
            published: true,
        },
        data: {
            submissions: {
                increment: 1
            },
            FormSubmissions: {
                create: {
                    submittedUserId: user.id,
                    answers: {
                        createMany: {
                            data: answers
                        }
                    }
                }
            }
        },
    })
}

export async function GetFormWithSubmissions(id: number) {
    const user = await currentUser()
    if (!user) {
        throw new CustomError('User not found')
    }

    return await prismadb.form.findUnique({
        where: {
            userId: user.id,
            id
        },
        include: {
            questions: true,
            FormSubmissions: {
                include: {
                    answers: true
                }
            }
        }
    })
}