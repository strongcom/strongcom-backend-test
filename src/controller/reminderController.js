import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import dayjs from "dayjs";
import Joi from "joi";

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
    BASIC: 'day',
    DAILY: 'day',
    WEEKLY: 'day',
    MONTHLY: 'month',
    YEARLY: 'year',
}
export default function reminderController(){

    const repetitionValidationCheck= (body) => {
        const schema = Joi.object().keys({
            title: Joi.string().required(),
            content: Joi.string().optional(),
            startDate: Joi.string().optional().allow(null).isoDate(),
            endDate: Joi.string().optional().allow(null).isoDate(),
            startTime: Joi.string().optional().allow(null),
            endTime: Joi.string().optional().allow(null),
            repetitionPeriod: Joi.string().not(null),
            repetitionDay: Joi.string().optional().allow(null),
        });
        return schema.validate(body);
    };

    const titleValidationCheck= (body) => {
        const schema = Joi.object().keys({
            title: Joi.string().required(),
        });
        return schema.validate(body);
    };

    const subTitleGenerator = () =>{
        return 'SubTitle'
    }

    const noticesGenerator = ({startDate, endDate, repetitionPeriod, repetitionDay}) =>{
        const notices = [];
        let noticeDate = dayjs(startDate);
        const repetitionCode = repetitionCodeList[repetitionPeriod];
        if(repetitionPeriod === 'WEEKLY'){
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
            while (noticeDate.isSameOrBefore(endDate, repetitionCode)){
                notices.push(noticeDate.format('YYYY-MM-DD'));
                noticeDate = noticeDate.add(1, repetitionCode);
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
        const today = dayjs().format('YYYY-MM-DD');
        return {
            title:title,
            content: null,
            subTitle: '오늘 한번 울리는 알람입니다',
            startDate: today,
            endDate: today,
            startTime: '00:00:00',
            endTime: '23:59:59',
            repetitionPeriod: null,
            repetitionDay: null,
            notices:[today],
            userInfo: user,
        }
    }

    return{
        repetitionValidationCheck,
        titleValidationCheck,
        noticesGenerator,
        reminderDtoToEntity,
        generateReminderByTitle
    }
}
