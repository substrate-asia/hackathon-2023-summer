import express from 'express';
import fs from 'fs';
import { questionMapping, DEFAULT_ANSWER } from './questions.js';

const app = express();
const port = 3000;

class QuestionMappingStrategy {
  getResponse(prompt) {
    const mappedQuestion = prompt.endsWith('?') || prompt.endsWith('.') ? prompt.slice(0, -1) : prompt;
    return questionMapping[mappedQuestion] || DEFAULT_ANSWER;
  }
}

app.get('/api/integration/request', (req, res) => {
  let prompt = req.query?.prompt?.trim();
  if (!prompt) res.status(400).json({ error: 'prompt is required' });
  prompt = prompt.toLowerCase();
  console.log(prompt)
  const strategy = new QuestionMappingStrategy();
  const response = strategy.getResponse(prompt);
  res.send(response);
});

app.get('/api/stream', (req, res) => {
   // 设置响应头，指定内容为流式输出
   res.setHeader('Content-Type', 'text/plain');
   res.setHeader('Content-Disposition', 'attachment; filename="stream.txt"');
 
   // 模拟生成大量数据
   for (let i = 0; i < 100; i++) {
     // 将数据写入响应
     res.write(`Data ${i}\n`);
   }
 
   // 结束响应
   res.end();
});

app.listen(port, () => {
  console.log(`Mock API server is running on port ${port}`);
});