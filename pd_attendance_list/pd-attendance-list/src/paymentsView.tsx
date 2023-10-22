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
  startDate: Date;
  isAdmin: boolean;
}

interface Attendee {
  id: string;
  name: string;
  date_year: string;
  date_month: string;
  date_day: string;
  practice_type: string;
}

interface AttendeeWithPayment {
  id: string;
  name: string;
  date_year: string;
  date_month: string;
  date_day: string;
  practice_type: string;
  total_payment: string;
}

const URL_PREFIX = 'http://localhost:8000';
// const URL_PREFIX =
//   "https://c4mn2drui8.execute-api.eu-central-1.amazonaws.com/production/";

export default function PaymentsView({ onClose, startDate, isAdmin }: PaymentsViewProps) {
  const [attendees, setAttendees] = useState<Array<AttendeeWithPayment>>([]);

  useEffect(() => {
    axios.get(`${URL_PREFIX}/read?year=${startDate.getFullYear()}&month=${startDate.getMonth()}&day=${startDate.getDate()}`).then((res) => {
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
              {isAdmin && <TableCell align="right">Delete Entry</TableCell>}
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
                {isAdmin && <TableCell align="right">
                  <Button onClick={() => {
                    try {
                      axios.post(`${URL_PREFIX}/deleteAttendee`,
                        {
                          id: row.id,
                          day: row.date_day,
                          month: row.date_month,
                          year: row.date_year
                        },
                        {
                          headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                          },
                        }).then((res) => {
                          console.log('calling this');
                          console.log(res.data);
                          return setAttendees(computeAttendeesWithPayments(res.data));
                        });
                    } catch (e) {
                      console.error("Error deleting document: ", e);
                    }

                  }}
                    variant='contained'
                  >Delete Entry</Button>
                </TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={() => onClose()}>Close Payments View</Button>
    </div >
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

  const studioCost = 69.5;

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
      id: attendee.id,
      name: attendee.name,
      date_year: attendee.date_year,
      date_month: attendee.date_month,
      date_day: attendee.date_day,
      practice_type: attendee.practice_type,
      total_payment: ((studioCost * paymentUnits) / totalUnits).toPrecision(2),
    };
  }).sort(
    (attendeeA, attendeeB) => {
      return attendeeA.name.toLowerCase() < attendeeB.name.toLowerCase() ? -1 : 1;
    }
  );
}

const styles = createStyles({
  formItem: {
    padding: "4px",
  },
});
