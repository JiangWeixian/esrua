# esrua
*run function in script*

[![npm](https://img.shields.io/npm/v/esrua)](https://github.com/JiangWeixian/esrua/tree/master) [![GitHub](https://img.shields.io/npm/l/esrua)](https://github.com/JiangWeixian/esrua/tree/master)


## usage

```console
pnpm add esrua -g
```

## features

if `index.ts` contain

```ts
export const welcome = (msg: string) => {
  console.log(`hello ${msg}`)
}
```

run `esrua welcome -p world`, also specify filepath like `esrua <filepath> welcome -p world`

## development

- **Setup** - `pnpm i`
- **Build** - `pnpm build`

# 
<div align='right'>

*built with ❤️ by 😼*

</div>