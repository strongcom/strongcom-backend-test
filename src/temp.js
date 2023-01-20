import dayjs from "dayjs";

const date = dayjs('2023-01-03 18:00:00');
const date2 = dayjs('2023-01-17 18:00:00');
// console.log(date.set('day',12).get('day'))
// console.log(date.get('day'))

// const date = dayjs(null) ;

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
    .map(v=>dayOfWeek[v]-date.get('day') < 0 ? dayOfWeek[v]-date.get('day') + 7: dayOfWeek[v]-date.get('day'))
    .sort((a, b) =>a-b)

let cnt = Math.floor(date2.diff(date,'d') / 7)*dayArr.length
    + (date2.day() === date.day() &&  'Mon Wed Fri'.split(' ').includes(date.day()) ? 1 : 0)
    + date.day() + date2.diff(date,'d') % 7

let dayCnt = new Array(10).fill(0)
    .map((_,i)=>7*Math.floor((i)/dayArr.length) + dayArr[i%dayArr.length])

console.log(dayArr)
console.log(dayCnt)
console.log(date.day())