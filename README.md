# KizunaAI-Bot
A fun Discord Bot!
<br>
![Kizuna AI Bot Icon](http://static.sticker.ly/sticker_pack/7TrQjLCP4helYNI5vvXOVQ/NK5T6Z/2/6b68b769-14e4-4040-9eca-f2ff6fd4a78b.png)

### What can I do?

` ^ping `
` ^url {url} `
` ^chat {message} `
` ^chat/{model} {message} `

Made with **Node.js**

### Docker Setup
Build Image from DockerFile
```
docker build -t kizuna_ai .
```

Run Container from Image
```
docker run -p 8888:8888 kizuna_ai --name kizuna
```

### Additional Configuration
Define open-webui models that can be used in `llama > post.js`

```javascript
// Define available models
exports.models = {
    'llama': 'llama-3.2-3b-instruct-q8_0:latest',
    'deepseek': 'DeepSeek-R1-Distill-Qwen-7B-Q4_K_M:latest',
    'gemma': 'gemma3:27b'
    // Add more models as needed
};
```

### Dependencies

The required dependencies are included inside package.json  
to install, simply run:  
`npm install`

or, if you prefer selective or custom package version  
installation (worth noting that wrong package may cause the application to fail):  
`npm install {module}`  

Below are the required modules:

- discord.js
- dotenv
- form-data
- node-fetch
- nodemon
