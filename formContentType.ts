const formContent = [
    {
        'id': '7071',
        'type': 'TextField',
        'extraAttributes': {
            'label': 'Text field',
            'helperText': 'Helper text',
            'required': false,
            'placeHolder': 'Value here...'
        }
    },
    {
        'id': '7032',
        'type': 'SeparatorField'
    },
    {
        'id': '8912',
        'type': 'SelectField',
        'extraAttributes': {
            'label': 'choose language',
            'helperText': 'main lang',
            'required': true,
            'placeHolder': 'Java',
            'options': [ 'JS', 'Java', 'Swift' ]
        }
    },
    {
        'id': '6932',
        'type': 'SpacerField',
        'extraAttributes': { 'height': 20 }
    },
    {
        'id': '3447',
        'type': 'DateField',
        'extraAttributes': {
            'label': 'Date field',
            'helperText': 'Pick a date',
            'required': false
        }
    }
]



// model Form {
//     id          Int      @id @default(autoincrement())
//     userId      Int
//     title       String
//     description String?
//     createdAt   DateTime @default(now())
//     // Automatically update the updatedAt column on every update.
//     updatedAt   DateTime @updatedAt
//
//     // Relations
//     user      User       @relation(fields: [userId], references: [id])
//     questions Question[]
//     responses Response[]
// }
//
// model Question {
//     id           Int       @id @default(autoincrement())
//     formId       Int
//     questionText String
//     // Field to capture types such as 'text', 'multiple_choice', 'checkbox', etc.
//     questionType String
//     isRequired   Boolean   @default(false)
//     ordering     Int?      // Optional ordering for display purposes
//
//     // Relations
//     form    Form    @relation(fields: [formId], references: [id])
//     choices Choice[]
//     answers Answer[]
// }
//
// model Choice {
//     id         Int      @id @default(autoincrement())
//     questionId Int
//     choiceText String
//     ordering   Int?     // Helps in ordering the display of choices
//
//         // Relations
//         question Question @relation(fields: [questionId], references: [id])
//     // Answers that reference this choice, for questions like multiple-choice.
//     answers  Answer[]
// }
//
// model Response {
//     id              Int      @id @default(autoincrement())
//     formId          Int
//     // Optional email if the respondent is known; can be left null for anonymous submissions.
//     respondentEmail String?
//         submittedAt     DateTime @default(now())
//
//     // Relations
//     form    Form    @relation(fields: [formId], references: [id])
//     answers Answer[]
// }
//
// model Answer {
//     id         Int      @id @default(autoincrement())
//     responseId Int
//     questionId Int
//     // For text-based or free-form answers.
//     answerText String?
//         // For storing the chosen option (if applicable). For multiple selections (e.g., checkboxes),
//         // you can record one answer per selected choice.
//         choiceId   Int?
//
//             // Relations
//             response Response @relation(fields: [responseId], references: [id])
//     question Question @relation(fields: [questionId], references: [id])
//     choice   Choice?  @relation(fields: [choiceId], references: [id])
// }
