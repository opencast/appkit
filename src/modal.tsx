import {
  PropsWithChildren,
  forwardRef,
  useState,
  useImperativeHandle,
  useEffect,
} from "react";
import ReactDOM from "react-dom";
import { LuX } from "react-icons/lu";
import FocusTrap from "focus-trap-react";
import {
  useAppkitConfig, ProtoButton, focusStyle, useColorScheme,
} from ".";

export type ModalProps = {
  title: string;
  closable?: boolean;
  className?: string;
  closeOnOutsideClick?: boolean;
  open?: boolean;
  initialFocus?: false;
  text: {
    close: string,
  },
};

export type ModalHandle = {
  open: () => void;
  close?: () => void;
  isOpen?: () => boolean;
};

export const Modal = forwardRef<ModalHandle, PropsWithChildren<ModalProps>>(({
  title,
  closable = true,
  children,
  className,
  closeOnOutsideClick = false,
  open = false,
  initialFocus,
  text,
}, ref) => {
  const config = useAppkitConfig();
  const [isOpen, setOpen] = useState(open);
  const isDark = useColorScheme().scheme === "dark";

  useImperativeHandle(ref, () => ({
    isOpen: () => isOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
  }), [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (closable && event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [closable]);

  return ReactDOM.createPortal(
    isOpen && <FocusTrap focusTrapOptions={{ initialFocus }}>
      <div
        {...(closable && closeOnOutsideClick && { onClick: e => {
          if (e.target === e.currentTarget) {
            setOpen(false);
          }
        } })}
        css={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10001,
        }}
      >
        <div {...{ className }} css={{
          backgroundColor: config.colors.neutral05,
          borderRadius: 4,
          minWidth: "clamp(300px, 90%, 400px)",
          margin: 16,
          ...isDark && {
            border: `1px solid ${config.colors.neutral25}`,
          },
        }}>
          <div css={{
            padding: "12px 16px",
            borderBottom: `1px solid ${config.colors.neutral25}`,
            display: "flex",
            alignItems: "center",
          }}>
            <h2 css={{ flex: 1 }}>{title}</h2>
            {closable && <ProtoButton
              aria-label={text.close}
              tabIndex={0}
              onClick={() => setOpen(false)}
              css={{
                fontSize: 32,
                cursor: "pointer",
                display: "inline-flex",
                borderRadius: 4,
                ...focusStyle(config),
              }}
            ><LuX /></ProtoButton>}
          </div>
          <div css={{ padding: 16 }}>{children}</div>
        </div>
      </div>
    </FocusTrap>,
    document.body,
  );
});
