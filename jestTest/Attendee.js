/*
 * 좌석 예약 기능
 * conferenceWebSvc 객체에 서비스를 캡슐화하고 팝업 메시지 화면에 표시할 Messenger 객체 작성
 * let attendee = new Attendee(new ConferenceWebSvc(),new Messenger(),id);
 * Attendee의 의존성을 자신의 생성자에 하드 코딩하여 주입했었음
 * */

Attendee = function (service, messenger, attendeeId) {
    if (!(this instanceof Attendee)) {
        return new Attendee(attendeeId);
    }
    //instanceof 객체가 특정 클래스에 속하는지 아닌지 확인 / 상속 관계 확인
    this.attendeeId = attendeeId;
    this.service = service;
    this.messenger = messenger;
};
Attendee.prototype.reserve = function (sessionId) {
    if (this.service.reserve(this.attendeeId, sessionId)) {
        this.messenger.success(
            '좌석 예약이 완료되었습니다' +
                '고객님은' +
                this.service.getRemainingReservations() +
                '좌석을 추가 예약하실 수 있습니다.',
        );
    } else {
        this.messenger.fail('죄송합니다. 해당 좌석은 예약하실 수 없습니다.');
    }
};
MyApp = {};
MyApp.diContainer = new DiContainer();
MyApp.diContainer.register('Service', [], function () {
    return new ConferenceWebSvc();
});
MyApp.diContainer.register('Messenger', [], function () {
    return new Messenger();
});
MyApp.diContainer.register(
    'AttendeeFactory',
    ['Service', 'Messenger'],
    function (service, messenger) {
        return function (attendeeId) {
            return new Attendee(service, messenger, attendeeId);
        };
    },
);

let attendeeId = 123;
let sessionId = 1;
// Attendee는 자신의 의존성 외에도 attendeeId 파라미터가 필요하므로 DI 컨테이너는 이렇게 코딩
let attendee = MyApp.diContainer.get('AttendeeFactory')(attendeeId);
attendee.reserve(sessionId);
