import React from 'react';
import { createGlobalStyle, css } from 'styled-components';
import { renderToStaticMarkup as rtsm } from 'react-dom/server';
import { FaExternalLinkAlt } from 'react-icons/fa';

import {
  brandPrimary,
  brandPrimaryHover,
  textColor,
  headingsColor,
  lightGray,
  white,
  brandSecondary,
} from './color';
import topo from '../images/topo.png';

import { baseSpacer, halfSpacer, quarterSpacer } from '@styles/size';
import { headingsFontFamily, fontFamilySansSerif } from '@styles/typography';

const externalLinkIcon = css`
  ${rtsm(<FaExternalLinkAlt color="darkgray" size={12} />).replace(/"/g, "'")}
`;

/* eslint no-unused-expressions: ["error", { "allowTaggedTemplates": true }] */
const CssReset = createGlobalStyle`
  html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}
  body{margin:0}
  article,aside,details,figcaption,figure,footer,header,main,menu,nav,section,summary{display:block}
  audio,canvas,progress,video{display:inline-block;vertical-align:baseline}
  audio:not([controls]){display:none;height:0}[hidden],template{display:none}
  a{background-color:transparent}
  a{&:active{outline:0}&:hover{outline:0}}
  abbr[title]{border-bottom:1px dotted}
  b,strong{font-weight:bold}
  dfn{font-style:italic}
  h1{font-size:2em;margin:0.67em 0}
  mark{background:#ff0;color:#000}
  small{font-size:80%}
  sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}
  sup{top:-0.5em}
  sub{bottom:-0.25em}
  img{border:0}
  svg:not(:root){overflow:hidden}
  figure{margin:1em 40px}
  hr{box-sizing:content-box;height:0}
  pre{overflow:auto}
  code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}
  button,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0}
  button{overflow:visible}
  button,select{text-transform:none}
  button,html input[type="button"],input[type="reset"],input[type="submit"]{-webkit-appearance:button;cursor:pointer}
  button[disabled],html input[disabled]{cursor:not-allowed}
  button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0}
  form {width: 100%}
  input{line-height:normal}
  input[type="text"],input[type="password"],input[type="email"],input[type="url"],textarea{appearance:none}
  input[type="checkbox"],input[type="radio"]{box-sizing:border-box;padding:0}
  input[type="number"]{-moz-appearance: textfield;}
  input[type="number"]::-webkit-inner-spin-button,input[type="number"]::-webkit-outer-spin-button{height:auto;-webkit-appearance:none;margin: 0;}
  input[type="search"]{-webkit-appearance:textfield}
  input[type="search"]::-webkit-search-cancel-button,input[type="search"]::-webkit-search-decoration{-webkit-appearance:none}
  fieldset{border:1px solid #c0c0c0;margin:0 2px;padding:0.35em 0.625em 0.75em}
  legend{border:0;padding:0}
  textarea{overflow:auto}
  optgroup{font-weight:bold}
  table{border-collapse:collapse;border-spacing:0}
  td,th{padding:0}
  html{box-sizing:border-box;height:100%}*,*:before,*:after{box-sizing:inherit}
  @at-root{@-moz-viewport{width:device-width}
  @-ms-viewport{width:device-width}
  @-o-viewport{width:device-width}
  @-webkit-viewport{width:device-width}
  @viewport{width:device-width}}

  html {
    font-size: 16px;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    background-color: ${brandSecondary};
  }

  body {
    font-family: ${fontFamilySansSerif};
    /* https://www.codementor.io/@ricardozea/100-responsive-typography-system-using-a-modular-scale-s5rhft58g */
    font-size: calc(16px + .35vw); /* Responsive base font size */
    line-height: calc(16px + 1.05vw); /* Responsive Vertical Rhythm */
    color: ${textColor};
    overflow-x: hidden;
    background-color: ${white};
    background-image: url('${topo}');
    background-size: 500px;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: ${halfSpacer};
    color: ${headingsColor};
    font-family: ${headingsFontFamily};
  }

  p {
    margin-top: 0;
    margin-bottom: ${baseSpacer};
  }

  abbr[title] {
    cursor: help;
    border-bottom: 1px dotted ${lightGray};
  }

  address {
    margin-bottom: ${baseSpacer};
    font-style: normal;
    line-height: inherit;
  }

  ol,
  ul {
    margin-top: 0;
    margin-bottom: ${baseSpacer};
    padding-left: ${baseSpacer};
  }

  ol ol,
  ul ul,
  ol ul,
  ul ol {
    margin-bottom: 0;
  }

  dl {
    margin-top: 0;
    margin-bottom: ${baseSpacer};
    padding-left: 0;
  }

  dt {
    font-weight: bold;
  }

  dd {
    margin-bottom: ${halfSpacer};
    margin-left: 0;
  }

  blockquote {
    margin: 0 0 ${baseSpacer};
  }

  a {
    color: ${brandPrimary};
    text-decoration: none;

    &:hover,
    &:focus {
      color: ${brandPrimaryHover};
      text-decoration: none;
    }

    &:focus {
      outline: thin dotted;
      outline: 1px dotted ${brandPrimaryHover};
      outline-offset: -2px;
      text-decoration: none;
    }

    &:active {
      opacity: .8;
    }
  }

  pre {
    margin-top: 0;
    margin-bottom: ${baseSpacer};
  }

  figure {
    margin: 0 0 ${baseSpacer};
  }

  img {
    vertical-align: middle;
    max-width: 100%;
    height: auto;
  }

  [role="button"] {
    cursor: pointer;
  }

  table {
    background-color: white;
  }

  caption {
    padding-top: .75rem;
    padding-bottom: .75rem;
    color: ${lightGray};
    text-align: left;
    caption-side: bottom;
  }

  th {
    text-align: left;
  }

  label {
    display: block;
    margin-bottom: ${halfSpacer};
  }

  input,
  button,
  select,
  textarea {
    margin: 0;
    line-height: inherit;
  }

  textarea {
    resize: vertical;
  }

  fieldset {
    min-width: 0;
    padding: 0;
    margin: 0;
    border: 0;
  }

  legend {
    display: block;
    width: 100%;
    padding: 0;
    margin-bottom: ${halfSpacer};
    font-size: 1.5rem;
    line-height: inherit;
  }

  input[type="search"] {
    -webkit-appearance: none;
  }

  input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px white inset;
  }

  ::-moz-selection {
      color: ${white};
      background: ${brandPrimary};
  }

  ::selection {
      color: ${white};
      background: ${brandPrimary};
  }

  :-ms-input-placeholder {
      color: ${lightGray};
  }

  ::-ms-input-placeholder {
      color: ${lightGray};
  }

  ::placeholder {
      color: ${lightGray};
      opacity: 1; /* Firefox */
  }
  .accordion *:focus {
    outline: none;
  }

  .instagram-media {
    margin: 0 auto !important;
  }

  /* https://github.com/react-icons/react-icons/issues/246#issuecomment-667147241 */
  /* add svg icon from react-icons to external links in blogs */
  .blog-content a[target="_blank"]:after {
    content: url("data:image/svg+xml; utf8,${externalLinkIcon}");
    margin-left: ${quarterSpacer};
  }
`;

export default CssReset;
