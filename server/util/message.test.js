var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage',()=>{
    it('should generate correct message', ()=>{
        var from = 'Jen';
        var text = 'hello';

        var message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, text});

    })
})

describe('generateLocationMessage',()=>{
    it('should generate correct location', ()=>{
        var from = 'Jen';
        var latitude = '100';
        var longitude = '100';
        var url = 'https://www.google.com/maps?q=100,100';

        var message = generateLocationMessage(from, latitude, longitude);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, url});
    })
})