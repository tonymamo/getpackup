declare module 'typewriter-effect' {
  import * as React from 'react';

  export interface Options {
    strings: Array<string>;
    cursor?: string;
    delay?: 'natural' | number;
    deleteSpeed?: 'natural' | number;
    loop?: boolean;
    autoStart?: boolean;
    devMode?: boolean;
    wrapperClassName?: string;
    cursorClassName?: string;
  }

  function Typewriter(props: { options?: Options }): JSX.Element;

  export default Typewriter;
}
