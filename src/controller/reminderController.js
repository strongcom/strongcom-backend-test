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
        console.log(repetitionPeriod);
        const notices = [];
        let noticeDate = dayjs(startDate);
        const repetitionCode = repetitionCodeList[repetitionPeriod];
        if(repetitionPeriod === 'WEEKLY'){
            console.log(repetitionDay);
            const startDateObject = dayjs(startDate);
            let inputDayOfWeek = repetitionDay.map(v => dayOfWeekCodeList[v]).sort((a, b) => a - b);
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
            if(!repetitionCode){
                const today = dayjs().format('YYYY-MM-DD');
                notices.push(today);
            }else{
                while (noticeDate.isSameOrBefore(endDate, repetitionCode)){
                    notices.push(noticeDate.format('YYYY-MM-DD'));
                    noticeDate = noticeDate.add(1, repetitionCode);
                    // console.log(repetitionCode)
                }
            }
        }
        return notices;
    }

    const reminderDtoToEntity = (reminderPostDto, user) =>{
        console.log(user);
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

    const generateReminderByTitle = (title, user)=>{
        return {
            title:title,
            content: null,
            subTitle: '오늘 한번 울리는 알람입니다',
            startDate: dayjs().format('YYYY-MM-DD'),
            endDate: dayjs().format('YYYY-MM-DD'),
            startTime: '00:00:00',
            endTime: '23:59:59',
            repetitionPeriod: null,
            repetitionDay: null,
            notices:[dayjs().format('YYYY-MM-DD')],
            userInfo: user,
        }
    }

    return{
        noticesGenerator,
        reminderDtoToEntity,
        generateReminderByTitle
    }
}
