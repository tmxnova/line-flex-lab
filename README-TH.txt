LINE FLEX LAB — ชุดเครื่องมือศึกษาและสร้าง LINE Flex message แบบ open source

## สิ่งที่ได้

- samples/ — ตัวอย่างทางการ 12 แบบ (restaurant, hotel, shopping, ticket, ...)
- reusable/ — โมดูล ESM ไม่มี dependencies ใช้ได้ Node 22.18+ / browser
  - offline-data.mjs — โค้ด codec Flex↔Tree, errorPathMapper, createComponent
  - component-metadata.mjs — กฎว่า node แต่ละชนิดเพิ่ม component อะไรได้
  - validator-client.mjs — เรียก server validator/render จริง (ต้องออนไลน์) + parseJsonOffline() ตรวจ syntax
  - lint-offline.mjs — ลint ออฟไลน์ผ่าน flex-guard (มี source ครบใน third-party/)
- tests/ — ทดสอบ 18 เคส: node --test tests/offline-data.test.mjs
- third-party/ — source snapshots พร้อม LICENSE เดิม: flex2html, line-flex-renderer-npm, flex-guard, line-openapi
- research/ — หลักฐานจาก server จริงของ LINE: ผล 401 ทุก endpoint โดยไม่มี session,
  payload 400 พร้อม path ที่ตรงจุด, ผลเทียบ community validator กับพฤติกรรม server

## ทำไมไม่มี bundle ของ LINE

bundle และหน้าเว็บ Flex Simulator เป็นลิขสิทธิ์ LINE และไม่ได้เปิดให้ redistribute
จึงไม่นำมาใส่ใน repo นี้ (กัน takedown/ToS) — ใช้ตัวจริงที่
https://developers.line.biz/flex-simulator/ สำหรับ preview ทางการ

## License

MIT สำหรับโค้ดโปรเจกต์นี้ · ไฟล์ third-party/ คง LICENSE เดิมของแต่ละโปรเจกต์
