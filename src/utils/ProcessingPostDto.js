//     
import {v4 as uuid} from "uuid";
import dayjs from "dayjs";

export class ProcessingPostDto {
    repetitionCount = 10;
    reminderPostDto;
    reminderEntity;
    reminderList;
    startDate;
    endDate;

    constructor(reminderPostDto) {
        this.reminderPostDto = reminderPostDto;
        this.startDate = dayjs(reminderPostDto.startDate);
        this.endDate = dayjs(reminderPostDto.endDate);
        this.repetitionCount = this.calculateRepetitionCount(reminderPostDto.endDate, reminderPostDto.RepetitionPeriod);
    }

    dtoToEntity() {
        this.reminderEntity = {
            ...this.reminderPostDto,
            startDate: null,
            endDate: null,
            RepetitionId: uuid(),
        }
    }

    /*
        반복해야함. 근데 몇번?
        endDate가 있다면 start부터 end까지 몇번인지 정보를 Period code를 통해 유추해야하는데,
        근데 요일 선택 반복인 경우에는 요일까지 고려해야함....
        endDate가 있는가?
            Period code는 무엇인가?
                만약 Weekly라면?
                    Weekly string을 split
     */
    calculateRepetitionCount(endDate, RepetitionPeriod) {
        return endDate
            ? this.endDate.diff(this.startDate, RepetitionPeriod)
            : 10
    }

    EntityToList() {
        const periodCodeToList = {
            d: function () {
                Array(this.repetitionCount).fill(this.reminderEntity).map((reminder, cnt) =>
                    ({...reminder, startDate: this.startDate.add(cnt, 'd').format()})
                )
            },
        }
        this.reminderList = Array(this.repetitionCount).fill(this.reminderEntity).map((reminder, cnt) =>
            ({...reminder, startDate: this.startDate.add(cnt, 'd').format()})
        )
    }

    getReminderRepetitionList() {
        this.dtoToEntity();
        this.EntityToList();
        console.log(this.reminderList)
        return this.reminderList;
    }
}