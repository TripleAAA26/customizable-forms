'use server'

import { currentUser } from '@clerk/nextjs/server'
import prismadb from '@/lib/prismadb'
import { formSchema, formSchemaType } from '@/schemas/form'
import { FormElementInstance } from '@/components/FormElements'
import { Question } from '@prisma/client'
import { revalidatePath } from 'next/cache'

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

export async function DeleteForm(formId: number) {
    const user = await currentUser()
    if (!user) {
        throw new CustomError('User not found')
    }

    const deleteForm = prismadb.form.delete({
        where: {
            id: formId,
        }
    })

    const whereFormId = {
        where: {
            formId: formId,
        }
    }
    const deleteQuestion = prismadb.question.deleteMany(whereFormId)
    const deleteFormSubmission = prismadb.formSubmissions.deleteMany(whereFormId)
    const deleteAnswer = prismadb.answer.deleteMany(whereFormId)
    const deleteComment = prismadb.comment.deleteMany(whereFormId)
    const deleteLike = prismadb.like.deleteMany(whereFormId)

    await prismadb.$transaction([deleteComment, deleteLike, deleteAnswer, deleteFormSubmission, deleteQuestion, deleteForm])

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
            questions: true,
            comments: true,
            likes: true,
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
            formId: formId,
        }
    })

    return await prismadb.form.update({
        where: {
            shareURL: formUrl,
            id: formId,
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

export async function AddComment(id: number, text: string) {
    const user = await currentUser()
    if (!user) {
        throw new CustomError('User not found')
    }

    try {
        await prismadb.comment.create({
            data: {
                userId: user.id,
                userName: user.firstName || '',
                formId: id,
                text: text,
            }
        })
        revalidatePath('/forms')

        return { message: 'ok' }

    } catch (error) {
        return { message: error }
    }
}

export async function AddLike(formId: number, userId: string) {
    const user = await currentUser()
    if (!user) {
        throw new CustomError('User not found')
    }

    await prismadb.like.create({
        data: {
            formId,
            userId,
        }
    })
    revalidatePath('/forms')
}

export async function DeleteLike(id: number) {
    const user = await currentUser()
    if (!user) {
        throw new CustomError('User not found')
    }

    await prismadb.like.delete({
        where: {
            id
        }
    })
    revalidatePath('/forms')
}