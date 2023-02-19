import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import dayjs from "dayjs";

dayjs.extend(isSameOrBefore);

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
    WEEKLY: 'day',
    MONTHLY: 'month',
    YEARLY: 'year',
}
export default function reminderController(){

    const subTitleGenerator = () =>{
        return 'SubTitle'
    }


    const noticesGenerator = ({startDate, endDate, repetitionPeriod, repetitionDay}) =>{
        const notices = [];
        let noticeDate = dayjs(startDate);
        const repetitionCode = repetitionCodeList[repetitionPeriod];
        if(repetitionPeriod === 'WEEKLY'){
            const startDateObject = dayjs(startDate);
            let inputDayOfWeek = repetitionDay.map(v=>dayOfWeekCodeList[v]);
            for (let i = 0; ; i++){
                noticeDate = startDateObject.set(repetitionCode,inputDayOfWeek[i%inputDayOfWeek.length] + (7 * Math.floor(i/inputDayOfWeek.length)));
                if(!noticeDate.isSameOrBefore(endDate, repetitionCode)){
                    break;
                }
                if(!noticeDate.isBefore(startDateObject)){
                    notices.push(noticeDate.format('YYYY-MM-DD'));
                }
            }
        }else{
            while (noticeDate.isSameOrBefore(endDate, repetitionCode)){
                notices.push(noticeDate.format('YYYY-MM-DD'));
                noticeDate = noticeDate.add(1, repetitionCode);
                // console.log(repetitionCode)
            }
        }
        return notices;
    }

    const reminderDtoToEntity = (reminderPostDto, user) =>{
        // console.log(reminderPostDto);
        return {
            ...reminderPostDto,
            notices: noticesGenerator(
                {
                    startDate:reminderPostDto.startDate,
                    endDate:reminderPostDto.endDate,
                    repetitionPeriod:reminderPostDto.repetitionPeriod,
                    repetitionDay:reminderPostDto.repetitionDay,
                }
            ),
            userInfo:user,
        }
    }

    return{
        noticesGenerator,
        reminderDtoToEntity,
    }
}
