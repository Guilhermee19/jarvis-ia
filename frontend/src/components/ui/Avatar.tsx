/**
 * Avatar Component
 * Avatar para usuário e assistente
 */
import { type ImgHTMLAttributes } from "react";

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy" | "away";
  name?: string;
}

export default function Avatar({
  size = "md",
  status,
  name,
  src,
  alt,
  className = "",
  ...props
}: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const statusColors = {
    online: "bg-success",
    offline: "bg-gray-500",
    busy: "bg-error",
    away: "bg-warning",
  };

  const statusSize = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
  };

  // Gerar iniciais se não houver imagem
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-primary/50 ${className}`}
          {...props}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold border-2 border-primary/50 ${className}`}
        >
          {name ? getInitials(name) : "?"}
        </div>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 ${statusSize[size]} ${statusColors[status]} rounded-full border-2 border-dark ${status === "online" ? "animate-pulse" : ""}`}
        />
      )}
    </div>
  );
}
