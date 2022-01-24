Attendee = function (service, messenger, attendeeId) {
    if (!(this instanceof Attendee)) {
        return new Attendee(attendeeId);
    }
    //instanceof 객체가 특정 클래스에 속하는지 아닌지 확인 / 상속 관계 확인
    this.attendeeId = attendeeId;
    this.service = service;
    this.messenger = messenger;
};
