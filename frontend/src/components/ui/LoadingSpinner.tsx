/**
 * LoadingSpinner Component
 * Indicador de carregamento animado
 */
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  variant?: "primary" | "secondary" | "white";
}

export default function LoadingSpinner({
  size = "md",
  text,
  variant = "primary",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const colorClasses = {
    primary: "border-primary",
    secondary: "border-secondary",
    white: "border-white",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-4 ${colorClasses[variant]} border-t-transparent rounded-full animate-spin`}
        />
        <div
          className={`absolute inset-0 ${sizeClasses[size]} border-4 ${colorClasses[variant]} opacity-20 rounded-full animate-pulse`}
        />
      </div>

      {text && <p className="text-gray-400 text-sm animate-pulse">{text}</p>}
    </div>
  );
}
