import { ReactNode } from "react";

import { Card } from ".";

export const ErrorBox: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div css={{ marginTop: 8 }}>
    <Card kind="error">{children}</Card>
  </div>
);

/**
* If the given error is not `null` nor `undefined`, returns an `<ErrorBox>`
* with it as content. Returns `null` otherwise.
*/
export const boxError = (err: ReactNode): JSX.Element | null => (
  err == null ? null : <ErrorBox>{err}</ErrorBox>
);
