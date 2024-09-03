/// <reference types="vite/client" />

interface ImportMetaEnv {
  // App
 
  //name
  VITE_NAME:string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
