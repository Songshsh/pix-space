import{N as n,J as s,ac as a,ad as c}from"./index-Dkvsmb7X.js";import{p as i,y as u,u as d}from"./vue-vendor-D49WNW7f.js";const t={prefix:Math.floor(Math.random()*1e4),current:0},m=Symbol("elIdInjection"),I=()=>i()?u(m,t):t,y=o=>{const e=I();!n&&e===t&&s("IdInjection",`Looks like you are using server rendering, you must provide a id provider to ensure the hydration process to be succeed
usage: app.provide(ID_INJECTION_KEY, {
  prefix: number,
  current: number,
})`);const r=a();return c(()=>d(o)||`${r.value}-id-${e.prefix}-${e.current++}`)},l=Symbol("formContextKey"),b=Symbol("formItemContextKey");export{I as a,b,l as f,y as u};
