import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
dayjs.extend(isSameOrBefore)

import {v4 as uuid} from "uuid";
import dayjs from "dayjs";

const dayOfWeek = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
}

export class ProcessingPostDto {
    repetitionCount = 10;
    reminderPostDto;
    reminderEntity;
    reminderList;
    startDate;
    endDate;

    constructor(reminderPostDto) {
        this.reminderPostDto = reminderPostDto;
        this.startDate = dayjs(reminderPostDto.startDate).add(9,'h');
        this.endDate = dayjs(reminderPostDto.endDate).add(9,'h');
    }

    calculateRepetitionCount() {
        this.repetitionCount = this.reminderPostDto.endDate
            ? this.endDate.diff(this.startDate, this.reminderPostDto.RepetitionPeriod)+ 1
            : 10
    }

    dtoToEntity() {
        this.reminderEntity = {
            ...this.reminderPostDto,
            startDate: this.startDate,
            endDate: dayjs(`${this.startDate.format()}`)
                        .set('h',this.endDate.get('h'))
                        .set('m',this.endDate.get('m')),
            RepetitionId: uuid(),
        }
    }

    EntityToList() {
        this.reminderList = Array(this.repetitionCount).fill(this.reminderEntity)
            .map((reminder, cnt) => {
                return {
                    ...reminder,
                    startDate: this.startDate.add(cnt, this.reminderEntity.RepetitionPeriod).format(),
                    endDate: reminder.endDate.add(cnt, this.reminderEntity.RepetitionPeriod).format()
                }
            }
        );
    }

    weeklyEntityToList(){
        let dayArr = 'Mon Wed Fri'.split(' ')
            .map(v=>dayOfWeek[v])

        let dateArr = [];
        let date = dayjs(this.startDate)
        for (let i = 0; ; i++){
            let day = dayArr[i%dayArr.length] + (7 * Math.floor(i/dayArr.length))
            date = this.startDate.set('day',dayArr[i%dayArr.length] + (7 * Math.floor(i/dayArr.length)))
            if(!date.isSameOrBefore(this.endDate)){
                break;
            }
            if(day > this.startDate.day()){
                dateArr.push(date)
            }
        }

        this.reminderList = Array(dateArr.length).fill(this.reminderEntity)
            .map((reminder, index) => {
                    return {
                        ...reminder,
                        startDate: dateArr[index],
                        endDate: dateArr[index].set('h',this.endDate.get('h')).set('m',this.endDate.get('m'))
                    }
                }
            );

    }

    getReminderRepetitionList() {
        this.dtoToEntity();
        if(this.reminderPostDto.RepetitionPeriod === 'w'){
            this.weeklyEntityToList();
            console.log(this.reminderList)
        }else{
            this.calculateRepetitionCount();
            this.EntityToList();
        }
        return this.reminderList;
    }
}