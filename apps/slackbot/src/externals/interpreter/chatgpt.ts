import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORGANIZATION_ID,
})

const openai = new OpenAIApi(configuration);

export function Interpretation(instruction: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            console.info('Running interpretation')
            const newInstruction = instruction.replace('{message}', args[0])
            console.info('Interpretation', newInstruction)
            const result = await interpret(newInstruction)
            console.info('Finishing interpretation')
            return originalMethod.apply(this, [result, ...args.slice(1)])
        }
    }
}

export async function interpret(message: string): Promise<string> {
    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'user',
                content: message,
            }],
        })
        const content = response.data.choices[0].message?.content
        if (!content) {
            throw new Error('Sorry, could not process message')
        }
        return content.trim()
    }
    catch (error) {
        console.error(error)
        throw new Error('Sorry, could not process message')
    }
}

export default {
    interpret,
    Interpretation,
}