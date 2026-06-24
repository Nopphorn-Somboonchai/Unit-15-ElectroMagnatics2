import { test, expect } from '@playwright/test';

test('หน้าแรกของโปรเจกต์โหลดสำเร็จและหัวข้อถูกต้อง', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle(/ฟิสิกส์ ม.6: บทเรียนเรื่องแม่เหล็กและไฟฟ้า/);
});

test('หมวดการสอบสุ่มข้อสอบ type: choice ได้ 1 ข้อ และ type: numeric ได้ 4 ข้อ', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // สลับไปยังหน้าการสอบเพื่อแสดงฟิลด์กรอกข้อมูล
    await page.evaluate(() => {
        // @ts-ignore
        showSection('exam-start');
    });

    // กรอกข้อมูลนักเรียน
    await page.fill('#exam-student-name', 'สมชาย ใจดี');
    await page.selectOption('#exam-student-class', '1');
    await page.fill('#exam-student-no', '99');

    // เรียกฟังก์ชันเริ่มทำข้อสอบ
    await page.evaluate(() => {
        // @ts-ignore
        startExamProcess();
    });

    // ดึงค่า currentExamQuestions จาก scope หน้าเว็บโดยตรง
    const questions = await page.evaluate(() => {
        // @ts-ignore
        return currentExamQuestions;
    });

    // ตรวจสอบจำนวนข้อสอบทั้งหมด
    expect(questions).toHaveLength(5);

    // ตรวจสอบว่ามี choice 1 ข้อ และ numeric 4 ข้อ
    const choiceCount = questions.filter((q: any) => q.type === 'choice').length;
    const numericCount = questions.filter((q: any) => q.type.startsWith('numeric')).length;

    expect(choiceCount).toBe(1);
    expect(numericCount).toBe(4);
});