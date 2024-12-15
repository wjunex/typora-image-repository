const { exec } = require("child_process");
const { promisify } = require("util");
const path = require("path");
const fs = require("fs");

const execAsync = promisify(exec);

(async () => {
  const localImageUrl = process.argv[2];
  if (!localImageUrl) {
    console.error("请提供图片的本地路径！");
    process.exit(1);
  }

  // 获取当前日期，格式为 YYYY-MM
  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;

  const fileName = path.basename(localImageUrl);
  const targetDir = `D:/software/Typora/upload/${yearMonth}`;

  try {
    // 如果目标文件夹不存在，创建该文件夹
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // 使用 move 命令将文件移动到目标文件夹
    await execAsync(`move "${localImageUrl}" "${targetDir}"`);

    // 执行 Git 操作
    await execAsync(`git -C "${targetDir}" add .`);
    await execAsync(`git -C "${targetDir}" commit -m "新增图片"`);
    await execAsync(`git -C "${targetDir}" push`);

    console.log(`https://raw.githubusercontent.com/wjunex/typora-image-repository/refs/heads/main/${yearMonth}/${fileName}`);
  } catch (err) {
    console.error("执行过程中出错:", err);
    process.exit(1);
  }
})();
