"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface ProductImage3DProps {
  images: string[];
  alt: string;
  className?: string;
  enableRotation?: boolean;
  enableZoom?: boolean;
  compact?: boolean;
}

export function ProductImage3D({
  images,
  alt,
  className = "",
  enableRotation = true,
  enableZoom = true,
  compact = false,
}: ProductImage3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 30 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [compact ? 8 : 12, compact ? -8 : -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [compact ? -8 : -12, compact ? 8 : 12]), springConfig);
  const scale = useSpring(useTransform(mouseY, [-0.5, 0.5], [1, 1.05]), springConfig);

  const glowX = useTransform(mouseX, [-0.5, 0.5], ["30%", "70%"]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], ["30%", "70%"]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current || !enableRotation) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY, enableRotation]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  const handleImageError = (index: number) => {
    setImageError((prev) => ({ ...prev, [index]: true }));
  };

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, nextImage, prevImage]);

  const currentImage = images[currentImageIndex] || images[0];
  const hasMultipleImages = images.length > 1;
  const hasError = imageError[currentImageIndex];

  return (
    <>
      <motion.div
        ref={containerRef}
        className={`relative rounded-2xl bg-transparent ${className}`}
        style={{ perspective: 1000, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="relative w-full h-full flex items-center justify-center p-3"
          style={{
            rotateX: enableRotation ? rotateX : 0,
            rotateY: enableRotation ? rotateY : 0,
            scale: enableRotation ? scale : 1,
            transformStyle: "preserve-3d",
          }}
        >
          {enableRotation && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: useTransform(
                  [glowX, glowY],
                  ([x, y]) => `radial-gradient(600px circle at ${x} ${y}, rgba(8,145,178,0.12), transparent 50%)`
                ),
                opacity: isHovered ? 1 : 0,
              }}
            />
          )}

          {!hasError ? (
            <motion.div
              className="relative z-0"
              animate={{ y: isHovered ? -6 : 0, scale: isHovered ? 1.05 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Image
                src={currentImage}
                alt={`${alt} - View ${currentImageIndex + 1}`}
                width={compact ? 200 : 300}
                height={compact ? 150 : 220}
                className="object-contain drop-shadow-2xl"
                onError={() => handleImageError(currentImageIndex)}
                priority={currentImageIndex === 0}
              />
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 z-0">
              <div className="w-20 h-20 rounded-full bg-jet-primary/10 flex items-center justify-center border border-jet-primary/20">
                <span className="text-3xl font-bold text-jet-primary">{alt.charAt(0)}</span>
              </div>
              <p className="text-xs text-jet-text-muted text-center px-4">Image unavailable</p>
            </div>
          )}

          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/10 rounded-full blur-xl"
            animate={{ scale: isHovered ? 0.8 : 1, opacity: isHovered ? 0.3 : 0.15 }}
            style={{ transform: "translateZ(-10px)" }}
          />
        </motion.div>

        {hasMultipleImages && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-jet-bg-card/90 backdrop-blur-sm border border-jet-border flex items-center justify-center text-jet-text hover:bg-jet-primary hover:text-white transition-all z-20"
              style={{ opacity: isHovered ? 1 : 0 }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-jet-bg-card/90 backdrop-blur-sm border border-jet-border flex items-center justify-center text-jet-text hover:bg-jet-primary hover:text-white transition-all z-20"
              style={{ opacity: isHovered ? 1 : 0 }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {hasMultipleImages && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentImageIndex ? "bg-jet-primary w-4" : "bg-jet-text-muted/40 hover:bg-jet-text-muted/60"
                }`}
              />
            ))}
          </div>
        )}

        {enableZoom && (
          <button
            onClick={(e) => { e.stopPropagation(); setIsFullscreen(true); }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-jet-bg-card/90 backdrop-blur-sm border border-jet-border flex items-center justify-center text-jet-text hover:bg-jet-primary hover:text-white transition-all z-20"
            style={{ opacity: isHovered ? 1 : 0 }}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}

        {enableRotation && (
          <motion.div
            className="absolute top-3 left-3 px-2 py-1 bg-jet-primary/10 text-jet-primary text-[10px] font-bold rounded-full border border-jet-primary/20 z-20 backdrop-blur-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
            transition={{ duration: 0.2 }}
          >
            3D View
          </motion.div>
        )}
      </motion.div>

      {isFullscreen && (
        <motion.div
          className="fixed inset-0 z-50 bg-jet-bg/95 backdrop-blur-xl flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-jet-bg-card border border-jet-border flex items-center justify-center text-jet-text hover:bg-jet-primary hover:text-white transition-all"
          >
            ✕
          </button>

          <div className="relative max-w-4xl max-h-[80vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {!hasError ? (
              <Image
                src={currentImage}
                alt={alt}
                width={800}
                height={600}
                className="object-contain max-h-[70vh] w-auto drop-shadow-2xl"
                onError={() => handleImageError(currentImageIndex)}
              />
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-jet-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-bold text-jet-primary">{alt.charAt(0)}</span>
                </div>
                <p className="text-jet-text-muted">Image unavailable</p>
              </div>
            )}
          </div>

          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-jet-bg-card/90 backdrop-blur-sm border border-jet-border flex items-center justify-center text-jet-text hover:bg-jet-primary hover:text-white transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-jet-bg-card/90 backdrop-blur-sm border border-jet-border flex items-center justify-center text-jet-text hover:bg-jet-primary hover:text-white transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i === currentImageIndex ? "bg-jet-primary w-6" : "bg-jet-text-muted/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-jet-text-muted text-sm">
            {currentImageIndex + 1} / {images.length} — Press ESC to close
          </p>
        </motion.div>
      )}
    </>
  );
}