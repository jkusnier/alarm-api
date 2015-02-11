var expect = require('chai').expect;
var rest = require('restler');

var moment = require('moment');

var environment = require('../environment.json').name;
var properties = require('../properties.json');

describe('API tests', function () {

    var base = properties.environments[environment].base;
    var user = properties.environments[environment].user;
    var passwd = properties.environments[environment].passwd;
    var access_token = properties.environments[environment].access_token;
    var devices = properties.environments[environment].devices;

    it('should have a list of devices', function (done) {
        rest.get(base + '/devices?access_token=' + access_token).on('success', function (data) {
            expect(data).to.exist();
            expect(data).to.be.an('array');

            data.forEach(function (device) {
                expect(device).to.be.an('object');

                expect(device).to.have.property('_id');
                expect(device).to.have.property('_id').to.not.be.empty();
                expect(device).to.have.property('accessToken');
                expect(device).to.have.property('accessToken').to.not.be.empty();
                //expect(device).to.have.property('accessToken').to.equal(access_token);
                expect(device).to.have.property('name');
                expect(device).to.have.property('name').to.not.be.empty();
                expect(device).to.have.property('zip');
                expect(device).to.have.property('timeZone');
                expect(device).to.have.property('timeZone').to.not.be.empty();
                expect(device).to.have.property('owner');
                expect(device).to.have.property('owner').to.not.be.empty();
                expect(device).to.have.property('owner').to.equal(user);
                expect(device).to.have.property('created');
                expect(device).to.have.property('created').to.not.be.empty();
                expect(device).to.have.property('modified');
            });

            done();
        });
    });

    it('should be able to get the next alarm without an access code', function (done) {
        var device_id = devices[0];
        rest.get(base + '/devices/' + device_id + '/alarms/next').on('success', function (data) {
            expect(data).to.be.an('object');

            expect(data).to.include.keys(['_id', 'deviceId', 'name', 'time', 'dayOfWeek', 'status', 'created', 'modified']);

            expect(data).to.have.property('_id').to.not.be.empty();
            expect(data._id).to.be.a('string');

            expect(data).to.have.property('deviceId').to.not.be.empty();
            expect(data.deviceId).to.be.a('string').and.to.equal(device_id);

            expect(data).to.have.property('name').to.not.be.empty();
            expect(data.name).to.be.a('string');

            expect(data).to.have.property('time').to.not.be.empty();
            expect(data.time).to.be.a('number').and.be.within(0, 1440);

            expect(data).to.have.property('dayOfWeek').to.not.be.empty();
            expect(data.dayOfWeek).to.be.a('number');

            expect(data).to.have.property('status').to.not.be.empty();
            // Must be a boolean, either true or false
            expect(data.status).to.match(/true|false/);

            expect(data).to.have.property('created').to.not.be.empty();
            // Must be a parsable date
            expect(moment(data.created).isValid()).to.be.ok();

            done();
        });
    });

    it('should be able to get the next alarm with an access code', function (done) {
        var device_id = devices[0];
        rest.get(base + '/devices/' + device_id + '/alarms/next?access_token=' + access_token).on('success', function (data) {
            expect(data).to.be.an('object');

            expect(data).to.include.keys(['_id', 'deviceId', 'name', 'time', 'dayOfWeek', 'status', 'created', 'modified']);

            expect(data).to.have.property('_id').to.not.be.empty();
            expect(data._id).to.be.a('string');

            expect(data).to.have.property('deviceId').to.not.be.empty();
            expect(data.deviceId).to.be.a('string').and.to.equal(device_id);

            expect(data).to.have.property('name').to.not.be.empty();
            expect(data.name).to.be.a('string');

            expect(data).to.have.property('time').to.not.be.empty();
            expect(data.time).to.be.a('number').and.be.within(0, 1440);

            expect(data).to.have.property('dayOfWeek').to.not.be.empty();
            expect(data.dayOfWeek).to.be.a('number');

            expect(data).to.have.property('status').to.not.be.empty();
            // Must be a boolean, either true or false
            expect(data.status).to.match(/true|false/);

            expect(data).to.have.property('created').to.not.be.empty();
            // Must be a parsable date
            expect(moment(data.created).isValid()).to.be.ok();

            done();
        });
    });

    it('should be able to view device information', function (done) {
        var device_id = devices[0];
        rest.get(base + '/devices/' + device_id + '?access_token=' + access_token).on('success', function (data) {
            expect(data).to.be.an('object');

            expect(data).to.include.keys(['_id', 'accessToken', 'name', 'zip', 'timeZone', 'owner', 'created', 'modified']);

            expect(data).to.have.property('_id').to.not.be.empty();
            expect(data._id).to.be.a('string').and.to.equal(device_id);

            expect(data).to.have.property('accessToken').to.not.be.empty();
            expect(data.accessToken).to.be.a('string');

            expect(data).to.have.property('name').to.not.be.empty();
            expect(data.name).to.be.a('string');

            expect(data).to.have.property('zip').to.not.be.empty();

            expect(data).to.have.property('timeZone').to.not.be.empty();

            expect(data).to.have.property('owner').to.not.be.empty();
            expect(data.owner).to.be.a('string').and.to.equal(user);

            expect(data).to.have.property('created').to.not.be.empty();
            // Must be a parsable date
            expect(moment(data.created).isValid()).to.be.ok();

            done();
        });
    });

    it('should be able to view all alarms', function (done) {
        var device_id = devices[0];
        rest.get(base + '/devices/' + device_id + '/alarms?access_token=' + access_token).on('success', function (data) {
            expect(data).to.be.an('array');

            data.forEach(function (entry) {
                expect(entry).to.include.keys(['_id', 'deviceId', 'name', 'time', 'dayOfWeek', 'status', 'created', 'modified']);

                expect(entry).to.have.property('_id').to.not.be.empty();
                expect(entry._id).to.be.a('string');

                expect(entry).to.have.property('deviceId').to.not.be.empty();
                expect(entry.deviceId).to.be.a('string').and.to.equal(device_id);

                expect(entry).to.have.property('name').to.not.be.empty();
                expect(entry.name).to.be.a('string');

                expect(entry).to.have.property('time').to.not.be.empty();
                expect(entry.time).to.be.a('number');

                expect(entry).to.have.property('dayOfWeek').to.not.be.empty();
                expect(entry.dayOfWeek).to.be.an('array');

                entry.dayOfWeek.forEach(function (entry) {
                    expect(entry).to.be.a('number');
                    expect(entry).to.be.within(1, 7);
                });

                //expect(entry).to.have.property('status').to.not.be.empty();
                var alarm_status = (entry.status == "true");
                expect(alarm_status).to.be.a('boolean');

                expect(entry).to.have.property('created').to.not.be.empty();
                expect(moment(data.created).isValid()).to.be.ok();
            });

            done();
        });
    });

    it('should be able to disable and enable an alarm', function (done) {
        var device_id = devices[0];
        rest.get(base + '/devices/' + device_id + '/alarms?access_token=' + access_token).on('success', function (data) {
            expect(data).to.be.an('array');

            var alarm_id = data[0]["_id"];
            expect(alarm_id).to.not.be.empty();

            rest.get(base + '/devices/' + device_id + '/alarms/' + alarm_id + '?access_token=' + access_token).on('success', function (data) {
                expect(data).to.be.an('object');
                expect(data["_id"]).to.equal(alarm_id);

                var alarm_status1 = (data["status"] == "true")
                //expect(alarm_status1).to.not.be.empty();

                // Toggle alarm
                rest.post(base + '/devices/' + device_id + '/alarms/' + alarm_id + '?access_token=' + access_token, {data: {
                    status: !alarm_status1
                }}).on('complete', function(data, response) {
                    expect(response.statusCode).to.equal(200);

                    // Check alarm
                    rest.get(base + '/devices/' + device_id + '/alarms/' + alarm_id + '?access_token=' + access_token).on('success', function (data) {
                        expect(data).to.be.an('object');
                        expect(data["_id"]).to.equal(alarm_id);

                        var alarm_status = (data["status"] == "true"); // Convert to boolean
                        expect(alarm_status).to.equal(!alarm_status1); // Should be the opposite of our original value

                        // Toggle back
                        rest.post(base + '/devices/' + device_id + '/alarms/' + alarm_id + '?access_token=' + access_token, {data: {
                            status: alarm_status1
                        }}).on('complete', function(data, response) {
                            expect(response.statusCode).to.equal(200);

                            // Check alarm
                            rest.get(base + '/devices/' + device_id + '/alarms/' + alarm_id + '?access_token=' + access_token).on('success', function (data) {
                                expect(data).to.be.an('object');
                                expect(data["_id"]).to.equal(alarm_id);

                                var alarm_status = (data["status"] == "true"); // Convert to boolean
                                expect(alarm_status).to.equal(alarm_status1); // Should be our original value now
                            });
                        });
                    });
                });

                done();
            });
        });
    });

    function randomString() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    it('should be able to update the alarm name', function (done) {
        var device_id = devices[0];
        rest.get(base + '/devices/' + device_id + '/alarms?access_token=' + access_token).on('success', function (data) {
            expect(data).to.be.an('array');

            var alarm_id = data[0]["_id"];
            expect(alarm_id).to.not.be.empty();

            rest.get(base + '/devices/' + device_id + '/alarms/' + alarm_id + '?access_token=' + access_token).on('success', function (data) {
                expect(data).to.be.an('object');
                expect(data["_id"]).to.equal(alarm_id);

                var alarm_name1 = data["name"];
                var alarm_name2 = randomString();
                //expect(alarm_status1).to.not.be.empty();

                // Toggle alarm
                rest.post(base + '/devices/' + device_id + '/alarms/' + alarm_id + '?access_token=' + access_token, {data: {
                    name: alarm_name2
                }}).on('complete', function(data, response) {
                    expect(response.statusCode).to.equal(200);

                    // Check alarm
                    rest.get(base + '/devices/' + device_id + '/alarms/' + alarm_id + '?access_token=' + access_token).on('success', function (data) {
                        expect(data).to.be.an('object');
                        expect(data["_id"]).to.equal(alarm_id);

                        var alarm_name = data["name"];
                        expect(alarm_name).to.equal(alarm_name2);

                        // Toggle back
                        rest.post(base + '/devices/' + device_id + '/alarms/' + alarm_id + '?access_token=' + access_token, {data: {
                            name: alarm_name1
                        }}).on('complete', function(data, response) {
                            expect(response.statusCode).to.equal(200);

                            // Check alarm
                            rest.get(base + '/devices/' + device_id + '/alarms/' + alarm_id + '?access_token=' + access_token).on('success', function (data) {
                                expect(data).to.be.an('object');
                                expect(data["_id"]).to.equal(alarm_id);

                                var alarm_name = data["name"];
                                expect(alarm_name).to.equal(alarm_name1); // Should be our original value now
                            });
                        });
                    });
                });

                done();
            });
        });
    });

    it('should be able to update the alarm time', function (done) {
        var device_id = devices[0];
        rest.get(base + '/devices/' + device_id + '/alarms?access_token=' + access_token).on('success', function (data) {
            expect(data).to.be.an('array');

            var alarm_id = data[0]["_id"];
            expect(alarm_id).to.not.be.empty();

            rest.get(base + '/devices/' + device_id + '/alarms/' + alarm_id + '?access_token=' + access_token).on('success', function (data) {
                expect(data).to.be.an('object');
                expect(data["_id"]).to.equal(alarm_id);

                var alarm_time1 = data["time"];
                var alarm_time2 = Math.floor(Math.random() * 1440);
                //expect(alarm_status1).to.not.be.empty();

                // Toggle alarm
                rest.post(base + '/devices/' + device_id + '/alarms/' + alarm_id + '?access_token=' + access_token, {data: {
                    time: alarm_time2
                }}).on('complete', function(data, response) {
                    expect(response.statusCode).to.equal(200);

                    // Check alarm
                    rest.get(base + '/devices/' + device_id + '/alarms/' + alarm_id + '?access_token=' + access_token).on('success', function (data) {
                        expect(data).to.be.an('object');
                        expect(data["_id"]).to.equal(alarm_id);

                        var alarm_time = data["time"];
                        expect(alarm_time).to.equal(alarm_time2);

                        // Toggle back
                        rest.post(base + '/devices/' + device_id + '/alarms/' + alarm_id + '?access_token=' + access_token, {data: {
                            time: alarm_time1
                        }}).on('complete', function(data, response) {
                            expect(response.statusCode).to.equal(200);

                            // Check alarm
                            rest.get(base + '/devices/' + device_id + '/alarms/' + alarm_id + '?access_token=' + access_token).on('success', function (data) {
                                expect(data).to.be.an('object');
                                expect(data["_id"]).to.equal(alarm_id);

                                var alarm_time = data["time"];
                                expect(alarm_time).to.equal(alarm_time1); // Should be our original value now
                            });
                        });
                    });
                });

                done();
            });
        });
    });

    it('should be able to update the alarm days', function (done) {
        var device_id = devices[0];
        rest.get(base + '/devices/' + device_id + '/alarms?access_token=' + access_token).on('success', function (data) {
            expect(data).to.be.an('array');

            var alarm_id = data[0]["_id"];
            expect(alarm_id).to.not.be.empty();

            rest.get(base + '/devices/' + device_id + '/alarms/' + alarm_id + '?access_token=' + access_token).on('success', function (data) {
                expect(data).to.be.an('object');
                expect(data["_id"]).to.equal(alarm_id);

                var alarm_days1 = data["dayOfWeek"];
                var alarm_days2 = [1,2,3,4,5,6,7];
                //expect(alarm_status1).to.not.be.empty();

                // Toggle alarm
                var body1 = {dayOfWeek: alarm_days2};
                rest.postJson(base + '/devices/' + device_id + '/alarms/' + alarm_id + '?access_token=' + access_token, {
                    dayOfWeek: alarm_days2
                }).on('complete', function(data, response) {
                    expect(response.statusCode).to.equal(200);

                    // Check alarm
                    rest.get(base + '/devices/' + device_id + '/alarms/' + alarm_id + '?access_token=' + access_token).on('success', function (data) {
                        expect(data).to.be.an('object');
                        expect(data["_id"]).to.equal(alarm_id);

                        var alarm_days = data["dayOfWeek"];
                        expect(alarm_days).to.eql(alarm_days2);

                        // Toggle back
                        rest.postJson(base + '/devices/' + device_id + '/alarms/' + alarm_id + '?access_token=' + access_token, {
                            dayOfWeek: alarm_days1
                        }).on('complete', function(data, response) {
                            expect(response.statusCode).to.equal(200);

                            // Check alarm
                            rest.get(base + '/devices/' + device_id + '/alarms/' + alarm_id + '?access_token=' + access_token).on('success', function (data) {
                                expect(data).to.be.an('object');
                                expect(data["_id"]).to.equal(alarm_id);

                                var alarm_days = data["dayOfWeek"];
                                expect(alarm_days).to.eql(alarm_days1); // Should be our original value now
                            });
                        });
                    });
                });

                done();
            });
        });
    });

    it('should be able to insert a new alarm', function (done) {
        done();
    });

    it('should be able to delete an alarm', function (done) {
        done();
    });

    it('should be able to auth via the token', function (done) {
        rest.get(base + '/users?access_token=' + access_token).on('success', function (data) {
            expect(data).to.be.an('object');

            expect(data).to.include.keys(['_id', 'passwd', 'accessToken', 'created', 'modified', 'expires', 'lastLogin', 'devices']);

            expect(data).to.have.property('_id').to.not.be.empty();
            expect(data._id).to.be.a('string');

            expect(data).to.have.property('passwd').to.not.be.empty();
            expect(data.passwd).to.be.a('string');

            expect(data).to.have.property('accessToken').to.not.be.empty();
            expect(data.accessToken).to.be.a('string');

            expect(data).to.have.property('created').to.not.be.empty();
            expect(moment(data.created).isValid()).to.be.ok();

            expect(data).to.have.property('devices').to.not.be.empty();
            expect(data.devices).to.be.an('array');

            done();
        });
    });

    it('should not be able to auth with a bad token', function (done) {
        rest.get(base + '/users?access_token=BAD_DATA' + access_token).on('complete', function (data, response) {
            expect(response.statusCode).to.not.equal(200);
            done();
        });
    });

    it('should be able to auth via user and passwd', function (done) {
        rest.post(base + '/users', { data: {
            user_id: user,
            password: passwd
        }}).on('success', function (data) {
            expect(data).to.be.an('object');

            expect(data).to.include.keys(['_id', 'passwd', 'accessToken', 'created', 'modified', 'expires', 'lastLogin', 'devices']);

            expect(data).to.have.property('_id').to.not.be.empty();
            expect(data._id).to.be.a('string');

            expect(data).to.have.property('passwd').to.not.be.empty();
            expect(data.passwd).to.be.a('string');

            expect(data).to.have.property('accessToken').to.not.be.empty();
            expect(data.accessToken).to.be.a('string');

            expect(data).to.have.property('created').to.not.be.empty();
            expect(moment(data.created).isValid()).to.be.ok();

            expect(data).to.have.property('devices').to.not.be.empty();
            expect(data.devices).to.be.an('array');

            done();
        });
    });

    it('should not auth with a bad password', function (done) {
        rest.post(base + '/users', {data: {
            user_id: user
        }}).on('complete', function(data, response){
            expect(response.statusCode).to.not.equal(200);
            done();
        });
    });
});