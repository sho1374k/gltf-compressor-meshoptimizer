const cp = require("child_process");
const glob = require("glob");
const gltfPack = require("gltfpack");
const fs = require("fs-extra");
const path = require("path");

const srcDir = "src";
const distDir = "dist";

const paths = {
  basisu: process.env["BASISU_PATH"],
  toktx: process.env["TOKTX_PATH"],
};

/**
 * gltfpack用インターフェース
 */
const gltfPackInterface = {
  read: (path) => {
    return fs.readFileSync(path);
  },
  write: (path, data) => {
    fs.writeFileSync(path, data);
  },
  execute: (command) => {
    // perform substitution of command executable with environment-specific paths
    const pkv = Object.entries(paths);
    for (const [k, v] of pkv) {
      if (command.startsWith(k + " ")) {
        command = v + command.substr(k.length);
        break;
      }
    }
    const ret = cp.spawnSync(command, [], { shell: true });
    return ret.status == null ? 256 : ret.status;
  },
  unlink: (path) => {
    fs.unlinkSync(path);
  },
};

/**
 * compress gltf -> glb
 * @param {string} inputPath
 * @param {string} outputPath
 * @return {Promise<string>}
 */
const packGltf = (inputPath, outputPath) => {
  const output = outputPath || inputPath.replace(".gltf", ".glb");
  const command = `-i ${inputPath} -o ${output} -cc`; // コマンドライン引数（必要に応じてオプションを追加）
  const args = command.split(/\s/g); // コマンドライン引数の配列
  return gltfPack.pack(args, gltfPackInterface).catch((err) => {
    console.log(err.message);
  });
};

/**
 * glTFをmeshoptimizer圧縮
 * @param {string | string[]} globs
 */
const compressGltfWithMeshopt = (globs) => {
  glob(globs, async (err, files) => {
    if (err) return;

    for (const file of files) {
      const filePath = path.resolve(file);
      const outFilePath = filePath
        .replace(".gltf", "-meshopt.glb")
        .replace(srcDir, distDir); // 保存先
      await fs.mkdirp(path.dirname(outFilePath)); // distディレクトリがなかったら作成
      await packGltf(filePath, outFilePath); // gltf -> glb
      console.log(`[meshopt] ${outFilePath}`);
    }
  });
};

compressGltfWithMeshopt(`./${srcDir}/**/*.gltf`);
