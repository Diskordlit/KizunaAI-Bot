const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

// Define available models
exports.models = {
    'llama': 'llama-3.2-3b-instruct-q8_0:latest',
    'deepseek': 'DeepSeek-R1-Distill-Qwen-7B-Q4_K_M:latest',
    'gemma': 'gemma3:27b'
    // Add more models as needed
};

exports.chatWithModel = async (message, modelName = 'llama') => {
    const url = process.env.LLAMA_API_URL || 'http://host.docker.internal:3000/api/chat/completions';
    const model = this.models[modelName.toLowerCase()] || this.models.llama;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.LLAMA_TOKEN}`,
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: "user",
                        content: message
                    }
                ]
            })
        });

        const json = await response.json();
        console.log(json);
        
        exports.reply = json.choices[0].message.content;
        exports.status = 'success';
        
    } catch (error) {
        console.error('Error connecting to LLaMA API:', error);
        exports.status = 'error';
        exports.reply = 'Unable to connect to LLaMA API. Please check the connection.';
    }
};