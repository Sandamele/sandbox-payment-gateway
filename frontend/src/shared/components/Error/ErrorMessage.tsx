export const ErrorMessage = ({
  message,
  className,
}: {
  message: string;
  className?: string;
}) => {
  return (
    <div className={`text-sm text-[#E05252] ${className}`}>
      <span>{message}</span>
    </div>
  );
};
