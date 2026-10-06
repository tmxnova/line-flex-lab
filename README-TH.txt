LINE FLEX SIMULATOR — ชุดโค้ดสำหรับศึกษาและใช้ต่อ
จัดเก็บและตรวจสอบ: 6 ตุลาคม 2026

เริ่มใช้แบบออฟไลน์
------------------
ดับเบิลคลิก offline-lab.html ใน Chrome/Safari/Edge
ไฟล์เดียวมี JSON editor, preview, 12 ตัวอย่าง, ภาพ 24 ไฟล์,
Undo/Redo และ Import/Download JSON ไม่ต้องติดตั้ง npm หรือ login
ทดสอบเปิดจาก file:// ขณะตั้ง browser offline=true แล้ว

หน้าทดลองนี้เขียนเพิ่มและใช้ renderer ของ PamornT/flex2html
ไม่ใช่ UI ต้นฉบับของ LINE และไม่รับรองภาพเหมือน LINE ทุก property
ตรวจได้เพียง syntax ของ JSON และลอง render ในเครื่อง
ไม่ได้หมายความว่า LINE จะยอมรับ JSON นั้น
ภาพ URL ที่ไม่ได้รวมในชุดใช้ placeholder; วิดีโอ/การส่ง LINE ไม่ทำงาน offline

โค้ดแต่ละกลุ่ม
---------------
assets/main-*.js, assets/vendors-*.js
  JS bundles ต้นฉบับ 2 ไฟล์ที่หน้า Simulator โหลด
  เป็น JavaScript หลัง build ไม่ใช่ repository ต้นฉบับของ LINE
  ไฟล์ต้นฉบับไม่ถูกแก้ไข ตรวจสอบ SHA-256 ได้จาก manifest.json

assets/*.css, assets/font/, assets/images/
  CSS และทรัพยากรหน้าต้นฉบับที่ดาวน์โหลดได้
  render.original.css เป็น stylesheet ของ preview ที่ server ส่งมาอ้างถึง

index.original.html
  HTML เดิม ซึ่งต้องใช้เส้นทาง /flex-simulator/... และ API ของ LINE
  เปิดไฟล์นี้เองไม่ได้ทำให้ server validator หรือ renderer ทำงานออฟไลน์

readable/main.js, readable/vendors.js
  สำเนา bundles ที่จัดรูปแบบให้อ่านง่าย ไม่ได้คืนชื่อไฟล์ Vue ต้นฉบับ
  ไม่พบ sourceMappingURL ใน 2 bundles ที่โหลด

extracted/
  ส่วนโค้ดเกี่ยวกับ JSON.parse, Axios auth, doRender และ error mapping
  คัดลอกจาก readable/main.js โดยตรง; index.json ระบุบรรทัดต้นทาง
  excerpt ต้องพึ่ง scope ของ Vue/Vuex/Axios จึงไม่ใช่ไฟล์ standalone

reusable/offline-data.mjs
  อัลกอริทึมเดิมที่แยกให้ import ใช้ใน Node/browser ได้:
  FlexToTree, TreeToFlex, FlexTreeEditor, errorPathMapper, createComponent
  เปลี่ยนเฉพาะ wrapper/export และ UUID dependency เป็น crypto.randomUUID()
  ระวัง behavior เดิม: ตัวนำเข้า bubble เก็บ size/direction/blocks/styles
  แต่ไม่เก็บ bubble.action หรือ field เพิ่มเติมทั้งหมด จึงไม่ใช่ lossless codec

reusable/component-metadata.mjs
  กฎ UI เดิมว่าแต่ละ node เพิ่ม component อะไรได้ เช่น baseline box
  เพิ่มได้ icon/text/filler ไม่ใช่ validator ฝั่งเซิร์ฟเวอร์

reusable/validator-client.mjs
  adapter ที่เขียนเพิ่มสำหรับเรียก server validator/render ตัวจริง
  validateAndRender() ต้องออนไลน์และมี session ใน origin ที่ถูกต้อง
  ไม่มี cookie/token แนบมา; localhost ไม่สามารถยืม session ข้าม origin
  parseJsonOffline() ตรวจ syntax เท่านั้น
  toEditorMessages() แปลง details เป็น path/text ตาม frontend เดิม

reusable/lint-offline.mjs
  wrapper เรียก community validator flex-guard ที่รวม source มาด้วย
  ใช้ Node 22.18 ขึ้นไป ไม่ต้อง npm install
  ไม่ใช่ implementation ของ LINE และไม่เหมือน LINE แบบ 1:1

samples/
  JSON ตัวอย่าง 12 แบบจาก Showcase

third-party/
  snapshots ของโปรเจกต์สาธารณะ พร้อม LICENSE ของแต่ละโปรเจกต์
  SHA ของ 3 repositories อยู่ใน research/github/snapshots.json
  line-openapi/messaging-api.yml เป็น schema อ้างอิงจาก LINE

research/
  คำตอบ server ตัวจริง, ผลเทียบ validator และผลตรวจ offline browser
  ไม่มีข้อมูล session, cookie, token หรือข้อมูลผู้ใช้ที่ login

ทดลองโค้ดใน Terminal
---------------------
เปิด Terminal ในโฟลเดอร์ที่แตก ZIP แล้วรัน:

  node reusable/example.mjs
  node reusable/lint-offline.mjs samples/restaurant.json
  node --test tests/offline-data.test.mjs

18 tests ของโมดูลที่แยกมาผ่านทั้งหมด
ถ้าแก้ template/renderer/sample สามารถสร้าง offline-lab.html ใหม่ด้วย:

  python3 build-offline-lab.py

AUTH และ RENDER ของตัวจริงทำงานอย่างไร
--------------------------------------
หน้าเว็บ -> GET /api/v1/session -> ตรวจ account/session
        -> GET /api/v1/fx/samples -> รายการตัวอย่าง
        -> GET /api/v1/fx/samples/{id} -> JSON
        -> POST /api/v1/fx/render พร้อม Flex JSON
             HTTP 200: HTML ที่มี link ไป renderer stylesheet
             HTTP 400: JSON {message, details:[{property,message}]}
        -> frontend เขียน HTML ลง iframe หรือแสดง error

Axios ตั้ง withCredentials=true และ xsrfHeaderName='X-CSRF-Token'
HTTP 401 จะพาไป LINE Business login
ทดสอบทั้ง session, samples, render โดยไม่มี cookie ได้ 401 ทั้งหมด
โค้ด renderer และ validator ฝั่ง server ไม่ได้อยู่ใน bundles ที่ดาวน์โหลด

ทำไม /hero/size ถึงขึ้น invalid property
----------------------------------------
หลักฐานที่เรียกจาก server ตัวจริง:

hero = {type:'image', url:'https://example.com/image.png', size:'BAD'}
-> 400 /hero/size : invalid property

hero = {type:'image', url:'https://example.com/image.png', size:'full'}
-> 200 และได้ HTML

hero = {type:'box', layout:'vertical', contents:[], size:'full'}
-> 400 /hero/size : unknown field

กรณีแรกมี field size แต่ค่าไม่ถูกต้องสำหรับ image
กรณีที่สามใช้ field size ใน box ซึ่งชนิด component นี้ไม่มี field ดังกล่าว
ข้อความ invalid property จึงไม่ได้หมายความว่า field ไม่รู้จักเสมอไป
server ใช้ path ชี้ตำแหน่งผิด ส่วน frontend แค่จับคู่ path กับช่องกรอก
ผลฉบับเต็มอยู่ใน research/validation-observations.json

GITHUB ที่ควรเปิดศึกษา
-----------------------
1) https://github.com/PamornT/flex2html
   JS + CSS แปลง Flex JSON เป็น HTML เหมาะกับการศึกษา renderer แบบง่าย
   ใช้เป็น renderer ของ offline-lab.html และลอง render ครบทั้ง 12 ตัวอย่าง
   เป็น community implementation ไม่ใช่ validator และไม่ใช่ LINE renderer
   source อยู่ใน third-party/flex2html/js/flex2html.js

2) https://github.com/kanketsu-jp/line-flex-renderer-npm
   React preview, visual editor และ validation แยกเป็นไฟล์อ่านง่าย
   จุดเริ่มอ่าน: src/components/, src/editor/validate.ts,
   src/editor/validateMessage.ts และ src/__tests__/
   README ระบุว่า unknown keys ผ่านได้ จึงไม่เท่ากับ server LINE
   รวม source ไว้สำหรับศึกษา ยังไม่ได้ติดตั้ง dependencies/รัน test ของ repo นี้

3) https://github.com/line/line-openapi
   schema จาก LINE โดยตรง เหมาะใช้อ้างอิง type/property/required/enum
   แต่ schema สาธารณะไม่ได้มีกฎ server และข้อความ error ทั้งหมด
   เช่น FlexImage.size เป็น string ไม่ได้แจกแจงทุกค่าที่ server ยอมรับ

4) https://github.com/loncoeng/flex-guard
   ตัวอย่างการเดิน JSON และตรวจ schema/unknown-property/required/enum
   รัน offline ได้ เหมาะดูโครงสร้าง validator แต่ไม่ควรถือเป็น LINE 1:1
   ผลทดสอบที่พบ: size:'BAD' ใน hero image และ text ที่ไม่มี text/contents
   ถูก LINE ปฏิเสธ แต่ library นี้ปล่อยผ่าน
   snapshot นี้ยังใช้ bubble limit 10 KB ขณะที่ reference ปัจจุบันระบุ 30 KB
   ดู research/flex-guard-comparison.json ประกอบ

ข้อสรุปขอบเขต
--------------
ชุดนี้มี client bundles ที่ดึงได้ครบ, โค้ด offline ที่ใช้ต่อได้,
community source และหลักฐานการทำงานของ API ไม่ได้มี source server ส่วนตัว
จึงไม่อ้างว่าเป็น validator หรือ renderer ต้นฉบับของ LINE แบบ 1:1

แหล่งอ้างอิง
-------------
https://developers.line.biz/flex-simulator/
https://developers.line.biz/en/reference/messaging-api/#flex-message
https://developers.line.biz/en/reference/messaging-api/index.html.md
https://developers.line.biz/en/docs/messaging-api/using-flex-message-simulator/

คง LICENSE/ประกาศของต้นทางไว้ในแต่ละโฟลเดอร์
การรวม bundle ของ LINE ไว้ศึกษาไม่ได้เปลี่ยน license ให้เป็น MIT
