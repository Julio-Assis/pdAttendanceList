"use client";

import React, { useState, useCallback } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import en from "date-fns/locale/en-GB";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { css } from "@emotion/css";
import { createStyles } from "../shared/createStyles";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import Table   from "@mui/material/Table"
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";

import "react-datepicker/dist/react-datepicker.css";

interface PaymentData {
  name: string;
  amount_due: number;
}
function createPaymentRow(
  name: string,
  amount_due: number,
): PaymentData {
  return {
    name,
    amount_due,
  };
}

function createPaymentsTable() {
  const rows = [
    createPaymentRow('Nacho', 42),
    createPaymentRow("Julio", 42),
    createPaymentRow("Anya", 42),
    createPaymentRow("Capella", 42)
  ]

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Amount Due</TableCell>
            <TableCell align="right">Monzo Link</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.amount_due}</TableCell>
              <TableCell align="right">This is a monzo link</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default function Home() {

  const [startDate, setStartDate] = useState<Dayjs>(new Date());
  const [name, setName] = useState("");
  const [practiceType, setPracticeType] = React.useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [showPayments, setShowPayments] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPracticeType((event.target as HTMLInputElement).value);
    validateForm(name, event.target.value);
  };

  const validateForm = useCallback(
    (name: string, practiceType: string) => {
      let isFormValid = true;

      if (name.length === 0) {
        isFormValid = false;
      }

      if (practiceType.length === 0) {
        isFormValid = false;
      }

      setCanSubmit(isFormValid);
    },
    [startDate, name, practiceType]
  );

  let body, form;

  // Ideally this would be handled by a view/navigation
  // but this is just a hacky start.
  if (showPayments){
    const paymentsTable = createPaymentsTable()
    body = (
      <div className={css(styles.body)}>
        <div className={css(styles.element)}>

          <Typography variant="h5" gutterBottom>
            {paymentsTable}
          </Typography>
          </div>
        <div className={css(styles.element)}>
          <Button
            onClick={() => {
            alert("clicked");
            setShowPayments(false);
            setIsFormSubmitted(false);
          }}
          variant="contained"
        >
          Back to Form
        </Button>
        </div>
      </div>
    )
  }else{
    form = isFormSubmitted ? (
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
              onClick={() => {
                alert("clicked");
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
    )

    body = (
      <div className={css(styles.body)}>
        <div className={css(styles.element)}>
          {form}
        </div>
        <div className={css(styles.element)}>
          <Button
            onClick={() => {
            alert("clicked");
            setShowPayments(true);
            }}
            variant="contained"
          >
            Check payment dues!
          </Button>
        </div>
      </div>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={en}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className={css(styles.rootContainer)}>
            <Typography variant="h4" gutterBottom>
              PD Practice Sign Up Form
            </Typography>
          <div className={css(styles.body)}>
            {body}
          </div>

        </div>
      </main>
    </LocalizationProvider>
  );
}

const styles = createStyles({
  rootContainer: {
    display: "flex",
    flexDirection: "column",
  },

  body: {
    display: "flex",
    flexDirection: "row",
  },
  element: {
    display: "flex",
    flexDirection: "column",
  },
  formItem: {
    padding: "4px",
  },
});
