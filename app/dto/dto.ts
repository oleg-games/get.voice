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
    questionId: string;
    // questionImage?: string;
    // questionText: string;
}