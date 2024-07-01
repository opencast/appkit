import {
  ReactNode,
  FormEvent,
  PropsWithChildren,
  forwardRef,
  useState,
  useRef,
  useImperativeHandle,
} from "react";
import { ModalProps, ModalHandle, Modal, Spinner, Button, boxError } from ".";
import { currentRef } from "./util";


export type ConfirmationModalProps = Omit<ModalProps, "closable" | "title"> & {
  title?: string;
  /** What to display in the confirm button. A string can be enough. */
  buttonContent: ReactNode;
  onSubmit?: () => void;
  /** Strings that will be displayed in the UI */
  text: {
    /** Text on the button to cancel the modal */
    cancel: string,
    /** Text on the button to close the modal */
    close: string,
    /** Text asking the question that should be confirmed or cancelled. */
    areYouSure: string,
  },
};

/**
 * A component that sits in the middle of the screen, darkens the rest of the
 * screen and traps user focus. Also asks for confirmation, and closing can
 * be delayed if a time intensive action was triggered.
 */
export type ConfirmationModalHandle = ModalHandle & {
  done: () => void;
  reportError: (error: JSX.Element) => void;
};

export const ConfirmationModal
  = forwardRef<ConfirmationModalHandle, PropsWithChildren<ConfirmationModalProps>>(
    ({
      title: titleOverride,
      buttonContent,
      onSubmit,
      text,
      children,
    }, ref) => {
      const title = titleOverride ?? text.areYouSure;

      const [inFlight, setInFlight] = useState(false);
      const [error, setError] = useState<JSX.Element | undefined>();

      const modalRef = useRef<ModalHandle>(null);

      useImperativeHandle(ref, () => ({
        open: () => {
          setInFlight(false);
          setError(undefined);
          currentRef(modalRef).open();
        },
        done: () => {
          currentRef(modalRef).close?.();
        },
        reportError: (error: JSX.Element) => {
          setInFlight(false);
          setError(error);
        },
      }));

      const onSubmitWrapper = (event: FormEvent) => {
        event.preventDefault();
        // Don't let the event escape the portal,
        //   which might be sitting inside of other `form` elements.
        event.stopPropagation();
        setInFlight(true);
        setError(undefined);
        onSubmit?.();
      };

      return <Modal
        title={title}
        closable={!inFlight}
        ref={modalRef}
        text={text}
      >
        {children}
        <form onSubmit={onSubmitWrapper} css={{ marginTop: 32 }}>
          <div css={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
            <Button disabled={inFlight} onClick={
              () => currentRef(modalRef).close?.()
            }>
              {text.cancel}
            </Button>
            <Button disabled={inFlight} type="submit" kind="danger" css={{
              whiteSpace: "normal",
            }}>
              {buttonContent}
            </Button>
          </div>
          {inFlight && <div css={{ marginTop: 16 }}><Spinner size={20} /></div>}
        </form>
        {boxError(error)}
      </Modal>;
    },
  );
