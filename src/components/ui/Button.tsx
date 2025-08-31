"use client";

import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className = "", children, ...rest }: ButtonProps) {
  const classes = [
  "inline-flex items-center justify-center select-none",
  "pixel-font pixel-btn",
  "text-neutral-900",
  "h-12 px-6 text-sm",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
