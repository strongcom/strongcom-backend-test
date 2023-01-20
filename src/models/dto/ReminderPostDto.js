//@flow
export type ReminderPostDto = {
    userId: string,
    title: string,
    subtitle: string,
    content?: string,
    startDate: Date,
    endDate?: Date,
    RepetitionPeriod?: string,
    RepetitionDay?: string,
}