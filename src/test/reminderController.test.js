import reminderController from "../controller/reminderController.js";
test('1월1일부터 2월10일까지 월 반복을 해보자',()=>{
    expect(reminderController({}).noticesGenerator({startDate:'2023-01-01', endDate:'2023-02-10', repetitionPeriod:'MONTHLY'})
    ).toEqual(['2023-01-01', '2023-02-01'])
});

test('1월1일부터 1월3일까지 매일 반복을 해보자',()=>{
    expect(reminderController({}).noticesGenerator({startDate:'2023-01-01', endDate:'2023-01-03', repetitionPeriod:'DAILY'})
    ).toEqual(['2023-01-01', '2023-01-02','2023-01-03'])
});

test('2월1일부터 2월8일까지 월수금 반복을 해보자',()=>{
    expect(reminderController({}).noticesGenerator({startDate:'2023-02-01', endDate:'2023-02-08', repetitionPeriod:'WEEKLY',repetitionDay:['MON','WED','FRI']})
    ).toEqual(['2023-02-01', '2023-02-03','2023-02-06','2023-02-08'])
});

test('2월2일부터 2월8일까지 월수금 반복을 해보자',()=>{
    expect(reminderController({}).noticesGenerator({startDate:'2023-02-02', endDate:'2023-02-08', repetitionPeriod:'WEEKLY',repetitionDay:['MON','WED','FRI']})
    ).toEqual(['2023-02-03','2023-02-06','2023-02-08'])
});
