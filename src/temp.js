import dayjs from "dayjs";

// const date = dayjs('2023-01-01 00:00:00');
// console.log(date.add(1,'M').format())
// console.log(date.add(1,'M').format())
// console.log(date.add(1,'M').format())

const date = dayjs(null) ;

if(date === {}){
    console.log('날짜가 없어유~')
}
console.log(typeof date)