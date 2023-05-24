# glTF Compressor

## 🖊️ ~ Overview

This repository compresses glTF files exported from cg software (Blender, etc.) into glb files.

## 🎮 ~ Getting Started

- node: v.17.0.0
- npm: 8.1.0

※ Operation confirmed version

```
// install
npm i

// compressor
npm run meshopt
```

## 🤓 ~ How to use

1. Place the gltf file in `/src/`.

2. run `npm run meshopt`

3. If you have a zipped glb file inside the `/dist/` you are done

## 🌏 ~ Three.js

- Confirmed to work with three.js r148

```js
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);

async function init() {
  const glb = loader.loadAsync("./hoge-meshopt.glb");
  const model = glb.scene;
  scene.add(model);
}
```

## 🏠 ~ Repository structure

```
/
├── dist/
│   └── hoge-meshopt.glb // compressed glb file
├── node_modules/
├── src/
│   └── hoge.gltf // before compression
├── .gitignore
├── compress-meshopt.js
├── package-lock.json
├── package.json
└── Readme.md
```

## 📝 ~ Note

### [glTF Viewer](https://gltf-viewer.donmccurdy.com/)

This is a site where you can check if the glb and gltf files are displayed correctly on the web.

### Package

- [gltfpack](https://www.npmjs.com/package/gltfpack)

### Reference Site

- [Node.js で glTF モデルを圧縮して three.js で読み込む（DRACO/meshoptimizer）](https://qiita.com/watabo_shi/items/ba6c76f4158f827f69ed)
