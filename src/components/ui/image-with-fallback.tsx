import { useState, useEffect } from "react";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | null;
  fallbackSrc?: string;
  containerClassName?: string;
}

export function ImageWithFallback({
  src,
  fallbackSrc = "/placeholder.svg",
  alt,
  containerClassName,
  className,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setIsError(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!isError) {
      setIsError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <div className={`relative overflow-hidden ${containerClassName || ''}`}>
      <img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        className={`w-full h-full object-cover ${className || ''}`}
        {...props}
      />
    </div>
  );
}