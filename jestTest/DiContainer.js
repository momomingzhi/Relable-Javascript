DiContainer = function () {
    if (!(this instanceof DiContainer)) {
        return new DiContainer();
    }
    this.registerations = [];
};
DiContainer.prototype.messages = {
    registerRequiresArgs:
        '이 생성자 함수는 인자가 3개 있어야합니다:' +
        '문자열, 문자열 배열, 함수',
};
DiContainer.prototype.register = function (name, dependencies, func) {
    let ix;
    if (
        typeof name !== 'string' ||
        !Array.isArray(dependencies) ||
        typeof func !== 'function'
    ) {
        throw new Error(this.messages.registerRequiresArgs);
    }
    for (ix = 0; ix < dependencies.length; ++ix) {
        if (typeof dependencies[ix] !== 'string') {
            throw new Error(this.messages.registerRequiresArgs);
        }
    }
    this.registerations[name] = {
        dependencies: dependencies,
        func: func,
    };
};
//register로 등록한 데이터를 get으로 다시 추출
DiContainer.prototype.get = function (name) {
    let self = this;
    let registration = this.registerations[name],
        dependencies = [];
    if (registration === undefined) {
        return undefined;
    }
    registration.dependencies.forEach(function (dependencyName) {
        let dependency = self.get(dependencyName); //재귀부분
        dependencies.push(dependency === undefined ? undefined : dependency);
    });
    return registration.func.apply(undefined, dependencies);
};
