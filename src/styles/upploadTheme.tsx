import { createGlobalStyle } from 'styled-components';

import {
  black,
  brandDanger,
  brandPrimary,
  brandPrimaryHover,
  darkGray,
  lightestGray,
  textColor,
  white,
} from './color';
import { quadrupleSpacer } from './size';

/* eslint no-unused-expressions: ["error", { "allowTaggedTemplates": true }] */
const UpploadTheme = createGlobalStyle`
  .uppload-modal-bg {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 10000;
    text-align: right;
  }
  .uppload-modal-bg .uppload-close {
    font: inherit;
    border: none;
    padding: 0;
    line-height: 1;
    vertical-align: top;
    appearance: none;
    background: none;
    margin: 1rem 1.5rem;
    font-size: 200%;
    color: ${white}
  }

  .uppload-modal {
    border-radius: 0.2rem;
    width: 800px;
    height: 500px;
    display: flex;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    z-index: 12000;
  }
  .uppload-modal .uppload-help {
    display: none;
    position: absolute;
    left: 0;
    right: 0;
    text-align: right;
    top: 0;
    bottom: 0;
  }
  .uppload-modal .uppload-help.visible {
    display: block;
  }
  .uppload-modal .uppload-help iframe {
    border: none;
    width: 100%;
    height: 100%;
    background-color: ${white};
  }
  .uppload-modal .uppload-help button {
    position: absolute;
    right: 1rem;
    top: 1rem;
    z-index: 1;
    font: inherit;
    border-radius: 2rem;
    line-height: 1;
    padding: 0.75rem 1.25rem 0.75rem 1rem;
    border: none;
  }
  .uppload-modal .uppload-help button span:last-child {
    margin-left: 0.75rem;
    transform: scale(1.5) translateY(-1px);
    display: inline-block;
  }
  .uppload-modal aside {
    width: 25%;
    overflow-x: auto;
  }
  .uppload-modal aside.uppload-services--single {
    display: none;
  }
  .uppload-modal aside nav .uppload-service-name {
    position: relative;
    width: 100%;
    flex: 1 0 0;
    display: flex;
  }
  .uppload-modal aside nav .uppload-service-name input[type='radio'] {
    position: absolute;
    opacity: 0;
  }
  .uppload-modal aside nav .uppload-service-name input[type='radio']:checked + label {
    font-weight: bold;
  }
  .uppload-modal aside nav .uppload-service-name label {
    transition: 0.2s;
    display: block;
    width: 100%;
    display: flex;
    padding: 1rem;
    align-items: center;
    line-height: 1;
  }
  .uppload-modal aside nav .uppload-service-name label svg {
    margin-right: 0.75rem;
    height: 1.25rem;
    display: inline-block;
    margin-top: -0.1rem;
    vertical-align: middle;
  }
  .uppload-modal section {
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
  }
  .uppload-modal section .uppload-active-container {
    display: flex;
    flex: 1 0 0;
    padding: 1rem;
    overflow-y: auto;
    box-sizing: border-box;
  }
  .uppload-modal section .uppload-active-container .uppload-service {
    width: 100%;
    flex: 1 0 0;
  }
  .uppload-modal section .uppload-active-container footer {
    text-align: center;
    font-size: 90%;
  }
  .uppload-modal section .uppload-active-container footer a {
    color: inherit;
    text-decoration: none;
    opacity: 0.75;
  }
  .uppload-modal section .uppload-active-container footer a:hover,
  .uppload-modal section .uppload-active-container footer a:focus {
    text-decoration: underline;
  }

  .uppload-inline .uppload-modal-bg {
    position: relative;
  }
  .uppload-inline .uppload-modal-bg .uppload-close {
    display: none;
  }
  .uppload-inline .uppload-modal {
    position: static;
    box-shadow: none;
    border: 0.1rem solid rgba(0, 0, 0, 0.1);
    transform: none;
    width: 100%;
  }

  .uppload-container .uppload-help-loading {
    display: none;
    width: 100%;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .uppload-container .uppload-help-loading .uppload-loader {
    display: flex;
  }
  .uppload-container .uppload-help-loading p {
    width: 100%;
  }
  .uppload-container .uppload-help-loading.visible {
    display: flex;
  }

  .processing-loader {
    position: absolute;
    pointer-events: none;
    left: 0;
    right: 0;
    top: 0;
    bottom: 4.5rem;
    z-index: 1;
    display: none;
  }
  .processing-loader::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 40%;
    margin-left: -3.75rem;
    margin-top: -3.75rem;
    width: 7.5rem;
    height: 7.5rem;
    border-radius: 100%;
    animation: sk-scaleout 1.5s infinite ease-in-out;
  }
  .processing-loader.visible {
    display: block;
  }

  .uppload-modal p {
    margin: 0;
    margin-bottom: 1rem;
  }
  .uppload-modal p:last-child {
    margin-bottom: 0;
  }
  .uppload-modal .uppload-error {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    text-align: center;
  }
  .uppload-modal form {
    text-align: center;
    margin: 2rem 0;
  }
  .uppload-modal form input {
    width: 75%;
    border: 0.1rem solid;
  }
  .uppload-modal form input,
  .uppload-modal form button,
  .uppload-modal button.uppload-button,
  .uppload-modal .effects-continue button {
    -webkit-appearance: none;
    appearance: none;
    font: inherit;
    padding: 0.75rem 1rem;
    border-radius: 0.2rem;
    font-size: 135%;
    display: block;
    margin: 1rem auto;
    transition: 0.2s;
  }
  .uppload-modal form button,
  .uppload-modal button.uppload-button,
  .uppload-modal .effects-continue button {
    border: none;
  }
  .uppload-modal .effects-continue button {
    margin: 0 1rem;
  }
  .uppload-modal form button[type='submit']::after,
  .uppload-modal .uppload-button--cta::after,
  .uppload-modal .effects-continue--upload::after {
    content: '→';
    margin-left: 0.5rem;
  }

  .cropper-container {
    direction: ltr;
    font-size: 0;
    line-height: 0;
    position: relative;
    touch-action: none;
    user-select: none;
  }
  .cropper-container img {
    display: block;
    height: 100%;
    image-orientation: 0deg;
    max-height: none !important;
    max-width: none !important;
    min-height: 0 !important;
    min-width: 0 !important;
    width: 100%;
  }
  .cropper-wrap-box,
  .cropper-canvas,
  .cropper-drag-box,
  .cropper-crop-box,
  .cropper-modal {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }
  .cropper-wrap-box,
  .cropper-canvas {
    overflow: hidden;
  }
  .cropper-drag-box {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .cropper-view-box {
    display: block;
    height: 100%;
    outline: 1px dashed ${white};
    overflow: hidden;
    width: 100%;
  }
  .cropper-dashed.dashed-h {
    border-bottom-width: 1px;
    border-top-width: 1px;
    height: calc(100% / 3);
    left: 0;
    top: calc(100% / 3);
    width: 100%;
  }
  .cropper-dashed.dashed-v {
    border-left-width: 1px;
    border-right-width: 1px;
    height: 100%;
    left: calc(100% / 3);
    top: 0;
    width: calc(100% / 3);
  }
  .cropper-center {
    display: block;
    height: 0;
    left: 50%;
    opacity: 0.75;
    position: absolute;
    top: 50%;
    width: 0;
  }
  .cropper-center::before {
    height: 1px;
    left: -3px;
    top: 0;
    width: 7px;
  }
  .cropper-center::after {
    height: 7px;
    left: 0;
    top: -3px;
    width: 1px;
  }
  .cropper-face,
  .cropper-line,
  .cropper-point {
    display: block;
    height: 100%;
    opacity: 0.1;
    position: absolute;
    width: 100%;
  }
  .cropper-face {
    background-color: ${white};
    left: 0;
    top: 0;
  }
  .cropper-line.line-e {
    cursor: ew-resize;
    right: -3px;
    top: 0;
    width: 5px;
  }
  .cropper-line.line-n {
    cursor: ns-resize;
    height: 5px;
    left: 0;
    top: -3px;
  }
  .cropper-line.line-w {
    cursor: ew-resize;
    left: -3px;
    top: 0;
    width: 5px;
  }
  .cropper-line.line-s {
    bottom: -3px;
    cursor: ns-resize;
    height: 5px;
    left: 0;
  }
  .cropper-point {
    background-color: ${white};
    border: 1px solid ${black};
    height: 5px;
    opacity: 0.75;
    width: 5px;
  }
  .cropper-point.point-e {
    cursor: ew-resize;
    margin-top: -3px;
    right: -3px;
    top: 50%;
  }
  .cropper-point.point-n {
    cursor: ns-resize;
    left: 50%;
    margin-left: -3px;
    top: -3px;
  }
  .cropper-point.point-w {
    cursor: ew-resize;
    left: -3px;
    margin-top: -3px;
    top: 50%;
  }
  .cropper-point.point-s {
    bottom: -3px;
    cursor: s-resize;
    left: 50%;
    margin-left: -3px;
  }
  .cropper-point.point-ne {
    cursor: nesw-resize;
    right: -3px;
    top: -3px;
  }
  .cropper-point.point-nw {
    cursor: nwse-resize;
    left: -3px;
    top: -3px;
  }
  .cropper-point.point-sw {
    bottom: -3px;
    cursor: nesw-resize;
    left: -3px;
  }
  .cropper-point.point-se {
    bottom: -3px;
    cursor: nwse-resize;
    height: 20px;
    opacity: 1;
    right: -3px;
    width: 20px;
  }
  @media (min-width: 768px) {
    .cropper-point.point-se {
      height: 15px;
      width: 15px;
    }
  }
  @media (min-width: 992px) {
    .cropper-point.point-se {
      height: 10px;
      width: 10px;
    }
  }
  @media (min-width: 1200px) {
    .cropper-point.point-se {
      height: 5px;
      opacity: 0.75;
      width: 5px;
    }
  }
  .cropper-point.point-se::before {
    background-color: #39f;
    bottom: -50%;
    content: ' ';
    display: block;
    height: 200%;
    opacity: 0;
    position: absolute;
    right: -50%;
    width: 200%;
  }
  .cropper-invisible {
    opacity: 0;
  }
  .cropper-hide {
    display: block;
    height: 0;
    position: absolute;
    width: 0;
  }
  .cropper-hidden {
    display: none !important;
  }
  .cropper-move {
    cursor: move;
  }
  .cropper-crop {
    cursor: crosshair;
  }
  .cropper-disabled .cropper-drag-box,
  .cropper-disabled .cropper-face,
  .cropper-disabled .cropper-line,
  .cropper-disabled .cropper-point {
    cursor: not-allowed;
  }

  .service-icon {
    margin-bottom: 2rem;
  }
  .service-icon svg {
    width: 4rem;
    height: 4rem;
  }

  .uppload-service--uploading .uppload-loader {
    display: flex;
  }

  .uppload-service--default {
    text-align: center;
  }
  .uppload-service--default p {
    padding: 0;
    margin: 1rem 0 2rem 0;
    font-size: 150%;
  }
  .uppload-service--default .uppload-services {
    display: flex;
    flex-wrap: wrap;
  }
  .uppload-service--default .uppload-services .uppload-service-name {
    box-sizing: border-box;
    width: 22.5%;
    margin: 0 1.25% 2.5% 1.25%;
  }
  .uppload-service--default .uppload-services .uppload-service-name button {
    border: none;
    font: inherit;
    display: block;
    width: 100%;
    padding: 1.15rem 0;
    border-radius: 0.2rem;
    text-align: center;
    transition: 0.2s;
  }
  .uppload-service--default .uppload-services .uppload-service-name svg {
    display: block;
    margin: 0 auto 0.75rem auto;
    height: 2.5rem;
  }

  .uppload-service--unsplash .unsplash-images,
  .uppload-service--unsplash .pixabay-images,
  .uppload-service--unsplash .giphy-images,
  .uppload-service--unsplash .pexels-images,
  .uppload-service--unsplash .search-images,
  .uppload-service--pixabay .unsplash-images,
  .uppload-service--pixabay .pixabay-images,
  .uppload-service--pixabay .giphy-images,
  .uppload-service--pixabay .pexels-images,
  .uppload-service--pixabay .search-images,
  .uppload-service--giphy .unsplash-images,
  .uppload-service--giphy .pixabay-images,
  .uppload-service--giphy .giphy-images,
  .uppload-service--giphy .pexels-images,
  .uppload-service--giphy .search-images,
  .uppload-service--pexels .unsplash-images,
  .uppload-service--pexels .pixabay-images,
  .uppload-service--pexels .giphy-images,
  .uppload-service--pexels .pexels-images,
  .uppload-service--pexels .search-images {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .uppload-service--unsplash .unsplash-images .result,
  .uppload-service--unsplash .pixabay-images .result,
  .uppload-service--unsplash .giphy-images .result,
  .uppload-service--unsplash .pexels-images .result,
  .uppload-service--unsplash .search-images .result,
  .uppload-service--pixabay .unsplash-images .result,
  .uppload-service--pixabay .pixabay-images .result,
  .uppload-service--pixabay .giphy-images .result,
  .uppload-service--pixabay .pexels-images .result,
  .uppload-service--pixabay .search-images .result,
  .uppload-service--giphy .unsplash-images .result,
  .uppload-service--giphy .pixabay-images .result,
  .uppload-service--giphy .giphy-images .result,
  .uppload-service--giphy .pexels-images .result,
  .uppload-service--giphy .search-images .result,
  .uppload-service--pexels .unsplash-images .result,
  .uppload-service--pexels .pixabay-images .result,
  .uppload-service--pexels .giphy-images .result,
  .uppload-service--pexels .pexels-images .result,
  .uppload-service--pexels .search-images .result {
    width: 32%;
    margin-bottom: 2%;
  }
  .uppload-service--unsplash .unsplash-images .result button,
  .uppload-service--unsplash .pixabay-images .result button,
  .uppload-service--unsplash .giphy-images .result button,
  .uppload-service--unsplash .pexels-images .result button,
  .uppload-service--unsplash .search-images .result button,
  .uppload-service--pixabay .unsplash-images .result button,
  .uppload-service--pixabay .pixabay-images .result button,
  .uppload-service--pixabay .giphy-images .result button,
  .uppload-service--pixabay .pexels-images .result button,
  .uppload-service--pixabay .search-images .result button,
  .uppload-service--giphy .unsplash-images .result button,
  .uppload-service--giphy .pixabay-images .result button,
  .uppload-service--giphy .giphy-images .result button,
  .uppload-service--giphy .pexels-images .result button,
  .uppload-service--giphy .search-images .result button,
  .uppload-service--pexels .unsplash-images .result button,
  .uppload-service--pexels .pixabay-images .result button,
  .uppload-service--pexels .giphy-images .result button,
  .uppload-service--pexels .pexels-images .result button,
  .uppload-service--pexels .search-images .result button {
    display: block;
    width: 100%;
    cursor: pointer;
    border: none;
    height: 7rem;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }
  .uppload-service--unsplash .unsplash-images .author,
  .uppload-service--unsplash .pixabay-images .author,
  .uppload-service--unsplash .giphy-images .author,
  .uppload-service--unsplash .pexels-images .author,
  .uppload-service--unsplash .search-images .author,
  .uppload-service--pixabay .unsplash-images .author,
  .uppload-service--pixabay .pixabay-images .author,
  .uppload-service--pixabay .giphy-images .author,
  .uppload-service--pixabay .pexels-images .author,
  .uppload-service--pixabay .search-images .author,
  .uppload-service--giphy .unsplash-images .author,
  .uppload-service--giphy .pixabay-images .author,
  .uppload-service--giphy .giphy-images .author,
  .uppload-service--giphy .pexels-images .author,
  .uppload-service--giphy .search-images .author,
  .uppload-service--pexels .unsplash-images .author,
  .uppload-service--pexels .pixabay-images .author,
  .uppload-service--pexels .giphy-images .author,
  .uppload-service--pexels .pexels-images .author,
  .uppload-service--pexels .search-images .author {
    font-size: 85%;
    overflow-x: hidden;
    white-space: nowrap;
    display: block;
    line-height: 1;
    text-overflow: ellipsis;
    margin-top: 0.25rem;
    margin-bottom: 0.5rem;
  }
  .uppload-service--unsplash .unsplash-images .author img,
  .uppload-service--unsplash .pixabay-images .author img,
  .uppload-service--unsplash .giphy-images .author img,
  .uppload-service--unsplash .pexels-images .author img,
  .uppload-service--unsplash .search-images .author img,
  .uppload-service--pixabay .unsplash-images .author img,
  .uppload-service--pixabay .pixabay-images .author img,
  .uppload-service--pixabay .giphy-images .author img,
  .uppload-service--pixabay .pexels-images .author img,
  .uppload-service--pixabay .search-images .author img,
  .uppload-service--giphy .unsplash-images .author img,
  .uppload-service--giphy .pixabay-images .author img,
  .uppload-service--giphy .giphy-images .author img,
  .uppload-service--giphy .pexels-images .author img,
  .uppload-service--giphy .search-images .author img,
  .uppload-service--pexels .unsplash-images .author img,
  .uppload-service--pexels .pixabay-images .author img,
  .uppload-service--pexels .giphy-images .author img,
  .uppload-service--pexels .pexels-images .author img,
  .uppload-service--pexels .search-images .author img {
    vertical-align: middle;
    margin-right: 0.25rem;
    height: 1.25rem;
    width: 1.25rem;
    border-radius: 100%;
  }
  .uppload-service--unsplash .unsplash-footer,
  .uppload-service--unsplash .pixabay-footer,
  .uppload-service--unsplash .giphy-footer,
  .uppload-service--unsplash .pexels-footer,
  .uppload-service--unsplash .search-footer,
  .uppload-service--pixabay .unsplash-footer,
  .uppload-service--pixabay .pixabay-footer,
  .uppload-service--pixabay .giphy-footer,
  .uppload-service--pixabay .pexels-footer,
  .uppload-service--pixabay .search-footer,
  .uppload-service--giphy .unsplash-footer,
  .uppload-service--giphy .pixabay-footer,
  .uppload-service--giphy .giphy-footer,
  .uppload-service--giphy .pexels-footer,
  .uppload-service--giphy .search-footer,
  .uppload-service--pexels .unsplash-footer,
  .uppload-service--pexels .pixabay-footer,
  .uppload-service--pexels .giphy-footer,
  .uppload-service--pexels .pexels-footer,
  .uppload-service--pexels .search-footer {
    text-align: center;
    padding-bottom: 1.5rem;
    font-size: 90%;
    opacity: 0.75;
  }

  .filter-previews {
    overflow-x: auto;
    padding-bottom: 1rem;
  }
  .filter-previews img {
    max-width: 100%;
  }
  .filter-previews .filter-previews-scroll {
    white-space: nowrap;
  }
  .filter-previews .filter-previews-scroll > div {
    display: inline-block;
    margin-right: 0.5rem;
  }
  .filter-previews .filter-previews-scroll > div :last-child {
    margin-right: 0;
  }
  .filter-previews .filter-previews-scroll img {
    height: 220px;
  }

  .filter-previews .filter-pic {
    line-height: 1;
  }
  .filter-previews [class*='filter'] {
    position: relative;
  }
  .filter-previews [class*='filter']::before {
    display: block;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 1;
  }
  .filter-previews .filter-1977 {
    filter: sepia(0.5) hue-rotate(-30deg) saturate(1.4);
  }
  .filter-previews .filter-aden {
    filter: sepia(0.2) brightness(1.15) saturate(1.4);
  }
  .filter-previews .filter-brooklyn {
    filter: sepia(0.25) contrast(1.25) brightness(1.25) hue-rotate(5deg);
  }
  .filter-previews .filter-brooklyn::before {
    background: rgba(127, 187, 227, 0.2);
    content: '';
    mix-blend-mode: overlay;
  }
  .filter-previews .filter-inkwell {
    filter: brightness(1.25) contrast(0.85) grayscale(1);
  }
  .filter-previews .filter-poprocket {
    filter: sepia(0.15) brightness(1.2);
  }
  .filter-previews .filter-poprocket::before {
    background: radial-gradient(circle closest-corner, rgba(206, 39, 70, 0.75) 40%, black 80%);
    background: -o-radial-gradient(circle closest-corner, rgba(206, 39, 70, 0.75) 40%, black 80%);
    background: -moz-radial-gradient(circle closest-corner, rgba(206, 39, 70, 0.75) 40%, black 80%);
    content: '';
    mix-blend-mode: screen;
  }
  .filter-previews .filter-xpro-ii {
    filter: sepia(0.45) contrast(1.25) brightness(1.75) saturate(1.3) hue-rotate(-5deg);
  }
  .filter-previews .filter-xpro-ii::before {
    background: radial-gradient(
      circle closest-corner,
      rgba(0, 91, 154, 0.35) 0,
      rgba(0, 0, 0, 0.65) 100%
    );
    background: -o-radial-gradient(
      circle closest-corner,
      rgba(0, 91, 154, 0.35) 0,
      rgba(0, 0, 0, 0.65) 100%
    );
    background: -moz-radial-gradient(
      circle closest-corner,
      rgba(0, 91, 154, 0.35) 0,
      rgba(0, 0, 0, 0.65) 100%
    );
    content: '';
    mix-blend-mode: multiply;
  }

  .uppload-loader {
    height: 100%;
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .uppload-loader > div {
    width: 7.5rem;
    height: 7.5rem;
    margin-top: -2rem;
    margin-bottom: 2rem;
    border-radius: 100%;
    animation: sk-scaleout 1.5s infinite ease-in-out;
  }

  @keyframes sk-scaleout {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
  .microlink-container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .microlink-container form {
    width: 100%;
  }

  .uppload-service--local {
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .uppload-service--local .drop-area {
    flex: 1 0 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-around;
    text-align: center;
    border: 1px dashed;
    padding: 3rem;
    margin: 2rem;
    border-radius: 0.2rem;
    transition: 0.2s;
  }
  .uppload-service--local .drop-area.drop-area-active {
    transform: scale(1.05);
  }
  .uppload-service--local .drop-area > div {
    font-size: 150%;
  }
  .uppload-service--local .alternate-input {
    text-align: center;
    padding: 2rem 0;
    zoom: 1.5;
    opacity: 0.1;
    position: fixed;
    left: -100%;
  }

  .uppload-cropping-element {
    text-align: center;
  }

  .uppload-modal .service-footer button.uppload-button {
    margin: 0 0.5rem;
    display: inline-block;
  }

  .uppload-service--camera {
    display: flex;
    flex-direction: column;
  }
  .uppload-service--camera video {
    width: 100px;
  }
  .uppload-service--camera .service-main {
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
  }
  .uppload-service--camera .camera-waiting,
  .uppload-service--camera .camera-error,
  .uppload-service--camera .camera-success,
  .uppload-service--camera .service-footer {
    opacity: 0;
    transition: opacity 0.2s;
  }
  .uppload-service--camera .camera-waiting,
  .uppload-service--camera .camera-error,
  .uppload-service--camera .camera-success {
    flex: 1 0 0;
    justify-content: center;
    display: flex;
    opacity: 0;
    transition: 0.2s;
  }
  .uppload-service--camera .camera-waiting,
  .uppload-service--camera .camera-error {
    max-width: 75%;
    margin: auto;
    text-align: center;
    flex-direction: column;
  }

  .need-help-link {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    z-index: 1;
    font: inherit;
    border-radius: 2rem;
    line-height: 1;
    padding: 0.75rem 1rem;
    border: none;
    opacity: 0.75;
  }
  .need-help-link span:first-child {
    display: none;
  }
  .need-help-link span:last-child {
    transform: scale(1.35);
    display: inline-block;
  }
  .need-help-link:hover,
  .need-help-link:focus {
    opacity: 1;
  }
  .need-help-link:hover span:first-child,
  .need-help-link:focus span:first-child {
    display: inline-block;
  }
  .need-help-link:hover span:last-child,
  .need-help-link:focus span:last-child {
    display: none;
  }

  .uppload-modal .uppload-effect [type='range'] {
    -webkit-appearance: none;
    background: transparent;
    margin: 0.5rem 0;
    width: 100%;
  }
  .uppload-modal .uppload-effect [type='range']::-moz-focus-outer {
    border: 0;
  }
  .uppload-modal .uppload-effect [type='range']:focus {
    outline: 0;
  }
  .uppload-modal .uppload-effect [type='range']:focus::-webkit-slider-runnable-track {
    background: #b7b7b7;
  }
  .uppload-modal .uppload-effect [type='range']:focus::-ms-fill-lower {
    background: #aaa;
  }
  .uppload-modal .uppload-effect [type='range']:focus::-ms-fill-upper {
    background: #b7b7b7;
  }
  .uppload-modal .uppload-effect [type='range']::-webkit-slider-runnable-track {
    cursor: default;
    height: 0.25rem;
    transition: all 0.2s ease;
    width: 100%;
    background: #aaa;
    border-radius: 1rem;
  }
  .uppload-modal .uppload-effect [type='range']::-webkit-slider-thumb {
    background: ${white};
    box-shadow: 0 0.1rem 0.25rem rgba(0, 0, 0, 0.5);
    border-radius: 1rem;
    box-sizing: border-box;
    cursor: default;
    height: 1rem;
    width: 1rem;
    -webkit-appearance: none;
    margin-top: -0.375rem;
  }
  .uppload-modal .uppload-effect [type='range']::-moz-range-track {
    cursor: default;
    height: 0.25rem;
    transition: all 0.2s ease;
    width: 100%;
    background: #aaa;
    border-radius: 1rem;
    height: 0.125rem;
  }
  .uppload-modal .uppload-effect [type='range']::-moz-range-thumb {
    background: ${white};
    box-shadow: 0 0.1rem 0.25rem rgba(0, 0, 0, 0.5);
    border-radius: 1rem;
    box-sizing: border-box;
    cursor: default;
    height: 1rem;
    width: 1rem;
  }
  .uppload-modal .uppload-effect [type='range']::-ms-track {
    cursor: default;
    height: 0.25rem;
    transition: all 0.2s ease;
    width: 100%;
    background: transparent;
    border-color: transparent;
    border-width: 0.5rem 0;
    color: transparent;
  }
  .uppload-modal .uppload-effect [type='range']::-ms-fill-lower {
    background: #9d9d9d;
    border-radius: 2rem;
  }
  .uppload-modal .uppload-effect [type='range']::-ms-fill-upper {
    background: #aaa;
    border-radius: 2rem;
  }
  .uppload-modal .uppload-effect [type='range']::-ms-thumb {
    background: ${white};
    box-shadow: 0 0.1rem 0.25rem rgba(0, 0, 0, 0.5);
    border-radius: 1rem;
    box-sizing: border-box;
    cursor: default;
    height: 1rem;
    width: 1rem;
    margin-top: 0.0625rem;
  }
  .uppload-modal .uppload-effect [type='range']:disabled::-webkit-slider-thumb,
  .uppload-modal .uppload-effect [type='range']:disabled::-moz-range-thumb,
  .uppload-modal .uppload-effect [type='range']:disabled::-ms-thumb,
  .uppload-modal .uppload-effect [type='range']:disabled::-webkit-slider-runnable-track,
  .uppload-modal .uppload-effect [type='range']:disabled::-ms-fill-lower,
  .uppload-modal .uppload-effect [type='range']:disabled::-ms-fill-upper {
    cursor: not-allowed;
  }

  .uppload-container .active-effect-container {
    flex: 1 0 0;
    text-align: center;
  }
  .uppload-container .effects-continue button.uppload-button {
    display: inline-block;
    margin: 0 1rem;
  }
  .uppload-container footer.effects-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
  }
  .uppload-container footer.effects-nav .effects-tabs {
    width: 100px;
    display: flex;
    overflow-x: auto;
    flex-wrap: nowrap;
  }
  .uppload-container footer.effects-nav .effects-tabs-flow {
    display: flex;
    flex-wrap: nowrap;
    white-space: nowrap;
  }
  .uppload-container footer.effects-nav input[type='radio'] {
    position: absolute;
    opacity: 0;
  }
  .uppload-container footer.effects-nav label {
    display: block;
    padding: 0.5rem 0;
    text-align: center;
    width: 4.5rem;
    font-size: 120%;
    transition: 0.2s;
  }
  .uppload-container footer.effects-nav label span {
    font-size: 55%;
    display: block;
  }
  .uppload-container footer.effects-nav label svg {
    display: block;
    margin: 0.2rem auto;
    height: 1.25rem;
  }
  .uppload-container .uppload-effect {
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .uppload-container .uppload-effect .active-effect-container {
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .uppload-container .uppload-effect .active-effect-container > div:first-child {
    flex: 1 0 0;
  }
  .uppload-container .uppload-effect .active-effect-container .settings {
    text-align: center;
    padding: 1rem 0;
  }
  .uppload-container .uppload-effect .active-effect-container .settings button.flip-btn-horizontal,
  .uppload-container .uppload-effect .active-effect-container .settings button.flip-btn-vertical {
    font: inherit;
    border: none;
    line-height: 1;
    padding: 0.5rem 1rem;
    margin: 0 0.25rem;
    border-radius: 5rem;
  }
  .uppload-container .uppload-effect .active-effect-container .settings .value {
    display: inline-block;
    vertical-align: middle;
    margin-left: 0.5rem;
  }
  .uppload-container .uppload-effect .active-effect-container input[type='range'] {
    margin: 0 auto;
    width: 75%;
  }
  .uppload-container .uppload-preview-element {
    text-align: center;
  }
  .uppload-container .uppload-hue-image {
    text-align: center;
  }
  .uppload-container .uppload-actions {
    text-align: center;
    margin-top: 0.5rem;
  }
  .uppload-container .uppload-actions label {
    position: relative;
    display: inline-block;
    padding: 0.5rem 1rem;
    margin: 0 -0.25rem;
  }
  .uppload-container .uppload-actions label:first-of-type {
    padding-left: 1.5rem;
    border-radius: 2rem 0 0 2rem;
  }
  .uppload-container .uppload-actions label:last-of-type {
    padding-right: 1.5rem;
    border-radius: 0 2rem 2rem 0;
  }
  .uppload-container .uppload-actions input[type='radio'] {
    opacity: 0;
    position: absolute;
  }
  .uppload-container .uppload-actions input[type='radio']:checked + label {
    font-weight: bold;
  }
  .uppload-container .uppload-actions input[type='radio']:focus + label {
    z-index: 1;
  }
  .uppload-container .uppload-effect--rotate .cropper-drag-box {
    background-color: transparent;
  }

  @media (max-height: 500px) {
    .uppload-modal {
      height: 90%;
    }
  }
  @media (max-width: 850px) {
    .uppload-modal {
      transform: none;
      left: 0;
      right: 0;
      width: 90vw;
      margin: 0 auto;
      border-radius: 0;
      bottom: 0;
      height: auto;
      top: ${quadrupleSpacer};
      flex-direction: column;
    }
    .uppload-modal .uppload-service--default .uppload-services .uppload-service-name {
      width: 47.5%;
    }
    .uppload-modal aside {
      height: auto;
      width: 100%;
    }
    .uppload-modal aside .uppload-services {
      display: flex;
    }
    .uppload-modal aside nav .uppload-service-name label {
      white-space: nowrap;
    }
    .uppload-modal footer.effects-nav {
      flex-direction: column;
      padding: 1rem 0;
    }
    .uppload-modal footer.effects-nav .effects-tabs {
      width: 100% !important;
      margin: 1rem 0 !important;
    }
    .uppload-modal .effects-continue {
      width: 90%;
    }
    .uppload-modal .effects-continue button {
      margin: 0 !important;
      width: 100%;
      box-sizing: border-box;
    }
    .uppload-modal section .uppload-active-container footer button {
      display: block !important;
      margin: 0.5rem 0 0 0 !important;
      width: 100%;
      box-sizing: border-box;
    }
  }

  .uppload-container {
    display: none;
  }
  .uppload-container.visible {
    display: block;
  }

  /**
 * Light theme (default)
 */
/**
 * All variables
 */
.uppload-modal-bg {
  background-color: rgba(0, 0, 0, 0.85);
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}

.uppload-modal {
  background-color: ${white};
  color: ${textColor};
  box-shadow: 0 5rem 10rem rgba(0, 0, 0, 0.3);
}
.uppload-modal .uppload-help {
  background-color: ${white};
  color: ${textColor};
}
.uppload-modal .need-help-link,
.uppload-modal .uppload-help button {
  background-color: ${lightestGray};
  color: inherit;
}
.uppload-modal a {
  color: inherit;
}
.uppload-modal aside {
  background-color: ${lightestGray};
  color: inherit;
}
.uppload-modal aside nav .uppload-service-name input[type=radio]:checked + label {
  background-color: ${white};
  color: inherit;
}
.uppload-modal aside nav .uppload-service-name input[type=radio]:checked + label:hover, .uppload-modal aside nav .uppload-service-name input[type=radio]:checked + label:focus {
  background-color: ${white};
}
.uppload-modal aside nav .uppload-service-name input[type=radio]:focus + label {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
.uppload-modal aside nav .uppload-service-name input[type=radio] + label:hover,
.uppload-modal aside nav .uppload-service-name input[type=radio] + label:focus {
  background-color: ${lightestGray};
}
.uppload-modal .uppload-error {
  background-color: ${brandDanger};
  color: ${white};
}
.uppload-modal form input {
  border-color: rgba(0, 0, 0, 0.1);
}
.uppload-modal form button,
.uppload-modal .uppload-button {
  background-color: ${brandPrimary};
  color: ${white};
}
.uppload-modal .effects-continue button {
  background-color: ${lightestGray};
  color: inherit;
}
.uppload-modal .effects-continue button:hover, .uppload-modal .effects-continue button:focus {
  background-color: ${white}
}
.uppload-modal .effects-continue button.effects-continue--upload {
  background-color: ${brandPrimary};
  color: ${white};
}
.uppload-modal .effects-continue button.effects-continue--upload:hover, .uppload-modal .effects-continue button.effects-continue--upload:focus {
  background-color: ${brandPrimaryHover};
}
.uppload-modal footer.effects-nav {
  background-color: ${lightestGray};
  color: inherit;
}
.uppload-modal footer.effects-nav label svg g,
.uppload-modal footer.effects-nav label svg path {
  fill: inherit;
}
.uppload-modal footer.effects-nav input[type=radio]:focus + label {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
.uppload-modal footer.effects-nav label:hover,
.uppload-modal footer.effects-nav label:focus {
  background-color: ${lightestGray};
}
.uppload-modal footer.effects-nav input[type=radio]:checked + label {
  background-color: ${white};
  color: inherit;
}
.uppload-modal .uppload-service--default .uppload-services button {
  background-color: ${lightestGray};
  color: inherit;
}
.uppload-modal .uppload-service--default .uppload-services button:hover, .uppload-modal .uppload-service--default .uppload-services button:focus {
  background-color: ${lightestGray};
  color: inherit;
}
.uppload-modal .uppload-service--local .drop-area {
  border: 3px dashed rgba(0, 0, 0, 0.1);
  background-color: transparent;
  color: inherit;
}
.uppload-modal .uppload-service--local .drop-area.drop-area-active {
  border: 3px dashed rgba(0, 0, 0, 0.25);
  background-color: ${lightestGray};
  color: inherit;
}
.uppload-modal .uppload-loader > div {
  background-color: ${darkGray};
}
.uppload-modal .uppload-effect--crop .uppload-actions input[type=radio]:focus + label {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
.uppload-modal .uppload-actions label,
.uppload-modal .settings button {
  background-color: ${lightestGray};
  color: inherit;
}
.uppload-modal .processing-loader {
  background-color: rgba(255, 255, 255, 0.5);
}
.uppload-modal .processing-loader::after {
  background-color: ${white};
}
`;

export default UpploadTheme;
