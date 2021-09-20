import React from "react";
import { Global } from "@emotion/react";
import tw, { css, GlobalStyles as BaseStyles } from "twin.macro";

const customStyles = css`
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    background-color: #e5e7eb;
    ${tw`antialiased`}
  }
`;

export default function GlobalStyles(): JSX.Element {
  return (
    <>
      <BaseStyles />
      <Global styles={customStyles} />
    </>
  );
}
