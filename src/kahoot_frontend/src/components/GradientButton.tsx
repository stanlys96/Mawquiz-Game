import { ReactElement } from "react";

interface Props {
  text: string;
  gradient: string;
  onClick: () => void;
  className?: string;
  textColor?: string;
  icon?: ReactElement;
}

export const GradientButton = ({
  text,
  gradient,
  onClick,
  className,
  textColor = "#fff",
  icon,
}: Props) => {
  return (
    <button
      style={{
        background: gradient,
        border: "none",
        borderRadius: "12px",
        padding: "12px 24px",
        color: textColor,
        fontWeight: "bold",
        fontSize: "16px",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
      onMouseEnter={(e: any) => (e.target.style.transform = "scale(1.1)")}
      onMouseLeave={(e: any) => (e.target.style.transform = "scale(1)")}
      onClick={onClick}
      className={className}
    >
      {icon}
      {text}
    </button>
  );
};
