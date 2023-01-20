//     
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

    calculateWeeklyRepetition(){
        let dayArr = this.reminderPostDto.RepetitionDay.split(' ')
            .map(v=>dayOfWeek[v]-this.startDate.get('day') < 0 ? dayOfWeek[v]-this.startDate.get('day') + 7: dayOfWeek[v]-this.startDate.get('day'))
            .sort((a, b) =>a-b)

        this.repetitionCount = this.reminderPostDto.endDate
            ? Math.floor(this.endDate.diff(this.startDate, 'd')/7)*dayArr.length + this.reminderPostDto.RepetitionDay.split(' ').filter
            : 10

        let dayCnt = new Array(10).fill(0)
            .map((_,i)=>7*Math.floor((i)/dayArr.length) + dayArr[i%dayArr.length])

        this.reminderList = Array(10).fill(this.reminderEntity)
            .map((reminder, index)=>{
                return{
                    ...reminder,
                    startDate: this.startDate.add(dayCnt[index], this.reminderEntity.RepetitionPeriod).format(),
                    endDate: this.endDate.add(dayCnt[index], this.reminderEntity.RepetitionPeriod).format()
                }
            })
    }

    getReminderRepetitionList() {
        this.dtoToEntity();
        if(this.reminderPostDto.RepetitionPeriod === 'w'){
            this.calculateWeeklyRepetition();
            console.log(this.reminderList)
        }else{
            this.calculateRepetitionCount();
            this.EntityToList();
        }
        return this.reminderList;
    }
}