        /***************************例子一计算奖金***************************/
        /*var calculateBonus = function(performanceLevel, salary) {
            if (performanceLevel === 'S') {
                console.log(salary * 4);
                return salary * 4;
            }
            if (performanceLevel === 'A') {
                console.log(salary * 3);
                return salary * 3;
            }
            if (performanceLevel === 'B') {
                console.log(salary * 2);
                return salary * 2;
            }
        };

        calculateBonus('B', 20000);
        calculateBonus('S', 6000);*/

        /************************************************************************************************************/
        /*var performanceS = function(salary) {
            return salary * 4;
        }
        var performanceA = function(salary) {
            return salary * 3;
        }
        var performanceB = function(salary) {
            return salary * 2;
        }

        var calculateBonus = function(performanceLevel, salary) {
            if (performanceLevel === 'S') {
                return performanceS(salary);
            }
            if (performanceLevel === 'A') {
                return performanceA(salary);
            }
            if (performanceLevel === 'B') {
                return performanceB(salary);
            }
        };

        calculateBonus('A', 6000);*/

        /************************************************************************************************************/

        /*// 使用策略模式重构
        // 策略类
        var performanceS = function() {

        };
        performanceS.prototype.calculate = function(salary) {
            return salary * 4;
        };

        var performanceA = function() {

        };

        performanceA.prototype.calculate = function(salary) {
            return salary * 3;
        }

        var performanceB = function() {

        };

        performanceB.prototype.calculate = function(salary) {
            return salary * 2;
        }

        // 奖金类
        var Bonus = function() {
            this.salary = null; //原始工资
            this.strategy = null; //绩效等级对应的策略对象
        }

        Bonus.prototype.setSalary = function(salary) {
            this.salary = salary; //设置员工的原始工资
        }

        Bonus.prototype.setStrategy = function(strategy) {
            this.strategy = strategy; //设置员工绩效等级对应的策略对象
        }

        Bonus.prototype.getBonus = function() { //取得奖金数额
            return this.strategy.calculate(this.salary); //把计算奖金的操作委托给对应的策略
        }

        var bonus = new Bonus();

        bonus.setSalary(10000);
        bonus.setStrategy(new performanceS()); //设置策略对象

        console.log(bonus.getBonus()); //输出:40000

        bonus.setStrategy(new performanceA()); //设置策略对象

        console.log(bonus.getBonus()); //输出:30000*/


        /***************************例子二简单动画效果实现***************************/
        var tween = {
            linear: function(t, b, c, d) {
                return c * t / d + b;
            },
            easeIn: function(t, b, c, d) {
                return c * (t /= d) * t + b;
            },
            strongEaseIn: function(t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
            }
        };

        var Animate = function(dom) {
            this.dom = dom;
            this.startTime = 0;
            this.startPos = 0;
            this.endPos = 0;
            this.propertyName = null;
            this.easing = null;
            this.duration = null;
        };

        Animate.prototype.start = function(propertyName, endPos, duration, easing) {
            this.startTime = +new Date();
            this.startPos = this.dom.getBoundingClientRect()[propertyName];
            this.propertyName = propertyName;
            this.endPos = endPos;
            this.duration = duration;
            this.easing = tween[easing];

            var self = this;
            var timeId = setInterval(function() {
                if (self.step() === false) {
                    clearInterval(timeId);
                }
            }, 19);
        }

        Animate.prototype.step = function() {
            var t = +new Date();
            if (t > this.startTime + this.duration) {
                this.update(this.endPos);
                return false;
            }
            var pos = this.easing(t - this.startTime, this.startPos, this.endPos - this.startPos, this.duration);
            this.update(pos);
        }

        Animate.prototype.update = function(pos) {
            this.dom.style[this.propertyName] = pos + 'px';
        }

        var div = document.getElementById('box');

        var animate = new Animate(div);

        animate.start('left', 500, 3000, 'strongEaseIn');







        /***************************例子三表单提交验证***************************/

        // 传统方式
        /*var registerForm = document.getElementById('registerForm');
        registerForm.onsubmit = function() {
            if (registerForm.username.value == '') {
                alert('用户名不能为空');
                return false;
            }
            if (registerForm.password.value.length < 6) {
                alert('密码长度不能少于6位');
                return false;
            }
            if (!/(^1[3|5|8][0-9]{9}$)/.test(registerForm.phone.value)) {
                alert('手机号格式不对');
                return false;
            }
        }*/

        // 策略模式重构
        // 策略对象
        var strategies = {
            isNonEmpty: function(value, errorMsg) {
                if (value == '') {
                    return errorMsg;
                }
            },
            minLength: function(value, length, errorMsg) {
                if (value.length < length) {
                    return errorMsg;
                }
            },
            minLength: function(value, errorMsg) {
                if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
                    return value;
                }
            }
        };

        // Validator类
        var Validator = function() {
            this.cache = []; //保存校验规则
        };

        Validator.prototype.add = function(dom, rules) {
            var self = this;
            for (var i = 0, rule; rule = rules[i++];) {
                (function(rule) {
                    var strategyAry = rule.strategy.split(':');
                    var errorMsg = rule.errorMsg;
                    self.cache.push(function() {
                        var strategy = strategyAry.shift(); //获得验证类型，如isNonEmpty、minLength、minLength等
                        strategyAry.unshift(dom.value); //确保value是在第一个参数
                        strategyAry.push(errorMsg); //确保errorMsg是最后一个参数
                        return strategies[strategy].apply(dom, strategyAry); //将这个对应的策略方法应用到该dom中
                    });
                })(rule)
            };
        };

        Validator.prototype.start = function() {
            for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
                var msg = validatorFunc();
                if (msg) {
                    return msg;
                }
            }
        }

        /*  客户端调用*/
        var registerForm = document.getElementById('registerForm');
        var validataFunc = function() {
            var validator = new Validator();
            validator.add(registerForm.username, [{
                strategy: 'isNonEmpty',
                errorMsg: '用户名不能为空'
            }, {
                strategy: 'minLength:3',
                errorMsg: '用户名长度不能少于3位'
            }]);
            validator.add(registerForm.username, [{
                strategy: 'minLength:6',
                errorMsg: '密码长度不能少于6位'
            }]);
            validator.add(registerForm.username, [{
                strategy: 'isMobile',
                errorMsg: '手机号码格式不正确'
            }]);
            // validator.add(registerForm.username, 'isNonEmpty', '用户名不能为空');
            // validator.add(registerForm.password, 'minLength:6', '密码长度不能少于6位');
            // validator.add(registerForm.phone, 'isMobile', '手机号码格式不正确');
            var errorMsg = validator.start();
            return errorMsg;
        }

        registerForm.onsubmit = function() {
            var errorMsg = validataFunc();
            if (errorMsg) {
                alert(errorMsg);
                return false; //阻止表单提交
            }
        }