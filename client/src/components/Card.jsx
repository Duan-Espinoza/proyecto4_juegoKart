import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`mt-2 ${className}`}>{children}</div>;
}
