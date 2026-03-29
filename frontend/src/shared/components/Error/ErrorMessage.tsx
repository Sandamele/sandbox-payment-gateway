export const ErrorMessage = ({
  message,
  className,
}: {
  message: string;
  className?: string;
}) => {
  return (
    <div className={`text-[12px] text-[#E05252] ${className}`}>
      <span>{message}</span>
    </div>
  );
};
