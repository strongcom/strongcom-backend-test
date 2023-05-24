import notificationController from "../controller/notificationController.js";

test('입력받은 유저의 리마인더를 조회해보자',()=>{
    expect(notificationController().pushNotifications({request:{userName:'admin'}})).toEqual({})
});
