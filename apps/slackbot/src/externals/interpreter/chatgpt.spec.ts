import interpreter from './chatgpt'

describe('ChatGPT', () => {
    it('should return a response', async () => {
        const response = await interpreter.interpret('Say this is a test!')
        expect(response).toBe('This is a test!')
    })
})