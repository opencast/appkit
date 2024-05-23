import {
  ReactNode,
  FormEvent,
  PropsWithChildren,
  forwardRef,
  useState,
  useRef,
  useImperativeHandle,
} from "react";
import { bug, ModalProps, ModalHandle, Modal, Spinner, Button, boxError } from ".";
import { currentRef } from "./utilFunc";


type ConfirmationModalProps = Omit<ModalProps, "closable" | "title"> & {
  title?: string;
  buttonContent: ReactNode;
  onSubmit?: () => void;
  text: {
    generalActionCancel: string,
    generalActionClose: string,
    manageAreYouSure: string,
  },
};

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
      const title = titleOverride ?? text.manageAreYouSure ?? bug("missing translation");

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
        text={{ generalActionClose: text.generalActionClose }}
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
              {text.generalActionCancel}
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
