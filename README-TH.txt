LINE FLEX LAB — ชุดเครื่องมือสร้างและตรวจสอบ LINE Flex message แบบ open source

## ภาพรวม

- โค้ดทั้งหมดเป็น original implementation (เขียนใหม่ทั้งหมด) · MIT license · ใช้เชิงพาณิชย์ได้ฟรี ไม่ต้องจ่ายค่า license
- สร้างจากของ public ของ LINE เอง: Flex Message specification, OpenAPI schema ที่ LINE publish (line/line-openapi),
  sample ทางการ 12 แบบ, และผลลัพธ์จริงจาก endpoint validate ทางการของ LINE (เก็บหลักฐานไว้ที่ research/)
- zero dependencies · ใช้ได้ Node >= 18 และ browser

## สิ่งที่ได้

- samples/ — sample ทางการ 12 แบบ (restaurant, hotel, shopping, ticket, todoapp, transit, realestate, menu, localsearch, receipt, social, apparel)
- reusable/ — โมดูล ESM ไม่มี dependencies
  - offline-data.mjs — codec Flex<->Tree, FlexTreeEditor (add/move/remove), errorPathMapper, createComponent
  - component-metadata.mjs — กฎว่า node แต่ละชนิดเพิ่ม component อะไรได้
  - validator-client.mjs — parseJsonOffline() ตรวจ syntax ออฟไลน์ + adapter เรียก validator/render ทางการ (ต้องออนไลน์)
  - lint-offline.mjs — lint ออฟไลน์ผ่าน flex-guard (มี source ครบใน third-party/)
- tests/ — ทดสอบ 18 เคส: node --test tests/offline-data.test.mjs (ผ่านทั้งหมด)
- third-party/ — source snapshots พร้อม LICENSE เดิม: flex2html, line-flex-renderer-npm, flex-guard, line-openapi
- research/ — หลักฐาน conformance: ผล 401 ทุก endpoint โดยไม่มี session, payload 400 พร้อม property path ที่ตรงจุด,
  ผลเทียบ community validator กับพฤติกรรม server

## ใช้เชิงพาณิชย์

MIT = ฟรี ใช้ใน product ส่วนตัวหรือเชิงพาณิชย์ได้ไม่จำกัด เช่น
- LINE Flex card builder / no-code editor (tree model + component rules คือ editor core)
- ตรวจ card อัตโนมัติก่อนส่งเข้า Messaging API (QA/CI)

## License

MIT สำหรับโค้ดโปรเจกต์นี้ · ไฟล์ third-party/ คง LICENSE เดิมของแต่ละโปรเจกต์
