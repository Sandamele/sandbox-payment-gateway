type SizeType = "sm" | "md" | "lg" | "xl" | "xl2";
type ColorType = "default" | "secondary" | "destructive";
type SpinnerProps = {
  size?: SizeType;
  color?: ColorType;
};
export const Spinner = ({ size = "sm", color = "default" }: SpinnerProps) => {
  const sizes = {
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
    xl: "size-12",
    xl2: "size-14",
  };
  const colors = {
    default: "text-[#006879]",
    secondary: "text-white",
    destructive: "text-red-600",
  };
  return (
    <div
      className={`animate-spin inline-block ${sizes[size]} border-3 border-current border-t-transparent rounded-[999px] ${colors[color]}`}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
