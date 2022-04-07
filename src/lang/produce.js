const modulesFiles = require.context("./modules", true, /\.js$/);

let En = {};
let Zh = {};

modulesFiles.keys().forEach((_path) => {
  const moduleName = _path.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(_path);
  const { en, zh } = value;
  En[moduleName] = en;
  Zh[moduleName] = zh;
});

export { En, Zh };
