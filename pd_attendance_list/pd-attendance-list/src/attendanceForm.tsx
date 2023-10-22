import React, { useCallback, useState } from "react";
import TextField from "@mui/material/TextField";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import axios from "axios";

import { css } from "@emotion/css";
import { createStyles } from "./shared/createStyles";

interface AttendanceFormProps {
  onSubmit: (isSubmitted: boolean) => void;
  startDate: Date;
  setStartDate: (d: Date) => void;
}

const URL_PREFIX = 'http://localhost:8000';
// const URL_PREFIX =
//   "https://c4mn2drui8.execute-api.eu-central-1.amazonaws.com/production/";

export default function AttendanceForm({ onSubmit, startDate, setStartDate }: AttendanceFormProps) {
  const [name, setName] = useState("");
  const [practiceType, setPracticeType] = React.useState("");
  const [canSubmit, setCanSubmit] = useState(false);


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
            if (date !== null) {
              setStartDate(date);
            }

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
              if (name === "super-admin") {
                onSubmit(false);
                return;
              }

              try {
                onSubmit(true);
                await axios.post(
                  `${URL_PREFIX}/registerAttendee`,
                  {
                    name: name,
                    date_day: startDate.getDate(),
                    date_month: startDate.getMonth(),
                    date_year: startDate.getFullYear(),
                    practice_type: practiceType,
                  },
                  {
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                  }
                );
              } catch (e) {
                console.error("Error adding document: ", e);
              }
            }}
            variant="contained"
            disabled={!canSubmit}
          >
            Submit!
          </Button>
        </div>
      </FormControl>
    </div>
  );
}

const styles = createStyles({
  formItem: {
    padding: "4px",
  },
});
