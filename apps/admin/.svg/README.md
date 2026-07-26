### Introduction

- This folder holds the svg icons which are added by developers.

- Svg icon usage: `<WIcon icon="w-svg:your-svg-file-name" />`.

- This folder will not be bundle into final output, so add whatever svg icons you like here.

- Once add new svg icons in this folder, run `npm run gen:icon:svg` to generate `iconify` json structure data into `src/component/UI/Icon/src/utils/svg.json`. Not support recursive folder in `.svg` yet.(using svg file name as icon name)

- Notice that extra svg files in this folder, which are not used in this project(specific used under `vue,ts,tsx` files `src`) will not be bundled into the final output either.(using the same bundle logic that `iconify` provided to bundle `iconify/jsons`).

- Temporarily only support offline usage.
