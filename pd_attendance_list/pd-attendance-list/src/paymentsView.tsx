import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { createStyles } from "./shared/createStyles";
import axios from "axios";

interface PaymentsViewProps {
  onClose: () => void;
}

interface Attendee {
  name: string;
  date_year: string;
  date_month: string;
  date_day: string;
  practice_type: string;
}

interface AttendeeWithPayment {
  name: string;
  date_year: string;
  date_month: string;
  date_day: string;
  practice_type: string;
  total_payment: string;
}

const URL_PREFIX =
  "https://c4mn2drui8.execute-api.eu-central-1.amazonaws.com/production/";

export default function PaymentsView({ onClose }: PaymentsViewProps) {
  const [attendees, setAttendees] = useState<Array<AttendeeWithPayment>>([]);

  useEffect(() => {
    axios.get(`${URL_PREFIX}/read`).then((res) => {
      return setAttendees(computeAttendeesWithPayments(res.data));
    });
  }, []);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Year</TableCell>
              <TableCell align="right">Month</TableCell>
              <TableCell align="right">Day</TableCell>
              <TableCell align="right">Amount owed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendees.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.date_year}</TableCell>
                <TableCell align="right">{row.date_month + 1}</TableCell>
                <TableCell align="right">{row.date_day}</TableCell>
                <TableCell align="right">£{row.total_payment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={() => onClose()}>Close Payments View</Button>
    </div>
  );
}

function computeAttendeesWithPayments(
  attendees: Array<Attendee>
): Array<AttendeeWithPayment> {
  const blackPractice = 1;
  const combinedPractice = 2;
  const allPractice = 3;

  const totalUnits = attendees.reduce(
    (accumulator: number, attendee: Attendee) => {
      if (attendee.practice_type === "black_practice") {
        return accumulator + blackPractice;
      } else if (attendee.practice_type === "combined_practice") {
        return accumulator + combinedPractice;
      } else if (attendee.practice_type === "all_practice") {
        return accumulator + allPractice;
      }

      return accumulator + allPractice;
    },
    0
  );

  const studioCost = 67.5;

  return attendees.map((attendee) => {
    let paymentUnits = 0;
    if (attendee.practice_type === "black_practice") {
      paymentUnits = blackPractice;
    } else if (attendee.practice_type === "combined_practice") {
      paymentUnits = combinedPractice;
    } else if (attendee.practice_type === "all_practice") {
      paymentUnits = allPractice;
    }
    return {
      name: attendee.name,
      date_year: attendee.date_year,
      date_month: attendee.date_month,
      date_day: attendee.date_day,
      practice_type: attendee.practice_type,
      total_payment: ((studioCost * paymentUnits) / totalUnits).toPrecision(2),
    };
  });
}

const styles = createStyles({
  formItem: {
    padding: "4px",
  },
});
