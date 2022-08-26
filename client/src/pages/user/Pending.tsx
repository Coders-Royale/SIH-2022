import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useYourPendingDocuments } from "../../queries/hooks";
import { useEmployeeInfo, useAdminInfo } from "../../queries/hooks";

import Sidebar from "../../components/Sidebar";
import Middlebar from "../../components/Middlebar";
import EmailContent from "../../components/EmailContent";
import TimelineComponent from "../../components/TimelineComponent";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SendIcon from "@mui/icons-material/Send";
import Man from "../../images/man.svg";
import GreenTick from "../../images/icons/tracking_page_green_tick.svg";
import Clock from "../../images/icons/tracking_page_clock.svg";
import Email1 from "../../images/tracking_page_email_1.png";
import Email2 from "../../images/tracking_page_email_2.png";
import Email3 from "../../images/tracking_page_email_3.png";
import Dp from "../../images/profile_page_dp.png";

enum Status {
  Pending = "Pending",
  Forwarded = "Forwarded",
  Rejected = "Rejected",
  Approved = "Approved",
}

interface Props {
  selected: number;
  setSelected: (selected: number) => void;
  color: string;
}

const Pending = ({ selected, setSelected, color }: Props) => {
  useEffect(() => {
    setSelected(4);
  }, [setSelected]);

  const [selectedMid, setSelectedMid] = useState<number>(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [additionalMessage, setAdditionalMessage] = useState<string>("");

  const navigate = useNavigate();

  interface Error {
    type: string;
    message: string;
  }
  const [errors, setErrors] = useState<Error[]>([]);

  var errLength = 0;

  const validate = () => {
    errLength = 0;
    setErrors([]);

    if (additionalMessage === "") {
      setErrors((errors: Error[]) => [
        ...errors,
        { type: "additionalMessage", message: "Please enter something!" },
      ]);
      errLength++;
    }

    if (errLength === 0) return true;

    return false;
  };

  const receivedMessages = useYourPendingDocuments({
    employeeId: localStorage.getItem("empId"),
    role: localStorage.getItem("empId")![0] === 'E' ? "employee" : "admin",
  });

  useEffect(() => {
    if (receivedMessages.data) {
      setMessages(receivedMessages.data.data);
    }
    console.log(receivedMessages.data);
  }, [receivedMessages.isSuccess === true]);

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      <div className="w-1/4">
        <Sidebar selected={selected} setSelected={setSelected} color={color} />
      </div>
      <div className="flex flex-row w-full overflow-scroll">
        <div className="w-1/3">
          <Middlebar
            selectedMid={selectedMid}
            setSelectedMid={setSelectedMid}
            displayRooms={messages}
          />
        </div>

        {
          messages.length > 0 && 
          <EmailContent
            selectedMid={selectedMid}
            setSelectedMid={setSelectedMid}
            type="approved"
            emailContent={messages[selectedMid]}
            documentId={messages[selectedMid].documentId}
          />
        }

      </div>
    </div>
  );
};

export default Pending;
