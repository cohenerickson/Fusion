import esbuild from "esbuild";
import express from "express";

const app = express();

const ctx = await esbuild.context({
  bundle: true,
  sourcemap: "linked",
  target: "ESNext",
  platform: "browser",
  entryPoints: { index: "./src/index.ts", example: "./src/example/index.ts" },
  outdir: "./dist/",
  format: "esm"
});

await ctx.watch();

app.use(express.static("dist"));
app.use(express.static("public"));

app.listen(3000);
