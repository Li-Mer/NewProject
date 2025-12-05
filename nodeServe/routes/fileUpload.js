const multiparty = require("multiparty");
const fse = require("fs-extra");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const path = require("path");
const router = new Router();

const TARGET_DIR_Single =
  "D:\\Web\\NewProject\\my-app\\src\\assets\\fileUpload\\fileUploadSingle";

const TARGET_DIR_Many =
  "D:\\Web\\NewProject\\my-app\\src\\assets\\fileUpload\\fileUploadMany";

const TARGET_DIR_Big =
  "D:\\Web\\NewProject\\my-app\\src\\assets\\fileUpload\\fileUploadBig";

// 简单清洗 dir，去掉不可见字符和空白
const cleanDir = (s) =>
  String(s || "")
    .replace(/\0/g, "")
    .trim();

router.post("/upload/fileUploadSingle", async (ctx) => {
  const form = new multiparty.Form();

  const parseForm = () =>
    new Promise((resolve, reject) => {
      form.parse(ctx.req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

  try {
    // fields:解析后的普通表单字段（非文件）
    // files：解析后的文件字段

    // fields 结构
    // fields = { name: ["user123"] };
    // files 结构
    // files = {
    //   file: [
    //     {
    //       path: "/tmp/20240520-123456-abc.tmp", // tempPath
    //       originalFilename: "avatar.jpg", // originalFilename
    //       size: 10240, // 文件大小（字节）
    //       headers: { "content-type": "image/jpeg" }, // 文件类型
    //     },
    //   ],
    // };

    const { fields, files } = await parseForm();
    const name = Array.isArray(fields?.name) ? fields.name[0] : fields?.name;
    const fileItem =
      Array.isArray(files?.file) && files.file.length > 0
        ? files.file[0]
        : null;

    if (!fileItem) {
      ctx.status = 400;
      ctx.body = { code: 400, message: "缺少 file 文件" };
      return;
    }

    // 原始文件信息
    const tempPath = fileItem.path; // 临时文件路径
    const originalFilename = fileItem.originalFilename || "uploaded_file";
    const ext = path.extname(originalFilename) || "";
    const baseName = path.basename(originalFilename, ext);

    // 组合最终保存文件名（可根据需要加入 name）
    const saveFilename = name ? `${baseName}-${name}${ext}` : originalFilename;

    // 确保目标目录存在
    await fse.ensureDir(TARGET_DIR_Single);

    // 目标路径
    const targetPath = path.join(TARGET_DIR_Single, saveFilename);

    // 将临时文件移动到目标路径（若需复制可用 copy）
    await fse.move(tempPath, targetPath, { overwrite: true });

    ctx.body = {
      code: 200,
      message: "文件上传成功",
      data: {
        name,
        filename: saveFilename,
        savePath: targetPath,
      },
    };
  } catch (error) {
    console.error("fileUploadSingle error:", error);
    ctx.status = 500;
    ctx.body = { code: 500, message: "文件上传失败", error: String(error) };
  }
});

router.post("/upload/fileUploadMany", async (ctx) => {
  const form = new multiparty.Form();

  const parseForm = () =>
    new Promise((resolve, reject) => {
      form.parse(ctx.req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

  try {
    const { fields, files } = await parseForm();
    const name = Array.isArray(fields?.name) ? fields.name[0] : fields?.name;
    const fileItems = Array.isArray(files?.file) ? files.file : [];

    if (fileItems.length === 0) {
      ctx.status = 400;
      ctx.body = { code: 400, message: "缺少 file 文件" };
      return;
    }

    await fse.ensureDir(TARGET_DIR_Many);

    const results = await Promise.all(
      fileItems.map(async (fileItem, index) => {
        const tempPath = fileItem.path;
        const originalFilename =
          fileItem.originalFilename || `uploaded_file_${index}`;
        const ext = path.extname(originalFilename) || "";
        const baseName = path.basename(originalFilename, ext);
        const saveFilename = name
          ? `${baseName}-${name}${ext}`
          : originalFilename;
        const targetPath = path.join(TARGET_DIR_Many, saveFilename);
        await fse.move(tempPath, targetPath, { overwrite: true });
        return { filename: saveFilename, savePath: targetPath };
      })
    );
    ctx.body = {
      code: 200,
      message: "文件上传成功",
      data: { name, files: results },
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { code: 500, message: "文件上传失败", error: String(error) };
  }
});
/**
 * 接口1：检查文件或分片是否存在（实现断点续传的关键）
 */
router.get("/upload/uploadfilebigInspect", async (ctx) => {
  const dirRaw = ctx.query.dir;
  const dir = cleanDir(dirRaw);
  if (!dir) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "缺少参数 dir" };
    return;
  }
  // 确保基础目录存在
  await fse.ensureDir(TARGET_DIR_Big);

  const chunkDir = path.join(TARGET_DIR_Big, dir);
  if (fse.existsSync(chunkDir)) {
    const files = fse.readdirSync(chunkDir);
    ctx.body = { index: files.length };
  } else {
    ctx.body = { index: 0 };
  }
});
/**
 * 接口2：上传分片
 */
router.post("/upload/uploadfilebig", async (ctx) => {
  const form = new multiparty.Form();

  const parseForm = () =>
    new Promise((resolve, reject) => {
      form.parse(ctx.req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });
  try {
    const { fields, files } = await parseForm();
    const chunk = files.file[0]; // 获取分片文件
    const dir = fields.dir[0]; // 获取文件的唯一标识 (MD5)
    const index = fields.index[0]; // 获取分片的索引

    if (!chunk || !dir || index === "") {
      ctx.status = 400;
      ctx.body = { code: 400, message: "缺少分片或参数（file/dir/index）" };
      return;
    }

    // 确保目录存在
    await fse.ensureDir(TARGET_DIR_Big);
    const chunkDir = path.join(TARGET_DIR_Big, dir);
    await fse.ensureDir(chunkDir);

    // 以 index 作为分片文件名
    const targetPath = path.join(chunkDir, index);

    await fse.move(chunk.path, targetPath, { overwrite: true });

    ctx.body = {
      code: 200,
      message: "分片上传成功",
      data: { dir, index, path: targetPath },
    };
  } catch (error) {
    console.error("uploadfilebig error:", error);
    ctx.status = 500;
    ctx.body = { code: 500, message: "分片上传失败", error: String(error) };
    return;
  }
});
router.post("/upload/uploadfilebigMerge", async (ctx) => {
  try {
    const { name, dir, ext } = ctx.request.body; //最终文件.pdf abc123def456(md5) pdf
    if (!dir || (!name && !ext)) {
      ctx.status = 400;
      ctx.body = { code: 400, message: "缺少参数：dir 与 name/ext" };
      return;
    }
    const chunkDir = path.join(TARGET_DIR_Big, dir); //../upload/fileUploadBig/abc123def456
    if (!fse.existsSync(chunkDir)) {
      ctx.status = 404;
      ctx.body = { code: 404, message: "分片目录不存在" };
      return;
    }
    const outputFilename = name ? name : `${dir}.${ext || ""}`;
    const outputPath = path.join(TARGET_DIR_Big, outputFilename); //../upload/fileUploadBig/最终文件.pdf

    // 读取分片文件列表，按数值序排序
    const chunks = (await fse.readdir(chunkDir)) //文件内部文件名为0，1，2，3.......
      .filter((f) => /^\d+$/.test(f))
      .map((f) => Number(f))
      .sort((a, b) => a - b);

    if (chunks.length === 0) {
      ctx.status = 400;
      ctx.body = { code: 400, message: "未找到任何分片" };
      return;
    }

    // 以流方式依次写入分片
    const writeStream = fse.createWriteStream(outputPath); //写入完整文件的可写流对象，指向outputPath。
    for (const idx of chunks) {
      const chunkPath = path.join(chunkDir, String(idx)); //单个分片文件的完整路径（字符串）../upload/fileUploadBig/abc123def456/0
      await new Promise((resolve, reject) => {
        const readStream = fse.createReadStream(chunkPath);
        readStream.on("error", reject);
        readStream.on("end", resolve);
        readStream.pipe(writeStream, { end: false }); //将分片内容通过管道写入writeStream，{ end: false }表示写完当前分片后不关闭writeStream（否则后续分片无法写入）。
      });
    }
    // 结束写入
    await new Promise((resolve) => writeStream.end(resolve));

    // 可选：合并成功后删除分片目录
    await fse.remove(chunkDir);

    ctx.body = {
      code: 200,
      message: "分片合并成功",
      data: { output: outputPath, count: chunks.length },
    };
  } catch (error) {
    console.error("uploadfilebigMerge error:", error);
    ctx.status = 500;
    ctx.body = { code: 500, message: "分片合并失败", error: String(error) };
  }
});
module.exports = router;
