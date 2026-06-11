export async function fakeAIReply(prompt) {
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));
    return `Echo: ${prompt.slice(0, 400)}`;
}