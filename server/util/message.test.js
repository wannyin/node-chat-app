var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage',()=>{
    it('should generate correct message', ()=>{
        var from = 'Jen';
        var text = 'hello';

        var message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, text});

    })
})