// @ts-ignore
export interface Question {
    id: string;
    text: string;
    image?: any;
    fromPhone: string;
}

// @ts-ignore
export interface Answer {
    id: string;
    text?: string;
    image?: string;
    // fromPhone: string;
    toPhone: string;
    questionRef: string;
    // questionId: string;
    // questionImage?: string;
    // questionText: string;
}

export interface QuestionAnswer {
    id: string;
    text?: string;
    image?: string;
    fromPhone: string;
    toPhone: string;
    questionImage?: string;
    questionText: string;
}