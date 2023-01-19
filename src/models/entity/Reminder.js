
export type Reminder = {
    userId: string,
    title: string,
    subtitle: string,
    content?: string,
    startDate: Date,
    endDate: Date,
    RepetitionId: Number,
    RepetitionPeriod?: string,
    RepetitionDay?: string,
}