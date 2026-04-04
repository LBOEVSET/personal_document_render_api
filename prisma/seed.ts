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
  // ใช้ file ก่อน เพราะมี structure จริง
  const path = item.file || item.link || "";

  const segments = path.split('/').filter(Boolean);

  let mainId: string | null = null;

  for (const seg of segments) {
    if (seg.endsWith('-main')) mainId = seg;
  }

  const isLegal = segments[0] === 'legal';
  const isPR = segments[0] === 'pr';

  const data: any = { ...item };

  // ======================
  // LEGAL
  // ======================
  if (isLegal) {
    if (mainId) data.legalId = mainId;
  }

  // ======================
  // PR
  // ======================
  if (isPR) {
    if (mainId) data.prId = mainId;
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

  // ======================
  // CONTENT REGISTRY (สำคัญสุด)
  // ======================
  await prisma.contentItem.createMany({
    data: [

      // ======================
      // PDF (LEGAL)
      // ======================
      ...[
        { department: Department.LEGAL, title:'การสืบสวนและจับกุม (Police)', link:'legal/4-main/pdf-1.pdf', cover:'/default/pdf_default.png', file: '/legal/4-main/pdf-1.pdf' },
        { department: Department.LEGAL, title:'การสอบสวน/ไต่สวนเบื้องต้น (Inquiry)', link:'legal/4-main/pdf-2.pdf', cover:'/default/pdf_default.png', file: '/legal/4-main/pdf-2.pdf' },
        { department: Department.LEGAL, title:'การฟ้องคดี (Prosecution)', link:'legal/4-main/pdf-3.pdf', cover:'/default/pdf_default.png', file: '/legal/4-main/pdf-3.pdf' },
        { department: Department.LEGAL, title:'การพิจารณาพิพากษา (Court)', link:'legal/4-main/pdf-4.pdf', cover:'/default/pdf_default.png', file: '/legal/4-main/pdf-4.pdf' },
        { department: Department.LEGAL, title:'การบังคับโทษ/ฟื้นฟู (Correction)', link:'legal/4-main/pdf-5.pdf', cover:'/default/pdf_default.png', file: '/legal/4-main/pdf-5.pdf' },
      ].map(i => ({
        ...mapRelationFromPath(i),
        type: ContentType.PDF,
      })),

      // ======================
      // PDF (PR)
      // ======================
      ...[
        { department: Department.PR, title:'การปฏิบัติงานของบุคลากร ทัณฑสถานหญิงกลางตาม ภารกิจหลัก', link:'pr/2-main/pdf-6.pdf', cover:'/pr/2-main/cover-pdf-1.png', file: '/pr/2-main/pdf-1.pdf' },
      ].map(i => ({
        ...mapRelationFromPath(i),
        type: ContentType.PDF,
      })),

      // ======================
      // IMAGES (PR - sub)
      // ======================
      ...[
        { department: Department.PR, title:'กลุ่มงานส่งเสริมการจำแนกลักษณะผู้ต้องขัง', link:'/default/image_default.jpg', cover:'/default/image_default.jpg' },
        { department: Department.PR, title:'กลุ่มงานส่งเสริมการจำแนกลักษณะผู้ต้องขังB', link:'/default/image_default.jpg', cover:'/default/image_default.jpg' },
        { department: Department.PR, title:'กลุ่มงานส่งเสริมการจำแนกลักษณะผู้ต้องขังC', link:'/default/image_default.jpg', cover:'/default/image_default.jpg' },
        { department: Department.PR, title:'กลุ่มงานเลื่อนขั้นผู้ต้องขัง', link:'/default/image_default.jpg', cover:'/default/image_default.jpg' },
        { department: Department.PR, title:'กลุ่มงานวินัยผู้ต้องขัง', link:'/default/image_default.jpg', cover:'/default/image_default.jpg' },
      ].map(i => ({
        ...mapRelationFromPath(i),
        type: ContentType.IMAGE,
      })),

      // ======================
      // IMAGES (LEGAL - group)
      // ======================
      ...[
        { department: Department.LEGAL, title:'กฎหมายต่างๆที่เกี่ยวข้อง', link:'/default/image_default.jpg', cover:'/default/image_default.jpg' },
        { department: Department.LEGAL, title:'กฎหมายต่างๆที่เกี่ยวข้อง', link:'/default/image_default.jpg', cover:'/default/image_default.jpg' },
        { department: Department.LEGAL, title:'กฎหมายต่างๆที่เกี่ยวข้อง', link:'/default/image_default.jpg', cover:'/default/image_default.jpg' },
        { department: Department.LEGAL, title:'กฎหมายต่างๆที่เกี่ยวข้อง', link:'/default/image_default.jpg', cover:'/default/image_default.jpg' },
        { department: Department.LEGAL, title:'การฝากขัง', link:'/default/image_default.jpg', cover:'/default/image_default.jpg' },
        { department: Department.LEGAL, title:'การฝากขัง', link:'/default/image_default.jpg', cover:'/default/image_default.jpg' },
      ].map(i => ({
        ...mapRelationFromPath(i),
        type: ContentType.IMAGE,
      })),

      // ======================
      // VIDEOS (PR - main)
      // ======================
      ...[
        { department: Department.PR, title:'ฝ่ายบริหารทั่วไป', link:'pr/content/vdo/v7', file:'/pr/1-main/v7.mp4', cover:'/default/video_default.jpeg' },
        { department: Department.PR, title:'ฝ่ายบริหารทั่วไป', link:'pr/content/vdo/v8', file:'/pr/1-main/v8.mp4', cover:'/default/video_default.jpeg' },
        { department: Department.PR, title:'ฝ่ายบริหารทั่วไป', link:'pr/content/vdo/v9', file:'/pr/1-main/v9.mp4', cover:'/default/video_default.jpeg' },
      ].map(v => ({
        ...mapRelationFromPath(v),
        type: ContentType.VIDEO,
      })),

      // ======================
      // VIDEOS (LEGAL - sub)
      // ======================
      ...[
        { department: Department.LEGAL, title:'กฎกระทรวงจำแนกฯ พ.ศ. 2563', link:'legal/content/vdo/v1', file:'/legal/1-main/v1.mp4', cover:'/default/video_default.jpeg' },
        { department: Department.LEGAL, title:'กฎกระทรวงจำแนกฯ พ.ศ. 2563 (ต่อ)1', link:'legal/content/vdo/v2', file:'/legal/1-main/v2.mp4', cover:'/default/video_default.jpeg' },
        { department: Department.LEGAL, title:'กฎกระทรวงจำแนกฯ พ.ศ. 2563 (ต่อ)2', link:'legal/content/vdo/v3', file:'/legal/1-main/v3.mp4', cover:'/default/video_default.jpeg' },
      ].map(v => ({
        ...mapRelationFromPath(v),
        type: ContentType.VIDEO,
      })),

      // ======================
      // VIDEOS (PR - group)
      // ======================
      ...[
        { department: Department.PR, title:'การเลื่อนชั้นนักโทษเด็ดขาด', link:'pr/content/vdo/v4', file:'/pr/3-main/v4.mp4', cover:'/default/video_default.jpeg' },
        { department: Department.PR, title:'การเลื่อนชั้นนักโทษเด็ดขาด (ต่อ)1', link:'pr/content/vdo/v5', file:'/pr/3-main/v5.mp4', cover:'/default/video_default.jpeg' },
        { department: Department.PR, title:'การเลื่อนชั้นนักโทษเด็ดขาด (ต่อ)2', link:'pr/content/vdo/v6', file:'/pr/3-main/v6.mp4', cover:'/default/video_default.jpeg' },
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
      profileImage: "/uploads/inmate/1775160950575-499198019.png",
      status: 1
    }
  });
  await prisma.user.create({
    data: {
      id: "6462cba0-1993-42b0-9d93-c8498640a9c4",
      username: "1100801249284",
      passwordHash: "$2b$10$QSahEDNmYtl33UhuWqLV1uq2rg6N.QNZq490OjEeLEgQAp9Wu31gS", // hash ของ "20011966"
      accessToken: "$2b$10$8Jen.1HRS7CK6u.XH7Dxt.0kvQtuZkYuQkjqebHdxkWPYTsx/N3MC",
      refreshToken: "$2b$10$sHtaV6kk2Sn7ku6lFpFS4./JR9pcHhm1ae6LDx4FasLLUOUrlEN5G",
      role: 'ADMIN',
      name: "Sorawich Tantijitjaru",
      profileImage: null,
      status: 1
    }
  });
  await prisma.inmateProfile.create({
    data: {
      id: "6870601174",
      userId: (await prisma.user.findFirst({ where: { username: "6870601174" } }))?.id || '',
      name: "ดาลิกา พงศ์อนันตโชติ",
      status: "ชั้นดีมาก",
      cases: 1,
      caseType: "เสพและมีเมทแอมเฟตามีนไว้ในครอบครองเพื่อจำหน่าย",
      category: "ผู้ต้องขังระหว่าง อุทธรณ์-ฎีกา",
      sentence: "3 ปี 0 เดือน 7 วัน",
      startDate: new Date("2025-12-29T00:00:00.000Z"),
      transferFrom: "-",
      releaseDate: new Date("2027-11-21T00:00:00.000Z"),
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
