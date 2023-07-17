import cron from 'node-cron';
import getIcs from './ics.js';
import http from 'http';
import config from './config.json' assert { type: 'json' };
import { databaseInitialize } from './dbHelper.js';
import url from 'url';

await databaseInitialize();

let icsData = {
  hololiveJP: null,
  hololiveEN: null,
  hololiveENJP: null,
  hololiveID: null,
  holostarAll: null,
  holostarJP: null,
  holostarEN: null
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const path = parsedUrl.pathname.toLowerCase(); // 將路徑轉換為小寫

  if (path.endsWith('.ics')) {
    const channel = path.slice(1, -4); // 取得路徑中的頻道部分
    const propertyName = Object.keys(icsData).find(key => key.toLowerCase() === channel); // 尋找對應的屬性名稱

    if (propertyName) {
      const content = icsData[propertyName]; // 根據屬性名稱取得相應的內容
      res.writeHead(200, { 'Content-Type': 'text/calendar' });
      res.end(content);
    } else {
      res.writeHead(404); // 屬性名稱未找到，回傳 404 狀態碼
      res.end();
    }
  } else {
    res.writeHead(404); // 路徑不是以 .ics 結尾，回傳 404 狀態碼
    res.end();
  }
});

const port = process.env.PORT || config.servePort || 80;
server.listen(config.servePort, () => {
  console.log('Server started on port', config.servePort);
});

// update icsData schedulled by cron
cron.schedule(config.cronSchedule, async () => {
  try {
    // 逐個鍵值更新 ICS 資料
    const keys = Object.keys(icsData);
    for (const key of keys) {
      icsData[key] = await getIcs(key);
    }

    console.log('ICS updated', new Date().toISOString());
  } catch (error) {
    console.error('Fetch error');
    console.error(error);
  }
}, {
  runOnInit: true
});
