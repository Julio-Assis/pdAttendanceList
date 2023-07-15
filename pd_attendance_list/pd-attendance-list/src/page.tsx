// "use client";

import React, { useState } from "react";

import { LocalizationProvider } from "@mui/x-date-pickers";
import en from "date-fns/locale/en-GB";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { css } from "@emotion/css";
import { createStyles } from "./shared/createStyles";
import Typography from "@mui/material/Typography";
import AttendanceForm from "./attendanceForm";
import PaymentsView from "./paymentsView";
import Button from "@mui/material/Button";

export default function Home() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [shouldDisplayPayments, setShouldDisplayPayments] = useState(false);

  return (
    <div
      className={css({
        display: "flex",
        justifyContent: "center",
        justifyItems: "center",
      })}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={en}>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className={css(styles.rootContainer)}>
            <Typography variant="h4" gutterBottom>
              PD Practice Sign Up Form
            </Typography>
            {isFormSubmitted ? (
              <>
                <Typography variant="body1" gutterBottom>
                  Enjoy Practice!
                </Typography>
                <div className={css(styles.formItem)}>
                  <Button
                    onClick={() => setIsFormSubmitted(false)}
                    variant="contained"
                  >
                    New Registration
                  </Button>
                </div>
              </>
            ) : (
              <AttendanceForm
                onSubmit={(isSubmitted) => setIsFormSubmitted(isSubmitted)}
              />
            )}
            {shouldDisplayPayments ? (
              <PaymentsView onClose={() => setShouldDisplayPayments(false)} />
            ) : (
              <div className={css(styles.formItem)}>
                <Button
                  onClick={() => setShouldDisplayPayments(true)}
                  variant="contained"
                >
                  Show Attendees
                </Button>
              </div>
            )}
          </div>
        </main>
      </LocalizationProvider>
    </div>
  );
}

const styles = createStyles({
  rootContainer: {
    display: "flex",
    flexDirection: "column",
  },
  formItem: {
    padding: "4px",
  },
});
