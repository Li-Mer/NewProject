const multiparty = require("multiparty");
const path = require("path");
const fse = require("fs-extra");

// 定义上传文件的根目录
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

module.exports = function (app) {
  // app.get("/", (req, res) => {
  //   res.render("index", { title: "Home Page" });
  // });
  /**
   * 接口1：检查文件或分片是否存在（实现断点续传的关键）
   */
  app.get("/upload/uploadfilebigInspect", (req, res) => {
    const { dir } = req.query; // 从前端获取文件的唯一标识 (MD5)
    const chunkDir = path.join(UPLOAD_DIR, dir); // 拼接出分片存储目录的路径

    // 检查分片目录是否存在
    if (fse.existsSync(chunkDir)) {
      // 如果目录存在，读取目录下的所有文件（即已上传的分片）
      const files = fse.readdirSync(chunkDir);
      // 返回已上传分片的数量，前端可以此为断点继续上传
      res.status(200).json({ index: files.length });
    } else {
      // 如果目录不存在，说明是首次上传，从索引0开始
      res.status(200).json({ index: 0 });
    }
  });

  /**
   * 接口2：上传分片
   */
  app.post("/upload/uploadfilebig", (req, res) => {
    const form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(500).json({ message: "分片上传失败", error: err });
        return;
      }

      // 注意：前端 formData.append('file', blobFile) 对应这里的 files.file
      const chunk = files.file[0]; // 获取分片文件
      const dir = fields.dir[0]; // 获取文件的唯一标识 (MD5)
      const index = fields.index[0]; // 获取分片的索引

      // 确保以MD5命名的分片目录存在
      const chunkDir = path.join(UPLOAD_DIR, dir);
      fse.ensureDirSync(chunkDir);

      // 将分片文件从临时目录移动到我们的分片目录下，并以索引命名
      const destPath = path.join(chunkDir, index);
      fse.moveSync(chunk.path, destPath, { overwrite: true });

      res.status(200).json({ message: "分片上传成功" });
    });
  });

  /**
   * 接口3：合并所有分片
   */
  app.post("/upload/uploadfilebigMerge", async (req, res) => {
    // 从请求体中获取文件名、MD5和扩展名
    const { name, dir, ext } = req.body;
    const chunkDir = path.join(UPLOAD_DIR, dir); // 分片存储目录
    const finalFilePath = path.join(UPLOAD_DIR, `${dir}.${ext}`); // 最终合并后的文件路径

    try {
      // 1. 读取分片目录下的所有分片文件名
      const chunks = await fse.readdir(chunkDir);
      // 2. 将分片文件名按数字大小排序（'1', '2', '10' -> 1, 2, 10）
      chunks.sort((a, b) => a - b);

      // 3. 逐个读取分片并追加写入到最终文件中
      for (const chunkName of chunks) {
        const chunkPath = path.join(chunkDir, chunkName);
        const chunkContent = await fse.readFile(chunkPath);
        await fse.appendFile(finalFilePath, chunkContent);
      }

      // 4. 合并成功后，删除临时分片目录
      await fse.remove(chunkDir);

      res
        .status(200)
        .json({ message: "文件合并成功", filePath: finalFilePath });
    } catch (error) {
      console.error("合并文件时出错:", error);
      res.status(500).json({ message: "文件合并失败", error });
    }
  });
  /**
   * 接口4:获取虚拟列表数据
   */
  app.get("/api/getVirtualList", (req, res) => {
    const listData = [
      ...Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        value: `这是第${i}条数据`,
      })),
    ];
    res.status(200).json({ data: listData });
  });
};
