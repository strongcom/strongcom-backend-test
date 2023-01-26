import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
dayjs.extend(isSameOrBefore)

const dayOfWeek = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
}

let dayArr = 'Mon Wed Fri'.split(' ')
    .map(v=>dayOfWeek[v])

let startDate = dayjs('2023-01-03')
let endDate = dayjs('2023-01-17')
let date = dayjs(startDate);

let arr = []
let i = 0;

for (let i = 0; ; i++){
    let day = dayArr[i%dayArr.length] + (7 * Math.floor(i/dayArr.length))
    date = startDate.set('day',dayArr[i%dayArr.length] + (7 * Math.floor(i/dayArr.length)))
    if(!date.isSameOrBefore(endDate)){
        break;
    }
    if(day > startDate.day()){
        arr.push(date.format())
    }
}

// while(date.isSameOrBefore(endDate)){
//     let day = dayArr[i%dayArr.length] + (7 * Math.floor(i/dayArr.length))
//     date = startDate.set('day',dayArr[i%dayArr.length] + (7 * Math.floor(i/dayArr.length)))
//     if(day > startDate.day() && date.isSameOrBefore(endDate)){
//         arr.push(date.format())
//     }
//     i++;
// }

console.log(arr)
