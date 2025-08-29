import type { DOMKeyframesDefinition, Transition } from "motion/react";
import type { ComponentProps, JSX, Ref } from "solid-js";
import { Motion, Presence } from "solid-motion";

type MotionEffectProps = ComponentProps<"div"> & {
  ref?: Ref<HTMLDivElement>;
  children: JSX.Element;
  class?: string;
  transition?: Transition;
  delay?: number;
  blur?: string | boolean;
  slide?:
    | {
        direction?: "up" | "down" | "left" | "right";
        offset?: number;
      }
    | boolean;
  fade?: { initialOpacity?: number; opacity?: number } | boolean;
  zoom?:
    | {
        initialScale?: number;
        scale?: number;
      }
    | boolean;
};

function MotionEffect(props: MotionEffectProps) {
  const { delay = 0, blur = false, slide = false, fade = false, zoom = false } = props;

  const hiddenVariant: DOMKeyframesDefinition = {};
  const visibleVariant: DOMKeyframesDefinition = {};

  if (slide) {
    const offset = typeof slide === "boolean" ? 100 : (slide.offset ?? 100);
    const direction = typeof slide === "boolean" ? "left" : (slide.direction ?? "left");
    const axis = direction === "up" || direction === "down" ? "y" : "x";
    hiddenVariant[axis] = direction === "left" || direction === "up" ? -offset : offset;
    visibleVariant[axis] = 0;
  }

  if (fade) {
    hiddenVariant.opacity = typeof fade === "boolean" ? 0 : (fade.initialOpacity ?? 0);
    visibleVariant.opacity = typeof fade === "boolean" ? 1 : (fade.opacity ?? 1);
  }

  if (zoom) {
    hiddenVariant.scale = typeof zoom === "boolean" ? 0.5 : (zoom.initialScale ?? 0.5);
    visibleVariant.scale = typeof zoom === "boolean" ? 1 : (zoom.scale ?? 1);
  }

  if (blur) {
    hiddenVariant.filter = typeof blur === "boolean" ? "blur(10px)" : `blur(${blur})`;
    visibleVariant.filter = "blur(0px)";
  }

  return (
    <Presence>
      <Motion
        animate={visibleVariant}
        class={props.class}
        data-slot="motion-effect"
        exit={hiddenVariant}
        initial={hiddenVariant}
        ref={props.ref}
        transition={{
          ...props.transition,
          delay: (props.transition?.delay ?? 0) + delay,
        }}
      >
        {props.children}
      </Motion>
    </Presence>
  );
}

export { MotionEffect, type MotionEffectProps };
