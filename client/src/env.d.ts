/// <reference types="vite/client" />

interface ImportMetaEnv {

  //name
  VITE_NAME:string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
