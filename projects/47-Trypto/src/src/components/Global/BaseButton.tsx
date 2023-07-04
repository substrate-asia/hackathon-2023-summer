import React, { ReactChildren } from "react";

function BaseButton({
  children,
  className,
}: {
  children: ReactChildren | JSX.Element | string;
  className?: string;
}) {
  return (
    <button
      className={`bg-primary text-white text-sm py-3 lg:py-5 px-5 lg:px-10 rounded-full whitespace-nowrap ${className}`}
      onClick={() => {}}
    >
      {children}
    </button>
  );
}

export default BaseButton;
