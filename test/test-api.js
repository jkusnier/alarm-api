var expect = require('chai').expect;
var rest = require('restler');

var moment = require('moment');

describe('API tests', function () {

    var base = 'http://api.weecode.com/alarm/v1';
    var user = "test";
    var access_token = "AAAAA5Y2gHYUHmOh5RjuQlaDVRwtW68o3vQhMKnEhUbdevaXBBRfIo5gtG9EAnu";
    var devices = [
        "54ff6d066672524830211267"
    ];

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
});