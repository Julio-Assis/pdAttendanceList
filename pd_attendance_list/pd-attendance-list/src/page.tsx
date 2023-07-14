// "use client";

import React, { useState, useCallback } from "react";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import en from "date-fns/locale/en-GB";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { css } from "@emotion/css";
import { createStyles } from "./shared/createStyles";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase/FireBaseApp";

export default function Home() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [name, setName] = useState("");
  const [practiceType, setPracticeType] = React.useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPracticeType((event.target as HTMLInputElement).value);
    validateForm(name, event.target.value);
  };

  const validateForm = useCallback((name: string, practiceType: string) => {
    let isFormValid = true;

    if (name.length === 0) {
      isFormValid = false;
    }

    if (practiceType.length === 0) {
      isFormValid = false;
    }

    setCanSubmit(isFormValid);
  }, []);

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
              <Typography variant="body1" gutterBottom>
                Enjoy Practice!
              </Typography>
            ) : (
              <div>
                <div className={css(styles.formItem)}>
                  <TextField
                    id="pd-student-name"
                    label="Name"
                    value={name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setName(event.target.value);
                      validateForm(event.target.value, practiceType);
                    }}
                  />
                </div>
                <div className={css(styles.formItem)}>
                  <DatePicker
                    label="PD Practice Date"
                    value={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      console.log(date);
                    }}
                  />
                </div>
                <FormControl>
                  <div className={css(styles.formItem)}>
                    <FormLabel id="demo-controlled-radio-buttons-group">
                      For which session are you signing up for
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={practiceType}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="black_practice"
                        control={<Radio />}
                        label="45 Minutes - Black Practice"
                      />
                      <FormControlLabel
                        value="combined_practice"
                        control={<Radio />}
                        label="90 minutes - Group Practice"
                      />
                      <FormControlLabel
                        value="all_practice"
                        control={<Radio />}
                        label="135 minutes - Black + Group Practice"
                      />
                    </RadioGroup>
                  </div>
                  <div className={css(styles.formItem)}>
                    <Button
                      onClick={async () => {
                        try {
                          console.log("called this");
                          const docRef = await addDoc(
                            collection(db, "users_v00"),
                            {
                              first: "Ada",
                              last: "Lovelace",
                              born: 1815,
                            }
                          );
                          console.log("Document written with ID: ", docRef.id);
                        } catch (e) {
                          console.error("Error adding document: ", e);
                        }

                        const querySnapshot = await getDocs(
                          collection(db, "users_v00")
                        );
                        querySnapshot.forEach((doc) => {
                          console.log(`${doc.id} => ${doc.data().first}`);
                        });

                        setIsFormSubmitted(true);
                      }}
                      variant="contained"
                      disabled={!canSubmit}
                    >
                      Submit!
                    </Button>
                  </div>
                </FormControl>
              </div>
            )}
          </div>
        </main>
      </LocalizationProvider>
    </div>
  );
}

async function blah() {
  return 0;
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
