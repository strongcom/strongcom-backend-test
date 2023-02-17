import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import dayjs from "dayjs";
dayjs.extend(isSameOrBefore)

const dayOfWeekCodeList = {
    SUN: 0,
    MON: 1,
    TUE: 2,
    WED: 3,
    THU: 4,
    FRI: 5,
    SAT: 6,
}

const repetitionCodeList = {
    null: null,
    undefined: null,
    DAILY: 'day',
    WEEKLY: 'week',
    MONTHLY: 'month',
    YEARLY: 'year',
}
export default function reminderController({reminderPostDto}){
    const reminderEntity = {
        ...reminderPostDto,
        userId: 'milk717',
        notices: [],
    }
    const subTitleGenerator = () =>{
        return 'SubTitle'
    }

    const noticesGenerator = ({startDate, endDate, repetitionPeriod}) =>{
        const notices = [];
        const repetitionCode = repetitionCodeList[repetitionPeriod];
        console.log(repetitionCode)
        let noticeDate = dayjs(startDate);
        const endDateObject = dayjs(endDate);
        while (noticeDate.isSameOrBefore(endDateObject, repetitionCode)){
            notices.push(noticeDate.format('YYYY-MM-DD'));
            noticeDate = noticeDate.add(1, repetitionCode);
        }
        return notices;
    }

    return{
        noticesGenerator
    }
}
