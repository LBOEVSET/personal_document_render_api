import 'dotenv/config';
import { PrismaClient, ContentType, Department } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

function mapRelationFromPath(item: any) {
  // 🔥 ใช้ file ก่อน เพราะมี structure จริง
  const path = item.file || item.link || "";

  const segments = path.split('/').filter(Boolean);

  let mainId: string | null = null;
  let subId: string | null = null;
  let groupId: string | null = null;

  for (const seg of segments) {
    if (seg.endsWith('-main')) mainId = seg;
    if (seg.endsWith('-sub')) subId = seg;
    if (seg.endsWith('-group')) groupId = seg;
  }

  const isLegal = segments[0] === 'legal';
  const isPR = segments[0] === 'pr';

  const data: any = { ...item };

  // ======================
  // LEGAL
  // ======================
  if (isLegal) {
    if (mainId) data.legalId = mainId;
    if (subId) data.subLegalId = subId;
    if (groupId) data.legalGroupId = groupId;
  }

  // ======================
  // PR
  // ======================
  if (isPR) {
    if (mainId) data.prId = mainId;
    if (subId) data.subPrId = subId;
    if (groupId) data.prGroupId = groupId;
  }

  return data;
}

async function main() {

  // ======================
  // MAIN MENU
  // ======================
  await prisma.mainMenu.createMany({
    data: [
      { id: 'legal', title: 'ความรู้ทางกฎหมาย', icon: '/icons/menu-legal.png', href: '/legal' },
      { id: 'inmate', title: 'ข้อมูลผู้ต้องขัง', icon: '/icons/menu-inmate.png', href: '/inmate' },
      { id: 'pr', title: 'งานประชาสัมพันธ์', icon: '/icons/menu-pr.png', href: '/pr' },
    ]
  });

  // ======================
  // LEGAL CATEGORY
  // ======================
  await prisma.legalCategory.createMany({
    data: [
      { id: '1', title: 'กฎหมายต่างๆที่เกี่ยวข้อง' },
      { id: '2', title: 'สิทธิประโยชน์ของผู้ต้องขังในเรือนจำ' },
      { id: '3', title: 'การฝากขัง' },
      { id: '4', title: 'การขอประกันตัวในชั้นศาล' },
      { id: '5', title: 'ความรู้เกี่ยวกับกระบวนการยุติธรรมและคดีอาญา' },
    ]
  });

  // ======================
  // PR DEPARTMENT
  // ======================
  await prisma.pRDepartment.createMany({
    data: [
      { id: 'admin', title: 'ฝ่ายบริหารทั่วไป', icon: '/icons/pr-admin.png' },
      { id: 'govern', title: 'ฝ่ายปกครอง', icon: '/icons/pr-govern.png' },
      { id: 'practice', title: 'ฝ่ายทัณฑปฏิบัติ', icon: '/icons/pr-practice.png' },
      { id: 'class1', title: 'ฝ่ายจำแนกลักษณะผู้ต้องขัง', icon: '/icons/pr-class1.png' },
      { id: 'dev1', title: 'ฝ่ายพัฒนาผู้ต้องขัง 1', icon: '/icons/pr-dev1.png' },
      { id: 'dev2', title: 'ฝ่ายพัฒนาผู้ต้องขัง 2', icon: '/icons/pr-dev2.png' },
      { id: 'edu', title: 'ฝ่ายการศึกษาและพัฒนาจิตใจ', icon: '/icons/pr-edu.png' },
      { id: 'welfare', title: 'ฝ่ายสวัสดิการ', icon: '/icons/pr-welfare.png' },
      { id: 'social', title: 'ฝ่ายสงเคราะห์ผู้ต้องขัง', icon: '/icons/pr-social.png' },
      { id: 'hospital', title: 'สถานพยาบาล', icon: '/icons/pr-hospital.png' },
    ]
  });

  // ===============================
  // ⚖️ Legal Menu
  // ===============================
  await prisma.legalMenu.createMany({
    data: [
      { id: "1-main", title: 'กฎหมายต่างๆที่เกี่ยวข้อง', order: 1 },
      { id: "2-main", title: 'การฝากขัง', order: 2 },
      { id: "3-main", title: 'การขอประกันตัวในชั้นศาล', order: 3 },
      { id: "4-main", title: 'กระบวนการยุติธรรม', order: 4 },
      { id: "5-main", title: 'การปล่อยตัวชั่วคราวและการบังคับคดีผู้ประกัน', order: 5 },
      { id: "6-main", title: 'การปล่อยไม่มีหลักประกัน', order: 6 },
      { id: "7-main", title: 'การคุ้มครองสิทธิและเสรีภาพ', order: 7 },
    ],
    skipDuplicates: true,
  });

  // ===============================
  // ⚖️ Sub Legal Menu
  // ===============================
  await prisma.subLegalMenu.createMany({
    data: [
      { id: "1-sub", legalId: "1-main", title: '1. ของกลุ่มงานส่งเสริมการจำแนกลักษณะผู้ต้องขัง', order: 1 },
      { id: "2-sub", legalId: "1-main", title: '2. ของกลุ่มงานเลื่อนขั้นผู้ต้องขัง', order: 2 },
      { id: "3-sub", legalId: "1-main", title: '3. ของกลุ่มงานสาธารณและงานนอกเรือนจำ', order: 3 },
      { id: "4-sub", legalId: "1-main", title: '4. ของกลุ่มงานย้ายผู้ต้องขัง', order: 4 },
      { id: "5-sub", legalId: "1-main", title: '5. ของกลุ่มงานการลดวันต้องโทษ', order: 5 },
      { id: "6-sub", legalId: "1-main", title: '6. ของกลุ่มงานพักการลงโทษ', order: 6 },
      { id: "7-sub", legalId: "1-main", title: '7. ของกลุ่มงานอภัยโทษ', order: 7 },
    ],
    skipDuplicates: true,
  });

  // ===============================
  // ⚖️ Sub Group Legal Menu
  // ===============================
  await prisma.subGroupLegalMenu.createMany({
    data: [
      { id: "1-group", subId: "1-sub", title: 'กฎกระทรวงจำแนกฯ พ.ศ. 2563', order: 1 },
      { id: "2-group", subId: "1-sub", title: 'พ.ร.บ.ราชทัณฑ์ พ.ศ. 2560', order: 2 },
    ],
    skipDuplicates: true,
  });

  // ===============================
  // 📢 PR Practice Menu
  // ===============================
  await prisma.pRPracticeMenu.createMany({
    data: [
      { id: "1-main", title: 'ฝ่ายบริหารทั่วไป', order: 1 },
      { id: "2-main", title: 'ฝ่ายปกครอง', order: 2 },
      { id: "3-main", title: 'ฝ่ายทัณฑปฏิบัติ', order: 3 },
      { id: "4-main", title: 'ฝ่ายจำแนกลักษณะผู้ต้องขัง', order: 4 },
      { id: "5-main", title: 'ฝ่ายพัฒนาผู้ต้อง 1', order: 5 },
      { id: "6-main", title: 'ฝ่ายพัฒนาผู้ต้องขัง 2', order: 6 },
      { id: "7-main", title: 'ฝ่ายการศึกษาและพัฒนาจิตใจ', order: 7 },
      { id: "8-main", title: 'ฝ่ายสวัสดิการ', order: 8 },
      { id: "9-main", title: 'ฝ่ายสงเคราะห์ผู้ต้องขัง', order: 9 },
      { id: "10-main", title: 'สถานพยาบาล', order: 10 },
    ],
    skipDuplicates: true,
  });

  // ===============================
  // 📢 Sub PR Practice Menu
  // ===============================
  await prisma.subPRPracticeMenu.createMany({
    data: [
      { id: "1-sub", prId: "3-main", title: 'กลุ่มงานส่งเสริมการจำแนกลักษณะผู้ต้องขัง', order: 1 },
      { id: "2-sub", prId: "3-main", title: 'กลุ่มงานเลื่อนชั้นผู้ต้องขัง', order: 2 },
      { id: "3-sub", prId: "3-main", title: 'กลุ่มงานวินัยผู้ต้องขัง', order: 3 },
      { id: "4-sub", prId: "3-main", title: 'กลุ่มงานสาธารณะและงานนอกเรือนจำ', order: 4 },
      { id: "5-sub", prId: "3-main", title: 'กลุ่มงานย้ายผู้ต้องขัง', order: 5 },
      { id: "6-sub", prId: "3-main", title: 'กลุ่มงานการลดวันต้องโทษ', order: 6 },
      { id: "7-sub", prId: "3-main", title: 'กลุ่มงานพักการลงโทษ', order: 7 },
      { id: "8-sub", prId: "3-main", title: 'กลุ่มงานอภัยโทษ', order: 8 },
    ],
    skipDuplicates: true,
  });

  // ===============================
  // 📢 Sub Group PR Practice Menu
  // ===============================
  await prisma.subGroupPRPracticeMenu.createMany({
    data: [
      { id: "3-group", subId: "2-sub", title: 'การเลื่อนชั้นนักโทษเด็ดขาด', order: 1 },
      { id: "4-group", subId: "2-sub", title: 'ผู้ช่วยงานผู้ช่วยเหลือ', order: 2 },
    ],
    skipDuplicates: true,
  });

  // ======================
  // LEGAL DOCUMENT
  // ======================
  await prisma.legalDocument.createMany({
    data: [
      { id: 'doc-1', title: 'กฎกระทรวงจำแนกฯ พ.ศ. 2563', type: 'image', categoryKey: '1-1' },
      { id: 'doc-2', title: 'พ.ร.บ.ราชทัณฑ์ พ.ศ. 2560', type: 'pdf', categoryKey: '1-1' },
    ]
  });

  // ======================
  // INFOGRAPHICS
  // ======================
  const infographics = [
    '/image1.png','/image2.png','/image3.jpg','/image4.png',
    '/image5.jpg','/image6.png','/image7.png','/image8.jpg',
    '/image9.jpg','/image10.png','/image11.png',
    '/PR/ประชาสัมพันธ์เยี่ยมใกล้ชิด.jpg'
  ];

  await prisma.infographic.createMany({
    data: infographics.map((path, i) => ({
      id: `img-${i+1}`,
      path
    }))
  });

  // ======================
  // CONTENT REGISTRY (สำคัญสุด)
  // ======================
  await prisma.contentItem.createMany({
    data: [

      // ======================
      // PDF (LEGAL)
      // ======================
      ...[
        { id:'pdf-1', department: Department.LEGAL, title:'การสืบสวนและจับกุม (Police)', link:'legal/4-main/pdf-1.pdf', cover:'/legal/4-main/cover-pdf-1.png', file: '/legal/4-main/pdf-1.pdf' },
        { id:'pdf-2', department: Department.LEGAL, title:'การสอบสวน/ไต่สวนเบื้องต้น (Inquiry)', link:'legal/4-main/pdf-2.pdf', cover:'/legal/4-main/cover-pdf-2.png', file: '/legal/4-main/pdf-2.pdf' },
        { id:'pdf-3', department: Department.LEGAL, title:'การฟ้องคดี (Prosecution)', link:'legal/4-main/pdf-3.pdf', cover:'/legal/4-main/cover-pdf-3.png', file: '/legal/4-main/pdf-3.pdf' },
        { id:'pdf-4', department: Department.LEGAL, title:'การพิจารณาพิพากษา (Court)', link:'legal/4-main/pdf-4.pdf', cover:'/legal/4-main/cover-pdf-4.png', file: '/legal/4-main/pdf-4.pdf' },
        { id:'pdf-5', department: Department.LEGAL, title:'การบังคับโทษ/ฟื้นฟู (Correction)', link:'legal/4-main/pdf-5.pdf', cover:'/legal/4-main/cover-pdf-5.png', file: '/legal/4-main/pdf-5.pdf' },
      ].map(i => ({
        ...mapRelationFromPath(i),
        type: ContentType.PDF,
      })),

      // ======================
      // PDF (PR)
      // ======================
      ...[
        { id:'pdf-6', department: Department.PR, title:'การปฏิบัติงานของบุคลากร ทัณฑสถานหญิงกลางตาม ภารกิจหลัก', link:'pr/2-main/pdf-6.pdf', cover:'/pr/2-main/cover-pdf-1.png', file: '/pr/2-main/pdf-1.pdf' },
      ].map(i => ({
        ...mapRelationFromPath(i),
        type: ContentType.PDF,
      })),

      // ======================
      // IMAGES (PR - sub)
      // ======================
      ...[
        { id:'img-1', department: Department.PR, title:'กลุ่มงานส่งเสริมการจำแนกลักษณะผู้ต้องขัง', link:'pr/3-main/1-sub/img-1.png', cover:'/pr/3-main/1-sub/img-1.png' },
        { id:'img-2', department: Department.PR, title:'กลุ่มงานส่งเสริมการจำแนกลักษณะผู้ต้องขังB', link:'pr/3-main/1-sub/img-2.png', cover:'/pr/3-main/1-sub/img-2.png' },
        { id:'img-3', department: Department.PR, title:'กลุ่มงานส่งเสริมการจำแนกลักษณะผู้ต้องขังC', link:'pr/3-main/1-sub/img-3.png', cover:'/pr/3-main/1-sub/img-3.png' },
        { id:'img-4', department: Department.PR, title:'กลุ่มงานเลื่อนขั้นผู้ต้องขัง', link:'pr/3-main/1-sub/img-4.jpg', cover:'/pr/3-main/1-sub/img-4.jpg' },
        { id:'img-5', department: Department.PR, title:'กลุ่มงานวินัยผู้ต้องขัง', link:'pr/3-main/1-sub/img-5.png', cover:'/pr/3-main/1-sub/img-5.png' },
      ].map(i => ({
        ...mapRelationFromPath(i),
        type: ContentType.IMAGE,
      })),

      // ======================
      // IMAGES (LEGAL - group)
      // ======================
      ...[
        { id:'img-6', department: Department.LEGAL, title:'กฎหมายต่างๆที่เกี่ยวข้อง', link:'legal/1-main/1-sub/1-group/img-6.png', cover:'/legal/1-main/1-sub/1-group/img-6.png' },
        { id:'img-7', department: Department.LEGAL, title:'กฎหมายต่างๆที่เกี่ยวข้อง', link:'legal/1-main/1-sub/1-group/img-7.png', cover:'/legal/1-main/1-sub/1-group/img-7.png' },
        { id:'img-8', department: Department.LEGAL, title:'กฎหมายต่างๆที่เกี่ยวข้อง', link:'legal/1-main/1-sub/1-group/img-8.png', cover:'/legal/1-main/1-sub/1-group/img-8.png' },
        { id:'img-9', department: Department.LEGAL, title:'กฎหมายต่างๆที่เกี่ยวข้อง', link:'legal/1-main/1-sub/1-group/img-9.png', cover:'/legal/1-main/1-sub/1-group/img-9.png' },
        { id:'img-10', department: Department.LEGAL, title:'การฝากขัง', link:'legal/1-main/1-sub/1-group/img-10.jpg', cover:'/legal/1-main/1-sub/1-group/img-10.jpg' },
        { id:'img-11', department: Department.LEGAL, title:'การฝากขัง', link:'legal/1-main/1-sub/1-group/img-11.jpg', cover:'/legal/1-main/1-sub/1-group/img-11.jpg' },
      ].map(i => ({
        ...mapRelationFromPath(i),
        type: ContentType.IMAGE,
      })),

      // ======================
      // VIDEOS (PR - main)
      // ======================
      ...[
        { id:'v7', department: Department.PR, title:'ฝ่ายบริหารทั่วไป', link:'pr/content/vdo/v7', file:'/pr/1-main/v7.mp4' },
        { id:'v8', department: Department.PR, title:'ฝ่ายบริหารทั่วไป', link:'pr/content/vdo/v8', file:'/pr/1-main/v8.mp4' },
        { id:'v9', department: Department.PR, title:'ฝ่ายบริหารทั่วไป', link:'pr/content/vdo/v9', file:'/pr/1-main/v9.mp4' },
      ].map(v => ({
        ...mapRelationFromPath(v),
        type: ContentType.VIDEO,
      })),

      // ======================
      // VIDEOS (LEGAL - sub)
      // ======================
      ...[
        { id:'v1', department: Department.LEGAL, title:'กฎกระทรวงจำแนกฯ พ.ศ. 2563', link:'legal/content/vdo/v1', file:'/legal/1-main/2-sub/v1.mp4' },
        { id:'v2', department: Department.LEGAL, title:'กฎกระทรวงจำแนกฯ พ.ศ. 2563 (ต่อ)1', link:'legal/content/vdo/v2', file:'/legal/1-main/2-sub/v2.mp4' },
        { id:'v3', department: Department.LEGAL, title:'กฎกระทรวงจำแนกฯ พ.ศ. 2563 (ต่อ)2', link:'legal/content/vdo/v3', file:'/legal/1-main/2-sub/v3.mp4' },
      ].map(v => ({
        ...mapRelationFromPath(v),
        type: ContentType.VIDEO,
      })),

      // ======================
      // VIDEOS (PR - group)
      // ======================
      ...[
        { id:'v4', department: Department.PR, title:'การเลื่อนชั้นนักโทษเด็ดขาด', link:'pr/content/vdo/v4', file:'/pr/3-main/2-sub/3-group/v4.mp4' },
        { id:'v5', department: Department.PR, title:'การเลื่อนชั้นนักโทษเด็ดขาด (ต่อ)1', link:'pr/content/vdo/v5', file:'/pr/3-main/2-sub/3-group/v5.mp4' },
        { id:'v6', department: Department.PR, title:'การเลื่อนชั้นนักโทษเด็ดขาด (ต่อ)2', link:'pr/content/vdo/v6', file:'/pr/3-main/2-sub/3-group/v6.mp4' },
      ].map(v => ({
        ...mapRelationFromPath(v),
        type: ContentType.VIDEO,
      })),

    ],
    skipDuplicates: true,
  });

  // ======================
  // INMATE
  // ======================
  await prisma.user.create({
    data: {
      username: "6870601174",
      passwordHash: "$2b$10$u1n9r3ZzjH8Qv7u5XGzUOeGqLh0nPjK1sYpJtXQZy8o5c6aWlG", // hash ของ "password123"
      role: 'INMATE',
      name: "ดาลิกา พงศ์อนันตโชติ",
      //profileImage: "/uploads/inmate/1710000000000-123456789.png",
      status: 1
    }
  });
  await prisma.inmateProfile.create({
    data: {
      id: "6870601174",
      userId: (await prisma.user.findFirst({ where: { username: "6870601174" } }))?.id || '',
      name: "ดาลิกา พงศ์อนันตโชติ",
      status: "ชั้นดีมาก",
      daysLeft: 627,
      totalDays: 1102,
      cases: 1,
      caseType: "เสพและมีเมทแอมเฟตามีนไว้ในครอบครองเพื่อจำหน่าย",
      sentence: "3 ปี 0 เดือน 7 วัน",
      startDate: "29 ธันวาคม 2568",
      transferFrom: "-",
      releaseDate: "21 พฤศจิกายน 2570",
      progressStep: 4,
      detail: {
        create: {
          id: "detail-1",
          age: "28 ปี 8 เดือน",
          nationality: "ไทย",
          religion: "พุทธ",
          holdType: "ดำเนินคดี",
          holdAgency: "สภ.จอมทอง"
        }
      }
    }
  });

}

main();
